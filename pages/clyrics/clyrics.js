const tabButtons = document.querySelectorAll(".tab-btn");

tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        tabButtons.forEach(btn => btn.classList.remove("active-btn"));

        button.classList.add("active-btn");
    });
});

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