import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
import { GET_UNALLOCATED_PATIENTS } from "@/utils/constants";
import { Search } from "lucide-react";
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

const SelectPatientModal = ({ selectedPatient, setSelectedPatient }) => {
  const { dict } = useLanguage();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getUnallocatedPatients = async () => {
      const response = await fetch(GET_UNALLOCATED_PATIENTS, {
        method: "GET",
      });

      if (response.ok) {
        const result = await response.json();
        setPatients(result.patients);
      }
    };

    getUnallocatedPatients();
  }, []);

  const filteredPatients = patients.patientData
    ? [patients.patientData].filter((patient) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const onSelectPatient = (patient) => {
    if (selectedPatient === null) setSelectedPatient(patient._id);
    else setSelectedPatient(null);
  };

  return (
    <div className="h-full w-1/3 bg-white rounded-lg border border-gray-300 px-4 py-3 overflow-hidden">
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

      <div className="h-full space-y-4">
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
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex justify-center items-center overflow-hidden shadow-md">
                    {patient.user_image ? (
                      <Image
                        src={patient?.user_image}
                        alt="User Image"
                        className="h-full w-full object-cover rounded-full"
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
                    {patient.language}
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
