"use client";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useLanguage } from "@/context/LanguageContext";
import Info from "../Info";

const SpeechDevelopmentHistoryDetails = ({ data, updateData }) => {
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
      <h1 className="text-xl font-semibold">3. {dict?.addPatient?.speech}</h1>
      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="vocalization"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.vocalization}
            <Info info={dict?.addPatient?.vocalization_info} />
          </Label>
          <Textarea
            id="vocalization"
            value={data.vocalization}
            placeholder={dict?.addPatient?.vocalization_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="babbling"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.babbling}
            <Info info={dict?.addPatient?.babbling_info} />
          </Label>
          <Textarea
            id="babbling"
            value={data.babbling}
            placeholder={dict?.addPatient?.babbling_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label htmlFor="first_word" className="text-gray-700 text-md">
            {dict?.addPatient?.first_word}
          </Label>
          <Input
            type="text"
            id="first_word"
            value={data.first_word}
            placeholder={dict?.addPatient?.first_word_plchldr}
            onChange={handleChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>

        <div className="space-y-1 w-full">
          <Label htmlFor="first_sentence" className="text-gray-700 text-md">
            {dict?.addPatient?.first_sentence}
          </Label>
          <Input
            type="text"
            id="first_sentence"
            value={data.first_sentence}
            placeholder={dict?.addPatient?.first_sentence_plchldr}
            onChange={handleChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>
      </div>
    </div>
  );
};

export default SpeechDevelopmentHistoryDetails;
