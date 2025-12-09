import express from "express";
import type { Request, Response } from "express";
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "courses.db");
const db = new Database(dbPath, { readonly: true });

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
        SELECT title,
        subj_cd,
        dept_name,
        course_nbr, 
        COUNT(title) as times,
        SUM(grade_regs) as total_students,
        (SUM(S) * 1.0 / (SUM(grade_regs) - SUM(W)) * 100) as avg_sr,
        ((SUM(A) + SUM(B) + SUM(C) + SUM(D)) * 1.0 / (SUM(grade_regs) - SUM(W)) * 100) as avg_pr,
        (4 * SUM(A) + 3 * SUM(B) + 2 * SUM(C) + SUM(D) * 1.0) / (SUM(grade_regs) - SUM(W)) as avg_gpa
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

// instructorRouter.get("/info", (req: Request, res: Response) => {
//   const { name } = req.query;
//   // (4 * A + 3 * B + 2 * C + D) /grade_regs - W;
//   const instructor = db
//     .prepare(
//       `
//         SELECT title, subj_cd, dept_name, course_nbr, (4 * A + 3 * B + 2 * C + D * 1.0) / (grade_regs - W) as avg_gpa
//         FROM courses
//         WHERE instructor = ?
//         GROUP BY title
//       `
//     )
//     .all(name);

//   console.log("instructor info", instructor);

//   if (!instructor) {
//     return res.status(400).json({ error: "DB Error" });
//   }

//   res.json(instructor);
// });
