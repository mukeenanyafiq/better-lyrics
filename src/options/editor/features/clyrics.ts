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

  clyricsNewLyrics.appendChild(modalTopButtons);

  // Span info
  const clyricsSpan = document.createElement("span");
  clyricsSpan.className = "clyrics-span"
  clyricsSpan.innerHTML = "Your lyrics will be saved and synchronized across all of your devices.<br/>Any changes you made with your lyrics will be immediately saved to prevent losing all of your progress"

  clyricsNewLyrics.appendChild(clyricsSpan);

  // Inputs
  const clyricsNewInputs = {
    "video-id": {
      required: false,
      type: "text",
      length: "long",
      title: "(Music) YouTube Video ID",
      description: "Helps narrow down available lyrics for swift importing",
      placeholder: "https://music.youtube.com/watch?v=videoid"
    },

    "track-name": {
      required: true,
      type: "text",
      length: "long",
      title: "Track Name",
      description: "",
      placeholder: "Name of the track"
    },

    "artist-name": {
      required: true,
      type: "text",
      length: "long",
      title: "Artist Name",
      description: "",
      placeholder: "Artist who performed the track (use & for multiple artists)"
    },

    "album-name": {
      required: false,
      type: "text",
      length: "long",
      title: "Album Name",
      description: "",
      placeholder: "Album that the track are located at"
    },

    "duration": {
      required: false,
      type: "number",
      length: "short",
      title: "Duration",
      description: "",
      placeholder: "Duration of the track (seconds)"
    },

    "lyric-file": {
      required: false,
      type: "file",
      length: "short",
      title: "Lyric File",
      description: "(.lrc, .elrc, .ttml, .xml are supported)",
      placeholder: "Import"
    }
  };

  for (const key in clyricsNewInputs) {
    const input = clyricsNewInputs[key as keyof typeof clyricsNewInputs];
    
    /// Every Input
    const element = document.createElement("div");
    element.id = `clyrics-${key}`;
    element.className = `clyrics-${input.length}-input`;

    if (input.description.length > 0) {
      const info = document.createElement("div");
      info.className = "clyrics-input-info";

      //// Input Title
      const title = document.createElement("span");
      title.className = "clyrics-input-title";
      title.innerHTML = `<strong>${input.title}${input.required ? " *" : ""}</strong>`;
      info.appendChild(title);
      
      //// Input Description
      const description = document.createElement("span");
      description.className = "clyrics-input-description";
      description.textContent = input.description;
      info.appendChild(description);

      element.appendChild(info);
    } else {
      //// Input Title
      const title = document.createElement("span");
      title.className = "clyrics-input-title"
      title.innerHTML = `<strong>${input.title}${input.required ? " *" : ""}</strong>`;
      element.appendChild(title);
    }

    if (input.type == "file") {
      //// Label Input File
      const label = document.createElement("label");
      label.htmlFor = "clyrics-lyric-file-input";
      label.className = "small-btn";

      const svg = "http://www.w3.org/2000/svg"
      const importIcon = document.createElementNS(svg, "svg");
      importIcon.setAttribute("width", "32")
      importIcon.setAttribute("height", "32")
      importIcon.setAttribute("viewBox", "0 0 24 24")

      const pathImportIcon = document.createElementNS(svg, "path");
      pathImportIcon.setAttribute("fill", "currentColor")
      pathImportIcon.setAttribute("d", "M21 14a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-4a1 1 0 0 0-1-1m-9.71 1.71a1 1 0 0 0 .33.21a.94.94 0 0 0 .76 0a1 1 0 0 0 .33-.21l4-4a1 1 0 0 0-1.42-1.42L13 12.59V3a1 1 0 0 0-2 0v9.59l-2.29-2.3a1 1 0 1 0-1.42 1.42Z")
      importIcon.appendChild(pathImportIcon);

      label.appendChild(importIcon);
      label.innerHTML += "Import";

      element.appendChild(label);

      //// Input File
      const inputter = document.createElement("input");
      inputter.type = "file";
      inputter.id = "clyrics-lyric-file-input";
      inputter.accept = ".lrc,.elrc,.ttml,.xml";
      inputter.style.display = "none";
    } else {
      //// Input Any Type
      const inputter = document.createElement("input");
      inputter.type = input.type;
      inputter.placeholder = input.placeholder;
      inputter.classList.add("clyrics-input");
      inputter.classList.add("clyrics-card");
    }

    clyricsNewLyrics.appendChild(element);
  }

  // Create Button
  const createBtn = document.createElement("button");
  createBtn.id = "create-clyric-btn";
  createBtn.classList.add("label-btn");
  createBtn.classList.add("btn-confirm");
  createBtn.classList.add("icon-btn");
  createBtn.innerHTML = "<strong>Create</strong>";

  createBtn.addEventListener("click", () => {

  });

  clyricsNewLyrics.appendChild(createBtn);
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
    formNewLyrics();
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