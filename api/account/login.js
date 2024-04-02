import express from "express";
import { checkPass } from "../../server.js";
const router = express.Router();
import { pool, setSessionItems } from "../../server.js";

router.post("", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [results] = await pool.query(
      "SELECT category, email, xp, name ,password  FROM user LEFT JOIN grade ON grade.id = user.grade WHERE username = ?",
      [username, password]
    );
    const checkpass=checkPass(password, results[0].password);
    if (!checkpass) {
      res.status(402).json({ error: "Mot de passe incorrect" });
      return;
    }
    
    
    if (results.length === 0) {
      res.status(401).json({ error: "Pseudo incorrect" });
      return;
    }
    req.session.isAdmin = results[0].category === "admin";

    await setSessionItems(
      req,
      username,
      results[0].category,
      results[0].email,
      results[0].xp,
      results[0].name
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ error: "Impossible de récupérer l'utilisateur" });
  }
});

export default router;
