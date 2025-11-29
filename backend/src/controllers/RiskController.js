import pool from '../config/db.js';

const evaluarRiesgo = async (req, res) => {
    const { rut, sueldo, monto_solicitado, cuotas } = req.body;

    // 1. Validación básica (Reglas de Admisibilidad del PDF)
    if (!rut || !sueldo || !monto_solicitado) {
        return res.status(400).json({ error: "Datos incompletos" });
    }

    // 2. Cálculo del Scoring (Simulado 1-100)
    let puntaje = 50; // Puntaje base neutro

    // REGLA A: Capacidad de pago (Cuota no debe superar 30% del sueldo)
    // Estimamos cuota simple con 3% interés (igual que tu simulador)
    const tasa = 0.03;
    const valorCuota = monto_solicitado * (tasa * Math.pow(1 + tasa, cuotas)) / (Math.pow(1 + tasa, cuotas) - 1);
    const cargaFinanciera = valorCuota / sueldo;

    if (cargaFinanciera < 0.25) puntaje += 30; // Excelente capacidad
    else if (cargaFinanciera < 0.40) puntaje += 10; // Capacidad media
    else puntaje -= 30; // Muy endeudado (Riesgo alto)

    // REGLA B: Monto solicitado vs Sueldo
    if (monto_solicitado < (sueldo * 5)) puntaje += 10; // Pide algo razonable
    if (monto_solicitado > (sueldo * 10)) puntaje -= 20; // Pide demasiado

    // REGLA C: Simulación de DICOM (Random para efectos académicos)
    // Si el RUT termina en '9', simulamos que tiene deuda (para probar rechazos)
    if (rut.endsWith('9')) {
        puntaje -= 40; 
        console.log("Detectado DICOM simulado por terminación de RUT");
    }

    // 3. Decisión Final
    let estado = 'RECHAZADO';
    if (puntaje >= 70) estado = 'APROBADO';
    else if (puntaje >= 50) estado = 'REVISION_MANUAL';

    // 4. Guardar en Base de Datos (Opcional pero recomendado por el PDF)
    // Aquí podrías hacer un INSERT en tu tabla 'evaluaciones_riesgo'

    res.json({
        rut,
        puntaje,
        estado,
        mensaje: estado === 'APROBADO' ? "¡Felicidades! Su crédito fue pre-aprobado." : "Lo sentimos, no cumple con los requisitos."
    });
};

export default { evaluarRiesgo };