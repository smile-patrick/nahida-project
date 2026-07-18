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

    const { uid, server, cookie, character_id, geetest_challenge, geetest_validate, geetest_seccode } = req.body;

    if (!uid || !cookie || !character_id) {
        return res.status(400).json({ success: false, message: '缺少 UID、Cookie 或 character_id' });
    }

    try {
        const url = "https://api-takumi-record.mihoyo.com/game_record/app/genshin/api/character/detail";
        const bodyDict = { role_id: String(uid), server: server || "cn_gf01", character_ids: [String(character_id)] };
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
        if (data.retcode === -3101 || (data.data && data.data.risk_code === 315)) {
            return res.status(200).json({
                success: false,
                is_risk: true,
                gt: data.data?.gt || data.data?.risk_info?.gt,
                challenge: data.data?.challenge || data.data?.risk_info?.challenge
            });
        }

        if (data.retcode === 1034) {
            const verifyUrl = "https://api-takumi-record.mihoyo.com/game_record/app/card/wapi/createVerification?is_high=true";
            const verifyDs = getDS("", { is_high: "true" });
            const verifyHeaders = getHeaders(cookieStr, verifyDs);
            
            verifyHeaders["x-rpc-challenge_game"] = "2";
            verifyHeaders["x-rpc-challenge_path"] = "https://api-takumi-record.mihoyo.com/game_record/app/genshin/api/character/detail";
            
            const verifyResp = await fetch(verifyUrl, {
                method: 'GET',
                headers: verifyHeaders
            });
            const verifyData = await verifyResp.json();

            if (verifyData.retcode === 0 && verifyData.data) {
                return res.status(200).json({
                    success: false,
                    is_risk: true,
                    gt: verifyData.data.gt,
                    challenge: verifyData.data.challenge
                });
            } else {
                return res.status(400).json({ success: false, message: `1034风控，且无法获取验证码: ${verifyData.message || verifyData.retcode}` });
            }
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
