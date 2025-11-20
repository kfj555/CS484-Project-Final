"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instructorRouter = void 0;
const express_1 = __importDefault(require("express"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(process.cwd(), "data", "courses.db");
const db = new better_sqlite3_1.default(dbPath, { readonly: true });
exports.instructorRouter = express_1.default.Router();
// full route would be 'http://localhost:3001/instructor"
// sends full list of instructors
exports.instructorRouter.get("/", (req, res) => {
    const instructor = db
        .prepare(`
      SELECT DISTINCT instructor 
      FROM courses
      WHERE instructor != 'Grad Asst'
      ORDER BY instructor ASC
      `)
        .all();
    console.log("instructor", instructor);
    if (!instructor) {
        return res.status(400).json({ error: "DB Error" });
    }
    res.json(instructor);
});
exports.instructorRouter.get("/info", (req, res) => {
    const { name } = req.query;
    // (4 * A + 3 * B + 2 * C + D) /grade_regs - W;
    const instructor = db
        .prepare(`
        SELECT title, AVG((4 * A + 3 * B + 2 * C + D * 1.0) / (grade_regs - W)) as avg_gpa
        FROM courses
        WHERE instructor = ?
        GROUP BY title
      `)
        .all(name);
    console.log("instructor info", instructor);
    if (!instructor) {
        return res.status(400).json({ error: "DB Error" });
    }
    res.json(instructor);
});
