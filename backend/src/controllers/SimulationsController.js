import SimulationModel from '../models/SimulationModel.js';
import pool from '../config/db.js';


const crearSimulacion = async (req, res) => {
    const { cliente_id, monto, plazo_meses, tasa_anual, seguros_voluntarios, nombre_simulacion } = req.body;

    if (!monto || !plazo_meses || !tasa_anual) {
        return res.status(400).json({ error: 'Faltan parámetros de simulación (monto, plazo, tasa).' });
    }

    try {
        const valor_cuota = SimulationModel.calcularCuota(monto, plazo_meses, tasa_anual);
        const cae = tasa_anual * 1.5; 
        const costo_total_calculado = valor_cuota * plazo_meses;

        const datos_simulacion = {
            cliente_id: cliente_id || 'CLIENTE_WEB',
            monto_solicitado: monto,
            plazo_meses: plazo_meses,
            tasa_anual: tasa_anual,
            valor_cuota: valor_cuota,
            cae: cae,
            costo_total: costo_total_calculado,
            seguros_voluntarios: seguros_voluntarios || false,
            nombre_simulacion: nombre_simulacion || 'Simulación Rápida'
        };

        const nueva_simulacion = await SimulationModel.guardarSimulacion(datos_simulacion, pool);
        res.status(201).json(nueva_simulacion);

    } catch (error) {
        console.error("Error en el controlador de simulación:", error);
        res.status(500).json({ error: 'Error interno del servidor al procesar la simulación.' });
    }
};


const obtenerHistorialSimulaciones = async (req, res) => {
    const { cliente_id } = req.params; 

    if (!cliente_id) {
        return res.status(400).json({ error: 'Falta el ID del cliente para listar el historial.' });
    }

    try {
        const historial = await SimulationModel.listarSimulaciones(cliente_id, pool);
        res.status(200).json(historial);
    } catch (error) {
        console.error("Error en el controlador de historial:", error);
        res.status(500).json({ error: 'Error interno del servidor al obtener el historial.' });
    }
};


const simularOfertaSugerida = async (req, res) => {
    try {
        const { cliente_id, renta_liquida, antiguedad_laboral, plazo_meses } = req.body;

        if (!renta_liquida || renta_liquida <= 0 || !plazo_meses) {
            return res.status(400).json({ error: "Datos insuficientes para calcular la oferta sugerida." });
        }

        const cuotaMaximaPermitida = renta_liquida * 0.25;

        const tasaInteresMensual = 0.015;
        const cae = 21.5;

        const montoMaximoSugerido = cuotaMaximaPermitida * ((1 - Math.pow(1 + tasaInteresMensual, -plazo_meses)) / tasaInteresMensual);
        const montoFinal = Math.round(montoMaximoSugerido * 100) / 100;

        const query = `
            INSERT INTO historial_simulaciones 
            (cliente_id, monto_solicitado, plazo_meses, tasa_interes, valor_cuota, cae, renta_liquida, antiguedad_laboral, es_oferta_sugerida) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *;
        `;
        
        const values = [
            cliente_id, 
            montoFinal, 
            plazo_meses, 
            tasaInteresMensual, 
            cuotaMaximaPermitida, 
            cae, 
            renta_liquida, 
            antiguedad_laboral, 
            true
        ];

        const result = await pool.query(query, values);

        return res.status(201).json({
            mensaje: "Oferta sugerida generada con éxito",
            oferta: result.rows[0],
            nota_legal: "Esta es una oferta sugerida sujeta a validación de antecedentes."
        });

    } catch (error) {
        console.error("Error al generar simulación sugerida:", error);
        return res.status(500).json({ error: "Error interno del servidor al calcular la oferta." });
    }
};

export default {
    crearSimulacion,
    obtenerHistorialSimulaciones,
    simularOfertaSugerida
};