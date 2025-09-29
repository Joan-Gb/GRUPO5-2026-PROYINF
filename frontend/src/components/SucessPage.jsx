import "./SucessPage.css";

export default function SuccessPage({ onConfirm }) {
  return (
    <div className="success-container">
      <div className="success-card">
        <div className="icon-check">✅</div>
        <h2>¡Todo ha sido exitoso!</h2>
        <p className="subtitle">
          Por favor haz click el siguiente botón para confirmar tu crédito.
        </p>
        <button
          className="confirm-btn"
          onClick={onConfirm || (() => alert("Crédito confirmado ✅"))}
        >
          Confirmar Crédito
        </button>
      </div>
    </div>
  );
}