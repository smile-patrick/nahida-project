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
        const { ticket, device } = req.body;
        if (!ticket || !device) {
            return res.status(400).json({ success: false, message: 'Missing ticket or device' });
        }
        
        let parsedDevice;
        try {
            parsedDevice = JSON.parse(device);
        } catch (e) {
            return res.status(400).json({ success: false, message: 'Invalid device format' });
        }

        const url = "https://passport-api.mihoyo.com/account/ma-cn-passport/app/queryQRLoginStatus";
        
        const body = { ticket: ticket };
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
                gt: data.data?.gt || data.data?.risk_info?.gt,
                challenge: data.data?.challenge || data.data?.risk_info?.challenge
            });
        }

        if (data.retcode === 0 && data.data) {
            const status = data.data.status; // "Created", "Scanned", "Confirmed"
            if (status === 'Confirmed') {
                let uid = '';
                let mid = '';
                let cookieToken = '';
                let stoken = '';
                let ltoken = '';
                
                const tokens = data.data.tokens || [];
                for (const t of tokens) {
                    if (t.token_type === 1) cookieToken = t.token;
                    if (t.token_type === 2) stoken = t.token;
                    if (t.token_type === 3) ltoken = t.token;
                }
                
                if (!stoken && tokens.length > 0) {
                    stoken = tokens[0].token;
                }

                let dbg = { rawData: data.data };
                
                const userInfo = data.data.user_info || {};
                uid = userInfo.aid || uid;
                mid = userInfo.mid || mid;

                return res.status(200).json({ 
                    success: true, 
                    stat: status,
                    uid: uid,
                    mid: mid,
                    cookie_token: cookieToken,
                    stoken: stoken,
                    ltoken: ltoken,
                    raw: data.data,
                    dbg: dbg
                });
            } else {
                return res.status(200).json({ success: true, stat: status });
            }
        } else {
            return res.status(400).json({ success: false, message: data.message || `API错误: ${data.retcode}` });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: `请求异常: ${error.message}` });
    }
}
