import { useState } from 'react';
import styles from "./LoanRequest.module.css";

export default function LoanRequest({ simulation, onBackToSimulator }) {
  const [loading, setLoading] = useState(false);

  if (!simulation) return <p>No hay información del crédito seleccionada.</p>;

  const iniciarPago = async () => {
    setLoading(true);
    try {
      // 1. Llamamos a nuestro backend para crear la transacción en Transbank
      const response = await fetch('http://localhost:3000/api/payments/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monto: simulation.costoTotal, // O el valor que quieras cobrar (ej: cuota inicial)
          cuota_id: 1, // ID ficticio por ahora
          cliente_id: 'cliente_prueba',
          return_url: 'http://localhost:3000/api/payments/return' // URL del Backend
        })
      });

      const data = await response.json();

      if (data.url && data.token) {
        // 2. Si Transbank responde bien, creamos un formulario oculto y lo enviamos automáticamente
        // Esto redirige al usuario a la página segura de Webpay
        const form = document.createElement("form");
        form.action = data.url;
        form.method = "POST";

        const tokenInput = document.createElement("input");
        tokenInput.type = "hidden";
        tokenInput.name = "token_ws";
        tokenInput.value = data.token;
        
        form.appendChild(tokenInput);
        document.body.appendChild(form);
        form.submit();
      } else {
        alert("Error al conectar con Webpay: " + JSON.stringify(data));
      }

    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo conectar con el servidor de pagos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container_main}>
      <button 
        className={styles.toggleButtonTopLeft} 
        onClick={onBackToSimulator}
        disabled={loading}
      >
        ⬅ Volver al Simulador
      </button>
      <div className={styles.container}>
        <h2 className={styles.header}>Confirmar Solicitud</h2>
        <div className={styles.details}>
          <p><b>Monto Solicitado:</b> ${parseInt(simulation.monto).toLocaleString()}</p>
          <p><b>Cuota mensual:</b> ${parseInt(simulation.cuota).toLocaleString()}</p>
          <p><b>Costo Total:</b> ${parseInt(simulation.costoTotal).toLocaleString()}</p>
        </div>
        
        <button 
          className={styles.button} 
          onClick={iniciarPago}
          disabled={loading}
        >
          {loading ? "Redirigiendo a Webpay..." : "Pagar y Confirmar"}
        </button>
      </div>
    </div>
  );
}