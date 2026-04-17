import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import LoanSimulator from "./components/LoanSimulator";
import LoanRequest from "./components/LoanRequest";
import Panel from "./components/Panel";
import "./App.css";
import Menu from "./components/Menu";
import SuggestedSimulator from "./components/SuggestedSimulator";

export default function App() {
  const [activeComponent, setActiveComponent] = useState("login");
  const [clienteId, setClienteId] = useState(null);
  const [lastSimulation, setLastSimulation] = useState(null);

  // Restore persisted login on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('clienteId') || sessionStorage.getItem('clienteId');
      if (saved) {
        setClienteId(saved);
        setActiveComponent('loan');
      }
    } catch (_) { /* ignore */ }
  }, []);

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
      // Persist depending on remember flag
      try {
        if (remember) {
          localStorage.setItem('clienteId', data.cliente_id);
          sessionStorage.removeItem('clienteId');
        } else {
          sessionStorage.setItem('clienteId', data.cliente_id);
          localStorage.removeItem('clienteId');
        }
      } catch (_) { /* ignore */ }
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

  const handleLogout = () => {
    try {
      localStorage.removeItem('clienteId');
      sessionStorage.removeItem('clienteId');
    } catch (_) { /* ignore */ }
    setClienteId(null);
    setActiveComponent('login');
  };

  return (
    <div className="app-container">
      {activeComponent === "login" && (
        <Panel>
          <LoginForm onSubmit={handleLogin} />
        </Panel>
      )}

      {activeComponent === "loan" && (
        <LoanSimulator
          onRequestLoan={goToLoanRequest}
          onBackToMenu={() => setActiveComponent("menu")}
          clienteId={clienteId}
        />
      )}

      {activeComponent === "suggested-loan" && (
        <SuggestedSimulator
          onBackToMenu={() => setActiveComponent("menu")}
          clienteId={clienteId}
        />
      )}


      {activeComponent === "menu" && (
        <Panel>
          <Menu
            onNavigate={(component) => setActiveComponent(component)}
            onLogout={handleLogout}
          />
        </Panel>
      )}

      {activeComponent === "loan-request" && (
        <Panel>
          <LoanRequest
            simulation={lastSimulation}
            onBackToSimulator={() => setActiveComponent("loan")}
          />
        </Panel>
      )}
    </div>
  );
}
