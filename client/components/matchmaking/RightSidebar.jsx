import { logo } from "@/assets";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

const RightSidebar = () => {
  const { dict } = useLanguage();

  return (
    <div className="h-full w-1/4 bg-white rounded-lg border border-gray-300 px-4 py-3 overflow-hidden">
      <div className="flex items-center gap-x-2">
        <Image src={logo} alt="Logo" className="h-7 w-auto" />
        <h1 className="text-xl font-semibold">
          {dict?.matchmaking?.matchmaker}
        </h1>
      </div>
    </div>
  );
};

export default RightSidebar;
