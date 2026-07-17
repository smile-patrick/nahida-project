// JavaScript Logic - Nahida Akasha Terminal Dashboard

document.addEventListener('DOMContentLoaded', () => {
    initLeafParticles();
    initClock();
    initWeather();
    initMindReader();
    initInteractiveQuotes();
    initSumeruSynth();
    initFortune();
    initParticleInteraction();
    initParallax();
    initDreamMode();
    initCompanionPet();
    initAkashaQuiz();
});

// Utility: Smoothly replace innerHTML with cross-fade and height transition
window.smoothReplaceHTML = function(element, newHTML, duration = 300, callback = null) {
    if (!element) return;
    
    // Using Web Animations API for guaranteed robust fading
    const fadeOut = element.animate([
        { opacity: element.style.opacity || 1 },
        { opacity: 0 }
    ], {
        duration: duration,
        easing: 'ease-in-out',
        fill: 'forwards'
    });
    
    fadeOut.onfinish = () => {
        element.innerHTML = newHTML;
        const fadeIn = element.animate([
            { opacity: 0 },
            { opacity: 1 }
        ], {
            duration: duration,
            easing: 'ease-in-out',
            fill: 'forwards'
        });
        
        fadeIn.onfinish = () => {
            element.style.opacity = '1';
            if (typeof callback === "function") {
                callback();
            }
        };
    };
};

/* ==========================================================================
   1. AMBIENT LEAF PARTICLES GENERATOR
   ========================================================================== */
function initLeafParticles() {
    const container = document.getElementById('leafContainer');
    if (!container) return;

    const leafCount = 15;
    const maxLeaves = 25;

    for (let i = 0; i < leafCount; i++) {
        createLeaf(container, true);
    }

    // Periodically spawn new leaves
    setInterval(() => {
        if (container.children.length < maxLeaves) {
            createLeaf(container, false);
        }
    }, 4000);
}

function createLeaf(container, isInitial) {
    const leaf = document.createElement('div');
    leaf.classList.add('leaf-particle');
    
    // Random positioning and dimensions
    const size = Math.random() * 14 + 8; // 8px to 22px
    leaf.style.width = `${size}px`;
    leaf.style.height = `${size}px`;
    
    leaf.style.left = `${Math.random() * 100}vw`;
    
    const duration = Math.random() * 12 + 10; // 10s to 22s
    leaf.style.animationDuration = `${duration}s`;
    
    const delay = isInitial ? -(Math.random() * duration) : 0;
    leaf.style.animationDelay = `${delay}s`;
    
    // Vary opacity and rotation
    leaf.style.opacity = Math.random() * 0.4 + 0.3;
    
    // Randomize leaf shape slightly via border radius
    const shapeType = Math.floor(Math.random() * 3);
    if (shapeType === 0) {
        leaf.style.borderRadius = '50% 0 50% 0'; // standard leaf
    } else if (shapeType === 1) {
        leaf.style.borderRadius = '80% 0 55% 10%';
    } else {
        leaf.style.borderRadius = '50% 10% 50% 10%';
    }

    container.appendChild(leaf);

    // Remove particle after animation ends
    setTimeout(() => {
        leaf.remove();
    }, (duration + (isInitial ? 0 : 0)) * 1000);
}

/* ==========================================================================
   2. CLOCK & 2026 YEAR PROGRESS
   ========================================================================== */
function initClock() {
    const timeMain = document.getElementById('timeMain');
    const timeMs = document.getElementById('timeMs');
    const dateText = document.getElementById('dateText');
    const dayOfWeek = document.getElementById('dayOfWeek');
    
    const yearPercent = document.getElementById('yearPercent');
    const yearProgressBar = document.getElementById('yearProgressBar');

    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    // Year parameters for 2026
    const year = 2026;
    const yearStart = new Date(year, 0, 1).getTime();
    const yearEnd = new Date(year + 1, 0, 1).getTime();
    const yearTotalMs = yearEnd - yearStart;

    function updateTime() {
        const now = new Date();
        
        // Formatted Time (HH:MM:SS)
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        
        timeMain.textContent = `${hrs}:${mins}:${secs}`;
        
        // Milliseconds
        const ms = String(now.getMilliseconds()).padStart(3, '0');
        timeMs.textContent = `.${ms}`;

        // Date Display
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        
        dateText.textContent = `${y}年${m}月${d}日`;
        dayOfWeek.textContent = weekDays[now.getDay()];

        // Calculate Year Progress
        const currentMs = now.getTime();
        let progressPercent = 0;

        if (currentMs < yearStart) {
            progressPercent = 0;
        } else if (currentMs >= yearEnd) {
            progressPercent = 100;
        } else {
            progressPercent = ((currentMs - yearStart) / yearTotalMs) * 100;
        }

        // Render percentage with high precision
        yearPercent.textContent = `${progressPercent.toFixed(7)}%`;
        yearProgressBar.style.width = `${progressPercent}%`;

        requestAnimationFrame(updateTime);
    }

    requestAnimationFrame(updateTime);
}

/* ==========================================================================
   3. SUMERU WEATHER STATION
   ========================================================================== */
