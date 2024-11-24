"use client";

import Loader from "@/components/Loader";
import {
  AddressDetails,
  ArticulationPhoneticLevelDetails,
  BasicDetails,
  MedicalDetails,
  NonVerbalCommunicationDetails,
  ReadingWritingSkills,
  SpeechDevelopmentHistoryDetails,
  SuprasegmentalAspectsDetails,
  VoiceDetails,
} from "@/components/patients";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

const TimelineComponent = ({ currentTimeline, setCurrentTimeline }) => {
  const { dict } = useLanguage();

  const TimelineData = [
    { name: dict?.addPatient?.basic, value: 1 },
    { name: dict?.addPatient?.address, value: 2 },
    { name: dict?.addPatient?.speech, value: 3 },
    { name: dict?.addPatient?.nonverbal, value: 4 },
    { name: dict?.addPatient?.articulation, value: 5 },
    { name: dict?.addPatient?.voice, value: 6 },
    { name: dict?.addPatient?.suprasegmental, value: 7 },
    { name: dict?.addPatient?.reading, value: 8 },
    { name: dict?.addPatient?.medical, value: 9 },
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

export default function AddPatientPage() {
  const [currentTimeline, setCurrentTimeline] = useState(1);
  const { dict } = useLanguage();
  const [formData, setFormData] = useState({
    basicDetails: {
      name: "",
      password: "",
      phone_no: "",
      email: "",
      date_of_birth: "",
      sex: "",
      preferred_language: "",
      supervisor: "",
      summary: "",
      user_image: null,
    },
    addressDetails: {
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    },
    medicalDetails: {
      multilingual_factors: "",
      details_to_pay_attention: "",
      language_evaluation: "",
      auditory_skills: "",
      formal_testing: "",
      diagnostic_formulation: "",
      clinical_impression: "",
      recommendations: "",
    },
    speechDevelopmentHistory: {
      vocalization: "",
      babbling: "",
      first_word: "",
      first_sentence: "",
    },
    nonVerbalCommunication: {
      expression_level: "",
      comprehension_level: "",
    },
    articulationPhoneticLevel: {
      vowels_stage: "",
      consonants_stage: "",
      blends_stage: "",
    },
    voiceDetails: {
      pitch_quality: "",
      loudness: "",
      voice_quality: "",
      breath_control: "",
    },
    suprasegmentalAspects: {
      emphasis_level: "",
      intonation: "",
      phrasing: "",
      speech_rate: "",
    },
    readingWritingSkills: {
      letter_recognition: "",
      word_recognition: "",
      reading_comprehension: "",
      copying: "",
      writing_to_dictation: "",
      spontaneous_writing: "",
    },
  });

  if (!dict) {
    return (
      <>
        <Loader />
      </>
    );
  }

  console.log(formData);

  const updateFormData = (section, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const updateRangeData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {};

  return (
    <div className="px-8 flex pb-10">
      <TimelineComponent
        currentTimeline={currentTimeline}
        setCurrentTimeline={setCurrentTimeline}
      />
      <div className="actual-receipt w-full h-fit flex flex-col gap-y-10 justify-between border-2 rounded-xl px-8 py-6">
        <div>
          {currentTimeline === 1 && (
            <BasicDetails
              data={formData.basicDetails}
              updateData={(key, value) =>
                updateFormData("basicDetails", key, value)
              }
            />
          )}
          {currentTimeline === 2 && (
            <AddressDetails
              data={formData.addressDetails}
              updateData={(value) => updateFormData("addressDetails", value)}
            />
          )}
          {currentTimeline === 3 && (
            <SpeechDevelopmentHistoryDetails
              data={formData.speechDevelopmentHistory}
              updateData={(value) =>
                updateFormData("speechDevelopmentHistory", value)
              }
            />
          )}
          {currentTimeline === 4 && (
            <NonVerbalCommunicationDetails
              data={formData.nonVerbalCommunication}
              updateData={(value) =>
                updateFormData("nonVerbalCommunication", value)
              }
            />
          )}
          {currentTimeline === 5 && (
            <ArticulationPhoneticLevelDetails
              data={formData.articulationPhoneticLevel}
              updateData={(value) =>
                updateRangeData("articulationPhoneticLevel", value)
              }
            />
          )}
          {currentTimeline === 6 && (
            <VoiceDetails
              data={formData.voiceDetails}
              updateData={(value) => updateFormData("voiceDetails", value)}
            />
          )}
          {currentTimeline === 7 && (
            <SuprasegmentalAspectsDetails
              data={formData.suprasegmentalAspects}
              updateData={(value) =>
                updateFormData("suprasegmentalAspects", value)
              }
            />
          )}
          {currentTimeline === 8 && (
            <ReadingWritingSkills
              data={formData.readingWritingSkills}
              updateData={(value) =>
                updateRangeData("readingWritingSkills", value)
              }
            />
          )}
          {currentTimeline === 9 && (
            <MedicalDetails
              data={formData.medicalDetails}
              updateData={(value) => updateFormData("medicalDetails", value)}
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
              currentTimeline !== 9
                ? () => setCurrentTimeline(currentTimeline + 1)
                : handleSubmit
            }
          >
            {currentTimeline !== 9
              ? dict?.addPatient?.next
              : dict?.addPatient?.submit}
          </Button>
        </div>
      </div>
    </div>
  );
}
