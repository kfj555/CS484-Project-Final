"use client";
import BarChart from "../_components/BarChart";
import PieChart from "../_components/PieChart";
import { Course } from "@/app/types";
import Button from "../_components/Button";
import { useEffect, useState } from "react";
import RadarChart from "../_components/RadarChart";
import Card from "../_components/Card";
import LabelBar from "../_components/LabelBar";
import { useStore } from "../store";
import Link from "next/link";
import BackButton from "./BackButton";

const seasonMap = {
  FA: "Fall",
  SP: "Spring",
  SU: "Summer",
  "": "",
} as const;

interface FullGraphProps {
  data: Course[];
  href: string;
  average?: boolean;
  exact?: boolean;
  history?: boolean;
}

type GraphOptions = "bar" | "pie" | "radar";

const FullGraph = ({
  data,
  average = false,
  exact = false,
  history = false,
}: FullGraphProps) => {
  const [graphType, setGraphType] = useState<GraphOptions>("bar");
  const { setInstructor } = useStore();

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
      setShowTopButton(pct > 0.5);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-screen">
      <div className="flex flex-col w-6/10 mb-3">
        <div className="flex items-center justify-between relative">
          {/* Button (manual href) */}
          <div className="flex-none">
            <BackButton />
          </div>

          {/* Title (based on origin) */}
          {average && (
            <div className="justify-items-center">
              <h1 className="text-lg font-semibold">
                {`${data[0].subj_cd} ${data[0].course_nbr}: ${data[0].title}`}
              </h1>
            </div>
          )}
          {exact && (
            <div className="justify-items-center">
              <h1 className="text-lg font-semibold">
                {`${data[0].subj_cd} ${data[0].course_nbr}: ${data[0].title}`}
              </h1>
              <h2>{`${seasonMap[data[0].season]} ${data[0].year}`}</h2>
            </div>
          )}
          {history && (
            <div className="justify-items-center">
              <h1 className="text-lg font-semibold">
                {`${data[0].subj_cd} ${data[0].course_nbr}: ${data[0].title}`}
              </h1>
            </div>
          )}

          {/* symmetry */}
          <div className="flex-none opacity-0 pointer-events-none">
            <Button>Back</Button>
          </div>
        </div>

        {/* Select chart type */}
        <div className="flex gap-1 mt-6">
          <label>Graph Type:</label>
          <select
            className="border w-fit ml-3 mb-2 rounded-md"
            onChange={(e) => setGraphType(e.target.value as GraphOptions)}
          >
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
            {/* Radar incompatible with S/U style */}
            {data[0].S === 0 && data[0].U === 0 && (
              <option value="radar">Radar</option>
            )}
          </select>
        </div>
      </div>

      {showTopButton && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Scroll to Top
        </button>
      )}

      {/* Graphs */}
      {data.map((course, index) => {
        return (
          <div key={index} className="mb-7 w-6/10">
            <Card>
              {/* Season (Optional)*/}
              {history && (
                <div className="mb-2 ml-4">
                  <h2 className="font-semibold">{`${seasonMap[course.season]} ${
                    course.year
                  }`}</h2>
                </div>
              )}

              {/* Title for Average page */}
              {average && (
                <h1 className="text-2xl flex justify-center mb-3 opacity-70 ">
                  Overall Course Average
                </h1>
              )}

              {/* Name of instructor (Optional) */}
              {(exact || history) && (
                <Link href="./instructors">
                  <button
                    onClick={() => setInstructor(course.instructor)}
                    className="ml-3 mb-6 p-2 w-full text-xl opacity-70 rounded-md bg-zinc-100 border border-slate-400 hover:border-slate-800 hover:bg-zinc-300"
                  >
                    Instructor: {course.instructor}
                  </button>
                </Link>
              )}

              <div className="flex flex-col items-center">
                {/* Bar Chart if selected */}
                {graphType === "bar" && <BarChart data={data[index]} />}

                {/* Pie Chart if selected */}
                {graphType === "pie" && (
                  <div className="w-5/10 justify-self-center">
                    <PieChart data={data[index]} />
                  </div>
                )}

                {/* Radar Chart if selected */}
                {graphType === "radar" && (
                  <div className="w-5/10 justify-self-center">
                    <RadarChart data={data[index]} />
                  </div>
                )}
              </div>

              {/* Info section */}
              <LabelBar course={course} />
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default FullGraph;
