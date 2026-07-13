import crypto from 'crypto';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const device = req.body?.device || crypto.randomUUID();
        const url = "https://passport-api.mihoyo.com/account/ma-cn-passport/app/createQRLogin";
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-rpc-app_version': '2.40.1',
                'x-rpc-client_type': '4',
                'x-rpc-app_id': 'bll8iq97cem8',
                'x-rpc-device_id': device
            },
            body: JSON.stringify({
                app_id: "4",
                device: device
            })
        });

        const data = await response.json();
        
        // Handle risk control (Geetest)
        if (data.retcode === -3101 || (data.data && data.data.risk_code === 315)) {
            // Geetest triggered
            return res.status(200).json({
                success: false,
                is_risk: true,
                device: device,
                gt: data.data?.gt || data.data?.risk_info?.gt,
                challenge: data.data?.challenge || data.data?.risk_info?.challenge
            });
        }

        if (data.retcode === 0 && data.data) {
            return res.status(200).json({ 
                success: true, 
                ticket: data.data.ticket,
                url: data.data.url,
                device: device
            });
        } else {
            return res.status(400).json({ success: false, message: data.message || `API错误: ${data.retcode}` });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: `请求异常: ${error.message}` });
    }
}
