// Variables
let editing = 0;

let didActions = [];
let currentVer = 0;

const defaultParentData = {
    clyricsEditorDisplay: {
        timeline: true,
        roman: true,
        translate: false
    }
}

// Initiate elements
/// Class
const actionButtons = document.querySelectorAll(".action-btn");
const checkboxes = document.querySelectorAll(".checkbox");
const tabButtons = document.querySelectorAll(".tab-btn");
/// Identifiers
const newWords = document.querySelectorAll("#new-word-line");
/// Identifier
const actionFile = document.getElementById("action-file-menu");
const contextMenu = document.getElementById("context-menu");
const addLine = document.getElementById("add-line");
const addLineTogether = document.getElementById("add-line-together");

// Global functions
export function addNewLine() {

}

// Actions
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
                actionFile.style.top = `${btn.getBoundingClientRect().bottom + 4}`;
                actionFile.style.left = `${btn.getBoundingClientRect().left}`;
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

// Tab Buttons
function handleTabs() {
    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            tabButtons.forEach(btn => btn.classList.remove("active-btn"));
            button.classList.add("active-btn");
        });
    });
}

// Tools
function handleTools() {
    const parentData = {}

    /// New Line
    if (addLine && addLineTogether) {
        addLine.addEventListener("click", () => {

        });
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
            const loaded = defaultParentData[checker.parent] || {};
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
                    // const read = (await chrome.storage.sync.get(checker.parent))[checker.parent] || defaultParentData[checker.parent] || {};
                    const read = defaultParentData[checker.parent] || {};
                    read[checker.id] = !checked;

                    // chrome.storage.sync.set({ [checker.parent]: read });
                }
            }
        })
    });
}

// Lyric Line
function handleLyricLine() {

}

function handleNewWordInput() {
    newWords.forEach(input => {
        input.addEventListener("keydown", e => {
            if (e.key != "Enter" || input.value.length < 1) { return; }
            const allSpace = input.value.trim().length < 1
            
            const interactableWord = document.createElement("button");
            interactableWord.className = "word";
            
            const word = document.createElement("span");
            word.textContent = allSpace ? `${input.value.length}x` : input.value;
            if (allSpace) { word.classList.add("word-space"); }
            word.classList.add("word-text");
    
            interactableWord.appendChild(word);
            
            didActions.push({
                type: "enter-word",
                input: input.value
            });
            
            currentVer += 1;
    
            input.value = "";
            input.before(interactableWord);
        });
    });
}

// Context Menu
function handleContextMenu() {
    let contextMenuOpen = false;
    
    function closeContextMenu() {
        contextMenuOpen = false;
        contextMenu.style.opacity = "0";
        contextMenu.classList.add("hidden");
    }
    
    document.addEventListener("click", e => {
        if (contextMenuOpen && !contextMenu.matches(":hover")) {
            closeContextMenu();
        }
    });
    
    document.addEventListener("contextmenu", e => {
        if (contextMenuOpen) {
            closeContextMenu();
        } else {
            contextMenuOpen = true;
            e.preventDefault();
            contextMenu.style.top = `${e.clientY}px`;
            contextMenu.style.left = `${e.clientX}px`;
            contextMenu.classList.remove("hidden");
            requestAnimationFrame(() => { contextMenu.style.opacity = "1"; });
        }
    });
};

// Keybind
function handleKeybind() {
    const keybinds = {
        "ctrl+z": function() {
    
        }
    }
    
    document.addEventListener("keydown", e => {
        // let built = ""
        // if (e.ctrlKey) built += "+ctrl"
        // if (e.altKey) built += "+alt"
        // if (e.metaKey) built += "+meta"
        // if (e.shiftKey) built += "+shift"
        // built = built.substring(1)
        // built += `${built.length > 0 ? "+" : ""}` + e.key
    
        // Undo (Ctrl+Z)
        console.log(e.key);
    })
}

// SET THEM ALL UP
document.addEventListener("DOMContentLoaded", () => {
    handleActionsMenu();
    handleTabs();
    handleTools();
    handleNewWordInput();
    handleContextMenu();
    handleKeybind();
});