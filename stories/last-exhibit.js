(() => {
    const output = document.getElementById("output");
    const input = document.getElementById("commandInput");
    const commandForm = document.getElementById("commandForm");
    const statusEl = document.getElementById("status");

    const game = {
        clues: new Set(),
        talked: new Set(),
        questioned: {},
        searched: new Set(),
        accusations: 0,
        solved: false
    };

    const people = {
        clara: {
            name: "克拉拉·沃斯", role: "副馆长",
            intro: `克拉拉是阿什福德博士的副手，也是最后一位被目击与他交谈的人。她身穿醒目的红色修身西装外套，称自己于晚上 9:08 离开博士办公室，独自准备董事会简报，并在晚上 9:34 发现尸体。`,
            rounds: [
                [`问题：阿什福德博士为何召开紧急董事会？

克拉拉：“只是例行融资。朱利安喜欢小题大做。我 9:08 离开他，此后从未靠近档案室。”`, []],
                [`问题：为何您的分机在 9:16 致电阿什福德博士？

克拉拉：“我可能是为了资料包打过电话。我记不清了。这并不代表我去过档案室。”她的原始陈述未提及这通电话。`, ["call_log"]],
                [`问题：您的门禁卡在 9:18 打开了档案室。请解释。

克拉拉：“阿什福德博士一定是早些时候借了我的卡。”继续回答前，她碰了碰身旁红蜡封口的简报资料包。`, ["archive_key"]]
            ]
        },
        daniel: {
            name: "丹尼尔·鲁克", role: "夜班安保主管",
            intro: `丹尼尔称谋杀发生时自己正在外围巡逻，并认为档案室摄像头故障只是常规继电器问题。`,
            rounds: [
                [`问题：为何继电器恰在谋杀期间失效？

丹尼尔：“线路老化，常有的事。我在外面巡逻，没看见有人靠近档案室。”`, []],
                [`问题：您的巡逻标签从未离开装卸区。

丹尼尔：“好吧，我把它留在那里了。我没在巡逻。”他拒绝说明自己实际去了哪里。`, ["patrol_gap"]],
                [`问题：博彩室记录显示您在 9:19 至 9:24 一直在楼下。

丹尼尔：“我在还债。愚蠢，是的；杀人？不是。下楼前我看见克拉拉朝档案室楼梯走去，但以为她是去找阿什福德。”`, ["betting_slip"]]
            ]
        },
        evelyn: {
            name: "伊芙琳·哈特", role: "馆藏研究员",
            intro: `伊芙琳当时正在阅览室编目书信。阿什福德博士曾驳回她的研究资助申请，去年还解雇了她的哥哥。`,
            rounds: [
                [`问题：阿什福德博士是否给过您怨恨他的理由？

伊芙琳：“他拒绝了我的资助申请，说档案预算遭人操纵。我很生气，但整晚都在阅览室。”`, ["reading_log"]],
                [`问题：您能否在不被注意的情况下离开阅览室？

伊芙琳：“理论上可以。但请问问图书管理员那份 1892 年海岸勘测资料。她当时为此打断过我。”`, []],
                [`问题：图书管理员证实 9:20 至 9:24 都在您身旁工作。

伊芙琳：“那您就知道不是我杀的他。朱利安正试图阻止展览预算里的钱凭空消失。”`, ["librarian_note"]]
            ]
        },
        marcus: {
            name: "马库斯·科尔", role: "古董商",
            intro: `马库斯前来协商展品借用事宜。他曾因来源证明与阿什福德博士争吵，而他的古董刀被发现于尸体旁。`,
            rounds: [
                [`问题：您为何与阿什福德博士争吵？

马库斯：“他质疑我借展品的证明文件。我们争吵了，我很后悔。但招待会前他借我的刀开过箱子。”`, []],
                [`问题：您的刀就在尸体旁。

马库斯：“正是有人想让它被发现的位置。那是细剑刀刃，平直的创伤不是它造成的。”`, ["knife_print"]],
                [`问题：谁有理由害怕审计？

马库斯：“克拉拉。阿什福德问我是否见过沃斯文化控股公司的发票。我见过。”`, []]
            ]
        },
        iris: {
            name: "艾丽斯·贝尔", role: "董事会秘书",
            intro: `艾丽斯当时在会议室整理董事会记录。她称关键时段内一直在接线台进行两通连续电话。`,
            rounds: [
                [`问题：您的电话内容是什么？

艾丽斯：“先是捐助人，之后是受托人。录音显示我从未离开接线台。”`, ["switchboard_log"]],
                [`问题：您知道为何召开董事会吗？

艾丽斯：“朱利安要审计文件，并让我用红蜡封好资料包。克拉拉被安排负责汇报预算。”`, []],
                [`问题：继电器故障后您见到克拉拉了吗？

艾丽斯：“大约 9:26，她带着资料包穿过会议走廊。她像是刚跑过步，其中一个信封的角还破了。”`, []]
            ]
        }
    };

    const evidence = {
        clara_statement: "克拉拉称自己从晚上 9:08 起独自在办公室，直到发现尸体。",
        daniel_statement: "丹尼尔称档案室继电器故障只是常规问题，自己当时在巡逻。",
        evelyn_statement: "伊芙琳称谋杀时段正在阅览室编目书信。",
        marcus_statement: "马库斯承认古董刀在尸体旁，但称阿什福德博士借过它。",
        iris_statement: "艾丽斯称两通录音电话能够证明她在谋杀时段的行踪。",
        autopsy: "创伤由扁平狭窄的拆信刀造成，不是马库斯的尖头古董刀。死亡时间：晚上 9:21 至 9:23。",
        wax_fiber: "伤口内嵌有红色封蜡与破损的董事会信封纤维；两者都与克拉拉的简报资料包相符。",
        camera_delay: "档案室摄像头时钟比博物馆中央时钟恰慢两分钟。",
        relay_cut: "档案室摄像头继电器被故意拔下，并非故障损坏。",
        camera_exit: "校正摄像头时间后可见，身穿红色修身西装外套的克拉拉于晚上 9:24 离开档案室走廊。",
        knife_print: "马库斯的刀上有死者留下的旧指纹与修复粉尘，但没有新鲜血迹；工坊录像证明马库斯 9:18 至 9:25 一直在那里。",
        reading_log: "伊芙琳于晚上 9:14 在阅览室签到。",
        librarian_note: "图书管理员在 9:20 至 9:24 期间一直与伊芙琳在阅览室并肩工作。",
        patrol_gap: "丹尼尔的巡逻标签被留在装卸区；他隐瞒了另一件私事。",
        betting_slip: "签字还款单和柜台摄像头证明丹尼尔 9:19 至 9:24 一直在博彩室。",
        switchboard_log: "艾丽斯的电话时段为 9:20 至 9:26、9:28 至 9:31，证实了她的不在场证明。",
        archive_key: "克拉拉的万能门禁卡于晚上 9:18 打开了档案室。",
        call_log: "晚上 9:16，克拉拉的分机向阿什福德博士办公室拨打了一通 42 秒的电话。",
        audit_memo: "阿什福德博士计划在紧急董事会上揭露克拉拉挪用展览资金的行为。",
        letter_opener: "克拉拉办公室里被清洗过的拆信刀，其刀柄护圈下方留有一丝血迹。"
    };

    const terminalTranslations = new Map([
        [`案件概览

布莱克伍德博物馆馆长朱利安·阿什福德博士于晚上 9:34 被发现死于封闭档案室。私人董事会招待会结束后，五人仍留在馆内。

档案室摄像头被禁用，一把刀将嫌疑指向其中一人，而数份不在场证明暗藏谎言。请找出谁策划了谋杀、谋杀何时发生，以及哪项证据能够证明一切。`, `Case overview

Dr. Julian Ashford, director of the Blackwood Museum, was found dead in the sealed archive room at 9:34 PM. Five people remained inside after the private board reception.

The archive camera was disabled. A knife points suspicion at one person, while several alibis hide lies. Determine who planned the murder, when it happened, and which evidence proves it.`]
        , ["案件档案 047 - 最后的展品", "CASE FILE 047 - THE LAST EXHIBIT"]
        , [`案情简报

布莱克伍德博物馆为雄心勃勃的新展览举行私人董事会招待会后，已闭馆。备受敬重的馆长朱利安·阿什福德博士原定于翌日早晨召开紧急董事会，只有最亲近的圈内人知道原因。

招待会结束不久，阿什福德在封闭档案室中被发现遭人杀害。安保主管立即封锁大楼。招待会后仍留在馆内的五个人，现在都无法离开。`, `Case briefing

The Blackwood Museum has closed after a private board reception for its ambitious new exhibition. Its respected director, Dr. Julian Ashford, was due to call an emergency board meeting the following morning, and only his closest circle knew why.

Shortly after the reception, Ashford was found murdered in the sealed archive room. The security chief immediately locked down the building. The five people who remained inside cannot leave.`]
        , ["在你确定是谁杀害阿什福德博士、何时发生，以及凶手如何掩盖罪行之前，没有人能离开。", "No one leaves until you determine who killed Dr. Ashford, when it happened, and how the killer covered it up."]
        , ["这是一款文字推理游戏。输入命令来调查案件。", "This is a text deduction game. Type commands to investigate the case."]
        , ["输入“帮助”查看可执行的命令。", "Type 'help' to see the available commands."]
        , ["档案室已封锁。时钟显示晚上 9:41。", "The archive room is sealed. The clock reads 9:41 PM."]
        , [`可用命令

    查看                         查看谋杀案件
    嫌疑人                       列出博物馆内所有人
    交谈 [姓名]                  开始讯问
    提问 [姓名]                  继续讯问（三轮）
    搜查 [地点]                  搜索区域
    检查 [物品]                  检查特定物品
    时间线                       查看已知时间线
    线索                         查看已记录证据
    笔记                         查看侦探笔记
    指控 [姓名]                  提出指控
    状态                         显示案件进度
    清屏                         清空终端
    重启                         重新开始

例如：交谈 克拉拉、提问 克拉拉、搜查 档案室、检查 通话记录。

有些谎言掩盖的是秘密，并不能指认凶手。`, `Available commands

    look                         Review the murder case
    suspects                     List everyone in the museum
    talk [name]                  Begin an interview
    question [name]              Continue an interview (three rounds)
    examine [place]              Search an area
    inspect [item]               Inspect a specific item
    timeline                     Review the known timeline
    clues                        Review recorded evidence
    notes                        Review detective notes
    accuse [name]                Make an accusation
    status                       Show case progress
    clear                        Clear the terminal
    restart                      Start over

Examples: talk Clara, question Clara, examine archive, inspect call log.

Some lies conceal personal secrets; they do not identify the killer.`]
    ]);

    function say(text, style = "normal") {
        const line = document.createElement("div");
        line.className = "line " + style;
        line.dataset.zh = text;
        line.dataset.en = terminalTranslations.get(text) || text;
        line.textContent = uiEnglish ? line.dataset.en : line.dataset.zh;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    window.updateTerminalLanguage = () => {
        output.querySelectorAll(".line").forEach(line => {
            const chineseText = line.dataset.zh || line.textContent;
            line.dataset.zh = chineseText;
            line.dataset.en ||= terminalTranslations.get(chineseText) || chineseText;
            line.textContent = uiEnglish ? line.dataset.en : line.dataset.zh;
        });
    };

    function clue(id) {
        if (!game.clues.has(id)) {
            game.clues.add(id);
            say("[已记录证据] " + evidence[id], "important");
        }
    }

    function clean(text) {
        return text.toLowerCase().trim().replace(/\s+/g, " ");
    }

    function person(text) {
        const query = clean(text);
        const chineseNames = { clara: "克拉拉", daniel: "丹尼尔", evelyn: "伊芙琳", marcus: "马库斯", iris: "艾丽斯" };
        return Object.keys(people).find(id =>
            query.includes(id) || query.includes(chineseNames[id]) || (id === "daniel" && query.includes("dan"))
        ) || null;
    }

    function printHelp() {
                say(`可用命令

    查看                         查看谋杀案件
    嫌疑人                       列出博物馆内所有人
    交谈 [姓名]                  开始讯问
    提问 [姓名]                  继续讯问（三轮）
    搜查 [地点]                  搜索区域
    检查 [物品]                  检查特定物品
    时间线                       查看已知时间线
    线索                         查看已记录证据
    笔记                         查看侦探笔记
    指控 [姓名]                  提出指控
    状态                         显示案件进度
    清屏                         清空终端
    重启                         重新开始

例如：交谈 克拉拉、提问 克拉拉、搜查 档案室、检查 通话记录。

有些谎言掩盖的是秘密，并不能指认凶手。`, "system");
    }

    function interview(name) {
        const id = person(name);
        if (!id) return say("未知嫌疑人。请尝试：克拉拉、丹尼尔、伊芙琳、马库斯或艾丽斯。", "warning");
        game.talked.add(id);
        clue(id + "_statement");
        const suspect = people[id];
        say(`${suspect.name} - ${suspect.role}`, "system");
        say("");
        say(suspect.intro);
        say("");
        say(`输入“提问 ${suspect.name}”开始三轮讯问中的第一轮。`, "muted");
    }

    function question(name) {
        const id = person(name);
        if (!id) return say("未知嫌疑人。", "warning");
        if (!game.talked.has(id)) return say(`请先讯问 ${people[id].name}。尝试：交谈 ${people[id].name}`, "warning");
        const round = game.questioned[id] || 0;
        if (round >= people[id].rounds.length) return say(`${people[id].name}没有更多可补充的内容。`, "muted");
        const [text, discoveries] = people[id].rounds[round];
        game.questioned[id] = round + 1;
        discoveries.forEach(clue);
        say(`讯问 - ${people[id].name} // 第 ${round + 1} 轮`, "system");
        say("");
        say(text);
        if (round < 2) say(`或许还能得到更多回答。再次尝试“提问 ${people[id].name}”。`, "muted");
    }

    function examine(place) {
        const target = clean(place);
        if (target.includes("archive") || target.includes("body") || target.includes("scene") || target.includes("档案") || target.includes("尸体") || target.includes("现场")) {
            game.searched.add("archive"); clue("autopsy"); clue("wax_fiber");
            return say(`封闭档案室

阿什福德博士倒在档案桌旁。单一伤口干净狭窄。马库斯的古董刀就在附近，但其尖刃不可能造成这种伤口。

伤口内卡有红色封蜡和一根来自米色董事会信封的破损纤维。法医估计死亡发生于晚上 9:21 至 9:23。`);
        }
        if (target.includes("camera") || target.includes("relay") || target.includes("摄像头") || target.includes("继电器")) {
            game.searched.add("camera"); clue("camera_delay"); clue("relay_cut"); clue("camera_exit");
            return say(`档案室摄像头继电器

继电器在晚上 9:19 至 9:23 之间被拔下。电缆被利落地移除，这是蓄意行为。

摄像头时钟慢了两分钟。录像时间 9:22 时，一名女子离开档案室走廊，对应中央时钟晚上 9:24。能看到她醒目的红色修身西装外套。`);
        }
        if (target.includes("workshop") || target.includes("工坊")) {
            game.searched.add("workshop"); clue("knife_print");
            return say(`修复工坊

库存表显示阿什福德博士于晚上 8:47 借走马库斯的刀。刀刃上有旧指纹与修复粉尘，但没有新鲜血迹。工坊延时录像还显示马库斯从 9:18 至 9:25 一直在修复一块铜牌。这把刀是极具迷惑性的栽赃线索，不是凶器。`);
        }
        if (target.includes("office") || target.includes("clara") || target.includes("办公室") || target.includes("克拉拉")) {
            game.searched.add("office"); clue("letter_opener"); clue("audit_memo");
            return say(`克拉拉的办公室

简报笔记下藏着一把清洗过的银质拆信刀。其刀柄护圈下方残留一处暗色痕迹。

她的简报资料包使用米色信封，并以与档案室发现物相同的特殊红蜡封口。一份审计备忘录草稿称，阿什福德博士已追查到失踪的展览资金流入她控制的账户。`);
        }
        if (target.includes("reading") || target.includes("阅览")) {
            game.searched.add("reading"); clue("reading_log"); clue("librarian_note");
            return say(`阅览室

伊芙琳于晚上 9:14 签到。图书管理员在 9:20 至 9:24 期间与她一起编目书信。她的怨恨真实存在，但不在场证明成立。`);
        }
        if (target.includes("switchboard") || target.includes("conference") || target.includes("接线") || target.includes("会议")) {
            game.searched.add("switchboard"); clue("switchboard_log");
            return say(`接线台

艾丽斯的电话时段为 9:20 至 9:26、9:28 至 9:31。录音连续不断；她不可能在死亡时段进入档案室。`);
        }
        if (target.includes("security") || target.includes("loading") || target.includes("patrol") || target.includes("安保") || target.includes("装卸") || target.includes("巡逻")) {
            game.searched.add("security"); clue("patrol_gap"); clue("betting_slip");
            return say(`安保站

丹尼尔的巡逻标签一直留在装卸区。签字还款单和博彩室柜台摄像头证明他从 9:19 至 9:24 都在楼下。他撒谎是为掩盖债务，不是谋杀。`);
        }
        say("请尝试：档案室、摄像头继电器、工坊、办公室、阅览室、接线台或安保站。", "warning");
    }

    function inspect(item) {
        const target = clean(item);
        if (target.includes("camera") || target.includes("relay") || target.includes("摄像头") || target.includes("继电器")) return examine("camera relay");
        if (target.includes("knife") || target.includes("刀")) { clue("knife_print"); return say("马库斯的刀\n\n其尖刃无法造成扁平狭窄的伤道。它被放在这里，就是为了被人注意到。"); }
        if (target.includes("letter") || target.includes("opener") || target.includes("weapon") || target.includes("拆信") || target.includes("凶器")) { clue("letter_opener"); clue("autopsy"); return say("拆信刀\n\n克拉拉办公室内清洗过的拆信刀，其宽度和轮廓与伤口吻合。刀柄护圈下方仍留有血迹。"); }
        if (target.includes("key") || target.includes("card") || target.includes("access") || target.includes("门禁") || target.includes("钥匙")) { clue("archive_key"); return say("档案室门禁记录\n\n晚上 9:18 - 克拉拉·沃斯的万能门禁卡打开档案室。尸体被发现前，没有其他卡片进入。 "); }
        if (target.includes("phone") || target.includes("call") || target.includes("电话") || target.includes("通话")) { clue("call_log"); return say("内部电话记录\n\n晚上 9:16，克拉拉的分机致电阿什福德博士办公室，通话 42 秒。她没有提起这通电话。 "); }
        if (target.includes("wax") || target.includes("envelope") || target.includes("fiber") || target.includes("蜡") || target.includes("信封") || target.includes("纤维")) { clue("wax_fiber"); return say("封蜡与信封纤维\n\n伤口中的红蜡和米色纤维，与克拉拉的机密董事会资料包相符。 "); }
        if (target.includes("audit") || target.includes("memo") || target.includes("fund") || target.includes("审计") || target.includes("备忘录") || target.includes("资金")) { clue("audit_memo"); return say("审计备忘录\n\n阿什福德博士计划于次日早晨向董事会揭露克拉拉挪用展览资金的行为。 "); }
        say("请尝试：摄像头、刀、拆信刀、门禁卡、通话记录、封蜡或审计备忘录。", "warning");
    }

    function accuse(name) {
        const id = person(name);
        if (!id) return say("要指控谁？请尝试：指控 克拉拉 / 丹尼尔 / 伊芙琳 / 马库斯 / 艾丽斯", "warning");
        if (game.solved) return say("案件已经侦破。输入“重启”可再次调查。", "muted");
        game.accusations++;
        if (id !== "clara") {
            const outcomes = {
                daniel: "丹尼尔确实在巡逻一事上撒谎，但签字还款单和摄像头录像证明他在整个死亡时段都在楼下。他在掩盖恶习，而非杀人。",
                evelyn: "伊芙琳心怀怨恨，但图书管理员在整个死亡时段都与她并肩工作。只有动机而无机会，不足以定罪。",
                marcus: "被栽赃的刀和争吵令马库斯看起来很危险，但那把刀无法造成伤口。请找出真正的凶器。",
                iris: "艾丽斯知道紧急会议的事，但接线台录音覆盖了整个死亡时段。"
            };
            return say(`你指控了 ${people[id].name}。\n\n${outcomes[id]}`, "danger");
        }
        const required = ["autopsy", "camera_delay", "relay_cut", "archive_key", "call_log", "audit_memo", "wax_fiber", "letter_opener", "camera_exit"];
        const missing = required.filter(id => !game.clues.has(id));
        if (missing.length) return say(`你指控了克拉拉。\n\n这个推论具备动机和机会，但证据尚不完整。你还缺少 ${missing.length} 条重要证据。\n\n请确定真实死亡时段、克拉拉出现在档案室的证据，以及她与凶器之间的物证联系。`, "warning");
        game.solved = true;
        statusEl.textContent = "案件状态：已侦破";
        say("", "normal");
        say("================================================================", "important");
        say("案件侦破 - 最后的展品", "important");
        say("================================================================", "important");
        say("", "normal");
        say("凶手：克拉拉·沃斯", "system");
        say(`\n推理结论

    1. 法医估计死亡发生于晚上 9:21 至 9:23。
    2. 档案室摄像头慢了两分钟。校正后录像显示，克拉拉于晚上 9:24 离开档案室走廊。
    3. 克拉拉的办公室在 9:16 致电阿什福德博士，随后她的万能门禁卡于 9:18 打开档案室。
    4. 她在 9:19 故意拔掉摄像头继电器，以掩盖自己的行踪。
    5. 马库斯的刀是栽赃物：它无法造成该伤口，没有新鲜血迹，工坊录像也证明他当时不在场。
    6. 丹尼尔、伊芙琳和艾丽斯在死亡时段均有经核实的连续不在场证明。每一条可疑线索都被刻意引向别处。
    7. 伤口与克拉拉办公室里被清洗过的拆信刀相符。血迹、红蜡和董事会信封纤维都将凶器与她的资料包联系起来。
    8. 阿什福德博士计划揭露克拉拉挪用展览资金。这给了她杀人灭口的动机。

    克拉拉诱骗阿什福德博士进入档案室，切断继电器，用拆信刀杀害他，放置马库斯的刀作为栽赃物，然后返回办公室。\n\n案件结案。`);
        say(`\n你用 ${game.accusations} 次指控侦破了案件。`, "system");
    }

    function details() {
        say(`案件状态\n\n  已发现证据：${game.clues.size}/${Object.keys(evidence).length}\n  已开始讯问：${game.talked.size}/5\n  已搜索区域：${game.searched.size}\n  已提出指控：${game.accusations}\n  案件：${game.solved ? "已侦破" : "进行中"}`);
    }

    window.murderRunCommand = raw => {
        const command = clean(raw);
        if (!command) return;
        say("> " + raw, "command");
        if (command === "help" || command === "帮助" || command === "?") return printHelp();
        if (command === "look" || command === "overview" || command === "查看") return say(`案件概览\n\n布莱克伍德博物馆馆长朱利安·阿什福德博士于晚上 9:34 被发现死于封闭档案室。私人董事会招待会结束后，五人仍留在馆内。\n\n档案室摄像头被禁用，一把刀将嫌疑指向其中一人，而数份不在场证明暗藏谎言。请找出谁策划了谋杀、谋杀何时发生，以及哪项证据能够证明一切。`);
        if (command === "suspects" || command === "people" || command === "嫌疑人") return say("在场人员\n\n  克拉拉·沃斯 - 副馆长\n  丹尼尔·鲁克 - 夜班安保主管\n  伊芙琳·哈特 - 馆藏研究员\n  马库斯·科尔 - 古董商\n  艾丽斯·贝尔 - 董事会秘书\n\n使用：交谈 [姓名]");
        if (command === "timeline" || command === "time" || command === "时间线") return say("已知时间线\n\n  晚上 8:55 - 董事会招待会结束；大门锁闭。\n  晚上 9:08 - 克拉拉称自己离开阿什福德博士办公室。\n  晚上 9:14 - 伊芙琳在阅览室签到。\n  晚上 9:16 - 克拉拉的办公室致电阿什福德博士。\n  晚上 9:18 - 克拉拉的万能门禁卡打开档案室。\n  晚上 9:19 - 档案室摄像头继电器断电。\n  晚上 9:20 - 艾丽斯的第一通接线台电话开始。\n  晚上 9:23 - 档案室摄像头继电器恢复。\n  晚上 9:28 - 艾丽斯的第二通接线台电话开始。\n  晚上 9:34 - 克拉拉报告发现尸体。\n\n档案室摄像头慢了两分钟。 ");
        if (command === "clues" || command === "evidence" || command === "线索") return game.clues.size ? say("已发现证据\n\n" + [...game.clues].map((id, index) => `${index + 1}. ${evidence[id]}`).join("\n\n")) : say("尚未正式记录任何证据。请搜索博物馆并讯问嫌疑人。");
        if (command === "notes" || command === "笔记") return say("侦探笔记\n\n确定真实的死亡时间。区分掩盖私人秘密的谎言与掩盖谋杀的谎言。接着将动机、机会和物证联系到同一个人身上。");
        if (command === "status" || command === "状态") return details();
        if (command === "clear" || command === "清屏") { output.innerHTML = ""; return; }
        if (command === "restart" || command === "reset" || command === "重启") return restartGame();
        let match = command.match(/^(talk|interview|交谈)\s+(.+)$/); if (match) return interview(match[2]);
        match = command.match(/^(question|提问)\s+(.+)$/); if (match) return question(match[1]);
        match = command.match(/^(examine|搜查)\s+(.+)$/); if (match) return examine(match[1]);
        match = command.match(/^(inspect|检查)\s+(.+)$/); if (match) return inspect(match[1]);
        match = command.match(/^(accuse|指控)\s+(.+)$/); if (match) return accuse(match[1]);
        say(`未知命令：“${raw}”\n\n输入“帮助”查看可用命令。`, "warning");
    };

    const gameSaveKey = `deduction-game-progress-v1-${activeSaveId}`;
    const legacyChineseSaveKey = `deduction-game-progress-zh-v1-${activeSaveId}`;

    function saveChineseGame() {
        localStorage.setItem(gameSaveKey, JSON.stringify({
            clues: [...game.clues],
            talked: [...game.talked],
            questioned: game.questioned,
            searched: [...game.searched],
            accusations: game.accusations,
            solved: game.solved,
            status: statusEl.textContent,
            output: output.innerHTML
        }));
    }

    function restoreChineseGame() {
        try {
            const savedGame = JSON.parse(localStorage.getItem(gameSaveKey) || localStorage.getItem(legacyChineseSaveKey));
            if (!savedGame) return false;

            game.clues = new Set(savedGame.clues || []);
            game.talked = new Set(savedGame.talked || []);
            game.questioned = savedGame.questioned || {};
            game.searched = new Set(savedGame.searched || []);
            game.accusations = savedGame.accusations || 0;
            game.solved = Boolean(savedGame.solved);
            output.innerHTML = savedGame.output || "";
            statusEl.textContent = savedGame.status || "案件状态：进行中";
            return true;
        } catch {
            localStorage.removeItem(gameSaveKey);
            return false;
        }
    }

    if (hasActiveSave) {
        window.gamePersistence = {
            save: saveChineseGame,
            clear: () => localStorage.removeItem(gameSaveKey)
        };
    }

    function printIntro() {
        output.innerHTML = "";
        statusEl.textContent = "案件状态：进行中";
        say("案件档案 047 - 最后的展品", "system");
        say("");
        say(`案情简报

布莱克伍德博物馆为雄心勃勃的新展览举行私人董事会招待会后，已闭馆。备受敬重的馆长朱利安·阿什福德博士原定于翌日早晨召开紧急董事会，只有最亲近的圈内人知道原因。

招待会结束不久，阿什福德在封闭档案室中被发现遭人杀害。安保主管立即封锁大楼。招待会后仍留在馆内的五个人，现在都无法离开。`);
        say("");
        say("在你确定是谁杀害阿什福德博士、何时发生，以及凶手如何掩盖罪行之前，没有人能离开。", "warning");
        say("这是一款文字推理游戏。输入命令来调查案件。", "warning");
        say("输入“帮助”查看可执行的命令。", "system");
        say("");
        say("档案室已封锁。时钟显示晚上 9:41。", "muted");
    }

    function restartGame() {
        game.clues.clear();
        game.talked.clear();
        game.questioned = {};
        game.searched.clear();
        game.accusations = 0;
        game.solved = false;
        window.gamePersistence?.clear();
        printIntro();
        window.updateTerminalLanguage?.();
        window.gamePersistence?.save();
    }

    window.restartGame = restartGame;

    commandForm.addEventListener("submit", event => {
        event.preventDefault();
        const command = input.value.trim();
        if (!command) return;
        input.value = "";
        window.murderRunCommand(command);
        window.gamePersistence?.save();
    });

    document.addEventListener("click", () => {
        if (document.getElementById("saveDialog").classList.contains("hidden")) {
            input.focus();
        }
    });

    if (!hasActiveSave || !restoreChineseGame()) printIntro();
    updateInterfaceText();
    window.updateTerminalLanguage?.();
})();
