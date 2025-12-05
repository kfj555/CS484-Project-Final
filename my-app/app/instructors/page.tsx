"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Card from "../_components/Card";
import SearchableSelect from "../_components/SearchableSelect";
import Button from "../_components/Button";
import { useStore } from "../store";
import { Course } from "../types";
import Link from "next/link";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
const Instructor = () => {
  // const [instructor, setInstructor] = useState<string>("");
  const [instructors, setInstructors] = useState<{ instructor: string }[]>([]);
  const [instructorInfo, setInstructorInfo] = useState<
    (Course & { avg_gpa: number })[]
  >([]);
  const [totalAvgGPA, setTotalAvgGPA] = useState<number | null>(null);
  const { instructor, setInstructor } = useStore();

  // initial fetch of list of professors
  useEffect(() => {
    const fetchInstructors = async () => {
      const res = await fetch(`${BASE}/instructor`);
      const data = await res.json();
      const instructorData = data.splice(1); // remove , at start
      setInstructors(instructorData);
      if (!instructor || instructor === "") {
        // either stored instructor or first one from fetch
        setInstructor(instructorData[0]?.instructor || "");
      }
    };
    fetchInstructors();
    // include searchParams in deps so we react to URL changes
  }, []);

  // fetches info for selected professors
  useEffect(() => {
    const fetchInfo = async () => {
      if (!instructor) return;
      const res = await fetch(
        `${BASE}/instructor/info?name=${encodeURIComponent(instructor)}`
      );
      const data = await res.json();
      console.log("instructor info data", data);
      setInstructorInfo(data);
      const gpas = data
        .map((course: { avg_gpa: number }) => course.avg_gpa)
        .filter((gpa: number) => gpa !== 0);

      if (gpas.length > 0) {
        const avgGPA =
          gpas.reduce((sum: number, gpa: number) => sum + gpa, 0) / gpas.length;
        setTotalAvgGPA(avgGPA);
      } else {
        setTotalAvgGPA(null);
      }
    };
    fetchInfo();
  }, [instructor]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Select instructor */}
      <div className="mb-8">
        <Card>
          <SearchableSelect
            label="Instructors"
            items={instructors}
            value={{ instructor: instructor }}
            getOptionText={(i) => i.instructor}
            onChange={(i) => setInstructor(i.instructor)}
          />
          <Button href="/">Back</Button>
        </Card>
      </div>
      {/* Instructor's info */}
      <Card>
        <div className="w-120">
          <h2 className="text-lg font-bold mb-4">Selected Instructor</h2>
          {instructor ? (
            <div>
              <p>{instructor}</p>
              <p>
                {`Total Average GPA: ${
                  totalAvgGPA !== null ? totalAvgGPA.toFixed(2) : "No GPA data"
                }`}
              </p>
              <h3 className="text-md font-semibold mt-4 mb-2">
                Courses Taught:
              </h3>
              {instructorInfo.length > 0 ? (
                <ul className="list-disc list-inside">
                  {instructorInfo.map((course, index) => (
                    <li key={index}>
                      {/* Links to average graph of instructor */}
                      <Link
                        href={`./graph?type=instructor&s=${encodeURIComponent(
                          course.subj_cd
                        )}&d=${encodeURIComponent(
                          course.dept_name
                        )}&n=${encodeURIComponent(course.course_nbr)}`}
                      >
                        {course.title} -{" "}
                        {course.avg_gpa !== 0
                          ? `Average GPA: ${course.avg_gpa.toFixed(2)}`
                          : "No GPA data"}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  No courses found for this instructor.
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No instructor selected</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Instructor;
