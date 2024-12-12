// "use client";

// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { GET_PAT_BY_ID_ROUTE } from "@/utils/constants.js";
// import {
//   User,
//   Languages,
//   Activity,
//   MessageCircle,
//   Mic,
//   AudioLines,
// } from "lucide-react"; // Import icons

// const PatientDetailView = ({
//   patient,
//   isOpen = true,
//   onClose = () => {},
//   isFullScreen = true,
// }) => {
//   const { id } = useParams();
//   const [patientData, setPatientData] = useState(patient || null);

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

//     if (!patient) {
//       getPatById();
//     }
//   }, [id, patient]);

//   const DetailCard = ({ title, icon: Icon, children }) => (
//     <Card className="w-full max-w-sm hover:shadow-lg transition-all duration-300 group">
//       <CardHeader className="flex items-center space-x-2">
//         <Icon className="text-blue-500" size={20} />
//         <CardTitle className="text-xl">{title}</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">{children}</CardContent>
//     </Card>
//   );

//   const DetailItem = ({ label, value }) => (
//     <div>
//       <p className="text-sm text-gray-500">{label}</p>
//       <p className="font-medium">{value || "N/A"}</p>
//     </div>
//   );

//   const DetailBadgeItem = ({ label, values }) => (
//     <div>
//       <p className="text-sm text-gray-500 mb-2">{label}</p>
//       <div className="flex gap-2 flex-wrap">
//         {Array.isArray(values) ? (
//           values.map((value, index) => (
//             <Badge key={index} variant="outline">
//               {value}
//             </Badge>
//           ))
//         ) : (
//           <Badge variant="secondary">{values}</Badge>
//         )}
//       </div>
//     </div>
//   );

//   if (!patientData) return null;

//   const content = (
//     <div
//       className={`${
//         isFullScreen ? "h-full w-full p-8" : ""
//       } grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto`}
//     >
//       {/* Personal Information */}
//       <DetailCard title="Personal Information" icon={User}>
//         <DetailItem label="Name" value={patientData.name} />
//         <DetailItem label="Age" value={`${patientData.age} years`} />
//         <DetailItem label="Sex" value={patientData.sex} />
//         <DetailItem label="Contact Number" value={patientData.phone_no} />
//         <DetailItem label="Email" value={patientData.email} />
//         <DetailItem label="Case Number" value={patientData.case_no} />
//       </DetailCard>

//       {/* Languages Details */}
//       <DetailCard title="Languages Details" icon={Languages}>
//         <DetailBadgeItem
//           label="Preferred Languages"
//           values={[
//             patientData.preferred_language1,
//             patientData.preferred_language2,
//             patientData.preferred_language3,
//           ].filter(Boolean)}
//         />
//         <DetailItem
//           label="Multilingual Factors"
//           value={patientData.medical_details?.multilingual_factors}
//         />
//       </DetailCard>

//       {/* Medical Information */}
//       <DetailCard title="Medical Information" icon={Activity}>
//         <DetailItem label="Patient Issue" value={patientData.patient_issue} />
//         <DetailItem
//           label="Diagnostic Formulation"
//           value={patientData.medical_details?.diagnostic_formulation}
//         />
//         <DetailItem
//           label="Clinical Impression"
//           value={patientData.medical_details?.clinical_impression}
//         />
//       </DetailCard>

//       {/* Speech Development */}
//       <DetailCard title="Speech Development" icon={MessageCircle}>
//         <DetailItem
//           label="First Word"
//           value={patientData.speech_development_history?.first_word}
//         />
//         <DetailItem
//           label="First Sentence"
//           value={patientData.speech_development_history?.first_sentence}
//         />
//         <DetailItem
//           label="Vocalization"
//           value={patientData.speech_development_history?.vocalization}
//         />
//       </DetailCard>

//       {/* Non-Verbal Communication */}
//       <DetailCard title="Communication" icon={Mic}>
//         <DetailItem
//           label="Expression Level"
//           value={patientData.non_verbal_communication?.expression_level}
//         />
//         <DetailItem
//           label="Comprehension Level"
//           value={patientData.non_verbal_communication?.comprehension_level}
//         />
//       </DetailCard>

