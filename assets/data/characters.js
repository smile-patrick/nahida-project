// 统一使用 Enka.network 的官方解包 UI 素材
const ASSET_BASE = "https://enka.network/ui/";

const characterData = [
    {
        id: "nahida",
        name: "纳西妲",
        nation: "须弥",
        releaseVersion: "3.2",
        element: "dendro",
        elementName: "草",
        weaponType: "法器",
        role: "核心辅助 / 后台副C",
        avatar: `${ASSET_BASE}UI_AvatarIcon_Nahida.png`,
        overview: "智慧的主之神，须弥的「小吉祥草王」。原神最强草系核心，拥有顶级的后台挂草能力与极强的元素精通增益。",
        weapons: [
            { name: "千夜浮梦", icon: `${ASSET_BASE}UI_EquipIcon_Catalyst_Ayus.png`, type: "T0", desc: "专武，提供大量精通，团队增伤。" },
            { name: "祭礼残章", icon: `${ASSET_BASE}UI_EquipIcon_Catalyst_Fossil.png`, type: "T2", desc: "高精通副词条，平民首选。" }
        ],
        artifacts: {
            sets: ["深林记忆 (草套4件套)"],
            mainStats: { sands: { name: "元素精通", icon: `${ASSET_BASE}UI_RelicIcon_15025_4.png` }, goblet: { name: "草伤/精通", icon: `${ASSET_BASE}UI_RelicIcon_15025_1.png` }, circlet: { name: "双暴/精通", icon: `${ASSET_BASE}UI_RelicIcon_15025_3.png` } },
            subStats: "元素精通 > 双暴 > 充能", note: "精通建议堆到接近 1000。"
        },
        talents: [
            { name: "元素战技 (E)", icon: `${ASSET_BASE}Skill_S_Nahida_01.png`, priority: "优先加满" },
            { name: "元素爆发 (Q)", icon: `${ASSET_BASE}Skill_E_Nahida_01.png`, priority: "尽量点高" }
        ],
        teams: [{ name: "草行久", comp: "纳西妲 + 行秋 + 久岐忍 + 钟离" }]
    },
    {
        id: "mavuika",
        name: "玛薇卡",
        nation: "纳塔",
        releaseVersion: "5.3",
        element: "pyro",
        elementName: "火",
        weaponType: "双手剑",
        role: "核心副C / 站场主C",
        avatar: `${ASSET_BASE}UI_AvatarIcon_Mavuika.png`,
        overview: "纳塔的「火神」。机制极度全面的火系核心，能后台挂火也能站场输出。",
        weapons: [
            { name: "焚天之野", icon: `${ASSET_BASE}UI_EquipIcon_Claymore_Mavuika.png`, type: "T0", desc: "专武。若加载失败请等待图库更新。" },
            { name: "狼的末路", icon: `${ASSET_BASE}UI_EquipIcon_Claymore_Wolfmound.png`, type: "T1", desc: "常驻泛用双手剑。" }
        ],
        artifacts: {
            sets: ["黑曜秘典 (黑曜4) / 烬城勇者绘卷 (英雄4)"],
            mainStats: { sands: { name: "攻击/充能", icon: `${ASSET_BASE}UI_RelicIcon_15035_4.png` }, goblet: { name: "火伤", icon: `${ASSET_BASE}UI_RelicIcon_15035_1.png` }, circlet: { name: "双暴", icon: `${ASSET_BASE}UI_RelicIcon_15035_3.png` } },
            subStats: "双暴 > 充能 > 攻击", note: "主C带黑曜，辅助带英雄。"
        },
        talents: [
            { name: "元素战技 (E)", icon: `${ASSET_BASE}Skill_S_Mavuika_01.png`, priority: "优先加满" },
            { name: "元素爆发 (Q)", icon: `${ASSET_BASE}Skill_E_Mavuika_01.png`, priority: "尽量点高" }
        ],
        teams: [{ name: "火神国家队", comp: "玛薇卡 + 行秋 + 班尼特 + 自由位" }]
    },
    {
        id: "furina",
        name: "芙宁娜",
        nation: "枫丹",
        releaseVersion: "4.2",
        element: "hydro",
        elementName: "水",
        weaponType: "单手剑",
        role: "核心增伤 / 后台副C",
        avatar: `${ASSET_BASE}UI_AvatarIcon_Furina.png`,
        overview: "枫丹的「水神」。集极致增伤与后台输出于一体的人权卡。",
        weapons: [
            { name: "静水流涌之辉", icon: `${ASSET_BASE}UI_EquipIcon_Sword_Regalia.png`, type: "T0", desc: "专武。" },
            { name: "灰河渡手", icon: `${ASSET_BASE}UI_EquipIcon_Sword_Fishing.png`, type: "平民", desc: "枫丹钓鱼武器。" }
        ],
        artifacts: {
            sets: ["黄金剧团 (剧团4)"],
            mainStats: { sands: { name: "生命/充能", icon: `${ASSET_BASE}UI_RelicIcon_15032_4.png` }, goblet: { name: "生命/水伤", icon: `${ASSET_BASE}UI_RelicIcon_15032_1.png` }, circlet: { name: "双暴", icon: `${ASSET_BASE}UI_RelicIcon_15032_3.png` } },
            subStats: "双暴 > 充能 > 生命", note: "单水队伍需极高充能(200%)。"
        },
        talents: [
            { name: "元素战技 (E)", icon: `${ASSET_BASE}Skill_S_Furina_01.png`, priority: "优先加满" },
            { name: "元素爆发 (Q)", icon: `${ASSET_BASE}Skill_E_Furina_01.png`, priority: "优先加满" }
        ],
        teams: [{ name: "白芙双水", comp: "那维莱特 + 芙宁娜 + 万叶 + 白术" }]
    },
    {
        id: "raiden",
        name: "雷电将军",
        nation: "稻妻",
        releaseVersion: "2.1",
        element: "electro",
        elementName: "雷",
        weaponType: "长柄武器",
        role: "核心充能 / 站场主C",
        avatar: `${ASSET_BASE}UI_AvatarIcon_Shougun.png`,
        overview: "稻妻的「雷神」。提瓦特第一充能拐，极强的爆发伤害与回能机制。",
        weapons: [
            { name: "薙草之稻光", icon: `${ASSET_BASE}UI_EquipIcon_Pole_Narukami.png`, type: "T0", desc: "专武。" },
            { name: "「渔获」", icon: `${ASSET_BASE}UI_EquipIcon_Pole_Machaques.png`, type: "平民", desc: "钓鱼武器，平民神器。" }
        ],
        artifacts: {
            sets: ["绝缘之旗印 (绝缘4)"],
            mainStats: { sands: { name: "充能", icon: `${ASSET_BASE}UI_RelicIcon_15020_4.png` }, goblet: { name: "雷伤/攻击", icon: `${ASSET_BASE}UI_RelicIcon_15020_1.png` }, circlet: { name: "双暴", icon: `${ASSET_BASE}UI_RelicIcon_15020_3.png` } },
            subStats: "充能(250%+) > 双暴 > 攻击", note: "充能效率是雷神最重要的属性。"
        },
        talents: [
            { name: "元素战技 (E)", icon: `${ASSET_BASE}Skill_S_Shougun_01.png`, priority: "点到9级" },
            { name: "元素爆发 (Q)", icon: `${ASSET_BASE}Skill_E_Shougun_01.png`, priority: "优先加满" }
        ],
        teams: [{ name: "雷神国家队", comp: "雷神 + 行秋 + 班尼特 + 香菱" }]
    },
    {
        id: "zhongli",
        name: "钟离",
        nation: "璃月",
        releaseVersion: "1.1",
        element: "geo",
        elementName: "岩",
        weaponType: "长柄武器",
        role: "核心生存 / 减抗辅",
        avatar: `${ASSET_BASE}UI_AvatarIcon_Zhongli.png`,
        overview: "璃月的「岩神」。拥有全游戏最厚的霸体护盾，手残党永远的救星。",
        weapons: [
            { name: "黑缨枪", icon: `${ASSET_BASE}UI_EquipIcon_Pole_Noire.png`, type: "平民", desc: "三星血牛神器。" }
        ],
        artifacts: {
            sets: ["千岩牢固 (千岩4)"],
            mainStats: { sands: { name: "生命", icon: `${ASSET_BASE}UI_RelicIcon_15017_4.png` }, goblet: { name: "生命", icon: `${ASSET_BASE}UI_RelicIcon_15017_1.png` }, circlet: { name: "生命", icon: `${ASSET_BASE}UI_RelicIcon_15017_3.png` } },
            subStats: "生命 > 其他", note: "目标5万血量。"
        },
        talents: [
            { name: "元素战技 (E)", icon: `${ASSET_BASE}Skill_S_Zhongli_01.png`, priority: "优先加满" }
        ],
        teams: [{ name: "胡行钟", comp: "胡桃 + 行秋 + 钟离 + 夜兰" }]
    },
    {
        id: "venti",
        name: "温迪",
        nation: "蒙德",
        releaseVersion: "1.0",
        element: "anemo",
        elementName: "风",
        weaponType: "弓",
        role: "核心聚怪 / 扩散辅",
        avatar: `${ASSET_BASE}UI_AvatarIcon_Venti.png`,
        overview: "蒙德的「风神」。提瓦特最强的范围聚怪角色。",
        weapons: [
            { name: "终末嗟叹之诗", icon: `${ASSET_BASE}UI_EquipIcon_Bow_Fallen.png`, type: "T0", desc: "专武。" },
            { name: "绝弦", icon: `${ASSET_BASE}UI_EquipIcon_Bow_Troupe.png`, type: "T1", desc: "精通扩散流极品。" }
        ],
        artifacts: {
            sets: ["翠绿之影 (风套4)"],
            mainStats: { sands: { name: "精通", icon: `${ASSET_BASE}UI_RelicIcon_15005_4.png` }, goblet: { name: "精通", icon: `${ASSET_BASE}UI_RelicIcon_15005_1.png` }, circlet: { name: "精通", icon: `${ASSET_BASE}UI_RelicIcon_15005_3.png` } },
            subStats: "精通 > 充能", note: "全精通扩散流。"
        },
        talents: [
            { name: "元素爆发 (Q)", icon: `${ASSET_BASE}Skill_E_Venti_01.png`, priority: "优先加满" }
        ],
        teams: [{ name: "莫甘温", comp: "甘雨 + 莫娜 + 温迪 + 迪奥娜" }]
    },
    {
        id: "neuvillette",
        name: "那维莱特",
        nation: "枫丹",
        releaseVersion: "4.1",
        element: "hydro",
        elementName: "水",
        weaponType: "法器",
        role: "站场主C",
        avatar: `${ASSET_BASE}UI_AvatarIcon_Neuvillette.png`,
        overview: "枫丹的最高审判官，水之龙王。凭借重击·衡平推裁拥有极其霸道的直线AOE输出，是原神数值与机制的巅峰代表之一。",
        weapons: [
            { name: "万世流涌大典", icon: `${ASSET_BASE}UI_EquipIcon_Catalyst_Iudex.png`, type: "T0", desc: "专武，巨额暴伤与生命恢复。" },
            { name: "遗祀玉珑", icon: `${ASSET_BASE}UI_EquipIcon_Catalyst_YinYang.png`, type: "T1", desc: "大月卡武器，提供高生命与暴击。" },
            { name: "试作金珀", icon: `${ASSET_BASE}UI_EquipIcon_Catalyst_Proto.png`, type: "平民", desc: "锻造武器，平民极品神器。" }
        ],
        artifacts: {
            sets: ["逐影猎人 (猎人4件套)"],
            mainStats: { sands: { name: "生命值", icon: `${ASSET_BASE}UI_RelicIcon_15033_4.png` }, goblet: { name: "水伤 / 生命值", icon: `${ASSET_BASE}UI_RelicIcon_15033_1.png` }, circlet: { name: "暴击伤害", icon: `${ASSET_BASE}UI_RelicIcon_15033_3.png` } },
            subStats: "双暴 > 百分比生命 > 充能", note: "猎人套提供大量暴击率，面板暴击率堆到50%左右即可，其余全堆暴伤和生命。"
        },
        talents: [
            { name: "普通攻击", icon: `${ASSET_BASE}Skill_A_Catalyst_MD.png`, priority: "优先加满 (重击核心)" },
            { name: "元素战技 (E)", icon: `${ASSET_BASE}Skill_S_Neuvillette_01.png`, priority: "尽量点高" }
        ],
        teams: [{ name: "那芙万白", comp: "那维莱特 + 芙宁娜 + 万叶 + 白术" }]
    },
    {
        id: "kazuha",
        name: "枫原万叶",
        nation: "稻妻",
        releaseVersion: "1.6",
        element: "anemo",
        elementName: "风",
        weaponType: "单手剑",
        role: "核心增伤 / 聚怪辅",
        avatar: `${ASSET_BASE}UI_AvatarIcon_Kazuha.png`,
        overview: "「叶天帝」。提供顶级的全队元素增伤、聚怪以及风套减抗。泛用性极高，几乎可以进入所有元素直伤队伍。",
        weapons: [
            { name: "苍古自由之誓", icon: `${ASSET_BASE}UI_EquipIcon_Sword_Widsith.png`, type: "T0", desc: "专武，提供精通与全队增益。" },
            { name: "西福斯的月光", icon: `${ASSET_BASE}UI_EquipIcon_Sword_Pleroma.png`, type: "T1", desc: "精通转充能，解决全队循环。" },
            { name: "铁蜂刺", icon: `${ASSET_BASE}UI_EquipIcon_Sword_Excalibur.png`, type: "平民", desc: "锻造武器，免费获取高精通。" }
        ],
        artifacts: {
            sets: ["翠绿之影 (风套4件套)"],
            mainStats: { sands: { name: "元素精通", icon: `${ASSET_BASE}UI_RelicIcon_15005_4.png` }, goblet: { name: "元素精通", icon: `${ASSET_BASE}UI_RelicIcon_15005_1.png` }, circlet: { name: "元素精通", icon: `${ASSET_BASE}UI_RelicIcon_15005_3.png` } },
            subStats: "元素充能效率 (160%+) > 元素精通", note: "无脑堆精通，目标1000精通，同时兼顾充能。"
        },
        talents: [
            { name: "元素爆发 (Q)", icon: `${ASSET_BASE}Skill_E_Kazuha_01.png`, priority: "尽量点高" }
        ],
        teams: [{ name: "万达国际", comp: "达达利亚 + 万叶 + 香菱 + 班尼特" }]
    },
    {
        id: "hutao",
        name: "胡桃",
        nation: "璃月",
        releaseVersion: "1.3",
        element: "pyro",
        elementName: "火",
        weaponType: "长柄武器",
        role: "站场主C",
        avatar: `${ASSET_BASE}UI_AvatarIcon_Hutao.png`,
        overview: "往生堂第七十七代堂主。火系对单天花板，通过消耗生命值换取高额的攻击力提升，重击蒸发伤害极高。",
        weapons: [
            { name: "护摩之杖", icon: `${ASSET_BASE}UI_EquipIcon_Pole_Homa.png`, type: "T0", desc: "终极专武，高暴伤与生命压血增伤。" },
            { name: "匣里灭辰", icon: `${ASSET_BASE}UI_EquipIcon_Pole_Starmud.png`, type: "T1", desc: "高精炼匣里极度契合蒸发流。" }
        ],
        artifacts: {
            sets: ["炽烈的炎之魔女 (魔女4) / 追忆之注连 (追忆4)"],
            mainStats: { sands: { name: "精通 / 生命", icon: `${ASSET_BASE}UI_RelicIcon_15006_4.png` }, goblet: { name: "火伤加成", icon: `${ASSET_BASE}UI_RelicIcon_15006_1.png` }, circlet: { name: "双暴", icon: `${ASSET_BASE}UI_RelicIcon_15006_3.png` } },
            subStats: "双暴 > 精通 > 生命", note: "精通最好达到200+，带护摩必带精通沙。"
        },
        talents: [
            { name: "普通攻击", icon: `${ASSET_BASE}Skill_A_03.png`, priority: "优先加满 (重击核心)" },
            { name: "元素战技 (E)", icon: `${ASSET_BASE}Skill_S_Hutao_01.png`, priority: "优先加满" }
        ],
        teams: [{ name: "胡行钟夜", comp: "胡桃 + 行秋 + 钟离 + 夜兰" }]
    },
    {
        id: "arlecchino",
        name: "阿蕾奇诺",
        nation: "枫丹",
        releaseVersion: "4.6",
        element: "pyro",
        elementName: "火",
        weaponType: "长柄武器",
        role: "站场主C",
        avatar: `${ASSET_BASE}UI_AvatarIcon_Arlecchino.png`,
        overview: "愚人众执行官第四席「仆人」。引入了生命之契机制的强力火C，攻击附魔刀刀烈火，视觉效果与伤害双拉满。",
        weapons: [
            { name: "赤月之形", icon: `${ASSET_BASE}UI_EquipIcon_Pole_Nachtmance.png`, type: "T0", desc: "外观专武，提供生命之契。" },
            { name: "和璞鸢", icon: `${ASSET_BASE}UI_EquipIcon_Pole_Morax.png`, type: "T1", desc: "常驻极品，高暴击。" }
        ],
        artifacts: {
            sets: ["谐律异想断章 (谐律4) / 角斗士的终幕礼 (角斗4)"],
            mainStats: { sands: { name: "攻击", icon: `${ASSET_BASE}UI_RelicIcon_15034_4.png` }, goblet: { name: "火伤", icon: `${ASSET_BASE}UI_RelicIcon_15034_1.png` }, circlet: { name: "双暴", icon: `${ASSET_BASE}UI_RelicIcon_15034_3.png` } },
            subStats: "双暴 > 攻击 > 精通", note: "专属套装谐律4提升最大。"
        },
        talents: [
            { name: "普通攻击", icon: `${ASSET_BASE}Skill_A_03.png`, priority: "优先加满 (核心输出)" }
        ],
        teams: [{ name: "仆夜班钟", comp: "阿蕾奇诺 + 夜兰 + 班尼特 + 钟离" }]
    },
    {
        id: "sandrone",
        name: "桑多涅",
        nation: "挪德卡莱",
        releaseVersion: "未知 (卫星)",
        element: "geo",
        elementName: "未知",
        weaponType: "未知",
        role: "未知 / 执行官",
        avatar: `${ASSET_BASE}UI_AvatarIcon_Sandrone.png`,
        overview: "愚人众执行官第七席「木偶」。精通机械机关技术，常坐于一台巨大的机械遗迹守卫手中。目前仍未实装，敬请期待。（数据为占位符）",
        weapons: [
            { name: "未知专武", icon: `${ASSET_BASE}UI_EquipIcon_Sword_Unknown.png`, type: "T0", desc: "尚未实装" }
        ],
        artifacts: {
            sets: ["未知新圣遗物"],
            mainStats: { sands: { name: "未知", icon: "" }, goblet: { name: "未知", icon: "" }, circlet: { name: "未知", icon: "" } },
            subStats: "未知", note: "卫星角色，等待官方后续前瞻发布。"
        },
        talents: [
            { name: "未知技能", icon: "", priority: "未知" }
        ],
        teams: [{ name: "执行官武装", comp: "桑多涅 + 博士 + 少女 + 队长" }]
    }
];
