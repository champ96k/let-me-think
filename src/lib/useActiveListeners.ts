import { useCallback, useEffect, useRef, useState } from "react";
import { listeners, type Listener } from "@/lib/listeners";

function getLocalHour(lng: number): number {
  const utcOffset = Math.round(lng / 15);
  const now = new Date();
  return (now.getUTCHours() + utcOffset + 24) % 24;
}

function isAwake(lng: number): boolean {
  const h = getLocalHour(lng);
  return h >= 7 && h <= 23;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j]!;
    a[j] = tmp!;
  }
  return a;
}

const MIN_COUNT = 12;
const MAX_COUNT = 35;
const STORAGE_KEY = "lmt-listener-count";
const STORAGE_TS_KEY = "lmt-listener-ts";
const BASE_COUNT = 20;

function loadPersisted(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const tsRaw = localStorage.getItem(STORAGE_TS_KEY);
    if (raw && tsRaw) {
      const saved = parseInt(raw, 10);
      const savedTs = parseInt(tsRaw, 10);
      if (!isNaN(saved) && !isNaN(savedTs)) {
        // Simulate changes that would have happened since last visit
        const elapsed = Date.now() - savedTs;
        const avgInterval = 60_000; // ~60s average
        const steps = Math.floor(elapsed / avgInterval);
        let count = saved;
        for (let i = 0; i < Math.min(steps, 20); i++) {
          const delta = Math.random() > 0.45 ? 1 : -1;
          count = Math.max(MIN_COUNT, Math.min(MAX_COUNT, count + delta));
        }
        const awake = listeners.filter((l) => isAwake(l.lng));
        return Math.max(MIN_COUNT, Math.min(MAX_COUNT, Math.min(awake.length, count)));
      }
    }
  } catch {
    /* ignore */
  }
  return BASE_COUNT;
}

function persistCount(n: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(n));
    localStorage.setItem(STORAGE_TS_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export function useActiveListeners() {
  const [count, setCount] = useState(() => loadPersisted());

  const [activeListeners, setActiveListeners] = useState<Listener[]>([]);
  const countRef = useRef(count);
  countRef.current = count;

  const recompute = useCallback(() => {
    const awake = listeners.filter((l) => isAwake(l.lng));
    const n = Math.max(MIN_COUNT, Math.min(MAX_COUNT, Math.min(awake.length, countRef.current)));
    const picked = shuffle(awake).slice(0, n);
    setActiveListeners(picked);
  }, []);

  // Initial compute + recompute every 5 min (to handle cities crossing hour boundary)
  useEffect(() => {
    recompute();
    const id = window.setInterval(recompute, 5 * 60 * 1000);
    return () => window.clearInterval(id);
  }, [recompute]);

  // Dynamic ±1 changes at random intervals
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const awake = listeners.filter((l) => isAwake(l.lng));
      const pool = awake.length;

      setCount((prev) => {
        const delta = Math.random() > 0.45 ? 1 : -1;
        let next = prev + delta;
        next = Math.max(MIN_COUNT, Math.min(MAX_COUNT, Math.min(pool, next)));
        persistCount(next);
        return next;
      });

      // Random interval between 45s and 90s
      const delay = (Math.floor(Math.random() * 45) + 45) * 1000;
      timer = setTimeout(tick, delay);
    };

    const firstDelay = (Math.floor(Math.random() * 30) + 30) * 1000;
    timer = setTimeout(tick, firstDelay);
    return () => clearTimeout(timer);
  }, []);

  // Recompute active list whenever count changes
  useEffect(() => {
    recompute();
  }, [count, recompute]);

  return { activeListeners, count };
}
