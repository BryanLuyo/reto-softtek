export interface StarWarsData {
  name: string;
  height: string;
  mass: string;
  homeworld: string;
  films: string[];
}

export interface WeatherData {
  temperature: number;
  conditions: string;
  city: string;
}

export interface FusionData {
  id: string;
  starWars: StarWarsData;
  weather: WeatherData;
  timestamp: string;
}

export interface CustomData {
  id: string;
  userNote: string;
  rating: number;
  createdAt: string;
}