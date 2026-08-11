# Let Me Think

A lofi coding-music player with a dynamic, real-time background that follows your city's weather and time of day.

## Features

- **Music Playback** — YouTube IFrame Player API with playlist support, seek, and controls
- **Dynamic Background** — Single image with CSS filters/overlays that shift based on real-time weather and day/night cycle
- **Weather Sync** — Open-Meteo API (free, no key) + OpenStreetMap geocoding
- **Ambient Effects** — Rain particles, twinkling stars, smooth transitions
- **Tech Leader Quotes** — 150+ curated quotes from founders and builders, with author attribution
- **Playback Persistence** — Resumes your song and position via localStorage
- **Responsive** — Works on mobile and desktop

## Tech Stack

- React 19 + TanStack Start (SSR)
- Tailwind CSS 4
- shadcn/ui (Radix-based components)
- Lucide React icons

## Development

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
