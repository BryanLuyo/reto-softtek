import { SwapiService } from '../domain/repositories/SwapiService';
import { StarWarsCharacter } from '../domain/entities/FusedData';

export class SwapiApi implements SwapiService {
  private baseUrl = 'https://swapi.dev/api';

  async fetchCharacter(id: string): Promise<StarWarsCharacter> {
    const res = await fetch(`${this.baseUrl}/people/${id}`);
    if (!res.ok) {
      throw new Error('SWAPI request failed');
    }
    const data = await res.json();
    return {
      id,
      name: data.name,
      height: data.height,
      mass: data.mass,
      gender: data.gender
    };
  }
}
