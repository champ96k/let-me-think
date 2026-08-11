import { useEffect, useState } from "react";

export type Sky = "clear" | "cloudy" | "rain";
export type Ambience = {
  city: string;
  region: string;
  country: string;
  temp: number | null;
  sky: Sky;
  isNight: boolean;
  loading: boolean;
  denied: boolean;
};

const DEFAULT: Ambience = {
  city: "",
  region: "",
  country: "",
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

type Place = { city: string; region: string; country: string };

async function reverseGeocode(lat: number, lon: number): Promise<Place> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
      { headers: { Accept: "application/json" } },
    );
    const j = await r.json();
    const a = j?.address ?? {};
    return {
      city: a.city || a.town || a.village || a.county || a.state || "Somewhere",
      region: a.state || a.region || "",
      country: a.country || "",
    };
  } catch {
    return { city: "Somewhere", region: "", country: "" };
  }
}

async function fetchWeather(lat: number, lon: number) {
  const r = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=auto`,
  );
  const j = await r.json();
  // Use browser's local time for day/night so greeting matches the clock
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour >= 19;
  return {
    temp: Math.round(j?.current?.temperature_2m ?? 0),
    sky: skyFromCode(Number(j?.current?.weather_code ?? 0)),
    isNight,
  };
}

async function ipFallback(): Promise<{ lat: number; lon: number; place?: Place }> {
  // Try ip-api.com first (more reliable, no key needed)
  try {
    const r = await fetch("https://ip-api.com/json/?fields=status,lat,lon,city,regionName,country");
    const j = await r.json();
    if (j?.status === "success" && typeof j.lat === "number") {
      return {
        lat: j.lat,
        lon: j.lon,
        place: {
          city: j.city || "Somewhere",
          region: j.regionName || "",
          country: j.country || "",
        },
      };
    }
  } catch {
    /* try next */
  }

  // Fallback to ipapi.co
  try {
    const r = await fetch("https://ipapi.co/json/");
    const j = await r.json();
    if (typeof j?.latitude === "number") {
      return {
        lat: j.latitude,
        lon: j.longitude,
        place: {
          city: j.city || "Somewhere",
          region: j.region || "",
          country: j.country_name || "",
        },
      };
    }
  } catch {
    /* ignore */
  }

  return {
    lat: 35.6762,
    lon: 139.6503,
    place: { city: "Tokyo", region: "Tokyo", country: "Japan" },
  };
}

export function useAmbience(): Ambience {
  const [state, setState] = useState<Ambience>(DEFAULT);

  useEffect(() => {
    let cancelled = false;

    const load = async (lat: number, lon: number, denied: boolean, knownPlace?: Place) => {
      const [place, weather] = await Promise.all([
        knownPlace ? Promise.resolve(knownPlace) : reverseGeocode(lat, lon),
        fetchWeather(lat, lon).catch(() => ({
          temp: null,
          sky: "clear" as Sky,
          isNight: new Date().getHours() < 6 || new Date().getHours() >= 19,
        })),
      ]);
      if (cancelled) return;
      setState({ ...place, ...weather, loading: false, denied });
    };

    const useIp = async (denied: boolean) => {
      const { lat, lon, place } = await ipFallback();
      await load(lat, lon, denied, place);
    };

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => load(pos.coords.latitude, pos.coords.longitude, false),
        () => useIp(true),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
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
