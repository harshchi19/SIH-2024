"use client";

import RightSidebar from "@/components/matchmaking/RightSidebar";
import SelectPatientModal from "@/components/matchmaking/LeftSidebar";
import SelectedStudentTherapist from "@/components/matchmaking/SelectedStudentTherapist";
import SelectSupervisor from "@/components/matchmaking/SelectSupervisor";
import { useState, useEffect } from "react";
import { GET_ALL_STT_ROUTE, GET_ALL_SUP_ROUTE } from "@/utils/constants";
import Loader from "@/components/Loader";
import { GET_UNALLOCATED_PATIENTS } from "@/utils/constants";

export default function MatchmakingPage() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [studentTherapists, setStudentTherapists] = useState([]);
  const [filteredTherapists, setFilteredTherapists] = useState([]);
  const [filteredSupervisors, setFilteredSupervisors] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [therapistResponse, supervisorResponse] = await Promise.all([
          fetch(GET_ALL_STT_ROUTE, { method: "GET" }),
          fetch(GET_ALL_SUP_ROUTE, { method: "GET" }),
        ]);

        if (therapistResponse.ok) {
          const therapistResult = await therapistResponse.json();
          setStudentTherapists(therapistResult);
          setFilteredTherapists(therapistResult);
        }
        if (supervisorResponse.ok) {
          const supervisorResult = await supervisorResponse.json();
          setSupervisors(supervisorResult);
          setFilteredSupervisors(supervisorResult);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="px-8 flex h-screen overflow-y-scroll pb-10 gap-x-5">
      <div className="w-4/5 h-full flex gap-x-3">
        <SelectPatientModal
          patients={patients}
          setPatients={setPatients}
          selectedPatientId={selectedPatientId}
          setSelectedPatientId={setSelectedPatientId}
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
        />
        <div className="flex w-2/3 gap-x-3">
          <SelectedStudentTherapist
            filteredTherapists={filteredTherapists}
            selectedTherapist={selectedTherapist}
            setSelectedTherapist={setSelectedTherapist}
          />

          <SelectSupervisor
            filteredSupervisors={filteredSupervisors}
            selectedSupervisor={selectedSupervisor}
            setSelectedSupervisor={setSelectedSupervisor}
          />
        </div>
      </div>
      <RightSidebar
        selectedPatientId={selectedPatientId}
        selectedPatient={selectedPatient}
        studentTherapists={studentTherapists}
        filteredTherapists={filteredTherapists}
        setFilteredTherapists={setFilteredTherapists}
        supervisors={supervisors}
        filteredSupervisors={filteredSupervisors}
        setFilteredSupervisors={setFilteredSupervisors}
        selectedTherapist={selectedTherapist}
        selectedSupervisor={selectedSupervisor}
      />
    </div>
  );
}
