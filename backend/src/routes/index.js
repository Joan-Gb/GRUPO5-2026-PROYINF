// backend/src/routes/index.js
import { Router } from "express";
import simulationsRouter from './simulations.js';

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

// Rutas relacionadas a simulaciones
router.use('/simulations', simulationsRouter);

export default router;
