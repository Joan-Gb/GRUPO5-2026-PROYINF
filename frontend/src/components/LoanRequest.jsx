import { useState } from 'react';
import './LoanRequest.module.css';
 
function LoanRequest() {
    const [amount, setAmount] = useState('');
    const [term, setTerm] = useState('');
    const [purpose, setPurpose] = useState('');

    const handleRequest = () => {
        alert(`Solicitud enviada:\nMonto: $${amount}\nPlazo: ${term} meses\nMotivo: ${purpose}`);
    };

    return (
        <div className="loan-request-container">
        <h2>Solicitud de Préstamo</h2>

        <div className="field">
            <label>Monto solicitado ($):</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>

        <div className="field">
            <label>Plazo deseado (meses):</label>
            <input type="number" value={term} onChange={e => setTerm(e.target.value)} />
        </div>

        <div className="field">
            <label>Motivo del préstamo:</label>
            <input type="text" value={purpose} onChange={e => setPurpose(e.target.value)} />
        </div>

        <button onClick={handleRequest}>Solicitar</button>
        </div>
    );
}

export default LoanRequest;