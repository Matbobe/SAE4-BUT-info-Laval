import express from "express";
const router = express.Router();
import { passcodes, enteredPasscodes } from "../server.js";

router.get("", async (req, res) => {
  const isVerified =
    req.session.email &&
    passcodes[req.session.email] &&
    enteredPasscodes[req.session.email] &&
    passcodes[req.session.email] === enteredPasscodes[req.session.email];

  res.render("login", {
    verifiedRegisterEmail: isVerified,
    cartSize: req.session.cart && req.session.cart.length,
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
});
export default router;
