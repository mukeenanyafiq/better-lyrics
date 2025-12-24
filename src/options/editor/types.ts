export interface ModalOptions {
  title: string;
  message: string;
  inputPlaceholder?: string;
  inputValue?: string;
  confirmText?: string;
  cancelText?: string;
  confirmDanger?: boolean;
  showInput?: boolean;
}

export interface SaveResult {
  success: boolean;
  strategy?: "local" | "sync" | "chunked";
  wasRetry?: boolean;
  error?: any;
}

export interface BracketStackItem {
  type: string;
  from: number;
}

export interface ThemeCardOptions {
  name: string;
  author: string;
  isCustom: boolean;
  index: number;
}

export interface CLyricsCardOptions {
  name: string;
  artist: string;
  album: string;
  duration: number;
  modified: number;
}

declare global {
  interface Window {
    stylelint: any;
  }
}
