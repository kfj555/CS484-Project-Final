"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.yearRouter = void 0;
const express_1 = __importDefault(require("express"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(process.cwd(), "data", "courses.db");
const db = new better_sqlite3_1.default(dbPath, { readonly: true });
exports.yearRouter = express_1.default.Router();
// full route would be 'http://localhost:3001/years"
// sends full list of years
exports.yearRouter.get("/", (req, res) => {
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
