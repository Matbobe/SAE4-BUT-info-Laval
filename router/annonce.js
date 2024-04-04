import express, { json } from "express";
const router = express.Router();
import { pool } from "../server.js";

router.get("", async (req, res) => {
  try {
    const [annonces] = await pool.query("SELECT * FROM annonce");

    res.render("annonce", {
      annonces,
      cartSize: req.session.cart && req.session.cart.length,
      isLoggedIn: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
    });
  } catch (err) {
    res.status(500).send("Une erreur s'est produite");
  }
});

export default router;
