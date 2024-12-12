"use client";

import { useEffect, useState } from "react";
import {
  PatientsSection,
  PersonalSection,
  ProfessionalSection,
} from "@/components/profiles";
import { studentTherapistData } from "@/constants/mockData";
import { usePathname } from "next/navigation";
import { useById } from "@/hooks/useById";

const ProfilePage = () => {
  const pathname = usePathname();
  const pathWithoutLang = pathname.replace(/^\/[a-z]{2}\//, "");
  const pathParts = pathWithoutLang.split("/").filter((part) => part !== "");
  const { getById, isLoading, error } = useById();
  const studentId = pathParts[2];
  const [student, setStudent] = useState(null); // Changed to `null` for cleaner checks
  const [loading, setLoading] = useState(true); // Added local loading state

  useEffect(() => {
    if (studentId) {
      setLoading(true);
      getById(studentId, "SUP")
        .then((res) => {
          if (res.success) {
            setStudent(res.user);
          }
        })
        .catch((err) => {
          console.error("Error fetching student details:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [studentId]);

  if (loading || isLoading) {
    return <div>Loading...</div>; // Show a loading state while data is fetched
  }

  if (error) {
    return (
      <div className="h-full flex justify-center items-center">
        Error loading profile. Please try again later.
      </div>
    ); // Handle error state
  }

  return (
    <div className="overflow-y-scroll bg-background">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side - Profile */}
          <div className="lg:col-span-5">
            <div className="space-y-6">
              <PersonalSection
                name={student.name}
                email={student.email}
                phone_no={student.phone_no}
                age={student.age}
                role="Supervisor"
              />
              <ProfessionalSection
                department={student.department}
                preferred_language1={student.preferred_language1}
                preferred_language2={student.preferred_language2}
                preferred_language3={student.preferred_language3}
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <PatientsSection
              patients={studentTherapistData.patients}
              feedback={studentTherapistData.feedback}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
