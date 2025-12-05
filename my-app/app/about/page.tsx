import Link from "next/link";
import "../_styles/about-page.css";

export default function About() {
    return (
        <div className="flex flex-col justify-center mx-10 my-10">
            <Link href="/" id="about-home-button">Home</Link>
            <div className="app-description-section">
                <h1 className="about-h1">About This App</h1>
                <p>
                    This application is designed to help students find easy courses based on GPA and satisfaction rates. 
                    It provides insights into course difficulty and student satisfaction to assist in course selection.
                    This app is <b>only for UIC students</b> as you will need a valid UIC email to access the website.
                    The reason being that the data used in this application is not publicly available and is sourced from UIC&apos;s web application.
                    This was created as a group project for <a className="about-a" rel="external noopener noreferrer" href="https://484.cs.uic.edu" target="_blank">CS 484: Web Application Development</a> at the University of Illinois Chicago
                    during the Fall 2025 semester. 
                </p>
                <br/>
                <div className="flex flex-col">
                    Group Members: <br/>
                    <ul className="about-ul">
                        <li>Adrian Gomez</li>
                        <li>Kang Fang</li>
                        <li>Raymond Lo</li>
                        <li>Michael Lasak</li>
                    </ul>
                </div>
                <br/>
                <p>Github repository link: <a className="about-a" rel="external noopener noreferrer" href="https://github.com/agome277/CS484-Project" target="_blank">https://github.com/agome277/CS484-Project</a></p>
            </div>

            <div className="data-source-section">
                <h2 className="about-h2">Data Source</h2>
                <p>Data collected from <a className="about-a" rel="external noopener noreferrer" href="https://oir.uic.edu/data/student-data/grade-distribution/">https://oir.uic.edu/data/student-data/grade-distribution/</a></p>
                <br/>
                <p>Disclaimer: The data used in this application is not publicly available and is sourced from UIC&apos;s web application.
                    While efforts have been made to ensure the accuracy of the data, there may be discrepancies or errors present.
                    Users are advised to verify any critical information directly with official UIC resources.
                </p>
                <br/>
            </div>

            <div className="how-to-use-section">
                <h1 className="about-h1">How to Use</h1>
                <p><b>Verification:</b> Users must first verify their UIC email by receiving a verification code sent to their UIC email address.</p>
                <br/>
                <p>There will be 4 different sections to explore the data:</p>
                <ul className="about-ul">
                    <li>
                        <b>Department Summary:</b> View aggregated statistics for all courses within a selected department.
                    </li>
                    <li>
                        <b>Easy Courses:</b> Find courses that are considered easy based on average GPA and satisfaction rates.
                    </li>
                    <li>
                        <b>Exact Courses:</b> Search for specific courses by department, course number, term, and year to view detailed statistics and visualizations.
                    </li>
                    <li>
                        <b>Instructors:</b> Explore instructor-specific data to see what courses they&apos;ve taught and stats related to the courses.
                    </li>
                </ul>

                <h2 className="about-h2">Department Summary</h2>
                <p>Users can choose which department they want to look at and the course level they are interested in.
                    The app will <b>only show average GPA</b> for courses that have grade data available.
                    If you find out that you clicked on the Find button and nothing shows up, that means there is no grade data for that department/level combination.
                    The reason why is because some departments do not have courses that give letter grades (A-F) and instead only give Satisfactory/Unsatisfactory (S/U) grades
                    or maybe for some other reasons. Something to keep in mind is that UIC also have NR in ther data which means not reported.
                </p>

                <h2 className="about-h2">Easy Courses</h2>
                <p>Users can filter by department, course level, and minimum year to find easy courses.
                    The minimum year filter includes calculation of average GPA and satisfaction rates from that year onward.
                    Ex: If you select 2020, the app will consider data from 2020, 2021, 2022 up to the most recent year available
                    in the calculations. The data is automatically sorted by average course GPA (highest to lowest)
                    and satisfaction rate (highest to lowest) to help users easily identify the easiest courses.
                    Once the user selects the desired filters and clicks the Find button, 
                    the app will display a table of courses that meet the criteria, sorted by ease of completion based on GPA and satisfaction rates.
                    There are two separate tables shown: one for courses with grade data (A-F) and another for courses with satisfaction data (S/U).
                </p>
                <br/>
                <p>Here is what the GPA table column headers mean:</p>
                <ul className="about-ul">
                    <li><b>Avg GPA:</b> The average GPA for the course based on letter grades (A-F) only.</li>
                    <li><b>% A Grade:</b> The percentage of students who received an A grade in the course.</li>
                    <li><b>Pass Rate:</b> The percentage of students who received a passing grade (A-D) in the course.</li>
                    <li><b>Prereq Rate:</b> The percentage of students who received a grade of C or higher in the course to meet a potential prerequisite for another course.</li>
                    <li><b>Withdraw Rate:</b> The percentage of students who withdrew from the course.</li>
                </ul>
                <br/>
                <p>Here is what the Satisfaction table column headers mean:</p>
                <ul className="about-ul">
                    <li><b>Satisfaction Rate:</b> The percentage of students who received a Satisfactory (S) grade in the course.</li>
                    <li><b>Withdraw Rate:</b> The percentage of students who withdrew from the course.</li>
                </ul>
                <p>Users can always hover over column headers to see detailed explanations of each metric. There will also
                    be links on the instructor names that will take you to the Instructors page with that specific instructor selected so you can see what courses they have taught.
                </p>

                <h2 className="about-h2">Exact Courses</h2>
                <p>Users can search for specific courses by selecting the department, entering the course number, choosing the term and year.
                    These fields will automatically populate based on the data available meaning it is not possible to select a combination that does not exist in the database.
                    Then the user can click on the &quot;Get Graph&quot; button to view detailed statistics and visualizations for the selected course number in the specified term and year.
                    If the course exists in the database for that term and year, a bar graph will be displayed showing the distribution of grades (A, B, C, D, F, <abbr title="Not Reported">NR</abbr>) for that 
                    all sections of the course offered during that term and year. So if there were multiple professors teaching the same course in that term and year,
                    the graph will show each section&apos;s grade distribution separately. There will also be extra details shown below each graph such as total registrations, average GPA, withdraws, and pass rate.
                    However, there is a case where the course may not have any grade data available for that specific term and year.
                    In that case, the app will check to see if that course has satisfaction data (S/U) for that term and year and display a bar graph showing the distribution of Satisfactory (S) and Unsatisfactory (U) grades instead.
                    If neither grade data nor satisfaction data is available for the selected course in that term and year, a message will be displayed indicating that no data is available.
                </p>

                <h2 className="about-h2">Instructors</h2>
                <p>Users can select an instructor from the dropdown menu to view all courses they have taught along with relevant statistics.
                    The app will then display a list of courses taught by the selected instructor and the average GPA for each course (if grade data is available).
                </p>
            </div>
        </div>
    );
}