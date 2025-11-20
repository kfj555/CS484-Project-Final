"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.js
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const course_js_1 = require("./routes/course.js");
const department_js_1 = require("./routes/department.js");
const year_js_1 = require("./routes/year.js");
const semesters_js_1 = require("./routes/semesters.js");
const statistics_js_1 = require("./routes/statistics.js");
const instructor_js_1 = require("./routes/instructor.js");
const app = (0, express_1.default)();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
app.use((0, cors_1.default)());
app.use("/course", course_js_1.courseRouter);
app.use("/department", department_js_1.deptRouter);
app.use("/year", year_js_1.yearRouter);
app.use("/semesters", semesters_js_1.semesterRouter);
app.use("/statistics", statistics_js_1.statisticsRouter);
app.use("/instructor", instructor_js_1.instructorRouter);
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
