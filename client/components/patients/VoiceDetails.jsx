"use client";

import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useLanguage } from "@/context/LanguageContext";
import Info from "../Info";

const VoiceDetails = ({ data, updateData }) => {
  const { dict } = useLanguage();

  const handleChange = (e, id, value) => {
    if (e?.target) {
      const { id: eventId, value: eventValue } = e.target;
      updateData(eventId, eventValue);
    } else if (id && value !== undefined) {
      updateData(id, value);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <h1 className="text-xl font-semibold">6. {dict?.addPatient?.voice}</h1>
      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="pitch_quality"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.pitch_quality}
            <span className="text-red-500 ml-1">*</span>
            <Info info={dict?.addPatient?.pitch_quality_info} />
          </Label>
          <Textarea
            id="pitch_quality"
            value={data.pitch_quality}
            placeholder={dict?.addPatient?.pitch_quality_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="loudness"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.loudness}
            <span className="text-red-500 ml-1">*</span>
            <Info info={dict?.addPatient?.loudness_info} />
          </Label>
          <Textarea
            id="loudness"
            value={data.loudness}
            placeholder={dict?.addPatient?.loudness_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="voice_quality"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.voice_quality}
            <span className="text-red-500 ml-1">*</span>
            <Info info={dict?.addPatient?.voice_quality_info} />
          </Label>
          <Textarea
            id="voice_quality"
            value={data.voice_quality}
            placeholder={dict?.addPatient?.voice_quality_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="breath_control"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.breath_control}
            <span className="text-red-500 ml-1">*</span>
            <Info info={dict?.addPatient?.breath_control_info} />
          </Label>
          <Textarea
            id="breath_control"
            value={data.breath_control}
            placeholder={dict?.addPatient?.breath_control_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceDetails;
