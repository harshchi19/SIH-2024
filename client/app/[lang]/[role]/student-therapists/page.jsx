"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { StudentTherapistCard } from "@/components/student-therapist/index";
import { useGetRole } from "@/hooks/useGetRole";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const StudentTherapistPage = () => {
  const { currentLang } = useLanguage();
  const [students, setStudents] = useState([]);
  const userId = "STT";
  const { role } = useParams();
  const router = useRouter();

  const { getAll, isLoading, error } = useGetRole();
  useEffect(() => {
    getAll("STT").then((res) => {
      if (res.success) {
        setStudents(res.users);
      }
    });
  }, [userId]);

  return (
    <>
      <div className="w-full bg-gray-50 px-8 overflow-y-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div>
              <h1 className="text-2xl font-bold">
                Student Therapists Overview
              </h1>
              <p className="text-slate-500 text-sm">
                Manage and monitor Patient progress
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg">
                Total Student Therapists: {students.length}
              </Badge>
              <div className="flex space-x-4">
                <Button variant="outline" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <Button
                className="border border-green-500 bg-white text-green-500 font-bold hover:bg-white active:scale-95"
                onClick={() =>
                  router.push(
                    `/en/${role}/student-therapists/add-student-therapist`
                  )
                }
              >
                Add Student Therapist
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <StudentTherapistCard key={student.name} {...student} />
            ))}
          </div>
        </div>
      </div>

      {/* Rigth Sidebar */}
      {/* <RightSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      /> */}
    </>
  );
};

export default StudentTherapistPage;
