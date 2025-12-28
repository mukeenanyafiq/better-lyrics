import type { Lyric, ProviderParameters, TrackInfoProvider } from "./shared";

export interface TrackInfoCustom extends TrackInfoProvider {
    lyrics: Lyric[] | null
}

export default async function customLyrics(providerParameters: ProviderParameters): Promise<void> {
    const result = await chrome.storage.sync.get(["customLyrics"]);
    const raw = result.customLyrics;
    const custom: TrackInfoCustom[] = Array.isArray(raw) ? raw as TrackInfoCustom[] : [];

    let tracks = custom;
    if (providerParameters.album) {
        tracks = tracks.filter(t => { return t.album == providerParameters.album; });
    }

    const track = tracks.find(t => {
        return t.song == providerParameters.song &&
            t.artist == providerParameters.artist &&
            Math.abs(t.duration - providerParameters.duration) <= 2;
    });

    if (track) {
        providerParameters.sourceMap["custom-lyrics"].lyricSourceResult = {
            lyrics: track.lyrics,
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