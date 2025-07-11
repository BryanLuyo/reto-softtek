import { WeatherService } from '../domain/repositories/WeatherService';
import { WeatherInfo } from '../domain/entities/FusedData';

export class WeatherApi implements WeatherService {
  private baseUrl = 'https://api.open-meteo.com/v1/forecast';

  async fetchWeather(location: string): Promise<WeatherInfo> {
    const url = `${this.baseUrl}?latitude=${location}&current_weather=true`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Weather API request failed');
    }
    const data = await res.json();
    return {
      temperature: data.current_weather.temperature,
      description: 'N/A'
    };
  }
}
