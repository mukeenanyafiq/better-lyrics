import { UNISON_API_URL } from "@/core/constants";
import { getOdid } from "@/options/store";
import type { ProviderParameters } from "./shared";
import { fillTtml } from "./blyrics/blyrics";

export default async function unison(providerParameters: ProviderParameters): Promise<void> {
    const url = new URL(UNISON_API_URL);
    url.searchParams.append("v", providerParameters.videoId);
    // url.searchParams.append("song", providerParameters.song);
    // url.searchParams.append("artist", providerParameters.artist);
    // url.searchParams.append("duration", String(providerParameters.duration));
    // if (providerParameters.album != null) {
    //     url.searchParams.append("album", providerParameters.album);
    // }
    
    const response = await fetch(url.toString(), {
        headers: {
            "X-Device-ID": `${await getOdid()}`
        },
        signal: AbortSignal.any([providerParameters.signal, AbortSignal.timeout(10000)]),
    });

    if (!response.ok) {
        providerParameters.sourceMap["unison-richsynced"].filled = true;
        providerParameters.sourceMap["unison-richsynced"].lyricSourceResult = null;
        return;
    }
    
    let responseString: string = await response.json().then(json => json.data.lyrics);
    await fillTtml(responseString, providerParameters);
}