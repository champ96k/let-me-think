export type Quote = { text: string; author: string };

export const QUOTES: Quote[] = [
  { text: "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.", author: "Mark Zuckerberg" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Make something people want.", author: "Paul Graham" },
  { text: "It's better to have 100 people love you than a million people sort of like you.", author: "Brian Chesky" },
  { text: "Ideas are easy. Implementation is hard.", author: "Guy Kawasaki" },
  { text: "If you are not embarrassed by the first version of your product, you have launched too late.", author: "Reid Hoffman" },
  { text: "Your most unhappy customers are your greatest source of learning.", author: "Bill Gates" },
  { text: "When something is important enough, you do it even if the odds are not in your favor.", author: "Elon Musk" },
  { text: "Start with the customer and work backwards.", author: "Jeff Bezos" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Simple things should be simple, complex things should be possible.", author: "Alan Kay" },
  { text: "The most dangerous poison is the feeling of achievement.", author: "Ingvar Kamprad" },
  { text: "Speed is the ultimate weapon in business.", author: "Sam Altman" },
  { text: "Culture eats strategy for breakfast.", author: "Peter Drucker" },
  { text: "Do things that don't scale.", author: "Paul Graham" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "Premature optimization is the root of all evil.", author: "Donald Knuth" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "The only way to win is to learn faster than anyone else.", author: "Eric Ries" },
  { text: "Great companies are built on great products.", author: "Elon Musk" },
  { text: "Focusing is about saying no.", author: "Steve Jobs" },
  { text: "If you double the number of experiments you do per year, you're going to double your inventiveness.", author: "Jeff Bezos" },
];

export function randomQuote(exclude?: Quote) {
  let q = QUOTES[Math.floor(Math.random() * QUOTES.length)]!;
  if (QUOTES.length > 1) {
    while (q.text === exclude?.text) q = QUOTES[Math.floor(Math.random() * QUOTES.length)]!;
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
