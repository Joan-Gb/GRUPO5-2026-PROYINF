import { useState } from "react";
import "./LoginForm.css";

export default function LoginForm({ onSubmit }) {
  const [rut, setRUT] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rut, password, remember });
  };

  return (
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <div className = "container_form">
            <h2>Iniciar Sesión</h2>
            <p className="subtitle">Accede a tu cuenta para continuar</p>

            <div className="input-group">
              <input
                type="rut"
                placeholder="RUT"
                value={rut}
                onChange={(e) => setRUT(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
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
              ¿No eres cliente? <a href="#">Regístrate aquí</a>
            </p>
             <img src="/logo-usm.png" alt="Logo USM" className="logo" />
          </div>
          </form>

      </div>
  );
}