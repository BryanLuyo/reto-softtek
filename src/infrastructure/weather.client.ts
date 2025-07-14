import axios from "axios";

const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;
const OPEN_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

export class WeatherClient {
  async getWeatherByCity(city: string = 'London'): Promise<any> {
    try {
      const response = await axios.get(OPEN_WEATHER_URL, {
        params: {
          q: city,
          appid: OPEN_WEATHER_API_KEY,
          units: 'metric'
        }
      });
      
      return {
        temperature: response.data.main.temp,
        conditions: response.data.weather[0].description,
        city: response.data.name
      };
      
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }
}