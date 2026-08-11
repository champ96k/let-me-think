export const QUOTES: string[] = [
  "Often when you think you're at the end of something, you're at the beginning of something else.",
  "Simplicity is the soul of efficiency.",
  "First, solve the problem. Then, write the code.",
  "Slow is smooth, and smooth is fast.",
  "The quieter you become, the more you can hear.",
  "Make it work, make it right, make it fast.",
  "Deep work is the currency of thoughtful people.",
  "Small daily improvements are the key to staggering results.",
  "You don't have to be great to start, but you have to start to be great.",
  "Amateurs wait for inspiration; the rest of us just get up and go to work.",
  "Focus is a matter of deciding what things you're not going to do.",
  "The best way out is always through.",
  "Done is better than perfect, but finished is better than both.",
  "Every line you delete is a line you never have to debug.",
  "Patience is a form of action.",
  "Do the hard thing while it is still easy.",
  "Creativity is intelligence having fun.",
  "Discipline is choosing between what you want now and what you want most.",
  "Craft is what remains when the hype fades.",
  "A calm mind writes better code.",
];

export function randomQuote(exclude?: string) {
  let q = QUOTES[Math.floor(Math.random() * QUOTES.length)]!;
  if (QUOTES.length > 1) {
    while (q === exclude) q = QUOTES[Math.floor(Math.random() * QUOTES.length)]!;
  }
  return q;
}

export function greeting(hour: number) {
  if (hour < 5) return "Good night.";
  if (hour < 12) return "Good morning.";
  if (hour < 17) return "Good afternoon.";
  if (hour < 21) return "Good evening.";
  return "Good night.";
}
