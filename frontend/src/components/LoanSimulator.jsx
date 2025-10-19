import React, { useState } from "react";
import styles from "./LoanSimulator.module.css";

export default function LoanSimulator() {
  const [amount, setAmount] = useState("");
  const [installments, setInstallments] = useState(24);
  const [daysToStart, setDaysToStart] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [error, setError] = useState("");

  const MIN_AMOUNT = 500000;
  const MAX_AMOUNT = 150000000;
  const INTEREST_RATE = 0.012;

  const handleCalculate = () => {
    setError("");
    setMonthlyPayment(null);

    const amt = parseInt(amount);
    if (isNaN(amt) || amt < MIN_AMOUNT || amt > MAX_AMOUNT) {
      setError(`El monto debe estar entre $${MIN_AMOUNT.toLocaleString()} y $${MAX_AMOUNT.toLocaleString()}.`);
      return;
    }

    const r = INTEREST_RATE;
    const n = installments;
    const M = amt * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setMonthlyPayment(M.toFixed(0));
  };

  return (
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

        {monthlyPayment && (
          <div className={styles.result}>
            <h4 className={styles.resultTitle}>Resultado de tu simulación</h4>
            <p className={styles.resultText}>
              Cuota mensual estimada: <b>${parseInt(monthlyPayment).toLocaleString()}</b>
            </p>
            <p className={styles.helperText}>(Tasa simulada 1.2% mensual)</p>
          </div>
        )}
      </div>
  );
}
