import type { Lyric, ProviderParameters, TrackInfoProvider } from "./shared";

export interface TrackInfoCustom extends TrackInfoProvider {
    lyrics: Lyric[] | null
}

export default async function customLyrics(providerParameters: ProviderParameters): Promise<void> {
    const result = await chrome.storage.sync.get(["customLyrics"]);
    const raw = result.customLyrics;
    const custom: TrackInfoCustom[] = Array.isArray(raw) ? raw as TrackInfoCustom[] : [];
    const track = custom.find(track => {
        return track.song == providerParameters.song &&
        track.album == providerParameters.album &&
        track.artist == providerParameters.artist &&
        Math.abs(track.duration - providerParameters.duration) <= 2
    })

    if (track) {
        providerParameters.sourceMap["custom-lyrics"].lyricSourceResult = {
            lyrics: track.lyrics,
            source: "Custom Lyrics",
            sourceHref: "",
            musicVideoSynced: false,
            cacheAllowed: false
        }
    } else {
        providerParameters.sourceMap["custom-lyrics"].lyricSourceResult = null;
    }

    providerParameters.sourceMap["custom-lyrics"].filled = true;
}