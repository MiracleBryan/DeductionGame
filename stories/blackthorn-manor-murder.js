(() => {
    const output = document.getElementById("output");
    const input = document.getElementById("commandInput");
    const commandForm = document.getElementById("commandForm");
    const statusEl = document.getElementById("status");
    const saveKey = `deduction-game-progress-v1-${activeSaveId}`;
    const game = { clues: new Set(), talked: new Set(), asked: new Set(), searched: new Set(), accusations: 0, solved: false };
    const backgroundFacts = new Set(["body_discovery"]);

    const evidence = {
        b17_key: ["书房桌上的黄铜钥匙刻着 B-17。", "A brass key on the study desk is engraved B-17."],
        finger_cut: ["埃德蒙右手食指有一道新鲜的小伤口。", "Edmund has a small fresh cut on his right index finger."],
        whiskey: ["威士忌中只有埃德蒙按医嘱服用的镇静剂，没有其他毒物；它不能解释死亡。", "The whisky contains only Edmund's prescribed sedative, with no other toxin; it cannot explain the death."],
        watch: ["怀表停在 10:47；维修单证明它在案发前一天就已停走。", "The watch stopped at 10:47; a service slip proves it stopped the day before the murder."],
        lock: ["书房门从内部锁上，窗户完好。", "The study door was locked from inside and its windows are intact."],
        no_blunt_trauma: ["现场初检未发现钝器伤或搏斗痕迹；埃德蒙不是被物体击倒的。", "The initial examination found no blunt-force injury or signs of a struggle; Edmund was not struck or knocked down by an object."],
        kitchen_window: ["厨房没有窗户，无法从那里看见闪电。", "The kitchen has no window from which lightning could be seen."],
        blackout: ["电力日志：10:31:02 断电，10:31:09 备用电启动，10:38:44 主电恢复。", "Power log: outage at 10:31:02, backup power at 10:31:09, main power restored at 10:38:44."],
        security_gap: ["厨房监控于 10:32 失效；黑暗中有人可以通过服务走廊。", "Kitchen security failed at 10:32; someone could cross the service corridor in darkness."],
        b17_contents: ["B-17 抽屉内有旧照片、撕裂的信、出生记录和银行记录。", "The B-17 drawer contains an old photo, torn letter, birth record, and bank records."],
        m_hart: ["14/03/1998 至 14/07/1998：埃德蒙每月向 M.H. 账户支付 $5,000，随后付款停止。", "14/03/1998 to 14/07/1998: Edmund paid $5,000 monthly to an account under the initials M.H., then the payments stopped."],
        old_photo: ["照片中，年轻的埃德蒙、一名女子与婴儿站在一起；背面只写着 M。", "A photo shows a young Edmund with a woman and baby; its reverse says only M."],
        toxin_key: ["B-17 钥匙齿间有罕见接触性毒物的残留。", "The B-17 key carries residue of a rare contact poison."],
        toxicology: ["毒理报告在埃德蒙血液中检出同一种毒物。", "Toxicology detects the same poison in Edmund's blood."],
        sophie_record: ["旧雇佣册被涂改过：1998 年有一条以 Hart 为姓的离职记录，2002 年则记有索菲·里德入职；中间数页已被抽走。", "The old employment book has been altered: a 1998 departure entry is under the surname Hart, while a 2002 entry records Sophie Reed's hire; several pages in between have been removed."],
        eleanor_argument: ["埃莉诺与埃德蒙因遗嘱争吵；旧餐厅收据只是她弟弟参与的商务晚餐。", "Eleanor argued with Edmund about the will; the old restaurant receipt is only a business dinner with her brother."],
        daniel_debt: ["丹尼尔欠下约二十四万美元赌债。", "Daniel owes roughly $240,000 in gambling debt."],
        will_page: ["被撕下的遗嘱页将庄园的大部分留给一位姓 Hart 的受益人；埃德蒙批注：\"准备公开承认身份。\"", "A torn will page leaves most of the manor to a beneficiary named Hart. Edmund has annotated it: \"Public acknowledgment planned.\""],
        clara_adoption: ["克拉拉生于 1998 年，1999 年由布莱克棘家收养；社工记录确认她与埃德蒙没有血缘关系。", "Clara was born in 1998 and adopted by the Blackthorns in 1999; social-work records confirm she was not related to Edmund."],
        diary: ["埃德蒙 1998 年 3 月的日记提到一个孩子、一笔即将支付的款项，以及一个绝不能得知此事的人。名字被撕掉了。", "Edmund's March 1998 diary mentions a child, an imminent payment, and someone who must never learn of the arrangement. The names have been torn away."],
        will_drafts: ["早期遗嘱把庄园留给一位未说明关系的受益人；晚期版本改为布莱克棘家族。", "An early will leaves the manor to a beneficiary whose relationship is not stated; a later version changes it to the Blackthorn family."],
        victor_1998: ["维克多承认自己在 1998 年替埃德蒙处理过高度保密的私事。", "Victor admits handling a highly confidential matter for Edmund in 1998."],
        marcus_fraud: ["马库斯公司的账目存在资金缺口；1998 至 1999 年的人事页被抽走。", "Marcus's company books show a shortfall; personnel pages for 1998 to 1999 were removed."],
        lily_mother: ["莉莉说母亲名叫玛格丽特·哈特，并在她幼年时离开。", "Lily says her mother was Margaret Hart and left when Lily was young."],
        lily_birth: ["B-17 的出生记录将莉莉、1998 年与埃德蒙的付款联系在一起。", "The B-17 birth record connects Lily, 1998, and Edmund's payments."],
        sophie_statement: ["索菲称她停电时在厨房，并看见了闪电。", "Sophie says she was in the kitchen during the blackout and saw lightning."],
        sophie_lie: ["得知厨房没有窗户后，索菲改称自己记错了房间。", "After learning the kitchen has no window, Sophie says she remembered the room incorrectly."],
        sophie_identity: ["看到旧照片后，索菲对玛格丽特的名字明显失态。", "Seeing the old photo, Sophie is visibly shaken by Margaret's name."],
        lamp_fall: ["阅读灯的断口与地毯上的撞击痕迹相符；它是在埃德蒙倒下时折断的。", "The reading lamp's break matches the impact mark in the carpet; it broke when Edmund fell."],
        crossword_red_herring: ["未完成的填字游戏答案都是普通词汇；边角的墨迹与埃德蒙的钢笔一致。", "The unfinished crossword contains only ordinary words; its ink matches Edmund's pen."],
        paperweight_no_blood: ["马形镇纸很重，却没有血迹、裂痕或最近被移动的痕迹。", "The horse paperweight is heavy, but has no blood, cracks, or signs of recent movement."],
        electricity_bill: ["异常电费来自温室供暖系统的故障；维修记录显示它在案发一周前已修复。", "The unusual electricity bill comes from a conservatory-heating fault repaired a week before the murder."],
        pendant_fragment: ["大厅通往服务走廊的门边有一枚小型银质吊坠断扣，H 的刻字几乎磨平；门框上留有新划痕。", "A small silver pendant clasp lies by the hall door to the service corridor, its H engraving nearly rubbed away; the doorframe bears a fresh scrape."],
        pendant_initials: ["吊坠内侧刻着 M.H.；旧照片中的女子佩着同一枚月牙吊坠。", "The pendant's inside reads M.H.; the woman in the old photograph wears the same crescent pendant."],
        storm_register: ["门厅访客册显示暴雨前所有客人都已抵达；黑夜中没有新的访客。", "The hall register shows every guest arrived before the storm; nobody new entered in the night."],
        letter_fragment: ["撕裂的信中只剩一句：\"你不能把她从我身边买走，然后假装从未发生过。\"", "The torn letter preserves one line: \"You cannot buy her away from me and pretend it never happened.\""],
        birth_certificate: ["出生记录的母亲一栏写着 M.H.；父亲一栏留空。", "The birth record gives the mother's initials as M.H.; the father field is blank."],
        library_index: ["图书馆索引卡标记了一本被借走的 1998 年地方报纸合订本；归还日期旁有莉莉的铅笔记号。", "A library index card marks a borrowed volume of local newspapers from 1998; Lily's pencil notation appears beside its return date."],
        news_clipping: ["莉莉标记的 1998 年剪报报道黑棘公司慈善晚宴；埃德蒙身旁站着一名佩月牙吊坠的女子。", "The 1998 clipping marked by Lily covers a Blackthorn charity gala; beside Edmund stands a woman wearing a crescent pendant."],
        locked_plan_case: ["图书馆索引柜下有一个黄铜图纸盒，挂着四位数字锁。", "A brass plan case beneath the library index cabinet is secured with a four-digit padlock."],
        secret_room_map: ["图纸标出了图书馆壁炉后的暗门；可从服务走廊一侧进入。", "The plan marks a concealed door behind the library fireplace, accessible from the service corridor."],
        secret_room_ledger: ["暗室中的工资账显示：2002 年“索菲·里德”的档案编号沿用了 1998 年“玛格丽特·哈特”的编号。", "A payroll ledger in the hidden room shows that Sophie Reed's 2002 personnel file reused Margaret Hart's 1998 file number."],
        lily_notebook: ["莉莉的记者笔记把 M. Hart、1998 年付款、埃德蒙与图书馆报纸列在同一页；她正在追查母亲的过去。", "Lily's reporter notebook links M. Hart, the 1998 payments, Edmund, and the library newspaper; she has been tracing her mother's past."],
        medicine_log: ["药房收据与剩余药量吻合，确认威士忌中的镇静剂是埃德蒙正常服用的药物，而非第二种毒物。", "Pharmacy receipts and the remaining dose confirm that the sedative in the whisky was Edmund's normal medication, not a second poison."],
        service_latch: ["服务走廊门闩在停电时可从厨房一侧无声开启，黑暗中不会触发大厅的铃。", "The service-corridor latch can be opened silently from the kitchen side during an outage, without ringing the hall bell."],
        muddy_boots: ["温室门边的湿靴印尺寸与马库斯的靴子相符；他承认在暴雨中检查玻璃。", "Wet boot prints by the conservatory door match Marcus's boots; he admits checking the glass in the storm."],
        marcus_invoice: ["马库斯的发票记录了虚构供应商，说明他害怕审计，却与 1998 年的家庭秘密无关。", "Marcus's invoices record fictitious suppliers, explaining his fear of an audit but not the 1998 family secret."],
        clara_portrait: ["克拉拉幼年肖像背面写着：\"安全比真相重要。\" 社工笔迹将它与她的收养档案相连。", "The reverse of Clara's childhood portrait says, \"Safety matters more than truth.\" A social worker's handwriting links it to her adoption file."],
        bedroom_letter: ["埃德蒙卧室抽屉中的未寄出信承认他害怕莉莉知道自己的身世。", "An unsent letter in Edmund's bedroom admits he feared Lily learning her parentage."],
        greenhouse_shears: ["温室剪刀沾有植物树脂，没有血迹；它们最近只修剪过玫瑰。", "The greenhouse shears carry plant resin, not blood; they were recently used only on roses."],
        guest_brochure: ["客房欢迎册缺少服务走廊地图；内页的工作人员批注写着：\"壁炉路线仅限员工。\"", "The guest welcome book lacks its service-corridor map; a staff note inside reads, \"Fireplace route: staff only.\""]
    };

    const people = {
        eleanor: { zh: "埃莉诺·布莱克棘", en: "Eleanor Blackthorn", intro: ["埃德蒙的妻子。她不停转动婚戒，对今晚的行踪格外戒备。", "Edmund's wife. She keeps turning her wedding ring and evades questions about where she was tonight."], unknown: ["埃莉诺的手指停在婚戒上：“这与我无关。我不会陪你猜测。”", "Eleanor stills her hand on her wedding ring. \"That is not my concern. I will not indulge your speculation.\""], responses: [
            ["你问她今晚是否和埃德蒙起过争执。埃莉诺沉默片刻：“他要改遗嘱。我离开大厅一会儿，是为了不再听他威胁我。”", "You ask whether she argued with Edmund that night. Eleanor pauses. \"He was going to change the will. I left the hall for a while because I would not listen to him threaten me again.\"", []],
            ["埃莉诺压低声音：“餐厅壁炉里有一张我没来得及烧掉的收据。那是和弟弟的商务晚餐，不是情人；我要隐瞒的是婚姻破裂。”", "Eleanor lowers her voice. \"There is a receipt in the dining-room fire that I did not manage to burn. It was a business dinner with my brother, not a lover; what I hid was a collapsing marriage.\"", []],
            ["埃莉诺：“我一直觉得索菲留在这里不是为了工资。她太了解埃德蒙的深夜习惯，我却一直装作没看见。”", "Eleanor: \"I never believed Sophie stayed here for the wages. She knew Edmund's late-night habits too well, and I chose to ignore it.\"", []],
            ["埃莉诺说，11:40 左右她正在楼梯平台，随后听见书房传来一声沉闷的撞击。", "Eleanor says she was on the landing at about 11:40 when she heard a heavy thud from the study.", []]
        ] },
        daniel: { zh: "丹尼尔·布莱克棘", en: "Daniel Blackthorn", intro: ["埃德蒙的儿子。他脸色苍白，袖口沾着赌筹粉末。", "Edmund's son. He is pale, with gaming-chip dust clinging to his cuff."], unknown: ["丹尼尔皱起眉：“你为什么问我这个？去问真正知道的人。”", "Daniel frowns. \"Why bring that to me? Ask someone who actually knows.\""], responses: [
            ["丹尼尔：“我欠了钱。父亲不会再替我收拾残局。”", "Daniel: \"I owe money. Father would not clean up after me again.\"", ["daniel_debt"]],
            ["丹尼尔承认偷走遗嘱的一页。父亲正在改动继承安排，他害怕自己的份额被削减，却说没碰书房的钥匙。", "Daniel admits stealing a will page. His father was changing the inheritance arrangements, and Daniel feared his share would be reduced, but says he never touched the study key.", ["will_page"]],
            ["丹尼尔：“偷窃是真的；谋杀不是。”", "Daniel: \"The theft is real; murder is not.\"", []]
        ] },
        clara: { zh: "克拉拉·布莱克棘", en: "Clara Blackthorn", intro: ["埃德蒙的养女。她把一张旧照片按在膝头，不愿谈 1998 年。", "Edmund's adopted daughter. She clutches an old photograph to her lap and will not discuss 1998."], unknown: ["克拉拉避开你的目光：“我不知道。别把每个传闻都变成我的过去。”", "Clara looks away. \"I do not know. Please do not make every rumour part of my past.\""], responses: [
            ["克拉拉：“我的收养在 1999 年完成。埃德蒙从不许我问 1998 年。”", "Clara: \"My adoption was finalised in 1999. Edmund never allowed questions about 1998.\"", ["clara_adoption"]],
            ["克拉拉：“日记提到玛格丽特和一个孩子。我不是埃德蒙的女儿；我的收养档案早就写明了这一点。”", "Clara: \"The diary names Margaret and a child. I am not Edmund's daughter; my adoption file made that clear years ago.\"", ["diary"]],
            ["克拉拉：“肖像背后的字是社工写的，关于我的收养，不是关于莉莉。这里的秘密不止一个。”", "Clara: \"The words behind my portrait are the social worker's, about my adoption, not Lily. This house has more than one secret.\"", ["clara_portrait"]]
        ] },
        victor: { zh: "维克多·黑尔", en: "Victor Hale", intro: ["家族律师。他抱紧公文包，说遗嘱的改动都是埃德蒙的决定。", "The family lawyer. He grips his briefcase and says every change to the will was Edmund's decision."], unknown: ["维克多合上公文包：“我无法协助这种毫无依据的推断。”", "Victor closes his briefcase. \"I cannot assist with that unsupported line of inquiry.\""], responses: [
            ["维克多：“我在 1998 年代理过埃德蒙；那是一件必须保密的事。”", "Victor: \"I represented Edmund in 1998; it was a matter that had to remain confidential.\"", ["victor_1998"]],
            ["维克多承认两份遗嘱措辞不同，但否认伪造签名。", "Victor admits the will drafts differ, but denies forging a signature.", ["will_drafts"]],
            ["维克多：“我保护家族名声，不等于我杀了他。”", "Victor: \"Protecting the family name does not mean I killed him.\"", []]
        ] },
        marcus: { zh: "马库斯·格雷", en: "Marcus Gray", intro: ["埃德蒙的商业伙伴。他浑身湿透，说埃德蒙今晚叫他来解释公司账目。", "Edmund's business partner. Soaked to the skin, he says Edmund summoned him tonight to account for the company books."], unknown: ["马库斯擦去袖口的雨水：“那不是我的事。我只知道账目。”", "Marcus wipes rain from his cuff. \"That is not my business. I know the accounts, nothing else.\""], responses: [
            ["马库斯：“账目有问题。埃德蒙说明早就要把一切交给审计，这就是我今晚来庄园的原因。”", "Marcus: \"The books have problems. Edmund said he would hand everything to the auditors in the morning. That is why I came to the manor tonight.\"", ["marcus_fraud"]],
            ["马库斯：“有些孩子不该被用来惩罚父亲。”", "Marcus: \"Children should not be used to punish their fathers.\"", []],
            ["马库斯：“温室外的靴印是我的。我在检查被风吹裂的玻璃；我怕审计，不代表我杀了他。”", "Marcus: \"The boots by the conservatory are mine. I was checking storm damage to the glass. I feared the audit, but I did not kill him.\"", ["muddy_boots"]]
        ] },
        lily: { zh: "莉莉·哈特", en: "Lily Hart", intro: ["调查记者。她来追查母亲与埃德蒙的过往，却不知道自己为何被写进遗嘱。", "An investigative journalist. She came to investigate her mother's connection to Edmund, but does not know why she is named in the will."], unknown: ["莉莉摇头：“我来这里是为了母亲。这个问题我没有答案。”", "Lily shakes her head. \"I came here for my mother. I have no answer for that.\""], responses: [
            ["莉莉：“母亲叫玛格丽特·哈特，在我幼年时离开。”", "Lily: \"My mother was Margaret Hart. She left when I was very young.\"", ["lily_mother"]],
            ["莉莉看着 B-17 的出生记录和撕裂的信很久。付款记录让她第一次怀疑埃德蒙是自己的父亲。", "Lily studies the B-17 birth record and torn letter for a long time. The payments make her suspect for the first time that Edmund was her father.", ["lily_birth"]],
            ["莉莉：“我来找母亲，没想到找到的是一座庄园的谎言。”", "Lily: \"I came looking for my mother, not a manor built on lies.\"", []]
        ] },
        sophie: { zh: "索菲·里德", en: "Sophie Reed", intro: ["庄园管家。她的制服一尘不染，称自己已在此工作二十二年。", "The housekeeper. Her uniform is immaculate; she says she has worked here for twenty-two years."], unknown: ["索菲整理好袖口：“恐怕我帮不上这个忙，侦探。”", "Sophie smooths her cuff. \"I'm afraid I can't help you with that, detective.\""], responses: [
            ["索菲：“停电时我在厨房。闪电照亮了窗外。”", "Sophie: \"I was in the kitchen during the blackout. I saw lightning outside.\"", ["sophie_statement"]],
            ["索菲：“厨房没有窗户？我一定记错了房间。那晚太乱了。”", "Sophie: \"The kitchen has no window? I must have remembered the room incorrectly. It was a chaotic night.\"", ["sophie_lie"]],
            ["看到照片和吊坠后，索菲失去镇定：\"有些名字埋得太久，最后会变成另一个人。\"", "Seeing the photograph and pendant, Sophie loses composure: \"Some names are buried so long that they become another person.\"", ["sophie_identity"]]
        ] }
    };

    const conversationTopics = {
        eleanor: [
            { en: "argument", zh: "争执", aliases: ["argument", "dispute", "争执", "争吵"], responseIndex: 0, requires: ["eleanor_argument"] },
            { en: "receipt", zh: "收据", aliases: ["receipt", "dining", "收据", "餐厅"], responseIndex: 1, requires: ["eleanor_argument"] },
            { en: "Sophie", zh: "索菲", aliases: ["sophie", "索菲", "housekeeper", "管家"], responseIndex: 2, requires: ["sophie_record"] },
            { en: "11:40", zh: "11:40", aliases: ["11:40", "11.40", "11 40", "time", "when", "时间", "几点", "何时", "11点40", "十一点四十"], responseIndex: 3, requires: ["body_discovery"] }
        ],
        daniel: [
            { en: "debts", zh: "赌债", aliases: ["debt", "debts", "gambling", "赌债", "欠款"], responseIndex: 0, requires: ["daniel_debt"] },
            { en: "will", zh: "遗嘱", aliases: ["will", "inheritance", "遗嘱", "继承"], responseIndex: 1, requires: ["will_page"] },
            { en: "theft", zh: "偷窃", aliases: ["theft", "steal", "偷窃", "偷走"], responseIndex: 2, requires: ["will_page"] }
        ],
        clara: [
            { en: "adoption", zh: "收养", aliases: ["adoption", "adopted", "收养"], responseIndex: 0, requires: ["clara_adoption"] },
            { en: "diary", zh: "日记", aliases: ["diary", "journal", "日记"], responseIndex: 1, requires: ["diary"] },
            { en: "portrait", zh: "肖像", aliases: ["portrait", "painting", "肖像", "画像"], responseIndex: 2, requires: ["clara_portrait"] }
        ],
        victor: [
            { en: "1998 arrangement", zh: "1998 年的事", aliases: ["1998", "arrangement", "matter", "confidential", "1998 年", "1998年的事", "保密"], responseIndex: 0, requires: ["victor_1998"] },
            { en: "will", zh: "遗嘱", aliases: ["will", "draft", "遗嘱", "草稿"], responseIndex: 1, requires: ["will_drafts"] },
            { en: "reputation", zh: "名声", aliases: ["reputation", "family", "名声", "家族"], responseIndex: 2, requires: ["will_drafts"] }
        ],
        marcus: [
            { en: "accounts", zh: "账目", aliases: ["accounts", "books", "audit", "账目", "审计"], responseIndex: 0, requires: ["marcus_fraud"] },
            { en: "family secret", zh: "家族秘密", aliases: ["family secret", "child", "children", "家族秘密", "那个孩子", "孩子"], responseIndex: 1, requires: ["diary"] },
            { en: "boots", zh: "靴印", aliases: ["boots", "footprints", "靴印", "脚印"], responseIndex: 2, requires: ["muddy_boots"] }
        ],
        lily: [
            { en: "mother", zh: "母亲", aliases: ["mother", "margaret", "母亲", "玛格丽特"], responseIndex: 0, requires: ["lily_notebook"] },
            { en: "birth record", zh: "出生记录", aliases: ["birth", "record", "出生", "记录"], responseIndex: 1, requires: ["m_hart", "birth_certificate", "letter_fragment"] },
            { en: "investigation", zh: "调查", aliases: ["investigation", "why", "调查", "原因"], responseIndex: 2, requires: ["lily_notebook"] }
        ],
        sophie: [
            { en: "blackout", zh: "停电", aliases: ["blackout", "outage", "停电", "断电"], responseIndex: 0, requires: ["blackout"] },
            { en: "kitchen", zh: "厨房", aliases: ["kitchen", "lightning", "厨房", "闪电"], responseIndex: 1, requires: ["kitchen_window"] },
            { en: "Margaret", zh: "玛格丽特", aliases: ["margaret", "photo", "pendant", "玛格丽特", "照片", "吊坠"], responseIndex: 2, requires: ["old_photo", "m_hart", "pendant_initials"] }
        ]
    };

    const finalEvidenceGroups = [
        { required: ["b17_key", "finger_cut", "lock", "toxin_key", "toxicology"], optional: ["whiskey", "medicine_log"], minimumOptional: 1 },
        { required: ["blackout", "security_gap", "service_latch", "kitchen_window", "sophie_statement", "sophie_lie"] },
        { required: ["b17_contents", "m_hart", "lily_birth", "sophie_record", "pendant_initials", "secret_room_ledger", "sophie_identity"], optional: ["birth_certificate", "letter_fragment", "news_clipping"], minimumOptional: 2 }
    ];

    const extraLocations = [
        { id: "hall", aliases: ["hall", "hallway", "foyer", "大厅", "门厅"], clues: ["pendant_fragment", "storm_register"], text: ["主大厅的地毯被来回踩乱。通往服务走廊的门边有访客册、一枚断开的银质吊坠扣和一道新划痕。", "The main-hall carpet is churned by passing feet. By the door to the service corridor sit the visitor register, a broken silver pendant clasp, and a fresh scrape."] },
        { id: "library", aliases: ["library", "图书馆"], clues: ["library_index"], text: ["图书馆里一排索引卡仍按年份排序。1998 年的地方报纸合订本被人取走；归还日期旁有莉莉的铅笔记号。", "The library index cards remain sorted by year. A bound volume of local newspapers from 1998 was taken out; Lily's pencil mark sits beside its return date."] },
        { id: "master-bedroom", aliases: ["master bedroom", "master", "主卧", "埃德蒙卧室"], clues: ["bedroom_letter"], text: ["埃德蒙的卧室整洁得近乎刻意。抽屉深处有一封未寄出的信。", "Edmund's bedroom is unnaturally neat. An unsent letter rests at the back of a drawer."] },
        { id: "service-corridor", aliases: ["service corridor", "service", "服务走廊", "后勤走廊"], clues: ["service_latch"], text: ["服务走廊连接厨房、档案室和书房附近的后门。门闩磨得几乎能无声开启。", "The service corridor links the kitchen, archive, and a rear door near the study. Its worn latch can be opened almost silently."] },
        { id: "lily-room", aliases: ["lily room", "lily's room", "莉莉房间", "莉莉的房间"], clues: ["lily_notebook"], text: ["莉莉的临时客房堆满采访笔记。她记录了母亲、埃德蒙与图书馆那份 1998 年报纸之间的联系。", "Lily's temporary room is crowded with reporting notes. She has traced a connection among her mother, Edmund, and the library's 1998 newspaper."] },
        { id: "guest-room", aliases: ["guest room", "guest", "客房"], clues: ["guest_brochure"], text: ["客房欢迎册缺少服务走廊地图；内页的工作人员批注写着：\"壁炉路线仅限员工。\"", "The guest welcome book is missing its service-corridor map. A staff note inside reads, \"Fireplace route: staff only.\""] },
        { id: "garden", aliases: ["garden", "grounds", "花园", "庭院"], clues: ["greenhouse_shears"], text: ["花园被风雨打得凌乱。温室门边放着一把修枝剪。", "The garden is battered by rain. A pair of pruning shears rests by the conservatory door."] }
    ];

    const extraItems = [
        { aliases: ["lamp", "阅读灯", "台灯"], clues: ["lamp_fall"], text: ["灯的断口和地毯上的撞击痕迹吻合。它在埃德蒙倒下时折断。", "The lamp break matches an impact mark in the carpet. It broke when Edmund fell."] },
        { aliases: ["crossword", "填字游戏"], clues: ["crossword_red_herring"], text: ["填字游戏的字迹与埃德蒙的钢笔一致，所有答案都很普通；它只是他倒下前留下的日常痕迹。", "The crossword's ink matches Edmund's pen and every answer is ordinary. It is simply part of his routine before he collapsed."] },
        { aliases: ["paperweight", "horse", "镇纸", "马形"], clues: ["paperweight_no_blood"], text: ["镇纸很重，却没有近期移动、撞击或血迹的痕迹；结合没有钝器伤，它可以排除为凶器。", "The paperweight is heavy but shows no sign of recent movement, impact, or blood. With no blunt-force injury, it can be ruled out as the weapon."] },
        { aliases: ["electricity bill", "bill", "电费", "账单"], clues: ["electricity_bill"], text: ["高额电费来自温室供暖故障；维修记录显示它在案发一周前已修复。", "The high bill comes from a conservatory-heating fault repaired a week before the murder."] },
        { aliases: ["torn letter", "letter", "撕裂的信", "信件"], requires: ["b17_contents"], clues: ["letter_fragment"], text: ["信纸只能拼出一句控诉，署名和日期都被撕走。", "The fragments preserve only one accusation; the signature and date are gone."] },
        { aliases: ["birth record", "birth certificate", "出生记录", "出生证明"], requires: ["b17_contents"], clues: ["birth_certificate"], text: ["出生记录没有写下父亲的名字，却让 1998 年的付款有了新的意义。", "The birth record names no father, but gives the 1998 payments new significance."] },
        { aliases: ["pendant", "clasp", "吊坠", "断扣"], requires: ["old_photo"], clues: ["pendant_initials"], text: ["清理吊坠内侧后，M.H. 两个字母出现；照片里的月牙吊坠也有同样的缺口。", "After cleaning the inside of the clasp, the initials M.H. appear. The crescent pendant in the photograph has the same missing clasp."] },
        { aliases: ["newspaper", "clipping", "报纸", "剪报"], requires: ["library_index"], clues: ["news_clipping"], text: ["莉莉取出的 1998 年剪报没有写出女子姓名，却让月牙吊坠在照片与旧事之间再次出现。", "The 1998 clipping Lily retrieved does not name the woman, but ties the crescent pendant to the old records once more."] },
        { aliases: ["plan case", "case", "padlock", "图纸盒", "图纸", "数字锁"], requires: ["library_index"], clues: ["locked_plan_case"], text: ["索引柜下的黄铜图纸盒挂着四位数字锁。盒盖压印着：HART / 律师 / 年份。", "The brass plan case under the index cabinet is secured with a four-digit padlock. Its lid is stamped: HART / COUNSEL / YEAR."] },
        { aliases: ["medicine", "prescription", "药", "处方"], clues: ["medicine_log"], text: ["药房记录与剩余药量相符：镇静剂是埃德蒙的日常药物，并非另一种被人加入的毒物。", "The pharmacy record matches the remaining medication: the sedative was Edmund's routine treatment, not another poison added by someone else."] },
        { aliases: ["latch", "service door", "门闩", "服务门"], requires: ["service_latch"], clues: [], text: ["门闩可以在黑暗中无声开启；走廊绕开了大厅和大多数人的视线。", "The latch can be opened silently in darkness; the corridor keeps clear of the hall and most sightlines."] },
        { aliases: ["boots", "footprints", "靴印", "脚印"], clues: ["muddy_boots"], text: ["靴印与马库斯的鞋底相符；它们支持他的温室说法，而不是通往书房的路线。", "The boot prints match Marcus's soles; they support his conservatory account, not a route to the study."] },
        { aliases: ["invoice", "invoices", "发票"], clues: ["marcus_invoice"], text: ["虚构供应商足以让马库斯害怕审计，也解释了他为何受埃德蒙传唤；但它们无法解释锁着的书房。", "The fictitious suppliers explain Marcus's fear of an audit and why Edmund summoned him, but not the locked study."] },
        { aliases: ["portrait", "克拉拉肖像", "肖像"], clues: ["clara_portrait"], text: ["肖像背后的字是社工关于克拉拉收养的提醒；它解释了她的秘密，却与莉莉的身世不同。", "The words behind the portrait are a social worker's note about Clara's adoption; they explain her secret, but not Lily's parentage."] }
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

    function findTopic(id, text) {
        const target = clean(text);
        return (conversationTopics[id] || []).find(topic => topic.aliases.some(alias => target.includes(clean(alias))));
    }

    function factIsKnown(id) {
        return backgroundFacts.has(id) || game.clues.has(id);
    }

    function topicIsAvailable(topic) {
        return (topic.requires || []).every(factIsKnown);
    }

    function showTopicKeywords() {
        const topics = Object.values(conversationTopics).flat().filter(topicIsAvailable);
        const zhTopics = [...new Set(topics.map(topic => topic.zh))].join("、");
        const enTopics = [...new Set(topics.map(topic => topic.en))].join(", ");
        say(zhTopics ? `已知话题关键词：${zhTopics}。` : "尚未发现可追查的话题关键词。", enTopics ? `Known topic keywords: ${enTopics}.` : "No topic keywords have been discovered yet.", "muted");
    }

    function showTimeline() {
        const zh = ["约晚上 10 点后，暴雨切断庄园与外界的联系。", "11:40，埃莉诺听见书房内传来重物倒下的声音；随后发现埃德蒙死亡。"];
        const en = ["After about 10 PM, the storm cut the manor off from the outside world.", "At 11:40 PM, Eleanor heard something heavy fall in the study; Edmund was then found dead."];
        if (game.clues.has("blackout")) {
            zh.push("10:31:02 断电；10:31:09 备用电启动；10:38:44 主电恢复。");
            en.push("10:31:02 outage; 10:31:09 backup power begins; 10:38:44 main power returns.");
        }
        if (game.clues.has("security_gap")) {
            zh.push("10:32，厨房监控失去画面。");
            en.push("At 10:32, kitchen security loses its feed.");
        }
        if (game.clues.has("watch")) {
            zh.push("怀表显示的 10:47 不可靠：它在案发前一天就已停走。");
            en.push("The watch's 10:47 is unreliable: it stopped the day before the murder.");
        }
        say(`时间线\n\n${zh.join("\n")}`, `TIMELINE\n\n${en.join("\n")}`);
    }

    function updateStatus() {
        statusEl.textContent = game.solved ? (uiEnglish ? "CASE STATUS: SOLVED" : "案件状态：已侦破") : (uiEnglish ? "CASE STATUS: OPEN" : "案件状态：进行中");
    }

    function help() {
        say("命令\n\n查看  嫌疑人  话题  交谈 [姓名] 关于 [主题]\n询问 [姓名] 关于 [主题]\n搜查 [地点]  检查 [物品]  解锁 [物品] [四位密码]\n线索  时间线  指控 [姓名]  状态  重启\n\n“话题”只列出已知关键词，不会说明谁知道答案。\n\n例：话题、交谈 索菲 关于 停电、搜查 书房、检查 B-17。", "COMMANDS\n\nlook  suspects  topics  talk [name] about [topic]\nask [name] about [topic]\nexamine [place]  inspect [item]  unlock [item] [four-digit code]\nclues  timeline  accuse [name]  status  restart\n\n\"topics\" lists known keywords without revealing who can answer them.\n\nExamples: topics, talk Sophie about blackout, examine study, inspect B-17.", "system");
    }

    function talk(name) {
        const id = findPerson(name);
        if (!id) return say("找不到这个人。", "That person is not here.", "warning");
        const suspect = people[id];
        if (game.talked.has(id)) return say("对方等着你提出具体的话题。", "They are waiting for you to raise a specific subject.", "muted");
        game.talked.add(id);
        say(`${suspect.zh}`, suspect.en, "system");
        say(suspect.intro[0], suspect.intro[1]);
        say("对方等着你提出具体的话题。", "They are waiting for you to raise a specific subject.", "muted");
    }

    function question(name, topicText) {
        const id = findPerson(name);
        if (!id) return say("找不到这个人。", "That person is not here.", "warning");
        if (!topicText) return say("请说明你想问的主题。", "Name a topic you want to discuss.", "warning");
        if (!game.talked.has(id)) talk(name);
        const topic = findTopic(id, topicText);
        if (!topic || !topicIsAvailable(topic)) return say(...people[id].unknown);
        const askedKey = `${id}:${topic.en}`;
        if (game.asked.has(askedKey)) return say("你已经问过这个主题。", "You have already discussed that topic.", "muted");
        const [zh, en, discoveries] = people[id].responses[topic.responseIndex];
        game.asked.add(askedKey);
        say(`你询问${people[id].zh}关于${topic.zh}。`, `You ask ${people[id].en} about ${topic.en}.`, "muted");
        say(zh, en);
        discoveries.forEach(clue);
    }

    function examine(place) {
        const target = clean(place);
        if (/(secret room|hidden room|密室|暗室|暗门)/.test(target)) {
            if (!game.clues.has("secret_room_map")) return say("你还没有找到通往暗室的入口。", "You have not found a way into a hidden room yet.", "warning");
            game.searched.add("secret-room"); clue("secret_room_ledger");
            return say("图书馆壁炉后的窄室积满灰尘。里面有一册未编目的工资账，证明“索菲·里德”沿用了玛格丽特·哈特的档案编号。", "The narrow room behind the library fireplace is thick with dust. An unindexed payroll ledger proves that Sophie Reed reused Margaret Hart's personnel file number.");
        }
        if (/(study|书房|scene|现场)/.test(target)) {
            game.searched.add("study"); ["b17_key", "finger_cut", "whiskey", "watch", "lock", "no_blunt_trauma"].forEach(clue);
            return say("书房没有闯入痕迹。桌上有 B-17 钥匙、半杯威士忌、停在 10:47 的怀表与折断的灯；埃德蒙右手食指有新伤。", "The study shows no sign of entry. On the desk lie the B-17 key, a half-full glass of whisky, a watch stopped at 10:47, and a broken lamp; Edmund has a fresh cut on his right index finger.");
        }
        if (/(kitchen|厨房)/.test(target)) { game.searched.add("kitchen"); clue("kitchen_window"); return say("厨房狭长且没有窗户。你能听见风雨，却看不见天空。", "The kitchen is narrow and has no window. You can hear the storm but cannot see the sky."); }
        if (/(security|power|安保|电力)/.test(target)) { game.searched.add("security"); ["blackout", "security_gap"].forEach(clue); return say("配电记录明确了精确时间。厨房监控在断电后不久失去画面。", "The power log establishes precise timings. Kitchen security loses its feed shortly after the outage."); }
        if (/(employment|servant|雇佣|员工)/.test(target)) { game.searched.add("employment"); clue("sophie_record"); return say("旧雇佣册被涂改过：1998 年有一条以 Hart 为姓的离职记录，2002 年则记有索菲·里德入职；中间数页已被抽走。", "The old employment book has been altered: a 1998 departure record bears the surname Hart, while a 2002 entry records Sophie Reed's hire; several pages between them have been removed."); }
        if (/(archive|storage|cabinet|档案|储藏|柜)/.test(target)) {
            if (!game.clues.has("b17_key")) return say("一排私人文件柜中有一格标着 B-17。", "One private document drawer is marked B-17.", "muted");
            game.searched.add("archive"); ["b17_contents", "m_hart", "old_photo"].forEach(clue);
            return say("钥匙打开 B-17。抽屉里没有直接答案，只有 M. Hart 的付款、出生记录、撕裂的信与旧照片。", "The key opens B-17. The drawer has no direct answer: only M. Hart payments, a birth record, torn letter, and old photograph.");
        }
        if (/(daniel|丹尼尔)/.test(target)) { game.searched.add("daniel"); ["daniel_debt", "will_page"].forEach(clue); return say("丹尼尔房间有催债函和撕下的遗嘱页。", "Daniel's room holds debt notices and a torn will page."); }
        if (/(clara|克拉拉)/.test(target)) { game.searched.add("clara"); ["clara_adoption", "diary"].forEach(clue); return say("克拉拉房间藏有收养文件、被撕过的埃德蒙日记碎片，以及一幅背面写着字的童年肖像。", "Clara's room hides adoption records, a torn page from Edmund's diary, and a childhood portrait bearing a note on its reverse."); }
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

    function unlock(item, code) {
        const target = clean(item);
        if (!/(plan|case|padlock|图纸|盒|锁)/.test(target)) return say("这里没有可用这个密码打开的锁。", "There is no lock here that uses that code.", "warning");
        if (!game.clues.has("locked_plan_case")) return say("你还没有找到需要解锁的图纸盒。", "You have not found the plan case that needs unlocking.", "warning");
        if (!game.clues.has("m_hart") || !game.clues.has("victor_1998")) return say("盒盖写着“哈特 / 律师 / 年份”。你认得哈特的名字，但还需要维克多对 1998 年的证词。", "The lid reads HART / COUNSEL / YEAR. You recognise Hart's name, but still need Victor's testimony about 1998.", "warning");
        if (code !== "1998") return say("数字锁没有打开。回到记录与证词，确认年份。", "The padlock does not open. Recheck the records and testimony for the year.", "warning");
        if (game.clues.has("secret_room_map")) return say("图纸盒已经打开。图纸标出了图书馆壁炉后的暗门。", "The plan case is already open. Its plan marks the concealed door behind the library fireplace.", "muted");
        clue("secret_room_map");
        return say("锁扣弹开。图纸显示图书馆壁炉后有一间暗室，入口在服务走廊一侧。", "The padlock springs open. The plan shows a hidden room behind the library fireplace, entered from the service corridor.", "important");
    }

    function inspect(item) {
        const target = clean(item);
        if (/(b-17|b17|key|钥匙)/.test(target)) { if (!game.clues.has("b17_key")) return say("先在书房找到钥匙。", "Find the key in the study first.", "warning"); clue("toxin_key"); return say("钥匙齿间有几乎看不见的罕见接触性毒物残留。报告没有说明是谁留下的。", "The key's teeth carry nearly invisible residue of a rare contact poison. The report does not identify who left it."); }
        if (/(toxic|report|毒理|报告)/.test(target)) { if (!game.clues.has("finger_cut")) return say("先检查书房现场。", "Examine the study scene first.", "warning"); clue("toxicology"); return say("毒理报告显示他血液中的毒物与钥匙残留相同；镇静剂并非死因。", "Toxicology matches the poison in Edmund's blood to residue on the key; the sedative is not the cause of death."); }
        if (/(watch|怀表)/.test(target)) { clue("watch"); return say("维修记录显示怀表在案发前一天就已停走；10:47 与今晚无关。", "The service record shows the watch stopped the day before the murder; 10:47 has nothing to do with tonight."); }
        if (/(whisky|whiskey|威士忌)/.test(target)) { clue("whiskey"); return say("威士忌里只有埃德蒙的常规药物；它排除了酒中投毒这一条路。", "The whisky contains only Edmund's routine medication; it rules out poison in the drink."); }
        if (/(photo|照片)/.test(target)) { clue("old_photo"); return say("照片边缘裁掉了第三个人；背面的 M 可能是姓名，也可能毫无意义。", "The photo's edge cuts through a third figure; the M on its reverse may be a name, or nothing at all."); }
        const inspection = extraItems.find(entry => entry.aliases.some(alias => target.includes(alias)));
        if (inspection) {
            if ((inspection.requires || []).some(clueId => !game.clues.has(clueId))) return say("这个物品目前没有足够的背景可供解释。先检查相关地点或文件。", "You do not yet have enough context to interpret this item. Inspect the relevant place or document first.", "warning");
            inspection.clues.forEach(clue);
            return say(inspection.text[0], inspection.text[1]);
        }
        say("可检查：B-17 钥匙、毒理报告、怀表、威士忌、旧照片、吊坠、出生记录、撕裂的信、剪报、图纸盒、药房记录、阅读灯、填字游戏或镇纸。", "Try: B-17 key, toxicology report, watch, whisky, old photograph, pendant, birth record, torn letter, clipping, plan case, medicine record, lamp, crossword, or paperweight.", "warning");
    }

    function accuse(name) {
        const id = findPerson(name);
        if (!id) return say("请选择一名在场者。", "Choose someone present at the manor.", "warning");
        if (game.solved) return say("案件已侦破。", "The case is already solved.", "muted");
        game.accusations++;
        if (id !== "sophie") return say(`你指控了${people[id].zh}。这个理论有动机，也有谎言，但一个矛盾仍无法解释：谁在停电时接触了 B-17 钥匙？为何埃德蒙在锁门后才死去？你回到调查中。`, `You accuse ${people[id].en}. The theory has motive and lies, but one contradiction remains: who touched the B-17 key during the blackout, and why did Edmund die only after locking himself inside? You return to the investigation.`, "danger");
        if (!hasCompleteCase()) return say("索菲的谎言令人不安，但你仍无法把她与停电机会、旧记录和死亡方式连在一起。", "Sophie's lie is troubling, but you cannot yet connect her to the blackout opportunity, old records, and death mechanism.", "warning");
        game.solved = true; updateStatus();
        say("案件侦破 - 黑棘庄园谋杀案", "CASE SOLVED - THE BLACKTHORN MANOR MURDER", "important");
        say("索菲·里德不是她真正的名字，而是玛格丽特·哈特重返庄园时使用的身份。\n\n1998 年，埃德蒙付钱逼她离开莉莉，并从黑棘家的生活中消失。后来，她改名受雇回到庄园，多年来一直等待让他为此负责的机会。暗室里的工资账证明，她正是以“索菲·里德”之名重新受雇。\n\n她知道埃德蒙会取用 B-17 钥匙，也知道停电会掩护服务走廊。趁黑暗，她在钥匙上涂了罕见的接触性毒物。埃德蒙带着食指上的新伤触碰钥匙，毒物因而进入血液；他回到书桌前，自行锁进书房，毒性发作后倒下。\n\n锁着的房间从来不是答案。它只是让所有人朝错误的方向看。", "Sophie Reed was the name Margaret Hart used when she returned to the manor.\n\nIn 1998, Edmund paid her to leave Lily and disappear from the Blackthorn family's life. She later returned to the manor under an assumed name and waited years for a chance to hold him to account. The payroll ledger in the hidden room proves that she was rehired as Sophie Reed.\n\nShe knew Edmund would retrieve the B-17 key, and that the blackout would conceal the service corridor. In darkness, she coated the key with a rare contact poison. Edmund touched the key with a fresh cut on his index finger, allowing the poison into his bloodstream. He then returned to his desk, locked himself in the study, and collapsed when it took effect.\n\nThe locked room was never the answer. It was the distraction.");
        say("莉莉一直在寻找母亲，最后才发现母亲原来就在庄园里。", "Lily had spent years looking for her mother, only to learn that she had been in the manor all along.", "system");
    }

    function intro() {
        output.innerHTML = ""; updateStatus();
        say("案件档案 112 - 黑棘庄园谋杀案", "CASE FILE 112 - THE BLACKTHORN MANOR MURDER", "system");
        say("暴雨在晚上十点后切断了黑棘庄园与外界的联系。原定于今晚结束的家庭晚宴被埃德蒙·布莱克棘临时延长：他宣布将在翌日早晨处理遗嘱、公司账目和一桩二十多年前的私人事务。没有人知道他准备公开什么。", "After 10 PM, the storm cut Blackthorn Manor off from the outside world. What should have been the end of a family dinner became a longer evening when Edmund Blackthorn announced that, the following morning, he would settle questions of his will, the company accounts, and a private matter more than two decades old. No one knows what he planned to reveal.");
        say("晚上 11:40，埃莉诺听见书房内传来重物倒下的声音。门从内部锁住；撞开后，埃德蒙已死在书桌旁。窗户完好，没有明显凶器，也没有人承认进入过房间。", "At 11:40 PM, Eleanor heard something heavy fall inside the study. The door was locked from within; when it was forced open, Edmund was dead beside his desk. The windows were intact, there was no obvious weapon, and nobody admits entering the room.");
        say("通往城镇的道路已被洪水淹没。警方让你在援助抵达前负责保护现场：埃莉诺、丹尼尔、克拉拉、维克多、马库斯、莉莉和索菲都不能离开庄园。", "Flooded roads have cut off the town. Until help arrives, police have placed you in charge of preserving the scene: Eleanor, Daniel, Clara, Victor, Marcus, Lily, and Sophie must all remain at the manor.", "important");
        say("你面对的不是一个简单的密室诡计。每个人都带着未说出口的过去；每件可疑物品也未必与谋杀有关。", "You are not facing a simple locked-room trick. Everyone carries an unspoken past, and not every suspicious object is relevant to the murder.");
        say("输入“帮助”查看命令。", "Type 'help' to review commands.", "muted");
    }

    function status() { say(`案件状态\n\n记录：${game.clues.size}\n交谈对象：${game.talked.size}/7\n已搜查地点：${game.searched.size}\n指控次数：${game.accusations}\n案件：${game.solved ? "已侦破" : "进行中"}`, `CASE STATUS\n\nRecorded notes: ${game.clues.size}\nPeople interviewed: ${game.talked.size}/7\nPlaces searched: ${game.searched.size}\nAccusations: ${game.accusations}\nCase: ${game.solved ? "SOLVED" : "OPEN"}`); }

    function save() { localStorage.setItem(saveKey, JSON.stringify({ story: "blackthorn", clues: [...game.clues], talked: [...game.talked], asked: [...game.asked], searched: [...game.searched], accusations: game.accusations, solved: game.solved, output: output.innerHTML })); }
    function restore() {
        try {
            const saved = JSON.parse(localStorage.getItem(saveKey));
            if (!saved || saved.story !== "blackthorn") return false;
            game.clues = new Set(saved.clues || []); game.talked = new Set(saved.talked || []); game.asked = new Set(saved.asked || []); game.searched = new Set(saved.searched || []); game.accusations = saved.accusations || 0; game.solved = Boolean(saved.solved); output.innerHTML = saved.output || ""; updateStatus(); return true;
        } catch { localStorage.removeItem(saveKey); return false; }
    }
    function restart() { game.clues.clear(); game.talked.clear(); game.asked.clear(); game.searched.clear(); game.accusations = 0; game.solved = false; intro(); save(); }

    window.updateTerminalLanguage = () => { output.querySelectorAll(".line").forEach(line => { line.textContent = uiEnglish ? line.dataset.en : line.dataset.zh; }); updateStatus(); };
    window.restartGame = restart;
    window.murderRunCommand = raw => {
        const command = clean(raw); if (!command) return; say("> " + raw, "> " + raw, "command");
        if (command === "help" || command === "帮助" || command === "?") help();
        else if (command === "look" || command === "overview" || command === "查看") intro();
        else if (command === "suspects" || command === "people" || command === "嫌疑人") say("在场者：埃莉诺、丹尼尔、克拉拉、维克多、马库斯、莉莉、索菲。", "PRESENT: Eleanor, Daniel, Clara, Victor, Marcus, Lily, Sophie.");
        else if (command === "topics" || command === "keywords" || command === "话题" || command === "主题") showTopicKeywords();
        else if (command === "clues" || command === "evidence" || command === "线索") { const notes = [...game.clues].map((id, index) => `${index + 1}. ${uiEnglish ? evidence[id][1] : evidence[id][0]}`).join("\n\n"); say(notes || (uiEnglish ? "No notes recorded yet." : "尚未记录线索。")); }
        else if (command === "timeline" || command === "time" || command === "时间线") showTimeline();
        else if (command === "status" || command === "状态") status();
        else if (command === "clear" || command === "清屏") output.innerHTML = "";
        else if (command === "restart" || command === "reset" || command === "重启") restart();
        else { let match; if ((match = command.match(/^(talk|interview)\s+(.+?)\s+about\s+(.+)$/))) question(match[2], match[3]); else if ((match = command.match(/^交谈\s+(.+?)\s*关于\s*(.+)$/))) question(match[1], match[2]); else if ((match = command.match(/^(talk|interview|交谈)\s+(.+)$/))) talk(match[2]); else if ((match = command.match(/^(ask|question)\s+(.+?)\s+about\s+(.+)$/))) question(match[2], match[3]); else if ((match = command.match(/^(询问|提问)\s+(.+?)\s*关于\s*(.+)$/))) question(match[2], match[3]); else if (/^(ask|question|询问|提问)\b/.test(command)) say("请使用“询问 [姓名] 关于 [主题]”。", "Use: ask [name] about [topic].", "warning"); else if ((match = command.match(/^(examine|搜查)\s+(.+)$/))) examine(match[2]); else if ((match = command.match(/^(inspect|检查)\s+(.+)$/))) inspect(match[2]); else if ((match = command.match(/^(unlock|解锁)\s+(.+)\s+(\d{4})$/))) unlock(match[2], match[3]); else if ((match = command.match(/^(accuse|指控)\s+(.+)$/))) accuse(match[2]); else say(`未知命令：“${raw}”。输入“帮助”查看命令。`, `Unknown command: "${raw}". Type "help" for commands.`, "warning"); }
        window.gamePersistence?.save();
    };
    if (hasActiveSave) window.gamePersistence = { save, clear: () => localStorage.removeItem(saveKey) };
    commandForm.addEventListener("submit", event => { event.preventDefault(); const command = input.value.trim(); if (!command) return; input.value = ""; window.murderRunCommand(command); });
    document.addEventListener("click", () => { if (document.getElementById("saveDialog").classList.contains("hidden")) input.focus(); });
    if (!hasActiveSave || !restore()) intro();
    window.updateTerminalLanguage();
})();