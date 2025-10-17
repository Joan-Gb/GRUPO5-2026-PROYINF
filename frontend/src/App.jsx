import { useState } from "react";
import LoanRequest from "./components/LoanRequest";
import LoginForm from "./components/LoginForm";
import LoanSimulator from "./components/LoanSimulator";

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
    <div>
      {activeComponent === "login" && <LoginForm onSubmit={handleLogin} />}
      {activeComponent === "loan" && <LoanSimulator />}
    </div>
  );
}
