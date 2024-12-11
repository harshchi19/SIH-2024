import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { Check } from "lucide-react";

const StudentTherapistCard = ({
  therapist,
  selectedTherapist,
  setSelectedTherapist,
}) => {
  const { dict } = useLanguage();
  console.log(selectedTherapist);

  return (
    <Card
      className={`cursor-pointer relative transition-shadow transform rounded-lg border border-gray-200 shadow-sm select-none`}
      onClick={() => setSelectedTherapist(therapist._id)}
    >
      <div
        className={`h-5 w-5 rounded-full absolute right-3 top-3 ${
          selectedTherapist === therapist._id ? "border-none" : "border-2"
        }`}
      >
        {selectedTherapist === therapist._id && (
          <Check className="h-5 w-5 rounded-full p-px bg-green-500 text-white" />
        )}
      </div>
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={therapist.student_image}
            alt={therapist.name}
            asChild
          >
            <Image
              src={therapist.student_image}
              alt={therapist.name}
              width={64}
              height={64}
              className="object-cover"
            />
          </AvatarImage>
          <AvatarFallback className="bg-gray-200">
            <User className="h-8 w-8 text-gray-500" />
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{therapist.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <strong>{dict?.matchmaking?.email}:</strong> {therapist.email}
        </p>
        <p>
          <span className="font-medium">Phone:</span> {therapist.phone_no}
        </p>
        <p>
          <span className="font-medium">Specialization:</span>
          {therapist.specialization.split(",").join(", ")}
        </p>
        <p>
          <span className="font-medium">Experience:</span>{" "}
          {therapist.experience_years} years
        </p>
        <p>
          <span className="font-medium">Location:</span>{" "}
          {therapist.location.city}, {therapist.location.state}
        </p>
      </CardContent>
    </Card>
  );
};

const SelectedStudentTherapist = ({
  filteredTherapists,
  selectedTherapist,
  setSelectedTherapist,
}) => {
  const { dict } = useLanguage();

  return (
    <div className="h-full w-2/3 bg-white rounded-lg border border-gray-300 px-4 py-3 overflow-y-scroll">
      <h1 className="text-xl font-semibold mb-4">
        {dict?.matchmaking?.therapists}
      </h1>

      <div className="flex flex-col gap-4">
        {filteredTherapists.length > 0 ? (
          filteredTherapists.map((therapist) => (
            <StudentTherapistCard
              key={therapist._id}
              therapist={therapist}
              selectedTherapist={selectedTherapist}
              setSelectedTherapist={setSelectedTherapist}
            />
          ))
        ) : (
          <p className="text-gray-500">
            No student therapists match the selected filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default SelectedStudentTherapist;
