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

export const deptRouter = express.Router();

// full route would be 'http://localhost:3001/departments"
// sends full list of departments
deptRouter.get("/", (req: Request, res: Response) => {
  const departments = db
    .prepare(
      `
      SELECT DISTINCT subj_cd, dept_name 
      FROM courses 
      ORDER BY dept_name ASC
      `
    )
    .all();

  console.log("departments", departments);

  if (!departments) {
    return res.status(400).json({ error: "DB Error" });
  }

  res.json(departments);
});
