import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientCard } from "./PatientCard";
import { FeedbackCard } from "./FeedbackCard";
import { useSessionByTherapist } from "@/hooks/useSessionByTherapistByPatient";
import { useEffect, useState } from "react";
import { GET_ALL_PAT_ROUTE } from "@/utils/constants";

export function PatientsSection({ patients, feedback, studentTherapistId }) {
  const [patientData, setPatientData] = useState("");

  useEffect(() => {
    const fetchAllPatients = async () => {
      try {
        const response = await fetch(GET_ALL_PAT_ROUTE, {
          method: "GET",
          // headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (response.ok) {
          const result = await response.json();
        }
      } catch (error) {
        console.error("Error fetching patients", error);
      }
    };

    fetchAllPatients();
  }, []);

  return (
    <div className="space-y-6">
      {/* Patients List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {patients.map((patient, index) => (
              <PatientCard
                key={index}
                patient={patient}
                studentTherapistId={studentTherapistId}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supervisor Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Supervisor Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {feedback.map((item) => (
              <FeedbackCard key={item.id} feedback={item} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
