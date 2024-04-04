import express from "express";
const router = express.Router();
import { pool } from "../../server.js";

router.post("", async (req, res) => {
  const { content } = req.body;

  if (!req.session.isLoggedIn || req.session.category !== "admin") {
    res.status(403).json({ error: "Accès refusé" });
    return;
  }

  if (!content) {
    res.status(400).json({ error: "Veuillez remplir tous les champs" });
    return;
  }

  const created_at = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    await pool.query(
      "INSERT INTO annonce (created_at, content) VALUES (?, ?)",
      [created_at, content]
    );

    res.status(200).json({ message: "Annonce créée" });
  } catch (error) {
    console.error("Error in createAnnonce.js", error);
    res.status(500).json({ error: "Erreur lors de la création de l'annonce" });
  }
});

export default router;
