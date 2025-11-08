import styles from "./LoanRequest.module.css";

export default function LoanRequest({ simulation, onBackToSimulator }) {
  if (!simulation) return <p>No hay información del crédito seleccionada.</p>;

  return (
    <div className={styles.container_main}>
      <button 
        className={styles.toggleButtonTopLeft} 
        onClick={onBackToSimulator}
      >
        ⬅ Volver al Simulador
      </button>
      <div className={styles.container}>
        <h2 className={styles.header}>Confirmar Solicitud</h2>
        <div className={styles.details}>
          <p><b>Monto:</b> ${simulation.monto.toLocaleString()}</p>
          <p><b>Plazo:</b> {simulation.plazo} cuotas</p>
          <p><b>Cuota mensual:</b> ${parseInt(simulation.cuota).toLocaleString()}</p>
          <p><b>Tasa:</b> {simulation.tasa}%</p>
          <p><b>CAE:</b> {simulation.cae}%</p>
          <p><b>Costo total:</b> ${parseInt(simulation.costoTotal).toLocaleString()}</p>
        </div>
        <button className={styles.button}>Confirmar Solicitud</button>
      </div>
    </div>
  );
}
