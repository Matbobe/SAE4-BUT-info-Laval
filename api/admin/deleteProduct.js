import express from "express";
const router = express.Router();
import { pool } from "../../server.js";

router.post("", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing required parameter id" });
  }

  try {
    const query = "DELETE FROM product WHERE id = ?";
    await pool.query(query, [id]);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the product" });
  }
});

export default router;
