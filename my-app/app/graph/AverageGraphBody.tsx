"use client";
import BarChart from "../_components/BarChart";
import PieChart from "../_components/PieChart";
import { Course } from "@/app/types";
import Button from "../_components/Button";
import { useState } from "react";
import RadarChart from "../_components/RadarChart";
import Card from "../_components/Card";
import LabelBar from "../_components/LabelBar";

type GraphOptions = "bar" | "pie" | "radar";

const AverageGraphBody = ({
  data,
  num,
  subj,
  type,
}: {
  data: Course[];
  num: string | number;
  subj: string;
  type: string;
}) => {
  const [graphType, setGraphType] = useState<GraphOptions>("bar");

  return (
    <div className="flex flex-col justify-center items-center w-screen">
      <div className="flex flex-col w-6/10 mb-3">
        <div className="flex items-center justify-between relative">
          {/* Button */}
          <div className="flex-none">
            {type === "average" && <Button href="./average">Back</Button>}
            {type === "instructor" && (
              <Button href="./instructors">Back</Button>
            )}
          </div>
          {/* Title */}
          <div className="justify-items-center">
            <h1 className="text-lg font-semibold">
              {`${subj} ${num}: ${data[0].title}`}
            </h1>
            {/* symmetry */}
          </div>
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
              <h1 className="flex items-center justify-center text-2xl mb-4">
                Overall Course Average
              </h1>
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

export default AverageGraphBody;
