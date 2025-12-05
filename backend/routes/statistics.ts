import express from "express";
import type { Request, Response } from "express";
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "courses.db");
const db = new Database(dbPath, { readonly: true });

export const statisticsRouter = express.Router();

statisticsRouter.get("/", (req: Request, res: Response) => {
  res.json([]);
});

statisticsRouter.get("/all", (req: Request, res: Response) => {
  const { department, subj, level } = req.query;
  // Normalize and validate level to avoid producing `undefined%`.
  const stringLevel = String(level).trim();
  let dbCourseLevel: string;
  if (stringLevel === "all") { //get all levels
    dbCourseLevel = "%";
  } else { //get specific level sql query looks like c.subj_cd LIKE '1%'
    dbCourseLevel = `${stringLevel.at(0)}%`;
  }
  const rows = db
    .prepare(
      `
      SELECT c.subj_cd,
        c.course_nbr,
        c.instructor,
        ROUND( ( (4.0 * c.A + 3.0 * c.B + 2.0 * c.C + c.D) / (c.grade_regs - c.W) ), 2) AS avg_gpa
      FROM courses c
      JOIN semesters s ON c.semester_id = s.id
      WHERE c.dept_name = ? AND 
            c.subj_cd = ? AND
            c.course_nbr LIKE ? AND
            c.instructor <> ' ,' AND
            (c.A + c.B + c.C + c.D + c.F) > 0
      GROUP BY c.subj_cd,
              c.course_nbr,
              c.instructor
      ORDER BY c.course_nbr ASC, avg_gpa DESC
      `
    )
    .all(department, subj, dbCourseLevel) as {
    subj_cd: string;
    course_nbr: string;
    instructor: string;
    avg_gpa: number;
  }[];

  if (!rows) {
    return res.status(400).json({ error: "DB Error" });
  }


  res.json(rows);
});

type dbEasyCourseResponse = {
  subj_cd: string;
  course_nbr: string;
  title: string;
  instructor: string;
  A: number;
  B: number;
  C: number;
  D: number;
  F: number;
  S: number;
  U: number;
  W: number;
  grade_regs: number;
};

type easyCourseGpa = {
  subj_cd: string;
  course_nbr: string;
  title: string;
  instructor: string;
  avg_gpa: number;
  percent_A_grade: number;
  pass_rate: number;
  prereq_rate: number;
  withdraw_rate: number;
}

type easyCourseSatisfaction = {
  subj_cd: string;
  course_nbr: string;
  title: string;
  instructor: string;
  satisfaction_rate: number;
  withdraw_rate: number;
}

