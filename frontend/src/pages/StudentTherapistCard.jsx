import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { User, Star, Users, Clock, TrendingUp, Filter } from "lucide-react";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";

const StudentTherapistCard = ({
  name,
  specialization,
  patientsCount,
  year,
  rating,
  hoursLogged,
  nextSession,
}) => {
  // Calculate progress percentage
  const targetPatients = 20;
  const progress = (patientsCount / targetPatients) * 100;

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{name}</CardTitle>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">{rating}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary">Year {year}</Badge>
              <Badge variant="outline" className="text-blue-600 bg-blue-50">
                {hoursLogged} hours logged
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Specialization</p>
            <p className="font-medium">{specialization}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Patient Progress</p>
              <span className="text-sm font-medium">
                {patientsCount}/{targetPatients}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {patientsCount} active patients
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Next: {nextSession}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StudentTherapistPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const students = [
    {
      name: "Sarah Johnson",
      specialization: "Cognitive Behavioral Therapy",
      patientsCount: 15,
      year: 3,
      rating: 4.8,
      hoursLogged: 156,
      nextSession: "2:30 PM",
    },
    {
      name: "Michael Chen",
      specialization: "Child Psychology",
      patientsCount: 12,
      year: 2,
      rating: 4.6,
      hoursLogged: 124,
      nextSession: "3:15 PM",
    },
    {
      name: "Emma Davis",
      specialization: "Family Therapy",
      patientsCount: 18,
      year: 4,
      rating: 4.9,
      hoursLogged: 198,
      nextSession: "4:00 PM",
    },
    {
      name: "James Wilson",
      specialization: "Trauma Therapy",
      patientsCount: 10,
      year: 2,
      rating: 4.5,
      hoursLogged: 89,
      nextSession: "1:45 PM",
    },
    {
      name: "Sophia Martinez",
      specialization: "Art Therapy",
      patientsCount: 14,
      year: 3,
      rating: 4.7,
      hoursLogged: 145,
      nextSession: "11:30 AM",
    },
    {
      name: "David Kim",
      specialization: "Addiction Counseling",
      patientsCount: 16,
      year: 4,
      rating: 4.8,
      hoursLogged: 167,
      nextSession: "10:15 AM",
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />
      <div className="w-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Student Therapists
              </h1>
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
      <RightSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  );
};

export default StudentTherapistPage;
