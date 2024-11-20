"use client";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useLanguage } from "@/context/LanguageContext";
import Info from "../Info";

const NonVerbalCommunicationDetails = ({ data, updateData }) => {
  const { dict } = useLanguage();

  const handleChange = (e) => {
    updateData({
      ...data,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="flex flex-col items-start">
      <h1 className="text-xl font-semibold">
        4. {dict?.addPatient?.nonverbal}
      </h1>
      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="expression_level"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.expression_level}
            <Info info={dict?.addPatient?.expression_level_info} />
          </Label>
          <Textarea
            id="expression_level"
            value={data.expression_level}
            placeholder={dict?.addPatient?.expression_level_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="comprehension_level"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.comprehension_level}
            <Info info={dict?.addPatient?.comprehension_level_info} />
          </Label>
          <Textarea
            id="comprehension_level"
            value={data.comprehension_level}
            placeholder={dict?.addPatient?.comprehension_level_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default NonVerbalCommunicationDetails;
