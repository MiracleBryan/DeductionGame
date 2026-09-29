const output = document.getElementById("output");
const input = document.getElementById("commandInput");
const commandForm = document.getElementById("commandForm");
const statusEl = document.getElementById("status");

let history = [];
let historyIndex = 0;

const state = {
    clues: new Set(),
    talked: new Set(),
    examined: new Set(),
    accusations: 0,
    solved: false,
    ending: false
};

const englishSaveKey = `deduction-game-progress-en-v1-${activeSaveId}`;

function saveEnglishGame() {
    localStorage.setItem(englishSaveKey, JSON.stringify({
        clues: [...state.clues],
        talked: [...state.talked],
        examined: [...state.examined],
        accusations: state.accusations,
        solved: state.solved,
        ending: state.ending,
        status: statusEl.textContent,
        output: output.innerHTML
    }));
}

function restoreEnglishGame() {
    try {
        const savedGame = JSON.parse(localStorage.getItem(englishSaveKey));
        if (!savedGame) return false;

        state.clues = new Set(savedGame.clues || []);
        state.talked = new Set(savedGame.talked || []);
        state.examined = new Set(savedGame.examined || []);
        state.accusations = savedGame.accusations || 0;
        state.solved = Boolean(savedGame.solved);
        state.ending = Boolean(savedGame.ending);
        output.innerHTML = savedGame.output || "";
        statusEl.textContent = savedGame.status || "CASE STATUS: OPEN";
        return true;
    } catch {
        localStorage.removeItem(englishSaveKey);
        return false;
    }
}

if (isEnglish && hasActiveSave) {
    window.gamePersistence = {
        save: saveEnglishGame,
        clear: () => localStorage.removeItem(englishSaveKey)
    };
}

const suspects = {
    clara: {
        name: "Clara Bennett",
        role: "Museum curator",
        intro:
`Clara has worked at the museum for eleven years.

She says she was in her office reviewing insurance paperwork when the
lights went out. She heard the emergency alarm click, but did not leave
her office because she assumed Daniel was handling the situation.

She discovered the empty display case at approximately 9:30 PM.`,
        extra:
`Clara: "I knew the sapphire was insured. But that doesn't mean I wanted
it stolen. The museum would survive the loss. My reputation might not."`,
        clue: "clara_statement"
    },
    daniel: {
        name: "Daniel Price",
        role: "Security guard",
        intro:
`Daniel was stationed at the main entrance.

He says he checked the exhibition room at 9:00 PM and saw the sapphire
inside its locked case. At 9:15 PM, the lights went out for roughly two
minutes.

He claims he remained near the entrance during the blackout.`,
        extra:
`Daniel: "The important thing is this: the blackout wasn't a normal power
failure. Someone used the manual electrical panel."`,
        clue: "daniel_statement"
    },
    evelyn: {
        name: "Evelyn Hart",
        role: "Curator's assistant",
        intro:
`Evelyn says she was in the staff kitchen preparing coffee when the
blackout occurred.

She says she remembers looking at the kitchen clock at 9:17 PM and
then returning to the exhibition area after the lights came back.

She insists she never went near the sapphire display.`,
        extra:
`Evelyn: "I was making coffee. I remember because I had barely taken a
sip when everything went dark."`,
        clue: "evelyn_statement"
    },
    marcus: {
        name: "Marcus Cole",
        role: "Visiting jeweller",
        intro:
`Marcus was invited to examine several pieces for an upcoming exhibition.

He says he spent most of the evening in the restoration workshop.

He admits he had handled blue protective cloth earlier that day, and
he was carrying a jeweller's toolkit, but says he never entered the
sapphire gallery during the blackout.`,
        extra:
`Marcus: "Of course I know what a sapphire is worth. That's precisely why
I wouldn't be stupid enough to steal one from a museum full of cameras."`,
        clue: "marcus_statement"
    }
};

