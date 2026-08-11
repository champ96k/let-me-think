const STARS = Array.from({ length: 45 }, (_, i) => ({
  left: (i * 23) % 100,
  top: ((i * 31) % 55) + 2,
  size: 1 + ((i * 5) % 3) * 0.6,
  delay: ((i * 19) % 40) / 10,
}));

export function StarsLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {STARS.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
