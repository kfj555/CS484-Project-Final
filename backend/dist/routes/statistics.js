"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statisticsRouter = void 0;
const express_1 = __importDefault(require("express"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(process.cwd(), "data", "courses.db");
const db = new better_sqlite3_1.default(dbPath, { readonly: true });
exports.statisticsRouter = express_1.default.Router();
exports.statisticsRouter.get("/", (req, res) => {
    res.json([]);
});
exports.statisticsRouter.get("/easy", (req, res) => {
    const { department, subj, level } = req.query;
    // Normalize and validate level to avoid producing `undefined%`.
    const stringLevel = String(level).trim();
    let dbCourseLevel;
    if (stringLevel === "all") {
        dbCourseLevel = "%";
    }
    else {
        dbCourseLevel = `${stringLevel[0]}%`;
    }
    const rows = db
        .prepare(`
      SELECT c.subj_cd,
        c.course_nbr,
        c.instructor,
        ROUND( ( (4.0 * c.A + 3.0 * c.B + 2.0 * c.C + c.D) / (c.grade_regs - c.W) ), 2) AS avg_gpa
      FROM courses c
      JOIN semesters s ON c.semester_id = s.id
      WHERE c.dept_name = ? AND 
            c.subj_cd = ? AND
            c.course_nbr LIKE ?
      GROUP BY c.subj_cd,
              c.course_nbr,
              c.instructor
      HAVING avg_gpa >= 3
      ORDER BY c.course_nbr ASC, avg_gpa DESC
      `)
        .all(department, subj, dbCourseLevel);
    if (!rows) {
        return res.status(400).json({ error: "DB Error" });
    }
    console.log("easy courses", department, subj, level, rows);
    res.json(rows);
});
