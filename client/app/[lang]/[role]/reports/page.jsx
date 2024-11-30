"use client";

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
import RightSidebar from "@/components/RightSidebar";
import Sidebar from "@/components/Sidebar";

import reports from "@/constants/reports";
import { useLanguage } from "@/context/LanguageContext";

// Reports Page Component
const StudentReportsPage = () => {
  const { dict } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 p-6 space-y-4">
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {dict?.reports?.add_new}
          </Button>
          <Button variant="outline">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {dict?.reports?.filter}
          </Button>
          <Button variant="outline">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {dict?.reports?.sort}
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
                <TableHead>{dict?.reports?.report_id}</TableHead>
                <TableHead>{dict?.reports?.student_therapist}</TableHead>
                <TableHead>{dict?.reports?.appointments}</TableHead>
                <TableHead>{dict?.reports?.details}</TableHead>
                <TableHead>{dict?.reports?.date}</TableHead>
                <TableHead>{dict?.reports?.status}</TableHead>
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
                        {/* <AvatarImage src="/api/placeholder/24/24" /> */}
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
                      {dict?.reports?.view_report}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <div className="flex items-center justify-center gap-2 mt-4">
          <Button variant="outline" size="sm">
            {dict?.reports?.previous}
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
            {dict?.reports?.next}
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

export default StudentReportsPage;
