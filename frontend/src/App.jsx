import { useState } from "react";
import LoginForm from "./components/LoginForm";
import LoanSimulator from "./components/LoanSimulator";
import LoanRequest from "./components/LoanRequest";
import Panel from "./components/Panel";
import "./App.css";

export default function App() {
  const [activeComponent, setActiveComponent] = useState("login");
  const [clienteId, setClienteId] = useState(null);
  const [lastSimulation, setLastSimulation] = useState(null);

  const handleLogin = async ({ rut, password, remember, simulate }) => {
    if (simulate) {
      // flujo de simulación directa
      setActiveComponent("loan-request");
      return;
    }

    if (!rut || !password) {
      alert("Debes ingresar RUT y contraseña válidos");
      return;
    }
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No se pudo iniciar sesión');
      }
      setClienteId(data.cliente_id);
      setActiveComponent("loan");
    } catch (e) {
      console.error('Error login:', e);
      alert(e.message || 'Error en el inicio de sesión');
    }
  };

  const goToLoanRequest = (simulationData) => {
    setLastSimulation(simulationData);
    setActiveComponent("loan-request");
  };

  return (
    <div className="app-container">
      {activeComponent === "login" && (
        <Panel>
          <LoginForm onSubmit={handleLogin} />
        </Panel>
      )}

      {activeComponent === "loan" && (
        <LoanSimulator onRequestLoan={goToLoanRequest} clienteId={clienteId} />
      )}

      {activeComponent === "loan-request" && (
        <Panel>
          <LoanRequest simulation={lastSimulation} />
        </Panel>
      )}
    </div>
  );
}
