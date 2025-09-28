import { useState } from "react";
import "./LoginForm.css";

export default function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password, remember });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">

        <h2>Iniciar Sesión</h2>
        <p className="subtitle">Accede a tu cuenta para continuar</p>

        <div className="input-group">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="options">
          <label>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />{" "}
            Recuérdame
          </label>
          <button type="button" className="link-btn">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button type="submit" className="login-btn">
          Iniciar Sesión
        </button>

        <p className="footer">
          ¿No tienes cuenta? <a href="#">Regístrate aquí</a>
        </p>
      </form>
    </div>
  );
}