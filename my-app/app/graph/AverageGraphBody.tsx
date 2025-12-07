import { Course } from "@/app/types";
import FullGraph from "../_components/FullGraph";

const AverageGraphBody = ({
  data,
  type,
}: {
  data: Course[];
  num: string | number;
  subj: string;
  type: string;
}) => {
  let href = "./";
  type === "average" ? (href = "./average") : (href = href);
  type === "instructor" ? (href = "./instructors") : (href = href);

  return <FullGraph average={true} href={href} data={data} />;
};
export default AverageGraphBody;
