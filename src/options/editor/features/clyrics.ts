import { formatTime } from "@/modules/lyrics/providers/lrcUtils";
import type { CLyricsCardOptions } from "../types";
import { clyricsModalList, clyricsModalOverlay } from "../ui/dom";

export async function populateCLyrics(): Promise<void> {
  if (!clyricsModalList) return;

  clyricsModalList.innerHTML = "";

  // const customLyrics = [{
  //   name: "Snowman",
  //   artist: "Sia",
  //   album: "Everyday Is Christmas (Deluxe Edition)",
  //   duration: 270,
  //   modified: Date.now()
  // }]

  const customLyrics: any[] = []

  const yourLyricsSection = document.createElement("div");
  yourLyricsSection.className = "modal-section";

  const yourLyricsHeader = document.createElement("div");
  yourLyricsHeader.className = "modal-section-header"
  yourLyricsHeader.innerHTML = `<h3 class="modal-section-title">Your Lyrics (${customLyrics.length})</h3>`;

  const newLyric = document.createElement("button")
  newLyric.className = "small-svg-btn"
  newLyric.id = "create-new-clyric"
  newLyric.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>'
  yourLyricsHeader.appendChild(newLyric);
  yourLyricsSection.appendChild(yourLyricsHeader);

  const yourLyricsItems = document.createElement("div");
  yourLyricsItems.className = "clyrics-modal-items";

  if (customLyrics.length < 1) {
    const card = document.createElement("div");
    card.className = "clyrics-card"

    const info = document.createElement("div");
    info.className = "clyrics-card-info";
    
    const nothing = document.createElement("div");
    nothing.className = "clyrics-input-title";
    nothing.innerHTML = `<strong style="font-weight: bold">You don't have any applied custom lyrics</strong>`;
    
    const note = document.createElement("div");
    note.className = "clyrics-span";
    note.textContent = `Create a new one or import one from your computer!`;
    note.title = `Create a new one or import one from your computer!`;
    
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

  yourLyricsSection.appendChild(yourLyricsItems);
  clyricsModalList.appendChild(yourLyricsSection);
}

function createCLyricsCard(options: CLyricsCardOptions): HTMLElement {
  const card = document.createElement("div");
  card.className = "clyrics-card"

  const info = document.createElement("div");
  info.className = "clyrics-card-info";
  
  const metadata = document.createElement("div");
  metadata.className = "clyrics-input-span";
  metadata.textContent = `Duration: ${formatTime(options.duration, true)} • Modified: ${new Date(options.modified).toLocaleString()}`;
  metadata.title = `${options.artist} • ${options.album}`;
  
  const name = document.createElement("div");
  name.className = "clyrics-input-title";
  name.innerHTML = `<strong>${options.name}</strong>`
  
  const artistAlbum = document.createElement("div");
  artistAlbum.className = "clyrics-input-description";
  artistAlbum.textContent = `${options.artist} • ${options.album}`;
  artistAlbum.title = `${options.artist} • ${options.album}`;
  
  info.appendChild(metadata);
  info.appendChild(name);
  info.appendChild(artistAlbum);

  card.appendChild(info);
  
  return card;
}

export function openCLyricsModal() {
  if (clyricsModalOverlay) {
    populateCLyrics()
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