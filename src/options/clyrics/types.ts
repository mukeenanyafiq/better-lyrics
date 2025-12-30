import type { Lyric } from "@/modules/lyrics/providers/shared";

export interface CLyricsEditorVoices {
  color: string;
}

// For editor-mode preferences
export interface CLyricsEditor {
  voices?: { [voice: string]: CLyricsEditorVoices };
  bgLines?: { [line: string]: string };
}

export interface CLyricsOverview {
  song: string;
  artist: string;
  album?: string | null;
  duration: number;
  modified: number;
}

export interface CLyricsData extends CLyricsOverview {
  videoId?: string | null;
  lyrics: Lyric[];
  editor?: CLyricsEditor;
}