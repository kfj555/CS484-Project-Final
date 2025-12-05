"use client";
import Button from "./_components/Button";

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
        <Button href="./easy_courses" w={320} h={60}>
          Find Easy Courses
        </Button>
        <Button href="./exact" w={320} h={60}>
          See Exact Courses
        </Button>
        <Button href="./average" w={320} h={60}>
          See Course Average
        </Button>
        <Button href="./instructors" w={320} h={60}>
          See Instructors
        </Button>
        <Button href="./about" w={320} h={60}>
          About
        </Button>
      </div>
    </div>
  );
};

export default Home;
