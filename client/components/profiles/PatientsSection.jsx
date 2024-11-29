import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientCard } from "./PatientCard";
import { FeedbackCard } from "./FeedbackCard";

export function PatientsSection({ patients, feedback }) {
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
              <PatientCard key={patient.id} patient={patient} />
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
