// "use client";
import ExactGraphBody from "./ExactGraphBody";
import HistoryGraphBody from "./HistoryGraphBody";

export default async function Graph({
  searchParams,
}: {
  searchParams: {
    type: "exact" | "history";
    d: string;
    t: string;
    y: number;
    n: number;
    s: string;
  };
}) {
  // type, department, term, year, (course) number, and/or subj given from prev page
  const { type, d, t, y, n, s } = await searchParams;
  const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  let res;

  if (type === "exact") {
    res = await fetch(
      `${BASE}/course/exact?dept=${d}&cn=${n}&term=${t}&year=${y}`
    );
  } else if (type === "history") {
    console.log("TESTS");
    res = await fetch(`${BASE}/course/history?department=${d}&subj=${s}`);
  }

  const data = await res!.json();
  console.log(data);
  const error = data.length === 0 ? 1 : 0; // TODO: create a full error page/component

  console.log(data);

  return (
    <div className="flex flex-col justify-center items-center py-10">
      {error === 0 && type === "exact" && <ExactGraphBody data={data} />}
      {error === 0 && type === "history" && <HistoryGraphBody data={data} />}
      {error === 1 && (
        <div className="border">
          <p className="px-10 py-20 font-semibold text-2xl">Course not found</p>
        </div>
      )}
    </div>
  );
}
