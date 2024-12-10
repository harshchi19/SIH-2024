"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { User, Star, Users, Clock, TrendingUp, Filter } from "lucide-react";
import RightSidebar from "@/components/RightSidebar";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { StudentTherapistCard } from "@/components/student-therapist/index";
import { useGetRole } from "@/hooks/useGetRole";
import { useParams } from "next/navigation";

const StudentTherapistPage = () => {
  const { currentLang } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const userId = "STT";
  const { role } = useParams();

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
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-gray-600 mt-2">
                Overview of our training therapists and their progress
              </p>
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Performance Report
              </Button>
              <Link
                href={`/${currentLang}/${role}/student-therapists/add-student-therapist`}
              >
                <Button className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </Link>
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