const commands = {
    help: `AVAILABLE COMMANDS

  look                         Examine the current case overview
  suspects                     List everyone inside the museum
  talk [name]                  Interview a suspect
  question [name]              Ask a follow-up question
  examine [place]              Search an area
  inspect [object]             Inspect a specific object
  timeline                     Reconstruct the known timeline
  clues                        Review discovered evidence
  notes                        Review your detective notes
  accuse [name]                Make an accusation
  status                       Show case progress
  clear                        Clear the terminal
  restart                      Start the case again

EXAMPLES

  talk evelyn
  question evelyn
  examine kitchen
  inspect coffee
  inspect camera
  examine electrical panel
  clues

You do not need to discover every clue, but a correct solution requires
connecting multiple pieces of evidence.`,

    look: `CASE OVERVIEW

The Blackwood Museum closed to the public at 8:30 PM.

At 9:00 PM, the Blue Star Sapphire was confirmed inside a locked
display case in Gallery 3.

At approximately 9:15 PM, the museum experienced a two-minute blackout.

At 9:30 PM, curator Clara Bennett discovered that the sapphire was gone.

There were four people inside the museum:

  Clara Bennett   — Curator
  Daniel Price    — Security guard
  Evelyn Hart     — Curator's assistant
  Marcus Cole     — Visiting jeweller

No door or window alarm was triggered.

Your task: determine who stole the sapphire, how they did it, and which
evidence proves their story is false.`,

    suspects: `PEOPLE PRESENT

  CLARA BENNETT
  Museum curator
  Last known location: Curator's office

  DANIEL PRICE
  Security guard
  Last known location: Main entrance

  EVELYN HART
  Curator's assistant
  Last known location: Staff kitchen

  MARCUS COLE
  Visiting jeweller
  Last known location: Restoration workshop

Useful:
  talk [name]
  question [name]`,

    timeline: `KNOWN TIMELINE

  8:30 PM   Museum closes to public.
  8:45 PM   Marcus arrives for a private jewellery consultation.
  9:00 PM   Daniel checks Gallery 3. Sapphire is present.
  9:07 PM   Clara signs insurance paperwork in her office.
  9:10 PM   Marcus is recorded entering the restoration workshop.
  9:13 PM   Kitchen coffee machine is activated.
  9:15 PM   Gallery camera records a blackout.
  9:17 PM   Lights return.
  9:22 PM   Daniel performs an exterior door check.
  9:30 PM   Clara discovers the empty sapphire display.
  9:34 PM   Police are called.

Important:
The Gallery 3 security camera has a clock that runs two minutes behind
the museum's central clock.`,

    status: () => {
        const total = 12;
        const found = state.clues.size;
        return `CASE STATUS

  Evidence discovered: ${found}/${total}
  Interviews completed: ${state.talked.size}/4
  Areas searched: ${state.examined.size}

  Accusations made: ${state.accusations}
  Case: ${state.solved ? "SOLVED" : "OPEN"}`;
    },

    clues: () => {
        if (state.clues.size === 0)
            return "No evidence has been formally logged yet.\n\nSearch the museum and question the suspects.";
        return "DISCOVERED EVIDENCE\n\n" +
            [...state.clues].map((c, i) => `${i + 1}. ${clueText[c]}`).join("\n\n");
    },

    notes: () => {
        return `DETECTIVE NOTES

The thief needed:
  1. Access to the museum during the blackout.
  2. Knowledge of the display lock.
  3. A way to create darkness without triggering a power-failure alarm.
  4. Enough time to remove the sapphire.
  5. A believable reason for being elsewhere.

Watch the timestamps carefully.

A statement can be technically possible and still be inconsistent
with physical evidence.`;
    }
};

const clueText = {
    clara_statement: "Clara's statement: she remained in her office during the blackout.",
    daniel_statement: "Daniel confirms the blackout was manually triggered, not caused by a normal power failure.",
    evelyn_statement: "Evelyn claims she was actively making coffee around the time of the blackout.",
    marcus_statement: "Marcus confirms he was in the restoration workshop and had handled blue protective cloth.",
    camera_delay: "Gallery camera clock is exactly 2 minutes behind the museum's central clock.",
    cold_coffee: "The coffee in the kitchen is completely cold despite Evelyn saying she had just made it.",
    coffee_timer: "The coffee machine log shows it was activated at 9:13 PM, but no second activation occurred near 9:15 PM.",
    panel_access: "The manual electrical panel is in the staff corridor. Its cover shows fresh fingerprints and a small smear of blue fabric.",
    blue_thread: "A blue thread is caught beneath the sapphire display lock.",
    evelyn_cardigan: "Evelyn's blue cardigan has a small missing thread at the cuff. The thread's weave matches the one under the display lock.",
    key_log: "Electronic access records show Evelyn's staff access card entered the staff corridor at 9:14 PM.",
    case_lock: "The display lock shows no forced damage. It was opened normally with the museum's authorized key."
};