function initWeather() {
    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchWeatherBtn');
    const display = document.getElementById('weatherDisplay');

    // Weather code description maps + Nahida thematic voice line tips
    const weatherMapping = {
        clear: {
            title: '晴朗空旷',
            icon: 'fa-regular fa-sun',
            tip: '“天气真好，要和我去外面散散步，数一数掉落的树叶吗？”'
        },
        cloudy: {
            title: '绿野多云',
            icon: 'fa-solid fa-cloud-sun',
            tip: '“云朵遮住了阳光，就像是大脑里藏起来的一点点小秘密呢。”'
        },
        overcast: {
            title: '层云阴郁',
            icon: 'fa-solid fa-cloud',
            tip: '“天空换上了灰色的斗篷，但智慧的明灯会照亮前行的路。”'
        },
        foggy: {
            title: '迷雾林间',
            icon: 'fa-solid fa-smog',
            tip: '“起雾了……别担心，虚空终端会为你寻找最安全的归途。”'
        },
        drizzle: {
            title: '细雨微风',
            icon: 'fa-solid fa-cloud-rain',
            tip: '“微微的小雨，是在帮小草洗脸哦。我们听一听雨的声音吧。”'
        },
        rainy: {
            title: '须弥大雨',
            icon: 'fa-solid fa-cloud-showers-heavy',
            tip: '“雨水能洗净林间的尘埃。不过，记得撑好伞，别着凉了呀。”'
        },
        snowy: {
            title: '瑞雪纷飞',
            icon: 'fa-regular fa-snowflake',
            tip: '“雪花冰冰凉凉的，把大地装扮成了亮晶晶的梦境，真美啊。”'
        },
        thunder: {
            title: '雷雨大作',
            icon: 'fa-solid fa-cloud-bolt',
            tip: '“雷声有些喧闹……不用害怕，握紧我的手，我和你在一起。”'
        }
    };

    function getCodeMeta(code) {
        // WMO weather code mapping rules
        if (code === 0) return weatherMapping.clear;
        if (code === 1 || code === 2) return weatherMapping.cloudy;
        if (code === 3) return weatherMapping.overcast;
        if (code === 45 || code === 48) return weatherMapping.foggy;
        if (code >= 51 && code <= 55) return weatherMapping.drizzle;
        if ((code >= 61 && code <= 65) || (code >= 80 && code <= 82)) return weatherMapping.rainy;
        if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return weatherMapping.snowy;
        if (code >= 95) return weatherMapping.thunder;
        return weatherMapping.cloudy; // Fallback
    }

    async function fetchWeather(cityName) {
        await new Promise(r => window.smoothReplaceHTML(display, '<div class="weather-loading"><i class="fa-solid akasha-spinner akasha-spin"></i> 读取中...</div>', 200, r));
        
        try {
            // Step 1: Geocoding API to resolve City name to Lat/Lon
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=zh`;
            const geoRes = await fetch(geoUrl);
            const geoData = await geoRes.json();
            
            if (!geoData.results || geoData.results.length === 0) {
                window.smoothReplaceHTML(display, `<div class="weather-loading" style="color: #F87171;"><i class="fa-solid fa-triangle-exclamation"></i> 未找到城市：${cityName}</div>`);
                return;
            }

            const city = geoData.results[0];
            const lat = city.latitude;
            const lon = city.longitude;
            const displayName = city.name + (city.admin1 ? ` (${city.admin1})` : '');
            
            // Auto-correct the input field to the localized Chinese name (e.g. 'Beijing' -> '北京')
            if (cityInput) {
                cityInput.value = city.name;
            }

            // Step 2: Forecast API to fetch current weather details
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&relative_humidity_2m=true&timezone=auto`;
            const weatherRes = await fetch(weatherUrl);
            const weatherData = await weatherRes.json();
            
            if (!weatherData.current_weather) {
                window.smoothReplaceHTML(display, `<div class="weather-loading" style="color: #F87171;"><i class="fa-solid fa-triangle-exclamation"></i> 天气数据解析失败</div>`);
                return;
            }

            const current = weatherData.current_weather;
            const temp = Math.round(current.temperature);
            const wCode = current.weathercode;
            const meta = getCodeMeta(wCode);
            const wind = current.windspeed;
            
            // Format output HTML
            window.smoothReplaceHTML(display, `
                <div class="weather-info animate-fade-in">
                    <div class="weather-main-row">
                        <div class="weather-city-status">
                            <span class="weather-city">${displayName}</span>
                            <span class="weather-desc">${meta.title}</span>
                        </div>
                        <div class="weather-temp-icon">
                            <span class="weather-temp">${temp}°C</span>
                            <div class="weather-icon-box">
                                <i class="${meta.icon}"></i>
                            </div>
                        </div>
                    </div>
                    <div class="weather-details">
                        <div class="detail-item">
                            <span>风速</span>
                            <span>${wind} km/h</span>
                        </div>
                        <div class="detail-item">
                            <span>纬度</span>
                            <span>${lat.toFixed(2)}°N</span>
                        </div>
                        <div class="detail-item">
                            <span>经度</span>
                            <span>${lon.toFixed(2)}°E</span>
                        </div>
                        <div class="detail-item">
                            <span>网络状态</span>
                            <span>稳定</span>
                        </div>
                    </div>
                    <div class="nahida-weather-tip">
                        ${meta.tip}
                    </div>
                </div>
            `);

        } catch (error) {
            console.error('Weather Fetch Error:', error);
            window.smoothReplaceHTML(display, `<div class="weather-loading" style="color: #F87171;"><i class="fa-solid fa-triangle-exclamation"></i> 连接气象卫星超时</div>`);
        }
    }

    // Trigger on Search button click
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
            playSynthSound(440, 'sine', 0.1); // play brief feedback tone
        }
    });

    // Trigger on Enter key in input field
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) {
                fetchWeather(city);
                playSynthSound(440, 'sine', 0.1);
            }
        }
    });

    // Auto locate via IP
    async function autoLocate() {
        try {
            const res = await fetch('https://whois.pconline.com.cn/ipJson.jsp?json=true');
            if (res.ok) {
                const buffer = await res.arrayBuffer();
                const decoder = new TextDecoder('gbk');
                const text = decoder.decode(buffer);
                const data = JSON.parse(text);
                if (data.city) {
                    let cityName = data.city;
                    if (cityName.endsWith('市')) {
                        cityName = cityName.replace('市', '');
                    }
                    fetchWeather(cityName);
                    return;
                }
            }
        } catch (error) {
            console.log('IP Location failed, using default', error);
        }
        // Fallback to Shenzhen if detection fails
        const fallbackCity = '深圳';
        fetchWeather(fallbackCity);
    }

    // Initialize with auto location
    autoLocate();
}

/* ==========================================================================
   4. INTERACTIVE MIND READER ("所闻悉所见")
   ========================================================================== */
