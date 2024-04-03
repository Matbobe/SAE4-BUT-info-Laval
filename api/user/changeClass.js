import express from 'express';
const router = express.Router();
import { pool } from '../../server.js';
import { roles } from '../../config.js';

router.post('', async (req, res) => {
  var classe = req.body.classe;
  var email = req.session.email;

  const role = classe.toUpperCase();

  if (classe && email) {
    if (!roles.includes(role)) {
      res.status(400).json({error: 'Veuillez entrer une classe valide'});
      return;
    }

    await pool.query(
      'UPDATE user SET category = ? WHERE email = ?',
      [classe, email],
      (err) => {
        if (err) {
          console.error('Impossible de changer la classe :', err);
          res.status(500).json({error: 'Impossible de changer la classe'});
          return;
        }
      }
    );
    req.session.category = role;
    res.status(200).json({success: true});
  } else {
    res.status(400).json({error: 'Veuillez entrer une classe valide'});
  }
});

export default router;
