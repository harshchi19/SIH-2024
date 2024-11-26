"use client";

import Loader from "@/components/Loader";
import {
  ClinicalDetails,
  PatientDetails,
  UploadDocument,
} from "@/components/patients";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { GET_PATIENT_FROM_ID } from "@/utils/constants";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const TimelineComponent = ({ currentTimeline, setCurrentTimeline }) => {
  const { dict } = useLanguage();

  const TimelineData = [
    { name: dict?.pre_therapy?.document, value: 1 },
    { name: dict?.pre_therapy?.patient, value: 2 },
    { name: dict?.pre_therapy?.clinical, value: 3 },
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
                  ? "border-[2px] border-green-500 font-semibold bg-green-500 text-white"
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

export default function PreTherapyPage() {
  const [currentTimeline, setCurrentTimeline] = useState(1);
  const { dict } = useLanguage();
  const [formData, setFormData] = useState({
    case_name: "Unknown",
    case_no: "N/A",
    age_sex: "Not Specified",
    date_of_assignment: "Not Available",
    student_clinician: "Not Recorded",
    supervisor: "Not Assigned",
    provisional_diagnosis: "Pending",
    findings: {
      opme: "No observations",
      reception: "No data",
      expression: "Not evaluated",
      pragmatics: "Not assessed",
      attention: "Not measured",
      auditory_skill: "Not tested",
      play_behavior: "No observations",
      general_behavior: "Not documented",
      formal_testing: "No tests performed",
      clinical_impression: "Insufficient information",
      additional_notes: "No additional information",
    },
    confidence_score: "low",
  });
  const { patientId } = useParams();

  useEffect(() => {
    if (!patientId) {
      toast({ title: dict?.pre_therapy?.no_patient });
      return;
    }
    const getCurrentPatient = async () => {
      const response = await fetch(`${GET_PATIENT_FROM_ID}/${patientId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        setSidebarData(result.sidebarData);
      }
    };

    getCurrentPatient();
  }, [patientId]);

  if (!dict) {
    return (
      <>
        <Loader />
      </>
    );
  }

  const updateFormData = (section, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSubmit = () => {};

  return (
    <div className="px-8 flex pb-10 overflow-y-scroll">
      <TimelineComponent
        currentTimeline={currentTimeline}
        setCurrentTimeline={setCurrentTimeline}
      />
      <div className="actual-receipt w-full h-fit flex flex-col gap-y-10 justify-between border-2 rounded-xl px-8 py-6">
        <div>
          {currentTimeline === 1 && <UploadDocument />}
          {currentTimeline === 2 && <PatientDetails />}
          {currentTimeline === 3 && <ClinicalDetails />}
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
