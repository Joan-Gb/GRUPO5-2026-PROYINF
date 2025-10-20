import React, { useState } from "react";
import Panel from "./Panel";
import styles from "./LoanSimulator.module.css";

export default function LoanSimulator() {
  const [amount, setAmount] = useState("");
  const [installments, setInstallments] = useState(24);
  const [daysToStart, setDaysToStart] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  const MIN_AMOUNT = 500000;
  const MAX_AMOUNT = 150000000;
  const INTEREST_RATE = 0.012; // 1.2% mensual

  const handleCalculate = () => {
    setError("");
    setResult(null);

    const amt = parseInt(amount);
    if (isNaN(amt) || amt < MIN_AMOUNT || amt > MAX_AMOUNT) {
      setError(`El monto debe estar entre $${MIN_AMOUNT.toLocaleString()} y $${MAX_AMOUNT.toLocaleString()}.`);
      return;
    }

    const r = INTEREST_RATE;
    const n = installments;

    // Fórmula de cuota mensual
    const cuota = amt * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const cae = ((Math.pow(1 + r, 12) - 1) * 100).toFixed(2);
    const costoTotal = cuota * n;

    setResult({
      monto: amt,
      plazo: n,
      cuota: cuota.toFixed(0),
      tasa: (r * 100).toFixed(2),
      cae,
      costoTotal: costoTotal.toFixed(0),
    });
  };

  return (
    <div className={styles.wrapper}>
      {/* Panel izquierdo (simulador) */}
      <Panel>
        <div className={styles.container}>
          <h2 className={styles.header}>Simula y Contrata</h2>

          <div className={styles.alert}>
            <b>¡Este es tu nuevo Simulador de Crédito de Consumo con abono inmediato!</b>
            <p>Simula, solicita su aprobación y recíbelo de inmediato en tu cuenta.</p>
          </div>

          <h3 className={styles.sectionTitle}>Simula tu Crédito de Consumo</h3>

          <label className={styles.label}>¿Cuál es el monto que quieres?</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ingresa el monto"
            className={styles.input}
          />
          <p className={styles.helperText}>Monto mín. $500.000 / máx. $150.000.000</p>

          <label className={styles.label}>¿En cuántas cuotas?</label>
          <select
            value={installments}
            onChange={(e) => setInstallments(parseInt(e.target.value))}
            className={styles.select}
          >
            {Array.from({ length: 55 }, (_, i) => i + 6).map((n) => (
              <option key={n} value={n}>{n} cuotas</option>
            ))}
          </select>

          <label className={styles.label}>¿Cuándo quieres comenzar a pagar?</label>
          <input
            type="number"
            value={daysToStart}
            onChange={(e) => setDaysToStart(e.target.value)}
            placeholder="Ej: 30"
            className={styles.input}
          />
          <p className={styles.helperText}>Puedes elegir hasta 90 días</p>

          <button onClick={handleCalculate} className={styles.button}>
            Calcular cuota mensual
          </button>

          {error && <p className={styles.error}>{error}</p>}
        </div>
      </Panel>

      {/* Panel derecho */}
      <div className={styles.rightContainer}>
        <div className={styles.resultContainer}>
          {/* Botón en esquina superior derecha */}
          <button
            className={styles.toggleButtonTopRight}
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? "Ver actual" : "Ver historial"}
          </button>

          {showHistory ? (
            <>
              <h3>Historial</h3>
              {history.length === 0 ? (
                <p>No hay simulaciones anteriores.</p>
              ) : (
                <ul className={styles.historyList}>
                  {history.map((item, i) => (
                    <li key={i} className={styles.historyItem}>
                      <b>{item.fecha}</b> — Monto: ${item.monto.toLocaleString()} / {item.plazo} cuotas / Cuota: ${parseInt(item.cuota).toLocaleString()}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <>
              <h3>Resultado de tu simulación</h3>
              <p><b>Monto solicitado:</b> ${result ? result.monto.toLocaleString() : "-"}</p>
              <p><b>Plazo:</b> {result ? `${result.plazo} cuotas` : "-"}</p>
              <p><b>Cuota mensual:</b> ${result ? parseInt(result.cuota).toLocaleString() : "-"}</p>
              <p><b>Tasa de interés:</b> {result ? `${result.tasa}% mensual` : "-"}</p>
              <p><b>CAE:</b> {result ? `${result.cae}%` : "-"}</p>
              <p><b>Costo total:</b> ${result ? parseInt(result.costoTotal).toLocaleString() : "-"}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
