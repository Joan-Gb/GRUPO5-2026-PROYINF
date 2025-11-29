import fetch from 'node-fetch';
import pool from '../config/db.js'; // Importamos la conexión a la BD

// Credenciales de PRUEBA de Transbank (Ambiente de Integración)
const TRANSBANK_API_KEY_ID = "597055555532";
const TRANSBANK_API_KEY_SECRET = "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C";
const TRANSBANK_HOST = "https://webpay3gint.transbank.cl";

/**
 * Inicia una transacción de pago en Webpay Plus
 */
const crearTransaccion = async (req, res) => {
    const { cuota_id, monto, cliente_id, return_url } = req.body;

    if (!cuota_id || !monto || !return_url) {
        return res.status(400).json({ error: 'Faltan cuota_id, monto o return_url.' });
    }

    // Creamos un buy_order que contenga el ID de la cuota para recuperarlo después
    // Formato: ORDEN_CUOTA_{ID_CUOTA}_{TIMESTAMP}
    const buy_order = `OC_${cuota_id}_${Date.now()}`;
    const session_id = `SESION_CLIENTE_${cliente_id || 'anon'}`;

    const url = `${TRANSBANK_HOST}/rswebpaytransaction/api/webpay/v1.2/transactions`;
    const options = {
        method: 'POST',
        headers: {
            'Tbk-Api-Key-Id': TRANSBANK_API_KEY_ID,
            'Tbk-Api-Key-Secret': TRANSBANK_API_KEY_SECRET,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            buy_order: buy_order,
            session_id: session_id,
            amount: monto,
            return_url: return_url
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error_message || 'Error creando transacción en Transbank');
        }

        res.status(200).json(data);

    } catch (error) {
        console.error("Error en Transbank crearTransaccion:", error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Confirma el pago, verifica el estado con Transbank y actualiza la BD
 */
const confirmarTransaccion = async (req, res) => {
    // Transbank envía el token por POST (o GET)
    const token_ws = req.body.token_ws || req.query.token_ws; 

    // Si el usuario anula la compra, Transbank manda TBK_TOKEN, etc.
    if (!token_ws) {
        return res.status(400).send("Compra anulada o error de token.");
    }

    // URL para confirmar (COMMIT) la transacción
    const url = `${TRANSBANK_HOST}/rswebpaytransaction/api/webpay/v1.2/transactions/${token_ws}`;
    const options = {
        method: 'PUT', // Para confirmar se usa PUT
        headers: {
            'Tbk-Api-Key-Id': TRANSBANK_API_KEY_ID,
            'Tbk-Api-Key-Secret': TRANSBANK_API_KEY_SECRET,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json(); // Respuesta de Transbank

        // Verificar si la transacción fue aprobada (status: AUTHORIZED) y response_code: 0
        if (data.status === 'AUTHORIZED' && data.response_code === 0) {
            
            // Recuperar el cuota_id desde la orden de compra
            // data.buy_order viene como "ORDEN_CUOTA_15_178234..."
            const partesOrden = data.buy_order.split('_');
            const cuota_id = partesOrden[2]; // El índice 2 es el ID de la cuota

            if (cuota_id) {
                // ACTUALIZAR BASE DE DATOS
                await pool.query(
                    "UPDATE cuotas SET estado = 'Pagada', fecha_pago_efectivo = NOW() WHERE cuota_id = $1",
                    [cuota_id]
                );
                console.log(`Cuota ${cuota_id} pagada exitosamente.`);
            }

            // REDIRIGIR AL FRONTEND (Página de Éxito)
            // Cambia esta URL por la ruta de tu frontend donde muestras el mensaje de "Pago Exitoso"
            return res.redirect(`http://localhost:5173/payment/success?token=${token_ws}`);
        } else {
            // Si el pago fue rechazado
            return res.redirect(`http://localhost:5173/payment/failure?error=rechazado`);
        }

    } catch (error) {
        console.error("Error confirmando transacción:", error);
        return res.status(500).send("Error interno al procesar el pago.");
    }
};

export default {
    crearTransaccion,
    confirmarTransaccion
};