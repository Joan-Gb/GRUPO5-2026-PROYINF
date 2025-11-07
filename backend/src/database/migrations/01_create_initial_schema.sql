CREATE TABLE historial_simulaciones (
    simulacion_id SERIAL PRIMARY KEY,
    cliente_id VARCHAR(20),
    monto_solicitado NUMERIC(15, 2) NOT NULL,
    plazo_meses INTEGER NOT NULL,
    tasa_interes NUMERIC(5, 4) NOT NULL,
    valor_cuota NUMERIC(10, 2) NOT NULL,
    cae NUMERIC(7,2) NOT NULL,
    seguros_voluntarios BOOLEAN DEFAULT FALSE,
    fecha_simulacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    es_solicitud_formal BOOLEAN DEFAULT FALSE
);

CREATE TABLE clientes (
    cliente_id VARCHAR(20) PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    direccion_residencia VARCHAR(255),
    fecha_nacimiento DATE,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    es_persona_natural BOOLEAN DEFAULT TRUE
);

CREATE TABLE solicitudes (
    solicitud_id SERIAL PRIMARY KEY,
    cliente_id VARCHAR(20) REFERENCES clientes(cliente_id) NOT NULL,
    simulacion_origen_id INTEGER REFERENCES historial_simulaciones(simulacion_id),
    monto_final_solicitado NUMERIC(15, 2) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reglas_admisibilidad_ok BOOLEAN DEFAULT FALSE,
    observaciones TEXT
);

CREATE TABLE evaluaciones_riesgo (
    evaluacion_id SERIAL PRIMARY KEY,
    solicitud_id INTEGER REFERENCES solicitudes(solicitud_id) NOT NULL,
    puntaje_scoring INTEGER,
    decision VARCHAR(50) NOT NULL,
    fecha_evaluacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    motivo_rechazo VARCHAR(255),
    apetito_riesgo_umbral INTEGER
);

CREATE TABLE prestamos (
    prestamo_id SERIAL PRIMARY KEY,
    cliente_id VARCHAR(20) REFERENCES clientes(cliente_id) NOT NULL,
    solicitud_id INTEGER REFERENCES solicitudes(solicitud_id) UNIQUE NOT NULL,
    monto_aprobado NUMERIC(15, 2) NOT NULL,
    plazo_meses INTEGER NOT NULL,
    tasa_anual NUMERIC(5, 4),
    fecha_activacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    estado_credito VARCHAR(50) NOT NULL,
    UNIQUE (cliente_id, fecha_activacion)
);

CREATE TABLE cuotas (
    cuota_id SERIAL PRIMARY KEY,
    prestamo_id INTEGER REFERENCES prestamos(prestamo_id) NOT NULL,
    numero_cuota INTEGER NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    monto_cuota NUMERIC(15, 2) NOT NULL,
    capital_amortizado NUMERIC(12, 2),
    interes NUMERIC(12, 2),
    saldo_restante NUMERIC(12, 2),
    estado VARCHAR(50) DEFAULT 'Pendiente',
    fecha_pago_efectivo DATE,
    UNIQUE (prestamo_id, numero_cuota)
);

