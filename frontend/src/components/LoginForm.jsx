import { useState } from "react";
import styles from "./LoginForm.module.css"; // Import correcto de CSS Modules

export default function LoginForm({ onSubmit }) {
  const [rut, setRUT] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rut, password, remember });
  };

  const handleSimulate = (e) => {
    e.preventDefault();
    // Aquí no necesitas credenciales, solo redirigir a LoanRequest
    onSubmit({ simulate: true });
  };

  return (
      <div className={styles.loginContainer}>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.containerForm}>
            <h2>Iniciar Sesión</h2>
            <p className={styles.subtitle}>Accede a tu cuenta para continuar</p>

            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="RUT"
                value={rut}
                onChange={(e) => setRUT(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.options}>
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />{" "}
                Recuérdame
              </label>
              <button type="button" className={styles.linkBtn}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button type="submit" className={styles.loginBtn}>
              Iniciar Sesión
            </button>

            <p className={styles.footer}>
              ¿Quieres ser cliente?{" "}
              <a href="#" onClick={handleSimulate}>
                Simula
              </a>
            </p>

            <img src="/logo-usm.png" alt="Logo USM" className={styles.logo} />
          </div>
        </form>
      </div>
  );
}
