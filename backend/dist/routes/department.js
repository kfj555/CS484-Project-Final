"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deptRouter = void 0;
const express_1 = __importDefault(require("express"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(process.cwd(), "data", "courses.db");
const db = new better_sqlite3_1.default(dbPath, { readonly: true });
exports.deptRouter = express_1.default.Router();
// full route would be 'http://localhost:3001/departments"
// sends full list of departments
exports.deptRouter.get("/", (req, res) => {
    const departments = db
        .prepare(`
      SELECT DISTINCT subj_cd, dept_name 
      FROM courses 
      ORDER BY dept_name ASC
      `)
        .all();
    console.log("departments", departments);
    if (!departments) {
        return res.status(400).json({ error: "DB Error" });
    }
    res.json(departments);
});
