import type { TrackInfoProvider } from "@/modules/lyrics/providers/shared";

export function getCustomLyrics(detail: TrackInfoProvider | null) {
    const customLyrics = chrome.storage.sync.get([ "customLyrics" ])
    
}