"use client";
import BarChart from "../_components/BarChart";
import PieChart from "../_components/PieChart";
import { Course } from "@/app/types";
import Button from "../_components/Button";
import { useState } from "react";
import RadarChart from "../_components/RadarChart";

const seasonMap = {
  FA: "Fall",
  SP: "Spring",
  SU: "Summer",
  "": "",
} as const;

type GraphOptions = "bar" | "pie" | "radar";

const HistoryGraphBody = ({ data }: { data: Course[] }) => {
  const [graphType, setGraphType] = useState<GraphOptions>("bar");

  return (
    <div className="flex flex-col w-200">
      <Button href="./history">Back</Button>
      {/* Title */}
      <div className="justify-items-center mb-4">
        <h1 className="text-lg font-semibold">
          {`${data[0].subj_cd} ${data[0].course_nbr}: ${data[0].title}`}
        </h1>
        <h2>{`${seasonMap[data[0].season]} ${data[0].year}`}</h2>
      </div>

      {/* Select chart type */}
      <select
        className="border w-fit ml-3 mb-2"
        onChange={(e) => setGraphType(e.target.value as GraphOptions)}
      >
        <option value="bar">Bar</option>
        <option value="pie">Pie</option>
        {data[0].S === 0 && data[0].U === 0 && (
          <option value="radar">Radar</option>
        )}
      </select>

      {/* Graphs */}
      {data.map((course, index) => {
        const { A, B, C, D, F, grade_regs, W, S } = course;
        return (
          <div key={index} className="border mx-3 p-3 mb-7">
            {/* Bar Chart if selected */}
            {graphType === "bar" && <BarChart data={data[index]} />}

            {/* Pie Chart if selected */}
            {graphType === "pie" && (
              <div className="w-6/10 justify-self-center">
                <PieChart data={data[index]} />
              </div>
            )}

            {/* Radar Chart if selected */}
            {graphType === "radar" && (
              <div className="w-8/10 justify-self-center">
                <RadarChart data={data[index]} />
              </div>
            )}

            {/* Extra Details */}
            <div className="pl-15">
              <p>Professor: {course.instructor}</p>
              <p>Total Registrations: {grade_regs}</p>

              <p>
                Average GPA:{" "}
                {((4 * A + 3 * B + 2 * C + D) / (grade_regs - W)).toFixed(2)}
              </p>

              <p>Withdraws: {W}</p>

              {A + B + C + D + F ? (
                <p>
                  Pass Rate:{" "}
                  {(((A + B + C + D) / (grade_regs - W)) * 100).toFixed(2)}%
                </p>
              ) : (
                <p>Pass Rate: {((S / (grade_regs - W)) * 100).toFixed(2)}%</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryGraphBody;