// Full route would be 'http://localhost:3001/statistics/easy?department=_&subj=_&level=_&minYear=_"
statisticsRouter.get("/easy", (req: Request, res: Response) => {
  const {department, subj, level, minYear} = req.query;
  const stringLevel = String(level).trim();
  let dbCourseLevel: string;
  if (stringLevel === "all") { //get all levels
    dbCourseLevel = "%";
  } else { //get specific level sql query looks like c.subj_cd LIKE '1%'
    dbCourseLevel = `${stringLevel.at(0)}%`;
  }
  // Placeholder implementation
  const rows = db
    .prepare(
      `
      SELECT c.subj_cd,
        c.course_nbr,
        c.title,
        c.instructor,
        c.A,
        c.B,
        c.C,
        c.D,
        c.F,
        c.S,
        c.U,
        c.W,
        c.grade_regs
      FROM courses c
      JOIN semesters s ON c.semester_id = s.id
      WHERE c.dept_name = ? AND
            c.subj_cd = ? AND
            c.course_nbr LIKE ? AND
            c.instructor <> ' ,' AND
            s.year >= ?
      GROUP BY c.subj_cd,
              c.course_nbr,
              c.instructor
      ORDER BY c.course_nbr ASC
      `
    )
    .all(department, subj, dbCourseLevel, minYear) as dbEasyCourseResponse[];
  
  if (!rows) {
    return res.status(400).json({ error: "DB Error" });
  }

  //Arrays to hold easy courses based on GPA and Satisfaction metrics
  const easyCoursesGpa: easyCourseGpa[] = [];
  const easyCoursesSatisfaction: easyCourseSatisfaction[] = [];

  //Loop through the result from the DB
  //For each course, get GPA related stats if grades exist, else get satisfaction related stats
  for (const course of rows) {
    const totalGrades = course.A + course.B + course.C + course.D + course.F;
    const totalSatisfaction = course.S + course.U;
    //If there are graded students, calculate GPA related metrics
    if (totalGrades > 0) {
      const avgGpa = (4.0 * course.A + 3.0 * course.B + 2.0 * course.C + 1.0 * course.D) / totalGrades;
      /*
      if (avgGpa < 3){
        continue; //skip courses that do not meet the easy course criteria
      }
      */
      const percentAGrade = (course.A / totalGrades) * 100;
      const passRate = ((course.A + course.B + course.C + course.D) / totalGrades) * 100;
      const prereqRate = ((course.A + course.B + course.C) / totalGrades) * 100;
      const withdrawRate = (course.W / course.grade_regs) * 100;
      easyCoursesGpa.push({
        subj_cd: course.subj_cd,
        course_nbr: course.course_nbr,
        title: course.title,
        instructor: course.instructor,
        avg_gpa: parseFloat(avgGpa.toFixed(2)),
        percent_A_grade: parseFloat(percentAGrade.toFixed(2)),
        pass_rate: parseFloat(passRate.toFixed(2)),
        prereq_rate: parseFloat(prereqRate.toFixed(2)),
        withdraw_rate: parseFloat(withdrawRate.toFixed(2)),
      });
      continue; //skip satisfaction calculation if grades exist
    }
    //When there are no graded students, calculate satisfaction related metrics if satisfaction data exists
    if (totalSatisfaction > 0) {
      const satisfactionRate = (course.S / totalSatisfaction) * 100;
      if(satisfactionRate < 70){
        continue; //skip courses that do not meet the easy course criteria
      }
      const withdrawRate = (course.W / course.grade_regs) * 100;
      easyCoursesSatisfaction.push({
        subj_cd: course.subj_cd,
        course_nbr: course.course_nbr,
        title: course.title,
        instructor: course.instructor,
        satisfaction_rate: parseFloat(satisfactionRate.toFixed(2)),
        withdraw_rate: parseFloat(withdrawRate.toFixed(2)),
      });
    }
  }

  //perform lexicographical sorting on the arrays based on the most important metric first
  easyCoursesGpa.sort((a, b) => 
    b.avg_gpa - a.avg_gpa ||
    b.percent_A_grade - a.percent_A_grade ||
    b.prereq_rate - a.prereq_rate ||
    b.pass_rate - a.pass_rate ||
    b.withdraw_rate - a.withdraw_rate
  );
  easyCoursesSatisfaction.sort((a, b) => 
    b.satisfaction_rate - a.satisfaction_rate ||
    a.withdraw_rate - b.withdraw_rate
  );

  //Next we create maps to group courses by subject code and course number.
  //Ex: [["CS 101", [course1, course2, ...]], ["CS 201", [course1, course2, ...]], ...]
  let easyGpaMap = new Map<string, {easyCoursesArr: easyCourseGpa[], totalGpa: number}>();
  for (const course of easyCoursesGpa) {
    const key = `${course.subj_cd} ${course.course_nbr}`;
    if (!easyGpaMap.has(key)) {
      easyGpaMap.set(key, {easyCoursesArr: [], totalGpa: 0});
    }
    const currentKeyData = easyGpaMap.get(key);
    currentKeyData?.easyCoursesArr.push(course);
    currentKeyData!.totalGpa += course.avg_gpa;
  }

  const easySatisfactionMap = new Map<string, easyCourseSatisfaction[]>();
  for (const course of easyCoursesSatisfaction) {
    const key = `${course.subj_cd} ${course.course_nbr}`;
    if (!easySatisfactionMap.has(key)) {
      easySatisfactionMap.set(key, []);
    }
    easySatisfactionMap.get(key)?.push(course); //if the key exists, push the course to the array otherwise do nothing
  }

  for (const [key, coursesData] of easyGpaMap) {
    if (coursesData){
      coursesData.totalGpa = parseFloat((coursesData.totalGpa / coursesData.easyCoursesArr.length).toFixed(2));
      if (coursesData.totalGpa < 3){
        easyGpaMap.delete(key); //remove the key if average GPA is below 3.0
      }
    }
  }

  //Sort the easyGpaMap by average GPA in descending order
  const sortedEasyGpaMap = new Map(
    Array.from(easyGpaMap.entries()).sort((a, b) => {
      return b[1].totalGpa - a[1].totalGpa;
    })
  );

  console.log("Easy GPA Courses Map:", sortedEasyGpaMap);

  const payload = {
    easyGpa: Object.fromEntries(sortedEasyGpaMap),
    easySatisfaction: Object.fromEntries(easySatisfactionMap),
  };

  res.json(payload);
});