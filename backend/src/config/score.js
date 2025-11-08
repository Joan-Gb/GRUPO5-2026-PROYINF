// Configuración básica para calcular el score crediticio.
export default {
  weights: {
    delinquency: 0.4,      // morosidades y su peso
    unpaidAmount: 0.2,     // monto impago aproximado
    inquiries: 0.1,        // consultas de crédito recientes
    incomeToDebt: 0.2,     // relación ingreso/deuda (si existe)
    positiveHistory: 0.1,  // historial positivo (meses sin problemas)
  },
  thresholds: {
    // Límites para normalizar cada métrica
    maxDelinquencies: 10,
    maxUnpaidAmount: 5000000, // tope suave para escalar montos impagos
    maxInquiries: 12,
    // incomeToDebt espera valores entre 0 y ~2 (muy endeudado).
  },
  decision: {
    approveThreshold: 70,
    reviewThreshold: 55,
  },
};
