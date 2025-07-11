import { StarWarsCharacter } from '../entities/FusedData';

export interface SwapiService {
  fetchCharacter(id: string): Promise<StarWarsCharacter>;
}
