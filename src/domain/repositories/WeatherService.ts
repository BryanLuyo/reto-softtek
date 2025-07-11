import { WeatherInfo } from '../entities/FusedData';

export interface WeatherService {
  fetchWeather(location: string): Promise<WeatherInfo>;
}
