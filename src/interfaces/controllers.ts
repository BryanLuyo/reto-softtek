import { Request, Response } from 'express';
import { FusionService } from '../application/fusion.service';

export class FusionController {
  constructor(private fusionService: FusionService) {}

  async getFusionData(req: Request, res: Response) {
    try {
      const city = req.query.city as string | undefined;
      const data = await this.fusionService.getFusionData(city);
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch fusion data' });
    }
  }

  async saveCustomData(req: Request, res: Response) {
    try {
      const { userNote, rating } = req.body;
      
      if (!userNote || rating === undefined) {
        return res.status(400).json({ error: 'userNote and rating are required' });
      }

      const data = await this.fusionService.saveCustomData(userNote, rating);
      res.status(201).json(data);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  async getFusionHistory(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const lastKey = req.query.lastKey ? JSON.parse(decodeURIComponent(req.query.lastKey as string)) : undefined;
      
      const result = await this.fusionService.getFusionHistory(limit, lastKey);
      
      res.json({
        items: result.items,
        lastKey: result.lastKey ? encodeURIComponent(JSON.stringify(result.lastKey)) : null
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch fusion history' });
    }
  }

  async getCustomDataHistory(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const lastKey = req.query.lastKey ? JSON.parse(decodeURIComponent(req.query.lastKey as string)) : undefined;
      
      const result = await this.fusionService.getCustomDataHistory(limit, lastKey);
      
      res.json({
        items: result.items,
        lastKey: result.lastKey ? encodeURIComponent(JSON.stringify(result.lastKey)) : null
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch custom data history' });
    }
  }
}