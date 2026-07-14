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
        const roleUrl = "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn";
        
        const cookieStr = typeof cookie === 'string' ? cookie : '';
        const headers = {
            'Cookie': cookieStr,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Referer': 'https://bbs.miyoushe.com/'
        };

        const [response, roleResponse] = await Promise.all([
            fetch(url, { method: 'GET', headers }),
            fetch(roleUrl, { method: 'GET', headers })
        ]);

        const data = await response.json();
        let roleData = {};
        try { roleData = await roleResponse.json(); } catch(e) {}

        if (data.retcode === 0) {
            const userInfo = data.data?.user_info;
            let gameUid = null;
            if (roleData.retcode === 0 && roleData.data?.list?.length > 0) {
                gameUid = roleData.data.list[0].game_uid;
            }

            if (userInfo) {
                return res.status(200).json({
                    success: true,
                    data: {
                        nickname: userInfo.nickname,
                        avatar_url: userInfo.avatar_url,
                        uid: userInfo.uid, // Miyoushe UID
                        game_uid: gameUid, // Genshin Impact UID
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
