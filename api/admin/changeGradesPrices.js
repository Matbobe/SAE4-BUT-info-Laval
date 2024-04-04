import express from 'express';
const router = express.Router();
import {pool} from '../../server.js';

router.post('', async (req, res) => {
  const {ironprice, goldprice, diamantprice} = req.body;

  if (!req.session.isLoggedIn || req.session.category !== 'admin') {
    res.status(403).json({error: 'Accès refusé'});
    return;
  }

  if (
    !ironprice ||
    !goldprice ||
    !diamantprice ||
    isNaN(ironprice) ||
    isNaN(goldprice) ||
    isNaN(diamantprice) ||
    ironprice <= 0 ||
    goldprice <= 0 ||
    diamantprice <= 0 ||
    ironprice > 1000 ||
    goldprice > 1000 ||
    diamantprice > 1000
  ) {
    res.status(400).json({error: 'Veuillez entrer un nombre valide'});
    return;
  }

  await pool.query(
    'UPDATE grade SET price = ? WHERE name = ?',
    [ironprice, 'iron'],
    (err) => {
      if (err) {
        console.error('Impossible de changer le prix :', err);
        res.status(500).json({error: 'Impossible de changer le prix de iron'});
        return;
      }
    }
  );

  await pool.query(
    'UPDATE grade SET price = ? WHERE name = ?',
    [goldprice, 'gold'],
    (err) => {
      if (err) {
        console.error('Impossible de changer le prix :', err);
        res.status(500).json({error: 'Impossible de changer le prix de gold'});
        return;
      }
    }
  );

  await pool.query(
    'UPDATE grade SET price = ? WHERE name = ?',
    [diamantprice, 'diamant'],
    (err) => {
      if (err) {
        console.error('Impossible de changer le prix :', err);
        res
          .status(500)
          .json({error: 'Impossible de changer le prix de diamant'});
        return;
      }
    }
  );

  res.status(200).json({success: true});
});

export default router;
