import './LoanSimulator.css';
import { useState } from 'react';

function LoanSimulator() {
    const [amount, setAmount] = useState('');
    const [term, setTerm] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);

    const handleSimulation = () => {
        const newResult = {
        amount,
        term,
        interestRate,
        summary: `Simulación: Monto $${amount}, Plazo ${term} meses, Tasa ${interestRate}%`
        };
        setResult(newResult.summary);
        setHistory([newResult, ...history]);
    };

    const loadSimulation = (sim) => {
        setAmount(sim.amount);
        setTerm(sim.term);
        setInterestRate(sim.interestRate);
        setResult(sim.summary);
    };

    return (
        <div className="simulator-wrapper">
        <div className="history-panel">
            <h3>Simulaciones anteriores</h3>
            <table>
            <thead>
                <tr>
                <th>Monto</th>
                <th>Plazo</th>
                <th>Tasa</th>
                </tr>
            </thead>
            <tbody>
                {history.map((sim, index) => (
                <tr key={index} onClick={() => loadSimulation(sim)}>
                    <td>${sim.amount}</td>
                    <td>{sim.term}</td>
                    <td>{sim.interestRate}%</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        <div className="loan-simulator-container">
            <h2>Simulador de Préstamo</h2>

            <div className="field">
            <label>Monto solicitado ($):</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>

            <div className="field">
            <label>Plazo (meses):</label>
            <input type="number" value={term} onChange={e => setTerm(e.target.value)} />
            </div>

            <div className="field">
            <label>Tasa de interés (%):</label>
            <input type="number" value={interestRate} onChange={e => setInterestRate(e.target.value)} />
            </div>

            <button onClick={handleSimulation}>Simular</button>

            {result && <div className="result">{result}</div>}
        </div>
        </div>
    );
}

export default LoanSimulator;