import type { CLyricsData } from "@/options/clyrics/types";
import type { ProviderParameters } from "./shared";

export default async function customLyrics(providerParameters: ProviderParameters): Promise<void> {
    const result = await chrome.storage.sync.get(["customLyrics"]);
    const raw = result.customLyrics;
    const custom: CLyricsData[] = Array.isArray(raw) ? raw as CLyricsData[] : [];
    
    if (custom.length < 1) {
        providerParameters.sourceMap["custom-lyrics"].lyricSourceResult = null;
        providerParameters.sourceMap["custom-lyrics"].filled = true;
        return;
    }
    
    let clyric = custom.find(clyrics => clyrics.videoId == providerParameters.videoId)
    
    if (!clyric) {
        let lyrics = custom;
    
        if (providerParameters.album) {
            lyrics = lyrics.filter(t => { return t.album == providerParameters.album; });
        }
    
        clyric = lyrics.find(t => {
            return t.song == providerParameters.song &&
                t.artist == providerParameters.artist &&
                Math.abs(t.duration - providerParameters.duration) <= 2;
        });
    }

    if (clyric) {
        providerParameters.sourceMap["custom-lyrics"].lyricSourceResult = {
            lyrics: clyric.lyrics,
            source: "Custom Lyrics",
            sourceHref: "",
            musicVideoSynced: false,
            cacheAllowed: false
        };
    } else {
        providerParameters.sourceMap["custom-lyrics"].lyricSourceResult = null;
    }

    providerParameters.sourceMap["custom-lyrics"].filled = true;
}
