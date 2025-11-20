"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRouter = void 0;
const express_1 = __importDefault(require("express"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(process.cwd(), "data", "courses.db");
const db = new better_sqlite3_1.default(dbPath, { readonly: true });
exports.courseRouter = express_1.default.Router();
// full route would be 'http://localhost:3001/course?department=_"
// sends list of course numbers given department name
exports.courseRouter.get("/", (req, res) => {
    const { department } = req.query;
    const courses = db
        .prepare(`
      SELECT DISTINCT course_nbr 
      FROM courses
      WHERE dept_name = ?
      ORDER BY course_nbr ASC
      `)
        .all(department);
    console.log("courses ", courses);
    if (!courses) {
        return res.status(400).json({ error: "DB Error" });
    }
    res.json(courses);
});
// full route would be 'http://localhost:3001/course/exact?dept=_&term=_&year=_&cn=_"
// sends all information as an exact course given its dept, term, year, and course number
// (i.e Computer Science 484 Fall 2025)
exports.courseRouter.get("/exact", (req, res) => {
    const { dept, term, year, cn } = req.query;
    if (!dept || !term || !year || !cn) {
        return res.status(400).json({ error: "Missing query parameters" });
    }
    const course = db
        .prepare(`
      SELECT c.*, s.season, s.year
      FROM courses c
      JOIN semesters s ON c.semester_id = s.id
      WHERE c.subj_cd = ? AND c.course_nbr = ? AND s.season = ? AND s.year = ?
      `)
        .all(dept, cn, term.toString().toUpperCase(), year);
    if (!course) {
        return res.status(404).json({ error: "Course not found" });
    }
    console.log(course);
    res.json(course);
});
