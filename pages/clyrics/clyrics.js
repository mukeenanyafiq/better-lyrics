const tabButtons = document.querySelectorAll(".tab-btn");

tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        tabButtons.forEach(btn => btn.classList.remove("active-btn"));

        button.classList.add("active-btn");
    });
});