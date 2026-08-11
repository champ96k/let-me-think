import { useEffect, useState } from "react";

export type Sky = "clear" | "cloudy" | "rain";
export type Ambience = {
  city: string;
  region: string;
  country: string;
  temp: number | null;
  feelsLike: number | null;
  humidity: number | null;
  wind: number | null;
  label: string;
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
  feelsLike: null,
  humidity: null,
  wind: null,
  label: "",
  sky: "clear",
  isNight: false,
  loading: true,
  denied: false,
};

const WEATHER_LABELS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Freezing fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  56: "Freezing drizzle",
  57: "Freezing drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Light showers",
  81: "Showers",
  82: "Violent showers",
  85: "Snow showers",
  86: "Snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm, hail",
  99: "Thunderstorm, hail",
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
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,is_day,wind_speed_10m&daily=sunrise,sunset&timezone=auto`,
  );
  const j = await r.json();
  const isDay = j?.current?.is_day === 1;
  const code = Number(j?.current?.weather_code ?? 0);
  return {
    temp: Math.round(j?.current?.temperature_2m ?? 0),
    feelsLike: Math.round(j?.current?.apparent_temperature ?? j?.current?.temperature_2m ?? 0),
    humidity: Math.round(j?.current?.relative_humidity_2m ?? 0),
    wind: Math.round(j?.current?.wind_speed_10m ?? 0),
    label: WEATHER_LABELS[code] ?? "Unknown",
    sky: skyFromCode(code),
    isNight: !isDay,
  };
}

async function ipFallback(): Promise<{ lat: number; lon: number; place?: Place }> {
  try {
    const r = await fetch("https://ipapi.co/json/");
    const j = await r.json();
    if (typeof j?.latitude === "number") {
      return {
        lat: j.latitude,
        lon: j.longitude,
        place: {
          city: j.city ?? "Somewhere",
          region: j.region ?? "",
          country: j.country_name ?? "",
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
          feelsLike: null,
          humidity: null,
          wind: null,
          label: "",
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
