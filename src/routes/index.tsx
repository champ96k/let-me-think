import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Pause, Play, SkipBack, SkipForward, Youtube } from "lucide-react";

import bg from "@/assets/lofi-desk.jpg";
import { RainLayer } from "@/components/RainLayer";
import { StarsLayer } from "@/components/StarsLayer";
import { useAmbience } from "@/lib/useAmbience";
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
        content: "Lofi beats for focus, with a background that syncs to your local time and weather.",
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
    overlay:
      "linear-gradient(180deg, oklch(0.85 0.11 75 / 0.22), oklch(0.7 0.09 45 / 0.18))",
  },
  "day-cloudy": {
    filter: "brightness(0.92) saturate(0.7) contrast(0.95)",
    overlay:
      "linear-gradient(180deg, oklch(0.72 0.02 250 / 0.3), oklch(0.6 0.02 250 / 0.28))",
  },
  "day-rain": {
    filter: "brightness(0.8) saturate(0.75)",
    overlay:
      "linear-gradient(180deg, oklch(0.55 0.08 250 / 0.42), oklch(0.42 0.07 255 / 0.4))",
  },
  "night-clear": {
    filter: "brightness(0.42) saturate(0.85)",
    overlay:
      "linear-gradient(180deg, oklch(0.25 0.09 275 / 0.55), oklch(0.16 0.07 265 / 0.62))",
  },
  "night-cloudy": {
    filter: "brightness(0.35) saturate(0.55) contrast(0.9)",
    overlay:
      "linear-gradient(180deg, oklch(0.28 0.03 250 / 0.62), oklch(0.18 0.02 250 / 0.68))",
  },
  "night-rain": {
    filter: "brightness(0.28) saturate(0.6)",
    overlay:
      "linear-gradient(180deg, oklch(0.22 0.07 255 / 0.7), oklch(0.13 0.06 260 / 0.75))",
  },
};

function LetMeThink() {
  const amb = useAmbience();
  const player = useYouTubePlayer("lmt-yt-player");
  const [started, setStarted] = useState(false);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const key = `${amb.isNight ? "night" : "day"}-${amb.sky}`;
  const look = OVERLAYS[key] ?? OVERLAYS["day-clear"];
  const longTitle = player.title.length > 34;

  const trackTitle = useMemo(
    () => player.title || (started ? "Tuning in…" : "Let Me Think"),
    [player.title, started],
  );

  const handleStart = () => {
    setStarted(true);
    player.setVolumeUnmute();
    player.play();
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background image + ambient treatment */}
      <img
        src={bg}
        alt="Lofi coding desk beside a window overlooking a quiet city"
        width={1920}
        height={1088}
        className="ambient-fade absolute inset-0 h-full w-full scale-105 object-cover"
        style={{ filter: look.filter }}
      />
      <div
        className="ambient-fade absolute inset-0"
        style={{ background: look.overlay }}
      />
      {amb.sky === "rain" && <RainLayer />}
      {amb.isNight && amb.sky === "clear" && <StarsLayer />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/35" />

      {/* Hidden YouTube player */}
      <div className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden opacity-0">
        <div id="lmt-yt-player" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-start justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-7">
        <div className="text-legible min-w-0 text-white/85">
          <div className="text-2xl font-light tabular-nums tracking-tight sm:text-3xl">
            {clock || "--:--"}
          </div>
          <div className="mt-0.5 truncate text-xs font-light tracking-wide text-white/70 sm:text-sm">
            {amb.loading
              ? "locating…"
              : `${amb.city}${amb.temp !== null ? ` · ${amb.temp}°C` : ""} · ${amb.sky}`}
          </div>
        </div>

        <a
          href={`https://www.youtube.com/playlist?list=${PLAYLIST_ID}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open the playlist on YouTube"
          className="glass shrink-0 rounded-full p-2.5 text-white/80 transition hover:text-white"
        >
          <Youtube className="h-5 w-5" />
        </a>
      </div>

      {/* Center brand */}
      <div className="text-legible relative z-10 mt-[14vh] px-6 text-center sm:mt-[18vh]">
        <h1 className="text-4xl font-light tracking-[0.18em] text-white/90 uppercase sm:text-6xl">
          Let Me Think
        </h1>
        <p className="mx-auto mt-3 max-w-md text-xs font-light tracking-wide text-white/60 sm:text-sm">
          lofi beats for building things quietly
        </p>
      </div>

      {/* Player card */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center px-4 pb-6 sm:pb-10">
        <div className="glass w-full max-w-md rounded-3xl px-5 py-4 sm:px-6 sm:py-5">
          {!started ? (
            <button
              onClick={handleStart}
              disabled={!player.ready}
              className="w-full rounded-2xl bg-white/90 py-3 text-sm font-medium tracking-wide text-neutral-900 transition hover:bg-white disabled:opacity-50"
            >
              {player.ready ? "Start Listening" : "Loading player…"}
            </button>
          ) : (
            <>
              <div className="overflow-hidden">
                {longTitle ? (
                  <div className="marquee-track text-sm font-medium text-white/95">
                    <span>{trackTitle}</span>
                    <span>{trackTitle}</span>
                  </div>
                ) : (
                  <div className="truncate text-sm font-medium text-white/95">{trackTitle}</div>
                )}
                <div className="mt-1 truncate text-xs font-light text-white/55">
                  {player.author || "—"}
                </div>
              </div>

              <div className="mt-4">
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
                  className="seek-range w-full"
                />
                <div className="mt-1.5 flex justify-between text-[11px] font-light tabular-nums text-white/55">
                  <span>{fmt(player.current)}</span>
                  <span>{fmt(player.duration)}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-center gap-5">
                <button
                  onClick={player.prev}
                  aria-label="Previous track"
                  className="rounded-full p-2 text-white/70 transition hover:text-white"
                >
                  <SkipBack className="h-5 w-5" />
                </button>
                <button
                  onClick={player.toggle}
                  aria-label={player.playing ? "Pause" : "Play"}
                  className="rounded-full bg-white/90 p-3.5 text-neutral-900 transition hover:bg-white"
                >
                  {player.playing ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={player.next}
                  aria-label="Next track"
                  className="rounded-full p-2 text-white/70 transition hover:text-white"
                >
                  <SkipForward className="h-5 w-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
