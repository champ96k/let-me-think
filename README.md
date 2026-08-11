# Lofi Study Beats

Build a single-page responsive website called "Let Me Think" — a lofi coding-music player with a dynamic, real-time background.

1. Music Playback (YouTube IFrame Player API)

Load this playlist using the official YouTube IFrame Player API: playlist ID PLTM_pHQ47h0CReCepz2FW79kK2ClqjgjC

Render the YouTube player in a hidden/invisible container (audio plays, video is not visually shown)

Autoplay on user's first interaction (browsers block autoplay with sound until a click, so trigger play on a "Start Listening" button)

Pull the current track title and channel/artist name from the player's getVideoData() method and display it

Custom controls calling the player API: Play/Pause (playVideo() / pauseVideo()), Next (nextVideo()), Previous (previousVideo())

Draggable seek slider using getCurrentTime() and getDuration(), updating every second, calling seekTo() on drag

Display current time / total duration (mm:ss format)

2. Location, Time, Weather (Day/Night Sync) — single image, CSS-driven

Use one single background image (a coding-desk lofi scene)

Request user's location via browser Geolocation API

Reverse geocode to city name via OpenStreetMap Nominatim API (free, no key)

Fetch live weather (temperature, condition, sunrise/sunset) via Open-Meteo API (free, no API key required)

Compare current local time to sunrise/sunset to determine day or night

Apply CSS filters/overlays on top of the single image instead of swapping images:

Day + clear: normal brightness, warm color overlay

Day + cloudy: slightly desaturated, cooler gray overlay

Day + rain: blue-tinted overlay + subtle CSS rain animation (falling line particles)

Night + clear: dark overlay (brightness ~40%), deep blue/purple tint, subtle star/twinkle effect optional

Night + cloudy: darker gray-blue overlay, lower contrast

Night + rain: darkest overlay + blue tint + rain animation

Transition smoothly between states using CSS transition on filter/overlay properties (~1.5s ease)

Display a live-updating clock, city name, and temperature in a small unobtrusive top-left corner

3. Layout & Design (inspired by saloon.wtf's minimal style)

Full-bleed, full-screen single background image with dynamic overlay as described above

Top-left: clock, city, temperature — small minimal typography, subtle text-shadow for legibility

Top-right: YouTube icon/button linking to https://www.youtube.com/playlist?list=PLTM_pHQ47h0CReCepz2FW79kK2ClqjgjC, opens in new tab

Center/bottom-center: floating glassmorphism player card — track title (marquee if long), artist name (smaller/muted), seek slider with time labels, prev/play-pause/next icon buttons

Clean sans-serif font (Inter/Poppins), soft shadows, rounded corners, minimal clutter

Fully responsive for mobile and desktop

4. Tech Requirements

Next.js + React + Tailwind CSS

Load YouTube IFrame API script dynamically (https://www.youtube.com/iframe_api)

No API key needed for weather (Open-Meteo) or geocoding (Nominatim)

Graceful loading state while location/weather/player initialize

Fallback to a default city (via IP-based geolocation) or default overlay if location permission is denied


first take refrence form this website i want same like this website. - https://saloon.wtf/

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4c1dbe53-5e6c-4abd-afbf-fc24363b6dba).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
