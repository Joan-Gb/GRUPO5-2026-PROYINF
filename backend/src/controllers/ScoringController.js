import { evaluateScoreForCliente } from '../services/scoring/index.js';

// Controlador: calcula el score en el momento y devuelve detalle.
export async function obtenerScore(req, res) {
  const { cliente_id } = req.params;
  if (!cliente_id) return res.status(400).json({ error: 'Falta cliente_id' });
  try {
    const result = await evaluateScoreForCliente(cliente_id);
    return res.json(result);
  } catch (err) {
    console.error('[ScoringController] Error evaluando score:', err);
    return res.status(500).json({ error: 'Error interno al evaluar score' });
  }
}

export default { obtenerScore };
