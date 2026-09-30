const isEnglish = new URLSearchParams(window.location.search).get("lang") === "en";
let uiEnglish = isEnglish;

function switchLanguage() {
    const terminalOutput = document.getElementById("output");
    const transcript = terminalOutput.innerHTML;
    const scrollTop = terminalOutput.scrollTop;

    uiEnglish = !uiEnglish;
    updateInterfaceText();

    if (terminalOutput.innerHTML !== transcript) {
        terminalOutput.innerHTML = transcript;
    }
    window.updateTerminalLanguage?.();
    terminalOutput.scrollTop = scrollTop;
}

function getUiCopy() {
    return uiEnglish
        ? {
            documentTitle: "Murder Deduction Game",
            terminalTitle: "DETECTIVE TERMINAL",
            banner: "\n  MURDER DEDUCTION GAME\n",
            commandPlaceholder: "Type a command...",
            send: "send",
            switchLanguage: "中文",
            restart: "restart case",
            caseOpen: "CASE STATUS: OPEN",
            caseSolved: "CASE STATUS: SOLVED",
            title: "Choose a Case",
            description: "Name a new case or load a previously saved case.",
            placeholder: "New case name",
            create: "Start New Case",
            load: "Load",
            delete: "Delete",
            confirmDelete: "Delete this saved case? This cannot be undone."
        }
        : {
            documentTitle: "谋杀推理游戏",
            terminalTitle: "侦探终端",
            banner: "\n  谋 杀 推 理 游 戏\n",
            commandPlaceholder: "输入命令...",
            send: "发送",
            switchLanguage: "English",
            restart: "重启案件",
            caseOpen: "案件状态：进行中",
            caseSolved: "案件状态：已侦破",
            title: "选择案件",
            description: "为新案件命名，或载入之前保存的案件。",
            placeholder: "新案件名称",
            create: "开始新案件",
            load: "载入",
            delete: "删除",
            confirmDelete: "要删除这个已保存的案件吗？此操作无法撤销。"
        };
}

function updateInterfaceText() {
    const copy = getUiCopy();
    const solved = /SOLVED|已侦破/.test(document.getElementById("status").textContent);

    document.documentElement.lang = uiEnglish ? "en" : "zh-CN";
    document.title = copy.documentTitle;
    document.querySelector(".top-title").textContent = copy.terminalTitle;
    document.querySelector(".ascii-title").textContent = copy.banner;
    document.getElementById("commandInput").placeholder = copy.commandPlaceholder;
    document.querySelector(".command-submit").textContent = copy.send;
    document.getElementById("languageToggle").textContent = copy.switchLanguage;
    document.getElementById("dialogLanguageToggle").textContent = copy.switchLanguage;
    document.getElementById("restartButton").textContent = copy.restart;
    document.getElementById("status").textContent = solved ? copy.caseSolved : copy.caseOpen;

    if (!document.getElementById("saveDialog").classList.contains("hidden")) {
        renderSaveDialog();
    }
}

const saveRegistryKey = "deduction-game-saves-v1";
const activeSaveId = new URLSearchParams(window.location.search).get("save");
const stories = window.storyCatalog || [];
const legacyStoryIds = { "untitled-case": "blackthorn-manor-murder" };

function getStory(storyId) {
    const resolvedStoryId = legacyStoryIds[storyId] || storyId;
    return stories.find(story => story.id === resolvedStoryId) || stories[0];
}

function getSavedGames() {
    try {
        const savedGames = JSON.parse(localStorage.getItem(saveRegistryKey));
        return Array.isArray(savedGames) ? savedGames : [];
    } catch {
        return [];
    }
}

const savedGames = getSavedGames();
const activeSave = savedGames.find(game => game.id === activeSaveId);
const hasActiveSave = Boolean(activeSave);
window.getActiveStory = () => getStory(activeSave?.storyId);

function loadGame(saveId, language) {
    const url = new URL(window.location.href);
    url.searchParams.set("save", saveId);
    url.searchParams.set("lang", language);
    window.location.href = url.toString();
}

function deleteGame(saveId) {
    const gameIndex = savedGames.findIndex(game => game.id === saveId);
    if (gameIndex === -1) return;

    const [deletedGame] = savedGames.splice(gameIndex, 1);
    localStorage.removeItem(`deduction-game-progress-v1-${deletedGame.id}`);
    localStorage.removeItem(`deduction-game-progress-en-v1-${deletedGame.id}`);
    localStorage.removeItem(`deduction-game-progress-zh-v1-${deletedGame.id}`);
    localStorage.setItem(saveRegistryKey, JSON.stringify(savedGames));

    const url = new URL(window.location.href);
    url.searchParams.delete("save");
    window.location.href = url.toString();
}

function createGame(name, storyId) {
    const saveName = name.trim();
    const story = getStory(storyId);
    if (!saveName || !story) return;

    const newGame = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: saveName,
        storyId: story.id,
        language: uiEnglish ? "en" : "zh"
    };
    savedGames.push(newGame);
    localStorage.setItem(saveRegistryKey, JSON.stringify(savedGames));
    loadGame(newGame.id, newGame.language);
}

function setupSaveDialog() {
    const dialog = document.getElementById("saveDialog");
    if (hasActiveSave) {
        dialog.classList.add("hidden");
        return;
    }

    renderSaveDialog();

    document.getElementById("saveForm").addEventListener("submit", event => {
        event.preventDefault();
        createGame(document.getElementById("saveName").value, document.getElementById("storySelect").value);
    });
    document.getElementById("saveName").focus();
}

function renderSaveDialog() {
    const copy = getUiCopy();
    document.getElementById("saveDialogTitle").textContent = copy.title;
    document.getElementById("saveDialogDescription").textContent = copy.description;
    document.getElementById("saveName").placeholder = copy.placeholder;
    document.getElementById("createSaveButton").textContent = copy.create;

    const storySelect = document.getElementById("storySelect");
    const selectedStoryId = storySelect.value || stories[0]?.id;
    storySelect.innerHTML = "";
    stories.forEach(story => {
        const option = document.createElement("option");
        option.value = story.id;
        option.textContent = story.title;
        option.selected = story.id === selectedStoryId;
        storySelect.appendChild(option);
    });

    const saveList = document.getElementById("saveList");
    saveList.innerHTML = "";
    savedGames
        .forEach(game => {
            const item = document.createElement("div");
            item.className = "save-item";
            const name = document.createElement("span");
            name.className = "save-item-name";
            name.textContent = `${game.name} - ${getStory(game.storyId)?.title || stories[0]?.title || "Unknown story"}`;
            const loadButton = document.createElement("button");
            loadButton.type = "button";
            loadButton.textContent = copy.load;
            loadButton.addEventListener("click", () => loadGame(game.id, game.language));
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-save";
            deleteButton.textContent = copy.delete;
            deleteButton.addEventListener("click", () => {
                if (window.confirm(copy.confirmDelete)) deleteGame(game.id);
            });
            const actions = document.createElement("div");
            actions.className = "save-actions";
            actions.append(loadButton, deleteButton);
            item.append(name, actions);
            saveList.appendChild(item);
        });
}

updateInterfaceText();
setupSaveDialog();

