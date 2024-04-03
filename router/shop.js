import express from "express";
const router = express.Router();
import { pool } from "../server.js";

router.get("", async (req, res) => {
  var splashProduct;
  var splashImage;
  var background_color;
  var products = [];

  //get the splash product (product.is_promoted = 1)

  try {
    const [splashResults] = await pool.query(
      "SELECT * FROM product WHERE is_promoted = 1 ORDER BY release_date DESC"
    );
    if (splashResults.length === 0) {
      splashProduct = "None";
      splashImage = "None";
      background_color="None"
    } else {
      splashProduct = splashResults["0"].name;
      splashImage = splashResults["0"].image;
      background_color = splashResults["0"].background_color;
    }

    //get all products
    const [productsResults] = await pool.query("SELECT * FROM product");

    products = productsResults;
  } catch (err) {
    console.error(err);
  }

  if (req.session) {
    req.session.isLoggedIn || false;
    req.session.isAdmin || false;
  }

  res.render("shop", {
    cartSize: req.session.cart && req.session.cart.length,

    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
    splashProduct: splashProduct,
    splashImage: splashImage,
    background_color: background_color,
    products: products,
  });
});
export default router;
