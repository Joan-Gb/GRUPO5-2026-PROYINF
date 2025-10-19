import { useState } from "react";
import './App.css'; // global
import LoanRequest from "./components/LoanRequest";
import LoginForm from "./components/LoginForm";
import LoanSimulator from "./components/LoanSimulator";
import Panel from "./components/Panel"; // nuevo wrapper

export default function App() {
  const [activeComponent, setActiveComponent] = useState("login");

  const handleLogin = (data) => {
    if (data.simulate) {
      setActiveComponent("loan");
    } else {
      // Aquí podrías validar credenciales
      setActiveComponent("loan");
    }
  };

  return (
    <div className="app-container">
      {activeComponent === "login" && (
        <Panel>
          <LoginForm onSubmit={handleLogin} />
        </Panel>
      )}
      {activeComponent === "loan" && (
        <Panel>
          <LoanSimulator />
        </Panel>
      )}
    </div>
  );
}
