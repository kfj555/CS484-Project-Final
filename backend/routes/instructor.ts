import express from "express";
import type { Request, Response } from "express";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.join(__dirname, "../data/courses.db");

let db: Database.Database;
try {
  db = new Database(dbPath, { readonly: true });
} catch (err) {
  console.error("Failed to open SQLite database:", err);
  process.exit(1);
}

export const instructorRouter = express.Router();

// full route would be 'http://localhost:3001/instructor"
// sends full list of instructors
instructorRouter.get("/", (req: Request, res: Response) => {
  const instructor = db
    .prepare(
      `
      SELECT DISTINCT instructor 
      FROM courses
      WHERE instructor != 'Grad Asst'
      ORDER BY instructor ASC
      `
    )
    .all();

  console.log("instructor", instructor);

  if (!instructor) {
    return res.status(400).json({ error: "DB Error" });
  }

  res.json(instructor);
});

instructorRouter.get("/info", (req: Request, res: Response) => {
  const { name } = req.query;
  // (4 * A + 3 * B + 2 * C + D) /grade_regs - W;
  const instructor = db
    .prepare(
      `
        SELECT title, AVG((4 * A + 3 * B + 2 * C + D * 1.0) / (grade_regs - W)) as avg_gpa
        FROM courses
        WHERE instructor = ?
        GROUP BY title
      `
    )
    .all(name);

  console.log("instructor info", instructor);

  if (!instructor) {
    return res.status(400).json({ error: "DB Error" });
  }

  res.json(instructor);
});
