import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
import { Switch } from "@/components/ui/switch";
import { WorldGlobe } from "@/components/WorldGlobe";
import { listeners } from "@/lib/listeners";
import { useKeyboardShortcuts } from "@/lib/useKeyboardShortcuts";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [showGlobe, setShowGlobe] = useState(false);
  const isMobile = useIsMobile();

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

  useKeyboardShortcuts({
    onTogglePlay: handleToggle,
    onNext: player.next,
    onPrev: player.prev,
    onToggleGlobe: () => setShowGlobe((v) => !v),
    onCloseGlobe: () => setShowGlobe(false),
    onToggleSettings: () => setSettingsOpen((o) => !o),
  });

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-black">
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

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between gap-2 px-3 pt-4 sm:gap-4 sm:px-8 sm:pt-7">
        <div className="text-legible flex shrink-0 items-center gap-1.5 text-white/90 sm:gap-2.5">
          <WeatherIcon sky={amb.sky} isNight={amb.isNight} />
          <div className="leading-tight">
            <div className="text-base font-light tabular-nums sm:text-2xl">
              {amb.temp !== null ? `${amb.temp}°` : "--°"}
            </div>
            <div className="text-[9px] font-light tracking-wide text-white/70 sm:text-[11px]">
              {amb.loading ? "locating…" : amb.city || "—"}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowGlobe((v) => !v)}
          className="glass flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-white/80 transition hover:text-white sm:gap-2 sm:px-3"
        >
          <span className="pulse-dot inline-block h-2 w-2 shrink-0 rounded-full bg-[oklch(0.72_0.19_145)]" />
          <span className="whitespace-nowrap text-[11px] font-medium tracking-wide sm:text-xs">
            {listeners.length} minds in flow
          </span>
        </button>

        <a
          href={`https://www.youtube.com/playlist?list=${PLAYLIST_ID}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open the playlist on YouTube Music"
          className="shrink-0 flex items-center gap-1 rounded-full px-2 py-1.5 text-white/90 transition hover:text-white sm:gap-2 sm:px-3 sm:py-2"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span className="text-[11px] font-medium sm:text-sm">YT Music</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hidden h-3 w-3 text-white/50 sm:block"
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

      {/* Globe overlay — full screen, portaled to body to escape overflow stacking */}
      {showGlobe &&
        createPortal(
          <div className="globe-section-enter fixed inset-0 z-50 flex flex-col items-center justify-center overflow-visible bg-black/80 backdrop-blur-sm">
            <div className="text-legible mb-2 text-center text-xs font-light tracking-wider text-white/50 sm:mb-4 sm:text-sm">
              People are listening from around the world
            </div>
            <WorldGlobe userLocation={{ lat: amb.lat, lng: amb.lng, city: amb.city }} />
            <button
              onClick={() => setShowGlobe(false)}
              className="mt-3 flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-light text-white/50 transition hover:text-white sm:mt-4 sm:text-sm"
            >
              Close
              <kbd className="kbd">Esc</kbd>
            </button>
          </div>,
          document.body,
        )}

      {/* Bottom-left location */}
      <div className="text-legible absolute bottom-5 left-5 z-10 flex items-center gap-1.5 text-[10px] font-light tracking-wide text-white/75 sm:bottom-7 sm:left-8 sm:text-xs">
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
              <Switch
                checked={use24h}
                onCheckedChange={setUse24h}
                className="bg-white/20 data-[state=checked]:bg-[oklch(0.72_0.19_145)] [&>span]:bg-white [&>span]:shadow-md"
              />
            </div>

            {/* Show time toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-white/85">Show time</span>
              <Switch
                checked={showTime}
                onCheckedChange={setShowTime}
                className="bg-white/20 data-[state=checked]:bg-[oklch(0.72_0.19_145)] [&>span]:bg-white [&>span]:shadow-md"
              />
            </div>

            {/* Show quotes toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-white/85">Show quotes</span>
              <Switch
                checked={showQuotes}
                onCheckedChange={setShowQuotes}
                className="bg-white/20 data-[state=checked]:bg-[oklch(0.72_0.19_145)] [&>span]:bg-white [&>span]:shadow-md"
              />
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

            {/* Keyboard shortcuts — desktop only */}
            {!isMobile && (
              <>
                <div className="my-3 h-px bg-white/10" />
                <div className="mb-3 text-xs font-medium uppercase tracking-widest text-white/50">
                  Keyboard shortcuts
                </div>
                <div className="space-y-1.5 text-xs text-white/70">
                  <div className="flex items-center justify-between">
                    <span>Play / Pause</span>
                    <kbd className="kbd">Space</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Next track</span>
                    <kbd className="kbd">→</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Previous track</span>
                    <kbd className="kbd">←</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Toggle globe</span>
                    <kbd className="kbd">G</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Close globe</span>
                    <kbd className="kbd">Esc</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Settings</span>
                    <kbd className="kbd">S</kbd>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Player pill */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center px-3 pb-20 sm:px-4 sm:pb-16">
        <div className="glass flex w-full max-w-xl items-center gap-2.5 rounded-full py-2.5 pl-2.5 pr-3 sm:items-center sm:gap-4 sm:py-3.5 sm:pl-3.5 sm:pr-6">
          <div
            className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/25 sm:h-16 sm:w-16 ${
              player.playing ? "spin-slow" : ""
            }`}
          >
            {thumb ? (
              <img src={thumb} alt="" className="h-full w-full scale-[1.35] object-cover" />
            ) : (
              <div className="h-full w-full bg-white/15" />
            )}
            <div className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-black/60 sm:h-2.5 sm:w-2.5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium text-white sm:text-base">
              {player.title || (player.ready ? "Loading track…" : "Let Me Think")}
            </div>
            <div className="mt-0.5 truncate text-[10px] font-light text-white/65 sm:text-xs">
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
              className="seek-range mt-1.5 w-full sm:mt-2"
            />
            <div className="mt-0.5 text-[9px] font-light tabular-nums text-white/60 sm:text-[11px]">
              {fmt(player.current)} / {fmt(player.duration)}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <button
              onClick={player.prev}
              aria-label="Previous track"
              className="rounded-full p-1 text-white/70 transition hover:text-white sm:p-1.5"
            >
              <SkipBack className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            <button
              onClick={handleToggle}
              disabled={!player.ready}
              aria-label={player.playing ? "Pause" : "Play"}
              className="rounded-full bg-white/90 p-2 text-neutral-900 transition hover:bg-white disabled:opacity-50 sm:p-3"
            >
              {player.playing ? <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </button>
            <button
              onClick={player.next}
              aria-label="Next track"
              className="rounded-full p-1 text-white/70 transition hover:text-white sm:p-1.5"
            >
              <SkipForward className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
