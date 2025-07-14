import axios from 'axios';

const SWAPI_BASE_URL = 'https://swapi.dev/api';

export class SwapiClient {
    
  async getRandomCharacter(): Promise<any> {
    try {
      // Obtener un personaje aleatorio (entre 1 y 82)
      const randomId = Math.floor(Math.random() * 82) + 1;
      const response = await axios.get(`${SWAPI_BASE_URL}/people/${randomId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Star Wars data:', error);
      throw new Error('Failed to fetch Star Wars character');
    }
  }

  async getPlanet(url: string): Promise<string> {
    try {
      const response = await axios.get(url);
      return response.data.name;
    } catch (error) {
      console.error('Error fetching planet data:', error);
      return 'Unknown';
    }
  }

  async getFilm(url: string): Promise<string> {
    try {
      const response = await axios.get(url);
      return response.data.title;
    } catch (error) {
      console.error('Error fetching film data:', error);
      return 'Unknown';
    }
  }

}