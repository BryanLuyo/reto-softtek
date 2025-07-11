import { FusedDataRepository } from '../domain/repositories/FusedDataRepository';
import { SwapiService } from '../domain/repositories/SwapiService';
import { WeatherService } from '../domain/repositories/WeatherService';
import { FusedData } from '../domain/entities/FusedData';
import { Cache } from '../infrastructure/cache/MemoryCache';

export class FuseDataUseCase {
  constructor(
    private swapi: SwapiService,
    private weather: WeatherService,
    private repo: FusedDataRepository,
    private cache?: Cache<FusedData>
  ) {}

  async execute(characterId: string, location: string): Promise<FusedData> {
    const key = `${characterId}-${location}`;
    const cached = this.cache?.get(key);
    if (cached) {
      return cached;
    }

    const character = await this.swapi.fetchCharacter(characterId);
    const weather = await this.weather.fetchWeather(location);
    const fused: FusedData = {
      character,
      weather,
      timestamp: Date.now()
    };

    this.cache?.set(key, fused, 30 * 60 * 1000); // 30 minutes
    await this.repo.save(fused);
    return fused;
  }
}
