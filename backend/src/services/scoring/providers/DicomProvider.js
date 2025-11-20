import BaseProvider from './BaseProvider.js';

// DicomProvider: ficha temporal. Aquí mas adelante se llamará al servicio DICOM real
// y se mapearán sus datos al formato común usado por el motor de scoring.
export default class DicomProvider extends BaseProvider {
  async fetch(cliente_id) { // eslint-disable-line no-unused-vars
    // Datos simulados. Reemplazar cuando exista integración real.
    return {
      delinquencies: 2,      // 2 morosidades reportadas
      unpaidAmount: 150000,  // monto impago estimado en CLP
      inquiriesLast12M: 3,   // consultas de crédito últimos 12 meses
      positiveMonths: 24,    // meses con buen comportamiento
    };
  }
}
