import styles from "./Menu.module.css";

export default function Menu({ onNavigate, onLogout }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Menú Principal</h2>
      <p className={styles.subtitle}>Selecciona una opción para continuar</p>

      <div className={styles.menuOptions}>
        <button
          className={styles.button}
          onClick={() => onNavigate("loan")}
        >
          Simular Crédito
        </button>

        <button
          className={styles.button}
          onClick={() => onNavigate("history")}
        >
           Ver Historial
        </button>

        <button
          className={styles.button}
          onClick={() => onNavigate("requests")}
        >
           Solicitudes Pendientes
        </button>

        <button
          className={`${styles.button} ${styles.logout}`}
          onClick={onLogout}
        >
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
