import React from 'react';
import styles from './ApprovalProbability.module.css';

const ApprovalProbability = ({ riskLevel, suggestion }) => {
  if (!riskLevel) return null;

  let colorClass = '';
  if (riskLevel === 'Baja') colorClass = styles.lowProbability;
  if (riskLevel === 'Media') colorClass = styles.mediumProbability;
  if (riskLevel === 'Alta') colorClass = styles.highProbability;

  return (
    <div className={styles.indicatorContainer}>
      <h3 className={styles.title}>Probabilidad de Aprobación Estimada</h3>
      
      <div className={`${styles.badge} ${colorClass}`}>
        {riskLevel}
      </div>

      {riskLevel === 'Baja' && suggestion && (
        <div className={styles.suggestionBox}>
          <strong>Acción recomendada:</strong> {suggestion}
        </div>
      )}

      <p className={styles.disclaimer}>
         Este indicador es una estimación previa y no garantiza la aprobación final del crédito.
      </p>
    </div>
  );
};

export default ApprovalProbability;