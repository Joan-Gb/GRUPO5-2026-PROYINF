// backend/src/routes/simulations.js
import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

// Guardar una simulación en la tabla historial_simulaciones
router.post('/', async (req, res) => {
  try {
    const {
      cliente_id = null,
      monto,
      plazo,
      cuota,
      tasa,
      cae,
      seguros_voluntarios = false,
      es_solicitud_formal = false,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO historial_simulaciones (
        cliente_id,
        monto_solicitado,
        plazo_meses,
        tasa_interes,
        valor_cuota,
        cae,
        seguros_voluntarios,
        es_solicitud_formal
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        cliente_id,
        monto,
        plazo,
        tasa,
        cuota,
        cae,
        seguros_voluntarios,
        es_solicitud_formal,
      ]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error saving simulation:', err);
    res.status(500).json({ success: false, error: 'Error saving simulation' });
  }
});

export default router;
