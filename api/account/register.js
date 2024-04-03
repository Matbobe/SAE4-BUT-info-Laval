import express from 'express';
import { roles } from '../../config.js';

const router = express.Router();
import {
  pool,
  enteredPasscodes,
  passcodes,
  setSessionItems,
  hashPass,
} from '../../server.js';

router.post('', async (req, res) => {
  const {username, password, category} = req.body;
  const email = req.session.email; //since this is the last step of the registration process, the email is stored in the session

  const role = category.toUpperCase();

  const [results] = await pool.query(
    "SELECT count(*) as UsernameIdentique FROM user WHERE username = ?",
    [username]
  );
  
  if(results[0].UsernameIdentique > 0) {
    res.status(402).json({error: 'Pseudo déjà utilisé'});
    return;
  }

  //check if category is valid (!= admin)
  if (!roles.includes(role)) {
    res.status(403).json({error: 'Vous ne pouvez pas faire ça'});
    return;
  }

  if (!enteredPasscodes[email] || enteredPasscodes[email] != passcodes[email]) {
    res.status(403).json({error: 'Arretez de faire ça svp'});
    return;
  }

  const [exists] = await pool.query(
    'SELECT * FROM user WHERE email = ?',
    [email],
    (err, results) => {
      if (err) {
        console.error('Impossible de créer le compte :', err);
        res.status(500).json({error: 'Impossible de créer le compte'});
        return;
      }
    }
  );
    
  if (exists.length > 0) {
    res.status(409).json({error: 'Email déjà utilisée'});
    return;
  }
  const hashedPassword = hashPass(password);

  await pool.query(
    'INSERT INTO user (username, password, email, category) VALUES (?, ?, ?, ?)',

    [username, hashedPassword, email, role],
    (err) => {
      if (err) {
        console.error('Impossible de créer le compte :', err);
        res.status(500).json({error: 'Impossible de créer le compte '});
        return;
      }
    }
  );

  delete enteredPasscodes[email];

  await setSessionItems(req, username, role, email, 0, null);

  res.status(200).json({success: true});
});

export default router;
