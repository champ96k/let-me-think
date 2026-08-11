import { useEffect, useState } from "react";

export type Sky = "clear" | "cloudy" | "rain";
export type Ambience = {
  city: string;
  temp: number | null;
  sky: Sky;
  isNight: boolean;
  loading: boolean;
  denied: boolean;
};

const DEFAULT: Ambience = {
  city: "",
  temp: null,
  sky: "clear",
  isNight: false,
  loading: true,
  denied: false,
};

function skyFromCode(code: number): Sky {
  if ([0, 1].includes(code)) return "clear";
  if ([2, 3, 45, 48].includes(code)) return "cloudy";
  if (code >= 51) return "rain";
  return "clear";
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
      { headers: { Accept: "application/json" } },
    );
    const j = await r.json();
    const a = j?.address ?? {};
    return a.city || a.town || a.village || a.county || a.state || "Somewhere";
  } catch {
    return "Somewhere";
  }
}

async function fetchWeather(lat: number, lon: number) {
  const r = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&daily=sunrise,sunset&timezone=auto`,
  );
  const j = await r.json();
  const isDay = j?.current?.is_day === 1;
  return {
    temp: Math.round(j?.current?.temperature_2m ?? 0),
    sky: skyFromCode(Number(j?.current?.weather_code ?? 0)),
    isNight: !isDay,
  };
}

async function ipFallback() {
  try {
    const r = await fetch("https://ipapi.co/json/");
    const j = await r.json();
    if (typeof j?.latitude === "number") {
      return { lat: j.latitude, lon: j.longitude, city: j.city as string };
    }
  } catch {
    /* ignore */
  }
  return { lat: 35.6762, lon: 139.6503, city: "Tokyo" };
}

export function useAmbience(): Ambience {
  const [state, setState] = useState<Ambience>(DEFAULT);

  useEffect(() => {
    let cancelled = false;

    const load = async (lat: number, lon: number, denied: boolean, knownCity?: string) => {
      const [city, weather] = await Promise.all([
        knownCity ? Promise.resolve(knownCity) : reverseGeocode(lat, lon),
        fetchWeather(lat, lon).catch(() => ({
          temp: null,
          sky: "clear" as Sky,
          isNight: new Date().getHours() < 6 || new Date().getHours() >= 19,
        })),
      ]);
      if (cancelled) return;
      setState({ city, ...weather, loading: false, denied });
    };

    const useIp = async (denied: boolean) => {
      const { lat, lon, city } = await ipFallback();
      await load(lat, lon, denied, city);
    };

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => load(pos.coords.latitude, pos.coords.longitude, false),
        () => useIp(true),
        { timeout: 8000 },
      );
    } else {
      void useIp(true);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