function initMindReader() {
    const startScanBtn = document.getElementById('startScanBtn');
    const scanTarget = document.getElementById('scanTarget');
    const targetIcon = document.getElementById('targetIcon');
    const targetName = document.getElementById('targetName');
    const thoughtBubble = document.getElementById('thoughtBubble');
    const thoughtText = document.getElementById('thoughtText');
    const targetAvatar = document.getElementById('targetAvatar');
    const dendroLock = document.getElementById('dendroLock');
    
    // Array of Sumeru characters, their official avatar URLs, and their inner dialogues
    const characters = [
        {
            name: '艾尔海森 (Alhaitham)',
            avatar: 'https://enka.network/ui/UI_AvatarIcon_Alhatham.png',
            thoughts: '“（正在阅读一本关于音标演变的古籍）卡维今天又在念叨赤沙石板的维护费。真吵……等会儿把耳机降噪拉高点好了。”'
        },
        {
            name: '卡维 (Kaveh)',
            avatar: 'https://enka.network/ui/UI_AvatarIcon_Kaveh.png',
            thoughts: '“可恶的艾尔海森！为什么总是能面无表情地说出刺痛设计师心灵的话！还有，下个月的租金……完了，我设计的木屋项目怎么超支了这么多！”'
        },
        {
            name: '妮露 (Nilou)',
            avatar: 'https://enka.network/ui/UI_AvatarIcon_Nilou.png',
            thoughts: '“下一次祖拜尔剧场的舞步，如果加入一些帕蒂沙兰的花瓣雨，效果会不会更好呢？要是纳西妲大人能坐在观众席上看着我，那我一定会超常发挥的！”'
        },
        {
            name: '赛诺 (Cyno)',
            avatar: 'https://enka.network/ui/UI_AvatarIcon_Cyno.png',
            thoughts: '“我新想到了一个冷笑话：有一只驮兽走着走着被绊倒了，原来它是‘驼’（脱）单了。哈哈……为什么七圣召唤的牌友听完都面无表情？”'
        },
        {
            name: '流浪者 (Wanderer)',
            avatar: 'https://enka.network/ui/UI_AvatarIcon_Wanderer.png',
            thoughts: '“哼，无聊的虚空。你想知道我在想什么？……哈，劝你别多管闲事，我只是在想今天吹过须弥大巴扎的风，略显喧嚣罢了。”'
        },
        {
            name: '提纳里 (Tighnari)',
            avatar: 'https://enka.network/ui/UI_AvatarIcon_Tighnari.png',
            thoughts: '“柯莱今天的功课做得很认真。不过，昨天在道成林里又发现有冒险家乱吃有毒的蘑菇……真让人操心。不行，我得去把‘剧毒蕈类图鉴’加印一百份贴在林道口。”'
        },
        {
            name: '莱依拉 (Layla)',
            avatar: 'https://enka.network/ui/UI_AvatarIcon_Layla.png',
            thoughts: '“哈啊……好困，白天的课程结束了吗？怎么星图作业还有三页没写。希望我的‘另一个身体’梦游时能帮我做完……求求了……”'
        },
        {
            name: '柯莱 (Collei)',
            avatar: 'https://enka.network/ui/UI_AvatarIcon_Collei.png',
            thoughts: '“今天要练习射箭五十次，还要背诵香料药理。见到提纳里师父一定要精神饱满！噢……不能再像上次那样，把‘安神菇’和‘沉眠蕈’记错了。”'
        },
        {
            name: '迪希雅 (Dehya)',
            avatar: 'https://enka.network/ui/UI_AvatarIcon_Dehya.png',
            thoughts: '“这把大剑该去大巴扎保养一下了，刀刃上有点小崩口。大小姐刚才送了我一盒香水，虽然我很喜欢，不过我这双拿大剑的手，拿着香水瓶总觉得怪怪的。”'
        },
        {
            name: '纳西妲 (Nahida)',
            avatar: 'https://enka.network/ui/UI_AvatarIcon_Nahida.png',
            thoughts: '“哎呀，你正在用虚空终端读取我的心灵吗？其实我并没有什么秘密，我的一半思维在观察树叶的摆动，另一半……正在想着你哦。”'
        },
        {
            name: '珐露珊 (Faruzan)',
            avatar: 'https://enka.network/ui/UI_AvatarIcon_Faruzan.png',
            thoughts: '“（整理教案）这群教令院的晚辈，真是一届不如一届！连基础的机关解密都能算错三个小数点，下次必须让他们抄写一百遍古文！”'
        },
        {
            name: '坎蒂丝 (Candace)',
            avatar: 'https://enka.network/ui/UI_AvatarIcon_Candace.png',
            thoughts: '“阿如村今天的风沙有点大。希望那些远道而来的客人们都带足了水……如果有盗宝团敢来捣乱，我会用盾牌让他们认识沙漠的严酷。”'
        },
        {
            name: '赛索斯 (Sethos)',
            avatar: 'https://enka.network/ui/UI_AvatarIcon_Sethos.png',
            thoughts: '“（擦拭着弓箭）哎呀，又到了该和赛诺比试牌技的时候了。这次我可要用那一招让他大吃一惊……”'
        },
        {
            name: '多莉 (Dori)',
            avatar: 'https://enka.network/ui/UI_AvatarIcon_Dori.png',
            thoughts: '“摩拉，摩拉，亮闪闪的摩拉~今天那位艾尔海森书记官要是再来光顾，我一定要把那批古代文书的价格再抬高两成，嘿嘿嘿……”'
        }
    ];

    // Preload images silently in the background to ensure instant display
    characters.forEach(char => {
        const img = new Image();
        img.src = char.avatar;
    });

    let isScanning = false;

    startScanBtn.addEventListener('click', () => {
        if (isScanning) return;
        isScanning = true;
        
        // Play scan synthesizer sequence
        playScanSynthSequence();

        // UI transitions to scanning state
        startScanBtn.disabled = true;
        startScanBtn.innerHTML = '<i class="fa-solid fa-arrows-spin akasha-spin"></i> 扫描虚空频率中...';
        
        const scanLine = document.querySelector('.scan-line');
        const targetBox = document.querySelector('.target-box');
        
        scanLine.style.display = 'block';
        targetBox.classList.add('scanning');
        
        // Reset visual state
        targetIcon.style.display = 'block';
        targetIcon.className = 'fa-solid fa-circle-notch akasha-spin';
        targetAvatar.style.display = 'none';
        targetAvatar.classList.remove('show');
        dendroLock.classList.remove('active');
        
        // Quick glitch cycle effect during scan
        let cycleCount = 0;
        const cycleInterval = setInterval(() => {
            const tempChar = characters[Math.floor(Math.random() * characters.length)];
            targetName.textContent = tempChar.name.split(' ')[0]; // Show short name during scan
            
            // Play rapid click synths
            playSynthSound(600 + Math.random() * 200, 'sine', 0.03, 0.02);
            cycleCount++;
            if (cycleCount > 24) clearInterval(cycleInterval);
        }, 50);

        thoughtBubble.style.opacity = '0.5';
        window.smoothReplaceHTML(thoughtText, '正在建立潜意识频道，同步脑电波...', 200);

        // Select a random character
        const char = characters[Math.floor(Math.random() * characters.length)];

        setTimeout(() => {
            clearInterval(cycleInterval);
            
            // Scan completes, update results
            scanLine.style.display = 'none';
            targetBox.classList.remove('scanning');
            
            // Hide the default search icon, set the avatar image
            targetIcon.style.display = 'none';
            targetAvatar.src = char.avatar;
            targetAvatar.style.display = 'block';
            
            // Trigger transition fade-in
            setTimeout(() => {
                targetAvatar.classList.add('show');
                dendroLock.classList.add('active');
            }, 50);

            targetName.textContent = char.name;
            
            thoughtBubble.style.opacity = '1';
            window.smoothReplaceHTML(thoughtText, char.thoughts, 400);
            
            startScanBtn.disabled = false;
            startScanBtn.innerHTML = '<i class="fa-solid fa-expand"></i> 重新读取';
            
            isScanning = false;
            
            // Success locking tone (C5 -> E5 -> G5 chime)
            playSynthSound(523.25, 'sine', 0.12, 0.06); // C5
            setTimeout(() => playSynthSound(659.25, 'sine', 0.12, 0.06), 100); // E5
            setTimeout(() => playSynthSound(783.99, 'sine', 0.2, 0.06), 200); // G5
        }, 1200);
    });
}

