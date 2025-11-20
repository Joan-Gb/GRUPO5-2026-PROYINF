// Clase base para proveedores de datos externos de scoring.
// Cada proveedor debe implementar fetch(cliente_id) y devolver un objeto
// con las métricas necesarias para el cálculo del puntaje.
export default class BaseProvider {
  // Debe devolver algo como:
  // {
  //   delinquencies: <número de morosidades>,
  //   unpaidAmount: <monto impago en CLP>,
  //   inquiriesLast12M: <consultas últimos 12m>,
  //   positiveMonths: <meses con buen historial>
  // }
  async fetch(cliente_id) { // eslint-disable-line no-unused-vars
    throw new Error('Implementar fetch(cliente_id) en la subclase');
  }
}
