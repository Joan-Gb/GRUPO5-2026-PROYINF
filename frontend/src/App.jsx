import { useState } from "react";
import LoginForm from "./components/LoginForm";
import LoanSimulator from "./components/LoanSimulator";
import LoanRequest from "./components/LoanRequest";
import Panel from "./components/Panel";
import "./App.css";

export default function App() {
  const [activeComponent, setActiveComponent] = useState("login");
  const [lastSimulation, setLastSimulation] = useState(null);

  const handleLogin = ({ rut, password, remember, simulate }) => {
    if (simulate) {
      // flujo de simulación directa
      setActiveComponent("loan-request");
      return;
    }

    // Validación simple de credenciales
    if (rut.trim() !== "" && password.trim() !== "") {
      /*  backend login    */
      console.log("Login correcto:", { rut, password, remember });
      setActiveComponent("loan"); // redirige al simulador
    } else {
      alert("Debes ingresar RUT y contraseña válidos");
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
        <LoanSimulator onRequestLoan={goToLoanRequest} />
      )}

      {activeComponent === "loan-request" && (
        <Panel>
          <LoanRequest simulation={lastSimulation} />
        </Panel>
      )}
    </div>
  );
}
