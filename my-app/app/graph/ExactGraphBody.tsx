import { Course } from "@/app/types";
import FullGraph from "../_components/FullGraph";

const ExactGraphBody = ({ data }: { data: Course[] }) => {
  return <FullGraph exact={true} href="./exact" data={data} />;
};

export default ExactGraphBody;
