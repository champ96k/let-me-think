import { useCallback, useEffect, useRef, useState } from "react";

export const PLAYLIST_ID = "PLubzk6WJ4BESzbg0AuzpHaCfSVgmepEIh";

const STORAGE_KEY = "lmt-playback";
const PLAYLIST_VERSION_KEY = "lmt-playlist-id";

type PlaybackState = {
  videoIndex: number;
  timestamp: number;
  videoId: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function waitForApi(timeoutMs = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.YT?.Player) {
      console.log("[YT] API already loaded");
      return resolve();
    }
    const timer = setTimeout(() => {
      console.error("[YT] API load timed out after", timeoutMs, "ms");
      reject(new Error("YouTube IFrame API failed to load"));
    }, timeoutMs);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timer);
      console.log("[YT] API ready via callback");
      prev?.();
      resolve();
    };
    if (!document.querySelector('script[src*="iframe_api"]')) {
      console.log("[YT] Injecting iframe_api script");
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.onerror = () => {
        clearTimeout(timer);
        console.error("[YT] Failed to load iframe_api script");
        reject(new Error("Failed to load YouTube IFrame API script"));
      };
      document.head.appendChild(s);
    }
  });
}

function savePlaybackState(state: PlaybackState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked */
  }
}

function loadPlaybackState(): PlaybackState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PlaybackState;
  } catch {
    return null;
  }
}

export function useYouTubePlayer(containerId: string) {
  const playerRef = useRef<any>(null);
  const seekingRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [videoId, setVideoId] = useState("");
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const restoredRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try {
      const savedId = localStorage.getItem(PLAYLIST_VERSION_KEY);
      if (savedId !== PLAYLIST_ID) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(PLAYLIST_VERSION_KEY, PLAYLIST_ID);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (playing && ready) {
      saveTimerRef.current = setInterval(() => {
        const p = playerRef.current;
        if (!p?.getCurrentTime) return;
        const idx = p.getPlaylistIndex?.() ?? 0;
        const vid = p.getVideoData?.()?.video_id ?? "";
        savePlaybackState({
          videoIndex: idx,
          timestamp: p.getCurrentTime(),
          videoId: vid,
        });
      }, 5000);
    }
    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
    };
  }, [playing, ready]);

  useEffect(() => {
    const handleUnload = () => {
      const p = playerRef.current;
      if (!p?.getCurrentTime) return;
      const idx = p.getPlaylistIndex?.() ?? 0;
      const vid = p.getVideoData?.()?.video_id ?? "";
      savePlaybackState({
        videoIndex: idx,
        timestamp: p.getCurrentTime(),
        videoId: vid,
      });
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  useEffect(() => {
    let destroyed = false;
    console.log("[YT] Effect mounted, container:", containerId);

    waitForApi().then(() => {
      if (destroyed) { console.log("[YT] Destroyed before API ready"); return; }
      const el = document.getElementById(containerId);
      console.log("[YT] Container element:", el ? "found" : "MISSING");
      if (!el) return;

      try {
        console.log("[YT] Creating player...");
        playerRef.current = new window.YT.Player(containerId, {
          height: "270",
          width: "480",
          playerVars: {
            listType: "playlist",
            list: PLAYLIST_ID,
            controls: 0,
            disablekb: 1,
            playsinline: 1,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: () => {
              if (destroyed) return;
              console.log("[YT] Player onReady, playlist:", playerRef.current?.getPlaylist?.()?.length, "videos");
              setReady(true);
              const d = playerRef.current?.getVideoData?.();
              if (d) {
                setTitle(d.title ?? "");
                setAuthor(d.author ?? "");
                setVideoId(d.video_id ?? "");
              }
              setDuration(playerRef.current?.getDuration?.() ?? 0);
              setCurrentIndex(playerRef.current?.getPlaylistIndex?.() ?? 0);

              if (!restoredRef.current) {
                restoredRef.current = true;
                const saved = loadPlaybackState();
                if (saved && saved.videoId) {
                  const playlist = playerRef.current?.getPlaylist?.();
                  if (playlist && playlist.length > 0) {
                    const idx = Math.min(saved.videoIndex, playlist.length - 1);
                    playerRef.current.playVideoAt(idx);
                    playerRef.current.pauseVideo();
                    setTimeout(() => {
                      if (playerRef.current?.seekTo && saved.timestamp > 0) {
                        playerRef.current.seekTo(saved.timestamp, true);
                      }
                    }, 500);
                  }
                }
              }
            },
            onStateChange: (e: any) => {
              if (destroyed) return;
              setPlaying(e.data === 1);
              const d = playerRef.current?.getVideoData?.();
              if (d) {
                setTitle(d.title ?? "");
                setAuthor(d.author ?? "");
                setVideoId(d.video_id ?? "");
              }
              setDuration(playerRef.current?.getDuration?.() ?? 0);
              setCurrentIndex(playerRef.current?.getPlaylistIndex?.() ?? 0);

              if (e.data === 0) {
                const idx = playerRef.current?.getPlaylistIndex?.() ?? 0;
                const playlist = playerRef.current?.getPlaylist?.() ?? [];
                if (idx >= playlist.length - 1) {
                  playerRef.current?.playVideoAt?.(0);
                }
              }

              if (e.data === 1 || e.data === 0) {
                const idx = playerRef.current?.getPlaylistIndex?.() ?? 0;
                const vid = d?.video_id ?? "";
                const ts = playerRef.current?.getCurrentTime?.() ?? 0;
                savePlaybackState({ videoIndex: idx, timestamp: ts, videoId: vid });
              }
            },
            onError: (e: any) => {
              if (destroyed) return;
              console.error("[YT Player] Error:", e.data);
            },
          },
        });
      } catch (err) {
        if (!destroyed) console.error("[YT Player] Failed to create:", err);
      }
    }).catch((err) => {
      console.error("[YT] waitForApi rejected:", err.message);
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
        setVideoId(d.video_id ?? "");
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
    currentIndex,
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
