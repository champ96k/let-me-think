# AGENTS.md

## Project: Let Me Think

A lofi coding-music player with dynamic weather-based backgrounds and tech leader quotes.

### Build & Run

```sh
npm run dev        # Start dev server
npm run build      # Production build
```

### Code Style

- TypeScript strict mode
- Tailwind CSS utility classes (no inline styles except dynamic)
- shadcn/ui components in `src/components/ui/`
- Custom hooks in `src/lib/`
- No comments unless requested

### Key Files

- `src/routes/index.tsx` — Main app component
- `src/lib/useYouTubePlayer.ts` — YouTube player hook with persistence
- `src/lib/quotes.ts` — 150+ tech leader quotes
- `src/lib/useAmbience.ts` — Weather/location hook
- `src/styles.css` — Global styles and theme
