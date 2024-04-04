import express from "express";
const router = express.Router();
import { pool } from "../../server.js";

router.post("", async (req, res) => {
  const { content, id } = req.body;

  if (!req.session.isLoggedIn || req.session.category !== "admin") {
    res.status(403).json({ error: "Accès refusé" });
    return;
  }

  if (!content || !id) {
    res.status(400).json({ error: "Veuillez remplir tous les champs" });
    return;
  }

  try {
    await pool.query(
      "UPDATE annonce SET content = ? WHERE id = ?",
      [content, id]
    );

    res.status(200).json({ message: "Annonce modifiée" });
  } catch (error) {
    console.error("Error in editAnnonce.js", error);
    res.status(500).json({ error: "Erreur lors de la modification de l'annonce" });
  }
});

export default router;
