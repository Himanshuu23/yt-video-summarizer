import { ToastContainer } from "react-toastify";
import Parent from "./components/Parent";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <ToastContainer />
      <Parent />
    </div>
  );
}