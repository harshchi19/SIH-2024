"use client";

import { Label } from "../ui/label";
import { useLanguage } from "@/context/LanguageContext";
import Info from "../Info";
import RangeSelector from "../RangeSelector";

const ArticulationPhoneticLevelDetails = ({ data, updateData }) => {
  const { dict } = useLanguage();

  return (
    <div className="flex flex-col items-start">
      <h1 className="text-xl font-semibold">
        5. {dict?.addPatient?.articulation}
      </h1>
      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="vowels_stage"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.vowels_stage}
            <Info info={dict?.addPatient?.vowels_stage_info} />
          </Label>
          <RangeSelector
            selected={data.vowels_stage}
            setSelected={(value) =>
              updateData({ ...data, vowels_stage: value })
            }
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="consonants_stage"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.consonants_stage}
            <Info info={dict?.addPatient?.consonants_stage_info} />
          </Label>
          <RangeSelector
            selected={data.consonants_stage}
            setSelected={(value) =>
              updateData({ ...data, consonants_stage: value })
            }
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="blends_stage"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.blends_stage}
            <Info info={dict?.addPatient?.blends_stage_info} />
          </Label>
          <RangeSelector
            selected={data.blends_stage}
            setSelected={(value) =>
              updateData({ ...data, blends_stage: value })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ArticulationPhoneticLevelDetails;
