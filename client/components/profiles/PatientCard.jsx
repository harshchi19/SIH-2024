import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  useSessionByTherapist,
  useSessionByTherapistByPatient,
} from "@/hooks/useSessionByTherapistByPatient";
import { useEffect, useState } from "react";
import { lastDateOfMonth } from "@syncfusion/ej2-react-schedule";

export function PatientCard({ patient, studentTherapistId }) {
  const { lang, role } = useParams();
  const navigate = useRouter();
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Completing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const [sessions, setSessions] = useState([]);
  const { getSessionByTherapistByPatient, isLoading, error } =
    useSessionByTherapistByPatient();

  const fetchSessions = async () => {
    const { success, sessions } = await getSessionByTherapistByPatient(
      studentTherapistId,
      patient.patient_id
    );
    if (success) {
      setSessions(sessions);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [studentTherapistId]);

  const latestSession = sessions?.[0] || {};
  console.log("Sessions: ", latestSession);

  const handleClick = (id) => {
    navigate.push(`/${lang}/${role}/pre_therapy/${patient?.patient_id}`); //To be changed
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              {patient.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              <User2 className="inline-block w-4 h-4 mr-1" />
              {patient.age} years old
            </p>
          </div>
          <Badge className={getStatusColor(latestSession.report_status)}>
            {latestSession.report_status || "Active"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Condition:</span>
            <span className="font-medium">
              {latestSession.report_name || "Speech"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Started:</span>
            <span>
              {new Date(latestSession.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{latestSession.progress || 30}%</span>
          </div>
          <Progress value={latestSession.progress || 30} className="h-2 " />
        </div>

        <div className="flex items-center justify-between pt-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>
            Next: {new Date(latestSession.updatedAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleClick(patient.patient_id)}
          >
            View Therapy Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
