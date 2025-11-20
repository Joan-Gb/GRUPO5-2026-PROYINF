import { Router } from 'express';
import RiskController from '../controllers/RiskController.js';

const router = Router();

router.post('/evaluate', RiskController.evaluarRiesgo);

export default router;