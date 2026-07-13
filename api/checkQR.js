export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { ticket, device } = req.body;
        if (!ticket || !device) {
            return res.status(400).json({ success: false, message: 'Missing ticket or device' });
        }

        const url = "https://passport-api.mihoyo.com/account/ma-cn-passport/app/queryQRLoginStatus";
        
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
                device: device,
                ticket: ticket
            })
        });

        const data = await response.json();

        if (data.retcode === -3101 || (data.data && data.data.risk_code === 315)) {
            return res.status(200).json({
                success: false,
                is_risk: true,
                gt: data.data?.gt || data.data?.risk_info?.gt,
                challenge: data.data?.challenge || data.data?.risk_info?.challenge
            });
        }

        if (data.retcode === 0 && data.data) {
            const stat = data.data.stat; // "Init", "Scanned", "Confirmed"
            if (stat === 'Confirmed' && data.data.payload) {
                const payload = data.data.payload;
                // Generate a generic API cookie from payload
                // The actual payload returns raw unparsed data, but usually it contains a token structure or something similar
                // We need to parse raw to cookie
                return res.status(200).json({ 
                    success: true, 
                    stat: stat,
                    raw: payload,
                    uid: payload.uid,
                    token: payload.token
                });
            } else {
                return res.status(200).json({ success: true, stat: stat });
            }
        } else {
            return res.status(400).json({ success: false, message: data.message || `API错误: ${data.retcode}` });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: `请求异常: ${error.message}` });
    }
}
