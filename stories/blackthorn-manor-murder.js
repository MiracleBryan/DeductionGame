(() => {
    const output = document.getElementById("output");
    const input = document.getElementById("commandInput");
    const commandForm = document.getElementById("commandForm");
    const statusEl = document.getElementById("status");
    const saveKey = `deduction-game-progress-v1-${activeSaveId}`;
    const game = { clues: new Set(), talked: new Set(), questioned: {}, searched: new Set(), accusations: 0, solved: false };

    const evidence = {
        b17_key: ["书房桌上的黄铜钥匙刻着 B-17。", "A brass key on the study desk is engraved B-17."],
        finger_cut: ["埃德蒙右手食指有一道新鲜的小伤口。", "Edmund has a fresh small cut on his right index finger."],
        whiskey: ["威士忌中有镇静剂；埃德蒙也有同类处方，因此它不能单独解释死亡。", "The whisky contains a sedative; Edmund also has a prescription for it, so it cannot explain the death alone."],
        watch: ["怀表停在 10:47；维修单显示它已连续数周走时不准。", "The watch stopped at 10:47; a service slip shows it had run unreliably for weeks."],
        lock: ["书房门从内部锁上，窗户完好。", "The study door was locked from inside and its windows are intact."],
        red_herrings: ["填字游戏、马形镇纸、折断的阅读灯和异常电费都没有连接到死亡。", "The crossword, horse paperweight, broken reading lamp, and high electricity bill do not connect to the death."],
        kitchen_window: ["厨房没有窗户，无法从那里看见闪电。", "The kitchen has no window from which lightning could be seen."],
        blackout: ["电力日志：10:31:02 断电，10:31:09 备用电启动，10:38:44 主电恢复。", "Power log: outage at 10:31:02, backup power at 10:31:09, main power restored at 10:38:44."],
        security_gap: ["厨房监控于 10:32 失效；黑暗中有人可以通过服务走廊。", "Kitchen security failed at 10:32; someone could cross the service corridor in darkness."],
        b17_contents: ["B-17 抽屉内有旧照片、撕裂的信、出生记录和银行记录。", "The B-17 drawer contains an old photo, torn letter, birth record, and bank records."],
        m_hart: ["14/03/1998 至 14/07/1998：埃德蒙每月向 M. Hart 支付 $5,000，随后付款停止。", "14/03/1998 to 14/07/1998: Edmund paid M. Hart $5,000 monthly, then the payments stopped."],
        old_photo: ["照片中，年轻的埃德蒙、一名女子与婴儿站在一起；背面只写着 M。", "A photo shows a young Edmund with a woman and baby; its reverse says only M."],
        toxin_key: ["B-17 钥匙齿间有未命名虚构接触性化合物的残留。", "The B-17 key carries residue of an unnamed fictional contact compound."],
        toxicology: ["毒理报告在埃德蒙体内检出同一种虚构化合物。", "Toxicology detects the same fictional compound in Edmund's body."],
        sophie_record: ["雇佣册显示：玛格丽特·哈特的记录消失后，索菲·里德于 2002 年出现。", "Employment records show Sophie Reed appearing in 2002 after Margaret Hart's record disappears."],
        eleanor_argument: ["埃莉诺与埃德蒙因遗嘱争吵；旧餐厅收据只是她弟弟参与的商务晚餐。", "Eleanor argued with Edmund about the will; the old restaurant receipt is only a business dinner with her brother."],
        daniel_debt: ["丹尼尔欠下约二十四万美元赌债。", "Daniel owes roughly $240,000 in gambling debt."],
        will_page: ["被撕下的遗嘱页写着：莉莉·哈特是庄园的主要受益人。", "A torn will page names Lily Hart as a major beneficiary of the manor."],
        clara_adoption: ["克拉拉生于 1998 年，收养手续于 1999 年完成；生父姓名被抹去。", "Clara was born in 1998 and adopted in 1999; her biological father's name is removed."],
        diary: ["埃德蒙的日记：\"马库斯绝不能知道那个孩子。\"", "Edmund's diary: \"Marcus must never know about the child.\""],
        will_drafts: ["早期遗嘱把庄园留给莉莉，晚期版本改为布莱克棘家族。", "An early will leaves the manor to Lily; a later version changes it to the Blackthorn family."],
        victor_1998: ["维克多承认自己在 1998 年替埃德蒙处理过高度保密的私事。", "Victor admits handling a highly confidential matter for Edmund in 1998."],
        marcus_fraud: ["马库斯公司的账目存在资金缺口；1998 至 1999 年的人事页被抽走。", "Marcus's company books contain missing funds; personnel pages for 1998 to 1999 were removed."],
        lily_mother: ["莉莉说母亲名叫玛格丽特·哈特，并在她幼年时离开。", "Lily says her mother was Margaret Hart and left when Lily was young."],
        lily_birth: ["B-17 的出生记录将莉莉、1998 年与埃德蒙的付款联系在一起。", "The B-17 birth record connects Lily, 1998, and Edmund's payments."],
        sophie_statement: ["索菲称她停电时在厨房，并看见了闪电。", "Sophie says she was in the kitchen during the blackout and saw lightning."],
        sophie_lie: ["得知厨房没有窗户后，索菲改称自己记错了房间。", "After learning the kitchen has no window, Sophie says she remembered the room incorrectly."],
        sophie_identity: ["看到旧照片后，索菲对玛格丽特的名字明显失态。", "Seeing the old photo, Sophie is visibly shaken by Margaret's name."],
        study_inventory: ["书房清单记录了威士忌、怀表、钢笔、填字游戏、马形镇纸、阅读灯和 B-17 钥匙各自原本的位置。", "The study inventory records the whisky, watch, pen, crossword, horse paperweight, reading lamp, and B-17 key in their usual places."],
        lamp_fall: ["阅读灯的断口与地毯上的撞击痕迹相符；它是在埃德蒙倒下时折断的。", "The reading lamp's break matches the impact mark in the carpet; it broke when Edmund fell."],
        crossword_red_herring: ["未完成的填字游戏中出现了 SECRET，但其余答案只是普通谜题。", "The unfinished crossword contains SECRET, but its other answers are ordinary clues."],
        paperweight_no_blood: ["马形镇纸很重，却没有血迹、裂痕或最近被移动的痕迹。", "The horse paperweight is heavy, but has no blood, cracks, or signs of recent movement."],
        electricity_bill: ["电费异常来自温室供暖系统的故障，维修日期早于谋杀一周。", "The unusual electricity bill comes from a conservatory-heating fault repaired a week before the murder."],
        pendant_fragment: ["大厅地毯上有一枚小型银质吊坠的断扣，刻着几乎磨平的 H。", "A small silver pendant clasp lies in the hall carpet, engraved with an almost-worn H."],
        pendant_initials: ["吊坠内侧刻着 M.H.；旧照片中的女子佩着同一枚月牙吊坠。", "The pendant's inside reads M.H.; the woman in the old photograph wears the same crescent pendant."],
        storm_register: ["门厅访客册显示暴雨前所有客人都已抵达；黑夜中没有新的访客。", "The hall register shows every guest arrived before the storm; nobody new entered in the night."],
        letter_fragment: ["撕裂的信中只剩一句：\"你不能把她从我身边买走，然后假装从未发生过。\"", "The torn letter preserves one line: \"You cannot buy her away from me and pretend it never happened.\""],
        birth_certificate: ["出生记录列出莉莉的母亲为 Margaret Hart；父亲一栏留空。", "The birth record lists Lily's mother as Margaret Hart; the father field is blank."],
        library_index: ["图书馆索引卡标记了一本被借走的 1998 年地方报纸合订本。", "A library index card marks a borrowed volume of local newspapers from 1998."],
        news_clipping: ["1998 年剪报报道黑棘公司慈善晚宴；埃德蒙身旁站着一名佩月牙吊坠的女子。", "A 1998 clipping covers a Blackthorn charity gala; beside Edmund stands a woman wearing a crescent pendant."],
        lily_notebook: ["莉莉的记者笔记把 M. Hart、1998 年付款和埃德蒙的名字列在同一页，却没有结论。", "Lily's reporter notebook places M. Hart, the 1998 payments, and Edmund's name on one page without drawing a conclusion."],
        medicine_log: ["药房收据表明埃德蒙的镇静剂按正常剂量配发；瓶中剩余药量没有异常。", "Pharmacy receipts show Edmund's sedative was dispensed normally; the remaining bottle quantity is unremarkable."],
        service_latch: ["服务走廊门闩在停电时可从厨房一侧无声开启，黑暗中不会触发大厅的铃。", "The service-corridor latch can be opened silently from the kitchen side during an outage, without ringing the hall bell."],
        muddy_boots: ["温室门边的湿靴印在暴雨中被踩乱，无法归属任何一个人。", "Wet boot prints by the conservatory door are trampled into rain-soaked confusion and identify no one."],
        marcus_invoice: ["马库斯的发票记录了虚构供应商，却与 1998 年的家庭秘密无关。", "Marcus's invoices record fictitious suppliers, but have nothing to do with the 1998 family secret."],
        clara_portrait: ["克拉拉幼年肖像背面只写着：\"安全比真相重要。\"", "The reverse of Clara's childhood portrait says only: \"Safety matters more than truth.\""],
        bedroom_letter: ["埃德蒙卧室抽屉中的未寄出信承认他害怕莉莉知道自己的身世。", "An unsent letter in Edmund's bedroom admits he feared Lily learning her parentage."],
        greenhouse_shears: ["温室剪刀沾有植物树脂，没有血迹；它们最近只修剪过玫瑰。", "The greenhouse shears carry plant resin, not blood; they were recently used only on roses."],
        guest_brochure: ["客房欢迎册的服务走廊地图少了一页，但这可能只是装订损坏。", "The guest welcome book is missing a service-corridor map page, though the binding may simply be damaged."]
    };

    const people = {
        eleanor: { zh: "埃莉诺·布莱克棘", en: "Eleanor Blackthorn", intro: ["埃德蒙的妻子。她转动婚戒，承认争吵，却不愿谈旧餐厅收据。", "Edmund's wife. She turns her wedding ring, admits an argument, and will not discuss an old restaurant receipt."], rounds: [
            ["埃莉诺：“他要改遗嘱。我离开大厅一会儿，是为了不再听他威胁我。”", "Eleanor: \"He meant to change the will. I left the hall for a while because I would not hear him threaten me again.\"", ["eleanor_argument"]],
            ["埃莉诺把收据推来：那是和弟弟的商务晚餐，不是情人。她隐瞒的是婚姻破裂。", "Eleanor pushes over the receipt: a business dinner with her brother, not a lover. She hid a collapsing marriage.", []],
            ["埃莉诺：“管家比任何人都清楚埃德蒙深夜会做什么。”", "Eleanor: \"The housekeeper knows Edmund's late-night habits better than anyone.\"", []]
        ] },
        daniel: { zh: "丹尼尔·布莱克棘", en: "Daniel Blackthorn", intro: ["埃德蒙的儿子。他脸色苍白，袖口有赌桌筹码留下的粉末。", "Edmund's son. He is pale, with gaming-chip dust on his cuff."], rounds: [
            ["丹尼尔：“我欠了钱。父亲不会再替我收拾残局。”", "Daniel: \"I owe money. Father would not clean up after me again.\"", ["daniel_debt"]],
            ["丹尼尔承认偷走遗嘱的一页。他害怕莉莉继承庄园，却说没碰书房的钥匙。", "Daniel admits stealing a will page. He feared Lily inheriting the manor, but says he never touched the study key.", ["will_page"], ["daniel_debt"]],
            ["丹尼尔：“偷窃是真的；谋杀不是。”", "Daniel: \"The theft is real; murder is not.\"", []]
        ] },
        clara: { zh: "克拉拉·布莱克棘", en: "Clara Blackthorn", intro: ["埃德蒙的养女。她把旧照片压在膝上，不愿谈 1998 年。", "Edmund's adopted daughter. She keeps old photographs pressed to her lap and will not discuss 1998."], rounds: [
            ["克拉拉：“我的收养在 1999 年完成。埃德蒙从不许我问 1998 年。”", "Clara: \"My adoption was finalised in 1999. Edmund never allowed questions about 1998.\"", ["clara_adoption"]],
            ["克拉拉：“日记里说马库斯绝不能知道那个孩子。我不知道是不是指我。”", "Clara: \"The diary says Marcus must never know about the child. I do not know whether it means me.\"", ["diary"], ["clara_adoption"]],
            ["克拉拉：“我有布莱克棘的姓氏，却不确定自己真正属于谁。”", "Clara: \"I have the Blackthorn name, but I am not sure whom I truly belong to.\"", []]
        ] },
        victor: { zh: "维克多·黑尔", en: "Victor Hale", intro: ["家族律师。他抱紧公文包，说遗嘱的改动都是埃德蒙的决定。", "The family lawyer. He grips his briefcase and says every change to the will was Edmund's decision."], rounds: [
            ["维克多：“我在 1998 年代理过埃德蒙；那是一件必须保密的事。”", "Victor: \"I represented Edmund in 1998; it was a matter that had to remain confidential.\"", ["victor_1998"]],
            ["维克多承认两份遗嘱措辞不同，但否认伪造签名。", "Victor admits the will drafts differ, but denies forging a signature.", ["will_drafts"], ["will_page"]],
            ["维克多：“我保护家族名声，不等于我杀了他。”", "Victor: \"Protecting the family name does not mean I killed him.\"", []]
        ] },
        marcus: { zh: "马库斯·格雷", en: "Marcus Gray", intro: ["埃德蒙的商业伙伴。他满身雨水，称停电时在温室查看玻璃。", "Edmund's business partner. He is soaked with rain and says he checked the conservatory glass during the blackout."], rounds: [
            ["马库斯：“账目有问题，但那是商业问题。”", "Marcus: \"The books have problems, but that is business.\"", ["marcus_fraud"]],
            ["马库斯：“有些孩子不该被用来惩罚父亲。”", "Marcus: \"Children should not be used to punish their fathers.\"", [], ["diary"]],
            ["马库斯：“我欠埃德蒙一笔还不清的账，但我没杀他。”", "Marcus: \"I owe Edmund an unpayable debt, but I did not kill him.\"", []]
        ] },
        lily: { zh: "莉莉·哈特", en: "Lily Hart", intro: ["调查记者。她来查埃德蒙的过去，不知道自己为何被写进遗嘱。", "An investigative journalist. She came to examine Edmund's past and does not know why she is named in the will."], rounds: [
            ["莉莉：“母亲叫玛格丽特·哈特，在我幼年时离开。”", "Lily: \"My mother was Margaret Hart. She left when I was very young.\"", ["lily_mother"]],
            ["莉莉看着 B-17 的出生记录和撕裂的信很久。付款记录让她第一次怀疑埃德蒙是自己的父亲。", "Lily studies the B-17 birth record and torn letter for a long time. The payments make her suspect for the first time that Edmund was her father.", ["lily_birth"], ["m_hart", "birth_certificate", "letter_fragment"]],
            ["莉莉：“我来找母亲，没想到找到的是一座庄园的谎言。”", "Lily: \"I came looking for my mother, not a manor built on lies.\"", []]
        ] },
        sophie: { zh: "索菲·里德", en: "Sophie Reed", intro: ["庄园管家。她的制服一尘不染，称自己已在此工作二十二年。", "The housekeeper. Her uniform is immaculate; she says she has served here for twenty-two years."], rounds: [
            ["索菲：“停电时我在厨房。闪电照亮了窗外。”", "Sophie: \"I was in the kitchen during the blackout. Lightning lit the view outside.\"", ["sophie_statement"]],
            ["索菲：“厨房没有窗户？我一定记错了房间。那晚太乱了。”", "Sophie: \"The kitchen has no window? I must have remembered the room incorrectly. It was a chaotic night.\"", ["sophie_lie"], ["kitchen_window"]],
            ["看到照片和吊坠后，索菲失去镇定：\"有些名字埋得太久，最后会变成另一个人。\"", "Seeing the photograph and pendant, Sophie loses composure: \"Some names are buried so long that they become another person.\"", ["sophie_identity"], ["old_photo", "m_hart", "pendant_initials"]]
        ] }
    };

    const finalEvidenceGroups = [
        { required: ["b17_key", "finger_cut", "lock", "toxin_key", "toxicology"], optional: ["whiskey", "medicine_log"], minimumOptional: 1 },
        { required: ["blackout", "security_gap", "service_latch", "kitchen_window", "sophie_statement", "sophie_lie"] },
        { required: ["b17_contents", "m_hart", "lily_birth", "sophie_record", "pendant_initials", "sophie_identity"], optional: ["birth_certificate", "letter_fragment", "news_clipping"], minimumOptional: 2 }
    ];

    const extraLocations = [
        { id: "hall", aliases: ["hall", "hallway", "foyer", "大厅", "走廊", "门厅"], clues: ["pendant_fragment", "storm_register"], text: ["主大厅的地毯被来回踩乱。壁炉旁有访客册，窗边有一枚断开的银质吊坠扣。", "The main-hall carpet is churned by passing feet. A visitor register sits by the fire, and a broken silver pendant clasp lies beneath the window."] },
        { id: "library", aliases: ["library", "图书馆"], clues: ["library_index"], text: ["图书馆里一排索引卡仍按年份排序。1998 年的地方报纸合订本被人取走，没有归还。", "The library index cards remain sorted by year. A bound volume of local newspapers from 1998 was taken out and never returned."] },
        { id: "master-bedroom", aliases: ["master bedroom", "master", "主卧", "埃德蒙卧室"], clues: ["bedroom_letter"], text: ["埃德蒙的卧室整洁得近乎刻意。抽屉深处有一封未寄出的信。", "Edmund's bedroom is tidy almost to the point of performance. An unsent letter rests at the back of a drawer."] },
        { id: "service-corridor", aliases: ["service corridor", "service", "服务走廊", "后勤走廊"], clues: ["service_latch"], text: ["服务走廊连接厨房、档案室和书房附近的后门。门闩磨损得很安静。", "The service corridor links the kitchen, archive, and a rear door near the study. Its latch is worn nearly silent."] },
        { id: "lily-room", aliases: ["lily room", "lily's room", "莉莉房间", "莉莉的房间"], clues: ["lily_notebook"], text: ["莉莉的临时客房堆满采访笔记。她像是在记录一件尚未理解的事。", "Lily's temporary room is crowded with reporting notes. She seems to be documenting something she has not yet understood."] },
        { id: "guest-room", aliases: ["guest room", "guest", "客房"], clues: ["guest_brochure"], text: ["客房欢迎册少了一张服务走廊地图。潮湿的装订线看起来像是自己散开的。", "The guest welcome book lacks a service-corridor map page. Its damp binding looks as though it may simply have come loose."] },
        { id: "garden", aliases: ["garden", "grounds", "花园", "庭院"], clues: ["greenhouse_shears"], text: ["花园被风雨打得凌乱。温室门边放着一把修枝剪。", "The garden is battered by rain. A pair of pruning shears rests by the conservatory door."] }
    ];

    const extraItems = [
        { aliases: ["lamp", "阅读灯", "台灯"], clues: ["lamp_fall"], text: ["灯的断口和地毯上的撞击痕迹吻合。它在埃德蒙倒下时折断。", "The lamp break matches an impact mark in the carpet. It broke when Edmund fell."] },
        { aliases: ["crossword", "填字游戏"], clues: ["crossword_red_herring"], text: ["SECRET 只是填字游戏中已经写下的一个答案，没有隐藏信息。", "SECRET is merely one completed crossword answer; there is no hidden message."] },
        { aliases: ["paperweight", "horse", "镇纸", "马形"], clues: ["paperweight_no_blood"], text: ["镇纸很重，也很显眼；这正是它看起来像凶器的全部原因。", "The paperweight is heavy and conspicuous; that is the full reason it resembles a weapon."] },
        { aliases: ["electricity bill", "bill", "电费", "账单"], clues: ["electricity_bill"], text: ["高额电费来自早已修复的温室供暖故障。", "The high bill comes from a conservatory-heating fault repaired long ago."] },
        { aliases: ["torn letter", "letter", "撕裂的信", "信件"], requires: ["b17_contents"], clues: ["letter_fragment"], text: ["信纸只能拼出一句控诉，署名和日期都被撕走。", "The paper reconstructs only one accusation; its signature and date have been torn away."] },
        { aliases: ["birth record", "birth certificate", "出生记录", "出生证明"], requires: ["b17_contents"], clues: ["birth_certificate"], text: ["出生记录没有写下父亲的名字，却让 1998 年的付款有了新的意义。", "The birth record names no father, but gives the 1998 payments new significance."] },
        { aliases: ["pendant", "clasp", "吊坠", "断扣"], requires: ["old_photo"], clues: ["pendant_initials"], text: ["清理吊坠内侧后，M.H. 两个字母出现；照片里的月牙吊坠也有同样的缺口。", "After cleaning the pendant's inner face, M.H. appears. The crescent pendant in the photograph has the same missing clasp."] },
        { aliases: ["newspaper", "clipping", "报纸", "剪报"], requires: ["library_index"], clues: ["news_clipping"], text: ["1998 年的剪报没有解释照片中的女子是谁，只留下了月牙吊坠这一处重复。", "The 1998 clipping does not name the woman beside Edmund; it only repeats the crescent pendant."] },
        { aliases: ["medicine", "prescription", "药", "处方"], clues: ["medicine_log"], text: ["药房记录让镇静剂显得更普通，也更难用作完整解释。", "The pharmacy record makes the sedative more ordinary, and less useful as a complete explanation."] },
        { aliases: ["latch", "service door", "门闩", "服务门"], requires: ["service_latch"], clues: [], text: ["门闩可以在黑暗中无声开启；走廊绕开了大厅和大多数人的视线。", "The latch can be opened silently in darkness; the corridor avoids the hall and most people's sightlines."] },
        { aliases: ["boots", "footprints", "靴印", "脚印"], clues: ["muddy_boots"], text: ["雨水把靴印变成了没有归属的泥泞。它们只证明有人曾在这里走过。", "Rain turns the boot prints into unowned mud. They prove only that someone walked here."] },
        { aliases: ["invoice", "invoices", "发票"], clues: ["marcus_invoice"], text: ["虚构供应商足以让马库斯害怕审计，却不解释锁着的书房。", "The fictitious suppliers give Marcus reason to fear an audit, but do not explain the locked study."] },
        { aliases: ["portrait", "克拉拉肖像", "肖像"], clues: ["clara_portrait"], text: ["肖像背面的字句像保护，也像威胁。", "The words on the portrait's reverse read like protection and like a threat."] }
    ];

    function say(zh, en = zh, style = "normal") {
        const line = document.createElement("div");
        line.className = "line " + style;
        line.dataset.zh = zh;
        line.dataset.en = en;
        line.textContent = uiEnglish ? en : zh;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    function clue(id) {
        if (game.clues.has(id)) return;
        game.clues.add(id);
        say("[记录] " + evidence[id][0], "[RECORDED] " + evidence[id][1], "important");
    }

    function hasCompleteCase() {
        return finalEvidenceGroups.every(group =>
            group.required.every(clueId => game.clues.has(clueId)) &&
            (group.optional || []).filter(clueId => game.clues.has(clueId)).length >= (group.minimumOptional || 0)
        );
    }

    function clean(text) { return text.toLowerCase().trim().replace(/\s+/g, " "); }

    function findPerson(text) {
        const aliases = { eleanor: "埃莉诺", daniel: "丹尼尔", clara: "克拉拉", victor: "维克多", marcus: "马库斯", lily: "莉莉", sophie: "索菲" };
        const target = clean(text);
        return Object.keys(people).find(id => target.includes(id) || target.includes(aliases[id]));
    }

    function updateStatus() {
        statusEl.textContent = game.solved ? (uiEnglish ? "CASE STATUS: SOLVED" : "案件状态：已侦破") : (uiEnglish ? "CASE STATUS: OPEN" : "案件状态：进行中");
    }

    function help() {
        say("命令\n\n查看  嫌疑人  交谈 [姓名]  提问 [姓名]\n搜查 [地点]  检查 [物品]  线索  时间线\n指控 [姓名]  状态  重启\n\n可从书房、大厅、图书馆、厨房、安保室、服务走廊、档案室、员工档案、卧室、温室和花园开始。\n\n例：搜查 书房、检查 B-17、检查吊坠、交谈 索菲。", "COMMANDS\n\nlook  suspects  talk [name]  question [name]\nexamine [place]  inspect [item]  clues  timeline\naccuse [name]  status  restart\n\nStart with the study, hall, library, kitchen, security room, service corridor, archive, employment records, bedrooms, conservatory, or garden.\n\nExamples: examine study, inspect B-17, inspect pendant, talk Sophie.", "system");
    }

    function talk(name) {
        const id = findPerson(name);
        if (!id) return say("找不到这个人。", "That person is not here.", "warning");
        const suspect = people[id];
        if (game.talked.has(id)) return say("对方正等着你的问题。", "They are waiting for your questions.", "muted");
        game.talked.add(id);
        say(`${suspect.zh}`, suspect.en, "system");
        say(suspect.intro[0], suspect.intro[1]);
        say(`输入“提问 ${suspect.zh}”继续。`, `Use: question ${suspect.en.split(" ")[0]}.`, "muted");
    }

    function question(name) {
        const id = findPerson(name);
        if (!id) return say("找不到这个人。", "That person is not here.", "warning");
        if (!game.talked.has(id)) return say("请先与对方交谈。", "Talk to them first.", "warning");
        const round = people[id].rounds[game.questioned[id] || 0];
        if (!round) return say("对方已没有更多可说。", "They have nothing further to add.", "muted");
        const [zh, en, discoveries, required = []] = round;
        if (required.some(clueId => !game.clues.has(clueId))) return say("你的证据还不足以追问这一点。", "You do not yet have enough evidence to press that point.", "warning");
        game.questioned[id] = (game.questioned[id] || 0) + 1;
        say(zh, en);
        discoveries.forEach(clue);
    }

    function examine(place) {
        const target = clean(place);
        if (/(study|书房|scene|现场)/.test(target)) {
            game.searched.add("study"); ["b17_key", "finger_cut", "whiskey", "watch", "lock", "red_herrings", "study_inventory"].forEach(clue);
            return say("书房没有闯入痕迹。桌上有 B-17 钥匙、半杯威士忌、停在 10:47 的怀表与折断的灯；埃德蒙右手食指有新伤。", "The study shows no sign of entry. Its desk holds the B-17 key, half a whisky, a watch stopped at 10:47, and a broken lamp; Edmund has a fresh finger cut.");
        }
        if (/(kitchen|厨房)/.test(target)) { game.searched.add("kitchen"); clue("kitchen_window"); return say("厨房狭长且没有窗户。你能听见风雨，却看不见天空。", "The kitchen is narrow and has no window. You can hear the storm but cannot see the sky."); }
        if (/(security|power|安保|电力)/.test(target)) { game.searched.add("security"); ["blackout", "security_gap"].forEach(clue); return say("配电记录只给出精确时间。厨房监控在断电后不久失去画面。", "The power log gives only precise times. Kitchen security loses its feed shortly after the outage."); }
        if (/(archive|storage|cabinet|档案|储藏|柜)/.test(target)) {
            if (!game.clues.has("b17_key")) return say("一排私人文件柜中有一格标着 B-17。", "One private document drawer is marked B-17.", "muted");
            game.searched.add("archive"); ["b17_contents", "m_hart", "old_photo"].forEach(clue);
            return say("钥匙打开 B-17。抽屉里没有直接答案，只有 M. Hart 的付款、出生记录、撕裂的信与旧照片。", "The key opens B-17. The drawer has no direct answer: only M. Hart payments, a birth record, torn letter, and old photograph.");
        }
        if (/(employment|servant|雇佣|员工)/.test(target)) { game.searched.add("employment"); clue("sophie_record"); return say("旧雇佣册有一处改写：玛格丽特·哈特的记录消失，索菲·里德出现在下一行。", "The old employment book contains a revision: Margaret Hart's record disappears and Sophie Reed appears on the next line."); }
        if (/(daniel|丹尼尔)/.test(target)) { game.searched.add("daniel"); ["daniel_debt", "will_page"].forEach(clue); return say("丹尼尔房间有催债函和撕下的遗嘱页。", "Daniel's room holds debt notices and a torn will page."); }
        if (/(clara|克拉拉)/.test(target)) { game.searched.add("clara"); ["clara_adoption", "diary"].forEach(clue); return say("克拉拉房间藏有收养文件、埃德蒙日记碎片，以及一幅背面写着字的童年肖像。", "Clara's room hides adoption records, an Edmund diary fragment, and a childhood portrait with writing on its reverse."); }
        if (/(victor|office|维克多|律师)/.test(target)) { game.searched.add("victor"); ["will_drafts", "victor_1998"].forEach(clue); return say("维克多办公室有两份不同的遗嘱草稿与 1998 年委托档案。", "Victor's office holds two different will drafts and a 1998 legal file."); }
        if (/(marcus|conservatory|温室|马库斯)/.test(target)) { game.searched.add("marcus"); ["marcus_fraud", "marcus_invoice", "muddy_boots"].forEach(clue); return say("温室一角散着公司账本；其中有资金缺口、虚构供应商发票和被雨水踩乱的靴印。", "A company ledger lies in the conservatory, with missing funds, fictitious-supplier invoices, and rain-trampled boot prints."); }
        if (/(dining|餐厅)/.test(target)) { game.searched.add("dining"); clue("eleanor_argument"); return say("餐厅壁炉里有半烧的便条和旧收据，说明埃莉诺在隐瞒事情，却不能说明她杀了人。", "The dining-room fire holds a half-burned note and old receipt. They show Eleanor hid something, not that she killed anyone."); }
        const location = extraLocations.find(entry => entry.aliases.some(alias => target.includes(alias)));
        if (location) {
            game.searched.add(location.id);
            location.clues.forEach(clue);
            return say(location.text[0], location.text[1]);
        }
        say("可搜查：书房、大厅、图书馆、厨房、安保室、服务走廊、档案室、员工档案、主卧、莉莉房间、客房、丹尼尔房间、克拉拉房间、维克多办公室、温室、花园或餐厅。", "Try: study, hall, library, kitchen, security, service corridor, archive, employment records, master bedroom, Lily's room, guest room, Daniel's room, Clara's room, Victor's office, conservatory, garden, or dining room.", "warning");
    }

    function inspect(item) {
        const target = clean(item);
        if (/(b-17|b17|key|钥匙)/.test(target)) { if (!game.clues.has("b17_key")) return say("先在书房找到钥匙。", "Find the key in the study first.", "warning"); clue("toxin_key"); return say("钥匙齿间有几乎看不见的未命名虚构接触性化合物残留。报告没有说明是谁留下的。", "The key's teeth carry nearly invisible residue of an unnamed fictional contact compound. The report does not say who left it."); }
        if (/(toxic|report|毒理|报告)/.test(target)) { if (!game.clues.has("finger_cut")) return say("先检查书房现场。", "Examine the study scene first.", "warning"); clue("toxicology"); return say("毒理报告把体内化合物与钥匙残留并列记录；镇静剂不是死因结论。", "Toxicology records the body compound alongside the key residue; the sedative is not identified as the cause of death."); }
        if (/(watch|怀表)/.test(target)) { clue("watch"); return say("维修单说明 10:47 是假时间线。", "The service slip makes 10:47 a false timeline."); }
        if (/(whisky|whiskey|威士忌)/.test(target)) { clue("whiskey"); return say("镇静剂制造了疑问，而不是答案。", "The sedative creates a question, not an answer."); }
        if (/(photo|照片)/.test(target)) { clue("old_photo"); return say("照片边缘裁掉了第三个人；背面的 M 可能是姓名，也可能毫无意义。", "The photo's edge cuts through a third figure; the M on its reverse may be a name, or nothing at all."); }
        const inspection = extraItems.find(entry => entry.aliases.some(alias => target.includes(alias)));
        if (inspection) {
            if ((inspection.requires || []).some(clueId => !game.clues.has(clueId))) return say("这个物品目前没有足够的背景可供解释。先检查相关地点或文件。", "You do not yet have enough context to interpret this item. Inspect the relevant place or document first.", "warning");
            inspection.clues.forEach(clue);
            return say(inspection.text[0], inspection.text[1]);
        }
        say("可检查：B-17 钥匙、毒理报告、怀表、威士忌、旧照片、吊坠、出生记录、撕裂的信、剪报、药房记录、阅读灯、填字游戏或镇纸。", "Try: B-17 key, toxicology report, watch, whisky, old photograph, pendant, birth record, torn letter, clipping, medicine record, lamp, crossword, or paperweight.", "warning");
    }

    function accuse(name) {
        const id = findPerson(name);
        if (!id) return say("请选择一名在场者。", "Choose someone present at the manor.", "warning");
        if (game.solved) return say("案件已侦破。", "The case is already solved.", "muted");
        game.accusations++;
        if (id !== "sophie") return say(`你指控了${people[id].zh}。这个理论有动机，也有谎言，但一个矛盾仍无法解释：谁在停电时接触了 B-17 钥匙？为何埃德蒙在锁门后才死去？你回到调查中。`, `You accuse ${people[id].en}. The theory has motive and lies, but one contradiction remains: who touched the B-17 key during the blackout, and why did Edmund die after locking the door? You return to the investigation.`, "danger");
        if (!hasCompleteCase()) return say("索菲的谎言令人不安，但你仍无法把她与停电机会、旧记录和死亡方式连在一起。", "Sophie's lie is troubling, but you cannot yet connect her to the blackout opportunity, old records, and death mechanism.", "warning");
        game.solved = true; updateStatus();
        say("案件侦破 - 黑棘庄园谋杀案", "CASE SOLVED - THE BLACKTHORN MANOR MURDER", "important");
        say("索菲·里德从来不是她真正的名字。\n\n她是玛格丽特·哈特：1998 年被埃德蒙付钱要求消失的女人，莉莉的母亲，在这座庄园等待二十多年的人。\n\n她知道埃德蒙会取用 B-17 钥匙，也知道停电会遮住服务走廊。她在黑暗中动了钥匙，又让威士忌使埃德蒙迟钝。埃德蒙带着手指的新伤处理钥匙；虚构接触性化合物进入体内。之后他自行锁进书房，毒性才发作。\n\n锁着的房间从来不是答案。它只是让所有人朝错误的方向看。", "Sophie Reed was never her real name.\n\nShe was Margaret Hart: the woman Edmund paid to disappear in 1998, Lily's mother, and the woman who waited in this manor for more than twenty years.\n\nShe knew Edmund would retrieve the B-17 key, and that the blackout would hide the service corridor. In darkness, she altered the key and used the whisky to make Edmund less alert. Edmund handled the key with a fresh finger cut; the fictional contact compound entered his body. He then locked himself in the study, where it took effect.\n\nThe locked room was never the answer. It was the distraction.");
        say("莉莉寻找母亲，却发现母亲始终站在庄园里。", "Lily came looking for her mother, only to find she had been standing in the manor all along.", "system");
    }

    function intro() {
        output.innerHTML = ""; updateStatus();
        say("案件档案 112 - 黑棘庄园谋杀案", "CASE FILE 112 - THE BLACKTHORN MANOR MURDER", "system");
        say("暴雨在晚上十点后切断了黑棘庄园与外界的联系。原定于今晚结束的家庭晚宴被埃德蒙·布莱克棘临时延长：他宣布将在翌日早晨处理遗嘱、公司账目和一桩二十多年前的私人事务。没有人知道他准备公开什么。", "After 10 PM, the storm cut Blackthorn Manor off from the outside world. A family dinner that should have ended was extended by Edmund Blackthorn, who announced that he would address his will, company accounts, and a private matter from more than twenty years ago the following morning. Nobody knows what he intended to reveal.");
        say("晚上 11:40，埃莉诺听见书房内传来重物倒下的声音。门从内部锁住；撞开后，埃德蒙已死在书桌旁。窗户完好，没有明显凶器，也没有人承认进入过房间。", "At 11:40 PM, Eleanor heard something heavy fall inside the study. The door was locked from within; when it was forced open, Edmund was dead beside his desk. The windows were intact, there was no obvious weapon, and nobody admits entering the room.");
        say("暴雨淹没了通往城镇的路。警方让你在援助抵达前维持现场：埃莉诺、丹尼尔、克拉拉、维克多、马库斯、莉莉和索菲都不能离开庄园。", "Flooded roads have cut off the town. Until help arrives, police have asked you to preserve the scene: Eleanor, Daniel, Clara, Victor, Marcus, Lily, and Sophie must all remain at the manor.", "important");
        say("你面对的不是一个简单的密室诡计。每个人都带着未说出口的过去；每件奇怪的物品也未必与谋杀有关。", "You are not facing a simple locked-room trick. Everyone carries an unspoken past, and not every strange object belongs to the murder.");
        say("输入“帮助”查看命令。", "Type 'help' to review commands.", "muted");
    }

    function status() { say(`案件状态\n\n记录：${game.clues.size}\n交谈对象：${game.talked.size}/7\n已搜查地点：${game.searched.size}\n指控次数：${game.accusations}\n案件：${game.solved ? "已侦破" : "进行中"}`, `CASE STATUS\n\nRecorded notes: ${game.clues.size}\nPeople interviewed: ${game.talked.size}/7\nPlaces searched: ${game.searched.size}\nAccusations: ${game.accusations}\nCase: ${game.solved ? "SOLVED" : "OPEN"}`); }

    function save() { localStorage.setItem(saveKey, JSON.stringify({ story: "blackthorn", clues: [...game.clues], talked: [...game.talked], questioned: game.questioned, searched: [...game.searched], accusations: game.accusations, solved: game.solved, output: output.innerHTML })); }
    function restore() {
        try {
            const saved = JSON.parse(localStorage.getItem(saveKey));
            if (!saved || saved.story !== "blackthorn") return false;
            game.clues = new Set(saved.clues || []); game.talked = new Set(saved.talked || []); game.questioned = saved.questioned || {}; game.searched = new Set(saved.searched || []); game.accusations = saved.accusations || 0; game.solved = Boolean(saved.solved); output.innerHTML = saved.output || ""; updateStatus(); return true;
        } catch { localStorage.removeItem(saveKey); return false; }
    }
    function restart() { game.clues.clear(); game.talked.clear(); game.questioned = {}; game.searched.clear(); game.accusations = 0; game.solved = false; intro(); save(); }

    window.updateTerminalLanguage = () => { output.querySelectorAll(".line").forEach(line => { line.textContent = uiEnglish ? line.dataset.en : line.dataset.zh; }); updateStatus(); };
    window.restartGame = restart;
    window.murderRunCommand = raw => {
        const command = clean(raw); if (!command) return; say("> " + raw, "> " + raw, "command");
        if (command === "help" || command === "帮助" || command === "?") help();
        else if (command === "look" || command === "overview" || command === "查看") intro();
        else if (command === "suspects" || command === "people" || command === "嫌疑人") say("在场者：埃莉诺、丹尼尔、克拉拉、维克多、马库斯、莉莉、索菲。", "PRESENT: Eleanor, Daniel, Clara, Victor, Marcus, Lily, Sophie.");
        else if (command === "clues" || command === "evidence" || command === "线索") { const notes = [...game.clues].map((id, index) => `${index + 1}. ${uiEnglish ? evidence[id][1] : evidence[id][0]}`).join("\n\n"); say(notes || (uiEnglish ? "No notes recorded yet." : "尚未记录线索。")); }
        else if (command === "timeline" || command === "time" || command === "时间线") say("可靠时间线：10:31:02 断电；10:31:09 备用电启动；10:32 厨房监控中断；10:38:44 主电恢复；11:40 发现尸体。怀表的 10:47 不可靠。", "RELIABLE TIMELINE: 10:31:02 outage; 10:31:09 backup power; 10:32 kitchen security disabled; 10:38:44 main power returns; 11:40 body discovered. The watch's 10:47 is unreliable.");
        else if (command === "status" || command === "状态") status();
        else if (command === "clear" || command === "清屏") output.innerHTML = "";
        else if (command === "restart" || command === "reset" || command === "重启") restart();
        else { let match = command.match(/^(talk|interview|交谈)\s+(.+)$/); if (match) talk(match[2]); else if ((match = command.match(/^(question|提问)\s+(.+)$/))) question(match[2]); else if ((match = command.match(/^(examine|搜查)\s+(.+)$/))) examine(match[2]); else if ((match = command.match(/^(inspect|检查)\s+(.+)$/))) inspect(match[2]); else if ((match = command.match(/^(accuse|指控)\s+(.+)$/))) accuse(match[2]); else say(`未知命令：“${raw}”`, `Unknown command: "${raw}". Type "help" for commands.`, "warning"); }
        window.gamePersistence?.save();
    };
    if (hasActiveSave) window.gamePersistence = { save, clear: () => localStorage.removeItem(saveKey) };
    commandForm.addEventListener("submit", event => { event.preventDefault(); const command = input.value.trim(); if (!command) return; input.value = ""; window.murderRunCommand(command); });
    document.addEventListener("click", () => { if (document.getElementById("saveDialog").classList.contains("hidden")) input.focus(); });
    if (!hasActiveSave || !restore()) intro();
    window.updateTerminalLanguage();
})();