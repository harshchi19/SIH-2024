import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  User,
  FileText,
  ChevronRight,
  ChevronLeft,
  ChevronFirst,
  ChevronLast,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";

import allPatients from "../data/patients";

const Patients = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 6;

  // Sample expanded patient data

  // Pagination calculations
  const totalPages = Math.ceil(allPatients.length / patientsPerPage);
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = allPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div>
              <h1 className="text-2xl font-bold">Patients Overview</h1>
              <p className="text-slate-500 text-sm">
                Manage and monitor patient progress
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg">
                Total Patients: {allPatients.length}
              </Badge>
              <Button variant="outline">Filter</Button>
              <Button className="bg-black">Add Patient</Button>
            </div>
          </div>

          {/* Patient Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {currentPatients.map((patient) => (
              <Card
                key={patient.id}
                className="w-full hover:shadow-md transition-shadow"
              >
                <CardHeader className="bg-slate-50 border-b">
                  <CardTitle className="flex justify-between items-center">
                    {patient.name}
                    <Badge variant="outline">{patient.age} years</Badge>
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Admitted: {patient.admissionDate}
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Diagnosis */}
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="font-semibold text-sm text-slate-600">
                        Diagnosis:
                      </p>
                      <p className="mt-1">{patient.diagnosis}</p>
                    </div>

                    {/* Assigned Therapists */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4" />
                        <h3 className="font-semibold text-sm">
                          Assigned Therapists ({patient.therapists.length})
                        </h3>
                      </div>
                      <ScrollArea className="h-24 rounded-md border">
                        {patient.therapists.map((therapist) => (
                          <div
                            key={therapist.id}
                            className="flex justify-between items-center p-2 hover:bg-slate-50"
                          >
                            <span className="text-sm">{therapist.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {therapist.role}
                            </Badge>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h3 className="font-semibold text-sm mb-2">
                        Recent Timeline
                      </h3>
                      <ScrollArea className="h-32">
                        {patient.timeline.map((event, index) => (
                          <div
                            key={index}
                            className="border-l-2 border-slate-200 pl-4 pb-4 relative"
                          >
                            <div className="absolute w-2 h-2 bg-slate-400 rounded-full -left-1 top-2" />
                            <p className="text-sm text-slate-500">
                              {event.date}
                            </p>
                            <p className="text-sm">{event.event}</p>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Latest Report
                  </Button>
                  <Button className="flex items-center gap-2">
                    View All Reports
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 p-4 rounded-lg">
            <Button
              variant="outline"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronFirst className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index + 1}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  onClick={() => handlePageChange(index + 1)}
                  className="w-10 h-10"
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  );
};

export default Patients;
