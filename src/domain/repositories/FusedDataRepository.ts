import { FusedData } from '../entities/FusedData';

export interface FusedDataRepository {
  save(data: FusedData): Promise<void>;
  getHistory(limit: number, offset: number): Promise<FusedData[]>;
}
