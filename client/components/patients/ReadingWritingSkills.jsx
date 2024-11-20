"use client";

import { Label } from "../ui/label";
import { useLanguage } from "@/context/LanguageContext";
import Info from "../Info";
import RangeSelector from "../RangeSelector";

const ReadingWritingSkills = ({ data, updateData }) => {
  const { dict } = useLanguage();

  return (
    <div className="flex flex-col items-start">
      <h1 className="text-xl font-semibold">8. {dict?.addPatient?.reading}</h1>
      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="letter_recognition"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.letter_recognition}
            <Info info={dict?.addPatient?.letter_recognition_info} />
          </Label>
          <RangeSelector
            selected={data.letter_recognition}
            setSelected={(value) =>
              updateData({ ...data, letter_recognition: value })
            }
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="word_recognition"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.word_recognition}
            <Info info={dict?.addPatient?.word_recognition_info} />
          </Label>
          <RangeSelector
            selected={data.word_recognition}
            setSelected={(value) =>
              updateData({ ...data, word_recognition: value })
            }
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="reading_comprehension"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.reading_comprehension}
            <Info info={dict?.addPatient?.reading_comprehension_info} />
          </Label>
          <RangeSelector
            selected={data.reading_comprehension}
            setSelected={(value) =>
              updateData({ ...data, reading_comprehension: value })
            }
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="copying"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.copying}
            <Info info={dict?.addPatient?.copying_info} />
          </Label>
          <RangeSelector
            selected={data.copying}
            setSelected={(value) => updateData({ ...data, copying: value })}
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="writing_to_dictation"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.writing_to_dictation}
            <Info info={dict?.addPatient?.writing_to_dictation_info} />
          </Label>
          <RangeSelector
            selected={data.writing_to_dictation}
            setSelected={(value) =>
              updateData({ ...data, writing_to_dictation: value })
            }
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="spontaneous_writing"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.spontaneous_writing}
            <Info info={dict?.addPatient?.spontaneous_writing_info} />
          </Label>
          <RangeSelector
            selected={data.spontaneous_writing}
            setSelected={(value) =>
              updateData({ ...data, spontaneous_writing: value })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ReadingWritingSkills;
