import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Mail,
  Phone,
  Calendar,
  User2,
  GraduationCap,
  Languages,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export function ProfileSection({ studentDetails }) {
  const convertDateTimeFormat = (inputString) => {
    const inputArray = JSON.parse(inputString);

    return inputArray.map((datetime) => {
      const [day, time] = datetime.split(" ");

      const dayAbbr = {
        Monday: "Mon",
        Tuesday: "Tue",
        Wednesday: "Wed",
        Thursday: "Thu",
        Friday: "Fri",
        Saturday: "Sat",
        Sunday: "Sun",
      };

      return `${dayAbbr[day]} ${time}`;
    });
  };

  const availabilityArea = convertDateTimeFormat(studentDetails.availability);

  const availabilityAreaMap = availabilityArea.reduce((acc, slot) => {
    const [day, time] = slot.split(" ");
    if (!acc[day]) acc[day] = new Set();
    acc[day].add(time);
    return acc;
  }, {});

  const isSlotAvailable = (day, time) => {
    return availabilityAreaMap[day]?.has(time) || false;
  };

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
  const specialization = extractTextFromString(studentDetails?.specialization);
  const qualifications = extractTextFromString(studentDetails?.qualifications);
  const preferredLanguages = [
    studentDetails?.preferred_language1,
    studentDetails?.preferred_language2,
    studentDetails?.preferred_language3,
  ];
  console.log("locations: ", studentDetails.location);

  return (
    <div className="space-y-6">
      {/* Personal Info Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">{studentDetails.name}</CardTitle>
              <p className="text-xl text-muted-foreground">Student Therapist</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{studentDetails.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>{studentDetails.phone_no}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{studentDetails.age} years old</span>
          </div>
        </CardContent>
      </Card>

      {/* Professional Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              {/* <span>
                {studentDetails.location.city}, {studentDetails.location.state}
              </span> */}
            </div>
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <span>{studentDetails.experience_years} years experience</span>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-medium mb-2">Qualifications</h4>
            <div className="flex flex-wrap gap-2">
              {qualifications.map((qual, index) => (
                <Badge key={index} variant="secondary">
                  {qual}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xl font-medium mb-2">Specialization</h4>
            <div className="flex flex-wrap gap-2">
              {specialization.map((spec, index) => (
                <Badge key={index} variant="outline">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xl font-medium mb-2">Languages</h4>
            <div className="flex items-center space-x-2">
              <Languages className="w-4 h-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {preferredLanguages.map((lang, index) => (
                  <Badge key={index} variant="secondary">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-xl font-medium mb-2">Weekly Availability</h1>
            <div className="space-y-6 h-3/4">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="gap-2">
                  <div className="w-3 h-3 rounded-sm bg-green-600"></div>
                  Available
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <div className="w-3 h-3 rounded-sm bg-muted"></div>
                  Unavailable
                </Badge>
              </div>

              <div className="rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="p-3 text-left font-medium text-muted-foreground"></th>
                        {DAYS.map((day) => (
                          <th key={day} className="p-3 text-center font-medium">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TIMES.map((time) => (
                        <tr key={time} className="border-b last:border-0">
                          <td className="p-2 text-sm font-medium text-muted-foreground">
                            {time}
                          </td>
                          {DAYS.map((day) => (
                            <td key={`${day}-${time}`} className="p-2">
                              <div
                                className={cn(
                                  "h-4 rounded-full transition-colors",
                                  isSlotAvailable(day, time)
                                    ? "bg-green-600"
                                    : "bg-muted"
                                )}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
