import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
import { Eye, Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { UserRound, Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const SelectPatientModal = ({
  patients,
  setPatients,
  selectedPatient,
  selectedPatientId,
  setSelectedPatientId,
  setSelectedPatient,
}) => {
  const { dict, currentLang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { role } = useParams();

  const filteredPatients = patients
    ? patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const onSelectPatient = (patient) => {
    if (selectedPatient === null) {
      setSelectedPatient(patient._id);
      setSelectedPatientId(patient.patient_id);
    } else {
      setSelectedPatient(null);
    }
  };

  return (
    <div className="h-full w-1/3 bg-white rounded-lg border border-gray-300 px-4 py-3 overflow-y-scroll">
      <h1 className="text-xl font-semibold">{dict?.matchmaking?.patients}</h1>
      <div className="relative">
        <Input
          type="text"
          placeholder={dict?.matchmaking?.search_plchldr}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded mb-4 mt-2 pr-12"
        />
        <Search className="absolute top-2 right-4 h-5 w-auto cursor-pointer" />
      </div>

      <div className="h-fit space-y-4 ">
        {filteredPatients?.length > 0 ? (
          filteredPatients?.map((patient) => (
            <div
              key={patient?._id}
              className={`p-[1px] ${
                selectedPatient === patient._id
                  ? "border-2 border-green-500 rounded-lg"
                  : "border-2 border-transparent"
              }`}
            >
              <Card
                onClick={() => onSelectPatient(patient)}
                className={`cursor-pointer relative transition-shadow transform rounded-lg border border-gray-200 shadow-sm select-none`}
              >
                <div
                  className={`h-5 w-5 rounded-full absolute right-3 top-3 ${
                    selectedPatient === patient._id ? "border-none" : "border-2"
                  }`}
                >
                  {selectedPatient === patient._id && (
                    <Check className="h-5 w-5 rounded-full p-px bg-green-500 text-white" />
                  )}
                </div>
                <CardHeader className="flex items-center space-x-2 py-4 justify-start">
                  <div className="h-12 w-12 relative rounded-full bg-gray-200 flex justify-center items-center overflow-hidden shadow-md group">
                    <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/30 transition-all duration-300 ease-in-out flex items-center justify-center">
                      <Eye
                        className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                        onClick={() =>
                          router.push(
                            `/${currentLang}/${role}/patients/${patient.patient_id}`
                          )
                        }
                      />
                    </div>

                    {patient.user_image ? (
                      <Image
                        src={patient?.user_image}
                        alt="User Image"
                        fill
                        className="h-full w-full object-cover rounded-full group-hover:scale-110 group-hover:blur-sm transition-all duration-300 ease-in-out"
                      />
                    ) : (
                      <UserRound className="h-8 w-auto text-gray-600" />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <CardTitle className="text-md font-semibold text-gray-800">
                      {patient.name}
                    </CardTitle>
                    <CardDescription className="text-sm tracking-tight text-gray-600">
                      <span className="truncate">{patient.case_no}</span>
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2 px-4 text-gray-700">
                  <p className="text-sm">
                    <strong>{dict?.matchmaking?.phone}:</strong>{" "}
                    {patient.phone_no}
                  </p>
                  <p className="text-sm">
                    <strong>{dict?.matchmaking?.email}:</strong> {patient.email}
                  </p>
                  <p className="text-sm">
                    <strong>{dict?.matchmaking?.language}:</strong>{" "}
                    {patient.language1}, {patient.language2},{" "}
                    {patient.language3}
                  </p>
                  <p className="text-sm">
                    <strong>{dict?.matchmaking?.issue}:</strong>{" "}
                    {patient.patient_issue.length > 120
                      ? `${patient.patient_issue.substring(0, 120)}...`
                      : patient.patient_issue}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          <div className="h-full text-gray-500 text-center py-4">
            {dict?.matchmaking?.no_pat_found}
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default SelectPatientModal;
