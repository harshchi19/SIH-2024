import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientCard } from "./PatientCard";
import { FeedbackCard } from "./FeedbackCard";
import { useSessionByTherapist } from "@/hooks/useSessionByTherapistByPatient";
import { useEffect, useState } from "react";

export function PatientsSection({ patients, feedback, studentTherapistId }) {
  return (
    <div className="space-y-6">
      {/* Patients List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {patients.map((patient) => (
              <PatientCard
                key={patient.patient_id}
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
