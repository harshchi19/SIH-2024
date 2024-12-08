"use client";

import RightSidebar from "@/components/matchmaking/RightSidebar";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
import { GET_UNALLOCATED_PATIENTS } from "@/utils/constants";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const SelectPatientModal = () => {
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

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full w-80 bg-white rounded-lg border border-gray-300 px-4 py-3">
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

      <ul className="space-y-2">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <li
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
            >
              {patient.name}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No patients found</li>
        )}
      </ul>
      <div></div>
    </div>
  );
};

export default function MatchmakingPage() {
  const [allPatients, setAllPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState([]);

  return (
    <div className="px-8 flex h-screen overflow-y-scroll pb-10 gap-x-5">
      <div className="w-4/5 h-full">
        <SelectPatientModal />
      </div>
      <RightSidebar />
    </div>
  );
}
