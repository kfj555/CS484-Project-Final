import express from "express";
import type { Request, Response } from "express";
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "courses.db");
const db = new Database(dbPath, { readonly: true });

export const courseRouter = express.Router();

// full route would be 'http://localhost:3001/course?department=_"
// sends list of course numbers given department name and subj
courseRouter.get("/", (req: Request, res: Response) => {
  const { department, subj } = req.query;

  const courses = db
    .prepare(
      `
      SELECT DISTINCT course_nbr
      FROM courses
      WHERE dept_name = ?
      AND subj_cd = ?
      ORDER BY course_nbr ASC
      `
    )
    .all(department, subj) as { course_nbr: string }[];
  const courseNumbers = courses.map((r) => r.course_nbr);

  console.log("courses ", courseNumbers);

  if (!courseNumbers) {
    return res.status(400).json({ error: "DB Error" });
  }

  res.json(courseNumbers);
});

// full route would be 'http://localhost:3001/course/exact?dept=_&term=_&year=_&cn=_"
// sends all information as an exact course given its dept, term, year, and course number
// (i.e Computer Science 484 Fall 2025)
courseRouter.get("/exact", (req: Request, res: Response) => {
  const { dept, subj, term, year, cn } = req.query;

  if (!dept || !subj || !term || !year || !cn) {
    return res.status(400).json({ error: "Missing query parameters" });
  }

  const course = db
    .prepare(
      `
      SELECT c.*, s.season, s.year
      FROM courses c
      JOIN semesters s ON c.semester_id = s.id
      WHERE c.dept_name = ? AND c.subj_cd = ? AND c.course_nbr = ? AND s.season = ? AND s.year = ?
      `
    )
    .all(dept, subj, cn, term.toString().toUpperCase(), year);

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  console.log(course);

  res.json(course);
});

// returns course info given only department and subj
courseRouter.get("/history", (req: Request, res: Response) => {
  const { department, subj } = req.query;

  const course = db
    .prepare(
      `
      SELECT c.*, s.season, s.year
      FROM courses c
      JOIN semesters s on c.semester_id = s.id
      WHERE c.dept_name = ? AND c.subj_cd = ?
      `
    )
    .all(department, subj);

  console.log("average ", course);

  res.json(course);
});

// returns average of all data given only num and dept
courseRouter.get("/average", (req: Request, res: Response) => {
  const { department, subj, cn } = req.query;

  const course = db
    .prepare(
      `
      SELECT 
      AVG(A) AS A, 
      AVG(B) AS B, 
      AVG(C) AS C, 
      AVG(D) AS D, 
      AVG(F) AS F, 
      AVG(W) AS W, 
      AVG(S) AS S, 
      AVG(U) AS U, 
      AVG(grade_regs) AS grade_regs,
      AVG(NR) AS NR,
      subj_cd,
      course_nbr, 
      title 
      FROM courses c
      WHERE dept_name = ? AND subj_cd = ? AND course_nbr = ?
      GROUP BY dept_name, subj_cd
      `
    )
    .all(department, subj, cn);

  console.log("eee: ", `subj=${subj} department=${department} cn=${cn}`);
  console.log("history ", course);

  res.json(course);
});
