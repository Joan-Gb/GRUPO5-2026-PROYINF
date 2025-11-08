import { Router } from 'express';
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

const router = Router();

function normalizeRUT(input) {
  if (!input) return '';
  let rut = String(input).replace(/\./g, '').replace(/\s+/g, '').toUpperCase();
  // Ensure single hyphen: if missing, insert before last char
  if (!rut.includes('-') && rut.length > 1) {
    rut = rut.slice(0, -1) + '-' + rut.slice(-1);
  }
  // Keep only digits, K, and hyphen
  rut = rut.replace(/[^0-9K\-]/g, '');
  return rut;
}

router.post('/login', async (req, res) => {
  try {
    const { rut, password } = req.body || {};
    if (!rut || !password) {
      return res.status(400).json({ success: false, error: 'Faltan credenciales' });
    }

    const cliente_id = normalizeRUT(rut);
    if (!cliente_id || !cliente_id.includes('-')) {
      return res.status(400).json({ success: false, error: 'RUT inválido. Use formato 12345678-9' });
    }

    const { rows } = await pool.query('SELECT cliente_id, password_hash FROM clientes WHERE cliente_id = $1', [cliente_id]);
    if (rows.length > 0) {
      const user = rows[0];
      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) {
        return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
      }
      return res.json({ success: true, cliente_id: user.cliente_id });
    }

    // Crear usuario nuevo
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // nombre_completo es NOT NULL: usamos el RUT como placeholder
    const insert = await pool.query(
      'INSERT INTO clientes (cliente_id, nombre_completo, password_hash) VALUES ($1, $2, $3) RETURNING cliente_id',
      [cliente_id, cliente_id, hash]
    );
    return res.status(201).json({ success: true, cliente_id: insert.rows[0].cliente_id });
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(500).json({ success: false, error: 'Error del servidor' });
  }
});

export default router;
