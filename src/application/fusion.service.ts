import { SwapiClient } from '../infrastructure/swapi.client';
import { WeatherClient } from '../infrastructure/weather.client';
import { DatabaseRepository } from '../infrastructure/database';
import { CustomData, FusionData, StarWarsData, WeatherData } from '../domain/models';
import { v4 as uuidv4 } from 'uuid';

export class FusionService {
  constructor(
    private swapiClient: SwapiClient,
    private weatherClient: WeatherClient,
    private dbRepository: DatabaseRepository
  ) {}

  async getFusionData(city?: string): Promise<FusionData> {
    // Generar una clave de caché basada en la ciudad
    const cacheKey = city || 'default';
    
    // Intentar obtener datos del caché
    const cachedData = await this.dbRepository.getCachedFusionData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Obtener datos de SWAPI
    const character = await this.swapiClient.getRandomCharacter();
    const homeworld = await this.swapiClient.getPlanet(character.homeworld);
    const films = await Promise.all(
      character.films.slice(0, 3).map((filmUrl: string) => this.swapiClient.getFilm(filmUrl))
    );

    const starWarsData: StarWarsData = {
      name: character.name,
      height: character.height,
      mass: character.mass,
      homeworld,
      films
    };

    // Obtener datos meteorológicos
    const weatherData = await this.weatherClient.getWeatherByCity(city);

    // Crear objeto fusionado
    const fusionData: FusionData = {
      id: uuidv4(),
      starWars: starWarsData,
      weather: weatherData,
      timestamp: new Date().toISOString()
    };

    // Guardar en base de datos y caché
    await this.dbRepository.saveFusionData(fusionData);
    await this.dbRepository.cacheFusionData(cacheKey, fusionData);

    return fusionData;
  }

  async saveCustomData(userNote: string, rating: number): Promise<CustomData> {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    if (userNote.length > 500) {
      throw new Error('User note must be less than 500 characters');
    }

    const customData: CustomData = {
      id: uuidv4(),
      userNote,
      rating,
      createdAt: new Date().toISOString()
    };

    await this.dbRepository.saveCustomData(customData);
    return customData;
  }

  async getFusionHistory(limit: number, lastEvaluatedKey?: any) {
    return this.dbRepository.getFusionHistory(limit, lastEvaluatedKey);
  }

  async getCustomDataHistory(limit: number, lastEvaluatedKey?: any) {
    return this.dbRepository.getCustomDataHistory(limit, lastEvaluatedKey);
  }
}