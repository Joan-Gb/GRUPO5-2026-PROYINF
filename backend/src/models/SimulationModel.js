function calcularCuota(monto, plazo_meses, tasa_anual) {
    if (tasa_anual <= 0 || plazo_meses <= 0) {
        return Math.round((monto / plazo_meses) * 100) / 100; 
    }
    const tasa_mensual = tasa_anual / 12;

    const numerador = tasa_mensual * Math.pow(1 + tasa_mensual, plazo_meses);
    const denominador = Math.pow(1 + tasa_mensual, plazo_meses) - 1;
    
    return Math.round((monto * (numerador / denominador)) * 100) / 100;
}


async function guardarSimulacion(data, pool) {
    const { cliente_id, monto_solicitado, plazo_meses, tasa_anual, valor_cuota, cae, costo_total, seguros_voluntarios, nombre_simulacion } = data;
    
    const tasa_interes_mensual = tasa_anual / 12;

    const query = `
        INSERT INTO historial_simulaciones (
            cliente_id, monto_solicitado, plazo_meses, tasa_interes, valor_cuota, cae, costo_total, seguros_voluntarios, nombre_simulacion
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
    `;
    const values = [
        cliente_id, 
        monto_solicitado, 
        plazo_meses, 
        tasa_interes_mensual,
        valor_cuota, 
        cae, 
        costo_total,
        seguros_voluntarios, 
        nombre_simulacion
    ];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error al guardar la simulación en el Modelo:", error);
        throw new Error("Error en la capa de datos al guardar la simulación.");
    }
}
async function listarSimulaciones(cliente_id, pool) {
    const query = `
        SELECT 
            simulacion_id, 
            nombre_simulacion, 
            monto_solicitado, 
            plazo_meses, 
            valor_cuota, 
            cae, 
            costo_total, 
            fecha_simulacion
        FROM historial_simulaciones
        WHERE cliente_id = $1
        ORDER BY fecha_simulacion DESC;
    `;
    
    try {
        const result = await pool.query(query, [cliente_id]);
        return result.rows;
    } catch (error) {
        console.error("Error al listar simulaciones en el Modelo:", error);
        throw new Error("Error en la capa de datos al listar simulaciones.");
    }
}

export default {
    calcularCuota,
    guardarSimulacion,
    listarSimulaciones
};