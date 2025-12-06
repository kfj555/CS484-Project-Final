"use client";
import BarChart from "../_components/BarChart";
import PieChart from "../_components/PieChart";
import { Course } from "@/app/types";
import Button from "../_components/Button";
import { useState } from "react";
import RadarChart from "../_components/RadarChart";
import Card from "../_components/Card";
import LabelBar from "../_components/LabelBar";
import { useStore } from "../store";
import Link from "next/link";

const seasonMap = {
  FA: "Fall",
  SP: "Spring",
  SU: "Summer",
  "": "",
} as const;

type GraphOptions = "bar" | "pie" | "radar";

const ExactGraphBody = ({ data }: { data: Course[] }) => {
  const [graphType, setGraphType] = useState<GraphOptions>("bar");
  const { setInstructor } = useStore();

  return (
    <div className="flex flex-col justify-center items-center w-screen">
      <div className="flex flex-col w-6/10 mb-3">
        <div className="flex items-center justify-between relative">
          {/* Button */}
          <div className="flex-none">
            <Button href="./exact">Back</Button>
          </div>
          {/* Title */}
          <div className="justify-items-center">
            <h1 className="text-lg font-semibold">
              {`${data[0].subj_cd} ${data[0].course_nbr}: ${data[0].title}`}
            </h1>
            <h2>{`${seasonMap[data[0].season]} ${data[0].year}`}</h2>
          </div>
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
            {data[0].S === 0 && data[0].U === 0 && (
              <option value="radar">Radar</option>
            )}
          </select>
        </div>
      </div>

      {/* Graphs */}
      {data.map((course, index) => {
        return (
          <div key={index} className="mb-7 w-6/10">
            <Card>
              {/* Name of instructor */}
              <Link href="./instructors">
                <button
                  onClick={() => setInstructor(course.instructor)}
                  className="ml-3 mb-6 p-2 w-full text-xl opacity-70 rounded-md bg-zinc-100 border border-slate-400 hover:border-slate-800 hover:bg-zinc-300"
                >
                  Instructor: {course.instructor}
                </button>
              </Link>
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

export default ExactGraphBody;
