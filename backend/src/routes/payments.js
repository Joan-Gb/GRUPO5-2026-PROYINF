import { Router } from 'express';
import PaymentController from '../controllers/PaymentController.js';

const router = Router();

// Iniciar un pago de cuota (llama a Transbank)
router.post('/create-transaction', PaymentController.crearTransaccion);

// URL de retorno (donde Transbank nos avisa que el pago se hizo)
router.post('/return', PaymentController.confirmarTransaccion);
router.get('/return', PaymentController.confirmarTransaccion); // Transbank a veces usa GET

export default router;