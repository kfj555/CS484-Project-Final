import express from "express";
import type { Request, Response } from "express";
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "courses.db");
const db = new Database(dbPath, { readonly: true });

export const yearRouter = express.Router();

// full route would be 'http://localhost:3001/years"
// sends full list of years
yearRouter.get("/", (req: Request, res: Response) => {
  const term = db
    .prepare(
      `
      SELECT DISTINCT year 
      FROM semesters
      ORDER BY year DESC
      `
    )
    .all();

  if (!term) {
    return res.status(400).json({ error: "DB Error" });
  }

  res.json(term);
});
