import express from 'express';
import { FusionController } from './controllers';
import { SwapiClient } from '../infrastructure/swapi.client';
import { WeatherClient } from '../infrastructure/weather.client';
import { DatabaseRepository } from '../infrastructure/database';
import { FusionService } from '../application/fusion.service';

const router = express.Router();

// Inicializar dependencias
const swapiClient = new SwapiClient();
const weatherClient = new WeatherClient();
const dbRepository = new DatabaseRepository();
const fusionService = new FusionService(swapiClient, weatherClient, dbRepository);
const fusionController = new FusionController(fusionService);

// Definir rutas
router.get('/fusionados', (req, res) => fusionController.getFusionData(req, res));
router.post('/almacenar', (req, res) => fusionController.saveCustomData(req, res));
router.get('/historial/fusion', (req, res) => fusionController.getFusionHistory(req, res));
router.get('/historial/custom', (req, res) => fusionController.getCustomDataHistory(req, res));

export default router;