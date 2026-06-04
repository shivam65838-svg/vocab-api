import { Pool } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // GET ALL WORDS
    if (req.method === "GET") {
      const result = await pool.query(
        "SELECT * FROM vocabulary ORDER BY created_at DESC"
      );

      return res.status(200).json(result.rows);
    }

    // ADD NEW WORD
    if (req.method === "POST") {
      const {
        id,
        word,
        hindi_meaning,
        mnemonic,
        example,
        category,
        difficulty,
        status,
      } = req.body;

      await pool.query(
        `INSERT INTO vocabulary
        (id, word, hindi_meaning, mnemonic, example, category, difficulty, status)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          id,
          word,
          hindi_meaning,
          mnemonic,
          example,
          category,
          difficulty,
          status,
        ]
      );

      return res.status(200).json({
        success: true,
        message: "Word saved successfully",
      });
    }

    // UPDATE STATUS
    if (req.method === "PUT") {
      const { id, status } = req.body;

      await pool.query(
        "UPDATE vocabulary SET status = $1 WHERE id = $2",
        [status, id]
      );

      return res.status(200).json({
        success: true,
        message: "Status updated successfully",
      });
    }

    // DELETE WORD
    if (req.method === "DELETE") {
      const { id } = req.body;

      await pool.query(
        "DELETE FROM vocabulary WHERE id = $1",
        [id]
      );

      return res.status(200).json({
        success: true,
        message: "Word deleted successfully",
      });
    }

    return res.status(405).json({
      error: "Method not allowed",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
}