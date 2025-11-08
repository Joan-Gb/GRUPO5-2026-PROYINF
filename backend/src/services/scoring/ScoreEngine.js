import config from '../../config/score.js';

// ScoreEngine: junta la info de los proveedores y calcula un puntaje (1..100) + decisión.
export default class ScoreEngine {
  constructor(providers = []) {
    this.providers = providers;
  }

  // Combina datos de proveedores sumando métricas negativas y tomando el máximo de las positivas.
  async collect(cliente_id) {
    const base = { delinquencies: 0, unpaidAmount: 0, inquiriesLast12M: 0, positiveMonths: 0 };
    for (const p of this.providers) {
      try {
        const d = await p.fetch(cliente_id) || {};
        base.delinquencies += d.delinquencies || 0;
        base.unpaidAmount += d.unpaidAmount || 0;
        base.inquiriesLast12M += d.inquiriesLast12M || 0;
        base.positiveMonths = Math.max(base.positiveMonths, d.positiveMonths || 0);
      } catch (err) {
        // Si falla un proveedor, seguimos con los demás. Log suave.
        // eslint-disable-next-line no-console
        console.warn('[ScoreEngine] Falla proveedor:', p.constructor.name, err.message);
      }
    }
    return base;
  }

  // Calcula puntaje 1..100 a partir de las métricas normalizadas.
  compute(metrics) {
    const { weights, thresholds, decision } = config;
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 1;

    // Normalizamos a [0,1] donde 1 es mejor.
    const delinquencyScore = 1 - Math.min(metrics.delinquencies / (thresholds.maxDelinquencies || 1), 1);
    const unpaidScore = 1 - Math.min(metrics.unpaidAmount / (thresholds.maxUnpaidAmount || 1), 1);
    const inquiriesScore = 1 - Math.min(metrics.inquiriesLast12M / (thresholds.maxInquiries || 1), 1);
    // positiveMonths: >60 meses ya se considera tope
    const positiveScore = Math.min((metrics.positiveMonths || 0) / 60, 1);
    // incomeToDebt opcional: menor ratio = mejor (simplificado)
    let incomeToDebtScore = 1;
    if (typeof metrics.incomeToDebt === 'number') {
      const ratio = metrics.incomeToDebt;
      incomeToDebtScore = ratio <= 0 ? 1 : ratio >= 2 ? 0 : 1 - (ratio / 2);
    }

    const weighted = (
      delinquencyScore * (weights.delinquency || 0) +
      unpaidScore * (weights.unpaidAmount || 0) +
      inquiriesScore * (weights.inquiries || 0) +
      incomeToDebtScore * (weights.incomeToDebt || 0) +
      positiveScore * (weights.positiveHistory || 0)
    ) / totalWeight;

    const rawScore = Math.round(weighted * 100);
    let status = 'REJECT';
    if (rawScore >= decision.approveThreshold) status = 'APPROVE';
    else if (rawScore >= decision.reviewThreshold) status = 'REVIEW';

    return {
      score: rawScore,
      status,
      components: { delinquencyScore, unpaidScore, inquiriesScore, incomeToDebtScore, positiveScore }
    };
  }

  async evaluate(cliente_id) {
    const metrics = await this.collect(cliente_id);
    const result = this.compute(metrics);
    return { cliente_id, metrics, ...result };
  }
}
