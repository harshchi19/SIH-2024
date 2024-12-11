import { useLanguage } from "@/context/LanguageContext";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Link from "next/link";
import { Loader } from "lucide-react";

const HODForm = ({ data, updateData, setCurrentStep, handleSubmit }) => {
  const { dict, currentLang } = useLanguage();

  const handleChange = (e) => {
    const { id, value } = e.target;
    updateData(id, value);
  };

  if (!dict) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="w-6 h-6 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome Head Of Department
        </h1>
        <p className="text-sm text-gray-600">{dict?.login?.wlc_desc}</p>
      </div>

      <div className="space-y-5 mt-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            value={data.email}
            placeholder="Enter your email"
            onChange={handleChange}
            className="w-full border-gray-200 focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700">
            {dict?.login?.password}
          </Label>
          <Input
            type="password"
            id="password"
            value={data.password}
            placeholder={dict?.login?.pat_pchldr_pass}
            onChange={handleChange}
            className="w-full border-gray-200 focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(1)}
            className="px-4 py-2 text-sm border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-colors"
          >
            {dict?.login?.go_back}
          </Button>
          <Link
            href={`/${currentLang}/forgot-password`}
            className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
          >
            {dict?.login?.forgot_pass}
          </Link>
        </div>

        <Button
          className={`w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium tracking-tight transition-colors ${
            !data.email || !data.password
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
          disabled={!data.email || !data.password}
          onClick={handleSubmit}
        >
          {dict?.login?.continue}
        </Button>
      </div>
    </div>
  );
};

export default HODForm;
