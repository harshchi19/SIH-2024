import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, User2 } from "lucide-react";

export function PatientCard({ patient }) {
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
          <Badge className={getStatusColor(patient.status)}>
            {patient.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Condition:</span>
            <span className="font-medium">{patient.condition}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Started:</span>
            <span>{new Date(patient.startDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{patient.progress}%</span>
          </div>
          <Progress value={patient.progress} className="h-2 " />
        </div>

        <div className="flex items-center justify-between pt-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>
            Next: {new Date(patient.nextAppointment).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
