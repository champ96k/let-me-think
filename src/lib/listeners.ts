export type Listener = {
  city: string;
  country: string;
  lat: number;
  lng: number;
};

export const listeners: Listener[] = [
  // India — 10
  { city: "Bangalore", country: "India", lat: 12.9716, lng: 77.5946 },
  { city: "Mumbai", country: "India", lat: 19.076, lng: 72.8777 },
  { city: "Delhi", country: "India", lat: 28.7041, lng: 77.1025 },
  { city: "Pune", country: "India", lat: 18.5204, lng: 73.8567 },
  { city: "Hyderabad", country: "India", lat: 17.385, lng: 78.4867 },
  { city: "Chennai", country: "India", lat: 13.0827, lng: 80.2707 },
  { city: "Kolkata", country: "India", lat: 22.5726, lng: 88.3639 },
  { city: "Ahmedabad", country: "India", lat: 23.0225, lng: 72.5714 },
  { city: "Jaipur", country: "India", lat: 26.9124, lng: 75.7873 },
  { city: "Nashik", country: "India", lat: 19.9975, lng: 73.7898 },

  // North America — 8
  { city: "New York", country: "USA", lat: 40.7128, lng: -74.006 },
  { city: "San Francisco", country: "USA", lat: 37.7749, lng: -122.4194 },
  { city: "Chicago", country: "USA", lat: 41.8781, lng: -87.6298 },
  { city: "Denver", country: "USA", lat: 39.7392, lng: -104.9903 },
  { city: "Seattle", country: "USA", lat: 47.6062, lng: -122.3321 },
  { city: "Austin", country: "USA", lat: 30.2672, lng: -97.7431 },
  { city: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832 },
  { city: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207 },

  // Latin America — 5
  { city: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332 },
  { city: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333 },
  { city: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816 },
  { city: "Bogotá", country: "Colombia", lat: 4.711, lng: -74.0721 },
  { city: "Medellín", country: "Colombia", lat: 6.2476, lng: -75.5658 },

  // Europe — 16
  { city: "London", country: "UK", lat: 51.5074, lng: -0.1278 },
  { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { city: "Berlin", country: "Germany", lat: 52.52, lng: 13.405 },
  { city: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041 },
  { city: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038 },
  { city: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393 },
  { city: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
  { city: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738 },
  { city: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378 },
  { city: "Warsaw", country: "Poland", lat: 52.2297, lng: 21.0122 },
  { city: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686 },
  { city: "Helsinki", country: "Finland", lat: 60.1699, lng: 24.9384 },
  { city: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603 },
  { city: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683 },
  { city: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417 },
  { city: "Barcelona", country: "Spain", lat: 41.3874, lng: 2.1686 },

  // Middle East — 3
  { city: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
  { city: "Tel Aviv", country: "Israel", lat: 32.0853, lng: 34.7818 },
  { city: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784 },

  // Africa — 4
  { city: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357 },
  { city: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219 },
  { city: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792 },
  { city: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241 },

  // Asia — 10
  { city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
  { city: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018 },
  { city: "Kuala Lumpur", country: "Malaysia", lat: 3.139, lng: 101.6869 },
  { city: "Jakarta", country: "Indonesia", lat: -6.2088, lng: 106.8456 },
  { city: "Ho Chi Minh City", country: "Vietnam", lat: 10.8231, lng: 106.6297 },
  { city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { city: "Osaka", country: "Japan", lat: 34.6937, lng: 135.5023 },
  { city: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.978 },
  { city: "Shenzhen", country: "China", lat: 22.5431, lng: 114.0579 },
  { city: "Taipei", country: "Taiwan", lat: 25.033, lng: 121.5654 },

  // Oceania — 3
  { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
  { city: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631 },
  { city: "Auckland", country: "New Zealand", lat: -36.8485, lng: 174.7633 },

  // Russia — 1
  { city: "Moscow", country: "Russia", lat: 55.7558, lng: 37.6173 },
];
