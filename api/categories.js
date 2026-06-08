import { Pool } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,DELETE,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // GET ALL CATEGORIES
    if (req.method === "GET") {
      const result = await pool.query(
        "SELECT * FROM categories ORDER BY name ASC"
      );

      return res.status(200).json(result.rows);
    }

    // ADD CATEGORY
    if (req.method === "POST") {
      const { name } = req.body;

      await pool.query(
        "INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
        [name]
      );

      return res.status(200).json({
        success: true,
        message: "Category added",
      });
    }

    // DELETE CATEGORY
    if (req.method === "DELETE") {
      const { name } = req.body;

      await pool.query(
        "DELETE FROM categories WHERE name = $1",
        [name]
      );

      return res.status(200).json({
        success: true,
        message: "Category deleted",
      });
    }

    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}