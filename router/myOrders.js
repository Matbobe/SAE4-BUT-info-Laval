import express from "express";
import { pool } from "../server.js";

const router = express.Router();

router.get("", async (req, res) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/login?returnUrl=/myorders");
    return;
  }
  
  const [orders] = await pool.query(
    'SELECT * FROM transaction JOIN transactionContent ON transaction.transaction_id = transactionContent.transaction_id JOIN product ON transactionContent.product_id = product.id WHERE email = ? ORDER BY purchase_date DESC',
    [req.session.email]
  );
  res.render("myOrders", {
    cartSize: req.session.cart && req.session.cart.length,
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.category === "admin",
    username: req.session.username,
    orders: orders
  });
});
export default router;