import app from "./app.js";
import dotenv from "dotenv";
import pool from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

pool.connect()
  .then(client => {
    console.log("✅ Servidor Express y Base de Datos (PostgreSQL) CONECTADOS!");
    client.release();

    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ ERROR CRÍTICO: No se pudo conectar a PostgreSQL.", err.message);
    process.exit(1); 
  });