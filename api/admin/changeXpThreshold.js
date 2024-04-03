import express from 'express';
const router = express.Router();
import {pool} from '../../server.js';

router.post('', async (req, res) => {
  if (!req.session.isLoggedIn || req.session.category !== 'admin') {
    res.status(403).json({error: 'Accès refusé'});
    return;
  }

  const xpEvent = req.body.xpAmount;
  const xpGrade = req.body.xpThreshold;

  if (!xpEvent || !xpGrade || isNaN(xpEvent) || isNaN(xpGrade) || xpEvent < 0 || xpGrade < 0) {
    res.status(400).json({error: 'Veuillez entrer un nombre valide'});
    return;
  }

  try {
    await pool.query(
      'UPDATE xp SET quantite = ? WHERE nom = ?',
      [xpEvent, 'event'],
      (err) => {
        if (err) {
          console.error("Impossible de changer l'xp de l'event :", err);
          res.status(500).json({error: "Impossible de changer l'xp de l'event"});
          return;
        }
      }
    );

    await pool.query(
      'UPDATE xp SET quantite = ? WHERE nom = ?',
      [xpGrade, 'grade'],
      (err) => {
        if (err) {
          console.error("Impossible de changer l'xp de grade :", err);
          res.status(500).json({error: "Impossible de changer l'xp de grade"});
          return;
        }
      }
    );
  } catch (err) {
    console.error("Erreur lors du traitement des requêtes SQL :", err);
    res.status(500).send("Une erreur s'est produite");
    return;
  }

  res.status(200).json({success: true});
});

export default router;
