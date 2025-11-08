import { Router } from 'express';
import ScoringController from '../controllers/ScoringController.js';

const router = Router();

// Calcula el score al vuelo para un cliente (por RUT)
router.get('/:cliente_id', ScoringController.obtenerScore);

export default router;
