"use client";
import { ChartData, Chart as ChartJS, ChartOptions } from "chart.js/auto"; // include /auto
import { Bar } from "react-chartjs-2";
import { Course } from "@/app/types";

void ChartJS; // prevents from being tree-shaken

const GraphBody = ({ data }: { data: Course }) => {
  const chartData: ChartData<"bar"> = {
    labels: ["A", "B", "C", "D", "F"],
    datasets: [
      {
        data: [data.A, data.B, data.C, data.D, data.F],
        borderWidth: 1,
        backgroundColor: "rgba(212, 31, 11, .7)",
        borderColor: "rgba(212, 31, 11,.7)",
        borderRadius: 10,
        hoverBackgroundColor: "rgba(212, 31, 11,1)",
      },
    ],
  };
  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: true,
        text: `${data.subj_cd} ${data.course_nbr}: ${data.title}`,
        font: { size: 22 },
      },
      legend: { display: false },
    },
    scales: {
      x: {
        title: { text: "Grade", display: true, font: { size: 16 } },
      },
      y: {
        title: { text: "# of students", display: true, font: { size: 16 } },
      },
    },
  };

  return (
    <div className="w-300">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default GraphBody;
