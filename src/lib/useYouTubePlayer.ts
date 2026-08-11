import { useCallback, useEffect, useRef, useState } from "react";

export const PLAYLIST_ID = "PLTM_pHQ47h0CReCepz2FW79kK2ClqjgjC";

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
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let destroyed = false;
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
        },
        events: {
          onReady: () => setReady(true),
          onStateChange: (e: any) => {
            setPlaying(e.data === 1);
            const d = playerRef.current?.getVideoData?.();
            if (d) {
              setTitle(d.title ?? "");
              setAuthor(d.author ?? "");
            }
            setDuration(playerRef.current?.getDuration?.() ?? 0);
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
      if (!seekingRef.current) setCurrent(p.getCurrentTime() ?? 0);
      setDuration(p.getDuration?.() ?? 0);
      const d = p.getVideoData?.();
      if (d?.title) {
        setTitle(d.title);
        setAuthor(d.author ?? "");
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
