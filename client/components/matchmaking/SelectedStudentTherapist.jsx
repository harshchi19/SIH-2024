import { useLanguage } from "@/context/LanguageContext";

import { useEffect, useState } from "react";

const StudentTherapistCard = ({ therapist }) => (
  <div className="p-4 border rounded-lg shadow-sm">
    <h2 className="font-bold text-lg">{therapist.name}</h2>
    <p>Email: {therapist.email}</p>
    <p>Phone: {therapist.phone_no}</p>
    <p>Specialization: {JSON.parse(therapist.specialization).join(", ")}</p>
    <p>Experience: {therapist.experience_years} years</p>
    <p>
      Location: {therapist.location.city}, {therapist.location.state}
    </p>
  </div>
);

const SelectedStudentTherapist = ({ filteredTherapists }) => {
  const { dict } = useLanguage();

  return (
    <div className="h-full w-2/3 bg-white rounded-lg border border-gray-300 px-4 py-3 overflow-hidden">
      <h1 className="text-xl font-semibold">{dict?.matchmaking?.therapists}</h1>

      <div className="flex flex-col gap-4 mt-2">
        {filteredTherapists.length > 0 ? (
          filteredTherapists.map((therapist) => (
            <StudentTherapistCard key={therapist._id} therapist={therapist} />
          ))
        ) : (
          <p>No student therapists match the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default SelectedStudentTherapist;
