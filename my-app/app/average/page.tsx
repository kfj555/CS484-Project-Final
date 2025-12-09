"use client";
import { useEffect, useState } from "react";
import { useStore } from "../store";
import Button from "../_components/Button";
import Select from "../_components/Select";
import SearchableSelect from "../_components/SearchableSelect";
import Card from "../_components/Card";

export default function ExactBody() {
  const {
    department,
    setDepartment,
    courseNumber,
    setCourseNumber,
    subj,
    setSubj,
    departments,
    setDepartments,
    courseNumbers,
    setCourseNumbers,
  } = useStore();

  const [loaded, setLoaded] = useState(false);

  const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
  // initial fetch sets all selections with persistence
  useEffect(() => {
    const fetchInitialData = async () => {
      const deptsRes = await fetch(`${BASE}/department`);
      const depts: { subj_cd: string; dept_name: string }[] = (
        await deptsRes.json()
      ).slice(1); // removes empty dept at start
      if (!depts.length) return;

      setDepartments(depts);

      // searches for saved department, otherwise defaults to first
      const deptMatch = depts.find(
        (d) => d.subj_cd === subj && d.dept_name === department
      );
      const currentDept = deptMatch ?? depts[0];

      setDepartment(currentDept.dept_name);
      setSubj(currentDept.subj_cd);

      // fetch courses
      const coursesRes = await fetch(
        `${BASE}/course?subj=${encodeURIComponent(
          currentDept.subj_cd
        )}&department=${encodeURIComponent(currentDept.dept_name)}`
      );
      const coursesData = await coursesRes.json();
      setCourseNumbers(coursesData);

      // either saved course or first course
      const currentCourse = coursesData.includes(courseNumber)
        ? courseNumber
        : coursesData[0];
      setCourseNumber(currentCourse);
    };
    const run = async () => {
      await fetchInitialData();
      setLoaded(true);
    };
    run();
  }, []);

  // fetch course numbers available for department, year, and term
  useEffect(() => {
    if (!loaded || !subj || !department) return;

    const fetchCourses = async () => {
      const res = await fetch(
        `${BASE}/course?subj=${encodeURIComponent(
          subj
        )}&department=${encodeURIComponent(department)}`
      );
      const data = await res.json();
      setCourseNumbers(data);
      const newCourse = data.includes(courseNumber) ? courseNumber : data[0];
      setCourseNumber(newCourse);
    };

    fetchCourses();
  }, [subj, department, loaded]);

  // used to determine loading state
  const loadingCourses = courseNumbers.length === 0;

  return (
    <div className="flex items-center justify-center w-full my-8">
      <div>
        <Card>
          <div className="flex flex-col gap-3">
            {/* Searchbar for departments */}
            {departments.length > 0 ? (
              <SearchableSelect
                label="Departments"
                items={departments}
                value={
                  departments.find(
                    (d) => d.subj_cd === subj && d.dept_name === department
                  ) ?? departments[0]
                } // initial value either saved or first
                getOptionText={(d) => `${d.dept_name} - ${d.subj_cd}`} // format for the options list
                onChange={(d) => {
                  setDepartment(d.dept_name);
                  setSubj(d.subj_cd);
                }}
              />
            ) : (
              <Select label="Departments" items={[]} loading={true} />
            )}
            {/* Select bar for year, terms/seasons, and course numbers */}
            <Select
              label="Course Numbers"
              items={courseNumbers}
              value={courseNumber}
              onChange={setCourseNumber}
              loading={loadingCourses}
            />
            <div className="flex justify-evenly">
              <Button href="./">Back</Button>
              <Button
                href={`./graph?type=average&s=${encodeURIComponent(
                  subj
                )}&d=${encodeURIComponent(department)}&n=${encodeURIComponent(
                  courseNumber
                )}`}
              >
                Get Graph
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
