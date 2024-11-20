import Image from "next/image";
import { load } from "@/assets";

const Loader = () => {
  return (
    <div className="h-full w-full flex-row-center">
      <Image src={load} className="h-10 w-auto" alt="Loader" />
    </div>
  );
};

export default Loader;
