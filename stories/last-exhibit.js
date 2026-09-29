(() => {
    const output = document.getElementById("output");
    const input = document.getElementById("commandInput");
    const commandForm = document.getElementById("commandForm");
    const statusEl = document.getElementById("status");

    const game = {
        clues: new Set(),
        talked: new Set(),
        casualTalkIndex: {},
        questioned: {},
        searched: new Set(),
        accusations: 0,
        finalTheoryStep: 0,
        solved: false
    };

    const people = {
        clara: {
            name: "克拉拉·沃斯", role: "副馆长",
            intro: `克拉拉是阿什福德博士的副手，也是最后一位被目击与他交谈的人。她身穿醒目的红色修身西装外套，称自己于晚上 9:08 离开博士办公室，独自准备董事会简报，并在晚上 9:34 发现尸体。`,
            englishName: "Clara Voss", englishRole: "Deputy Director",
            englishIntro: `Clara is Dr. Ashford's deputy and the last person seen speaking with him. In a striking red fitted blazer, she says she left his office at 9:08 PM to prepare the board briefing alone, then found the body at 9:34 PM.`,
            smallTalk: ["克拉拉把散乱的简报纸叠齐，抱怨董事会总在最糟糕的时候要求解释数字。", "克拉拉望向封锁线，低声说博物馆从没有像今晚这样安静过。"],
            englishSmallTalk: ["Clara straightens the scattered briefing pages and complains that the board always asks for numbers at the worst possible time.", "Clara glances toward the cordon and says the museum has never been this quiet."],
            rounds: [
                [`问题：阿什福德博士为何召开紧急董事会？

克拉拉：“只是例行融资。朱利安喜欢小题大做。我 9:08 离开他，此后从未靠近档案室。”`, []],
                [`问题：为何您的分机在 9:16 致电阿什福德博士？

克拉拉：“是我打的电话。我想确认朱利安是否会在早上的会议公开审计结果。他拒绝了我，还说董事会已经知道得太多。”`, ["call_log"], ["switchboard_log"], "克拉拉：“我可能是为了资料包打过电话。我记不清了。这并不代表我去过档案室。”"],
                [`问题：您的门禁卡在 9:18 打开了档案室。请解释。

克拉拉：“我去了档案室，但只是想取回资料包。朱利安还活着，我们争吵后我离开了。”继续回答前，她碰了碰身旁红蜡封口的简报资料包。`, ["archive_key"], ["patrol_gap"], "克拉拉：“阿什福德博士一定是早些时候借了我的卡。”"]
            ],
            englishRounds: [
                [`Question: Why did Dr. Ashford call an emergency board meeting?

Clara: "Routine funding. Julian loved making a drama out of nothing. I left him at 9:08 and never went near the archive afterward."`],
                [`Question: Why did your extension call Dr. Ashford at 9:16?

Clara: "I called him. I wanted to know whether he would reveal the audit at the morning meeting. He refused, and said the board already knew too much."`, `Clara: "I may have called about the briefing packet. I cannot remember. That does not mean I went to the archive."`],
                [`Question: Your access card opened the archive at 9:18. Explain that.

Clara: "I went there only to retrieve my briefing packet. Julian was alive; we argued, and I left." Before continuing, she touches the red-wax-sealed packet beside her.`, `Clara: "Dr. Ashford must have borrowed my card earlier."` ]
            ]
        },
        daniel: {
            name: "丹尼尔·鲁克", role: "夜班安保主管",
            intro: `丹尼尔称谋杀发生时自己正在外围巡逻，并认为档案室摄像头故障只是常规继电器问题。`,
            englishName: "Daniel Rook", englishRole: "Night Security Chief",
            englishIntro: `Daniel says he was on an exterior patrol during the murder and insists the archive-camera failure was a routine relay problem.`,
            smallTalk: ["丹尼尔反复检查对讲机频道，称今晚每一盏报警灯都像在针对他。", "丹尼尔说他最讨厌雨夜值班，监控屏幕总会反光。"],
            englishSmallTalk: ["Daniel repeatedly checks the radio channels, saying every alarm light seems to have it in for him tonight.", "Daniel says he hates night duty in the rain; the security screens always reflect too much."],
            rounds: [
                [`问题：为何继电器恰在谋杀期间失效？

丹尼尔：“线路老化，常有的事。我在外面巡逻，没看见有人靠近档案室。”`, []],
                [`问题：您的巡逻标签从未离开装卸区。

丹尼尔：“好吧，我把它留在那里了。我没在巡逻。我去处理一笔私事，不想让任何人知道。”他拒绝说明自己实际去了哪里。`, ["patrol_gap"], ["call_log"], "丹尼尔：“巡逻标签有时会失灵。我的路线没有问题。”"],
                [`问题：博彩室记录显示您在 9:19 至 9:24 一直在楼下。

丹尼尔：“我在还债。愚蠢，是的；杀人？不是。下楼前我看见克拉拉朝档案室楼梯走去，但以为她是去找阿什福德。”`, ["betting_slip"], ["patrol_gap"], "丹尼尔：“我没有离开巡逻路线，也没见到任何人靠近档案室。”"]
            ],
            englishRounds: [
                [`Question: Why did the relay fail during the murder?

Daniel: "Old wiring. It happens. I was outside on patrol and saw no one near the archive."`],
                [`Question: Your patrol tag never left the loading area.

Daniel: "Fine. I left it there. I was not patrolling; I handled a private matter and did not want anyone to know." He refuses to say where he actually went.`, `Daniel: "Patrol tags malfunction sometimes. My route was fine."`],
                [`Question: Betting-room records place you downstairs from 9:19 to 9:24.

Daniel: "I was paying a debt. Stupid? Yes. Murder? No. Before I went down, I saw Clara heading for the archive stairs, but assumed she was looking for Ashford."`, `Daniel: "I never left my patrol route and never saw anyone approach the archive."` ]
            ]
        },
        evelyn: {
            name: "伊芙琳·哈特", role: "馆藏研究员",
            intro: `伊芙琳当时正在阅览室编目书信。阿什福德博士曾驳回她的研究资助申请，去年还解雇了她的哥哥。`,
            englishName: "Evelyn Hart", englishRole: "Collections Researcher",
            englishIntro: `Evelyn was cataloguing letters in the reading room. Dr. Ashford rejected her research grant and dismissed her brother last year.`,
            smallTalk: ["伊芙琳小心地把一张旧书信放回保护套，说纸张总比人更容易保存秘密。", "伊芙琳提到新展览的展签字体糟糕透顶，随即又闭上了嘴。"],
            englishSmallTalk: ["Evelyn carefully returns an old letter to its sleeve and says paper keeps secrets more easily than people do.", "Evelyn mentions that the new exhibition labels use an awful typeface, then falls silent."],
            rounds: [
                [`问题：阿什福德博士是否给过您怨恨他的理由？

伊芙琳：“他拒绝了我的资助申请，说档案预算遭人操纵。我很生气，但整晚都在阅览室。”`, ["reading_log"]],
                [`问题：您能否在不被注意的情况下离开阅览室？

伊芙琳：“理论上可以。但请问问图书管理员那份 1892 年海岸勘测资料。她当时为此打断过我。”`, []],
                [`问题：图书管理员证实 9:20 至 9:24 都在您身旁工作。

伊芙琳：“那您就知道不是我杀的他。朱利安正试图阻止展览预算里的钱凭空消失。”`, ["librarian_note"], ["camera_exit"], "伊芙琳：“图书管理员忙得很，她未必记得每一分钟谁坐在哪里。”"]
            ],
            englishRounds: [
                [`Question: Did Dr. Ashford give you reason to resent him?

Evelyn: "He rejected my grant, saying the archive budget was being manipulated. I was angry, but I spent the evening in the reading room."`],
                [`Question: Could you have left the reading room unnoticed?

Evelyn: "In theory. Ask the librarian about the 1892 coastal survey; she interrupted me over it."`],
                [`Question: The librarian confirms she worked beside you from 9:20 to 9:24.

Evelyn: "Then you know I did not kill him. Julian was trying to stop exhibition money from vanishing."`, `Evelyn: "The librarian was busy. She may not remember who sat where every minute."` ]
            ]
        },
        marcus: {
            name: "马库斯·科尔", role: "古董商",
            intro: `马库斯前来协商展品借用事宜。他曾因来源证明与阿什福德博士争吵，而他的古董刀被发现于尸体旁。`,
            englishName: "Marcus Cole", englishRole: "Antiquities Dealer",
            englishIntro: `Marcus came to negotiate an object loan. He argued with Dr. Ashford about provenance papers, and his antique knife was found beside the body.`,
            smallTalk: ["马库斯擦去袖口上的修复粉尘，说真正的古物从不急着向人证明自己。", "马库斯评论大厅里的灯光太冷，不适合展示青铜器。"],
            englishSmallTalk: ["Marcus brushes restoration dust from his cuff and says genuine antiquities never rush to prove themselves.", "Marcus comments that the hall lighting is too cold for displaying bronze."],
            rounds: [
                [`问题：您为何与阿什福德博士争吵？

马库斯：“他质疑我借展品的证明文件。我们争吵了，我很后悔。但招待会前他借我的刀开过箱子。”`, []],
                [`问题：您的刀就在尸体旁。

马库斯：“正是有人想让它被发现的位置。那是细剑刀刃，平直的创伤不是它造成的。”`, ["knife_print"], ["autopsy"], "马库斯：“我的刀不该在那里。我没有杀他，也不知道是谁把它放进去的。”"],
                [`问题：谁有理由害怕审计？

马库斯：“克拉拉。阿什福德问我是否见过沃斯文化控股公司的发票。我见过。”`, []]
            ],
            englishRounds: [
                [`Question: Why did you argue with Dr. Ashford?

Marcus: "He challenged the provenance for the objects I loaned. We argued, and I regret it. But he borrowed my knife to open crates before the reception."`],
                [`Question: Your knife was beside the body.

Marcus: "Exactly where someone wanted it found. It has a rapier blade; the flat wound was not made by it."`, `Marcus: "My knife should not have been there. I did not kill him, and I do not know who placed it."`],
                [`Question: Who had reason to fear the audit?

Marcus: "Clara. Ashford asked whether I had seen invoices from Voss Cultural Holdings. I had."`]
            ]
        },
        iris: {
            name: "艾丽斯·贝尔", role: "董事会秘书",
            intro: `艾丽斯当时在会议室整理董事会记录。她称关键时段内一直在接线台进行两通连续电话。`,
            englishName: "Iris Bell", englishRole: "Board Secretary",
            englishIntro: `Iris was organising board records in the conference room. She says she made two consecutive switchboard calls during the critical period.`,
            smallTalk: ["艾丽斯把会议记录按颜色排好，说有些董事连自己的议程都记不住。她顺手把用来加热红蜡的小银勺放回资料室托盘。", "艾丽斯轻轻敲着笔帽，等待接线台再次响起。"],
            englishSmallTalk: ["Iris sorts the board minutes by colour and says some trustees cannot remember their own agenda. She returns the small silver spoon used to warm red wax to the records-room tray.", "Iris taps a pen cap softly while waiting for the switchboard to ring again."],
            rounds: [
                [`问题：您的电话内容是什么？

艾丽斯：“先是捐助人，之后是受托人。录音显示我从未离开接线台。”`, ["switchboard_log"]],
                [`问题：您知道为何召开董事会吗？

艾丽斯：“朱利安要审计文件，并让我用红蜡封好资料包。克拉拉被安排负责汇报预算。”`, []],
                [`问题：继电器故障后您见到克拉拉了吗？

艾丽斯：“大约 9:26，她带着资料包穿过会议走廊。她像是刚跑过步，其中一个信封的角还破了。”`, []]
            ],
            englishRounds: [
                [`Question: What were your calls about?

Iris: "A donor first, then a trustee. The recording shows I never left the switchboard."`],
                [`Question: Do you know why the board meeting was called?

Iris: "Julian wanted the audit files and asked me to seal the packet with red wax. Clara was assigned to present the budget."`],
                [`Question: Did you see Clara after the relay failure?

Iris: "Around 9:26, she crossed the conference corridor with the packet. She looked as though she had been running, and one envelope corner was torn."`]
            ]
        },
        victor: {
            name: "维克多·黑尔", role: "董事会司库",
            intro: `维克多称自己整晚都在整理董事会财务记录。面对调查，他礼貌而克制，还主动交出一张“目击者便笺”，声称这能证明马库斯在案发走廊出现过。`,
            englishName: "Victor Hale", englishRole: "Board Treasurer",
            englishIntro: `Victor says he spent the evening organising the board's financial records. He is polite and composed under questioning, and volunteers a "witness note" that supposedly places Marcus in the archive corridor.`,
            smallTalk: ["维克多合上账本，说博物馆里最难管理的从来不是藏品，而是捐助人的期待。他抱怨董事会办公室那台旧打字机总会卡住色带。", "维克多微笑着问你是否需要咖啡，仿佛这里只是在进行一场例行会议。"],
            englishSmallTalk: ["Victor closes a ledger and says the hardest thing to manage in a museum is never the collection, but donor expectations. He complains that the old board-office typewriter always catches its ribbon.", "Victor smiles and asks whether you need coffee, as though this were an ordinary meeting."],
            rounds: [
                [`问题：这张目击者便笺从哪里来？

维克多：“一位不愿留名的员工交给我的。上面说马库斯在 9:22 拿着古董刀站在档案室走廊。你应该先查他，而不是浪费时间问我。”`, ["victor_false_lead"]],
                [`问题：为何您伪造匿名信，指控阿什福德博士偏袒供应商？

维克多：“是我写的，便笺也是。我想让董事会怀疑阿什福德，也想让你把注意力放在马库斯身上。逼阿什福德辞职后，我本可以接手整顿局面。我从没打算杀他。死亡时间我正和一位受托人通话，录音可以证明。”`, ["victor_alibi"], ["victor_blackmail_notes", "victor_forgery_proof"], "维克多：“那些只是内部沟通草稿。你不能把几张纸当成犯罪证据。”"],
                [`问题：您在通话前见到过谁？

维克多：“大约 9:18，我看见克拉拉从董事会资料室出来，抱着那只米色资料包。她让我别多管闲事。”`, []]
            ],
            englishRounds: [
                [`Question: Where did this witness note come from?

Victor: "An employee who wishes to remain anonymous gave it to me. It says Marcus stood in the archive corridor at 9:22 with the antique knife. You should investigate him before wasting time on me."`],
                [`Question: Why did you forge anonymous letters accusing Dr. Ashford of favouring suppliers?

Victor: "I wrote them, and the note. I wanted the board to doubt Ashford and you to focus on Marcus. If Ashford resigned, I could have taken over the recovery. I never planned to kill him. During the death window, I was speaking to a trustee; the recording proves it."`, `Victor: "Those are only internal communications drafts. You cannot treat a few sheets of paper as criminal evidence."`],
                [`Question: Whom did you see before the call?

Victor: "At about 9:18, I saw Clara leave the board records room carrying that beige packet. She told me to mind my own business."`]
            ]
        }
    };

    const evidence = {
        clara_statement: "克拉拉称自己从晚上 9:08 起独自在办公室，直到发现尸体。",
        daniel_statement: "丹尼尔称档案室继电器故障只是常规问题，自己当时在巡逻。",
        evelyn_statement: "伊芙琳称谋杀时段正在阅览室编目书信。",
        marcus_statement: "马库斯承认古董刀在尸体旁，但称阿什福德博士借过它。",
        iris_statement: "艾丽斯称两通录音电话能够证明她在谋杀时段的行踪。",
        victor_statement: "维克多称自己与阿什福德博士并无冲突，并交出一张指向马库斯的匿名目击者便笺。",
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
        letter_opener: "克拉拉办公室里被清洗过的拆信刀，其刀柄护圈下方留有一丝血迹。",
        victor_false_lead: "维克多交出一张匿名目击者便笺，称马库斯于晚上 9:22 手持古董刀站在档案室走廊。",
        victor_blackmail_notes: "维克多的文件夹内有伪造的供应商往来信和匿名举报信草稿，意图让董事会怀疑阿什福德博士滥用职权。",
        victor_forgery_proof: "压痕和打字机色带显示，匿名目击者便笺与维克多的举报信都由董事会办公室的同一台打字机在当晚制作。",
        victor_alibi: "受托人通话录音和接线记录显示，维克多在 9:20 至 9:27 持续待在北侧阅览室的电话旁。",
        footage_frame: "校正时间码后的增强画面显示，克拉拉在晚上 9:24 离开档案室走廊，右手夹着撕裂的米色信封。",
        corridor_fiber: "档案室走廊地毯上留有米色信封纤维和红蜡碎片，形成从档案室通往会议走廊的连续路径。",
        wax_registry: "红蜡批次登记显示，该蜡只在董事会资料包上使用；当晚由艾丽斯在克拉拉的要求下领取。",
        ledger_page: "展览资金分类账的一页被撕走，但碳纸副本显示款项先转入沃斯文化控股，再被拆分至三个空壳账户。"
    };

    const englishEvidence = {
        clara_statement: "Clara says she was alone in her office from 9:08 PM until she found the body.",
        daniel_statement: "Daniel says the archive relay failure was routine and that he was on patrol.",
        evelyn_statement: "Evelyn says she was cataloguing letters in the reading room during the murder window.",
        marcus_statement: "Marcus admits his antique knife was beside the body, but says Dr. Ashford borrowed it.",
        iris_statement: "Iris says two recorded calls can prove where she was during the murder window.",
        victor_statement: "Victor claims he had no conflict with Dr. Ashford and supplies an anonymous witness note pointing to Marcus.",
        autopsy: "The wound was made by a flat, narrow letter opener, not Marcus's pointed antique knife. Time of death: 9:21 to 9:23 PM.",
        wax_fiber: "Red sealing wax and fibres from a torn board envelope were embedded in the wound; both match Clara's briefing packet.",
        camera_delay: "The archive camera clock runs exactly two minutes behind the museum's central clock.",
        relay_cut: "The archive camera relay was deliberately unplugged, not damaged by a fault.",
        camera_exit: "After correcting the camera time, Clara in a red fitted blazer is seen leaving the archive corridor at 9:24 PM.",
        knife_print: "Marcus's knife carries old prints from the victim and restoration dust, but no fresh blood; workshop footage places Marcus there from 9:18 to 9:25.",
        reading_log: "Evelyn signed into the reading room at 9:14 PM.",
        librarian_note: "The librarian worked beside Evelyn in the reading room continuously from 9:20 to 9:24.",
        patrol_gap: "Daniel left his patrol tag in the loading area and concealed a separate private matter.",
        betting_slip: "A signed repayment slip and counter camera prove Daniel was in the betting room from 9:19 to 9:24.",
        switchboard_log: "Iris's calls ran from 9:20 to 9:26 and from 9:28 to 9:31, confirming her alibi.",
        archive_key: "Clara's master access card opened the archive at 9:18 PM.",
        call_log: "At 9:16 PM, Clara's extension called Dr. Ashford's office for 42 seconds.",
        audit_memo: "Dr. Ashford planned to reveal Clara's diversion of exhibition funds at the emergency board meeting.",
        letter_opener: "A cleaned letter opener in Clara's office retains a trace of blood beneath its guard.",
        victor_false_lead: "Victor supplied an anonymous witness note claiming Marcus stood in the archive corridor with the antique knife at 9:22 PM.",
        victor_blackmail_notes: "Victor's folder contains forged supplier correspondence and anonymous complaint drafts intended to make the board suspect Dr. Ashford of abuse of office.",
        victor_forgery_proof: "Indentations and typewriter-ribbon marks show the witness note and Victor's complaints were produced on the same board-office typewriter that night.",
        victor_alibi: "A trustee-call recording and switchboard record place Victor at the north reading-room telephone continuously from 9:20 to 9:27.",
        footage_frame: "An enhanced, time-corrected frame shows Clara leaving the archive corridor at 9:24 PM, carrying a torn beige envelope.",
        corridor_fiber: "Beige envelope fibres and red wax fragments form a continuous path from the archive to the conference corridor.",
        wax_registry: "The wax-batch register shows this red wax was used only on board packets and was collected by Iris at Clara's request.",
        ledger_page: "A torn exhibition-funds ledger page has a carbon copy showing money moving through Voss Cultural Holdings before being split between three shell accounts."
    };

    const finalRequiredClues = [
        "clara_statement", "daniel_statement", "evelyn_statement", "marcus_statement", "iris_statement", "victor_statement",
        "autopsy", "camera_delay", "relay_cut", "archive_key", "call_log", "audit_memo", "wax_fiber", "letter_opener",
        "camera_exit", "footage_frame", "corridor_fiber", "wax_registry", "ledger_page", "switchboard_log", "patrol_gap",
        "betting_slip", "reading_log", "librarian_note", "knife_print", "victor_false_lead", "victor_blackmail_notes",
        "victor_forgery_proof", "victor_alibi"
    ];

    const terminalTranslations = new Map([
        [`案件概览

布莱克伍德博物馆馆长朱利安·阿什福德博士于晚上 9:34 被发现死于封闭档案室。私人董事会招待会结束后，六人仍留在馆内。

档案室摄像头被禁用，一把刀将嫌疑指向其中一人，而数份不在场证明暗藏谎言。请找出谁策划了谋杀、谋杀何时发生，以及哪项证据能够证明一切。`, `Case overview

Dr. Julian Ashford, director of the Blackwood Museum, was found dead in the sealed archive room at 9:34 PM. Six people remained inside after the private board reception.

The archive camera was disabled. A knife points suspicion at one person, while several alibis hide lies. Determine who planned the murder, when it happened, and which evidence proves it.`]
        , ["案件档案 047 - 最后的展品", "CASE FILE 047 - THE LAST EXHIBIT"]
        , [`案情简报

布莱克伍德博物馆为雄心勃勃的新展览举行私人董事会招待会后，已闭馆。备受敬重的馆长朱利安·阿什福德博士原定于翌日早晨召开紧急董事会，只有最亲近的圈内人知道原因。

招待会结束不久，阿什福德在封闭档案室中被发现遭人杀害。安保主管立即封锁大楼。招待会后仍留在馆内的六个人，现在都无法离开。`, `Case briefing

The Blackwood Museum has closed after a private board reception for its ambitious new exhibition. Its respected director, Dr. Julian Ashford, was due to call an emergency board meeting the following morning, and only his closest circle knew why.

Shortly after the reception, Ashford was found murdered in the sealed archive room. The security chief immediately locked down the building. The six people who remained inside cannot leave.`]
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
    搜查 财务档案柜              追查展览资金
    检查 [物品]                  检查特定物品
    检查 录像                    恢复摄像头细节
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
    examine finance              Trace the exhibition funds
    inspect [item]               Inspect a specific item
    inspect footage              Recover camera details
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
            say((uiEnglish ? "[EVIDENCE RECORDED] " + englishEvidence[id] : "[已记录证据] " + evidence[id]), "important");
        }
    }

    function clean(text) {
        return text.toLowerCase().trim().replace(/\s+/g, " ");
    }

    function person(text) {
        const query = clean(text);
        const chineseNames = { clara: "克拉拉", daniel: "丹尼尔", evelyn: "伊芙琳", marcus: "马库斯", iris: "艾丽斯", victor: "维克多" };
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
    搜查 财务档案柜              追查展览资金
    检查 [物品]                  检查特定物品
    检查 录像                    恢复摄像头细节
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
        if (!id) return say(uiEnglish ? "Unknown suspect. Try: Clara, Daniel, Evelyn, Marcus, Iris, or Victor." : "未知嫌疑人。请尝试：克拉拉、丹尼尔、伊芙琳、马库斯、艾丽斯或维克多。", "warning");
        const suspect = people[id];
        if (game.talked.has(id)) {
            const index = game.casualTalkIndex[id] || 0;
            const remarks = uiEnglish ? suspect.englishSmallTalk : suspect.smallTalk;
            game.casualTalkIndex[id] = index + 1;
            return say(remarks[index % remarks.length], "muted");
        }
        game.talked.add(id);
        clue(id + "_statement");
        const displayName = uiEnglish ? suspect.englishName : suspect.name;
        say(`${displayName} - ${uiEnglish ? suspect.englishRole : suspect.role}`, "system");
        say("");
        say(uiEnglish ? suspect.englishIntro : suspect.intro);
        say("");
        say(uiEnglish ? `Type "question ${displayName.split(" ")[0]}" to begin the first of three interview rounds.` : `输入“提问 ${suspect.name}”开始三轮讯问中的第一轮。`, "muted");
    }

    function question(name) {
        const id = person(name);
        if (!id) return say(uiEnglish ? "Unknown suspect." : "未知嫌疑人。", "warning");
        if (!game.talked.has(id)) return say(uiEnglish ? `Talk to ${people[id].englishName} first. Try: talk ${people[id].englishName.split(" ")[0]}` : `请先讯问 ${people[id].name}。尝试：交谈 ${people[id].name}`, "warning");
        const round = game.questioned[id] || 0;
        if (round >= people[id].rounds.length) return say(uiEnglish ? `${people[id].englishName} has nothing further to add.` : `${people[id].name}没有更多可补充的内容。`, "muted");
        const [text, discoveries, requiredClues = [], lie] = people[id].rounds[round];
        const [englishText, englishLie] = people[id].englishRounds[round];
        if (requiredClues.some(clueId => !game.clues.has(clueId))) {
            return say(uiEnglish ? (englishLie || `${people[id].englishName} will not say more yet. Collect other testimony or physical evidence first.`) : (lie || `${people[id].name}暂时不愿意说明更多。请先收集其他人的证词或物证。`), "warning");
        }
        game.questioned[id] = round + 1;
        discoveries.forEach(clue);
        say(uiEnglish ? `INTERVIEW - ${people[id].englishName} // ROUND ${round + 1}` : `讯问 - ${people[id].name} // 第 ${round + 1} 轮`, "system");
        say("");
        say(uiEnglish ? englishText : text);
        if (round < 2) say(uiEnglish ? `There may be more to learn. Try "question ${people[id].englishName.split(" ")[0]}" again.` : `或许还能得到更多回答。再次尝试“提问 ${people[id].name}”。`, "muted");
    }

    function examine(place) {
        const target = clean(place);
        if (target.includes("archive") || target.includes("body") || target.includes("scene") || target.includes("档案") || target.includes("尸体") || target.includes("现场")) {
            game.searched.add("archive"); clue("autopsy"); clue("wax_fiber");
            return say(uiEnglish ? `SEALED ARCHIVE

Dr. Ashford lies beside the archive table. The single wound is clean and narrow. Marcus's antique knife is nearby, but its pointed blade could not have made it.

Red sealing wax and a torn fibre from a beige board envelope are lodged in the wound. The medical examiner estimates death occurred between 9:21 and 9:23 PM.` : `封闭档案室

阿什福德博士倒在档案桌旁。单一伤口干净狭窄。马库斯的古董刀就在附近，但其尖刃不可能造成这种伤口。

伤口内卡有红色封蜡和一根来自米色董事会信封的破损纤维。法医估计死亡发生于晚上 9:21 至 9:23。`);
        }
        if (target.includes("camera") || target.includes("relay") || target.includes("摄像头") || target.includes("继电器")) {
            game.searched.add("camera"); clue("camera_delay"); clue("relay_cut");
            return say(uiEnglish ? `ARCHIVE CAMERA RELAY

The relay was unplugged from 9:19 to 9:23 PM. The cable was removed cleanly; this was deliberate.

The camera clock is two minutes slow. Glare obscures the footage around the outage, but the technician believes more can be recovered from the raw video. Try inspecting the footage.` : `档案室摄像头继电器

继电器在晚上 9:19 至 9:23 之间被拔下。电缆被利落地移除，这是蓄意行为。

    摄像头时钟慢了两分钟。故障前后的画面被强烈眩光遮住，但技术员认为可以从原始录像中恢复更多细节。尝试检查录像。`);
        }
        if (target.includes("workshop") || target.includes("工坊")) {
            game.searched.add("workshop"); clue("knife_print");
            return say(uiEnglish ? `RESTORATION WORKSHOP

Inventory records show Dr. Ashford borrowed Marcus's knife at 8:47 PM. The blade has old prints and restoration dust but no fresh blood. Time-lapse footage also shows Marcus restoring a brass plaque from 9:18 to 9:25. The knife is a highly persuasive plant, not the murder weapon.` : `修复工坊

库存表显示阿什福德博士于晚上 8:47 借走马库斯的刀。刀刃上有旧指纹与修复粉尘，但没有新鲜血迹。工坊延时录像还显示马库斯从 9:18 至 9:25 一直在修复一块铜牌。这把刀是极具迷惑性的栽赃线索，不是凶器。`);
        }
        if (target.includes("office") || target.includes("clara") || target.includes("办公室") || target.includes("克拉拉")) {
            game.searched.add("office"); clue("letter_opener"); clue("audit_memo");
            return say(uiEnglish ? `CLARA'S OFFICE

A cleaned silver letter opener is hidden beneath briefing notes. A dark trace remains below its guard.

Her briefing packet uses beige envelopes sealed with the same distinctive red wax found in the archive. A draft audit memo says Dr. Ashford traced missing exhibition funds to accounts under her control.` : `克拉拉的办公室

简报笔记下藏着一把清洗过的银质拆信刀。其刀柄护圈下方残留一处暗色痕迹。

她的简报资料包使用米色信封，并以与档案室发现物相同的特殊红蜡封口。一份审计备忘录草稿称，阿什福德博士已追查到失踪的展览资金流入她控制的账户。`);
        }
        if (target.includes("reading") || target.includes("阅览")) {
            game.searched.add("reading"); clue("reading_log"); clue("librarian_note");
            return say(uiEnglish ? `READING ROOM

Evelyn signed in at 9:14 PM. The librarian worked beside her from 9:20 to 9:24, cataloguing letters. Her resentment is real, but her alibi holds.` : `阅览室

伊芙琳于晚上 9:14 签到。图书管理员在 9:20 至 9:24 期间与她一起编目书信。她的怨恨真实存在，但不在场证明成立。`);
        }
        if (target.includes("switchboard") || target.includes("conference") || target.includes("接线") || target.includes("会议")) {
            game.searched.add("switchboard"); clue("switchboard_log");
            return say(uiEnglish ? `SWITCHBOARD

Iris's calls ran from 9:20 to 9:26 and from 9:28 to 9:31. The recordings are continuous; she could not have entered the archive during the murder window.` : `接线台

艾丽斯的电话时段为 9:20 至 9:26、9:28 至 9:31。录音连续不断；她不可能在死亡时段进入档案室。`);
        }
        if (target.includes("security") || target.includes("loading") || target.includes("patrol") || target.includes("安保") || target.includes("装卸") || target.includes("巡逻")) {
            game.searched.add("security"); clue("patrol_gap"); clue("betting_slip");
            return say(uiEnglish ? `SECURITY STATION

Daniel's patrol tag stayed in the loading area. A signed repayment slip and betting-room counter footage prove he was downstairs from 9:19 to 9:24. He lied to hide debt, not murder.` : `安保站

丹尼尔的巡逻标签一直留在装卸区。签字还款单和博彩室柜台摄像头证明他从 9:19 至 9:24 都在楼下。他撒谎是为掩盖债务，不是谋杀。`);
        }
    if (target.includes("ledger") || target.includes("finance") || target.includes("account") || target.includes("财务") || target.includes("账本") || target.includes("资金")) {
        game.searched.add("finance"); clue("ledger_page"); clue("victor_blackmail_notes");
        return say(uiEnglish ? `FINANCE ARCHIVE

    A page from the exhibition-funds ledger was torn from its binder. Impressions and a carbon copy remain, showing Voss Cultural Holdings received unusual transfers before the exhibition opened.

    The transfers were then split across three shell accounts. The hidden compartment also holds Victor's forged supplier letters and anonymous complaints. The note's typeface and ribbon smudges suggest it came from the board office, where a closer inspection may identify the machine. He tried to ruin Ashford with scandal and steer this investigation toward Marcus. Both crimes are real, but neither necessarily explains the murder.` : `财务档案柜

一页展览资金分类账被从活页夹中撕走。压痕和碳纸副本仍留在夹层里，显示沃斯文化控股在展览开始前收到多笔异常转账。

转账随后被拆分至三个空壳账户。夹层里还藏着维克多伪造的供应商信件和匿名举报草稿；便笺的字体和色带污迹指向董事会办公室，进一步检查或许能找出使用的机器。他试图用丑闻和假线索毁掉阿什福德博士，并将调查引向马库斯。两人的罪行都是真实的，但未必是谋杀。`);
    }
    say(uiEnglish ? "Try: archive, camera relay, workshop, office, reading room, switchboard, security station, or finance archive." : "请尝试：档案室、摄像头继电器、工坊、办公室、阅览室、接线台、安保站或财务档案柜。", "warning");
    }

    function inspect(item) {
        const target = clean(item);
    if (target.includes("footage") || target.includes("video") || target.includes("录像") || target.includes("画面")) {
        if (!game.searched.has("camera")) return say(uiEnglish ? "Search the archive camera relay first to obtain the raw footage." : "请先搜查档案室摄像头继电器，取得原始录像。", "warning");
        clue("footage_frame"); clue("corridor_fiber"); clue("camera_exit");
        return say(uiEnglish ? `ENHANCED RAW FOOTAGE

    After correcting the two-minute clock offset, the footage shows Clara leaving the archive corridor at 9:24 PM. She holds a torn beige envelope in her right hand and wears a thin glove not normally part of her outfit.

    Red wax fragments and envelope fibres form a continuous trail across the corridor carpet. Her claim that she remained in her office cannot be true.` : `原始录像增强帧

校正两分钟的时钟偏差后，画面显示克拉拉于晚上 9:24 离开档案室走廊。她右手夹着撕裂的米色信封，左手戴着一只不属于她平时装束的薄手套。

走廊地毯上的红蜡碎片和信封纤维形成一条连续路径。她的“始终在办公室”说法不可能成立。`);
    }
        if (target.includes("camera") || target.includes("relay") || target.includes("摄像头") || target.includes("继电器")) return examine("camera relay");
        if (target.includes("knife") || target.includes("刀")) { clue("knife_print"); return say(uiEnglish ? "MARCUS'S KNIFE\n\nIts pointed blade cannot make a flat, narrow wound. It was placed here to be noticed." : "马库斯的刀\n\n其尖刃无法造成扁平狭窄的伤道。它被放在这里，就是为了被人注意到。"); }
        if (target.includes("letter") || target.includes("opener") || target.includes("weapon") || target.includes("拆信") || target.includes("凶器")) { clue("letter_opener"); clue("autopsy"); return say(uiEnglish ? "LETTER OPENER\n\nThe cleaned letter opener in Clara's office matches the wound in width and profile. Blood remains below its guard." : "拆信刀\n\n克拉拉办公室内清洗过的拆信刀，其宽度和轮廓与伤口吻合。刀柄护圈下方仍留有血迹。"); }
        if (target.includes("key") || target.includes("card") || target.includes("access") || target.includes("门禁") || target.includes("钥匙")) { clue("archive_key"); return say(uiEnglish ? "ARCHIVE ACCESS LOG\n\n9:18 PM - Clara Voss's master card opened the archive. No other card entered before the body was found." : "档案室门禁记录\n\n晚上 9:18 - 克拉拉·沃斯的万能门禁卡打开档案室。尸体被发现前，没有其他卡片进入。 "); }
        if (target.includes("phone") || target.includes("call") || target.includes("电话") || target.includes("通话")) { clue("call_log"); return say(uiEnglish ? "INTERNAL CALL LOG\n\nAt 9:16 PM, Clara's extension called Dr. Ashford's office for 42 seconds. She did not mention the call." : "内部电话记录\n\n晚上 9:16，克拉拉的分机致电阿什福德博士办公室，通话 42 秒。她没有提起这通电话。 "); }
        if (target.includes("typewriter") || target.includes("typing") || target.includes("打字机")) { clue("victor_forgery_proof"); return say(uiEnglish ? "BOARD-OFFICE TYPEWRITER\n\nThe typeface, worn lowercase e, and ribbon smudges match the anonymous witness note and Victor's complaint drafts. The note did not come from an unnamed employee." : "董事会办公室打字机\n\n字形、磨损的小写 e 和色带污迹都与匿名目击者便笺及维克多的举报草稿吻合。这张便笺并非来自不愿留名的员工。"); }
        if (target.includes("spoon") || target.includes("wax spoon") || target.includes("蜡勺") || target.includes("小银勺")) { clue("wax_registry"); return say(uiEnglish ? "WAX-WARMING SPOON\n\nThe spoon carries traces of the same red wax used on board packets. Its tray log confirms Iris checked it out at Clara's request." : "加热封蜡的小银勺\n\n勺上残留的红蜡与董事会资料包所用批次相同。托盘登记证实，艾丽斯依克拉拉的要求取用了它。"); }
        if (target.includes("wax") || target.includes("envelope") || target.includes("fiber") || target.includes("蜡") || target.includes("信封") || target.includes("纤维")) { clue("wax_fiber"); clue("wax_registry"); return say(uiEnglish ? "SEALING WAX AND ENVELOPE FIBRES\n\nThe red wax and beige fibres in the wound match Clara's confidential board packet. The batch register shows Iris collected the wax at Clara's request." : "封蜡与信封纤维\n\n伤口中的红蜡和米色纤维，与克拉拉的机密董事会资料包相符。批次登记显示这批红蜡由艾丽斯依克拉拉要求领取。 "); }
        if (target.includes("audit") || target.includes("memo") || target.includes("fund") || target.includes("审计") || target.includes("备忘录") || target.includes("资金")) { clue("audit_memo"); return say(uiEnglish ? "AUDIT MEMO\n\nDr. Ashford planned to reveal Clara's diversion of exhibition funds to the board the following morning." : "审计备忘录\n\n阿什福德博士计划于次日早晨向董事会揭露克拉拉挪用展览资金的行为。 "); }
        say(uiEnglish ? "Try: footage, camera, knife, letter opener, access card, call log, sealing wax, or audit memo." : "请尝试：录像、摄像头、刀、拆信刀、门禁卡、通话记录、封蜡或审计备忘录。", "warning");
    }

    function accuse(name) {
        const id = person(name);
        if (!id) return say(uiEnglish ? "Whom do you accuse? Try: accuse Clara / Daniel / Evelyn / Marcus / Iris / Victor" : "要指控谁？请尝试：指控 克拉拉 / 丹尼尔 / 伊芙琳 / 马库斯 / 艾丽斯 / 维克多", "warning");
        if (game.solved) return say(uiEnglish ? "The case is already solved. Type \"restart\" to investigate again." : "案件已经侦破。输入“重启”可再次调查。", "muted");
        game.accusations++;
        if (id !== "clara") {
            const outcomes = {
                daniel: "丹尼尔确实在巡逻一事上撒谎，但签字还款单和摄像头录像证明他在整个死亡时段都在楼下。他在掩盖恶习，而非杀人。",
                evelyn: "伊芙琳心怀怨恨，但图书管理员在整个死亡时段都与她并肩工作。只有动机而无机会，不足以定罪。",
                marcus: "被栽赃的刀和争吵令马库斯看起来很危险，但那把刀无法造成伤口。请找出真正的凶器。",
                iris: "艾丽斯知道紧急会议的事，但接线台录音覆盖了整个死亡时段。",
                victor: "维克多确实因嫉妒伪造匿名举报和目击者便笺，企图毁掉阿什福德博士的名誉并嫁祸马库斯，但受托人通话录音证明他在整个死亡时段都不在档案室附近。恶意和伪证并不等于杀人。"
            };
            const englishOutcomes = {
                daniel: "Daniel lied about his patrol, but the signed repayment slip and camera footage place him downstairs throughout the death window. He concealed a vice, not murder.",
                evelyn: "Evelyn held resentment, but the librarian worked beside her throughout the death window. Motive without opportunity is not enough.",
                marcus: "The planted knife and argument make Marcus look dangerous, but the weapon cannot make the wound. Find the real murder weapon.",
                iris: "Iris knew about the emergency meeting, but switchboard recordings cover the entire death window.",
                victor: "Victor forged anonymous complaints and a witness note out of jealousy, hoping to ruin Ashford and frame Marcus, but the trustee-call recording places him away from the archive throughout the death window. Malice and forgery are not murder."
            };
            return say(uiEnglish ? `YOU ACCUSE ${people[id].englishName}.\n\n${englishOutcomes[id]}` : `你指控了 ${people[id].name}。\n\n${outcomes[id]}`, "danger");
        }
        const missing = finalRequiredClues.filter(id => !game.clues.has(id));
        if (missing.length) return say(uiEnglish ? "YOU ACCUSE CLARA.\n\nThe theory has motive and opportunity, but the case is not yet strong enough to close. Keep exploring the contradictions in testimony, the alibis, and the physical trail through the archive." : "你指控了克拉拉。\n\n这个推论具备动机和机会，但案件证据尚不足以结案。请继续探索证词中的矛盾、不在场证明，以及档案室留下的物证路径。", "warning");
        if (game.finalTheoryStep === 0) {
            game.finalTheoryStep = 1;
            return say(uiEnglish ? `FINAL DEDUCTION\n\nYour evidence supports an accusation, but you must now reconstruct the crime.\n\nStep 1 of 3: State the medical examiner's death window.\nType: theory time 9:21-9:23` : `最终推理\n\n你的证据支持指控，但你必须重建犯罪过程。\n\n第 1 步，共 3 步：指出法医确认的死亡时段。\n输入：理论 时间 9:21-9:23`, "important");
        }
        return say(uiEnglish ? "Your final deduction is already in progress. Answer the current theory prompt." : "最终推理正在进行。请回答当前的理论问题。", "warning");
    }

    function theory(answer) {
        if (game.finalTheoryStep === 0) return say(uiEnglish ? "Present a fully evidenced accusation of Clara before beginning the final deduction." : "请先在证据完整后指控克拉拉，才能开始最终推理。", "warning");

        const response = clean(answer);
        if (game.finalTheoryStep === 1) {
            if (!response.includes("9:21") || !response.includes("9:23")) return say(uiEnglish ? "That does not match the medical examiner's death window. Recheck the archive evidence." : "这与法医确认的死亡时段不符。请重新检查档案室证据。", "warning");
            game.finalTheoryStep = 2;
            return say(uiEnglish ? `Correct.\n\nStep 2 of 3: Name the weapon that made the wound.\nType: theory weapon letter opener` : `正确。\n\n第 2 步，共 3 步：指出造成伤口的凶器。\n输入：理论 凶器 拆信刀`, "important");
        }
        if (game.finalTheoryStep === 2) {
            if (!response.includes("letter opener") && !response.includes("拆信刀")) return say(uiEnglish ? "That weapon cannot account for the flat, narrow wound. Recheck the autopsy and Clara's office." : "该物品无法造成扁平狭窄的伤口。请重新检查法医报告和克拉拉的办公室。", "warning");
            game.finalTheoryStep = 3;
            return say(uiEnglish ? `Correct.\n\nStep 3 of 3: State the physical trace linking the weapon to Clara.\nType: theory trace wax and envelope fibre` : `正确。\n\n第 3 步，共 3 步：指出将凶器与克拉拉相连的物证痕迹。\n输入：理论 痕迹 红蜡和信封纤维`, "important");
        }
        if (!((response.includes("wax") && (response.includes("fibre") || response.includes("fiber"))) || (response.includes("红蜡") && response.includes("信封纤维")))) return say(uiEnglish ? "The decisive trace combines red wax with board-envelope fibre. Recheck the archive and wax register." : "决定性的痕迹是红蜡与董事会信封纤维。请重新检查档案室和封蜡登记。", "warning");
        finishCase();
    }

    function finishCase() {
        game.solved = true;
        statusEl.textContent = "案件状态：已侦破";
        say("", "normal");
        say("================================================================", "important");
        say(uiEnglish ? "CASE SOLVED - THE LAST EXHIBIT" : "案件侦破 - 最后的展品", "important");
        say("================================================================", "important");
        say("", "normal");
        say(uiEnglish ? "KILLER: CLARA VOSS" : "凶手：克拉拉·沃斯", "system");
        say(uiEnglish ? `\nDEDUCTION

    1. The medical examiner places death between 9:21 and 9:23 PM.
    2. The archive camera ran two minutes slow. Corrected footage shows Clara leaving the archive corridor at 9:24 PM.
    3. Clara's office called Ashford at 9:16, then her master card opened the archive at 9:18.
    4. She unplugged the camera relay at 9:19 to conceal her movements.
    5. Marcus's knife was planted: it cannot make the wound, has no fresh blood, and workshop footage proves he was elsewhere.
    6. Daniel, Evelyn, Iris, and Victor all have verified continuous alibis during the death window. Victor's jealous forgeries and false lead are separate crimes, not murder.
    7. The wound matches the cleaned letter opener from Clara's office. Blood, red wax, and board-envelope fibres connect it to her packet.
    8. The wax register links her packet, the wound residue, and the corridor trail; chance contact cannot explain this.
    9. The ledger's carbon copy shows the missing exhibition funds moving through Voss Cultural Holdings into shell accounts.
    10. Ashford planned to expose Clara's diversion of exhibition funds. That gave her a motive to silence him.

    Clara lured Ashford into the archive, cut the relay, killed him with the letter opener, planted Marcus's knife, and returned to her office.\n\nCASE CLOSED.` : `\n推理结论

    1. 法医估计死亡发生于晚上 9:21 至 9:23。
    2. 档案室摄像头慢了两分钟。校正后录像显示，克拉拉于晚上 9:24 离开档案室走廊。
    3. 克拉拉的办公室在 9:16 致电阿什福德博士，随后她的万能门禁卡于 9:18 打开档案室。
    4. 她在 9:19 故意拔掉摄像头继电器，以掩盖自己的行踪。
    5. 马库斯的刀是栽赃物：它无法造成该伤口，没有新鲜血迹，工坊录像也证明他当时不在场。
    6. 丹尼尔、伊芙琳、艾丽斯和维克多在死亡时段均有经核实的连续不在场证明。维克多因嫉妒伪造匿名举报和指向马库斯的目击者便笺；他的假线索是另一桩罪行，但不是谋杀。
    7. 伤口与克拉拉办公室里被清洗过的拆信刀相符。血迹、红蜡和董事会信封纤维都将凶器与她的资料包联系起来。
    8. 红蜡批次登记将她的资料包、伤口残留物和走廊路径联系起来；这不是偶然接触能够解释的。
    9. 财务分类账的碳纸副本显示，失踪的展览资金经由沃斯文化控股流入空壳账户。
    10. 阿什福德博士计划揭露克拉拉挪用展览资金。这给了她杀人灭口的动机。

    克拉拉诱骗阿什福德博士进入档案室，切断继电器，用拆信刀杀害他，放置马库斯的刀作为栽赃物，然后返回办公室。\n\n案件结案。`);
        say(uiEnglish ? `\nYou solved the case in ${game.accusations} accusation(s).` : `\n你用 ${game.accusations} 次指控侦破了案件。`, "system");
    }

    function requirements() {
        say(uiEnglish ? `INVESTIGATION GUIDE\n\nFollow whichever leads interest you: compare testimony, test alibis, search rooms, and inspect physical evidence. Some lies protect private secrets; others conceal the murder.\n\nWhen you are ready to accuse someone, your evidence must explain the death window, the weapon, and the trace that connects the killer to the crime.` : `调查指南\n\n你可以从任何感兴趣的线索开始：对照证词、核验不在场证明、搜索房间，并检查物证。有些谎言在掩盖私人秘密，另一些则在掩盖谋杀。\n\n当你准备指控某人时，你的证据必须解释死亡时段、凶器，以及将凶手与犯罪现场相连的物证痕迹。`);
    }

    function details() {
        say(uiEnglish ? `CASE STATUS\n\n  Evidence recorded: ${game.clues.size}\n  Interviews started: ${game.talked.size}/6\n  Areas searched: ${game.searched.size}\n  Accusations made: ${game.accusations}\n  Case: ${game.solved ? "SOLVED" : "OPEN"}` : `案件状态\n\n  已发现证据：${game.clues.size}\n  已开始讯问：${game.talked.size}/6\n  已搜索区域：${game.searched.size}\n  已提出指控：${game.accusations}\n  案件：${game.solved ? "已侦破" : "进行中"}`);
    }

    window.murderRunCommand = raw => {
        const command = clean(raw);
        if (!command) return;
        say("> " + raw, "command");
        if (command === "help" || command === "帮助" || command === "?") return printHelp();
        if (command === "look" || command === "overview" || command === "查看") return say(`案件概览\n\n布莱克伍德博物馆馆长朱利安·阿什福德博士于晚上 9:34 被发现死于封闭档案室。私人董事会招待会结束后，六人仍留在馆内。\n\n档案室摄像头被禁用，一把刀将嫌疑指向其中一人，而数份不在场证明暗藏谎言。请找出谁策划了谋杀、谋杀何时发生，以及哪项证据能够证明一切。`);
        if (command === "suspects" || command === "people" || command === "嫌疑人") return say(uiEnglish ? "PEOPLE PRESENT\n\n  Clara Voss - Deputy Director\n  Daniel Rook - Night Security Chief\n  Evelyn Hart - Collections Researcher\n  Marcus Cole - Antiquities Dealer\n  Iris Bell - Board Secretary\n  Victor Hale - Board Treasurer\n\nUse: talk [name]" : "在场人员\n\n  克拉拉·沃斯 - 副馆长\n  丹尼尔·鲁克 - 夜班安保主管\n  伊芙琳·哈特 - 馆藏研究员\n  马库斯·科尔 - 古董商\n  艾丽斯·贝尔 - 董事会秘书\n  维克多·黑尔 - 董事会司库\n\n使用：交谈 [姓名]");
        if (command === "timeline" || command === "time" || command === "时间线") return say(uiEnglish ? "KNOWN TIMELINE\n\n  8:55 PM - Board reception ends; exterior doors lock.\n  9:08 PM - Clara says she leaves Ashford's office.\n  9:14 PM - Evelyn signs into the reading room.\n  9:16 PM - Clara's office calls Ashford.\n  9:18 PM - Clara's master card opens the archive.\n  9:19 PM - Archive camera relay loses power.\n  9:20 PM - Iris's first switchboard call begins; Victor begins a trustee call.\n  9:23 PM - Archive camera relay returns.\n  9:27 PM - Victor's trustee call ends.\n  9:28 PM - Iris's second switchboard call begins.\n  9:34 PM - Clara reports finding the body.\n\nThe archive camera runs two minutes slow." : "已知时间线\n\n  晚上 8:55 - 董事会招待会结束；大门锁闭。\n  晚上 9:08 - 克拉拉称自己离开阿什福德博士办公室。\n  晚上 9:14 - 伊芙琳在阅览室签到。\n  晚上 9:16 - 克拉拉的办公室致电阿什福德博士。\n  晚上 9:18 - 克拉拉的万能门禁卡打开档案室。\n  晚上 9:19 - 档案室摄像头继电器断电。\n  晚上 9:20 - 艾丽斯的第一通接线台电话开始；维克多开始与受托人通话。\n  晚上 9:23 - 档案室摄像头继电器恢复。\n  晚上 9:27 - 维克多的受托人通话结束。\n  晚上 9:28 - 艾丽斯的第二通接线台电话开始。\n  晚上 9:34 - 克拉拉报告发现尸体。\n\n档案室摄像头慢了两分钟。 ");
        if (command === "clues" || command === "evidence" || command === "线索") return game.clues.size ? say((uiEnglish ? "RECORDED EVIDENCE\n\n" : "已发现证据\n\n") + [...game.clues].map((id, index) => `${index + 1}. ${uiEnglish ? englishEvidence[id] : evidence[id]}`).join("\n\n")) : say(uiEnglish ? "No evidence has been formally recorded. Search the museum and interview the suspects." : "尚未正式记录任何证据。请搜索博物馆并讯问嫌疑人。");
        if (command === "notes" || command === "笔记") return say(uiEnglish ? "DETECTIVE NOTES\n\nEstablish the real time of death. Separate lies concealing private secrets from lies concealing murder. Then connect motive, opportunity, and physical evidence to one person." : "侦探笔记\n\n确定真实的死亡时间。区分掩盖私人秘密的谎言与掩盖谋杀的谎言。接着将动机、机会和物证联系到同一个人身上。");
        if (command === "requirements" || command === "case requirements" || command === "要求" || command === "案件要求") return requirements();
        if (command === "status" || command === "状态") return details();
        if (command === "clear" || command === "清屏") { output.innerHTML = ""; return; }
        if (command === "restart" || command === "reset" || command === "重启") return restartGame();
        let match = command.match(/^(talk|interview|交谈)\s+(.+)$/); if (match) return interview(match[2]);
        match = command.match(/^(question|提问)\s+(.+)$/); if (match) return question(match[2]);
        match = command.match(/^(examine|搜查)\s+(.+)$/); if (match) return examine(match[2]);
        match = command.match(/^(inspect|检查)\s+(.+)$/); if (match) return inspect(match[2]);
        match = command.match(/^(accuse|指控)\s+(.+)$/); if (match) return accuse(match[2]);
        match = command.match(/^(theory|理论)\s+(.+)$/); if (match) return theory(match[2]);
        say(uiEnglish ? `Unknown command: "${raw}"\n\nType "help" for available commands.` : `未知命令：“${raw}”\n\n输入“帮助”查看可用命令。`, "warning");
    };

    const gameSaveKey = `deduction-game-progress-v1-${activeSaveId}`;
    const legacyChineseSaveKey = `deduction-game-progress-zh-v1-${activeSaveId}`;

    function saveChineseGame() {
        localStorage.setItem(gameSaveKey, JSON.stringify({
            clues: [...game.clues],
            talked: [...game.talked],
            casualTalkIndex: game.casualTalkIndex,
            questioned: game.questioned,
            searched: [...game.searched],
            accusations: game.accusations,
            finalTheoryStep: game.finalTheoryStep,
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
            game.casualTalkIndex = savedGame.casualTalkIndex || {};
            game.questioned = savedGame.questioned || {};
            game.searched = new Set(savedGame.searched || []);
            game.accusations = savedGame.accusations || 0;
            game.finalTheoryStep = savedGame.finalTheoryStep || 0;
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

招待会结束不久，阿什福德在封闭档案室中被发现遭人杀害。安保主管立即封锁大楼。招待会后仍留在馆内的六个人，现在都无法离开。`);
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
        game.casualTalkIndex = {};
        game.questioned = {};
        game.searched.clear();
        game.accusations = 0;
        game.finalTheoryStep = 0;
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
