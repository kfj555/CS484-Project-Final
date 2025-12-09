import { Course } from "../types";
import LabelCard from "./LabelCard";

const PassRateIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
      />
    </svg>
  );
};

const RegistrationsIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
      />
    </svg>
  );
};

const WithdrawsIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
      />
    </svg>
  );
};

const GPAIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1}
      stroke="currentColor"
      className="size-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
      />
    </svg>
  );
};

// formats multiple labels in a row, needs course data to display
const LabelBar = ({
  course,
  average = false,
}: {
  course: Course;
  average?: boolean;
}) => {
  const { A, B, C, D, F, grade_regs, W, S, U } = course;
  return (
    <div
      className="flex flex-row flex-wrap
    w-full mt-4
    gap-6 sm:gap-8 lg:gap-10
    justify-center"
    >
      {S + U === 0 ? (
        <LabelCard color="rgba(0, 100, 255, 0.25)">
          <div className="flex flex-col gap-1 justify-center items-center">
            <p className="flex gap-1 items-center">
              <GPAIcon /> Average GPA
            </p>
            <p>{((4 * A + 3 * B + 2 * C + D) / (grade_regs - W)).toFixed(2)}</p>
          </div>
        </LabelCard>
      ) : null}
      <LabelCard color="rgba(0, 255, 0, 0.25)" shadow={false}>
        <div className="flex flex-col gap-1">
          {A + B + C + D + F ? (
            <div className="flex flex-col gap-1 justify-center items-center">
              <p className="flex gap-1 items-center">
                <PassRateIcon /> Pass Rate
              </p>
              {(((A + B + C + D) / (grade_regs - W)) * 100).toFixed(2)}%
            </div>
          ) : (
            <div className="flex flex-col gap-1 justify-center items-center">
              <p className="flex gap-1 items-center">
                <PassRateIcon /> Pass Rate
              </p>
              {((S / (grade_regs - W)) * 100).toFixed(2)}%
            </div>
          )}
        </div>
      </LabelCard>
      {!average && (
        <LabelCard color="rgba(255, 0, 255, 0.25)">
          <div className="flex flex-col gap-1 justify-center items-center">
            <p className="flex gap-1 items-center">
              <RegistrationsIcon /> Registrations
            </p>
            <p>{Math.ceil(grade_regs)}</p>
          </div>
        </LabelCard>
      )}
      <LabelCard color="rgba(255, 0, 0, 0.25)">
        <div className="flex flex-col gap-1 justify-center items-center">
          <p className="flex gap-1 items-center">
            <WithdrawsIcon /> Withdraws
          </p>
          <p>{Math.ceil(W)}</p>
        </div>
      </LabelCard>
    </div>
  );
};

export default LabelBar;
