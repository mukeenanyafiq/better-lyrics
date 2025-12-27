let didActions = [];
let currentVer = 0;

// Actions
const actionFile = document.getElementById("action-file-menu");

let actionMenuOpen = null;
function closeActionMenu() {
    if (!actionMenuOpen) return;
    actionMenuOpen.style.display = "none";
    actionMenuOpen = null;
}

const actionFunc = {
    "action-file-btn": {
        menu: actionFile,
        func: function(e) {
            actionMenuOpen = actionFile;
            actionFile.style.top = `${e.clientY}px`;
            actionFile.style.left = `${e.clientX}px`;
            actionFile.style.display = "flex";
        }
    }
};

const actionButtons = document.querySelectorAll(".action-btn");
actionButtons.forEach(button => {
    button.addEventListener("click", e => {
        const act = actionFunc[button.id]
        if (act && actionMenuOpen == act.menu) { return closeActionMenu(); }
        closeActionMenu();
        if (act && act.func) act.func(e);
    });
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

        input.value = "";
        input.before(interactableWord);

        didActions.push({
            
        });
        currentVer += 1;
    })
})

// Context Menu
const contextMenu = document.getElementById("context-menu");
let contextMenuOpen = false;

function closeContextMenu() {
    contextMenuOpen = false;
    contextMenu.style.display = "none";
}

document.addEventListener("contextmenu", e => {
    if (contextMenuOpen) {
        closeContextMenu();
    } else {
        contextMenuOpen = true;
        e.preventDefault();
        contextMenu.style.top = `${e.clientY}px`;
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.style.display = "flex";
    }
})