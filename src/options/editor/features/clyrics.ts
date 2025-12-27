import { formatTime } from "@/modules/lyrics/providers/lrcUtils";
import type { CLyricsCardOptions } from "../types";
import { clyricsNewLyrics, clyricsModalList, clyricsModalOverlay } from "../ui/dom";

let initializedForm = false;

export async function formNewLyrics(): Promise<void> {
  if (!clyricsNewLyrics || initializedForm) return;
  initializedForm = true;

  clyricsNewLyrics.innerHTML = "";
  clyricsNewLyrics.className = "modal-section";

  // Header
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-section-header"

  /// Title
  const modalTitle = document.createElement("h3");
  modalTitle.className = "modal-section-title";
  modalTitle.textContent = "Create a New Lyrics";

  modalHeader.appendChild(modalTitle);

  clyricsNewLyrics.appendChild(modalHeader);

  // Top Buttons
  const modalTopButtons = document.createElement("div");
  modalTopButtons.className = "clyrics-top-buttons";

  /// Return button
  const returnButton = document.createElement("button");
  returnButton.className = "icon-btn";
  returnButton.setAttribute("data-tooltip", "Return");

  returnButton.addEventListener("click", () => {
    if (clyricsModalList) clyricsModalList.style.display = "";
    if (clyricsNewLyrics) clyricsNewLyrics.style.display = "none";
  });

  /// Import from currently playing button
  const importCurrentButton = document.createElement("button");
  importCurrentButton.className = "small-btn";
  importCurrentButton.textContent = "Import from currently playing";

  importCurrentButton.addEventListener("click", () => {

  });
}

export async function populateCLyrics(): Promise<void> {
  if (!clyricsModalList) return;

  clyricsModalList.innerHTML = "";
  clyricsModalList.className = "modal-section";

  // const customLyrics = [{
  //   name: "Snowman",
  //   artist: "Sia",
  //   album: "Everyday Is Christmas (Deluxe Edition)",
  //   duration: 270,
  //   modified: Date.now()
  // }]

  const customLyrics: any[] = []

  const yourLyricsHeader = document.createElement("div");
  yourLyricsHeader.className = "modal-section-header"

  const yourLyricsTitle = document.createElement("h3");
  yourLyricsTitle.className = "modal-section-title";
  yourLyricsTitle.textContent = `Your Lyrics (${customLyrics.length})`;
  
  yourLyricsHeader.appendChild(yourLyricsTitle);

  const newLyric = document.createElement("button")
  newLyric.className = "small-svg-btn"
  newLyric.id = "create-new-clyric"
  newLyric.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>'

  yourLyricsHeader.appendChild(newLyric);

  const yourLyricsItems = document.createElement("div");
  yourLyricsItems.className = "clyrics-modal-items";

  if (customLyrics.length < 1) {
    const card = document.createElement("div");
    card.className = "clyrics-card"

    const info = document.createElement("div");
    info.className = "clyrics-card-info";
    
    const nothing = document.createElement("div");
    nothing.className = "clyrics-input-title";
    nothing.innerHTML = `<strong>You don't have any applied custom lyrics</strong>`;
    
    const note = document.createElement("div");
    note.className = "clyrics-span";
    note.textContent = `Create a new one or import one from your computer!`;
    
    info.appendChild(nothing);
    info.appendChild(note);

    card.appendChild(info);
    yourLyricsItems.appendChild(card);
  }

  (customLyrics).forEach(clyrics => {
    const card = createCLyricsCard({
      name: clyrics.name,
      artist: clyrics.artist,
      album: clyrics.album,
      duration: clyrics.duration,
      modified: clyrics.modified
    });
    yourLyricsItems.appendChild(card);
  });

  clyricsModalList.appendChild(yourLyricsItems);
}

function createCLyricsCard(options: CLyricsCardOptions): HTMLElement {
  const card = document.createElement("div");
  card.className = "clyrics-card"

  const info = document.createElement("div");
  info.className = "clyrics-card-info";
  
  const metadata = document.createElement("div");
  metadata.className = "clyrics-input-span";
  metadata.textContent = `Duration: ${formatTime(options.duration, true)} • Modified: ${new Date(options.modified).toLocaleString()}`;
  
  const name = document.createElement("div");
  name.className = "clyrics-input-title";
  name.innerHTML = `<strong>${options.name}</strong>`
  
  const artistAlbum = document.createElement("div");
  artistAlbum.className = "clyrics-input-description";
  artistAlbum.textContent = `${options.artist} • ${options.album}`;
  
  info.appendChild(metadata);
  info.appendChild(name);
  info.appendChild(artistAlbum);

  card.appendChild(info);
  
  return card;
}

export async function openCLyricsModal() {
  if (clyricsModalOverlay) {
    populateCLyrics();
    clyricsModalOverlay.style.display = "flex";
    requestAnimationFrame(() => {
      if (clyricsModalOverlay) {
        clyricsModalOverlay.classList.add("active");
      }
    });
  }
  
}

export function closeCLyricsModal() {
  if (clyricsModalOverlay) {
    const modal = clyricsModalOverlay.querySelector(".clyrics-modal");
    if (modal) {
      modal.classList.add("closing");
    }
    clyricsModalOverlay.classList.remove("active");

    setTimeout(() => {
      if (clyricsModalOverlay) {
        clyricsModalOverlay.style.display = "none";
        if (modal) {
          modal.classList.remove("closing");
        }
      }
    }, 200);
  }
}