import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bell, Plus, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import RightSidebar from "../components/RightSidebar";
import Sidebar from "../components/Sidebar";

// Reports Page Component
const ReportsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const reports = [
    {
      id: "#CMP801",
      therapist: "Ananya Sharma",
      appointment: "Aarav Patel",
      details: "Babbling",
      date: "Just now",
      status: "View Report",
    },
    {
      id: "#CMP802",
      therapist: "Rohan Deshmukh",
      appointment: "Vivaan Singh",
      details: "Audiology",
      date: "A minute ago",
      status: "View Report",
    },
    {
      id: "#CMP803",
      therapist: "Ishita Patel",
      appointment: "Aarav Patel",
      details: "Hearing Aid",
      date: "1 hour ago",
      status: "View Report",
    },
    {
      id: "#CMP804",
      therapist: "Karan Mehta",
      appointment: "Shanaya Sharma",
      details: "Caucheology",
      date: "Yesterday",
      status: "View Report",
    },
    {
      id: "#CMP805",
      therapist: "Sanya Gupta",
      appointment: "Vivaan Singh",
      details: "Audiology",
      date: "Feb 2, 2024",
      status: "View Report",
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Reports List</h1>
          <div className="flex items-center gap-2">
            <Input placeholder="Search" className="w-64" />
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
          <Button variant="outline">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort
          </Button>
          <Input placeholder="Search reports..." className="w-64 ml-auto" />
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableHead>
                <TableHead>Report ID</TableHead>
                <TableHead>Student Therapist</TableHead>
                <TableHead>Appointments</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell>{report.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/api/placeholder/24/24" />
                        <AvatarFallback>
                          {report.therapist
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {report.therapist}
                    </div>
                  </TableCell>
                  <TableCell>{report.appointment}</TableCell>
                  <TableCell>{report.details}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      className={
                        report.date === "Just now"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }
                    >
                      {report.status}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <div className="flex items-center justify-center gap-2 mt-4">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          {[1, 2, 3, 4, 5].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? "default" : "outline"}
              size="sm"
            >
              {page}
            </Button>
          ))}
          <Button variant="outline" size="sm">
            Next
          </Button>
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

export default ReportsPage;
