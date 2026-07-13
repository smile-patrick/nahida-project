// Initialize Dust Particles (reused from index)
function initDustParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 800 } },
                color: { value: '#10B981' },
                shape: { type: 'circle' },
                opacity: { value: 0.3, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: false },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'top',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'bubble' },
                    onclick: { enable: false },
                    resize: true
                },
                modes: {
                    bubble: { distance: 200, size: 6, duration: 2, opacity: 0.8, speed: 3 }
                }
            },
            retina_detect: true
        });
    }
}

// Render Character List in Sidebar
function renderCharacterList() {
    const listContainer = document.getElementById('characterList');
    const searchInput = document.getElementById('charSearch');
    const nationFilter = document.getElementById('nationFilter');
    const elementFilter = document.getElementById('elementFilter');
    
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const nation = nationFilter ? nationFilter.value : 'all';
    const element = elementFilter ? elementFilter.value : 'all';

    listContainer.innerHTML = '';

    const filteredData = characterData.filter(char => {
        const matchName = char.name.toLowerCase().includes(query) || (char.overview && char.overview.toLowerCase().includes(query));
        const matchNation = nation === 'all' || char.nation === nation;
        const matchElement = element === 'all' || char.element === element;
        return matchName && matchNation && matchElement;
    });

    if (filteredData.length === 0) {
        listContainer.innerHTML = '<p style="text-align:center; padding:1rem; color:var(--text-secondary);">暂无符合条件的角色</p>';
        return;
    }

    filteredData.forEach((char, index) => {
        const btn = document.createElement('div');
        btn.className = `char-btn ${index === 0 ? 'active' : ''}`;
        btn.dataset.id = char.id;
        
        btn.innerHTML = `
            <img src="${char.avatar}" alt="${char.name}" class="char-avatar">
            <div class="char-info-mini">
                <h4>${char.name}</h4>
                <span class="char-element element-${char.element}">${char.elementName}</span>
            </div>
        `;
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('.char-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCharacterGuide(char.id);
        });
        
        listContainer.appendChild(btn);
    });
}

function attachFilterListeners() {
    const searchInput = document.getElementById('charSearch');
    const nationFilter = document.getElementById('nationFilter');
    const elementFilter = document.getElementById('elementFilter');
    
    if(searchInput) searchInput.addEventListener('input', renderCharacterList);
    if(nationFilter) nationFilter.addEventListener('change', renderCharacterList);
    if(elementFilter) elementFilter.addEventListener('change', renderCharacterList);
}

// Show Loading Overlay
function showLoader() {
    let loader = document.getElementById('guideLoader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'guideLoader';
        loader.className = 'guide-loader-overlay';
        loader.innerHTML = `
            <div class="guide-loader-spinner"></div>
            <p>正在同步世界树数据...</p>
        `;
        const content = document.getElementById('guideContent');
        if(content) content.parentNode.appendChild(loader);
    }
    loader.classList.remove('hidden');
}

function hideLoader() {
    const loader = document.getElementById('guideLoader');
    if (loader) loader.classList.add('hidden');
}

