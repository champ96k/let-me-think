import { useEffect } from "react";

type ShortcutHandlers = {
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleGlobe: () => void;
  onCloseGlobe: () => void;
  onToggleSettings: () => void;
};

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return el?.tagName === "INPUT" || el?.tagName === "TEXTAREA" || el?.isContentEditable;
}

export function useKeyboardShortcuts(h: ShortcutHandlers) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          h.onTogglePlay();
          break;
        case "ArrowRight":
          e.preventDefault();
          h.onNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          h.onPrev();
          break;
        case "KeyG":
          h.onToggleGlobe();
          break;
        case "Escape":
          h.onCloseGlobe();
          break;
        case "KeyS":
          h.onToggleSettings();
          break;
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [h]);
}