function print(text, cls="normal") {
    const div = document.createElement("div");
    div.className = "line " + cls;
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

function addClue(id) {
    if (!state.clues.has(id)) {
        state.clues.add(id);
        print("[EVIDENCE LOGGED] " + clueText[id], "important");
    }
}

function printIntro() {
    print("CASE FILE 047 — THE MISSING SAPPHIRE", "system");
    print("");
    print("A $2.4 million blue sapphire has disappeared from a locked museum display.", "normal");
    print("Four people remained inside the building after closing.", "normal");
    print("");
    print("This is a text deduction game. Type commands and investigate the case.", "warning");
    print("Type 'help' to see what you can do.", "system");
    print("");
    print("The museum waits. The clock reads 9:34 PM.", "muted");
}

function normalize(s) {
    return s.toLowerCase().trim().replace(/\s+/g, " ");
}

function findSuspect(name) {
    name = normalize(name);
    if (name.includes("clara")) return "clara";
    if (name.includes("daniel") || name.includes("dan")) return "daniel";
    if (name.includes("evelyn") || name.includes("eve")) return "evelyn";
    if (name.includes("marcus") || name.includes("mark")) return "marcus";
    return null;
}

function talk(name) {
    const id = findSuspect(name);
    if (!id) {
        print("Unknown suspect. Try: clara, daniel, evelyn, or marcus.", "warning");
        return;
    }

    const s = suspects[id];
    state.talked.add(id);
    addClue(s.clue);

    print(`${s.name.toUpperCase()} — ${s.role.toUpperCase()}`, "system");
    print("");
    print(s.intro);
    print("");
    print(s.extra);
    print("");
    print(`You can 'question ${id}' for a more specific response.`, "muted");
}

function question(name) {
    const id = findSuspect(name);
    if (!id) {
        print("Unknown suspect.", "warning");
        return;
    }

    if (!state.talked.has(id)) {
        print(`You should interview ${suspects[id].name} first. Try: talk ${id}`, "warning");
        return;
    }

    if (id === "clara") {
        print(`QUESTION: Where were you when the lights went out?

Clara:
"I was in my office. The door was open. I heard the lights click off,
then on again. I didn't see anyone pass my doorway."

She pauses.

"Actually... I heard footsteps in the staff corridor immediately
before the lights returned. I assumed it was Daniel."`);
        return;
    }

    if (id === "daniel") {
        addClue("panel_access");
        print(`QUESTION: Who could have triggered the blackout?

Daniel:
"The electrical panel is not locked. Staff can reach it, but visitors
normally don't know where it is."

He thinks for a moment.

"The blackout lasted almost exactly two minutes. That's too clean to
be an accidental outage."

He also confirms that the gallery's emergency lighting should have
prevented total darkness inside the display room unless the manual
gallery circuit was deliberately switched off.`);
        return;
    }

    if (id === "evelyn") {
        print(`QUESTION: What exactly were you doing in the kitchen?

Evelyn:
"I put coffee on at around 9:13. I was there when the lights went out.
I waited for them to return."

QUESTION: Did you leave the kitchen?

Evelyn:
"No."

She answers quickly.

"Not even for a moment."`, "normal");
        return;
    }

    if (id === "marcus") {
        addClue("case_lock");
        print(`QUESTION: Could you open the sapphire case?

Marcus:
"Not without the museum key. The lock isn't a common jewellery lock.
It's a restricted display mechanism."

QUESTION: Did you have the key?

Marcus:
"No. Clara and Daniel have authorized access. Evelyn sometimes assists
Clara during exhibitions, but I don't know whether she has access."`);
        return;
    }
}

function examine(place) {
    const p = normalize(place);

    if (p.includes("kitchen")) {
        state.examined.add("kitchen");
        addClue("cold_coffee");
        addClue("coffee_timer");
        print(`STAFF KITCHEN

A mug sits beside the coffee machine.

The coffee is completely cold.

The machine's internal log shows:
  9:13 PM — brew cycle activated
  9:14 PM — brew cycle completed
  9:15 PM — no activation
  9:16 PM — no activation
  9:17 PM — no activation

There is no sign that someone prepared a fresh cup during the blackout.

The kitchen door opens directly toward the staff corridor.`, "normal");
        return;
    }

    if (p.includes("gallery") || p.includes("display") || p.includes("exhibition")) {
        state.examined.add("gallery");
        addClue("blue_thread");
        addClue("case_lock");
        print(`GALLERY 3

The sapphire display is empty.

The glass is intact. No alarm was triggered. There are no scratches
around the lock.

A tiny blue thread is caught underneath the locking mechanism.

The case appears to have been opened with the correct key rather than
forced.

The gallery camera points toward the display and the entrance corridor.`);
        return;
    }

    if (p.includes("camera")) {
        state.examined.add("camera");
        addClue("camera_delay");
        print(`GALLERY CAMERA

The camera recording shows:

  9:13 PM camera time — Evelyn is not visible in the gallery.
  9:15 PM camera time — lights go out.
  9:17 PM camera time — lights return.
  9:18 PM camera time — a person crosses the far end of the corridor.

The camera clock is exactly TWO MINUTES SLOW.

Therefore:
  Camera 9:13 = Museum 9:15
  Camera 9:15 = Museum 9:17

The blackout happened at approximately 9:17 PM by the museum's master
clock, not 9:15 PM.`, "normal");
        return;
    }

    if (p.includes("workshop")) {
        state.examined.add("workshop");
        print(`RESTORATION WORKSHOP

Marcus's jeweller's toolkit is on the bench.

A sign-in sheet shows:
  9:10 PM — Marcus entered
  9:24 PM — Marcus left

A blue protective cloth lies beside the tools.

The cloth is thick cotton. The thread found under the display lock is
much finer and has a different weave.

Marcus has an obvious reason to be suspicious, but the physical evidence
does not match his cloth.`);
        return;
    }

    if (p.includes("office")) {
        state.examined.add("office");
        print(`CURATOR'S OFFICE

Insurance paperwork is spread across Clara's desk.

A timestamped document was printed at 9:07 PM.

The office contains no hidden passage, spare display key, or evidence
of a struggle.

Clara's claim that she was working here is consistent with the office
records.`);
        return;
    }

    if (p.includes("corridor") || p.includes("electrical") || p.includes("panel")) {
        state.examined.add("panel");
        addClue("panel_access");
        print(`STAFF CORRIDOR — ELECTRICAL PANEL

The manual electrical panel controls several museum circuits.

One switch controls the emergency gallery circuit.

The panel cover has fresh fingerprints and a small smear of blue fabric.

The switch itself has been moved recently.

There is no evidence of a power-company outage.

The panel is approximately twenty seconds from the staff kitchen and
about one minute from Gallery 3.`);
        return;
    }

    print(`You cannot find "${place}". Try kitchen, gallery, camera, workshop,
office, or electrical panel.`, "warning");
}

function inspect(obj) {
    const o = normalize(obj);

    if (o.includes("coffee") || o.includes("mug")) {
        addClue("cold_coffee");
        addClue("coffee_timer");
        print(`COFFEE

The coffee is cold enough that it could not reasonably have been made
during the blackout.

The mug is also dry around the rim, suggesting it has been sitting
untouched for several minutes.

Evelyn said she had "barely taken a sip" before the lights went out.`);
        return;
    }

    if (o.includes("camera")) {
        examine("camera");
        return;
    }

    if (o.includes("thread") || o.includes("fabric")) {
        addClue("blue_thread");
        print(`BLUE THREAD

A tiny blue thread was found under the display lock.

It is not part of the museum's cleaning cloths.

The thread is smooth, fine, and dark blue.`);
        return;
    }

    if (o.includes("cardigan") || o.includes("clothing") || o.includes("evelyn")) {
        addClue("evelyn_cardigan");
        print(`EVELYN'S CARDIGAN

Evelyn's blue cardigan has a small damaged area near the left cuff.

One thread is missing.

The missing thread is visually consistent with the thread found under
the sapphire display lock.

This is suggestive, but you need more evidence to establish when the
damage occurred.`);
        return;
    }

    if (o.includes("key") || o.includes("lock")) {
        addClue("case_lock");
        print(`DISPLAY LOCK

The lock has not been forced.

It was opened using the correct museum key.

The key therefore matters more than physical strength or a jeweller's
toolkit.`);
        return;
    }

    if (o.includes("access") || o.includes("card")) {
        addClue("key_log");
        print(`ACCESS CARD LOG

Staff corridor access:

  9:08 PM — Clara
  9:10 PM — Marcus enters workshop area
  9:14 PM — Evelyn enters staff corridor
  9:22 PM — Daniel performs exterior door check

Evelyn's 9:14 PM access is especially important when combined with the
blackout and the location of the electrical panel.`);
        return;
    }

    if (o.includes("panel")) {
        examine("electrical panel");
        return;
    }

    print(`Nothing useful found for "${obj}". Try coffee, camera, thread,
cardigan, lock, access card, or panel.`, "warning");
}

function accuse(name) {
    const id = findSuspect(name);

    if (!id) {
        print("Accuse whom? Try: accuse clara / daniel / evelyn / marcus", "warning");
        return;
    }

    if (state.solved) {
        print("The case has already been solved. Type 'restart' to investigate again.", "muted");
        return;
    }

    state.accusations++;

    if (id === "evelyn") {
        const required = [
            "cold_coffee", "camera_delay", "panel_access",
            "blue_thread", "evelyn_cardigan", "key_log", "case_lock"
        ];
        const missing = required.filter(x => !state.clues.has(x));

        if (missing.length > 0) {
            print(`You accuse Evelyn.

The theory is plausible, but the evidence is incomplete.

You are missing ${missing.length} important piece(s) of evidence.

The strongest unresolved questions are:
  - How did the thief create the blackout?
  - How did they open the display?
  - What physical evidence connects them to the case?

Keep investigating.`, "warning");
            return;
        }

        solve();
        return;
    }

    if (id === "marcus") {
        print(`You accuse Marcus.

The theory initially looks convincing: he is a jeweller, he understands
valuable stones, and blue fabric was found near the case.

But the evidence does not hold together.

The blue cloth in the workshop has a different weave from the thread at
the display. Marcus's workshop sign-in record also places him there
during the critical period.

The accusation fails.

The real question remains: who had both access to the electrical panel
AND an authorized display key?`, "danger");
        return;
    }

    if (id === "daniel") {
        print(`You accuse Daniel.

Daniel certainly knew the security system and could reach the electrical
panel.

But the access record and physical evidence do not place him near the
display during the blackout. The display was opened with a key, but no
evidence links Daniel to the blue thread.

Your theory has a gap.`, "danger");
        return;
    }

    if (id === "clara") {
        print(`You accuse Clara.

Clara has an authorized key and clearly knew the museum's security
procedures.

However, the office records support her location, and there is no
physical evidence connecting her to the electrical panel or blue thread.

The theory is possible, but unsupported.`, "danger");
        return;
    }
}

function solve() {
    state.solved = true;
    state.ending = true;
    statusEl.textContent = "CASE STATUS: SOLVED";

    print("");
    print("══════════════════════════════════════════════════════════════════════", "important");
    print("CASE SOLVED — THE MISSING SAPPHIRE", "important");
    print("══════════════════════════════════════════════════════════════════════", "important");
    print("");
    print("CULPRIT: EVELYN HART", "system");
    print("");
    print(`THE DEDUCTION

1. The sapphire was present at 9:00 PM.

2. The blackout was manually triggered. It was not an ordinary power
   failure.

3. The electrical panel is in the staff corridor, and Evelyn's access
   card entered that corridor at 9:14 PM.

4. The gallery camera is two minutes slow. Therefore the recorded
   blackout time must be adjusted before comparing statements.

5. Evelyn claimed she was continuously in the kitchen making coffee.
   But the coffee machine shows its brew cycle finished at 9:14 PM,
   and there was no new cycle during the blackout.

6. The coffee was already cold when investigators examined it.

7. The display was opened with an authorized key, not forced.

8. A blue thread was caught under the lock.

9. Evelyn's blue cardigan is missing a thread at the cuff, matching the
   thread found at the display.

10. Marcus's blue workshop cloth is a red herring: its weave does not
    match the thread at the display.

Evelyn had the opportunity, access to the staff corridor, knowledge of
the museum, and an authorized way to open the display.

Her coffee story was the key contradiction.

During the blackout, she appears to have triggered the electrical
shutdown, crossed to Gallery 3, opened the case, removed the sapphire,
and returned before the lights were restored.

CASE CLOSED.`, "normal");

    print("");
    print("You solved the case in " + state.accusations + " accusation(s).", "system");
    print("Type 'restart' if you want to attempt the case again.", "muted");
}

function restartGame() {
    window.gamePersistence?.clear();
    location.reload();
}

function runCommand(raw) {
    const command = normalize(raw);
    if (!command) return;

    print("> " + raw, "command");
    history.push(raw);
    historyIndex = history.length;

    if (command === "help" || command === "?") {
        print(typeof commands.help === "function" ? commands.help() : commands.help, "system");
        return;
    }

    if (command === "look" || command === "overview") {
        print(commands.look, "normal");
        return;
    }

    if (command === "suspects" || command === "people") {
        print(commands.suspects, "normal");
        return;
    }

    if (command === "timeline" || command === "time") {
        print(commands.timeline, "normal");
        return;
    }

    if (command === "clues" || command === "evidence") {
        print(commands.clues(), "normal");
        return;
    }

    if (command === "notes") {
        print(commands.notes, "normal");
        return;
    }

    if (command === "status") {
        print(commands.status(), "normal");
        return;
    }

    if (command === "clear") {
        output.innerHTML = "";
        return;
    }

    if (command === "restart" || command === "reset") {
        restartGame();
        return;
    }

    let match = command.match(/^talk\s+(.+)$/);
    if (match) {
        talk(match[1]);
        return;
    }

    match = command.match(/^question\s+(.+)$/);
    if (match) {
        question(match[1]);
        return;
    }

    match = command.match(/^interview\s+(.+)$/);
    if (match) {
        talk(match[1]);
        return;
    }

    match = command.match(/^examine\s+(.+)$/);
    if (match) {
        examine(match[1]);
        return;
    }

    match = command.match(/^inspect\s+(.+)$/);
    if (match) {
        inspect(match[1]);
        return;
    }

    match = command.match(/^accuse\s+(.+)$/);
    if (match) {
        accuse(match[1]);
        return;
    }

    print(`Unknown command: "${raw}"

Type 'help' for available commands.`, "warning");
}

function submitCommand() {
    const value = input.value;
    input.value = "";
    if (window.murderRunCommand) {
        window.murderRunCommand(value);
        window.gamePersistence?.save();
        return;
    }
    runCommand(value);
    window.gamePersistence?.save();
}

commandForm.addEventListener("submit", e => {
    e.preventDefault();
    submitCommand();
});

input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        commandForm.requestSubmit();
        return;
    }

    if (e.key === "ArrowUp") {
        e.preventDefault();
        if (history.length) {
            historyIndex = Math.max(0, historyIndex - 1);
            input.value = history[historyIndex] || "";
        }
    }

    if (e.key === "ArrowDown") {
        e.preventDefault();
        if (history.length) {
            historyIndex = Math.min(history.length, historyIndex + 1);
            input.value = history[historyIndex] || "";
        }
    }
});

document.addEventListener("click", () => {
    if (document.getElementById("saveDialog").classList.contains("hidden")) {
        input.focus();
    }
});

if (!isEnglish || !hasActiveSave || !restoreEnglishGame()) {
    printIntro();
}
