import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, User } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const StudentTherapistCard = ({
  therapist,
  selectedTherapist,
  setSelectedTherapist,
}) => {
  const { dict, currentLang } = useLanguage();
  const router = useRouter();
  const { role } = useParams();

  return (
    <Card
      className={`cursor-pointer relative transition-shadow transform rounded-lg border border-gray-200 shadow-sm select-none ${
        selectedTherapist === therapist._id
          ? "border-2 border-green-500 rounded-lg"
          : "border-2 border-gray-200"
      }`}
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
      <CardHeader className="flex flex-row items-center space-x-2 px-4 py-2 relative group">
        <div className="relative h-16 w-16">
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
                className="object-cover transition-all duration-300 group-hover:blur-sm group-hover:scale-105"
              />
            </AvatarImage>
            <AvatarFallback className="bg-gray-200">
              <User className="h-8 w-8 text-gray-500" />
            </AvatarFallback>
          </Avatar>
          <div
            className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer"
            onClick={() =>
              router.push(
                `/${currentLang}/${role}/student-therapists/${therapist.student_therapist_id}`
              )
            }
          >
            <Eye className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="flex flex-col justify-start items-start">
          <CardTitle className="text-lg">{therapist.name}</CardTitle>
          <p className="text-sm">
            <strong>Email:</strong> {therapist.email}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm ">
        <p className="text-sm">
          <strong>Phone No:</strong> {therapist.phone_no}
        </p>
        <p className="text-sm">
          <strong>Specialization: </strong>
          {therapist.specialization.split(",").join(", ")}
        </p>
        <p className="text-sm">
          <strong>Experience:</strong> {therapist.experience_years} years
        </p>
        <p className="text-sm">
          <strong>Location:</strong> {therapist.location.city},{" "}
          {therapist.location.state}
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
    <div className="h-full w-1/2 bg-white rounded-lg border border-gray-300 px-4 py-3 overflow-y-scroll">
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
