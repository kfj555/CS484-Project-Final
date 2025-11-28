"use client";

import { useEffect, useState, useRef, Activity } from "react";
import SearchableSelect from "../_components/SearchableSelect";
import Select from "../_components/Select";
import "../_styles/easy-courses.css";
import Link from "next/link";

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

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
const Easy_courses = () => {
    const courseLevels: string[] = ["all", "100", "200", "300", "400", "500"];

    //Department related state
    const [departmentsArr, setDepartmentsArr] = useState<string[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    //Year related state
    const [yearsArr, setYearsArr] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    //Course level related state
    const [selectedCourseLevel, setSelectedCourseLevel] = useState<string>(courseLevels[0]);
    //Data from data query
    const [easyGpaCourses, setEasyGpaCourses] = useState<Record<string, easyCourseGpa[]>>({});
    const [easySatisfactionCourses, setEasySatisfactionCourses] = useState<Record<string, easyCourseSatisfaction[]>>({});
    const [courseAvgGpas, setCourseAvgGpas] = useState<Record<string, number>>({});
    //Track if search button was clicked
    const [showResults, setShowResults] = useState<boolean>(false);
    const [allowRenderTable, setAllowRenderTable] = useState<boolean>(false);
    //Track if hide button was clicked
    const [hideMenu, setHideMenu] = useState<boolean>(false);
    //Prevent user from requesting the same data multiple times
    const fetchedDataRef = useRef<string>("");
    //Show top button when scrolled down
    const [showTopButton, setShowTopButton] = useState<boolean>(false);

    // Listen to window scroll so the fixed button appears when the user scrolls the page
    useEffect(() => {
        const onWindowScroll = () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            // avoid division by zero; if no scrollable area, hide the button
            if (!scrollable) {
                setShowTopButton(false);
                return;
            }
            const pct = window.scrollY / scrollable; // 0..1
            if (pct > 0.5) setShowTopButton(true); // show after 50% of page
            else setShowTopButton(false);
        };

        // Attach listener and do an initial check
        window.addEventListener("scroll", onWindowScroll, { passive: true });
        onWindowScroll();

        return () => window.removeEventListener("scroll", onWindowScroll);
    }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            //Fetch Departments
            const deptRes = await fetch(`${BASE}/department`);
            const deptData = await deptRes.json();
            const departments = deptData.splice(1);
            setDepartmentsArr(
                departments.map(
                    (dept: { dept_name: string; subj_cd: string }) =>
                        `${dept.dept_name} - ${dept.subj_cd}`
                )
            );
            setSelectedDepartment(`${departments[0]?.dept_name} - ${departments[0]?.subj_cd}`);
            //Get Years for the first department by default
            const yearRes = await fetch(`${BASE}/year?s=${encodeURIComponent(departments[0]?.subj_cd)}&d=${encodeURIComponent(departments[0]?.dept_name)}`);
            const yearData = await yearRes.json();
            setYearsArr(yearData.reverse());
            setSelectedYear(yearData[0] || null);
        };
        fetchData();
    },[]);

    //Fetch years when department changes
    useEffect(() => {
        const fetchYears = async () => {
            const [deptName, subjCode] = selectedDepartment.split(" - ");
            const yearRes = await fetch(`${BASE}/year?s=${encodeURIComponent(subjCode)}&d=${encodeURIComponent(deptName)}`);
            const yearData = await yearRes.json();
            setYearsArr(yearData.reverse());
            setSelectedYear(yearData[0] || null);
        };
        if (selectedDepartment) {
            fetchYears();
        }
    }, [selectedDepartment]);

    //Handler function for finding easy courses when button is clicked
    function handleFindEasyCourses() {
        async function fetchEasyCourses() {
            const [deptName, subjCode] = selectedDepartment.split(" - ");
            const easyCoursesRes = await fetch(
                `${BASE}/statistics/easy?department=${encodeURIComponent(deptName)}&subj=${encodeURIComponent(subjCode)}&level=${encodeURIComponent(selectedCourseLevel)}&minYear=${encodeURIComponent(selectedYear ?? "")}`
            );
            const easyCoursesData = await easyCoursesRes.json();
            
            // Transform the backend data structure to extract just the arrays
            const transformedGpa: Record<string, easyCourseGpa[]> = {};
            const transformedAvgGpas: Record<string, number> = {};
            for (const [key, value] of Object.entries(easyCoursesData.easyGpa || {})) {
                const courseData = value as { easyCoursesArr: easyCourseGpa[]; totalGpa: number };
                transformedGpa[key] = courseData.easyCoursesArr;
                transformedAvgGpas[key] = courseData.totalGpa;
            }
            
            setEasyGpaCourses(transformedGpa);
            setCourseAvgGpas(transformedAvgGpas);
            setEasySatisfactionCourses(easyCoursesData.easySatisfaction);
            setShowResults(true);
            // use the fetched data directly to determine whether to render the table
            if (Object.keys(easyCoursesData.easyGpa).length > 0 || Object.keys(easyCoursesData.easySatisfaction).length > 0) {
                setAllowRenderTable(true);
            } else {
                setAllowRenderTable(false);
            }
        }
        if(fetchedDataRef.current !== `${selectedDepartment}-${selectedCourseLevel}-${selectedYear}`) {
          fetchEasyCourses();
          fetchedDataRef.current = `${selectedDepartment}-${selectedCourseLevel}-${selectedYear}`;
        }
    }
    
    function getGpaColor(gpa: number): string {
        // Green at 4.0 and yellow at 3.0
        const red = Math.min(255, Math.round((4.0 - gpa) * 255));
        const green = Math.min(255, Math.round((gpa - 1.0) * 110));
        return `rgb(${red}, ${green}, 0)`;
    }

    function getPercentColor(percent: number): string {
        // Green at 100%, yellow at 50%, red at 0%
        let red: number, green: number;
        
        if (percent >= 50) {
            // 50-100%: transition from yellow to green
            red = Math.round(((100 - percent) / 50) * 255);
            green = 255;
        } else {
            // 0-50%: transition from red to yellow
            red = 255;
            green = Math.round((percent / 50) * 255);
        }
        
        return `rgb(${red}, ${green}, 0)`;
    }

    //Render table function
    function renderTable(){
        return (    
            <div className="all-tables-container">
                {/* GPA-based Easy Courses */}
                <div className="tables-container">
                    {Object.entries(easyGpaCourses).length > 0 && <h2 className="text-2xl font-bold mb-4">Easy Courses by GPA</h2>}
                    {Object.entries(easyGpaCourses).map(([courseKey, courses]) => (
                        <div key={courseKey} className="table-container">
                            <table>
                                <caption className="course-name">{`${courseKey}: ${courses[0].title} (Avg GPA: ${courseAvgGpas[courseKey]?.toFixed(2) || "N/A"})`}</caption>
                                <thead className="course-table-header">
                                    <tr>
                                        <th title="The instructor for the course">Instructor</th>
                                        <th title="Average Grade Point Average">Avg GPA</th>
                                        <th title="Percentage of students with an A in the course">% A Grade</th>
                                        <th title="Percentage of students who passed the course">Pass Rate</th>
                                        <th title="Percentage of students who met the prerequisite rate. (C grade or better)">Prereq Rate</th>
                                        <th title="Percentage of students who withdrew from the course">Withdraw Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map((course, idx) => (
                                        <tr key={idx}>
                                            <td className="course-instructor-name-cell">
                                              <a href={`/instructors?name=${encodeURIComponent(course.instructor)}`}>
                                                {course.instructor}
                                              </a>
                                            </td>
                                            <td style={{ backgroundColor: getGpaColor(course.avg_gpa) }}>{course.avg_gpa.toFixed(2)}</td>
                                            <td style={{ backgroundColor: getPercentColor(course.percent_A_grade)}}>{course.percent_A_grade.toFixed(1)}%</td>
                                            <td style={{backgroundColor: getPercentColor(course.pass_rate)}}>{course.pass_rate.toFixed(1)}%</td>
                                            <td style={{ backgroundColor: getPercentColor(course.prereq_rate) }}>{course.prereq_rate.toFixed(1)}%</td>
                                            <td>{course.withdraw_rate.toFixed(1)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>

                {/* Satisfaction-based Easy Courses */}
                <div className="tables-container">
                    {Object.entries(easySatisfactionCourses).length > 0 && <h2 className="text-2xl font-bold mb-4">Easy Courses by Satisfaction</h2>}
                    {Object.entries(easySatisfactionCourses).map(([courseKey, courses]) => (
                        <div key={courseKey} className="table-container">
                            <table>
                                <caption className="course-name">{`${courseKey}: ${courses[0].title}`}</caption>
                                <thead className="course-table-header">
                                    <tr>
                                        <th>Instructor</th>
                                        <th>Satisfaction Rate</th>
                                        <th>Withdraw Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map((course, idx) => (
                                        <tr key={idx}>
                                            <td className="course-instructor-name-cell">
                                              <a href={`/instructors?name=${encodeURIComponent(course.instructor)}`}>
                                                {course.instructor}
                                              </a>
                                            </td>
                                            <td title="Percentage of students that have earned satisfactory grade" style={{backgroundColor: getPercentColor(course.satisfaction_rate)}}>
                                              {course.satisfaction_rate.toFixed(1)}%
                                            </td>
                                            <td title="The percentage of students who withdrew from the course">{course.withdraw_rate.toFixed(1)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
          <Link href="/" id="easy-courses-back-button" className="ml-4 mt-4">Back</Link>
          <div className="flex flex-col items-center">
            <Activity mode={hideMenu ? "hidden" : "visible"}>
              <div className="flex flex-col items-center">
                  <SearchableSelect label="Departments" items={departmentsArr} value={selectedDepartment} onChange={setSelectedDepartment}/>
                  <Select label="Course Levels" items={courseLevels} value={selectedCourseLevel} onChange={setSelectedCourseLevel}/>
                  <Select label="Minimum Year" items={yearsArr} value={selectedYear ?? ""} onChange={(val) => setSelectedYear(Number(val))} />
              </div>
            </Activity>
            <div id="easy-courses-button-container">
              <button id="find-courses-button" onClick={handleFindEasyCourses}>Find Courses</button>
              <button id="hide-menu-button" onClick={() => setHideMenu(!hideMenu)}>{hideMenu ? "Show" : "Hide"}</button>
            </div>
          </div>
          <div id="easy-courses-results-container">
              {showResults && allowRenderTable ? renderTable() : <h3 className="mt-4 text-center">No results to display</h3>}
          </div>
          {showTopButton && (
              <button
                  id="scroll-to-top-button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                  Scroll to Top
              </button>
          )}
        </div>
    );
}

export default Easy_courses;