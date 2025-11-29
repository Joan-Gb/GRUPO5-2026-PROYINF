import { Router } from 'express';
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

const router = Router();

function normalizeRUT(input) {
  if (!input) return '';
  let rut = String(input).replace(/\./g, '').replace(/\s+/g, '').toUpperCase();
  if (!rut.includes('-') && rut.length > 1) {
    rut = rut.slice(0, -1) + '-' + rut.slice(-1);
  }
  return rut.replace(/[^0-9K\-]/g, '');
}

router.post('/login', async (req, res) => {
  try {
    const { rut, password } = req.body || {};
    
    // Validación básica
    if (!rut || !password) {
      return res.status(400).json({ success: false, error: 'Faltan credenciales' });
    }

    const cliente_id = normalizeRUT(rut);
    if (!cliente_id || !cliente_id.includes('-')) {
      return res.status(400).json({ success: false, error: 'RUT inválido' });
    }

    // 1. Buscar usuario
    const { rows } = await pool.query('SELECT * FROM clientes WHERE cliente_id = $1', [cliente_id]);
    
    if (rows.length > 0) {
      // USUARIO EXISTE -> Validar Password
      const user = rows[0];

      if (!user.password_hash) {
         // Si es un usuario antiguo sin clave (migración), se la seteamos ahora
         const salt = await bcrypt.genSalt(10);
         const newHash = await bcrypt.hash(password, salt);
         await pool.query('UPDATE clientes SET password_hash = $1 WHERE cliente_id = $2', [newHash, cliente_id]);
         return res.json({ success: true, cliente_id: user.cliente_id, message: "Clave actualizada" });
      }

      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) {
        return res.status(401).json({ success: false, error: 'Contraseña incorrecta' });
      }
      
      return res.json({ success: true, cliente_id: user.cliente_id });

    } else {
      // USUARIO NO EXISTE -> CREARLO (Registro Automático)
      // Como la BD pide email obligatorio, generamos uno falso basado en el RUT
      const fakeEmail = `${cliente_id}@usuario.com`;
      const fakeName = `Cliente ${cliente_id}`;
      const fakePhone = "+56900000000";

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      // Insertamos con TODOS los campos obligatorios
      const insert = await pool.query(
        `INSERT INTO clientes 
         (cliente_id, nombre_completo, email, telefono, password_hash) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING cliente_id`,
        [cliente_id, fakeName, fakeEmail, fakePhone, hash]
      );
      
      console.log(`Nuevo usuario creado: ${cliente_id}`);
      return res.status(201).json({ success: true, cliente_id: insert.rows[0].cliente_id });
    }

  } catch (err) {
    console.error('Auth error:', err);
    return res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

export default router;