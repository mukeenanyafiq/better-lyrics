import { UNISON_API_URL } from "@/core/constants";
import type { ProviderParameters } from "./shared";
import { getLocalStorage } from "@/core/storage";
import { fillTtml } from "./blyrics/blyrics";

export default async function unison(providerParameters: ProviderParameters): Promise<void> {
    // Need better rewrite
    async function obtainDeviceId(): Promise<string | null> {
        const authData = await getLocalStorage<{ deviceId?: string }>(["deviceId"]);
        if (authData.deviceId) {
            return authData.deviceId;
        } else {
            const uuid = crypto.randomUUID();
            chrome.storage.local.set({ deviceId: uuid });
            return uuid;
        }
    }

    const url = new URL(UNISON_API_URL);
    url.searchParams.append("song", providerParameters.song);
    url.searchParams.append("artist", providerParameters.artist);
    url.searchParams.append("duration", String(providerParameters.duration));
    if (providerParameters.album != null) {
        url.searchParams.append("album", providerParameters.album);
    }
    
    const response = await fetch(url.toString(), {
        headers: {
            "X-Device-ID": `${await obtainDeviceId()}`
        },
        signal: AbortSignal.any([providerParameters.signal, AbortSignal.timeout(10000)]),
    });

    if (!response.ok) {
        providerParameters.sourceMap["bLyrics-richsynced"].filled = true;
        providerParameters.sourceMap["bLyrics-richsynced"].lyricSourceResult = null;
    
        providerParameters.sourceMap["bLyrics-synced"].filled = true;
        providerParameters.sourceMap["bLyrics-synced"].lyricSourceResult = null;
    
        return;
    }
    
    let responseString: string = await response.json().then(json => json.data.lyrics);
    await fillTtml(responseString, providerParameters);
}