"use client";

import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useLanguage } from "@/context/LanguageContext";
import Info from "../Info";

const SuprasegmentalAspectsDetails = ({ data, updateData }) => {
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
        7. {dict?.addPatient?.suprasegmental}
      </h1>
      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="emphasis_level"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.emphasis_level}
            <Info info={dict?.addPatient?.emphasis_level_info} />
          </Label>
          <Textarea
            id="emphasis_level"
            value={data.emphasis_level}
            placeholder={dict?.addPatient?.emphasis_level_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="intonation"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.intonation}
            <Info info={dict?.addPatient?.intonation_info} />
          </Label>
          <Textarea
            id="intonation"
            value={data.intonation}
            placeholder={dict?.addPatient?.intonation_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="phrasing"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.phrasing}
            <Info info={dict?.addPatient?.phrasing_info} />
          </Label>
          <Textarea
            id="phrasing"
            value={data.phrasing}
            placeholder={dict?.addPatient?.phrasing_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="speech_rate"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.speech_rate}
            <Info info={dict?.addPatient?.speech_rate_info} />
          </Label>
          <Textarea
            id="speech_rate"
            value={data.speech_rate}
            placeholder={dict?.addPatient?.speech_rate_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SuprasegmentalAspectsDetails;
