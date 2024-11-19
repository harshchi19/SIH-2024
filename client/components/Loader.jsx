import Image from "next/image";
import { load } from "@/assets";

const Loader = () => {
  return (
    <div className="h-screen w-screen flex-row-center">
      <Image src={load} className="h-40 w-auto" alt="Loader" />
    </div>
  );
};

export default Loader;
