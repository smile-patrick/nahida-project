const { buildApiCookie } = require('./utils');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { cookie } = req.body;

    if (!cookie) {
        return res.status(400).json({ success: false, message: '缺少 Cookie' });
    }

    try {
        const url = "https://bbs-api.miyoushe.com/user/wapi/getUserFullInfo?gids=2";
        
        // Pass the raw cookie string since buildApiCookie usually filters it, but for Miyoushe BBS API,
        // we might need cookie_token, account_id, etc. Let's just use the raw cookie if possible, or parsed.
        // Actually, bbs-api requires standard cookies. We'll use the provided cookie directly.
        const cookieStr = typeof cookie === 'string' ? cookie : '';

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Cookie': cookieStr,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                'Referer': 'https://bbs.miyoushe.com/'
            }
        });

        const data = await response.json();

        if (data.retcode === 0) {
            const userInfo = data.data?.user_info;
            if (userInfo) {
                return res.status(200).json({
                    success: true,
                    data: {
                        nickname: userInfo.nickname,
                        avatar_url: userInfo.avatar_url,
                        uid: userInfo.uid,
                        introduce: userInfo.introduce
                    }
                });
            }
            return res.status(400).json({ success: false, message: '无法解析用户信息' });
        } else {
            return res.status(400).json({ success: false, message: data.message || `API错误: ${data.retcode}` });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: `请求异常: ${error.message}` });
    }
}
