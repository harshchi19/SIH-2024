"use client";

import RightSidebar from "@/components/matchmaking/RightSidebar";
import SelectPatientModal from "@/components/matchmaking/LeftSidebar";
import { useState } from "react";

export default function MatchmakingPage() {
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div className="px-8 flex h-screen overflow-y-scroll pb-10 gap-x-5">
      <div className="w-4/5 h-full">
        <SelectPatientModal
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
        />
      </div>
      {/* <RightSidebar /> */}
    </div>
  );
}
