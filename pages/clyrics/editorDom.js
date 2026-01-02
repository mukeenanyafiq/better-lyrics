import { defaults, formatTime, logAction, lyricLines } from "./editor.js";

export const contextMenus = {
    default: [
        { type: "button", content: "Add new lyric line" },
        { type: "button", content: "Add new instrumental line" },
        { type: "button", content: "Add new secondary lyric line (v2)" },
        { type: "button", content: "Add new tertiary lyric line (v3)" },
    ],
    line: [
        { type: "button", content: "Adjust Line", rightCont: ">" },
        { type: "button", content: "Instrumental Line", rightCont: "✓" },
        { type: "button", content: "Background Line", rightCont: "(B)" },
        { type: "separator" },
        { type: "button", content: "Duplicate Line", rightCont: "(Ctrl+D)" },
        { type: "button", content: "Delete Line", rightCont: "(Del)", disabled: true },
        { type: "button", content: "Add new line after", rightCont: "(Ctrl+Plus)" },
        { type: "button", content: "Add new line before", rightCont: "(Ctrl+Shift+Plus)" },
        { type: "separator" },
        { type: "button", content: "Line Properties", rightCont: "(Alt+Enter)" },
    ]
}

export function addNewLine(data = {}) {
    function separator(cls) {
        const separator = document.createElement("div");
        separator.className = cls;
        return separator;
    }

    // Create element
    if (!lyricLines) return;

    let hasBgWords = false;
    const instrumenone = data.isInstrumental ? "none" : "";
    const wordParts = data.parts.length > 0 ? data.parts : [{
        startTimeMs: data.startTimeMs,
        words: data.words,
        durationMs: data.durationMs
    }];
    const romanizations = (data.timedRomanization && data.timedRomanization.length > 0) && data.timedRomanization || (data.romanization && [{
        startTimeMs: data.startTimeMs,
        words: data.romanization,
        durationMs: data.durationMs
    }]) || [];

    const lyricLine = document.createElement("div");
    if (data.isInstrumental) lyricLine.classList.add("lyric-line-instrumental");
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
    timeLine.style.display = defaults.parentData.clyricsEditorDisplay.timeline ? "" : "none"

    if (data.isInstrumental) {
        const instrumental = document.createElement("span");
        instrumental.id = "line-instrumental";
        instrumental.innerHTML = `<strong class="code">[INSTRUMENTAL]</strong>`;
        timeLine.appendChild(instrumental);
    }

    const startTimeLine = document.createElement("span");
    startTimeLine.id = "line-start-time";
    startTimeLine.innerHTML = `<strong class="code">${formatTime(data.startTimeMs, true)}</strong>`;
    timeLine.appendChild(startTimeLine);

    timeLine.appendChild(separator("span-separator"));

    const durationTimeLine = document.createElement("span");
    durationTimeLine.id = "line-duration";
    durationTimeLine.className = "code";
    durationTimeLine.textContent = `${formatTime(data.durationMs)}s`;
    timeLine.appendChild(durationTimeLine);

    const belowSep = separator("span-separator");
    belowSep.style.display = instrumenone;
    timeLine.appendChild(belowSep);

    const voiceLine = document.createElement("span");
    voiceLine.id = "line-voice"
    voiceLine.className = "code";
    voiceLine.textContent = data.agent;
    voiceLine.style.display = instrumenone;
    timeLine.appendChild(voiceLine);

    lyricLine.appendChild(timeLine);

    /// Normal Line
    const normalLine = document.createElement("div");
    normalLine.id = "normal-line";
    normalLine.className = "line";
    normalLine.style.display = instrumenone;
    
    //// SVG
    switch (data.agent) {
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
        
        logAction("new-word-line", input.value, { type: "normal" });

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
        
        logAction("new-word-line", input.value, { type: "bg" });

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
    // romanization.innerHTML = `<strong class="code">Romanization:</strong>`;
    romanization.style.display = defaults.parentData.clyricsEditorDisplay.roman ? "" : "none"

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
        logAction("new-roman-word", input.value);

        // reset input and append the new roman word
        input.value = "";
        input.before(roman);
    });

    romans.appendChild(newRoman);

    lyricLine.appendChild(romanization);

    /// Translation
    const translate = document.createElement("div");
    translate.className = "line-translate";
    translate.style.display = defaults.parentData.clyricsEditorDisplay.translate ? "" : "none"

    const translateInput = document.createElement("input");
    translateInput.id = "line-translate-input";

    translate.appendChild(translateInput)

    lyricLine.appendChild(translate);

    /// Place the lyric line on the element
    lyricLines.appendChild(lyricLine);

    return lyricLine;
}