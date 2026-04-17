import { Router } from 'express';
import SimulationsController from '../controllers/SimulationsController.js';

const router = Router();

router.post('/', SimulationsController.crearSimulacion);

router.post('/sugerida', SimulationsController.simularOfertaSugerida);

router.get('/history/:cliente_id', SimulationsController.obtenerHistorialSimulaciones);

export default router;