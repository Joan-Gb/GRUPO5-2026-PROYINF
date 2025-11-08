import DicomProvider from './providers/DicomProvider.js';
import CcsProvider from './providers/CcsProvider.js';
import ScoreEngine from './ScoreEngine.js';

// Punto de entrada simple para evaluar el score de un cliente.

export async function evaluateScoreForCliente(cliente_id) {
  const providers = [new DicomProvider(), new CcsProvider()];
  const engine = new ScoreEngine(providers);
  return engine.evaluate(cliente_id);
}

export default { evaluateScoreForCliente };
