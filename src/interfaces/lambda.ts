import { FuseDataUseCase } from '../application/FuseDataUseCase';
import { SwapiApi } from '../infrastructure/SwapiApi';
import { WeatherApi } from '../infrastructure/WeatherApi';
import { MemoryFusedDataRepository } from '../infrastructure/MemoryFusedDataRepository';
import { MemoryCache } from '../infrastructure/cache/MemoryCache';
import { FusedData } from '../domain/entities/FusedData';

const swapi = new SwapiApi();
const weather = new WeatherApi();
const repo = new MemoryFusedDataRepository();
const cache = new MemoryCache<FusedData>();
const useCase = new FuseDataUseCase(swapi, weather, repo, cache);

export const handler = async (event: any) => {
  const method = event.httpMethod || 'GET';
  const path = event.path || '/fusionados';

  try {
    if (method === 'GET' && path === '/fusionados') {
      const characterId = event.queryStringParameters?.id || '1';
      const location = event.queryStringParameters?.location || '0,0';
      const result = await useCase.execute(characterId, location);
      return { statusCode: 200, body: JSON.stringify(result) };
    }

    if (method === 'POST' && path === '/almacenar') {
      const data: FusedData = JSON.parse(event.body || '{}');
      await repo.save(data);
      return { statusCode: 201, body: 'stored' };
    }

    if (method === 'GET' && path === '/historial') {
      const limit = parseInt(event.queryStringParameters?.limit || '10', 10);
      const offset = parseInt(event.queryStringParameters?.offset || '0', 10);
      const history = await repo.getHistory(limit, offset);
      return { statusCode: 200, body: JSON.stringify(history) };
    }

    return { statusCode: 404, body: 'Not found' };
  } catch (e: any) {
    return { statusCode: 500, body: e.message };
  }
};
