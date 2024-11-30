import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, GraduationCap, Languages } from "lucide-react";

export function ProfessionalSection({
  location = "",
  experience_years = "",
  qualifications = "",
  specialization = "",
  preferred_language1 = "",
  preferred_language2 = "",
  preferred_language3 = "",
  department = "",
}) {
  const extractTextFromString = (inputString) => {
    try {
      const parsedArray = JSON.parse(inputString);
      return Array.isArray(parsedArray)
        ? parsedArray.map((item) => item.toString())
        : [];
    } catch (error) {
      console.error("Invalid input string:", error);
      return [];
    }
  };

  const specializationList = specialization
    ? extractTextFromString(specialization)
    : [];
  const qualificationsList = qualifications
    ? extractTextFromString(qualifications)
    : [];
  const preferredLanguages = [
    preferred_language1,
    preferred_language2,
    preferred_language3,
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Professional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {location ? (
          <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg border">
            <MapPin className="w-6 h-6 text-primary" strokeWidth={1.5} />
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground">
                Location
              </h4>
              <div className="text-base font-medium">
                {location.city}, {location.state}
                <span className="text-muted-foreground text-sm ml-1">
                  ({location.country})
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg border">
            <GraduationCap className="w-6 h-6 text-primary" strokeWidth={1.5} />
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground">
                Department
              </h4>
              <div className="text-base font-medium">{department}</div>
            </div>
          </div>
        )}

        {experience_years && (
          <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg border">
            <GraduationCap className="w-6 h-6 text-primary" strokeWidth={1.5} />
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground">
                Experience
              </h4>
              <div className="text-base font-medium">
                {experience_years} years of professional experience
              </div>
            </div>
          </div>
        )}

        {preferredLanguages && (
          <div>
            <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg border">
              <Languages className="w-6 h-6 text-primary" strokeWidth={1.5} />
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">
                  Spoken Languages
                </h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {preferredLanguages.map((lang, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {qualifications && (
          <div>
            <h4 className="text-xl font-medium mb-2">Qualifications</h4>
            <div className="flex flex-wrap gap-2">
              {qualificationsList.map((qual, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {qual}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {specialization && (
          <div>
            <h4 className="text-xl font-medium mb-2">Specialization</h4>
            <div className="flex flex-wrap gap-2">
              {specializationList.map((spec, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
