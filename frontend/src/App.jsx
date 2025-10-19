import { useState } from "react";
import './App.css';
import LoginForm from "./components/LoginForm";
import LoanSimulator from "./components/LoanSimulator";
import Panel from "./components/Panel";

export default function App() {
  const [activeComponent, setActiveComponent] = useState("login");

  const handleLogin = () => {
    setActiveComponent("loan");
  };

  return (
    <div className="app-container">
      {activeComponent === "login" && (
        <Panel>
          <LoginForm onSubmit={handleLogin} />
        </Panel>
      )}

      {activeComponent === "loan" && <LoanSimulator />}
    </div>
  );
}
