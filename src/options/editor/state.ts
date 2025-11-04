import type { EditorView } from "@codemirror/view";

export let editor: EditorView;
export let currentThemeName: string | null = null;
export let isUserTyping = false;
export let isCustomTheme = false;
export let saveCount = 0;
export let saveTimeout: number;
export let saveCustomThemeTimeout: number;

export function setEditor(newEditor: EditorView): void {
  editor = newEditor;
}

export function setCurrentThemeName(name: string | null): void {
  currentThemeName = name;
}

export function setIsUserTyping(value: boolean): void {
  isUserTyping = value;
}

export function setIsCustomTheme(value: boolean): void {
  isCustomTheme = value;
}

export function incrementSaveCount(): void {
  saveCount++;
}

export function decrementSaveCount(): void {
  saveCount = Math.max(saveCount - 1, 0);
}

export function setSaveTimeout(timeout: number): void {
  saveTimeout = timeout;
}

export function setSaveCustomThemeTimeout(timeout: number): void {
  saveCustomThemeTimeout = timeout;
}
