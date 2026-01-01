function formatTime(timeNum, whole) {
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

// Variables
let didActions = [];
let currentVer = 0;

let lyrics = [];
let selectedLine = 0;

const defaults = {
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

// Initiate elements
/// Class
const actionButtons = document.querySelectorAll(".action-btn");
const checkboxes = document.querySelectorAll(".checkbox");
const tabButtons = document.querySelectorAll(".tab-btn");
/// Identifiers
const newWords = document.querySelectorAll("#new-word-line");
const newRomanWords = document.querySelectorAll("#new-roman-word");
/// Identifier
const actionFile = document.getElementById("action-file-menu");
const lyricLines = document.getElementById("lyric-lines");
const addLine = document.getElementById("add-line");
const addLineInstrumental = document.getElementById("add-line-instrumental");
const addLineTogether = document.getElementById("add-line-together");
const contextMenu = document.getElementById("context-menu");

// Data functions
function addNewLine(parameters = {}, data = {}) {
    function separator(cls) {
        const separator = document.createElement("div");
        separator.className = cls;
        return separator;
    }

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

    lyrics.push(struct);

    // Create element
    if (!lyricLines) return;

    let hasBgWords = false;
    const instrumenone = struct.isInstrumental ? "none" : "";
    const wordParts = struct.parts.length > 0 ? struct.parts : [{
        startTimeMs: struct.startTimeMs,
        words: struct.words,
        durationMs: struct.durationMs
    }];
    const romanizations = (struct.timedRomanization && struct.timedRomanization.length > 0) && struct.timedRomanization || (struct.romanization && [{
        startTimeMs: struct.startTimeMs,
        words: struct.romanization,
        durationMs: struct.durationMs
    }]) || [];

    const lyricLine = document.createElement("div");
    if (struct.isInstrumental) lyricLine.classList.add("lyric-line-instrumental");
    lyricLine.classList.add("lyric-line");

    /// Suggestions
    const suggestions = document.createElement("div");
    suggestions.className = "line-suggestions";
    suggestions.style.display = "none";

    // const suggestionWarn = document.createElement("div");
    // suggestionWarn.className = "line-warning";
    // suggestionWarn.innerHTML = defaults.svg.warning;    
    // suggestionWarn.style.display = "none";
    // suggestions.appendChild(suggestionWarn);

    // const suggestionInfo = document.createElement("div");
    // suggestionInfo.className = "line-info";
    // suggestionInfo.innerHTML = defaults.svg.info;    
    // suggestionInfo.style.display = "none";
    // suggestions.appendChild(suggestionInfo);

    lyricLine.appendChild(suggestions);
    
    /// Timeline
    const timeLine = document.createElement("span");
    timeLine.className = "line-timeline";

    if (struct.isInstrumental) {
        const instrumental = document.createElement("span");
        instrumental.id = "line-instrumental";
        instrumental.innerHTML = `<strong class="code">[INSTRUMENTAL]</strong>`;
        timeLine.appendChild(instrumental);
    }

    const startTimeLine = document.createElement("span");
    startTimeLine.id = "line-start-time";
    startTimeLine.innerHTML = `<strong class="code">${formatTime(struct.startTimeMs, true)}</strong>`;
    timeLine.appendChild(startTimeLine);

    timeLine.appendChild(separator("span-separator"));

    const durationTimeLine = document.createElement("span");
    durationTimeLine.id = "line-duration";
    durationTimeLine.className = "code";
    durationTimeLine.textContent = `${formatTime(struct.durationMs)}s`;
    timeLine.appendChild(durationTimeLine);

    const belowSep = separator("span-separator");
    belowSep.style.display = instrumenone;
    timeLine.appendChild(belowSep);

    const voiceLine = document.createElement("span");
    voiceLine.id = "line-voice"
    voiceLine.className = "code";
    voiceLine.textContent = struct.agent;
    voiceLine.style.display = instrumenone;
    timeLine.appendChild(voiceLine);

    lyricLine.appendChild(timeLine);

    /// Normal Line
    const normalLine = document.createElement("div");
    normalLine.id = "normal-line";
    normalLine.className = "line";
    normalLine.style.display = instrumenone;
    
    //// SVG
    switch (struct.agent) {
        case "v1": normalLine.innerHTML = defaults.svg.leftAlign; break;
        case "v2": normalLine.innerHTML = defaults.svg.rightAlign; break;
        case "v2": normalLine.innerHTML = defaults.svg.rightAlign; break;
        case "v1000": normalLine.innerHTML = defaults.svg.middleAlign; break;
        default: normalLine.innerHTML = defaults.svg.justify; break;
    }

    //// Normal Words Wrapper
    const normalWordsWrapper = document.createElement("div");
    normalWordsWrapper.className = "words-wrapper";

    const normalWords = document.createElement("div");
    normalWords.className = "words";

    wordParts.forEach(part => {
        if (typeof part != "object" || part.words.length < 1) { return; }
        const partWord = part.words;
        if (part.isBackground) { hasBgWords = true; return; }
        
        const allSpaces = partWord.trim().length < 1;

        const word = document.createElement("button");
        word.className = "word";

        const text = document.createElement("span");
        text.className = "word-text";
        if (allSpaces) text.classList.add("word-space");
        text.textContent = allSpaces ? `${partWord.length}x` : partWord;
        word.appendChild(text);

        normalWords.appendChild(word);
    });

    const newNormalWord = document.createElement("input");
    newNormalWord.id = "new-word-line";
    newNormalWord.type = "text";
    newNormalWord.className = "input";
    newNormalWord.placeholder = "Type a word or line";
    newNormalWord.addEventListener("keydown", e => {
        const input = newNormalWord;

        if (e.key != "Enter" || input.value.length < 1) { return; }
        const allSpace = input.value.trim().length < 1
        
        const interactableWord = document.createElement("button");
        interactableWord.className = "word";
        
        const word = document.createElement("span");
        word.className = "word-text";
        word.textContent = allSpace ? `${input.value.length}x` : input.value;
        if (allSpace) { word.classList.add("word-space"); }

        interactableWord.appendChild(word);
        
        didActions.push({
            type: "enter-word",
            input: input.value
        });
        
        currentVer += 1;

        input.value = "";
        input.before(interactableWord);
    });

    normalWords.appendChild(newNormalWord);
    normalWordsWrapper.appendChild(normalWords);
    normalLine.appendChild(normalWordsWrapper);

    const addNewLine = document.createElement("button");
    addNewLine.setAttribute("data-tooltip", "Add new line");
    addNewLine.className = "add-new-line icon-btn left-tooltip-icon-btn";
    addNewLine.innerHTML = defaults.svg.plus;
    normalLine.appendChild(addNewLine);

    lyricLine.appendChild(normalLine);

    /// Background separator
    const bgSeparator = separator("separator-column");
    bgSeparator.style.display = hasBgWords ? "" : "none";
    lyricLine.appendChild(bgSeparator);

    /// Background Line
    const bgLine = document.createElement("div");
    bgLine.className = "line";
    bgLine.id = "background-line";
    bgLine.style.display = hasBgWords ? "" : "none";

    //// SVG
    bgLine.innerHTML = defaults.svg.paragraph;

    //// Background Words Wrapper
    const bgWordsWrapper = document.createElement("div");
    bgWordsWrapper.className = "words-wrapper";

    const bgWords = document.createElement("div");
    bgWords.className = "words";

    wordParts.filter(val => val.isBackground && val.word && val.word.length < 1).forEach(part => {
        const partWord = part.words;
        const allSpaces = partWord.trim().length < 1;

        const word = document.createElement("button");
        word.className = "word";

        const text = document.createElement("span");
        text.className = "word-text";
        if (allSpaces) text.classList.add("word-space");
        text.textContent = allSpaces ? `${partWord.length}x` : partWord;
        word.appendChild(text);

        bgWords.appendChild(word);
    });

    const newBgWord = document.createElement("input");
    newBgWord.id = "new-word-line";
    newBgWord.type = "text";
    newBgWord.className = "input";
    newBgWord.placeholder = "Type a word or line";
    newBgWord.addEventListener("keydown", e => {
        const input = newBgWord;

        if (e.key != "Enter" || input.value.length < 1) { return; }
        const allSpace = input.value.trim().length < 1
        
        const interactableWord = document.createElement("button");
        interactableWord.className = "word";
        
        const word = document.createElement("span");
        word.className = "word-text";
        word.textContent = allSpace ? `${input.value.length}x` : input.value;
        if (allSpace) { word.classList.add("word-space"); }

        interactableWord.appendChild(word);
        
        didActions.push({
            type: "enter-word",
            input: input.value
        });
        
        currentVer += 1;

        input.value = "";
        input.before(interactableWord);
    });

    bgWords.appendChild(newBgWord);
    bgWordsWrapper.appendChild(bgWords);
    bgLine.appendChild(bgWordsWrapper);

    lyricLine.appendChild(bgLine);

    /// Romanizations
    const romanization = document.createElement("div");
    romanization.className = "line-romanization";
    romanization.innerHTML = `<strong class="code">Romanization:</strong>`;

    const romans = document.createElement("div");
    romans.className = "line-romans";

    romanizations.forEach(part => {
        const partWord = part.words;
        if (partWord.length < 1) { return; }

        const roman = document.createElement("button");
        roman.className = "line-roman";
        roman.textContent = partWord.trim().length < 1 ? `${partWord.length}x` : partWord;

        romans.appendChild(roman);
    });

    romanization.appendChild(romans);

    const newRoman = document.createElement("input");
    newRoman.id = "new-roman-word";
    newRoman.type = "text";
    newRoman.className = "input line-roman";
    newRoman.placeholder = "Type a word or line";
    newRoman.addEventListener("keydown", e => {
        const input = newRoman;

        if (e.key != "Enter" || input.value.length < 1) { return; }
        
        const roman = document.createElement("button");
        roman.className = "line-roman";
        roman.textContent = input.value.trim().length < 1 ? `${input.value.length}x` : input.value;
        
        // push to history
        didActions.push({
            type: "enter-roman-word",
            input: input.value
        });
        
        currentVer += 1;

        // reset input and append the new roman word
        input.value = "";
        input.before(roman);
    });

    romans.appendChild(newRoman);

    lyricLine.appendChild(romanization);

    /// Place the lyric line on the element
    lyricLines.appendChild(lyricLine);
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
    if (addLine) {
        addLine.addEventListener("click", () => {
            addNewLine();
        });
    }

    if (addLineInstrumental) {
        addLineInstrumental.addEventListener("click", () => {
            addNewLine({ isInstrumental: true });
        });
    }

    if (addLineTogether) {
        addLineTogether.addEventListener("click", () => {
            addNewLine({ isTogether: true });
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
        contextMenu.style.top = "";
        contextMenu.style.bottom = "";
        contextMenu.style.left = "";
        contextMenu.style.right = "";
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