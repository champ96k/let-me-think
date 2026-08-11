import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Cloud,
  CloudRain,
  CloudMoon,
  MapPin,
  Moon,
  Pause,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Sun,
} from "lucide-react";

import bg from "@/assets/lofi-desk.png";
import { RainLayer } from "@/components/RainLayer";
import { StarsLayer } from "@/components/StarsLayer";
import { useAmbience } from "@/lib/useAmbience";
import { greeting, randomQuote, type Quote } from "@/lib/quotes";
import { PLAYLIST_ID, useYouTubePlayer } from "@/lib/useYouTubePlayer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Let Me Think — Lofi Coding Radio" },
      {
        name: "description",
        content:
          "A calm lofi coding-music player with a living background that follows your city's real time and weather.",
      },
      { property: "og:title", content: "Let Me Think — Lofi Coding Radio" },
      {
        property: "og:description",
        content:
          "Lofi beats for focus, with a background that syncs to your local time and weather.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LetMeThink,
});

function fmt(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const OVERLAYS: Record<string, { filter: string; overlay: string }> = {
  "day-clear": {
    filter: "brightness(1.05) saturate(1.1)",
    overlay: "linear-gradient(180deg, oklch(0.9 0.05 75 / 0.03), oklch(0.9 0.03 250 / 0.03))",
  },
  "day-cloudy": {
    filter: "brightness(1.0) saturate(0.95)",
    overlay: "linear-gradient(180deg, oklch(0.85 0.02 250 / 0.04), oklch(0.85 0.02 250 / 0.04))",
  },
  "day-rain": {
    filter: "brightness(0.95) saturate(0.9)",
    overlay: "linear-gradient(180deg, oklch(0.7 0.05 250 / 0.06), oklch(0.7 0.05 255 / 0.06))",
  },
  "night-clear": {
    filter: "brightness(0.85) saturate(1.0)",
    overlay: "linear-gradient(180deg, oklch(0.5 0.07 275 / 0.08), oklch(0.5 0.06 265 / 0.08))",
  },
  "night-cloudy": {
    filter: "brightness(0.8) saturate(0.85)",
    overlay: "linear-gradient(180deg, oklch(0.45 0.03 250 / 0.1), oklch(0.45 0.02 250 / 0.1))",
  },
  "night-rain": {
    filter: "brightness(0.75) saturate(0.9)",
    overlay: "linear-gradient(180deg, oklch(0.4 0.06 255 / 0.1), oklch(0.4 0.05 260 / 0.1))",
  },
};

function WeatherIcon({ sky, isNight }: { sky: string; isNight: boolean }) {
  const cls = "h-5 w-5";
  if (sky === "rain") return <CloudRain className={cls} />;
  if (sky === "cloudy") return isNight ? <CloudMoon className={cls} /> : <Cloud className={cls} />;
  return isNight ? <Moon className={cls} /> : <Sun className={cls} />;
}

function LetMeThink() {
  const amb = useAmbience();
  const player = useYouTubePlayer("lmt-yt-player");
  const [unmuted, setUnmuted] = useState(false);
  const [clock, setClock] = useState("");
  const [period, setPeriod] = useState("");
  const [hello, setHello] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [use24h, setUse24h] = useState(() => {
    try {
      return localStorage.getItem("lmt-use24h") === "true";
    } catch {
      return false;
    }
  });
  const [showQuotes, setShowQuotes] = useState(() => {
    try {
      return localStorage.getItem("lmt-show-quotes") === "true";
    } catch {
      return false;
    }
  });
  const [showTime, setShowTime] = useState(() => {
    try {
      return localStorage.getItem("lmt-show-time") !== "false";
    } catch {
      return true;
    }
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Persist settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("lmt-use24h", String(use24h));
    } catch {
      /* ignore */
    }
  }, [use24h]);

  useEffect(() => {
    try {
      localStorage.setItem("lmt-show-quotes", String(showQuotes));
    } catch {
      /* ignore */
    }
  }, [showQuotes]);

  useEffect(() => {
    try {
      localStorage.setItem("lmt-show-time", String(showTime));
    } catch {
      /* ignore */
    }
  }, [showTime]);

  // Close settings on outside click
  useEffect(() => {
    if (!settingsOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [settingsOpen]);

  useEffect(() => {
    setQuote(randomQuote());
    const id = window.setInterval(() => setQuote((q) => randomQuote(q ?? undefined)), 600000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      if (use24h) {
        setClock(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
        setPeriod("");
      } else {
        const full = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
        const parts = full.split(" ");
        setClock(parts[0] ?? full);
        setPeriod(parts[1] ?? "");
      }
      setHello(greeting(now.getHours()));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [use24h]);

  const key = `${amb.isNight ? "night" : "day"}-${amb.sky}`;
  const look = OVERLAYS[key] ?? OVERLAYS["day-clear"]!;

  const thumb = player.videoId
    ? `https://i.ytimg.com/vi/${player.videoId}/hqdefault.jpg`
    : undefined;

  const handleToggle = () => {
    if (!unmuted) {
      player.setVolumeUnmute();
      setUnmuted(true);
    }
    player.toggle();
  };

  const place = [amb.city, amb.region, amb.country].filter(Boolean).join(", ");

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background image + ambient treatment */}
      <img
        src={bg}
        alt="Lofi coding desk beside a window overlooking a quiet city"
        width={1920}
        height={1088}
        className="ambient-fade absolute inset-0 h-full w-full object-cover"
        style={{ filter: look.filter }}
      />
      <div className="ambient-fade absolute inset-0" style={{ background: look.overlay }} />
      {amb.sky === "rain" && <RainLayer />}
      {amb.isNight && amb.sky === "clear" && <StarsLayer />}

      {/* Hidden YouTube player — must be visible enough for browsers to allow audio */}
      <div className="pointer-events-none fixed bottom-0 left-0 z-[-1] h-[1px] w-[1px] overflow-hidden opacity-[0.01]">
        <div id="lmt-yt-player" />
      </div>

      {/* Debug badge — shows player state (remove after debugging) */}
      <div className="fixed bottom-3 left-3 z-50 rounded-md bg-black/70 px-2 py-1 text-[10px] text-white/70 backdrop-blur-sm">
        YT: {player.ready ? (player.playing ? "▶ Playing" : "⏸ Ready") : "⏳ Loading"}
        {player.title ? ` • ${player.title}` : ""}
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-start justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-7">
        <div className="text-legible flex items-center gap-2.5 text-white/90">
          <WeatherIcon sky={amb.sky} isNight={amb.isNight} />
          <div className="leading-tight">
            <div className="text-xl font-light tabular-nums sm:text-2xl">
              {amb.temp !== null ? `${amb.temp}°` : "--°"}
            </div>
            <div className="text-[11px] font-light tracking-wide text-white/70">
              {amb.loading ? "locating…" : amb.city || "—"}
            </div>
          </div>
        </div>

        <a
          href={`https://www.youtube.com/playlist?list=${PLAYLIST_ID}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open the playlist on YouTube Music"
          className="shrink-0 flex items-center gap-2 rounded-full px-3 py-2 text-white/90 transition hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span className="text-sm font-medium">YT Music</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5 text-white/50"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>
      </div>

      {/* Center: clock, greeting, quote */}
      <div className="text-legible relative z-10 mt-[16vh] px-6 text-center sm:mt-[20vh]">
        <div className="font-display text-lg font-light tracking-widest text-white/60 sm:text-xl">
          Let Me Think
        </div>
        {showTime && (
          <>
            <div className="font-display mt-4 text-7xl font-semibold tracking-tight text-white tabular-nums sm:text-8xl xl:text-9xl">
              {clock || "--:--"}
              {period && (
                <span className="ml-2 text-xl font-light text-white/60 sm:text-2xl xl:text-3xl">
                  {period}
                </span>
              )}
            </div>
            <div className="font-display mt-3 text-2xl font-medium text-white/95 sm:text-3xl xl:text-4xl">
              {hello}
            </div>
          </>
        )}
        {showQuotes && quote && (
          <div key={quote.text} className="animate-fade-in mx-auto mt-10 max-w-xl sm:mt-14">
            <p className="font-display text-sm font-light italic leading-relaxed text-white/85 sm:text-base xl:text-lg">
              &ldquo;{quote.text}&rdquo;
            </p>
            <p className="font-display mt-2 text-xs font-normal tracking-wider text-white/55 sm:text-sm">
              — {quote.author}
            </p>
          </div>
        )}
      </div>

      {/* Bottom-left location */}
      <div className="text-legible absolute bottom-5 left-5 z-10 flex items-center gap-1.5 text-[11px] font-light tracking-wide text-white/75 sm:bottom-7 sm:left-8 sm:text-xs">
        <MapPin className="h-3.5 w-3.5" />
        <span className="max-w-[55vw] truncate">{amb.loading ? "locating…" : place || "—"}</span>
      </div>

      {/* Bottom-right settings */}
      <div ref={settingsRef} className="absolute bottom-5 right-5 z-20 sm:bottom-7 sm:right-8">
        <button
          onClick={() => setSettingsOpen((o) => !o)}
          aria-label="Settings"
          className={`glass rounded-full p-2.5 transition hover:text-white ${
            settingsOpen ? "text-white ring-1 ring-white/30" : "text-white/85"
          }`}
        >
          <Settings className="h-5 w-5" />
        </button>

        {settingsOpen && (
          <div className="glass-panel animate-fade-in absolute bottom-14 right-0 w-64 rounded-2xl p-5 sm:w-72">
            <div className="mb-4 text-xs font-medium uppercase tracking-widest text-white/50">
              Settings
            </div>

            {/* 24h toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-white/85">24-hour clock</span>
              <button
                onClick={() => setUse24h((v) => !v)}
                className={`relative h-5 w-9 rounded-full transition-colors ${
                  use24h ? "bg-white/30" : "bg-white/15"
                }`}
                role="switch"
                aria-checked={use24h}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    use24h ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Show time toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-white/85">Show time</span>
              <button
                onClick={() => setShowTime((v) => !v)}
                className={`relative h-5 w-9 rounded-full transition-colors ${
                  showTime ? "bg-white/30" : "bg-white/15"
                }`}
                role="switch"
                aria-checked={showTime}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    showTime ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Hide quotes toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-white/85">Show quotes</span>
              <button
                onClick={() => setShowQuotes((v) => !v)}
                className={`relative h-5 w-9 rounded-full transition-colors ${
                  showQuotes ? "bg-white/30" : "bg-white/15"
                }`}
                role="switch"
                aria-checked={showQuotes}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    showQuotes ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Divider */}
            <div className="my-3 h-px bg-white/10" />

            {/* Author credit */}
            <div className="space-y-2">
              <p className="text-sm text-white/70">
                Built by <span className="font-display font-medium text-white/90">Champ96k</span>
              </p>
              <div className="flex items-center gap-3 text-xs">
                <a
                  href="https://x.com/champ_96k"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/45 transition hover:text-white/85"
                >
                  X
                </a>
                <a
                  href="https://www.linkedin.com/in/tushar-nikam-dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/45 transition hover:text-white/85"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Player pill */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center px-4 pb-14 sm:pb-10">
        <div className="glass flex w-full max-w-xl items-center gap-4 rounded-full py-3 pl-3 pr-4 sm:py-3.5 sm:pl-3.5 sm:pr-6">
          <div
            className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-white/25 sm:h-16 sm:w-16 ${
              player.playing ? "spin-slow" : ""
            }`}
          >
            {thumb ? (
              <img src={thumb} alt="" className="h-full w-full scale-[1.35] object-cover" />
            ) : (
              <div className="h-full w-full bg-white/15" />
            )}
            <div className="absolute inset-0 m-auto h-2.5 w-2.5 rounded-full bg-black/60" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-white sm:text-base">
              {player.title || (player.ready ? "Loading track…" : "Let Me Think")}
            </div>
            <div className="mt-0.5 truncate text-xs font-light text-white/65">
              {player.author || "lofi beats for building things quietly"}
            </div>

            <input
              type="range"
              min={0}
              max={Math.max(player.duration, 1)}
              step={1}
              value={Math.min(player.current, player.duration || 1)}
              aria-label="Seek"
              onMouseDown={player.startSeek}
              onTouchStart={player.startSeek}
              onChange={(e) => {
                player.startSeek();
                player.scrub(Number(e.target.value));
              }}
              onMouseUp={(e) => player.commitSeek(Number(e.currentTarget.value))}
              onTouchEnd={(e) => player.commitSeek(Number(e.currentTarget.value))}
              onKeyUp={(e) => player.commitSeek(Number(e.currentTarget.value))}
              className="seek-range mt-2 w-full"
            />
            <div className="mt-1 text-[11px] font-light tabular-nums text-white/60">
              {fmt(player.current)} / {fmt(player.duration)}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              onClick={player.prev}
              aria-label="Previous track"
              className="rounded-full p-1.5 text-white/70 transition hover:text-white"
            >
              <SkipBack className="h-4 w-4" />
            </button>
            <button
              onClick={handleToggle}
              disabled={!player.ready}
              aria-label={player.playing ? "Pause" : "Play"}
              className="rounded-full bg-white/90 p-3 text-neutral-900 transition hover:bg-white disabled:opacity-50"
            >
              {player.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              onClick={player.next}
              aria-label="Next track"
              className="rounded-full p-1.5 text-white/70 transition hover:text-white"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
