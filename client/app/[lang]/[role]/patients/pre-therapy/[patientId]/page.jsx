"use client";

import {
  ClinicalDetails,
  PatientDetails,
  UploadDocument,
} from "@/components/patients";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { OCR_ROUTE } from "@/utils/ai.constants";
import { useState, useEffect } from "react";
import { parse, format } from "date-fns";
import {
  GET_PATIENT_FROM_ID,
  UPLOAD_PRE_THERAPY_DETAILS,
} from "@/utils/constants";
import { useParams, useRouter } from "next/navigation";

const TimelineComponent = ({ currentTimeline, setCurrentTimeline }) => {
  const { dict } = useLanguage();

  const TimelineData = [
    { name: dict?.pre_therapy?.document, value: 1 },
    { name: dict?.pre_therapy?.patient, value: 2 },
    { name: dict?.pre_therapy?.clinical, value: 3 },
  ];

  return (
    <div className="flex justify-start w-[40%] px-1 py-3">
      <div className="flex-col">
        {TimelineData.map((data) => (
          <div
            className={`flex justify-start items-start gap-x-4 -mt-1 cursor-pointer`}
            key={data.value}
            onClick={() => {
              // if (currentTimeline !== 1)
              setCurrentTimeline(data.value);
            }}
          >
            <div className="flex-col-center">
              <div
                className={`h-4 w-4 mt-1 rounded-full ${
                  currentTimeline === data.value
                    ? "bg-green-500"
                    : "border-[2px] border-green-500"
                }`}
              />
              {data.value !== 3 && (
                <div className="h-10 w-1 bg-green-900 -mt-0.5" />
              )}
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
  const [documentLoading, setDocumentLoading] = useState(false);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [data, setData] = useState({
    patientDetails: {
      name: "Unknown",
      case_no: "N/A",
      age_sex: "Not Specified",
      date_of_assignment: "",
      student_clinician: "Not Recorded",
      supervisor: "Not Assigned",
      provisional_diagnosis: "Pending",
    },
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
      additional_notes: "Not provided",
    },
    confidence_score: "low",
  });
  const router = useRouter();
  const params = useParams();

  const transformDate = (dateString) => {
    try {
      const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());

      return format(parsedDate, "yyyy-MM-dd");
    } catch (error) {
      console.error("Error parsing date:", error);
      return dateString;
    }
  };

  const updateFormData = (section, key, value) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleDocumentUpload = async () => {
    setDocumentLoading(true);
    const formData = new FormData();
    documentFiles.forEach(({ file }) => {
      formData.append(`files`, file);
    });

    try {
      const response = await fetch(OCR_ROUTE, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();

        const mappedData = {
          patientDetails: {
            name: result.cases?.case_name || "Unknown",
            case_no: result.cases?.case_no || "N/A",
            age_sex: result.cases?.age_sex || "Not Specified",
            date_of_assignment:
              transformDate(result.cases?.date_of_assignment) || "",
            student_clinician:
              result.cases?.student_clinician || "Not Recorded",
            supervisor: result.cases?.supervisor || "Not Assigned",
            provisional_diagnosis:
              result.cases?.provisional_diagnosis || "Pending",
          },
          findings: {
            opme: result.cases?.findings?.opme || "No observations",
            reception: result.cases?.findings?.reception || "No data",
            expression: result.cases?.findings?.expression || "Not evaluated",
            pragmatics: result.cases?.findings?.pragmatics || "Not assessed",
            attention: result.cases?.findings?.attention || "Not measured",
            auditory_skill:
              result.cases?.findings?.auditory_skill || "Not tested",
            play_behavior:
              result.cases?.findings?.play_behavior || "No observations",
            general_behavior:
              result.cases?.findings?.general_behavior || "Not documented",
            formal_testing:
              result.cases?.findings?.formal_testing || "No tests performed",
            clinical_impression:
              result.cases?.findings?.clinical_impression ||
              "Insufficient information",
            additional_notes:
              result.cases?.findings?.additional_notes || "No additional notes",
          },
          confidence_score: result.cases?.confidence_score || "low",
        };
        setData(mappedData);
        toast({
          title: dict?.success?.doc_uploaded,
          variant: "success",
        });
        setCurrentTimeline(currentTimeline + 1);
      } else {
        toast({
          title: dict?.errors?.uploadFailed,
          variant: "destruct",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: dict?.errors?.uploadFailed,
        variant: "destruct",
      });
    } finally {
      setDocumentLoading(false);
    }
  };

  useEffect(() => {
    const checkExistingPreTherapy = async () => {
      const response = await fetch(
        `${GET_PATIENT_FROM_ID}/${params.patientId}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success)
          router.push(`/${params.lang}/${params.role}/patients`);
      }
    };

    checkExistingPreTherapy();
  }, [params.patientId]);

  const handleSubmit = async () => {
    const response = await fetch(UPLOAD_PRE_THERAPY_DETAILS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      toast({
        title: dict?.pre_therapy[result.message],
      });
      if (result.success)
        router.push(`/${params.lang}/${params.role}/patients`);
    }
  };

  return (
    <div className="px-8 flex pb-10 overflow-y-scroll">
      <TimelineComponent
        currentTimeline={currentTimeline}
        setCurrentTimeline={setCurrentTimeline}
      />
      <div className="actual-receipt w-full h-fit flex flex-col gap-y-10 justify-between border-2 rounded-xl px-8 py-6">
        <div>
          {currentTimeline === 1 && (
            <UploadDocument
              documentFiles={documentFiles}
              setDocumentFiles={setDocumentFiles}
            />
          )}
          {currentTimeline === 2 && (
            <PatientDetails
              data={data.patientDetails}
              updateData={(key, value) =>
                updateFormData("patientDetails", key, value)
              }
            />
          )}
          {currentTimeline === 3 && (
            <ClinicalDetails
              data={data.findings}
              updateData={(key, value) =>
                updateFormData("findings", key, value)
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
            onClick={() => {
              if (currentTimeline === 1 && documentFiles.length === 0) {
                toast({
                  title: dict?.errors?.doc_req,
                  variant: "destruct",
                });
                return;
              } else if (currentTimeline === 1 && documentFiles.length > 0) {
                handleDocumentUpload();
              } else if (currentTimeline === 3) {
                handleSubmit();
              } else {
                setCurrentTimeline(currentTimeline + 1);
              }
            }}
          >
            {currentTimeline === 1 && documentLoading
              ? dict?.pre_therapy?.loading
              : currentTimeline !== 3
              ? dict?.addPatient?.next
              : dict?.addPatient?.submit}
          </Button>
        </div>
      </div>
    </div>
  );
}
