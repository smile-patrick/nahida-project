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

    const { uid, server, cookie } = req.body;

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

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: bodyStr
        });

        const data = await response.json();

        if (data.retcode === 0) {
            return res.status(200).json({ success: true, data: data.data });
        } else {
            return res.status(400).json({ success: false, message: data.message || `API错误: ${data.retcode}` });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: `请求异常: ${error.message}` });
    }
}