// Render the selected Character Guide
function renderCharacterGuide(charId) {
    const char = characterData.find(c => c.id === charId);
    if (!char) return;

    showLoader();
    const content = document.getElementById('guideContent');
    content.style.opacity = '0';
    
    // Simulate short network delay for cool effect (400ms)
    setTimeout(() => {
        let weaponsHTML = char.weapons.map(w => `
            <div class="equipment-item">
                ${w.icon ? `<img src="${w.icon}" class="guide-weapon-icon" alt="${w.name}">` : ''}
                <div class="equipment-detail" style="flex: 1;">
                    <strong style="display: flex; align-items: center; justify-content: space-between;">
                        ${w.name}
                        <span class="tier-badge ${w.type === 'T0' ? 'tier-t0' : (w.type === 'T1' ? 'tier-t1' : 'tier-other')}">${w.type}</span>
                    </strong>
                    <p>${w.desc}</p>
                </div>
            </div>
        `).join('');

        let talentsHTML = char.talents.map(t => `
            <div class="talent-item">
                ${t.icon ? `<img src="${t.icon}" class="guide-talent-icon" alt="${t.name}">` : ''}
                <div class="talent-item-info">
                    <strong>${t.name}</strong>
                    <p>推荐级: ${t.priority}</p>
                </div>
            </div>
        `).join('');

        let teamsHTML = char.teams.map(t => `
            <div class="team-item">
                <strong>${t.name}</strong>
                <p>${t.comp}</p>
            </div>
        `).join('');

        content.innerHTML = `
            <div class="guide-header-panel">
                <div class="guide-portrait" style="background-image: url('${char.avatar}');"></div>
                <div class="guide-basic-info">
                    <h2>${char.name}</h2>
                    <div class="char-tags">
                        <span class="element-${char.element}"><i class="fa-solid fa-leaf"></i> ${char.elementName}元素</span>
                        <span><i class="fa-solid fa-khanda"></i> ${char.weaponType}</span>
                        <span><i class="fa-solid fa-user-shield"></i> ${char.role}</span>
                        ${char.releaseVersion ? `<span style="border-color:var(--gold-accent); color:var(--gold-accent);"><i class="fa-solid fa-code-commit"></i> 首发版本: ${char.releaseVersion}</span>` : ''}
                    </div>
                    <p class="guide-overview">${char.overview}</p>
                </div>
            </div>

            <div class="guide-grid">
                <div class="guide-card glass">
                    <h3><i class="fa-solid fa-sword"></i> 武器推荐</h3>
                    <div class="equipment-list">
                        ${weaponsHTML}
                    </div>
                </div>
                
                <div class="guide-card glass">
                    <h3><i class="fa-solid fa-gem"></i> 圣遗物推荐</h3>
                    <div class="artifact-info">
                        <p><strong>套装选择：</strong>${char.artifacts.sets.join(' / ')}</p>
                        <div class="main-stats">
                            <div class="stat-badge">
                                ${char.artifacts.mainStats.sands.icon ? `<img src="${char.artifacts.mainStats.sands.icon}" class="guide-relic-icon">` : ''}
                                <span>时之沙</span> ${char.artifacts.mainStats.sands.name || char.artifacts.mainStats.sands}
                            </div>
                            <div class="stat-badge">
                                ${char.artifacts.mainStats.goblet.icon ? `<img src="${char.artifacts.mainStats.goblet.icon}" class="guide-relic-icon">` : ''}
                                <span>空之杯</span> ${char.artifacts.mainStats.goblet.name || char.artifacts.mainStats.goblet}
                            </div>
                            <div class="stat-badge">
                                ${char.artifacts.mainStats.circlet.icon ? `<img src="${char.artifacts.mainStats.circlet.icon}" class="guide-relic-icon">` : ''}
                                <span>理之冠</span> ${char.artifacts.mainStats.circlet.name || char.artifacts.mainStats.circlet}
                            </div>
                        </div>
                        <p><strong>副词条优先级：</strong><br>${char.artifacts.subStats}</p>
                        <div class="guide-note"><i class="fa-solid fa-circle-info"></i> ${char.artifacts.note}</div>
                    </div>
                </div>

                <div class="guide-card glass">
                    <h3><i class="fa-solid fa-arrow-up-right-dots"></i> 天赋加点</h3>
                    <div class="talent-info">
                        ${talentsHTML}
                    </div>
                </div>

                <div class="guide-card glass">
                    <h3><i class="fa-solid fa-people-group"></i> 核心配队</h3>
                    <div class="team-list">
                        ${teamsHTML}
                    </div>
                </div>
            </div>
        `;
        content.style.opacity = '1';
        hideLoader();
    }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
    initDustParticles();
    if (typeof characterData !== 'undefined' && characterData.length > 0) {
        attachFilterListeners();
        renderCharacterList();
        renderCharacterGuide(characterData[0].id);
    } else {
        const content = document.getElementById('guideContent');
        if (content) {
            content.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-triangle-exclamation" style="color: #ef4444; font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p style="color: #ef4444;">未找到角色数据文件！请确保已上传 assets/data/characters.js</p>
                </div>
            `;
            content.style.opacity = '1';
        }
    }
});