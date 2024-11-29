"use client";

import Loader from "@/components/Loader";
import {
  PersonalDetails,
  ProfessionalDetails,
} from "@/components/student-therapist";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

const TimelineComponent = ({ currentTimeline, setCurrentTimeline }) => {
  const { dict } = useLanguage();

  const TimelineData = [
    { name: dict?.addStudentTherapist?.personal, value: 1 },
    { name: dict?.addStudentTherapist?.professional, value: 2 },
  ];

  return (
    <div className="flex flex- justify-start w-[40%] px-1 py-3">
      <div className="flex-col">
        {TimelineData.map((data, index) => (
          <div
            className={`flex justify-start items-start gap-x-4 -mt-1 cursor-pointer`}
            key={data.value}
            onClick={() => setCurrentTimeline(data.value)}
          >
            <div className="flex-col-center">
              <div
                className={`h-4 w-4 mt-1 rounded-full ${
                  currentTimeline === data.value
                    ? "bg-green-500"
                    : "border-[2px] border-green-500"
                }`}
              />
              <div className="h-10 w-1 bg-green-900 -mt-0.5" />
            </div>
            <h1
              className={`text-lg font-medium w-full px-2 py-1 rounded-md cursor-pointer ${
                currentTimeline === data.value
                  ? "border-[2px] border-green-500"
                  : ""
              }`}
            >
              {data.value}. {data.name}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AddPatientPage() {
  const [currentTimeline, setCurrentTimeline] = useState(1);
  const { dict } = useLanguage();

  const [formData, setFormData] = useState({
    personalDetails: {
      name: "",
      password: "",
      phone_no: "",
      email: "",
      age: null,
      sex: "",
    },
    professionalDetails: {
      spoken_languages: [],
      specialization: [],
      qualifications: [],
      experience_years: null,
      availability: [],
      training_and_education: [],
      location: "",
    },
  });

  if (!dict) {
    return <Loader />;
  }

  const updateFormData = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = () => {
    // Validation logic can be added here
    console.log("Final Form Data:", formData);
  };

  return (
    <div className="px-8 flex overflow-y-scroll pb-10">
      <TimelineComponent
        currentTimeline={currentTimeline}
        setCurrentTimeline={setCurrentTimeline}
      />
      <div className="w-full h-fit flex flex-col gap-y-10 justify-between border-2 rounded-xl px-8 py-6">
        <div>
          {currentTimeline === 1 && (
            <PersonalDetails
              data={formData.personalDetails}
              updateData={(field, value) =>
                updateFormData("personalDetails", field, value)
              }
            />
          )}
          {currentTimeline === 2 && (
            <ProfessionalDetails
              data={formData.professionalDetails}
              updateData={(field, value) =>
                updateFormData("professionalDetails", field, value)
              }
            />
          )}
        </div>

        <div className="flex-row-center gap-x-5">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => setCurrentTimeline(currentTimeline - 1)}
            disabled={currentTimeline === 1}
          >
            {dict?.addPatient?.prev}
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={
              currentTimeline !== 2
                ? () => setCurrentTimeline(currentTimeline + 1)
                : handleSubmit
            }
          >
            {currentTimeline !== 2
              ? dict?.addPatient?.next
              : dict?.addPatient?.submit}
          </Button>
        </div>
      </div>
    </div>
  );
}
