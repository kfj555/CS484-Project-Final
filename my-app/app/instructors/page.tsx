"use client";
import { useState, useEffect } from "react";
import Card from "../_components/Card";
import SearchableSelect from "../_components/SearchableSelect";
import { useStore } from "../store";
import { Course } from "../types";
import Link from "next/link";
import BackButton from "../_components/BackButton";
import InstructorLabelBar from "../_components/InstructorLabelBar";
import Button from "../_components/Button";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
const Instructor = () => {
  const [instructors, setInstructors] = useState<{ instructor: string }[]>([]);
  const [instructorInfo, setInstructorInfo] = useState<
    (Course & {
      avg_gpa: number;
      total_students: number;
      times: number;
      avg_sr: number;
      avg_pr: number;
    })[]
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

  const [showTopButton, setShowTopButton] = useState<boolean>(false);

  // Listen to window scroll so the fixed button appears when the user scrolls the page
  useEffect(() => {
    const scrollEl = document.scrollingElement || document.documentElement;

    const onScroll = () => {
      const scrollable = scrollEl.scrollHeight - scrollEl.clientHeight;
      if (scrollable < 100) {
        setShowTopButton(false);
        return;
      }

      const pct = scrollEl.scrollTop / scrollable;
      setShowTopButton(pct > 0.1);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const blueButtonStyle = {
    color: "#001E62",
    textColor: "white",
    hoverColor: "#0033a0",
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {showTopButton && (
        <div className="fixed bottom-10 right-10">
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            {...blueButtonStyle}
          >
            Scroll to Top
          </Button>
        </div>
      )}

      {/* Select instructor */}
      <div className="my-8">
        <Card>
          <div className="flex flex-col gap-3">
            <SearchableSelect
              label="Instructors"
              items={instructors}
              value={{ instructor: instructor }}
              getOptionText={(i) => i.instructor}
              onChange={(i) => setInstructor(i.instructor)}
            />
            <BackButton />
          </div>
        </Card>
      </div>

      {/* Info Display */}
      <div className="w-6/10 mb-8 my-4">
        <div className="flex flex-col gap-4">
          {instructor ? (
            <div className="flex flex-col gap-4">
              {/* Instructor name and overall details */}
              <Card>
                <h2 className="text-lg font-bold">Selected Instructor</h2>
                <p className="text-xl opacity-80">{instructor}</p>

                <InstructorLabelBar
                  avgGPA={totalAvgGPA}
                  avgPassRate={
                    instructorInfo.length > 0
                      ? instructorInfo.reduce(
                          (acc, c) =>
                            acc + (c.avg_pr > 0 ? c.avg_pr : c.avg_sr),
                          0
                        ) / instructorInfo.length
                      : null
                  }
                  totalStudents={instructorInfo.reduce(
                    (acc, c) => acc + c.total_students,
                    0
                  )}
                  numCourses={instructorInfo.length}
                />
              </Card>

              <Card>
                <h3 className="text-md font-semibold mt-4 mb-2">
                  Courses Taught:
                </h3>
                {instructorInfo.length ? (
                  <div className="flex flex-col gap-4">
                    {instructorInfo.map((course, index) => (
                      <Link
                        key={index}
                        href={`./graph?type=instructor&s=${encodeURIComponent(
                          course.subj_cd
                        )}&d=${encodeURIComponent(
                          course.dept_name
                        )}&n=${encodeURIComponent(course.course_nbr)}`}
                      >
                        <Card shadow={true} color="rgba(0,0,0,0.05)">
                          <div className="flex flex-col gap-1 opacity-80">
                            <p className="text-lg font-medium">
                              {course.title}
                            </p>
                            <p>
                              {`
                                ${
                                  course.avg_gpa
                                    ? course.avg_gpa.toFixed(2)
                                    : "N/A"
                                } 
                                GPA |
                                ${(course.avg_pr > 0
                                  ? course.avg_pr
                                  : course.avg_sr
                                ).toFixed(2)}% Pass Rate | 
                                ${course.total_students} Students | ${
                                course.times
                              } Sections
                              `}
                            </p>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 mt-4">
                    No courses found for this instructor.
                  </p>
                )}
              </Card>
            </div>
          ) : (
            <Card>
              <p className="text-gray-500">No instructor selected</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Instructor;
