"use client";
import Link from "next/link";
import Button from "./_components/Button";
import Card from "./_components/Card";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-3xl font-semibold mb-5 underline-offset-8 underline">
        Course Analytics Dashboard
      </h1>
      <div className="flex flex-col gap-4 px-55 py-20 border rounded-md">
        <Button href="./department_summary" w={320} h={60}>
          See Department Summary
        </Button>
        <Button href="./exact" w={320} h={60}>
          See Exact Courses
        </Button>
        <Button href="./history" w={320} h={60}>
          See Course History
        </Button>
        <Button href="./instructors" w={320} h={60}>
          See Instructors
        </Button>
      </div>
    </div>
  );
};

export default Home;
