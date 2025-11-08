// backend/src/controllers/SimulationsController.js
import SimulationModel from '../models/SimulationModel.js';
import pool from '../config/db.js'; // Asegúrate de que el pool se importe para pasarlo al modelo

/**
 * HU-001: Recibe los parámetros de la simulación, llama al Modelo para calcular
 * la cuota y guardar el registro.
 */
const crearSimulacion = async (req, res) => {
    // Parámetros de la HU-005
    const { cliente_id, monto, plazo_meses, tasa_anual, seguros_voluntarios, nombre_simulacion, costo_total } = req.body;

    if (!monto || !plazo_meses || !tasa_anual) {
        return res.status(400).json({ error: 'Faltan parámetros de simulación (monto, plazo, tasa).' });
    }

    try {
        // 1. Lógica de Negocio (Modelo)
        const valor_cuota = SimulationModel.calcularCuota(monto, plazo_meses, tasa_anual);
        
        // Simulación simple de CAE (Carga Anual Equivalente) - (Mejorar después)
        const cae = tasa_anual * 1.5; 
        const costo_total_calculado = valor_cuota * plazo_meses;

        // 2. Preparar datos para la BD
        const datos_simulacion = {
            cliente_id: cliente_id || 'CLIENTE_WEB',
            monto_solicitado: monto,
            plazo_meses: plazo_meses,
            tasa_anual: tasa_anual, // Guardamos la anual para referencia
            valor_cuota: valor_cuota,
            cae: cae,
            costo_total: costo_total_calculado, // Usamos el costo total calculado
            seguros_voluntarios: seguros_voluntarios || false,
            nombre_simulacion: nombre_simulacion || 'Simulación Rápida' // HU-005
        };

        // 3. Guardar en BD (Modelo)
        // Pasamos el pool de conexión al modelo
        const nueva_simulacion = await SimulationModel.guardarSimulacion(datos_simulacion, pool);

        // 4. Respuesta al Cliente
        res.status(201).json(nueva_simulacion);

    } catch (error) {
        console.error("Error en el controlador de simulación:", error);
        res.status(500).json({ error: 'Error interno del servidor al procesar la simulación.' });
    }
};

/**
 * HU-005: Recibe el ID del cliente y devuelve el historial de simulaciones guardadas.
 */
const obtenerHistorialSimulaciones = async (req, res) => {
    const { cliente_id } = req.params; 

    if (!cliente_id) {
        return res.status(400).json({ error: 'Falta el ID del cliente para listar el historial.' });
    }

    try {
        // Llama al Modelo para obtener los datos
        const historial = await SimulationModel.listarSimulaciones(cliente_id, pool);
        
        // Respuesta al Cliente
        res.status(200).json(historial);

    } catch (error) {
        console.error("Error en el controlador de historial:", error);
        res.status(500).json({ error: 'Error interno del servidor al obtener el historial.' });
    }
};

// ¡ESTO FALTABA! Exportar las funciones
export default {
    crearSimulacion,
    obtenerHistorialSimulaciones
};