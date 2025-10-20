import React, { useState, useEffect } from "react";
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

  const handleSave = async () => {
    if (!result) return;
    try {
      const payload = {
        monto: Number(result.monto),
        plazo: Number(result.plazo),
        cuota: Number(result.cuota),
        tasa: Number(result.tasa),
        cae: Number(result.cae),
        seguros_voluntarios: false,
        es_solicitud_formal: false,
      };
      // por ahora estaremos guardando localmente, cambiar para la entrega 4
      const localEntry = {
        fecha: new Date().toISOString(),
        monto: result.monto,
        plazo: result.plazo,
        cuota: result.cuota,
        tasa: result.tasa,
        cae: result.cae,
        costoTotal: result.costoTotal,
        serverId: null,
      };

      
      let serverData = null;
      try {
        const res = await fetch('/api/simulations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          serverData = await res.json();
          if (serverData && serverData.data && serverData.data.simulacion_id) {
            localEntry.serverId = serverData.data.simulacion_id;
          }
        }
      } catch (err) {
        // por ahora solo guardar localmente
        console.warn('Backend save failed, storing locally only', err);
      }

      saveLocalSimulation(localEntry);
      setHistory((h) => [localEntry, ...h]);

      alert('Simulación guardada correctamente' + (localEntry.serverId ? ` (ID: ${localEntry.serverId})` : ' (guardada localmente)'));
    } catch (err) {
      console.error(err);
      alert('No se pudo guardar la simulación');
    }
  };

  // Cookies
  const COOKIE_NAME = 'simulations_history_v1';

  function readCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
      try {
        return JSON.parse(decodeURIComponent(match[2]));
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  function writeCookie(name, value, days = 30) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/`;
  }

  function saveLocalSimulation(entry) {
    const existing = readCookie(COOKIE_NAME) || [];
    
    const updated = [entry, ...existing].slice(0, 30);
    writeCookie(COOKIE_NAME, updated, 365);
  }

  // cargar cookie al iniciar
  useEffect(() => {
    try {
      const saved = readCookie(COOKIE_NAME) || [];
      setHistory(saved);
    } catch (e) {
      // ignore
    }
  }, []);

  // Format fecha ISO -> 'HH:MM:SS - DD/MM/YYYY'
  function formatFecha(iso) {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      const pad = (n) => String(n).padStart(2, '0');
      const hh = pad(d.getHours());
      const mm = pad(d.getMinutes());
      const ss = pad(d.getSeconds());
      const dd = pad(d.getDate());
      const mo = pad(d.getMonth() + 1);
      const yyyy = d.getFullYear();
      return `${dd}/${mo}/${yyyy} - ${hh}:${mm}:${ss}`;
    } catch (e) {
      return iso;
    }
  }

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
                      <b>{formatFecha(item.fecha)}</b> — Monto: ${item.monto.toLocaleString()} / {item.plazo} cuotas / Cuota: ${parseInt(item.cuota).toLocaleString()}
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
              {result && (
                <div style={{ marginTop: 12 }}>
                  <button onClick={handleSave} className={styles.button}>
                    Guardar Simulación
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
