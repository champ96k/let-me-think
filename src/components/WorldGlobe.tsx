import { useCallback, useEffect, useState } from "react";
import type { Listener } from "@/lib/listeners";

const EARTH_IMG =
  "//cdn.jsdelivr.net/npm/three-globe/example/img/earth-day.jpg";

const ringColor = (t: number) =>
  `rgba(115, 230, 160, ${(1 - t) * 0.55})`;

export function WorldGlobe({
  activeListeners,
  userLocation,
}: {
  activeListeners: Listener[];
  userLocation?: { lat: number; lng: number; city?: string };
}) {
  const [Globe, setGlobe] = useState<any | null>(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 700 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const size = Math.min(w - 48, h - 180, 700);
      setDimensions({ width: size, height: size });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    import("react-globe.gl")
      .then((mod) => {
        setGlobe(() => mod.default);
      })
      .catch((err) => {
        console.error("Failed to load globe:", err);
        setError(err.message);
      });
  }, []);

  const onGlobeReady = useCallback((globe: any) => {
    const setup = () => {
      try {
        const controls = globe.controls();
        if (controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 1.2;
          controls.enableZoom = true;
          controls.enablePan = false;
          controls.minDistance = 120;
          controls.maxDistance = 800;
          controls.zoomSpeed = 1.5;
        }
      } catch (err) {
        console.error("Globe init error:", err);
      }
    };
    setTimeout(setup, 100);
  }, []);

  if (error) {
    return (
      <div
        className="flex items-center justify-center rounded-full border border-white/5 bg-white/[0.03]"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <div className="text-xs text-red-400/70">Globe failed to load</div>
      </div>
    );
  }

  if (!Globe) {
    return (
      <div
        className="flex items-center justify-center rounded-full border border-white/5 bg-white/[0.03]"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <div className="text-xs text-white/30">Loading globe…</div>
      </div>
    );
  }

  const allPoints = userLocation?.lat
    ? [
        ...activeListeners,
        {
          city: userLocation.city || "You",
          country: "",
          lat: userLocation.lat,
          lng: userLocation.lng,
          isUser: true,
        },
      ]
    : activeListeners;

  return (
    <div className="overflow-visible" style={{ width: dimensions.width, height: dimensions.height }}>
      <Globe
        globeImageUrl={EARTH_IMG}
        backgroundImageUrl=""
        backgroundColor="rgba(0,0,0,0)"
        width={dimensions.width}
        height={dimensions.height}
        onGlobeReady={onGlobeReady}
        pointsData={allPoints}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={(d: any) => (d.isUser ? 0.025 : 0.012)}
        pointRadius={(d: any) => (d.isUser ? 0.9 : 0.6)}
        pointColor={(d: any) => (d.isUser ? "#22d3ee" : "#73e6a0")}
        pointLabel={(d: any) =>
          d.isUser
            ? `<div class="globe-tooltip globe-tooltip--you">📍 You are here</div>`
            : `<div class="globe-tooltip">${d.city}, ${d.country}</div>`
        }
        ringsData={activeListeners}
        ringLat="lat"
        ringLng="lng"
        ringColor={ringColor}
        ringMaxRadius={2.5}
        ringPropagationSpeed={4}
        ringRepeatPeriod={2200}
        ringsTransitionDuration={0}
      />
    </div>
  );
}
