import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { User, Star, Users, Clock } from "lucide-react";
import { Profile } from ".";
import { usePathname, useRouter } from "next/navigation";

const StudentTherapistCard = (student) => {
  // Calculate progress percentage
  const targetPatients = 20;
  const progress = (student?.patientsCount / targetPatients) * 100;
  const navigate = useRouter();
  const pathname = usePathname();

  const extractTextFromString = (inputString) => {
    try {
      const parsedArray = JSON.parse(inputString);

      if (Array.isArray(parsedArray)) {
        return parsedArray.map((item) => item.toString());
      } else {
        throw new Error("Parsed data is not an array");
      }
    } catch (error) {
      console.error("Invalid input string:", error.message);
      return [];
    }
  };
  const specialization = extractTextFromString(student?.specialization);

  const handleProfile = () => {
    navigate.push(`${pathname}/${student?.id}`);
  };

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{student?.name}</CardTitle>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary">
                {student?.experience_years} Years
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Specialization</p>
            <div className="font-medium flex py-2 gap-2">
              {specialization.map((spec) => {
                return (
                  <Badge key={spec} variant="outline m-2">
                    {spec}
                  </Badge>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Patient Progress</p>
              <span className="text-sm font-medium">
                {student?.patientsCount}/{student?.targetPatients}
                {/* Adding from Patients data */}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {student?.patientsCount} active patients
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Next: {student?.nextSession}
                  {/* Adding from therapy schema */}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleProfile}
            >
              View Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentTherapistCard;
