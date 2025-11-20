import express from "express";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = path.join(__dirname, "../data/courses.db");
let db;
try {
    db = new Database(dbPath, { readonly: true });
}
catch (err) {
    console.error("Failed to open SQLite database:", err);
    process.exit(1);
}
export const yearRouter = express.Router();
// full route would be 'http://localhost:3001/years"
// sends full list of years
yearRouter.get("/", (req, res) => {
    const { s, d } = req.query;
    const term = db
        .prepare(`
      SELECT DISTINCT s.year 
      FROM semesters AS s
      JOIN courses as c
      ON c.semester_id = s.id
      WHERE c.subj_cd = ? AND c.dept_name = ?
      ORDER BY year DESC
      `)
        .all(s, d);
    const years = term.map((r) => r.year);
    if (!years) {
        return res.status(400).json({ error: "DB Error" });
    }
    console.log("year ", years);
    res.json(years);
});