/* ==========================================================================
   5. INTERACTIVE QUOTES PANEL
   ========================================================================== */
function initInteractiveQuotes() {
    const quotes = [
        "“你想知道我的梦境吗？那就把手伸过来吧。”",
        "“世间万物，就如同种子一样，只要得到雨露的关怀，就终有抽枝展叶的一天。”",
        "“每一个小小的想法，都有可能在世界树的灌溉下，成长为支撑天空的栋梁之才。”",
        "“要像向日葵那样，去迎接太阳的光芒，哪怕脚下的土地偶有坎坷。”",
        "“人们总是会做出这样那样的选择，就像树叶从不询问风要把它们带到哪里去。”",
        "“每个人都是智慧的载体，只是我们有时需要换一个角度，去读懂它。”",
        "“欢迎来到我的梦境，在这里，所有的愿望和期盼，都会化作最美的蝴蝶飞舞。”",
        "“别害怕，智慧是不会拒绝任何一个渴望它的人的。哪怕你只是一片小草叶。”",
        "“云图工具箱 (wintool.cc)？噢！那个小铁盒吗？它是人类巧思的结晶呢，像松鼠收集松果一样，把纯净好用的工具齐聚一堂，干净又利落。”",
        "“大家，握紧我的手！——这样的话，我就能把快乐和希望分给每一个人了。”"
    ];

    const quoteText = document.getElementById('quoteText');
    const changeBtn = document.getElementById('changeQuoteBtn');

    if (!quoteText || !changeBtn) return;

    let index = 0;

    changeBtn.addEventListener('click', () => {
        // Icon rotation effect
        const icon = changeBtn.querySelector('i');
        if (icon) {
            icon.animate([
                { transform: 'rotate(0deg)' },
                { transform: 'rotate(360deg)' }
            ], { duration: 800, easing: 'ease-in-out' });
        }

        // Simple fade-out, change, fade-in transition
        quoteText.style.opacity = 0;
        
        playSynthSound(587.33, 'triangle', 0.1); // D5 chime
        
        setTimeout(() => {
            let nextIndex = Math.floor(Math.random() * quotes.length);
            while (nextIndex === index) {
                nextIndex = Math.floor(Math.random() * quotes.length);
            }
            index = nextIndex;
            quoteText.textContent = quotes[index];
            quoteText.style.opacity = 1;
        }, 300);
    });
    

}

