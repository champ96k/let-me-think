const DROPS = Array.from({ length: 70 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: ((i * 13) % 40) / 10,
  duration: 0.6 + ((i * 7) % 9) / 10,
  height: 40 + ((i * 17) % 60),
  opacity: 0.15 + ((i * 11) % 5) / 12,
}));

export function RainLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {DROPS.map((d, i) => (
        <span
          key={i}
          className="rain-drop"
          style={{
            left: `${d.left}%`,
            height: `${d.height}px`,
            opacity: d.opacity,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
