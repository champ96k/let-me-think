import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Cloud,
  CloudRain,
  CloudMoon,
  Droplets,
  MapPin,
  Moon,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Sun,
  Wind,
  Youtube,
} from "lucide-react";

import bg from "@/assets/lofi-desk.jpg";
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
    filter: "brightness(1.02) saturate(1.05)",
    overlay: "linear-gradient(180deg, oklch(0.9 0.05 75 / 0.08), oklch(0.4 0.03 250 / 0.14))",
  },
  "day-cloudy": {
    filter: "brightness(0.97) saturate(0.85)",
    overlay: "linear-gradient(180deg, oklch(0.8 0.02 250 / 0.1), oklch(0.4 0.02 250 / 0.18))",
  },
  "day-rain": {
    filter: "brightness(0.9) saturate(0.85)",
    overlay: "linear-gradient(180deg, oklch(0.6 0.05 250 / 0.16), oklch(0.35 0.05 255 / 0.24))",
  },
  "night-clear": {
    filter: "brightness(0.6) saturate(0.9)",
    overlay: "linear-gradient(180deg, oklch(0.3 0.07 275 / 0.3), oklch(0.16 0.06 265 / 0.42))",
  },
  "night-cloudy": {
    filter: "brightness(0.55) saturate(0.7)",
    overlay: "linear-gradient(180deg, oklch(0.3 0.03 250 / 0.34), oklch(0.16 0.02 250 / 0.46))",
  },
  "night-rain": {
    filter: "brightness(0.5) saturate(0.75)",
    overlay: "linear-gradient(180deg, oklch(0.26 0.06 255 / 0.38), oklch(0.13 0.05 260 / 0.5))",
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
  const [hello, setHello] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    setQuote(randomQuote());
    const id = window.setInterval(() => setQuote((q) => randomQuote(q ?? undefined)), 20000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
      setHello(greeting(now.getHours()));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

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
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/20" />

      {/* Hidden YouTube player */}
      <div className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden opacity-0">
        <div id="lmt-yt-player" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-start justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-7">
        <div className="text-legible glass rounded-2xl px-4 py-3 text-white/90 sm:px-5 sm:py-3.5">
          <div className="flex items-center gap-3">
            <WeatherIcon sky={amb.sky} isNight={amb.isNight} />
            <div className="leading-tight">
              <div className="font-display text-2xl font-light tabular-nums sm:text-3xl xl:text-4xl">
                {amb.temp !== null ? `${amb.temp}°` : "--°"}
              </div>
              <div className="text-[11px] font-medium tracking-wide text-white/80 sm:text-xs xl:text-sm">
                {amb.loading ? "locating…" : amb.label || "—"}
              </div>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-light tracking-wide text-white/65 sm:text-[11px] xl:text-xs">
            <span>{amb.city || "—"}</span>
            {amb.feelsLike !== null && <span>feels {amb.feelsLike}°</span>}
            {amb.humidity !== null && (
              <span className="inline-flex items-center gap-1">
                <Droplets className="h-3 w-3" />
                {amb.humidity}%
              </span>
            )}
            {amb.wind !== null && (
              <span className="inline-flex items-center gap-1">
                <Wind className="h-3 w-3" />
                {amb.wind} km/h
              </span>
            )}
          </div>
        </div>

        <a
          href={`https://www.youtube.com/playlist?list=${PLAYLIST_ID}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open the playlist on YouTube"
          className="glass shrink-0 rounded-full p-2.5 text-white/85 transition hover:text-white"
        >
          <Youtube className="h-5 w-5" />
        </a>
      </div>

      {/* Center: clock, greeting, quote */}
      <div className="text-legible relative z-10 mt-[14vh] px-6 text-center sm:mt-[18vh]">
        <div className="font-display text-7xl font-semibold tracking-tight text-white tabular-nums sm:text-8xl lg:text-[9rem] xl:text-[11rem] 2xl:text-[13rem]">
          {clock || "--:--"}
        </div>
        <div className="font-display mt-4 text-2xl font-medium text-white/95 sm:text-4xl lg:text-5xl xl:text-6xl">
          {hello}
        </div>
        <figure
          key={quote?.text}
          className="animate-fade-in mx-auto mt-10 max-w-xl sm:mt-14 lg:max-w-3xl xl:max-w-4xl"
        >
          <blockquote className="font-quote text-base font-light italic leading-relaxed text-white/90 sm:text-xl lg:text-2xl xl:text-3xl">
            “{quote?.text}”
          </blockquote>
          <figcaption className="mt-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/60 sm:text-xs xl:text-sm">
            {quote?.author}
          </figcaption>
        </figure>
      </div>

      {/* Bottom-left location */}
      <div className="text-legible absolute bottom-5 left-5 z-10 flex items-center gap-1.5 text-[11px] font-light tracking-wide text-white/75 sm:bottom-7 sm:left-8 sm:text-xs xl:text-sm">
        <MapPin className="h-3.5 w-3.5" />
        <span className="max-w-[55vw] truncate">{amb.loading ? "locating…" : place || "—"}</span>
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