// Akasha Styled Modal Alert dialog
function showAkashaAlert(title, content, iconClass = 'fa-solid fa-info') {
    // Create dynamically to fit glassmorphism theme perfectly
    const alertBox = document.createElement('div');
    alertBox.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translate(-50%, -20%) scale(0.9);
        width: 90%;
        max-width: 450px;
        background: rgba(7, 23, 17, 0.9);
        border: 1px solid var(--dendro-primary);
        border-radius: 12px;
        padding: 1.5rem;
        z-index: 10000;
        box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3), inset 0 0 15px rgba(16, 185, 129, 0.1);
        backdrop-filter: blur(20px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;

    alertBox.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem; border-bottom:1px solid rgba(16,185,129,0.2); padding-bottom:0.5rem;">
            <i class="${iconClass}" style="color:var(--dendro-light); font-size:1.2rem; filter:drop-shadow(0 0 5px var(--dendro-primary));"></i>
            <h4 style="font-size:1.05rem; font-weight:700; color:#FFF; margin:0;">${title}</h4>
        </div>
        <p style="font-size:0.85rem; color:var(--text-primary); line-height:1.6; white-space:pre-wrap; margin-bottom:1.25rem;">${content}</p>
        <div style="display:flex; justify-content:flex-end;">
            <button id="alertCloseBtn" style="background:var(--dendro-primary); color:var(--bg-darker); border:none; padding:0.4rem 1.2rem; border-radius:6px; font-weight:600; font-size:0.8rem; cursor:pointer; transition:all 0.2s;">
                收下智慧
            </button>
        </div>
    `;

    document.body.appendChild(alertBox);
    
    // Animate show
    setTimeout(() => {
        alertBox.style.opacity = 1;
        alertBox.style.transform = 'translate(-50%, -20%) scale(1)';
    }, 50);

    const closeBtn = alertBox.querySelector('#alertCloseBtn');
    closeBtn.addEventListener('click', () => {
        alertBox.style.opacity = 0;
        alertBox.style.transform = 'translate(-50%, -20%) scale(0.9)';
        playSynthSound(330, 'sine', 0.1); // E4 tone
        setTimeout(() => alertBox.remove(), 300);
    });
}

function triggerScreenGlow() {
    const grid = document.querySelector('.hud-grid');
    grid.style.backgroundImage = `
        linear-gradient(rgba(16, 185, 129, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(16, 185, 129, 0.08) 1px, transparent 1px)
    `;
    grid.style.backgroundColor = 'rgba(16, 185, 129, 0.02)';
    
    // Spawn many particles
    const leafContainer = document.getElementById('leafContainer');
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createLeaf(leafContainer, false), i * 100);
    }
    
    playSynthSound(440, 'sine', 0.1);
    setTimeout(() => playSynthSound(554.37, 'sine', 0.1), 100); // C#5
    setTimeout(() => playSynthSound(659.25, 'sine', 0.2), 200); // E5

    setTimeout(() => {
        grid.style.backgroundImage = '';
        grid.style.backgroundColor = '';
    }, 3000);
}

function triggerAvatarSway() {
    const avatar = document.getElementById('nahidaAvatar');
    if (!avatar) return;
    
    avatar.style.transition = 'transform 0.5s ease-in-out';
    avatar.style.transform = 'rotate(-10deg) scale(1.05)';
    
    // Sway synthesizer tones
    playSynthSound(523.25, 'sine', 0.1);
    setTimeout(() => playSynthSound(587.33, 'sine', 0.1), 150);
    setTimeout(() => playSynthSound(698.46, 'sine', 0.1), 300); // F5
    setTimeout(() => playSynthSound(880.00, 'sine', 0.25), 450); // A5

    setTimeout(() => {
        avatar.style.transform = 'rotate(10deg) scale(1.05)';
        setTimeout(() => {
            avatar.style.transform = 'rotate(0deg) scale(1)';
        }, 500);
    }, 500);
}

/* ==========================================================================
   6. WEB AUDIO API SYNTHESIZER (SUMERU BREEZE & CHIMES)
   ========================================================================== */
let audioCtx = null;
let musicInterval = null;
let isPlayingMusic = false;

function initSumeruSynth() {
    const synthBtn = document.getElementById('synthBtn');
    if (!synthBtn) return;

    // HTML5 Audio — 几初的智愿 For Riddles, for Wonders (HOYO-MiX) NetEase ID: 1992141906
    const bgmAudio2 = new Audio('https://music.163.com/song/media/outer/url?id=1992141906.mp3');
    bgmAudio2.loop = true;
    let isPlaying = false;
    let locationChecked = false;
    let isLocationSupported = true;
    let isChecking = false;

    synthBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> <span>几初的智愿</span>';

    synthBtn.addEventListener('click', async () => {
        if (isChecking) return; // Prevent multiple clicks while checking

        if (!isPlaying) {
            // Check location on first play attempt to handle NetEase foreign IP restrictions
            if (!locationChecked) {
                isChecking = true;
                synthBtn.innerHTML = '<i class="fa-solid akasha-spinner akasha-spin"></i> <span>网络检测中...</span>';
                try {
                    const res = await fetch('https://whois.pconline.com.cn/ipJson.jsp?json=true');
                    const buffer = await res.arrayBuffer();
                    const decoder = new TextDecoder('gbk');
                    const text = decoder.decode(buffer);
                    const data = JSON.parse(text);
                    // Pconline only returns Chinese IPs accurately. If it has a province, it's likely China.
                    if (!data.proCode || data.proCode === '999999') {
                        isLocationSupported = false;
                    }
                    locationChecked = true;
                } catch (e) {
                    console.warn("Location check failed, attempting playback anyway.");
                    locationChecked = true; // Proceed anyway if API fails
                }
                isChecking = false;
            }

            if (!isLocationSupported) {
                synthBtn.innerHTML = '<i class="fa-solid fa-ban"></i> <span>地区受限</span>';
                setTimeout(() => {
                    synthBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> <span>几初的智愿</span>';
                }, 3000);
                return;
            }

            bgmAudio2.play().then(() => {
                isPlaying = true;
                synthBtn.classList.add('playing');
                synthBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span>几初的智愿</span>';
            }).catch(() => {
                synthBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> <span>播放失败</span>';
                setTimeout(() => {
                    synthBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> <span>几初的智愿</span>';
                }, 3000);
            });
        } else {
            bgmAudio2.pause();
            bgmAudio2.currentTime = 0;
            isPlaying = false;
            synthBtn.classList.remove('playing');
            synthBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> <span>几初的智愿</span>';
        }
    });
}

// Synthesise single frequency tone
function playSynthSound(freq, type = 'sine', duration = 0.2, gainStart = 0.1) {
    if (!audioCtx) return;
    
    // Resume context if suspended
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(gainStart, audioCtx.currentTime);
    // Smooth envelope decay
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// Synthesise sweep up (connecting Irminsul sound)
function playSweepSynth() {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(261.63, audioCtx.currentTime); // Start C4
    osc.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 1.2); // Sweep to C6

    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.2);
}

// Synthesise scanning sound sequence
function playScanSynthSequence() {
    if (!audioCtx) return;
    
    playSynthSound(440, 'sine', 0.08, 0.05);
    setTimeout(() => playSynthSound(493.88, 'sine', 0.08, 0.05), 100);
    setTimeout(() => playSynthSound(554.37, 'sine', 0.08, 0.05), 200);
    setTimeout(() => playSynthSound(659.25, 'sine', 0.12, 0.05), 300);
    
    // Echo chirps during scan
    setTimeout(() => playSynthSound(783.99, 'triangle', 0.05, 0.03), 600);
    setTimeout(() => playSynthSound(783.99, 'triangle', 0.05, 0.03), 800);
    setTimeout(() => playSynthSound(880.00, 'triangle', 0.05, 0.03), 1000);
}

// Sumeru Pentatonic chimes (Arpeggio loop)
function playSumeruChimesSequence() {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // Pentatonic scale of Sumeru vibes: F major/D minor (D, F, G, A, C)
    const notes = [293.66, 349.23, 392.00, 440.00, 523.25, 587.33, 698.46, 783.99, 880.00];
    
    // Pick 4 random notes to arpeggiate
    const noteCount = 4 + Math.floor(Math.random() * 3); // 4 to 6 notes
    const now = audioCtx.currentTime;

    for (let i = 0; i < noteCount; i++) {
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        const delay = i * 0.45; // time gap between chimes
        
        setTimeout(() => {
            if (!isPlayingMusic) return; // guard if stopped
            
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(randomNote, audioCtx.currentTime);
            
            // Soft crystalline chimes
            gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.8);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 1.8);
        }, delay * 1000);
    }
}

/* ==========================================================================
   7. WIDGET C: IRMINSUL FORTUNE (地脉运势)
   ========================================================================== */
function initFortune() {
    const drawBtn = document.getElementById('drawFortuneBtn');
    const content = document.getElementById('fortuneContent');
    
    if (!drawBtn || !content) return;

    const fortunes = [
        { level: "大吉", text: "草元素充沛，灵感涌现。非常适合重构祖传代码，今天不会遇到恶性 Bug！" },
        { level: "大吉", text: "虚空算力峰值。你的逻辑思维如有神助，遇到的难题都能迎刃而解。" },
        { level: "中吉", text: "智慧之风吹拂。按部就班地完成计划吧，花一点时间去散散步会有意外收获。" },
        { level: "中吉", text: "梦境安稳。今天的世界树没有受到污染，一切正常，适合学习新的知识。" },
        { level: "小吉", text: "地脉流转平缓。虽然进展可能不快，但每一步都很扎实。记得多喝水哦。" },
        { level: "小吉", text: "偶尔犯困。代码写累了就休息一下吧，闭上眼睛，让小吉祥草王为你编织一个甜美的梦。" },
        { level: "平", text: "普通的须弥一日。没有太多的波澜，保持平常心，享受平淡的快乐也是一种智慧。" }
    ];

    const doDraw = () => {
        // Animation states
        window.smoothReplaceHTML(content, `
            <div class="animate-fade-in" style="text-align: center; padding: 1.5rem 0; color: var(--dendro-primary);">
                <i class="fa-solid fa-arrows-spin akasha-spin" style="font-size: 2rem;"></i>
                <p style="margin-top: 0.8rem; font-size: 0.85rem; color: var(--text-secondary);">正在向世界树发送请求...</p>
            </div>
        `);
        
        playScanSynthSequence(); // Reuse the same cool sound

        setTimeout(() => {
            const result = fortunes[Math.floor(Math.random() * fortunes.length)];
            let color = 'var(--dendro-light)';
            if (result.level === "大吉") color = 'var(--gold-accent)';
            else if (result.level === "中吉") color = '#60A5FA';
            
            window.smoothReplaceHTML(content, `
                <div class="fortune-result animate-fade-in">
                    <div class="fortune-level" style="color: ${color};">${result.level}</div>
                    <div class="fortune-text">${result.text}</div>
                    <button id="resetFortuneBtn" class="btn" style="margin-top: 1rem; background: rgba(255,255,255,0.05); color: var(--text-secondary); width: 100%; border: 1px solid rgba(255,255,255,0.1);">
                        <i class="fa-solid fa-rotate-right"></i> 重新链接
                    </button>
                </div>
            `, 300, () => {
                // Add listener to new reset button to immediately draw again
                const resetBtn = document.getElementById('resetFortuneBtn');
                if (resetBtn) resetBtn.addEventListener('click', doDraw);
            });
            
            // Success sound
            playSynthSound(523.25, 'sine', 0.12, 0.06); 
            setTimeout(() => playSynthSound(659.25, 'sine', 0.12, 0.06), 100); 
            setTimeout(() => playSynthSound(783.99, 'sine', 0.2, 0.06), 200); 
        }, 1200);
    };

    drawBtn.addEventListener('click', doDraw);
}

function initFortuneBox() {
    const content = document.getElementById('fortuneContent');
    if (content) {
        window.smoothReplaceHTML(content, `
            <div class="fortune-idle animate-fade-in">
                <i class="fa-brands fa-pagelines" style="font-size: 2rem; color: var(--dendro-primary); margin-bottom: 0.5rem; filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.4));"></i>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">连接须弥地脉，解析今日的智慧箴言与代码运势。</p>
                <button id="drawFortuneBtn" class="btn btn-primary"><i class="fa-solid fa-link"></i> 抽取今日运势</button>
            </div>
        `, 300, () => {
            initFortune(); // Rebind event after HTML is in DOM
        });
    }
}

/* ==========================================================================
   8. WIDGET D: QQ MUSIC DIRECT PLAY HACK
   ========================================================================== */
function initMusicPlayer() {
    const playBtn = document.getElementById('nativePlayBtn');
    const cdIcon = document.querySelector('.cd-cover i');
    const musicCard = document.querySelector('.music-card');
    let isMusicPlaying = false;
    let bgmAudio = new Audio('https://music.163.com/song/media/outer/url?id=2014247586.mp3');
    bgmAudio.loop = true;

    if (playBtn) {
        playBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (!isMusicPlaying) {
                // Play
                bgmAudio.play().then(() => {
                    isMusicPlaying = true;
                    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                    cdIcon.classList.add('spin-anim');
                    if (musicCard) musicCard.classList.add('playing-glow');
                }).catch(err => {
                    console.error("Playback failed:", err);
                    alert("由于浏览器策略或网络问题，音频播放失败。");
                });
            } else {
                // Pause
                bgmAudio.pause();
                isMusicPlaying = false;
                playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                cdIcon.classList.remove('spin-anim');
                if (musicCard) musicCard.classList.remove('playing-glow');
            }
        });
    }
}

/* ==========================================================================
   9. GLOBAL LOADER OVERLAY (JS rAF ease-in-quart, 1.5s)
   ========================================================================== */

// Custom ease: slow start → accelerate → smooth landing at 100%
function loaderEase(t) {
    const cutoff = 0.82; // ease-in phase covers 82% of the duration
    if (t < cutoff) {
        // Cubic ease-in: crawls at the start, builds speed
        const tn = t / cutoff;
        return tn * tn * tn * cutoff;
    } else {
        // Ease-out-quad: decelerates softly into 100%
        const tn = (t - cutoff) / (1 - cutoff);
        return cutoff + (1 - cutoff) * (1 - (1 - tn) * (1 - tn));
    }
}

function startLoaderAnimation() {
    const loader = document.getElementById('loaderOverlay');
    const loaderBar = document.getElementById('loaderBar');
    if (!loader || !loaderBar) return;

    const duration = 900;
    const startTime = performance.now();

    function step(now) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = loaderEase(t);
        loaderBar.style.width = (eased * 100) + '%';

        if (t < 1) {
            requestAnimationFrame(step);
        } else {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 200);
        }
    }

    requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', () => {
    initMusicPlayer();
    startLoaderAnimation();
    // Vercel Serverless API Proxy Counter
    setTimeout(async () => {
        try {
            const todayDate = new Date().toISOString().split('T')[0];
            const hasVisitedToday = localStorage.getItem('visited_date') === todayDate;
            
            // If first visit today, send increment action
            if (!hasVisitedToday) {
                await fetch('/api/counter?action=up');
                localStorage.setItem('visited_date', todayDate);
            }

            // Fetch latest stats
            const res = await fetch('/api/counter?action=get');
            const data = await res.json();
            
            const tTotal = document.getElementById('stat_total');
            const tToday = document.getElementById('stat_today');
            const tYest = document.getElementById('stat_yesterday');
            if(tTotal) tTotal.innerText = data.total;
            if(tToday) tToday.innerText = data.today;
            if(tYest) tYest.innerText = data.yesterday;
            
        } catch (err) {
            console.log('Vercel Counter error:', err);
            const tTotal = document.getElementById('stat_total');
            if (tTotal) {
                tTotal.innerText = "跨域/系统拦截";
                document.getElementById('stat_today').innerText = "N/A";
                document.getElementById('stat_yesterday').innerText = "N/A";
            }
        }
    }, 1000);
});

/* ==========================================================================
   IMMERSIVE EFFECTS & EASTER EGGS
   ========================================================================== */

function initParticleInteraction() {
    const canvas = document.getElementById('interactionCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = (Math.random() - 0.5) * 2 - 1; // Slight upward tendency
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.01;
            
            // Dendro green by default, Gold/Purple in dream mode
            this.color = Math.random() > 0.5 ? '16, 185, 129' : '167, 243, 208'; 
            if (document.body.classList.contains('dream-mode')) {
                this.color = Math.random() > 0.5 ? '196, 181, 253' : '147, 197, 253';
            }
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
        }
        draw() {
            ctx.fillStyle = `rgba(${this.color}, ${this.life})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function spawnParticles(x, y, count) {
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(x, y));
        }
    }

    let lastTime = 0;
    window.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTime > 40) { 
            spawnParticles(e.clientX, e.clientY, 1);
            lastTime = now;
        }
    });

    window.addEventListener('click', (e) => {
        spawnParticles(e.clientX, e.clientY, 12);
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            if (p.life <= 0) {
                particles.splice(i, 1);
            } else {
                p.draw();
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

function initParallax() {
    const hudGrid = document.querySelector('.hud-grid');
    const leafContainer = document.getElementById('leafContainer');
    
    window.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 80;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 80;
        
        if (hudGrid) {
            hudGrid.style.transform = `translate(${xAxis}px, ${yAxis}px)`;
        }
        if (leafContainer) {
            leafContainer.style.transform = `translate(${xAxis * 1.5}px, ${yAxis * 1.5}px)`;
        }
    });
}

function initDreamMode() {
    const hour = new Date().getHours();
    // Enable dream mode if it's between 00:00 and 05:59
    if (hour >= 0 && hour < 6) {
        document.body.classList.add('dream-mode');
        
        const quoteText = document.getElementById('quoteText');
        if (quoteText) {
            quoteText.innerText = "“嘘…你也是梦里的访客吗？世界树正在安睡……”";
        }
    }
}
// ==========================================================================
// 10. COMPANION PET (NAHIDA EMOJIS)
// ==========================================================================
function initCompanionPet() {
    const petContainer = document.getElementById('companionPet');
    const petImg = document.getElementById('companionImg');
    const petSpeech = document.getElementById('companionSpeech');
    if (!petContainer || !petImg) return;

    const nahidaStickers = [
        './assets/nahida_emoji_1.png',
        './assets/nahida_emoji_2.png',
        './assets/nahida_emoji_3.png',
        './assets/nahida_emoji_4.png',
        './assets/nahida_emoji_5.png'
    ];
    
    // Select one random initial sticker
    petImg.src = nahidaStickers[Math.floor(Math.random() * nahidaStickers.length)];

    // Mouse Tracking (Tilt)
    document.addEventListener('mousemove', (e) => {
        const rect = petImg.getBoundingClientRect();
        const petX = rect.left + rect.width / 2;
        const petY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(e.clientY - petY, e.clientX - petX);
        const distance = Math.min(20, Math.hypot(e.clientX - petX, e.clientY - petY) / 20);
        
        const tiltX = Math.cos(angle) * distance;
        const tiltY = Math.sin(angle) * distance;
        
        petImg.style.transform = `translate(${tiltX}px, ${tiltY}px) rotate(${tiltX * 0.5}deg)`;
    });

    // Interaction (Click)
    let hideSpeechTimeout;
    petContainer.addEventListener('click', () => {
        // Change sticker
        petImg.src = nahidaStickers[Math.floor(Math.random() * nahidaStickers.length)];
        
        // Jump animation
        petImg.style.transition = 'transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        petImg.style.transform = `scale(1.2) translateY(-20px)`;
        setTimeout(() => {
            petImg.style.transition = 'transform 0.1s ease-out';
        }, 150);
        
        // Random speech text
        const quotes = ['你看这是什么？', '世界树的智慧。', '知识是宝贵的。', '需要我帮忙吗？', '我在听哦。'];
        petSpeech.innerText = quotes[Math.floor(Math.random() * quotes.length)];
        petSpeech.classList.add('show');
        
        clearTimeout(hideSpeechTimeout);
        hideSpeechTimeout = setTimeout(() => {
            petSpeech.classList.remove('show');
        }, 3000);
        
        playSynthSound(600 + Math.random() * 200, 'triangle', 0.1, 0.2);
    });
}

// ==========================================================================
// 11. AKASHA QUIZ MODAL
// ==========================================================================
function initAkashaQuiz() {
    const authBtn = document.getElementById('akashaAuthBtn');
    const modal = document.getElementById('quizModal');
    const closeBtn = document.getElementById('closeQuizBtn');
    const questionEl = document.getElementById('quizQuestion');
    const optionsEl = document.getElementById('quizOptions');
    if (!authBtn || !modal) return;

    const riddles = [
        {
            q: '在巨树繁茂的雨林里，那菈遇到蕈兽会怎么做？',
            opts: ['用火元素攻击', '用雷元素激化', '直接逃跑', '给它们唱歌'],
            ans: 1
        },
        {
            q: '智慧的国度中，防沙壁阻挡的是什么？',
            opts: ['沙漠里的镀金旅团', '狂暴的沙尘暴和魔物', '雨林的水汽', '世界树的枯萎'],
            ans: 1
        },
        {
            q: '能够连通世界树，让人们共享知识的装置是？',
            opts: ['留斯克', '虚空终端', '神之眼', '地脉异常'],
            ans: 1
        }
    ];

    let currentRiddle = null;

    function loadNextQuestion() {
        const quizBody = document.getElementById('quizBody');
        if (quizBody) quizBody.style.opacity = '0';
        
        setTimeout(() => {
            let nextRiddle = riddles[Math.floor(Math.random() * riddles.length)];
            while (riddles.length > 1 && nextRiddle === currentRiddle) {
                nextRiddle = riddles[Math.floor(Math.random() * riddles.length)];
            }
            currentRiddle = nextRiddle;
            
            questionEl.innerText = currentRiddle.q;
            optionsEl.innerHTML = '';
            
            currentRiddle.opts.forEach((opt, index) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option-btn';
                btn.innerText = opt;
                btn.onclick = () => handleAnswer(btn, index);
                optionsEl.appendChild(btn);
            });
            
            if (quizBody) quizBody.style.opacity = '1';
        }, 300);
    }

    authBtn.addEventListener('click', () => {
        modal.classList.add('active');
        loadNextQuestion();
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    function handleAnswer(btn, index) {
        const allBtns = optionsEl.querySelectorAll('.quiz-option-btn');
        allBtns.forEach(b => b.style.pointerEvents = 'none');

        if (index === currentRiddle.ans) {
            btn.classList.add('correct');
            authBtn.innerHTML = '<i class="fa-solid fa-check-circle" style="color:var(--dendro-primary)"></i> <span>虚空认证已获取</span>';
            authBtn.style.borderColor = 'var(--dendro-primary)';
            authBtn.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.4)';
            playSynthSound(800, 'sine', 0.2, 0.5); // Success tone
            
            setTimeout(() => {
                modal.classList.remove('active');
            }, 1500);
        } else {
            btn.classList.add('wrong');
            allBtns[currentRiddle.ans].classList.add('correct');
            playSynthSound(200, 'sawtooth', 0.2, 0.5); // Error tone
            
            setTimeout(() => {
                loadNextQuestion();
            }, 800);
        }
    }
}

// ==========================================================================
// 12. DUST PARTICLES
// ==========================================================================
function initDustParticles() {
    const body = document.body;
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            spawnSingleDust(body);
        }, i * 400);
    }
}

function spawnSingleDust(container) {
    const dust = document.createElement('div');
    dust.classList.add('dust-particle');
    const size = Math.random() * 4 + 2; // 2px to 6px
    dust.style.width = `${size}px`;
    dust.style.height = `${size}px`;
    dust.style.left = `${Math.random() * 100}vw`;
    dust.style.animationDuration = `${Math.random() * 15 + 15}s`; // 15s to 30s
    
    container.appendChild(dust);
    
    dust.addEventListener('animationend', () => {
        dust.remove();
        spawnSingleDust(container);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initDustParticles();
});



// Page Transition for Irminsul Connection
document.addEventListener('DOMContentLoaded', () => {
    const connectBtn = document.getElementById('connectIrminsulBtn');
    if (connectBtn) {
        connectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100vw';
            overlay.style.height = '100vh';
            overlay.style.backgroundColor = '#071711';
            overlay.style.zIndex = '999999';
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s ease';
            document.body.appendChild(overlay);
            
            void overlay.offsetWidth; // Force reflow
            overlay.style.opacity = '1';
            
            setTimeout(() => {
                window.location.href = connectBtn.href;
            }, 300);
        });
    }
});


