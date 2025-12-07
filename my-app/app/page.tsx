"use client";
import HomeCard from "./_components/HomeCard";

const Home = () => {
  return (
    <div className="flex flex-col items-center w-screen mt-16 mb-20">
      {/* Title */}
      <h1 className="text-4xl font-bold tracking-wide mb-3">
        UIC Course Analytics
      </h1>
      <p className="text-lg text-gray-600 mb-10 opacity-80">
        Explore grade trends, instructor performance, course history, and more.
      </p>
      {/* <div className="w-1/4 mb-3">
        
      </div> */}

      <div className="w-3/4 grid grid-cols-3 gap-4 auto-rows-fr">
        <div className="h-full">
          <HomeCard
            color="rgba(0, 100, 255, 0.25)"
            icon="department"
            title="Department Summary"
            href="./department_summary"
            subtitle="View all courses, instructors, and average GPA for a given department"
          />
        </div>
        <div className="h-full">
          <HomeCard
            color="rgba(0, 255, 0, 0.25)"
            icon="easy"
            title="Easy Courses"
            href="./easy_courses"
            subtitle="Find classes with the highest GPA results and highest passing rates"
          />
        </div>
        <div className="h-full">
          <HomeCard
            color="rgba(255, 0, 255, 0.25)"
            icon="exact"
            title="Exact Course"
            href="./exact"
            subtitle="Find course information for a specific term and year"
          />
        </div>
        <div className="h-full">
          <HomeCard
            color="rgba(255, 0, 0, 0.25)"
            icon="average"
            title="Average Course"
            href="./average"
            subtitle="See the average data of a given course across all years"
          />
        </div>
        <div className="h-full">
          <HomeCard
            color="rgba(255, 255, 0, 0.25)"
            icon="history"
            title="Course History"
            href="./exact-all"
            subtitle="View all data for a given course separated by term and year (takes time to load)"
          />
        </div>
        <div className="h-full">
          <HomeCard
            color="rgba(255, 100, 0, 0.25)"
            icon="instructor"
            title="Instructor Info "
            href="./instructors"
            subtitle="Find all courses taught by an instructor and their grade averages"
          />
        </div>
        <div className="col-span-3 h-full">
          <div className="flex justify-center">
            <div className="w-1/3">
              <HomeCard
                color="rgba(100, 100, 100, 0.25)"
                icon="about"
                title="About this app"
                href="./about"
                subtitle="See details about the UIC Course Analytics application "
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer style spacing */}
      <div className="mt-14 text-gray-500 text-sm opacity-70">
        © {new Date().getFullYear()} UIC Course Analytics
      </div>
    </div>
  );
};

export default Home;
