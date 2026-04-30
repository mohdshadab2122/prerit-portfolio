import { useEffect, useState } from "react";

const HIGHLIGHT_DURATION_MS = 1000;

// Shared visual treatment for records opened from Home preview cards.
export const HASH_HIGHLIGHT_CLASS =
  "ring-2 ring-[#FF6B00]/70 ring-offset-4 ring-offset-white shadow-[0_0_0_8px_rgba(255,107,0,0.12)] border-[#FF6B00]/60";

const getHashTargetId = (hash: string) =>
  decodeURIComponent(hash.replace("#", "")).trim();

// Temporarily highlights the record matching the current URL hash.
export const useHashHighlight = (hash: string, ready: boolean) => {
  const [highlightedId, setHighlightedId] = useState("");

  useEffect(() => {
    if (!ready) return;

    const targetId = getHashTargetId(hash);
    if (!targetId) {
      setHighlightedId("");
      return;
    }

    setHighlightedId(targetId);

    const timeoutId = window.setTimeout(() => {
      setHighlightedId((currentId) =>
        currentId === targetId ? "" : currentId,
      );
    }, HIGHLIGHT_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [hash, ready]);

  return highlightedId;
};
