import { useCallback, useEffect, useRef, useState } from "react";

export const PLAYLIST_ID = "PLTM_pHQ47h0CReCepz2FW79kK2ClqjgjC";
const STORAGE_KEY = "lmt-playback";

type Saved = { index: number; time: number; playing: boolean };

function readSaved(): Saved | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const j = JSON.parse(raw);
    if (typeof j?.index !== "number") return null;
    return { index: j.index, time: Number(j.time) || 0, playing: !!j.playing };
  } catch {
    return null;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<any> | null = null;

function loadApi(): Promise<any> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT);
    };
    if (!document.querySelector('script[src*="iframe_api"]')) {
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    }
  });
  return apiPromise;
}

export function useYouTubePlayer(containerId: string) {
  const playerRef = useRef<any>(null);
  const seekingRef = useRef(false);
  const restoredRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [videoId, setVideoId] = useState("");
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let destroyed = false;
    const saved = readSaved();
    loadApi().then((YT) => {
      if (destroyed || !document.getElementById(containerId)) return;
      playerRef.current = new YT.Player(containerId, {
        height: "1",
        width: "1",
        playerVars: {
          listType: "playlist",
          list: PLAYLIST_ID,
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          loop: 1,
        },
        events: {
          onReady: () => {
            setReady(true);
            const p = playerRef.current;
            try {
              p?.setLoop?.(true);
            } catch {
              /* ignore */
            }
            if (saved && !restoredRef.current) {
              restoredRef.current = true;
              try {
                p?.playVideoAt?.(saved.index);
                p?.pauseVideo?.();
                if (saved.time > 1) p?.seekTo?.(saved.time, true);
                p?.pauseVideo?.();
              } catch {
                /* ignore */
              }
            }
            const d = p?.getVideoData?.();
            if (d) {
              setTitle(d.title ?? "");
              setAuthor(d.author ?? "");
              setVideoId(d.video_id ?? "");
            }
            setDuration(p?.getDuration?.() ?? 0);
          },
          onStateChange: (e: any) => {
            const p = playerRef.current;
            setPlaying(e.data === 1);
            if (e.data === 0) {
              // ended: loop back to the first track when the playlist finishes
              try {
                const idx = p?.getPlaylistIndex?.() ?? 0;
                const len = p?.getPlaylist?.()?.length ?? 0;
                if (len > 0 && idx >= len - 1) p?.playVideoAt?.(0);
              } catch {
                /* ignore */
              }
            }
            const d = p?.getVideoData?.();
            if (d) {
              setTitle(d.title ?? "");
              setAuthor(d.author ?? "");
              setVideoId(d.video_id ?? "");
            }
            setDuration(p?.getDuration?.() ?? 0);
          },
        },
      });
    });
    return () => {
      destroyed = true;
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
    };
  }, [containerId]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (!p?.getCurrentTime) return;
      const t = p.getCurrentTime() ?? 0;
      if (!seekingRef.current) setCurrent(t);
      setDuration(p.getDuration?.() ?? 0);
      const d = p.getVideoData?.();
      if (d?.title) {
        setTitle(d.title);
        setAuthor(d.author ?? "");
        setVideoId(d.video_id ?? "");
      }
      try {
        const state = p.getPlayerState?.();
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            index: p.getPlaylistIndex?.() ?? 0,
            time: t,
            playing: state === 1,
          }),
        );
      } catch {
        /* ignore */
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const play = useCallback(() => playerRef.current?.playVideo?.(), []);
  const pause = useCallback(() => playerRef.current?.pauseVideo?.(), []);
  const toggle = useCallback(() => (playing ? pause() : play()), [playing, play, pause]);
  const next = useCallback(() => playerRef.current?.nextVideo?.(), []);
  const prev = useCallback(() => playerRef.current?.previousVideo?.(), []);
  const startSeek = useCallback(() => {
    seekingRef.current = true;
  }, []);
  const scrub = useCallback((t: number) => setCurrent(t), []);
  const commitSeek = useCallback((t: number) => {
    playerRef.current?.seekTo?.(t, true);
    seekingRef.current = false;
  }, []);
  const setVolumeUnmute = useCallback(() => {
    playerRef.current?.unMute?.();
    playerRef.current?.setVolume?.(60);
  }, []);

  return {
    ready,
    playing,
    title,
    author,
    videoId,
    current,
    duration,
    play,
    pause,
    toggle,
    next,
    prev,
    startSeek,
    scrub,
    commitSeek,
    setVolumeUnmute,
  };
}
