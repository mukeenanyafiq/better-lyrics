import { addNewLine } from "./editorDom.js";

// Variables
let historyStack = [];
let historyVer = 0;

let lyrics = [];

let selectedLine = 0;
let hoveringLine = 0;
let hoveringWord = 0;

// Storing context menu button and their functions when clicked
let contextMenuB = [];

// Global variables
export const defaults = {
    svg: {
        plus: `<svg class="plus" width="16" height="16" viewBox="0 0 16 16"><path d="M8 3.333v9.334M3.334 8h9.333" stroke="currentColor" stroke-width="1.2"/></svg>`,

        // line suggestive
        warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M2.725 21q-.275 0-.5-.137t-.35-.363-.137-.488.137-.512l9.25-16q.15-.25.388-.375T12 3t.488.125.387.375l9.25 16q.15.25.138.513t-.138.487-.35.363-.5.137zM12 18q.425 0 .713-.288T13 17t-.288-.712T12 16t-.712.288T11 17t.288.713T12 18m0-3q.425 0 .713-.288T13 14v-3q0-.425-.288-.712T12 10t-.712.288T11 11v3q0 .425.288.713T12 15"/></svg>`,
        
        info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m1 15h-2v-6h2zm0-8h-2V7h2z"/></svg>`,

        // for voice 1
        leftAlign: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="line-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M14 18a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm6-5a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2zm-6-5a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm6-5a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/></svg>`,

        // for voice 1000
        middleAlign: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="line-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M17 18a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm3-5a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2zm-3-5a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm3-5a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/></svg>`,

        // for voice 2 and voice 3
        rightAlign: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="line-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M20 18a1 1 0 0 1 0 2H10a1 1 0 0 1 0-2zm0-5a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2zm0-5a1 1 0 0 1 0 2H10a1 1 0 0 1 0-2zm0-5a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/></svg>`,

        // for voice more than 3 (acts as a unidentified alignment)
        justify: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="line-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M4 3a1 1 0 0 0 0 2h16a1 1 0 1 0 0-2zm0 5a1 1 0 0 0 0 2h16a1 1 0 1 0 0-2zm-1 6a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1m1 4a1 1 0 1 0 0 2h16a1 1 0 1 0 0-2z"/></svg>`,

        // for background liens
        paragraph: `<svg xmlns="http://www.w3.org/2000/svg" class="line-svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6h4m4 0h-4m0 0v12M4 11h3m3 0H7m0 0v7"/></svg>`
    },
    parentData: {
        clyricsEditorDisplay: {
            timeline: true,
            roman: true,
            translate: false
        }
    },
    lineLint: {
        // Level 0 - Info suggestion to give much better experience
        "INSTRUMENTAL_GAP": {
            level: 0,
            msg: "Suggestion: Make the instrumental line only if there's a 5 seconds or more start time gap between the previous line and the next line"
        },
        
        // Level 1 - Warns user that the experience will not look as good if ignored
        "START_TIME_LOWER": {
            level: 1,
            msg: "Start time is lower than the previous line. Move the line up or change the start time!"
        },
        "START_TIME_EXCEEDS": {
            level: 1,
            msg: "Start time is higher than the duration metadata. Extend the metadata duration or change the start time!"
        }
    }
}

export function formatTime(timeNum, whole) {
    if (!timeNum) return whole ? `00:00.000` : `0.000`;

    const totalSec = Math.floor(timeNum / 1000);
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    const millisec = timeNum % 1000;

    const padZero = (num, length = 2) => {
        return num.toString().padStart(length, "0");
    };
    
    if (whole || minutes > 0) return `${padZero(minutes)}:${padZero(seconds)}.${padZero(millisec, 3)}`;
    return `${seconds}.${padZero(millisec, 3)}`;
}

export function logAction(type, value, args = {}) {
    // contains valid actions and an extra required arguments listed on the array
    const validActions = {
        "new-line": ["line"],
        "new-word-line": ["line", "type", "word"],
        "new-roman-line": ["line", "word"],

        "toggle-bg-line": ["line"],

        "moved-line": ["line", "from", "to"],
        "moved-word-line": ["line", "word", "from", "to"],
        "moved-roman-line": ["line", "word", "from", "to"]
    }

    const action = validActions[type]
    if (!action) return;
    action.forEach(action => {
        if (!args[action]) return;
    });

    console.log(`Logged action ${type}`);
    historyStack.push({
        type: type,
        value: value,
        ...args
    });

    historyVer += 1;
}

// Initiate elements
/// Class
export const actionButtons = document.querySelectorAll(".action-btn");
export const checkboxes = document.querySelectorAll(".checkbox");
export const tabButtons = document.querySelectorAll(".tab-btn");
/// Identifiers
export const newWords = document.querySelectorAll("#new-word-line");
export const newRomanWords = document.querySelectorAll("#new-roman-word");
/// Identifier
export const actionFile = document.getElementById("action-file-menu");
export const lyricLines = document.getElementById("lyric-lines");
export const addLine = document.getElementById("add-line");
export const addLineInstrumental = document.getElementById("add-line-instrumental");
export const addLineTogether = document.getElementById("add-line-together");
export const contextMenu = document.getElementById("context-menu");

// Data functions
function save() {

}

function createNewLine(parameters = {}, data = {}) {
    const prevLine = lyrics[lyrics.length - 1];
    
    const struct = {
        startTimeMs: data.startTimeMs || prevLine ? prevLine.startTimeMs + prevLine.durationMs : 0,
        words: data.words || "",
        durationMs: data.durationMs || 2000,
        parts: data.parts || [],
        agent: data.agent ? `v${parseInt(data.agent.match(/\d+/) ? data.agent.match(/\d+/)[0] : 1)}` : parameters.isInstrumental ? undefined : (parameters.isTogether ? "v1000" : "v1"),
        isInstrumental: data.isInstrumental || parameters.isInstrumental,
        translation: data.translation,
        romanization: data.romanization,
        timedRomanization: data.timedRomanization,
    };

    const index = lyrics.push(struct);
    const line = addNewLine(struct);
    
    line.addEventListener("mouseenter", () => { if (hoveringLine < 1) hoveringLine = index - 1; });
    line.addEventListener("mouseleave", () => { if (hoveringLine > 0) hoveringLine = 0 });
    line.addEventListener("click", () => { selectedLine = index - 1; });
}

// Handlers
/// Actions
function handleActionsMenu() {
    let actionMenuOpen = null;
    function closeActionMenu() {
        if (!actionMenuOpen) return;
        actionMenuOpen.style.display = "none";
        actionMenuOpen.style.opacity = "0";
        actionMenuOpen = null;
    }
    
    const actionFunc = {
        "action-file-btn": {
            menu: actionFile,
            func: function(btn) {
                actionMenuOpen = actionFile;
                actionFile.style.top = `${Math.round(btn.getBoundingClientRect().bottom + 4)}`;
                actionFile.style.left = `${Math.round(btn.getBoundingClientRect().left)}`;
                actionFile.style.display = "flex";
                requestAnimationFrame(() => {
                    actionFile.style.opacity = "1";
                });
            }
        }
    };
    
    actionButtons.forEach(button => {
        button.addEventListener("click", e => {
            const act = actionFunc[button.id]
            if (act && actionMenuOpen == act.menu) { return closeActionMenu(); }
            closeActionMenu();
            if (act && act.func) act.func(button);
        });
    });
}

/// Tab Buttons
function handleTabs() {
    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            tabButtons.forEach(btn => btn.classList.remove("active-btn"));
            button.classList.add("active-btn");
        });
    });
}

/// Tools
function handleTools() {
    const parentData = {}

    /// New Line
    if (addLine) {
        addLine.addEventListener("click", () => createNewLine() );
    }

    if (addLineInstrumental) {
        addLineInstrumental.addEventListener("click", () => createNewLine({ isInstrumental: true }) );
    }

    if (addLineTogether) {
        addLineTogether.addEventListener("click", () => createNewLine({ isTogether: true }) );
    }

    /// Checkboxes
    const checkboxFunc = {
        "show-timeline-btn": {
            parent: "clyricsEditorDisplay", id: "timeline",
            func: function(x) {
                const timelines = document.querySelectorAll(".line-timeline");
                timelines.forEach(timeline => { timeline.style.display = x ? "" : "none"; });
            }
        },

        "show-roman-btn": {
            parent: "clyricsEditorDisplay", id: "roman",
            func: function(x) {
                const romans = document.querySelectorAll(".line-romanization");
                romans.forEach(roman => { roman.style.display = x ? "" : "none"; });
            }
        },

        "show-translate-btn": {
            parent: "clyricsEditorDisplay", id: "translate",
            func: function(x) {
                const translates = document.querySelectorAll(".line-translate");
                translates.forEach(translate => { translate.style.display = x ? "" : "none"; });
            }
        },
    };
    
    checkboxes.forEach(async checkbox => {
        const checker = checkboxFunc[checkbox.id]
        if (checker && checker.parent) {
            // const loaded = (await chrome.storage.sync.get(checker.parent))[checker.parent] || defaultParentData[checker.parent] || {};
            const loaded = defaults.parentData[checker.parent] || {};
            parentData[checker.parent] = loaded;
            
            checker.func(loaded[checker.id]);
            if (loaded[checker.id]) checkbox.classList.add("checked");
            else checkbox.classList.remove("checked");
        }

        checkbox.addEventListener("click", async () => {
            const checked = checkbox.classList.contains("checked");

            if (checked) checkbox.classList.remove("checked");
            else checkbox.classList.add("checked");
            
            if (checker) {
                checker.func(!checked);

                if (checker.parent) {
                    // const read = (await chrome.storage.sync.get(checker.parent))[checker.parent] || defaults.parentData[checker.parent] || {};
                    const read = defaults.parentData[checker.parent] || {};
                    read[checker.id] = !checked;

                    // chrome.storage.sync.set({ [checker.parent]: read });
                }
            }
        })
    });
}

/// Lyric Line
function handleLyricLine() {
    lyricLines.matches("div:hover")
}

/// Context Menu
function handleContextMenu() {
    if (!contextMenu) { console.warn("No context menu loaded. Refresh to reload handler"); return }
    let contextMenuOpen = false;
    
    function loadContextMenu() {
        const buttons = [ ...contextMenuB ];
        buttons.forEach(btn => {
            if (typeof btn != "object" || !btn.type) return;
            if (btn.type == "button") {
                const button = document.createElement("button");
                button.className = "list-btn";
                button.innerHTML = btn.content + (btn.rightCont ? `<strong>${btn.rightCont}</strong>` : "");
                button.disabled = btn.disabled;
                if (typeof btn.func == "function") button.addEventListener("click", () => btn.func());
                contextMenu.appendChild(button);
            } else if (btn.type == "separator") {
                const separator = document.createElement("div");
                separator.className = "separator-column";
                contextMenu.appendChild(separator);
            } else if (btn.type == "span") {
                const span = document.createElement("span");
                span.className = "code";
                span.style.opacity = .5;
                span.innerHTML = btn.content;
                contextMenu.appendChild(span);
            }
        })
    }

    function closeContextMenu() {
        contextMenuOpen = false;
        contextMenu.style.opacity = "0";
        contextMenu.style.top = "";
        contextMenu.style.bottom = "";
        contextMenu.style.left = "";
        contextMenu.style.right = "";
        contextMenu.classList.add("hidden");
        contextMenu.innerHTML = "";
    }
    
    document.addEventListener("click", e => {
        if (contextMenuOpen && !contextMenu.matches(`${contextMenu.tagName}:hover`)) {
            closeContextMenu();
        }
    });
    
    document.addEventListener("contextmenu", e => {
        if (contextMenuOpen) {
            closeContextMenu();
        } else {
            if (contextMenuB.length < 1) { return; }
            loadContextMenu();

            const rect = document.documentElement.getBoundingClientRect()
            contextMenuOpen = true;
            e.preventDefault();

            if (e.clientY / rect.height >= .6) contextMenu.style.bottom = `${rect.height - e.clientY}px`;
            else contextMenu.style.top = `${e.clientY}px`;

            if (e.clientX / rect.width >= .8) contextMenu.style.right = `${rect.width - e.clientX}px`;
            else contextMenu.style.left = `${e.clientX}px`;

            contextMenu.classList.remove("hidden");
            requestAnimationFrame(() => { contextMenu.style.opacity = "1"; });
        }
    });
};

/// Keybind
function handleKeybind() {
    const keybinds = {
        // Undo (Ctrl+Z)
        undo: {
            keys: ["Ctrl", "z"],
            func: function() {

            }
        }
    };
    
    document.addEventListener("keydown", e => {
        let pressed = [];
        if (e.ctrlKey) pressed.push("Ctrl");
        if (e.altKey) pressed.push("Alt");
        if (e.metaKey) pressed.push("Meta");
        if (e.shiftKey) pressed.push("Shift");
        pressed.push(e.key);
    
        
    });
}

// Set up the handlers on load
document.addEventListener("DOMContentLoaded", () => {
    handleActionsMenu();
    handleTabs();
    handleTools();
    handleLyricLine();
    handleContextMenu();
    handleKeybind();
});