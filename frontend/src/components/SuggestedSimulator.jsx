import React, { useState } from "react";
import Panel from "./Panel";
import styles from "./SuggestedSimulator.module.css";

export default function SuggestedSimulator({ onBackToMenu, clienteId }) {
    const [income, setIncome] = useState("");
    const [seniority, setSeniority] = useState("");
    const [installments, setInstallments] = useState(24);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCalculateSugerido = async () => {
        setError("");
        setResult(null);

        const rentaNum = Number(income);
        const antiguedadNum = Number(seniority);

      
        if (!income || rentaNum <= 0) {
            setError("Por favor, ingresa una renta líquida mayor a $0.");
            return;
        }

        if (!seniority || antiguedadNum < 12) {
            setError("Debes tener al menos 12 meses de antigüedad laboral para acceder a esta evaluación.");
            return;
        }

        setLoading(true);
        try {
            
            const response = await fetch("/api/simulations/sugerida", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cliente_id: clienteId || "CLIENTE_WEB",
                    renta_liquida: rentaNum,
                    antiguedad_laboral: antiguedadNum,
                    plazo_meses: Number(installments),
                }),
            });

            const data = await response.json();


            if (!response.ok) {
                throw new Error(data.error || "La solicitud no cumple con las políticas de riesgo actuales.");
            }


            setResult(data.oferta);
        } catch (err) {
            setError(err.message || "No se pudo conectar con el servidor. Inténtalo más tarde.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>

            <div className={styles.leftContainer}>
                <Panel>
                    <button className={styles.toggleButtonTopLeft} onClick={onBackToMenu}>
                        ⬅ Menú
                    </button>
                    <div className={styles.container}>
                        <h2 className={styles.header}>Oferta Personalizada</h2>
                        <div className={styles.alert}>
                            <b>Modalidad B: Recomendación Inteligente</b>
                            <p>Dinos cuánto ganas y nosotros te sugerimos el préstamo ideal para tu capacidad de pago.</p>
                        </div>

                        <label className={styles.label}>¿Cuál es tu renta líquida mensual?</label>
                        <input
                            type="number"
                            value={income}
                            onChange={(e) => setIncome(e.target.value)}
                            placeholder="Ej: 1200000"
                            className={styles.input}
                        />

                        <label className={styles.label}>Antigüedad laboral (meses)</label>
                        <input
                            type="number"
                            value={seniority}
                            onChange={(e) => setSeniority(e.target.value)}
                            placeholder="Ej: 24"
                            className={styles.input}
                        />

                        <label className={styles.label}>¿En cuántas cuotas te gustaría pagar?</label>
                        <select
                            value={installments}
                            onChange={(e) => setInstallments(parseInt(e.target.value))}
                            className={styles.select}
                        >
                            {[12, 24, 36, 48, 60].map((n) => (
                                <option key={n} value={n}>{n} cuotas</option>
                            ))}
                        </select>

                        <button
                            onClick={handleCalculateSugerido}
                            className={styles.button}
                            disabled={loading}
                        >
                            {loading ? "Calculando..." : "Obtener mi oferta óptima"}
                        </button>

                        {error && <p className={styles.error}>{error}</p>}
                    </div>
                </Panel>
            </div>

            <div className={styles.rightContainer}>
                <div className={styles.resultContainer}>
                    <h3>Tu Recomendación</h3>
                    {result ? (
                        <>
                            <div className={styles.offerHighlight}>
                                <p className={styles.offerLabel}>Monto máximo sugerido:</p>
                                <p className={styles.offerValue}>${Number(result.monto_solicitado).toLocaleString()}</p>
                            </div>
                            <p><b>Cuota mensual estimada:</b> ${Number(result.valor_cuota).toLocaleString()}</p>
                            <p><b>Plazo:</b> {result.plazo_meses} meses</p>
                            <p><b>Carga financiera:</b> 25% de tu sueldo</p>

                            <div className={styles.legalNote}>
                                <small> {result.nota_legal || "Oferta sujeta a validación."}</small>
                            </div>

                            <button className={styles.button_right} style={{ width: '100%', marginTop: '20px' }}>
                                Aceptar y Solicitar
                            </button>
                        </>
                    ) : (
                        <div className={styles.emptyState}>
                            <p>Ingresa tus datos para ver cuánto podemos prestarte.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}