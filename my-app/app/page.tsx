"use client";
import Button from "./_components/Button";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-3xl font-semibold mb-5 underline-offset-8 underline">
        Course Analytics Dashboard
      </h1>
      <div className="grid grid-cols-2 gap-4 px-20 py-20 border rounded-md">
        <Button href="./department_summary" w={320} h={60}>
          See Department Summary
        </Button>
        <Button href="./easy_courses" w={320} h={60}>
          See Easy Courses
        </Button>
        <Button href="./exact" w={320} h={60}>
          See Exact Courses
        </Button>
        <Button href="./average" w={320} h={60}>
          See Course Average
        </Button>
        <Button href="./exact-all" w={320} h={60}>
          See Course History
        </Button>
        <Button href="./instructors" w={320} h={60}>
          See Instructors
        </Button>
        <div className="col-span-2 flex justify-center">
          <Button href="./about" w={320} h={60}>
            About This App
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
