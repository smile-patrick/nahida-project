import crypto from 'crypto';

function generateRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateDS(body) {
    const salt = "yBh10ikxtLPoIhgwgPZSv5dmfaOTSJ6a";
    const t = Math.floor(Date.now() / 1000).toString();
    const r = generateRandomString(6);
    const b = body ? JSON.stringify(body) : "";
    const q = "";
    const signStr = `salt=${salt}&t=${t}&r=${r}&b=${b}&q=${q}`;
    const sign = crypto.createHash('md5').update(signStr).digest('hex');
    return `${t},${r},${sign}`;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const device_id = crypto.randomUUID().toUpperCase();
        const device_fp = '38d' + crypto.randomBytes(5).toString('hex').toLowerCase();
        const deviceObj = { id: device_id, fp: device_fp };
        
        let parsedDevice;
        if (req.body?.device && req.body.device.startsWith('{')) {
            parsedDevice = JSON.parse(req.body.device);
        } else {
            parsedDevice = deviceObj;
        }
        
        const url = "https://passport-api.mihoyo.com/account/ma-cn-passport/app/createQRLogin";
        
        const body = {};
        const ds = generateDS(body);
        
        const headers = {
            'User-Agent': 'Mozilla/5.0 miHoYoBBS/2.102.1 Capture/1.0.0',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-rpc-device_id': parsedDevice.id,
            'x-rpc-device_fp': parsedDevice.fp,
            'x-rpc-app_id': 'ddxf5dufpuyo',
            'x-rpc-client_type': '3',
            'x-rpc-device_name': 'NahidaKit',
            'x-rpc-device_model': 'pc',
            'ds': ds,
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        const data = await response.json();
        
        if (data.retcode === -3101 || (data.data && data.data.risk_code === 315)) {
            return res.status(200).json({
                success: false,
                is_risk: true,
                device: JSON.stringify(parsedDevice),
                gt: data.data?.gt || data.data?.risk_info?.gt,
                challenge: data.data?.challenge || data.data?.risk_info?.challenge
            });
        }

        if (data.retcode === 0 && data.data) {
            return res.status(200).json({ 
                success: true, 
                ticket: data.data.ticket,
                url: data.data.url,
                device: JSON.stringify(parsedDevice)
            });
        } else {
            return res.status(400).json({ success: false, message: data.message || `API错误: ${data.retcode}` });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: `请求异常: ${error.message}` });
    }
}
