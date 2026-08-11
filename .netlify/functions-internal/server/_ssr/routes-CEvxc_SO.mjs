import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as Play, c as MapPin, d as CloudMoon, i as Settings, l as Cloud, n as SkipForward, o as Pause, r as SkipBack, s as Moon, t as Sun, u as CloudRain } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CEvxc_SO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var lofi_desk_default = "/assets/lofi-desk-DvyhfhWN.png";
var DROPS = Array.from({ length: 70 }, (_, i) => ({
	left: i * 37 % 100,
	delay: i * 13 % 40 / 10,
	duration: .6 + i * 7 % 9 / 10,
	height: 40 + i * 17 % 60,
	opacity: .15 + i * 11 % 5 / 12
}));
function RainLayer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 overflow-hidden",
		children: DROPS.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "rain-drop",
			style: {
				left: `${d.left}%`,
				height: `${d.height}px`,
				opacity: d.opacity,
				animationDelay: `${d.delay}s`,
				animationDuration: `${d.duration}s`
			}
		}, i))
	});
}
var STARS = Array.from({ length: 45 }, (_, i) => ({
	left: i * 23 % 100,
	top: i * 31 % 55 + 2,
	size: 1 + i * 5 % 3 * .6,
	delay: i * 19 % 40 / 10
}));
function StarsLayer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 overflow-hidden",
		children: STARS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "star",
			style: {
				left: `${s.left}%`,
				top: `${s.top}%`,
				width: `${s.size}px`,
				height: `${s.size}px`,
				animationDelay: `${s.delay}s`
			}
		}, i))
	});
}
var DEFAULT = {
	city: "",
	region: "",
	country: "",
	temp: null,
	sky: "clear",
	isNight: false,
	loading: true,
	denied: false
};
function skyFromCode(code) {
	if ([0, 1].includes(code)) return "clear";
	if ([
		2,
		3,
		45,
		48
	].includes(code)) return "cloudy";
	if (code >= 51) return "rain";
	return "clear";
}
async function reverseGeocode(lat, lon) {
	try {
		const a = (await (await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`, { headers: { Accept: "application/json" } })).json())?.address ?? {};
		return {
			city: a.city || a.town || a.village || a.county || a.state || "Somewhere",
			region: a.state || a.region || "",
			country: a.country || ""
		};
	} catch {
		return {
			city: "Somewhere",
			region: "",
			country: ""
		};
	}
}
async function fetchWeather(lat, lon) {
	const j = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=auto`)).json();
	const hour = (/* @__PURE__ */ new Date()).getHours();
	const isNight = hour < 6 || hour >= 19;
	return {
		temp: Math.round(j?.current?.temperature_2m ?? 0),
		sky: skyFromCode(Number(j?.current?.weather_code ?? 0)),
		isNight
	};
}
async function ipFallback() {
	try {
		const j = await (await fetch("https://ip-api.com/json/?fields=status,lat,lon,city,regionName,country")).json();
		if (j?.status === "success" && typeof j.lat === "number") return {
			lat: j.lat,
			lon: j.lon,
			place: {
				city: j.city || "Somewhere",
				region: j.regionName || "",
				country: j.country || ""
			}
		};
	} catch {}
	try {
		const j = await (await fetch("https://ipapi.co/json/")).json();
		if (typeof j?.latitude === "number") return {
			lat: j.latitude,
			lon: j.longitude,
			place: {
				city: j.city || "Somewhere",
				region: j.region || "",
				country: j.country_name || ""
			}
		};
	} catch {}
	return {
		lat: 35.6762,
		lon: 139.6503,
		place: {
			city: "Tokyo",
			region: "Tokyo",
			country: "Japan"
		}
	};
}
function useAmbience() {
	const [state, setState] = (0, import_react.useState)(DEFAULT);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const load = async (lat, lon, denied, knownPlace) => {
			const [place, weather] = await Promise.all([knownPlace ? Promise.resolve(knownPlace) : reverseGeocode(lat, lon), fetchWeather(lat, lon).catch(() => ({
				temp: null,
				sky: "clear",
				isNight: (/* @__PURE__ */ new Date()).getHours() < 6 || (/* @__PURE__ */ new Date()).getHours() >= 19
			}))]);
			if (cancelled) return;
			setState({
				...place,
				...weather,
				loading: false,
				denied
			});
		};
		const useIp = async (denied) => {
			const { lat, lon, place } = await ipFallback();
			await load(lat, lon, denied, place);
		};
		if (typeof navigator !== "undefined" && navigator.geolocation) navigator.geolocation.getCurrentPosition((pos) => load(pos.coords.latitude, pos.coords.longitude, false), () => useIp(true), {
			enableHighAccuracy: true,
			timeout: 1e4,
			maximumAge: 3e5
		});
		else useIp(true);
		return () => {
			cancelled = true;
		};
	}, []);
	return state;
}
var QUOTES = [
	{
		text: "Innovation distinguishes between a leader and a follower.",
		author: "Steve Jobs"
	},
	{
		text: "Stay hungry, stay foolish.",
		author: "Steve Jobs"
	},
	{
		text: "Your time is limited, don't waste it living someone else's life.",
		author: "Steve Jobs"
	},
	{
		text: "The only way to do great work is to love what you do.",
		author: "Steve Jobs"
	},
	{
		text: "Simplicity is the ultimate sophistication.",
		author: "Steve Jobs"
	},
	{
		text: "People who are crazy enough to think they can change the world are the ones who do.",
		author: "Steve Jobs"
	},
	{
		text: "Focus is about saying no to the hundred other good ideas.",
		author: "Steve Jobs"
	},
	{
		text: "When something is important enough, you do it even if the odds are not in your favor.",
		author: "Elon Musk"
	},
	{
		text: "I think it is possible for ordinary people to choose to be extraordinary.",
		author: "Elon Musk"
	},
	{
		text: "Failure is an option here. If things are not failing, you are not innovating enough.",
		author: "Elon Musk"
	},
	{
		text: "When Henry Ford made cheap, reliable cars, people said, 'Nah, what's wrong with a horse?'",
		author: "Elon Musk"
	},
	{
		text: "Persistence is very important. You should not give up unless you are forced to give up.",
		author: "Elon Musk"
	},
	{
		text: "Some people don't like change, but you need to embrace change if the alternative is disaster.",
		author: "Elon Musk"
	},
	{
		text: "Brand is just a perception, and perception will match reality over time.",
		author: "Elon Musk"
	},
	{
		text: "If you need inspiring words, don't do it.",
		author: "Elon Musk"
	},
	{
		text: "Your margin is my opportunity.",
		author: "Jeff Bezos"
	},
	{
		text: "We are our choices. Build yourself a great story.",
		author: "Jeff Bezos"
	},
	{
		text: "If you double the number of experiments you do per year, you're going to double your inventiveness.",
		author: "Jeff Bezos"
	},
	{
		text: "The best customer service is if the customer doesn't need to call you, doesn't need to talk to you. It just works.",
		author: "Jeff Bezos"
	},
	{
		text: "I knew that if I failed I wouldn't regret that, but I knew the one thing I might regret is not trying.",
		author: "Jeff Bezos"
	},
	{
		text: "What's dangerous is not to evolve.",
		author: "Jeff Bezos"
	},
	{
		text: "We've had three big ideas at Amazon that we've stuck with: put the customer first, invent, and be patient.",
		author: "Jeff Bezos"
	},
	{
		text: "Success is a lousy teacher. It seduces smart people into thinking they can't lose.",
		author: "Bill Gates"
	},
	{
		text: "The internet is becoming the town square for the global village of tomorrow.",
		author: "Bill Gates"
	},
	{
		text: "We always overestimate the change that will occur in the next two years and underestimate the change that will occur in the next ten.",
		author: "Bill Gates"
	},
	{
		text: "It's fine to celebrate success, but it is more important to heed the lessons of failure.",
		author: "Bill Gates"
	},
	{
		text: "I choose a lazy person to do a hard job. Because a lazy person will find an easy way to do it.",
		author: "Bill Gates"
	},
	{
		text: "The most amazing philanthropists are people who are actually making a significant sacrifice.",
		author: "Bill Gates"
	},
	{
		text: "Code is like humor. When you have to explain it, it's bad.",
		author: "Bill Gates"
	},
	{
		text: "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.",
		author: "Mark Zuckerberg"
	},
	{
		text: "The most important thing is to try and inspire people so that they can be great in whatever they want to do.",
		author: "Mark Zuckerberg"
	},
	{
		text: "People think innovation is just having a big idea, but it's really about executing that idea through a long process.",
		author: "Mark Zuckerberg"
	},
	{
		text: "The biggest risk is not taking any risk. In a world that is changing really quickly, the only strategy that is guaranteed to fail is not taking risks.",
		author: "Mark Zuckerberg"
	},
	{
		text: "Don't let people create the future. Find the people who want to create the future.",
		author: "Mark Zuckerberg"
	},
	{
		text: "Our mission is to give people the power to build community and bring the world closer together.",
		author: "Mark Zuckerberg"
	},
	{
		text: "The way to get started is to quit talking and begin doing.",
		author: "Walt Disney"
	},
	{
		text: "Every great developer I know got there by solving problems they were unqualified to solve until they actually did it.",
		author: "Patrick McKenzie"
	},
	{
		text: "Culture eats strategy for breakfast.",
		author: "Peter Drucker"
	},
	{
		text: "The best time to plant a tree was 20 years ago. The second best time is now.",
		author: "Chinese Proverb"
	},
	{
		text: "Talk is cheap. Show me the code.",
		author: "Linus Torvalds"
	},
	{
		text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
		author: "Martin Fowler"
	},
	{
		text: "First, solve the problem. Then, write the code.",
		author: "John Johnson"
	},
	{
		text: "The only limit to our realization of tomorrow will be our doubts of today.",
		author: "Franklin D. Roosevelt"
	},
	{
		text: "Make something people want.",
		author: "Paul Graham"
	},
	{
		text: "In a world full of features, simplicity is the ultimate competitive advantage.",
		author: "Paul Graham"
	},
	{
		text: "Live in the future, then build what's missing.",
		author: "Paul Graham"
	},
	{
		text: "Do things that don't scale.",
		author: "Paul Graham"
	},
	{
		text: "Write applications that are small, simple, and easy to understand.",
		author: "Paul Graham"
	},
	{
		text: "The way to get startup ideas is not to try to think of startup ideas.",
		author: "Paul Graham"
	},
	{
		text: "The best startup ideas tend to have three things in common: they're something the founders themselves want, that they themselves can build, and that few others realize are worth doing.",
		author: "Paul Graham"
	},
	{
		text: "Software is eating the world.",
		author: "Marc Andreessen"
	},
	{
		text: "The next Bill Gates will not build an operating system. The next Larry Page will not build a search engine. If you are copying these guys, you aren't learning from them.",
		author: "Peter Thiel"
	},
	{
		text: "Every moment in business happens only once. The next Bill Gates will not build an operating system.",
		author: "Peter Thiel"
	},
	{
		text: "Competition is for losers.",
		author: "Peter Thiel"
	},
	{
		text: "Monopoly is the condition of every successful business.",
		author: "Peter Thiel"
	},
	{
		text: "Brilliant thinking is rare, but courage is in even shorter supply than genius.",
		author: "Peter Thiel"
	},
	{
		text: "The most contrarian thing of all is not to oppose the crowd but to think for yourself.",
		author: "Peter Thiel"
	},
	{
		text: "What important truth do very few people agree with you on?",
		author: "Peter Thiel"
	},
	{
		text: "A startup is the largest endeavor over which you can have definite mastery.",
		author: "Peter Thiel"
	},
	{
		text: "We wanted flying cars, instead we got 140 characters.",
		author: "Peter Thiel"
	},
	{
		text: "The hard thing about hard things is that there is no formula for dealing with them.",
		author: "Ben Horowitz"
	},
	{
		text: "There are no silver bullets. Only lead bullets.",
		author: "Ben Horowitz"
	},
	{
		text: "Take care of the people, the products, and the profits — in that order.",
		author: "Ben Horowitz"
	},
	{
		text: "The most important thing I learned as an entrepreneur was that the things that are the hardest to talk about are often the most important things to talk about.",
		author: "Ben Horowitz"
	},
	{
		text: "If you're going to eat shit, don't nibble.",
		author: "Ben Horowitz"
	},
	{
		text: "Embrace the struggle. It's what makes you stronger.",
		author: "Ben Horowitz"
	},
	{
		text: "Speed is the ultimate weapon in business. All else being equal, the fastest company in any market will win.",
		author: "Ben Horowitz"
	},
	{
		text: "Don't worry about people stealing your idea. If your idea is any good, you'll have to hammer it into people's heads.",
		author: "Howard Aiken"
	},
	{
		text: "Innovation is the ability to see change as an opportunity, not a threat.",
		author: "Steve Ballmer"
	},
	{
		text: "The best way to predict the future is to create it.",
		author: "Peter Drucker"
	},
	{
		text: "If you define the problem correctly, you almost have the solution.",
		author: "Steve Jobs"
	},
	{
		text: "Quality is not an act, it is a habit.",
		author: "Aristotle"
	},
	{
		text: "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.",
		author: "Mark Zuckerberg"
	},
	{
		text: "The purpose of a business is to create a customer.",
		author: "Peter Drucker"
	},
	{
		text: "A brand is no longer what we tell the consumer it is — it is what consumers tell each other it is.",
		author: "Scott Cook"
	},
	{
		text: "If you're not embarrassed by the first version of your product, you've launched too late.",
		author: "Reid Hoffman"
	},
	{
		text: "An entrepreneur is someone who jumps off a cliff and builds a plane on the way down.",
		author: "Reid Hoffman"
	},
	{
		text: "Every product company has to become a software company.",
		author: "Satya Nadella"
	},
	{
		text: "Our industry does not respect tradition — it only respects innovation.",
		author: "Satya Nadella"
	},
	{
		text: "The learn-it-all will always do better than the know-it-all.",
		author: "Satya Nadella"
	},
	{
		text: "Empathy makes you a better innovator.",
		author: "Satya Nadella"
	},
	{
		text: "Don't be a know-it-all; be a learn-it-all.",
		author: "Satya Nadella"
	},
	{
		text: "I grew up in a world where I needed to have a growth mindset to survive.",
		author: "Satya Nadella"
	},
	{
		text: "The C in CEO stands for culture.",
		author: "Satya Nadella"
	},
	{
		text: "We needed to go from a know-it-all culture to a learn-it-all culture.",
		author: "Satya Nadella"
	},
	{
		text: "If I look at the most successful companies, they've been very focused on fewer things.",
		author: "Satya Nadella"
	},
	{
		text: "The future belongs to those who believe in the beauty of their dreams.",
		author: "Eleanor Roosevelt"
	},
	{
		text: "In the middle of difficulty lies opportunity.",
		author: "Albert Einstein"
	},
	{
		text: "Simplicity is the key to brilliance.",
		author: "Bruce Lee"
	},
	{
		text: "The only way to do great work is to love what you do.",
		author: "Steve Jobs"
	},
	{
		text: "If you look at what you have in life, you'll always have more.",
		author: "Oprah Winfrey"
	},
	{
		text: "Build your own dreams, or someone else will hire you to build theirs.",
		author: "Farrah Gray"
	},
	{
		text: "The best revenge is massive success.",
		author: "Frank Sinatra"
	},
	{
		text: "I have not failed. I've just found 10,000 ways that won't work.",
		author: "Thomas Edison"
	},
	{
		text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
		author: "Winston Churchill"
	},
	{
		text: "Believe you can and you're halfway there.",
		author: "Theodore Roosevelt"
	},
	{
		text: "You miss 100% of the shots you don't take.",
		author: "Wayne Gretzky"
	},
	{
		text: "It does not matter how slowly you go as long as you do not stop.",
		author: "Confucius"
	},
	{
		text: "The way to get started is to quit talking and begin doing.",
		author: "Walt Disney"
	},
	{
		text: "Everything you can imagine is real.",
		author: "Pablo Picasso"
	},
	{
		text: "The only impossible journey is the one you never begin.",
		author: "Tony Robbins"
	},
	{
		text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
		author: "Ralph Waldo Emerson"
	},
	{
		text: "Everything has beauty, but not everyone sees it.",
		author: "Confucius"
	},
	{
		text: "It always seems impossible until it's done.",
		author: "Nelson Mandela"
	},
	{
		text: "Success is not the key to happiness. Happiness is the key to success.",
		author: "Albert Schweitzer"
	},
	{
		text: "The only limit to our realization of tomorrow will be our doubts of today.",
		author: "Franklin D. Roosevelt"
	},
	{
		text: "What you get by achieving your goals is not as important as what you become by achieving your goals.",
		author: "Zig Ziglar"
	},
	{
		text: "Innovation is the calling card of the future.",
		author: "Nancy Gibbs"
	},
	{
		text: "The way to get started is to quit talking and begin doing.",
		author: "Walt Disney"
	},
	{
		text: "Hardships often prepare ordinary people for an extraordinary destiny.",
		author: "C.S. Lewis"
	},
	{
		text: "The only limit is your imagination.",
		author: "unknown"
	},
	{
		text: "Productivity is never an accident. It is always the result of a commitment to excellence.",
		author: "Paul J. Meyer"
	},
	{
		text: "Work hard, stay humble.",
		author: "unknown"
	},
	{
		text: "Create with the heart; build with the mind.",
		author: "Crazy Wisdom"
	},
	{
		text: "Done is better than perfect.",
		author: "Sheryl Sandberg"
	},
	{
		text: "Move fast and break things.",
		author: "Mark Zuckerberg"
	},
	{
		text: "Ship early, ship often.",
		author: "Reid Hoffman"
	},
	{
		text: "Stay focused and keep shipping.",
		author: "Marc Benioff"
	},
	{
		text: "Think big, start small, act now.",
		author: "Robin Sharma"
	},
	{
		text: "The best time to start was yesterday. The next best time is now.",
		author: "unknown"
	},
	{
		text: "Code is poetry.",
		author: "WordPress"
	},
	{
		text: "First, solve the problem. Then, write the code.",
		author: "John Johnson"
	},
	{
		text: "Programs must be written for people to read, and only incidentally for machines to execute.",
		author: "Harold Abelson"
	},
	{
		text: "The most dangerous phrase in the language is, we've always done it this way.",
		author: "Grace Hopper"
	},
	{
		text: "The advance of technology is based on making it fit in so that you don't really even notice it.",
		author: "Bill Gates"
	},
	{
		text: "The technology you use impresses no one. The experience you create with it does.",
		author: "Dustin Curtis"
	},
	{
		text: "We're going to make products that people want to buy.",
		author: "Steve Jobs"
	},
	{
		text: "Creativity is thinking up new things. Innovation is doing new things.",
		author: "Theodore Levitt"
	},
	{
		text: "The entrepreneur always searches for change, responds to it, and exploits it as an opportunity.",
		author: "Peter Drucker"
	},
	{
		text: "Startup = Growth. A startup is a company designed to grow fast.",
		author: "Paul Graham"
	},
	{
		text: "Having a superpower is useless if you can't convince the world of your vision.",
		author: "Sam Altman"
	},
	{
		text: "The most successful people are those who are good at Plan B.",
		author: "unknown"
	},
	{
		text: "Ideas are easy. Implementation is hard.",
		author: "Guy Kawasaki"
	},
	{
		text: "The best marketing doesn't feel like marketing.",
		author: "Tom Fishburne"
	},
	{
		text: "Simplicity is the soul of efficiency.",
		author: "Austin Freeman"
	},
	{
		text: "Discipline is choosing between what you want now and what you want most.",
		author: "Abraham Lincoln"
	},
	{
		text: "Focus is a matter of deciding what things you're not going to do.",
		author: "John Carmack"
	},
	{
		text: "The quieter you become, the more you can hear.",
		author: "Ram Dass"
	},
	{
		text: "Make it work, make it right, make it fast.",
		author: "Kent Beck"
	},
	{
		text: "Small daily improvements are the key to staggering long-term results.",
		author: "unknown"
	},
	{
		text: "Patience is a form of action.",
		author: "Auguste Rodin"
	},
	{
		text: "Do the hard thing while it is still easy.",
		author: "Lao Tzu"
	},
	{
		text: "Craft is what remains when the hype fades.",
		author: "unknown"
	},
	{
		text: "A calm mind writes better code.",
		author: "unknown"
	},
	{
		text: "Every line you delete is a line you never have to debug.",
		author: "unknown"
	},
	{
		text: "The best way out is always through.",
		author: "Robert Frost"
	},
	{
		text: "Amateurs wait for inspiration; the rest of us just get up and go to work.",
		author: "Stephen King"
	},
	{
		text: "Deep work is the ability to focus without distraction on a cognitively demanding task.",
		author: "Cal Newport"
	},
	{
		text: "You don't have to be great to start, but you have to start to be great.",
		author: "Zig Ziglar"
	},
	{
		text: "When you want to succeed as bad as you want to breathe, then you'll be successful.",
		author: "Eric Thomas"
	},
	{
		text: "The difference between a master and a beginner is that the master has failed more times than the beginner has tried.",
		author: "Stephen McCracken"
	},
	{
		text: "If you're not embarrassed by the first version of your product, you've launched too late.",
		author: "Reid Hoffman"
	},
	{
		text: "Move fast. Speed is the most important element in building a great company.",
		author: "Elon Musk"
	},
	{
		text: "The way to get started is to quit talking and begin doing.",
		author: "Walt Disney"
	},
	{
		text: "Don't be intimidated by what you don't know. That can be your greatest strength.",
		author: "Sara Blakely"
	},
	{
		text: "Entrepreneurship is living a few years of your life like most people won't, so you can spend the rest like most people can't.",
		author: "Warren Tracy"
	},
	{
		text: "If people are doubting how far you can go, go so far that you can't hear them anymore.",
		author: "Michele Ruiz"
	},
	{
		text: "Success usually comes to those who are too busy to be looking for it.",
		author: "Henry David Thoreau"
	},
	{
		text: "The only way to learn is to do.",
		author: "unknown"
	},
	{
		text: "Start where you are. Use what you have. Do what you can.",
		author: "Arthur Ashe"
	},
	{
		text: "Excellence is not a destination but a continuous journey.",
		author: "unknown"
	},
	{
		text: "Build things that matter to you. The best companies solve their own problems first.",
		author: "Sam Altman"
	},
	{
		text: "Stay hungry, stay foolish. Keep building.",
		author: "unknown"
	},
	{
		text: "Hustle beats talent when talent doesn't hustle.",
		author: "unknown"
	},
	{
		text: "The best investment you can make is in yourself.",
		author: "Warren Buffett"
	},
	{
		text: "Work like there is someone working 24 hours a day to take it all away from you.",
		author: "Mark Cuban"
	},
	{
		text: "Talent wins games, but teamwork and intelligence win championships.",
		author: "Michael Jordan"
	},
	{
		text: "In a world where you can be anything, be kind.",
		author: "unknown"
	},
	{
		text: "Choose a job you love, and you will never have to work a day in your life.",
		author: "Confucius"
	},
	{
		text: "Be yourself; everyone else is already taken.",
		author: "Oscar Wilde"
	},
	{
		text: "What we think, we become.",
		author: "Buddha"
	},
	{
		text: "The mind is everything. What you think, you become.",
		author: "Buddha"
	},
	{
		text: "It is during our darkest moments that we must focus to see the light.",
		author: "Aristotle"
	},
	{
		text: "Happiness is not something ready-made. It comes from your own actions.",
		author: "Dalai Lama"
	},
	{
		text: "In the middle of every difficulty lies opportunity.",
		author: "Albert Einstein"
	},
	{
		text: "Imagination is more important than knowledge.",
		author: "Albert Einstein"
	},
	{
		text: "The true sign of intelligence is not knowledge but imagination.",
		author: "Albert Einstein"
	},
	{
		text: "We cannot solve our problems with the same thinking we used when we created them.",
		author: "Albert Einstein"
	},
	{
		text: "Strive not to be a success, but rather to be of value.",
		author: "Albert Einstein"
	},
	{
		text: "The only source of knowledge is experience.",
		author: "Albert Einstein"
	},
	{
		text: "Never give up on what you really want to do.",
		author: "Albert Einstein"
	},
	{
		text: "A ship is always safe at the shore, but that is not what it's built for.",
		author: "Albert Einstein"
	},
	{
		text: "The best way to cheer yourself up is to cheer somebody else up.",
		author: "Mark Twain"
	},
	{
		text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
		author: "Albert Einstein"
	},
	{
		text: "Life is like riding a bicycle. To keep your balance, you must keep moving.",
		author: "Albert Einstein"
	},
	{
		text: "The important thing is not to stop questioning.",
		author: "Albert Einstein"
	},
	{
		text: "A person who never made a mistake never tried anything new.",
		author: "Albert Einstein"
	},
	{
		text: "Education is the most powerful weapon which you can use to change the world.",
		author: "Nelson Mandela"
	},
	{
		text: "May you live all the days of your life.",
		author: "Jonathan Swift"
	},
	{
		text: "Be the change that you wish to see in the world.",
		author: "Mahatma Gandhi"
	},
	{
		text: "Simplicity is the keynote of all true elegance.",
		author: "Coco Chanel"
	},
	{
		text: "The only thing we have to fear is fear itself.",
		author: "Franklin D. Roosevelt"
	},
	{
		text: "Stay hungry. Stay foolish.",
		author: "The Whole Earth Catalog"
	}
];
function randomQuote(exclude) {
	let q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
	if (QUOTES.length > 1) while (q.text === exclude?.text) q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
	return q;
}
function greeting(hour) {
	if (hour >= 5 && hour < 12) return "Good morning.";
	if (hour >= 12 && hour < 17) return "Good afternoon.";
	return "Good evening.";
}
var PLAYLIST_ID = "PLubzk6WJ4BESzbg0AuzpHaCfSVgmepEIh";
var STORAGE_KEY = "lmt-playback";
var PLAYLIST_VERSION_KEY = "lmt-playlist-id";
function waitForApi(timeoutMs = 1e4) {
	return new Promise((resolve, reject) => {
		if (window.YT?.Player) {
			console.log("[YT] API already loaded");
			return resolve();
		}
		const timer = setTimeout(() => {
			console.error("[YT] API load timed out after", timeoutMs, "ms");
			reject(/* @__PURE__ */ new Error("YouTube IFrame API failed to load"));
		}, timeoutMs);
		const prev = window.onYouTubeIframeAPIReady;
		window.onYouTubeIframeAPIReady = () => {
			clearTimeout(timer);
			console.log("[YT] API ready via callback");
			prev?.();
			resolve();
		};
		if (!document.querySelector("script[src*=\"iframe_api\"]")) {
			console.log("[YT] Injecting iframe_api script");
			const s = document.createElement("script");
			s.src = "https://www.youtube.com/iframe_api";
			s.onerror = () => {
				clearTimeout(timer);
				console.error("[YT] Failed to load iframe_api script");
				reject(/* @__PURE__ */ new Error("Failed to load YouTube IFrame API script"));
			};
			document.head.appendChild(s);
		}
	});
}
function savePlaybackState(state) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {}
}
function loadPlaybackState() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function useYouTubePlayer(containerId) {
	const playerRef = (0, import_react.useRef)(null);
	const seekingRef = (0, import_react.useRef)(false);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [author, setAuthor] = (0, import_react.useState)("");
	const [videoId, setVideoId] = (0, import_react.useState)("");
	const [current, setCurrent] = (0, import_react.useState)(0);
	const [duration, setDuration] = (0, import_react.useState)(0);
	const [currentIndex, setCurrentIndex] = (0, import_react.useState)(0);
	const restoredRef = (0, import_react.useRef)(false);
	const saveTimerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		try {
			if (localStorage.getItem(PLAYLIST_VERSION_KEY) !== "PLubzk6WJ4BESzbg0AuzpHaCfSVgmepEIh") {
				localStorage.removeItem(STORAGE_KEY);
				localStorage.setItem(PLAYLIST_VERSION_KEY, PLAYLIST_ID);
			}
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		if (playing && ready) saveTimerRef.current = setInterval(() => {
			const p = playerRef.current;
			if (!p?.getCurrentTime) return;
			const idx = p.getPlaylistIndex?.() ?? 0;
			const vid = p.getVideoData?.()?.video_id ?? "";
			savePlaybackState({
				videoIndex: idx,
				timestamp: p.getCurrentTime(),
				videoId: vid
			});
		}, 5e3);
		return () => {
			if (saveTimerRef.current) clearInterval(saveTimerRef.current);
		};
	}, [playing, ready]);
	(0, import_react.useEffect)(() => {
		const handleUnload = () => {
			const p = playerRef.current;
			if (!p?.getCurrentTime) return;
			const idx = p.getPlaylistIndex?.() ?? 0;
			const vid = p.getVideoData?.()?.video_id ?? "";
			savePlaybackState({
				videoIndex: idx,
				timestamp: p.getCurrentTime(),
				videoId: vid
			});
		};
		window.addEventListener("beforeunload", handleUnload);
		return () => window.removeEventListener("beforeunload", handleUnload);
	}, []);
	(0, import_react.useEffect)(() => {
		let destroyed = false;
		console.log("[YT] Effect mounted, container:", containerId);
		waitForApi().then(() => {
			if (destroyed) {
				console.log("[YT] Destroyed before API ready");
				return;
			}
			const el = document.getElementById(containerId);
			console.log("[YT] Container element:", el ? "found" : "MISSING");
			if (!el) return;
			try {
				console.log("[YT] Creating player...");
				playerRef.current = new window.YT.Player(containerId, {
					height: "270",
					width: "480",
					playerVars: {
						listType: "playlist",
						list: PLAYLIST_ID,
						controls: 0,
						disablekb: 1,
						playsinline: 1,
						modestbranding: 1,
						rel: 0
					},
					events: {
						onReady: () => {
							if (destroyed) return;
							console.log("[YT] Player onReady, playlist:", playerRef.current?.getPlaylist?.()?.length, "videos");
							setReady(true);
							const d = playerRef.current?.getVideoData?.();
							if (d) {
								setTitle(d.title ?? "");
								setAuthor(d.author ?? "");
								setVideoId(d.video_id ?? "");
							}
							setDuration(playerRef.current?.getDuration?.() ?? 0);
							setCurrentIndex(playerRef.current?.getPlaylistIndex?.() ?? 0);
							if (!restoredRef.current) {
								restoredRef.current = true;
								const saved = loadPlaybackState();
								if (saved && saved.videoId) {
									const playlist = playerRef.current?.getPlaylist?.();
									if (playlist && playlist.length > 0) {
										const idx = Math.min(saved.videoIndex, playlist.length - 1);
										playerRef.current.playVideoAt(idx);
										playerRef.current.pauseVideo();
										setTimeout(() => {
											if (playerRef.current?.seekTo && saved.timestamp > 0) playerRef.current.seekTo(saved.timestamp, true);
										}, 500);
									}
								}
							}
						},
						onStateChange: (e) => {
							if (destroyed) return;
							setPlaying(e.data === 1);
							const d = playerRef.current?.getVideoData?.();
							if (d) {
								setTitle(d.title ?? "");
								setAuthor(d.author ?? "");
								setVideoId(d.video_id ?? "");
							}
							setDuration(playerRef.current?.getDuration?.() ?? 0);
							setCurrentIndex(playerRef.current?.getPlaylistIndex?.() ?? 0);
							if (e.data === 0) {
								if ((playerRef.current?.getPlaylistIndex?.() ?? 0) >= (playerRef.current?.getPlaylist?.() ?? []).length - 1) playerRef.current?.playVideoAt?.(0);
							}
							if (e.data === 1 || e.data === 0) {
								const idx = playerRef.current?.getPlaylistIndex?.() ?? 0;
								const vid = d?.video_id ?? "";
								savePlaybackState({
									videoIndex: idx,
									timestamp: playerRef.current?.getCurrentTime?.() ?? 0,
									videoId: vid
								});
							}
						},
						onError: (e) => {
							if (destroyed) return;
							console.error("[YT Player] Error:", e.data);
						}
					}
				});
			} catch (err) {
				if (!destroyed) console.error("[YT Player] Failed to create:", err);
			}
		}).catch((err) => {
			console.error("[YT] waitForApi rejected:", err.message);
		});
		return () => {
			destroyed = true;
			try {
				playerRef.current?.destroy?.();
			} catch {}
		};
	}, [containerId]);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => {
			const p = playerRef.current;
			if (!p?.getCurrentTime) return;
			if (!seekingRef.current) setCurrent(p.getCurrentTime() ?? 0);
			setDuration(p.getDuration?.() ?? 0);
			const d = p.getVideoData?.();
			if (d?.title) {
				setTitle(d.title);
				setAuthor(d.author ?? "");
				setVideoId(d.video_id ?? "");
			}
		}, 1e3);
		return () => window.clearInterval(id);
	}, []);
	const play = (0, import_react.useCallback)(() => playerRef.current?.playVideo?.(), []);
	const pause = (0, import_react.useCallback)(() => playerRef.current?.pauseVideo?.(), []);
	return {
		ready,
		playing,
		title,
		author,
		videoId,
		current,
		duration,
		currentIndex,
		play,
		pause,
		toggle: (0, import_react.useCallback)(() => playing ? pause() : play(), [
			playing,
			play,
			pause
		]),
		next: (0, import_react.useCallback)(() => playerRef.current?.nextVideo?.(), []),
		prev: (0, import_react.useCallback)(() => playerRef.current?.previousVideo?.(), []),
		startSeek: (0, import_react.useCallback)(() => {
			seekingRef.current = true;
		}, []),
		scrub: (0, import_react.useCallback)((t) => setCurrent(t), []),
		commitSeek: (0, import_react.useCallback)((t) => {
			playerRef.current?.seekTo?.(t, true);
			seekingRef.current = false;
		}, []),
		setVolumeUnmute: (0, import_react.useCallback)(() => {
			playerRef.current?.unMute?.();
			playerRef.current?.setVolume?.(60);
		}, [])
	};
}
function fmt(sec) {
	if (!Number.isFinite(sec) || sec < 0) sec = 0;
	return `${Math.floor(sec / 60)}:${Math.floor(sec % 60).toString().padStart(2, "0")}`;
}
var OVERLAYS = {
	"day-clear": {
		filter: "brightness(1.05) saturate(1.1)",
		overlay: "linear-gradient(180deg, oklch(0.9 0.05 75 / 0.03), oklch(0.9 0.03 250 / 0.03))"
	},
	"day-cloudy": {
		filter: "brightness(1.0) saturate(0.95)",
		overlay: "linear-gradient(180deg, oklch(0.85 0.02 250 / 0.04), oklch(0.85 0.02 250 / 0.04))"
	},
	"day-rain": {
		filter: "brightness(0.95) saturate(0.9)",
		overlay: "linear-gradient(180deg, oklch(0.7 0.05 250 / 0.06), oklch(0.7 0.05 255 / 0.06))"
	},
	"night-clear": {
		filter: "brightness(0.85) saturate(1.0)",
		overlay: "linear-gradient(180deg, oklch(0.5 0.07 275 / 0.08), oklch(0.5 0.06 265 / 0.08))"
	},
	"night-cloudy": {
		filter: "brightness(0.8) saturate(0.85)",
		overlay: "linear-gradient(180deg, oklch(0.45 0.03 250 / 0.1), oklch(0.45 0.02 250 / 0.1))"
	},
	"night-rain": {
		filter: "brightness(0.75) saturate(0.9)",
		overlay: "linear-gradient(180deg, oklch(0.4 0.06 255 / 0.1), oklch(0.4 0.05 260 / 0.1))"
	}
};
function WeatherIcon({ sky, isNight }) {
	const cls = "h-5 w-5";
	if (sky === "rain") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudRain, { className: cls });
	if (sky === "cloudy") return isNight ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudMoon, { className: cls }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: cls });
	return isNight ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: cls }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: cls });
}
function LetMeThink() {
	const amb = useAmbience();
	const player = useYouTubePlayer("lmt-yt-player");
	const [unmuted, setUnmuted] = (0, import_react.useState)(false);
	const [clock, setClock] = (0, import_react.useState)("");
	const [period, setPeriod] = (0, import_react.useState)("");
	const [hello, setHello] = (0, import_react.useState)("");
	const [quote, setQuote] = (0, import_react.useState)(null);
	const [use24h, setUse24h] = (0, import_react.useState)(() => {
		try {
			return localStorage.getItem("lmt-use24h") === "true";
		} catch {
			return false;
		}
	});
	const [showQuotes, setShowQuotes] = (0, import_react.useState)(() => {
		try {
			return localStorage.getItem("lmt-show-quotes") === "true";
		} catch {
			return false;
		}
	});
	const [showTime, setShowTime] = (0, import_react.useState)(() => {
		try {
			return localStorage.getItem("lmt-show-time") !== "false";
		} catch {
			return true;
		}
	});
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const settingsRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem("lmt-use24h", String(use24h));
		} catch {}
	}, [use24h]);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem("lmt-show-quotes", String(showQuotes));
		} catch {}
	}, [showQuotes]);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem("lmt-show-time", String(showTime));
		} catch {}
	}, [showTime]);
	(0, import_react.useEffect)(() => {
		if (!settingsOpen) return;
		const handleClick = (e) => {
			if (settingsRef.current && !settingsRef.current.contains(e.target)) setSettingsOpen(false);
		};
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [settingsOpen]);
	(0, import_react.useEffect)(() => {
		setQuote(randomQuote());
		const id = window.setInterval(() => setQuote((q) => randomQuote(q ?? void 0)), 6e5);
		return () => window.clearInterval(id);
	}, []);
	(0, import_react.useEffect)(() => {
		const tick = () => {
			const now = /* @__PURE__ */ new Date();
			if (use24h) {
				setClock(now.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
					hour12: false
				}));
				setPeriod("");
			} else {
				const full = now.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
					hour12: true
				});
				const parts = full.split(" ");
				setClock(parts[0] ?? full);
				setPeriod(parts[1] ?? "");
			}
			setHello(greeting(now.getHours()));
		};
		tick();
		const id = window.setInterval(tick, 1e3);
		return () => window.clearInterval(id);
	}, [use24h]);
	const look = OVERLAYS[`${amb.isNight ? "night" : "day"}-${amb.sky}`] ?? OVERLAYS["day-clear"];
	const thumb = player.videoId ? `https://i.ytimg.com/vi/${player.videoId}/hqdefault.jpg` : void 0;
	const handleToggle = () => {
		if (!unmuted) {
			player.setVolumeUnmute();
			setUnmuted(true);
		}
		player.toggle();
	};
	const place = [
		amb.city,
		amb.region,
		amb.country
	].filter(Boolean).join(", ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-screen w-full overflow-hidden bg-black",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: lofi_desk_default,
				alt: "Lofi coding desk beside a window overlooking a quiet city",
				width: 1920,
				height: 1088,
				className: "ambient-fade absolute inset-0 h-full w-full object-cover",
				style: { filter: look.filter }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ambient-fade absolute inset-0",
				style: { background: look.overlay }
			}),
			amb.sky === "rain" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RainLayer, {}),
			amb.isNight && amb.sky === "clear" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarsLayer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed bottom-0 left-0 z-[-1] h-[1px] w-[1px] overflow-hidden opacity-[0.01]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { id: "lmt-yt-player" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed bottom-3 left-3 z-50 rounded-md bg-black/70 px-2 py-1 text-[10px] text-white/70 backdrop-blur-sm",
				children: [
					"YT: ",
					player.ready ? player.playing ? "▶ Playing" : "⏸ Ready" : "⏳ Loading",
					player.title ? ` • ${player.title}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex items-start justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-legible flex items-center gap-2.5 text-white/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeatherIcon, {
						sky: amb.sky,
						isNight: amb.isNight
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xl font-light tabular-nums sm:text-2xl",
							children: amb.temp !== null ? `${amb.temp}°` : "--°"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-light tracking-wide text-white/70",
							children: amb.loading ? "locating…" : amb.city || "—"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`,
					target: "_blank",
					rel: "noopener noreferrer",
					"aria-label": "Open the playlist on YouTube Music",
					className: "shrink-0 flex items-center gap-2 rounded-full px-3 py-2 text-white/90 transition hover:text-white",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							viewBox: "0 0 24 24",
							fill: "currentColor",
							className: "h-4 w-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 5v14l11-7z" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: "YT Music"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							className: "h-3.5 w-3.5 text-white/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7 17L17 7" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7 7h10v10" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-legible relative z-10 mt-[16vh] px-6 text-center sm:mt-[20vh]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-lg font-light tracking-widest text-white/60 sm:text-xl",
						children: "Let Me Think"
					}),
					showTime && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-display mt-4 text-7xl font-semibold tracking-tight text-white tabular-nums sm:text-8xl xl:text-9xl",
						children: [clock || "--:--", period && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-xl font-light text-white/60 sm:text-2xl xl:text-3xl",
							children: period
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display mt-3 text-2xl font-medium text-white/95 sm:text-3xl xl:text-4xl",
						children: hello
					})] }),
					showQuotes && quote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-fade-in mx-auto mt-10 max-w-xl sm:mt-14",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-sm font-light italic leading-relaxed text-white/85 sm:text-base xl:text-lg",
							children: [
								"“",
								quote.text,
								"”"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display mt-2 text-xs font-normal tracking-wider text-white/55 sm:text-sm",
							children: ["— ", quote.author]
						})]
					}, quote.text)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-legible absolute bottom-5 left-5 z-10 flex items-center gap-1.5 text-[11px] font-light tracking-wide text-white/75 sm:bottom-7 sm:left-8 sm:text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "max-w-[55vw] truncate",
					children: amb.loading ? "locating…" : place || "—"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: settingsRef,
				className: "absolute bottom-5 right-5 z-20 sm:bottom-7 sm:right-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setSettingsOpen((o) => !o),
					"aria-label": "Settings",
					className: `glass rounded-full p-2.5 transition hover:text-white ${settingsOpen ? "text-white ring-1 ring-white/30" : "text-white/85"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-5 w-5" })
				}), settingsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-panel animate-fade-in absolute bottom-14 right-0 w-64 rounded-2xl p-5 sm:w-72",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 text-xs font-medium uppercase tracking-widest text-white/50",
							children: "Settings"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-white/85",
								children: "24-hour clock"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setUse24h((v) => !v),
								className: `relative h-5 w-9 rounded-full transition-colors ${use24h ? "bg-white/30" : "bg-white/15"}`,
								role: "switch",
								"aria-checked": use24h,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${use24h ? "translate-x-4" : "translate-x-0.5"}` })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-white/85",
								children: "Show time"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowTime((v) => !v),
								className: `relative h-5 w-9 rounded-full transition-colors ${showTime ? "bg-white/30" : "bg-white/15"}`,
								role: "switch",
								"aria-checked": showTime,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${showTime ? "translate-x-4" : "translate-x-0.5"}` })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-white/85",
								children: "Show quotes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowQuotes((v) => !v),
								className: `relative h-5 w-9 rounded-full transition-colors ${showQuotes ? "bg-white/30" : "bg-white/15"}`,
								role: "switch",
								"aria-checked": showQuotes,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${showQuotes ? "translate-x-4" : "translate-x-0.5"}` })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-3 h-px bg-white/10" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-white/70",
								children: ["Built by ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display font-medium text-white/90",
									children: "Champ96k"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "https://x.com/champ_96k",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "text-white/45 transition hover:text-white/85",
									children: "X"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "https://www.linkedin.com/in/tushar-nikam-dev/",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "text-white/45 transition hover:text-white/85",
									children: "LinkedIn"
								})]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-x-0 bottom-0 z-10 flex justify-center px-4 pb-14 sm:pb-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass flex w-full max-w-xl items-center gap-4 rounded-full py-3 pl-3 pr-4 sm:py-3.5 sm:pl-3.5 sm:pr-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-white/25 sm:h-16 sm:w-16 ${player.playing ? "spin-slow" : ""}`,
							children: [thumb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: thumb,
								alt: "",
								className: "h-full w-full scale-[1.35] object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-white/15" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 m-auto h-2.5 w-2.5 rounded-full bg-black/60" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-medium text-white sm:text-base",
									children: player.title || (player.ready ? "Loading track…" : "Let Me Think")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 truncate text-xs font-light text-white/65",
									children: player.author || "lofi beats for building things quietly"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 0,
									max: Math.max(player.duration, 1),
									step: 1,
									value: Math.min(player.current, player.duration || 1),
									"aria-label": "Seek",
									onMouseDown: player.startSeek,
									onTouchStart: player.startSeek,
									onChange: (e) => {
										player.startSeek();
										player.scrub(Number(e.target.value));
									},
									onMouseUp: (e) => player.commitSeek(Number(e.currentTarget.value)),
									onTouchEnd: (e) => player.commitSeek(Number(e.currentTarget.value)),
									onKeyUp: (e) => player.commitSeek(Number(e.currentTarget.value)),
									className: "seek-range mt-2 w-full"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-[11px] font-light tabular-nums text-white/60",
									children: [
										fmt(player.current),
										" / ",
										fmt(player.duration)
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-2 sm:gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: player.prev,
									"aria-label": "Previous track",
									className: "rounded-full p-1.5 text-white/70 transition hover:text-white",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipBack, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleToggle,
									disabled: !player.ready,
									"aria-label": player.playing ? "Pause" : "Play",
									className: "rounded-full bg-white/90 p-3 text-neutral-900 transition hover:bg-white disabled:opacity-50",
									children: player.playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: player.next,
									"aria-label": "Next track",
									className: "rounded-full p-1.5 text-white/70 transition hover:text-white",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "h-4 w-4" })
								})
							]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { LetMeThink as component };
