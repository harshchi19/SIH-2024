// "use client";

// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { User, Calendar, Phone, Mail, MapPin } from "lucide-react";
// import { useById } from "@/hooks/useById";
// import { useGetRole } from "@/hooks/useGetRole";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { GET_PAT_BY_ID_ROUTE } from "@/utils/constants.js";

// const PatientDetailView = ({
//   patient,
//   isOpen = true,
//   onClose = () => {},
//   isFullScreen = true,
// }) => {
//   //   if (!patient) return null;
//   const { id } = useParams();
//   const { getById } = useById();
//   const [patientData, setPatientData] = useState([]);

//   useEffect(() => {
//     const getPatById = async () => {
//       try {
//         const response = await fetch(`${GET_PAT_BY_ID_ROUTE}/${id}`, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         });
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         if (response.ok) {
//           const result = await response.json();

//           setPatientData(result);
//         }
//       } catch (error) {
//         console.log("Error fetching patients", error);
//       }
//     };
//     // if (id) {
//     getPatById();

//     // }
//   }, []);
//   const DetailCard = ({ title, children }) => (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>{title}</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">{children}</CardContent>
//     </Card>
//   );

//   const DetailItem = ({ icon: Icon, label, value }) => (
//     <div className="flex items-center gap-4">
//       <Icon className="w-5 h-5 text-slate-600" />
//       <div>
//         <p className="font-semibold">{label}</p>
//         <p>{value}</p>
//       </div>
//     </div>
//   );

//   const content = (
//     <div
//       className={`${
//         isFullScreen ? "h-full w-full p-8" : ""
//       } grid md:grid-cols-2 gap-6 overflow-y-auto`}
//     >
//       {/* Personal Information */}
//       <DetailCard title="Personal Information">
//         <DetailItem icon={User} label="Name" value={patientData?.name} />
//         <DetailItem
//           icon={Calendar}
//           label="Age"
//           value={`${patientData?.age} years`}
//         />
//         <DetailItem icon={User} label="Sex" value={patientData?.sex} />
//         <DetailItem
//           icon={Phone}
//           label="Contact Number"
//           value={patientData?.phone_no}
//         />
//         <DetailItem icon={Mail} label="Email" value={patientData?.email} />
//       </DetailCard>

//       {/* Address Information */}
//       <DetailCard title="Address Details">
//         <DetailItem
//           icon={MapPin}
//           label="Address Line 1"
//           value={patientData?.address_details?.address_line1}
//         />
//         <DetailItem
//           icon={MapPin}
//           label="Address Line 2"
//           value={patientData?.address_details?.address_line2}
//         />
//         <DetailItem
//           icon={MapPin}
//           label="City"
//           value={patientData?.address_details?.city}
//         />
//         <DetailItem
//           icon={MapPin}
//           label="State"
//           value={patientData?.address_details?.state}
//         />
//         <DetailItem
//           icon={MapPin}
//           label="Postal Code"
//           value={patientData?.address_details?.postal_code}
//         />
//       </DetailCard>
//       {/* Language Details */}
//       <DetailCard title="Language Details">
//         <div>
//           <p className="font-semibold">Preferred Languages</p>
//           <ul className="list-disc pl-5">
//             <li>{patientData?.preferred_language1}</li>
//             <li>{patientData?.preferred_language2}</li>
//             <li>{patientData?.preferred_language3}</li>
//           </ul>
//         </div>
//         <div>
//           <p className="font-semibold">Multilingual Factors</p>
//           <p>{patientData?.medical_details?.multilingual_factors}</p>
//         </div>
//       </DetailCard>
//       {/* Medical Information */}
//       <DetailCard title="Medical Information">
//         <div>
//           <p className="font-semibold">Patient Issue</p>
//           <p>{patientData?.patient_issue}</p>
//         </div>
//         <div>
//           <p className="font-semibold">Diagnostic Formulation</p>
//           <p>{patientData?.medical_details?.diagnostic_formulation}</p>
//         </div>
//         <div>
//           <p className="font-semibold">Clinical Impression</p>
//           <p>{patientData?.medical_details?.clinical_impression}</p>
//         </div>
//         <div>
//           <p className="font-semibold">Recommendations</p>
//           <p>{patientData?.medical_details?.recommendations}</p>
//         </div>
//       </DetailCard>
//     </div>
//   );

//   if (isFullScreen) {
//     return content;
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
//         <div className="space-y-6">
//           <h2 className="text-2xl font-bold">
//             {patientData?.name} - Detailed Profile
//           </h2>
//           {content}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default PatientDetailView;

"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { GET_PAT_BY_ID_ROUTE } from "@/utils/constants.js";

const PatientDetailView = ({
  patient,
  isOpen = true,
  onClose = () => {},
  isFullScreen = true,
}) => {
  const { id } = useParams();
  const [patientData, setPatientData] = useState(patient || null);

  useEffect(() => {
    const getPatById = async () => {
      try {
        const response = await fetch(`${GET_PAT_BY_ID_ROUTE}/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (response.ok) {
          const result = await response.json();
          setPatientData(result);
        }
      } catch (error) {
        console.log("Error fetching patients", error);
      }
    };

    if (!patient) {
      getPatById();
    }
  }, [id, patient]);

  const DetailCard = ({ title, children }) => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );

  const DetailItem = ({ label, value }) => (
    <div>
      <p className="font-semibold">{label}</p>
      <p>{value || "N/A"}</p>
    </div>
  );

  if (!patientData) return null;

  const content = (
    <div
      className={`${
        isFullScreen ? "h-full w-full p-8" : ""
      } grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto`}
    >
      {/* Personal Information */}
      <DetailCard title="Personal Information">
        <DetailItem label="Name" value={patientData.name} />
        <DetailItem label="Age" value={`${patientData.age} years`} />
        <DetailItem label="Sex" value={patientData.sex} />
        <DetailItem label="Contact Number" value={patientData.phone_no} />
        <DetailItem label="Email" value={patientData.email} />
        <DetailItem label="Case Number" value={patientData.case_no} />
      </DetailCard>

      {/* Address Information */}
      <DetailCard title="Address Details">
        <DetailItem
          label="Address Line 1"
          value={patientData.address_details?.address_line1}
        />
        <DetailItem
          label="Address Line 2"
          value={patientData.address_details?.address_line2}
        />
        <DetailItem label="City" value={patientData.address_details?.city} />
        <DetailItem label="State" value={patientData.address_details?.state} />
        <DetailItem
          label="Country"
          value={patientData.address_details?.country}
        />
        <DetailItem
          label="Postal Code"
          value={patientData.address_details?.postal_code}
        />
      </DetailCard>

      {/* Language Details */}
      <DetailCard title="Language Details">
        <div className="space-y-2">
          <p className="font-semibold">Preferred Languages</p>
          <ul className="list-disc pl-5">
            <li>{patientData.preferred_language1}</li>
            <li>{patientData.preferred_language2}</li>
            <li>{patientData.preferred_language3}</li>
          </ul>
        </div>
        <DetailItem
          label="Multilingual Factors"
          value={patientData.medical_details?.multilingual_factors}
        />
      </DetailCard>

      {/* Medical Information */}
      <DetailCard title="Medical Information">
        <DetailItem label="Patient Issue" value={patientData.patient_issue} />
        <DetailItem
          label="Diagnostic Formulation"
          value={patientData.medical_details?.diagnostic_formulation}
        />
        <DetailItem
          label="Clinical Impression"
          value={patientData.medical_details?.clinical_impression}
        />
        <DetailItem
          label="Recommendations"
          value={patientData.medical_details?.recommendations}
        />
        <DetailItem
          label="Details to Pay Attention"
          value={patientData.medical_details?.details_to_pay_attention}
        />
        <DetailItem
          label="Language Evaluation"
          value={patientData.medical_details?.language_evaluation}
        />
      </DetailCard>

      {/* Speech Development */}
      <DetailCard title="Speech Development History">
        <DetailItem
          label="Vocalization"
          value={patientData.speech_development_history?.vocalization}
        />
        <DetailItem
          label="Babbling"
          value={patientData.speech_development_history?.babbling}
        />
        <DetailItem
          label="First Word"
          value={patientData.speech_development_history?.first_word}
        />
        <DetailItem
          label="First Sentence"
          value={patientData.speech_development_history?.first_sentence}
        />
      </DetailCard>

      {/* Non-Verbal Communication */}
      <DetailCard title="Non-Verbal Communication">
        <DetailItem
          label="Expression Level"
          value={patientData.non_verbal_communication?.expression_level}
        />
        <DetailItem
          label="Comprehension Level"
          value={patientData.non_verbal_communication?.comprehension_level}
        />
      </DetailCard>

      {/* Voice Details */}
      <DetailCard title="Voice Details">
        <DetailItem
          label="Pitch Quality"
          value={patientData.voice_details?.pitch_quality}
        />
        <DetailItem
          label="Loudness"
          value={patientData.voice_details?.loudness}
        />
        <DetailItem
          label="Voice Quality"
          value={patientData.voice_details?.voice_quality}
        />
        <DetailItem
          label="Breath Control"
          value={patientData.voice_details?.breath_control}
        />
      </DetailCard>

      {/* Articulation & Phonetic Level */}
      <DetailCard title="Articulation Phonetic Level">
        <DetailItem
          label="Vowels Stage"
          value={patientData.articulation_phonetic_level?.vowels_stage}
        />
        <DetailItem
          label="Consonants Stage"
          value={patientData.articulation_phonetic_level?.consonants_stage}
        />
        <DetailItem
          label="Blends Stage"
          value={patientData.articulation_phonetic_level?.blends_stage}
        />
      </DetailCard>

      {/* Suprasegmental Aspects */}
      <DetailCard title="Suprasegmental Aspects">
        <DetailItem
          label="Emphasis Level"
          value={patientData.suprasegmental_aspects?.emphasis_level}
        />
        <DetailItem
          label="Intonation"
          value={patientData.suprasegmental_aspects?.intonation}
        />
        <DetailItem
          label="Phrasing"
          value={patientData.suprasegmental_aspects?.phrasing}
        />
        <DetailItem
          label="Speech Rate"
          value={patientData.suprasegmental_aspects?.speech_rate}
        />
      </DetailCard>

      {/* Reading & Writing Skills */}
      <DetailCard title="Reading & Writing Skills">
        <DetailItem
          label="Letter Recognition"
          value={patientData.reading_writing_skills?.letter_recognition}
        />
        <DetailItem
          label="Word Recognition"
          value={patientData.reading_writing_skills?.word_recognition}
        />
        <DetailItem
          label="Reading Comprehension"
          value={patientData.reading_writing_skills?.reading_comprehension}
        />
        <DetailItem
          label="Copying"
          value={patientData.reading_writing_skills?.copying}
        />
        <DetailItem
          label="Writing to Dictation"
          value={patientData.reading_writing_skills?.writing_to_dictation}
        />
        <DetailItem
          label="Spontaneous Writing"
          value={patientData.reading_writing_skills?.spontaneous_writing}
        />
      </DetailCard>
    </div>
  );

  if (isFullScreen) {
    return content;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">
            {patientData.name} - Comprehensive Patient Profile
          </h2>
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailView;
