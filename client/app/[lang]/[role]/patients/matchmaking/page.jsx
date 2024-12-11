"use client";

import RightSidebar from "@/components/matchmaking/RightSidebar";
import SelectPatientModal from "@/components/matchmaking/LeftSidebar";
import SelectedStudentTherapist from "@/components/matchmaking/SelectedStudentTherapist";
import { useState, useEffect } from "react";
import { GET_ALL_STT_ROUTE } from "@/utils/constants";

export default function MatchmakingPage() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [studentTherapists, setStudentTherapists] = useState([]);
  const [filteredTherapists, setFilteredTherapists] = useState([]);

  useEffect(() => {
    const getAllStudents = async () => {
      const response = await fetch(GET_ALL_STT_ROUTE, {
        method: "GET",
      });

      if (response.ok) {
        const result = await response.json();
        setStudentTherapists(result);
        setFilteredTherapists(result);
      }
    };

    getAllStudents();
  }, []);

  console.log(filteredTherapists);

  return (
    <div className="px-8 flex h-screen overflow-y-scroll pb-10 gap-x-5">
      <div className="w-4/5 h-full flex gap-x-5">
        <SelectPatientModal
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
        />
        <SelectedStudentTherapist
          filteredTherapists={filteredTherapists}
          selectedTherapist={selectedTherapist}
          setSelectedTherapist={setSelectedTherapist}
        />
      </div>
      <RightSidebar />
    </div>
  );
}
