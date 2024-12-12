import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Eye, User } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

const SelectSupervisor = ({
  filteredSupervisors,
  selectedSupervisor,
  setSelectedSupervisor,
}) => {
  const { role } = useParams();

  return (
    <div className="flex flex-col space-y-4 w-1/2 bg-white px-4 py-4 border-[1px] border-gray-200 rounded-md overflow-y-scroll">
      <h1 className="text-xl font-semibold">Clinical Supervisors</h1>
      {filteredSupervisors.length > 0 ? (
        filteredSupervisors.map((supervisor) => (
          <Card
            key={supervisor._id}
            className={`
              cursor-pointer 
              relative 
              w-full 
              rounded-md 
              ${
                selectedSupervisor === supervisor._id
                  ? "border-green-500 border-2"
                  : "border border-gray-200"
              }
            `}
            onClick={() => setSelectedSupervisor(supervisor._id)}
          >
            <div className="absolute right-3 top-3">
              {selectedSupervisor === supervisor._id && (
                <Check className="h-5 w-5 rounded-full bg-green-500 text-white" />
              )}
            </div>
            <div
              className={`h-5 w-5 rounded-full absolute right-3 top-3 ${
                selectedSupervisor === supervisor._id
                  ? "border-none"
                  : "border-2"
              }`}
            >
              {selectedSupervisor === supervisor._id && (
                <Check className="h-5 w-5 rounded-full p-px bg-green-500 text-white" />
              )}
            </div>
            <CardHeader className="flex flex-row items-center space-x-4 p-4 relative group">
              <div className="h-16 w-16 relative group">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={supervisor?.image}
                    alt={supervisor?.name}
                    asChild
                  >
                    <div className="relative w-full h-full overflow-hidden rounded-full">
                      {/* Avatar Image with hover effects */}
                      <Image
                        src={supervisor.supervisor_image}
                        alt={supervisor.name}
                        fill
                        className="
              absolute 
              inset-0 
              object-cover 
              rounded-full 
              transition-all 
              duration-300 
              group-hover:blur-sm 
              group-hover:scale-105
            "
                      />

                      {/* Eye Icon Container */}
                      <div
                        className="
              absolute 
              inset-0 
              z-20 
              bg-transparent 
              group-hover:bg-black/30 
              rounded-full 
              flex 
              items-center 
              justify-center 
              transition-all 
              duration-300 
              ease-in-out
            "
                      >
                        <Eye
                          className="
                h-8 
                w-8 
                text-white 
                opacity-0 
                group-hover:opacity-100 
                transition-opacity 
                duration-300 
                ease-in-out 
                cursor-pointer
                z-30
              "
                          onClick={() => {
                            router.push(
                              `/en/${role}/supervisors/${supervisor.supervisor_id}`
                            );
                          }}
                        />
                      </div>
                    </div>
                  </AvatarImage>
                  <AvatarFallback className="bg-gray-200">
                    <User className="h-8 w-8 text-gray-500" />
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex flex-col">
                <CardTitle className="text-lg font-semibold">
                  {supervisor?.name}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  <strong>Email:</strong> {supervisor?.email}
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-1 text-sm text-gray-700">
              <p>
                <strong>Phone:</strong> {supervisor?.phone_no}
              </p>
              <p>
                <strong>Department:</strong> {supervisor?.department}
              </p>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center text-gray-500 py-4">
          No supervisors available
        </div>
      )}
    </div>
  );
};

export default SelectSupervisor;
