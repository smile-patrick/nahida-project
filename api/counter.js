export default async function handler(req, res) {
    const { action } = req.query; // 'up' or 'get'
    const namespace = 'wintool_nahida_stats';
    
    // Calculate dates in UTC+8 to match user's timezone exactly
    const now = new Date();
    const utc8Offset = 8 * 60 * 60 * 1000;
    const today = new Date(now.getTime() + utc8Offset);
    const yest = new Date(now.getTime() + utc8Offset - 86400000);
    
    const dateToday = today.toISOString().split('T')[0];
    const dateYest = yest.toISOString().split('T')[0];

    try {
        if (action === 'up') {
            // Increment total and today in background
            await Promise.all([
                fetch(`https://api.counterapi.dev/v1/${namespace}/total/up`),
                fetch(`https://api.counterapi.dev/v1/${namespace}/today_${dateToday}/up`)
            ]);
            return res.status(200).json({ success: true });
        } else {
            // Get stats
            const [resTotal, resToday, resYest] = await Promise.all([
                fetch(`https://api.counterapi.dev/v1/${namespace}/total`),
                fetch(`https://api.counterapi.dev/v1/${namespace}/today_${dateToday}`),
                fetch(`https://api.counterapi.dev/v1/${namespace}/today_${dateYest}`)
            ]);

            const totalData = resTotal.ok ? await resTotal.json() : { count: 0 };
            const todayData = resToday.ok ? await resToday.json() : { count: 0 };
            const yestData = resYest.ok ? await resYest.json() : { count: 0 };

            return res.status(200).json({
                total: totalData.count || 0,
                today: todayData.count || 0,
                yesterday: yestData.count || 0
            });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
