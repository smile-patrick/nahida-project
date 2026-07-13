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

        const url = "https://passport-api.mihoyo.com/account/ma-cn-passport/web/queryQRLoginStatus";
        
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
            const status = data.data.status; // "Created", "Scanned", "Confirmed"
            if (status === 'Confirmed') {
                let uid = '';
                let mid = '';
                let cookieToken = '';
                let stoken = '';
                let ltoken = '';
                
                // Fallback: If it returns tokens array directly
                const tokens = data.data.tokens || [];
                for (const t of tokens) {
                    if (t.token_type === 1) cookieToken = t.token;
                    if (t.token_type === 2) stoken = t.token;
                    if (t.token_type === 3) ltoken = t.token;
                }

                let dbg = { rawData: data.data };
                // If it returns payload (web login login_ticket)
                if (data.data.payload && data.data.payload.raw) {
                    try {
                        const rawPayload = JSON.parse(data.data.payload.raw);
                        uid = rawPayload.uid || uid;
                        const loginTicket = rawPayload.token; // This is the login_ticket
                        
                        // Exchange login_ticket for stoken and ltoken
                        const multiTokenUrl = `https://api-takumi.mihoyo.com/auth/api/getMultiTokenByLoginTicket?login_ticket=${loginTicket}&token_types=3&uid=${uid}`;
                        const multiRes = await fetch(multiTokenUrl);
                        const multiData = await multiRes.json();
                        dbg.multiData = multiData;
                        
                        if (multiData.retcode === 0 && multiData.data && multiData.data.list) {
                            for (const item of multiData.data.list) {
                                if (item.name === 'stoken') stoken = item.token;
                                if (item.name === 'ltoken') ltoken = item.token;
                            }
                        }
                    } catch (e) {
                        console.error('Exchange failed:', e);
                        dbg.error = e.message;
                    }
                } else {
                    const userInfo = data.data.user_info || {};
                    uid = userInfo.aid || uid;
                    mid = userInfo.mid || mid;
                }

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
