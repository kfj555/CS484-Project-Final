import { Course } from "@/app/types";
import FullGraph from "../_components/FullGraph";

const GraphAllBody = ({ data }: { data: Course[] }) => {
  return <FullGraph history={true} href="./exact-all" data={data} />;
};

export default GraphAllBody;
