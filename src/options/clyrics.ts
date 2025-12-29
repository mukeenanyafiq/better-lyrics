import { initializeCLyricsModal } from "./clyrics/index";

function initialize(): void {
  document.addEventListener("DOMContentLoaded", () => {
    initializeCLyricsModal();
  });
}

initialize();