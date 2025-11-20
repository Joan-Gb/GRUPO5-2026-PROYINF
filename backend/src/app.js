import express from "express";
import cors from "cors";

import simulationRoutes from "./routes/simulations.js";
import paymentRoutes from "./routes/payments.js";

import riskRoutes from "./routes/risk.js";

const app = express();

app.use(cors()); 
app.use(express.json());


app.use("/api/simulations", simulationRoutes); 
app.use("/api/payments", paymentRoutes);

app.use("/api/risk", riskRoutes);

app.get("/api", (req, res) => {
    res.json({ message: "API de Préstamos funcionando. Los servicios están disponibles en /api/simulations." });
});

app.use((err, req, res, next) => {
  console.error("Error en la aplicación:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
