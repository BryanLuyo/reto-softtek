import { FusedData } from '../domain/entities/FusedData';
import { FusedDataRepository } from '../domain/repositories/FusedDataRepository';

export class MemoryFusedDataRepository implements FusedDataRepository {
  private store: FusedData[] = [];

  async save(data: FusedData): Promise<void> {
    this.store.push(data);
  }

  async getHistory(limit: number, offset: number): Promise<FusedData[]> {
    return this.store.slice(offset, offset + limit);
  }
}
