import { closeThemeModal } from "../editor/features/themes";
import { closeCLyricsModal, openCLyricsModal } from "./clyrics";

export const clyricsModifyBtn = document.getElementById("clyrics-modify-btn") as HTMLButtonElement | null;
export const clyricsModalOverlay = document.getElementById("clyrics-modal-overlay") as HTMLElement | null;
export const clyricsModalClose = document.getElementById("clyrics-modal-close") as HTMLButtonElement | null;
export const clyricsModalList = document.getElementById("clyrics-modal-list") as HTMLElement | null;
export const clyricsNewLyrics = document.getElementById("clyrics-new-lyrics") as HTMLElement | null;

export function initializeCLyricsModal() {
  clyricsModifyBtn?.addEventListener("click", openCLyricsModal);

  clyricsModalClose?.addEventListener("click", closeCLyricsModal);

  clyricsModalOverlay?.addEventListener("click", e => {
    if (e.target === clyricsModalOverlay) {
      closeThemeModal();
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && clyricsModalOverlay?.classList.contains("active")) {
      closeThemeModal();
    }
  });
}
