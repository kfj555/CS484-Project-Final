"use client";
import { useEffect, useState } from "react";
import Button from "./_components/Button";
import Select from "./_components/Select";

// TODO: make this page type safe

export default function HomeBody({ departments = [], years = [], cNums = [] }) {
  // department, term, year, and course num used for querying
  const [department, setDepartment] = useState<string>(departments[0].dept_name ?? "");
  const [year, setYear] = useState<number>(years[0].year ?? 0);
  const [term, setTerm] = useState<string>("FA");
  const [availableSeasons, setAvailableSeasons] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number>(cNums[0].course_nbr ?? 0);
  const [availableCourseNumbers, setAvailableCourseNumbers] = useState<number[]>(cNums);

  // useEffect updates list of course numbers every time department changes
  useEffect(() => {
    const fetchData = async () => {
      if (department === "") return;
      
      // fetch available terms for selected department and year
      const availableTermsRes = await fetch(
        `http://localhost:3001/semesters?department=${department}&year=${year}`
      );
      const availableSeasonsData = await availableTermsRes.json();
      setAvailableSeasons(availableSeasonsData);
      console.log(availableSeasonsData);
      setTerm(availableSeasonsData[0] ?? "FA");

      //fetch available course numbers
      const availableCourseNumbersRes = await fetch(
        `http://localhost:3001/semesters/courses?department=${department}&year=${year}&season=${term}`
      );
      const availableCourseNumbersData: number[] = await availableCourseNumbersRes.json();
      setAvailableCourseNumbers(availableCourseNumbersData);
      console.log("Available courses: ", availableCourseNumbersData);

      setSelectedCourse(availableCourseNumbersData[0] ?? 0);
    };
    fetchData();
  }, [department, year, term]);

  return (
    <div className="flex flex-col gap-3 border-1 w-fit p-6 my-10">
      <Select
        label="Departments"
        items={departments}
        onChange={setDepartment}
      />
      <Select label="Terms" items={availableSeasons} onChange={setTerm} />
      <Select label="Year" items={years} onChange={setYear} />
      <Select label="Course Numbers" items={availableCourseNumbers} onChange={setSelectedCourse} />
      <Button href={`./graph?d=${department}&t=${term}&y=${year}&n=${selectedCourse}`}>
        Get Graph
      </Button>
    </div>
  );
}
