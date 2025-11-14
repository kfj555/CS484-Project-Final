"use client";
import { ChartData, Chart as ChartJS, ChartOptions } from "chart.js/auto"; // include /auto
import { Bar } from "react-chartjs-2";
import { Course } from "@/app/types";

void ChartJS; // prevents from being tree-shaken

const GraphBody = ({ data }: { data: Course }) => {
  const gradeChartData: ChartData<"bar"> = {
    labels: ["A", "B", "C", "D", "F", "Not Reported"],
    datasets: [
      {
        data: [data.A, data.B, data.C, data.D, data.F, data.NR],
        borderWidth: 1,
        backgroundColor: "rgba(212, 31, 11, .7)",
        borderColor: "rgba(212, 31, 11,.7)",
        borderRadius: 10,
        hoverBackgroundColor: "rgba(212, 31, 11,1)",
      },
    ],
  };
  const gradeChartOptions: ChartOptions<"bar"> = {
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

  const satisfactoryChartData: ChartData<"bar"> = {
    labels: ["Satisfactory", "Unsatisfactory"],
    datasets: [
      {
        data: [data.S, data.U],
        borderWidth: 1,
        backgroundColor: "rgba(31, 119, 212, .7)",
      },
    ],
  };

  const satisfactoryChartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: true,
        text: `Satisfactory and Unsatisfactory`,
        font: { size: 22 },
      },
      legend: { display: false },
    },
    scales: {
      x: {
        title: { text: "Status", display: true, font: { size: 16 } },
      },
      y: {
        title: { text: "# of students", display: true, font: { size: 16 } },
      },
    },
  };

  function renderGraph(){
    if (data.S > 1 || data.U > 1) {
      return <Bar data={satisfactoryChartData} options={satisfactoryChartOptions} />;
    }else if (data.A + data.B + data.C + data.D + data.F + data.NR > 0){
      return <Bar data={gradeChartData} options={gradeChartOptions} />;
    }
  }

  return (
    <div className="w-300">
      {renderGraph()}
    </div>
  );
};

export default GraphBody;
