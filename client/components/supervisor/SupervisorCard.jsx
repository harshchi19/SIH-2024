import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "../ui/progress";
import { User, EyeIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useByObjectId } from "@/hooks/useByObjectId";
import { useEffect, useState } from "react";

const SupervisorCard = ({ supervisor }) => {
  const pathname = usePathname();
  const navigate = useRouter();
  const totalPatients =
    supervisor?.activePatients + supervisor.inactivePatients;
  const activePercentage = (supervisor?.activePatients / totalPatients) * 100;

  const handleSubmit = () => {
    console.log("View Supervisor Details");
    navigate.push(`${pathname}/${supervisor?.supervisor_id}`);
  };

  const { getByObjectId } = useByObjectId();
  const [therapists, setTherapists] = useState([]);

  useEffect(() => {
    supervisor?.allocated_therapists?.forEach((therapistId) => {
      getByObjectId(therapistId, "STT")
        .then((res) => {
          if (res.success) {
            const therapist = res.user;

            // Check if therapist already exists in state
            setTherapists((prev) => {
              const exists = prev.some((t) => t._id === therapist._id);
              return exists ? prev : [...prev, therapist];
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }, [supervisor.allocated_therapists]);

  console.log("Unique Therapists:", therapists);

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-4">
          <User className="h-6 w-6 text-blue-600" />
          <div>
            <CardTitle className="text-xl font-bold">
              {supervisor.name}
            </CardTitle>
            <p className="text-muted-foreground">{supervisor.department}</p>
          </div>
        </div>
        <Button variant="outline" size="icon" onClick={handleSubmit}>
          <EyeIcon className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="w-full grid md:grid-cols-1 gap-1 p-6">
        {/* Student Therapists Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Student Therapists</h3>
          <div className="h-34 space-y-2 overflow-y-auto border-2 rounded p-2">
            {therapists.length > 0 ? (
              therapists.map((therapist, index) => (
                <div
                  key={index}
                  className="bg-secondary/30 p-1 rounded-md flex justify-center items-center"
                >
                  <span>{therapist.name}</span>
                </div>
              ))
            ) : (
              <div className="bg-secondary/30 p-1 rounded-md flex justify-center items-center">
                <span>No Student Therapists</span>
              </div>
            )}
          </div>
        </div>

        {/* Patient Status Progress Bars */}
        <div className="mt-3 space-y-3 col-span-2">
          <h3 className="text-lg font-semibold">Patient Status</h3>
          <div className="space-y-2">
            <div>
              {activePercentage ? (
                <Progress value={activePercentage} />
              ) : (
                <div className="bg-secondary/30 p-1 rounded-md flex justify-center items-center">
                  <span>No Patients</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-2 text-sm text-muted-foreground">
          <div className="flex justify-evenly my-3">
            <div>Active Patients: {supervisor.activePatients || 0}</div>
            <div>Inactive Patients: {supervisor.inactivePatients || 0}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupervisorCard;
