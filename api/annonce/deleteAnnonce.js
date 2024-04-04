import express from "express";
const router = express.Router();
import { pool } from "../../server.js";

router.post("", async (req, res) => {
  const { id } = req.body;

  if (!req.session.isLoggedIn || req.session.category !== "admin") {
    res.status(403).json({ error: "Accès refusé" });
    return;
  }

  if (!id) {
    res.status(400).json({ error: "Veuillez remplir tous les champs" });
    return;
  }

  try {
    await pool.query(
      "DELETE FROM annonce WHERE id = ?",
      [id]
    );

    res.status(200).json({ message: "Annonce supprimée" });
  } catch (error) {
    console.error("Error in deleteAnnonce.js", error);
    res.status(500).json({ error: "Erreur lors de la suppression de l'annonce" });
  }
});

export default router;
