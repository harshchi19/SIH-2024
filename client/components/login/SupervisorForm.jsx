import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Link from "next/link";
import Loader from "../Loader";
import { useRouter } from "next/navigation";

const SupervisorForm = ({ data, updateData, setCurrentStep, handleSubmit }) => {
  const { dict, currentLang } = useLanguage();
  const [register, setRegister] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { id, value } = e.target;
    updateData(id, value);
  };

  const handleRegister = () => {
    router.push(`/${currentLang}/register`);
  };

  if (!dict) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {dict?.login?.wlc_sup}
        </h1>
        <p className="text-sm text-gray-600">{dict?.login?.wlc_desc}</p>
      </div>

      <div className="space-y-5 mt-5">
        <div className="space-y-2">
          <Label htmlFor="supervisor_id" className="text-gray-700">
            {dict?.login?.sup_id}
          </Label>
          <Input
            type="text"
            id="supervisor_id"
            value={data.supervisor_id}
            placeholder={dict?.login?.pat_pchldr_id}
            onChange={handleChange}
            className="w-full border-gray-200 focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_no" className="text-gray-700">
            {dict?.login?.phone}
          </Label>
          <Input
            type="tel"
            id="phone_no"
            value={data.phone_no}
            placeholder={dict?.login?.pat_pchldr_phon}
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
          <div className="flex-row-center gap-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-sm border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-colors"
            >
              {dict?.login?.go_back}
            </Button>
          </div>
          <Link
            href={`/${currentLang}/forgot-password`}
            className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
          >
            {dict?.login?.forgot_pass}
          </Link>
        </div>

        <div className="flex justify-start items-center">
          <h1 className="font-medium text-gray-500 text-sm">
            {dict?.login?.want_reg}
          </h1>
          <Button
            variant="ghost"
            onClick={handleRegister}
            className="-ml-2 font-semibold hover:bg-transparent text-green-500 hover:text-green-600"
          >
            {dict?.login?.reg_sup}
          </Button>
        </div>

        <Button
          className={`w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium tracking-tight transition-colors ${
            !data.supervisor_id || !data.phone_no || !data.password
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
          disabled={!data.supervisor_id || !data.phone_no || !data.password}
          onClick={handleSubmit}
        >
          {dict?.login?.continue}
        </Button>
      </div>
    </div>
  );
};

export default SupervisorForm;
