let didActions = [];
let currentVer = 0;

// Variables
let variables = {
    "timeline": true,
    "roman": false,
    "translate": false
}

// Actions
const actionFile = document.getElementById("action-file-menu");

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
            actionFile.style.top = btn.getBoundingClientRect().bottom + 4;
            actionFile.style.left = btn.getBoundingClientRect().left;
            actionFile.style.display = "flex";
            requestAnimationFrame(() => { actionFile.style.opacity = "1"; });
        }
    }
};

const actionButtons = document.querySelectorAll(".action-btn");
actionButtons.forEach(button => {
    button.addEventListener("click", e => {
        const act = actionFunc[button.id]
        if (act && actionMenuOpen == act.menu) { return closeActionMenu(); }
        closeActionMenu();
        if (act && act.func) act.func(button);
    });
});

// Checkbox
const checkboxes = document.querySelectorAll(".checkbox");
const checkboxFunc = {
    "show-timeline-btn": function(x) {
        const timelines = document.querySelectorAll(".line-timeline");
        timelines.forEach(timeline => {
            timeline.style.display = x ? "" : "none";
        })
    }
};

checkboxes.forEach(checkbox => {
    checkbox.addEventListener("click", () => {
        const checked = checkbox.classList.contains("checked")
        if (checkboxFunc[checkbox.id]) checkboxFunc[checkbox.id](!checked);

        if (checked) checkbox.classList.remove("checked");
        else checkbox.classList.add("checked");
    })
});

// Tab Buttons
const tabButtons = document.querySelectorAll(".tab-btn");
tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        tabButtons.forEach(btn => btn.classList.remove("active-btn"));
        button.classList.add("active-btn");
    });
});

// Tools


// Word Line
const newWords = document.querySelectorAll("#new-word-line");
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
    })
})

// Context Menu
const contextMenu = document.getElementById("context-menu");
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

// Keybind
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