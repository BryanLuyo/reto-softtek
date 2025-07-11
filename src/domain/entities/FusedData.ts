export interface StarWarsCharacter {
  id: string;
  name: string;
  height: string;
  mass: string;
  gender: string;
}

export interface WeatherInfo {
  temperature: number;
  description: string;
}

export interface FusedData {
  character: StarWarsCharacter;
  weather: WeatherInfo;
  timestamp: number;
}
