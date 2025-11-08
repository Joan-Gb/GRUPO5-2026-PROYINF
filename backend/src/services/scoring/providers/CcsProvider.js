import BaseProvider from './BaseProvider.js';

// CcsProvider: stub para datos CCS. Se reemplazará con la llamada real.
export default class CcsProvider extends BaseProvider {
  async fetch(cliente_id) { // eslint-disable-line no-unused-vars
    // Datos ficticios mientras no hay integración
    return {
      delinquencies: 0,
      unpaidAmount: 0,
      inquiriesLast12M: 1,
      positiveMonths: 36,
    };
  }
}
