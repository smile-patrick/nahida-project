const { getDS, getHeaders, buildApiCookie } = require('./utils');

export default async function handler(req, res) {
    // Enable CORS for development and general usage
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { uid, server, cookie, geetest_challenge, geetest_validate, geetest_seccode } = req.body;

    if (!uid || !cookie) {
        return res.status(400).json({ success: false, message: '缺少 UID 或 Cookie' });
    }

    try {
        const url = "https://api-takumi-record.mihoyo.com/game_record/app/genshin/api/character/list";
        const bodyDict = { role_id: String(uid), server: server || "cn_gf01", sort_type: 0 };
        const bodyStr = JSON.stringify(bodyDict);
        
        const cookieStr = buildApiCookie(cookie);
        const ds = getDS(bodyStr, "");
        const headers = getHeaders(cookieStr, ds);

        // Add Geetest headers if present
        if (geetest_challenge) headers["x-rpc-challenge"] = geetest_challenge;
        if (geetest_validate) headers["x-rpc-validate"] = geetest_validate;
        if (geetest_seccode) headers["x-rpc-seccode"] = geetest_seccode;

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: bodyStr
        });

        const data = await response.json();

        // Handle risk control (Geetest)
        if (data.retcode === 1034 || data.retcode === -3101 || (data.data && data.data.risk_code === 315)) {
            let gt = data.data?.gt || data.data?.risk_info?.gt;
            let challenge = data.data?.challenge || data.data?.risk_info?.challenge;

            // If missing, fetch from createVerification
            if (!gt || !challenge) {
                try {
                    const verifyUrl = "https://api-takumi-record.mihoyo.com/game_record/app/card/wapi/createVerification?is_high=true";
                    const verifyResponse = await fetch(verifyUrl, { method: 'GET', headers: headers });
                    const verifyData = await verifyResponse.json();
                    if (verifyData.retcode === 0 && verifyData.data) {
                        gt = verifyData.data.gt;
                        challenge = verifyData.data.challenge;
                    }
                } catch (e) {
                    console.error("Fetch verification failed", e);
                }
            }

            return res.status(200).json({
                success: false,
                is_risk: true,
                gt: gt,
                challenge: challenge
            });
        }

        if (data.retcode === 0) {
            return res.status(200).json({ success: true, data: data.data });
        } else {
            return res.status(400).json({ success: false, message: data.message || `API错误: ${data.retcode}` });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: `请求异常: ${error.message}` });
    }
}
