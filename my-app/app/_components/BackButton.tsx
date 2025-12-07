import { useRouter } from "next/navigation";
import Button from "./Button";

const BackButton = () => {
  const router = useRouter();
  const handleBack = () => {
    if (window.history.length > 1) {
      // Check if there's a previous page in browser history
      router.back();
    } else {
      // If no history, navigate to a default page, e.g., home
      router.push("/");
    }
  };
  return <Button onClick={() => handleBack()}>Back</Button>;
};

export default BackButton;