//       {/* Voice Details */}
//       <DetailCard title="Voice Characteristics" icon={AudioLines}>
//         <DetailItem
//           label="Pitch Quality"
//           value={patientData.voice_details?.pitch_quality}
//         />
//         <DetailItem
//           label="Loudness"
//           value={patientData.voice_details?.loudness}
//         />
//         <DetailItem
//           label="Voice Quality"
//           value={patientData.voice_details?.voice_quality}
//         />
//       </DetailCard>
//     </div>
//   );

//   if (isFullScreen) {
//     return content;
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto">
//         <div className="space-y-6">
//           <h2 className="text-2xl font-bold">
//             {patientData.name} - Comprehensive Patient Profile
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
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { GET_PAT_BY_ID_ROUTE } from "@/utils/constants.js";
import {
  User,
  Languages,
  Activity,
  MessageCircle,
  Mic,
  AudioLines,
  MapPin,
  FileText,
  Feather,
  Type,
  BookOpen,
  SpeechIcon,
} from "lucide-react";

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

  const DetailCard = ({ title, icon: Icon, children }) => (
    <Card className="w-full max-w-sm hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="flex items-center space-x-2">
        <Icon className="text-blue-500" size={20} />
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );

  const DetailItem = ({ label, value }) => (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value || "N/A"}</p>
    </div>
  );

  const DetailBadgeItem = ({ label, values }) => (
    <div>
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {Array.isArray(values) ? (
          values.map((value, index) => (
            <Badge key={index} variant="outline">
              {value}
            </Badge>
          ))
        ) : (
          <Badge variant="secondary">{values}</Badge>
        )}
      </div>
    </div>
  );

  if (!patientData) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const content = (
    <div
      className={`${
        isFullScreen ? "h-full w-full p-8" : ""
      } grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto`}
    >
      {/* Personal Information */}
      <DetailCard title="Personal Information" icon={User}>
        <DetailItem label="Name" value={patientData.name} />
        <DetailItem label="Age" value={`${patientData.age} years`} />
        <DetailItem label="Sex" value={patientData.sex} />
        <DetailItem label="Patient ID" value={patientData.patient_id} />
        <DetailItem label="Case Number" value={patientData.case_no} />
        <DetailItem
          label="Date of Birth"
          value={formatDate(patientData.date_of_birth)}
        />
        <DetailItem
          label="Date of Assignment"
          value={formatDate(patientData.date_of_assignment)}
        />
        <DetailItem label="Contact Number" value={patientData.phone_no} />
        <DetailItem label="Email" value={patientData.email} />
      </DetailCard>

      {/* Address Details */}
      <DetailCard title="Address Details" icon={MapPin}>
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

      {/* Languages Details */}
      <DetailCard title="Languages Details" icon={Languages}>
        <DetailBadgeItem
          label="Preferred Languages"
          values={[
            patientData.preferred_language1,
            patientData.preferred_language2,
            patientData.preferred_language3,
          ].filter(Boolean)}
        />
        <DetailItem
          label="Multilingual Factors"
          value={patientData.medical_details?.multilingual_factors}
        />
      </DetailCard>

      {/* Medical Details */}
      <DetailCard title="Medical Information" icon={Activity}>
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
          label="Details to Pay Attention"
          value={patientData.medical_details?.details_to_pay_attention}
        />
        <DetailItem
          label="Language Evaluation"
          value={patientData.medical_details?.language_evaluation}
        />
        <DetailItem
          label="Auditory Skills"
          value={patientData.medical_details?.auditory_skills}
        />
        <DetailItem
          label="Formal Testing"
          value={patientData.medical_details?.formal_testing}
        />
        <DetailItem
          label="Recommendations"
          value={patientData.medical_details?.recommendations}
        />
      </DetailCard>

      {/* Speech Development */}
      <DetailCard title="Speech Development" icon={MessageCircle}>
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
      <DetailCard title="Communication" icon={Mic}>
        <DetailItem
          label="Expression Level"
          value={patientData.non_verbal_communication?.expression_level}
        />
        <DetailItem
          label="Comprehension Level"
          value={patientData.non_verbal_communication?.comprehension_level}
        />
      </DetailCard>

      {/* Articulation and Phonetic Level */}
      <DetailCard title="Articulation" icon={Type}>
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

      {/* Voice Details */}
      <DetailCard title="Voice Characteristics" icon={AudioLines}>
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

      {/* Suprasegmental Aspects */}
      <DetailCard title="Speech Characteristics" icon={SpeechIcon}>
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

      {/* Reading and Writing Skills */}
      <DetailCard title="Reading & Writing Skills" icon={BookOpen}>
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
