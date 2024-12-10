"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, SlidersHorizontal, X } from "lucide-react";
import RightSidebar from "@/components/RightSidebar";
import ReportViewModal from "@/components/report/ReportViewModal";

// import reports from "@/constants/reports";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { useGetReport } from "@/hooks/useGetReport";
import { useByObjectId } from "@/hooks/useByObjectId";

const StudentReportsPage = () => {
  const { getByObjectId, isLoading } = useByObjectId();
  const [students, setStudents] = useState([]);
  const [patient, setPatient] = useState([]);

  const { getAllReports } = useGetReport();
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    await getAllReports().then((res) => {
      if (res.success) {
        setReports(res.result);
      } else {
        console.log("Error: ", res);
      }
    });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    reports.forEach((report) => {
      if (report.student_therapist_id) {
        getByObjectId(report.student_therapist_id, "STT").then((res) => {
          if (res.success) {
            setStudents((prev) => [...prev, res.user]);
          }
        });
      }

      if (report.patient_id) {
        getByObjectId(report.patient_id, "PAT").then((res) => {
          if (res.success) {
            setPatient((prev) => [...prev, res.user]);
          }
        });
      }
    });
  }, [reports]);

  reports.forEach((report) => {
    if (report.student_therapist_id) {
      const matchingStudent = students.find(
        (student) => student._id === report.student_therapist_id
      );

      if (matchingStudent) {
        report.student = matchingStudent; // Attach the matching student to the report
      }
    }
    if (report.patient_id) {
      const matchingPatient = patient.find(
        (patient) => patient._id === report.patient_id
      );

      if (matchingPatient) {
        report.patient = matchingPatient; // Attach the matching patient to the report
      }
    }
  });

  const { dict } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  const [filterOptions, setFilterOptions] = useState({
    therapist: [],
    status: [],
  });

  console.log(reports);

  const uniqueTherapists = [
    ...new Set(reports.map((report) => report.student || "")),
  ];

  const uniqueStatuses = [
    ...new Set(reports.map((report) => report.status || "")),
  ];

  const date = new Date(reports.map((report) => report.createdAt)[0]);

  console.log(typeof date.toLocaleDateString());

  const recentReports = reports.filter(
    (report) =>
      report.createdAt === "Just now" ||
      new Date(report.createdAt) >
        new Date(new Date().setDate(new Date().getDate() - 7))
  );

  console.log(recentReports);

  const previousReports = reports.filter(
    (report) => !recentReports.includes(report)
  );

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        !searchTerm ||
        Object.values(report).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesTherapist =
        filterOptions.therapist.length === 0 ||
        filterOptions.therapist.includes(report.therapist);

      const matchesStatus =
        filterOptions.status.length === 0 ||
        filterOptions.status.includes(report.status || "");

      return matchesSearch && matchesTherapist && matchesStatus;
    });
  }, [searchTerm, filterOptions, reports]);

  const sortedReports = useMemo(() => {
    return [...filteredReports].sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredReports, sortColumn, sortDirection]);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterOptions({
      therapist: [],
      status: [],
    });
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* <div className="flex-1 p-6 space-y-4">
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {dict?.reports?.add_new}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {dict?.reports?.filter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <DropdownMenuLabel>Filters</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="flex flex-col items-start">
                <label className="mb-2">Therapist</label>
                {uniqueTherapists.map((therapist) => (
                  <div key={therapist} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`therapist-${therapist}`}
                      checked={filterOptions.therapist.includes(therapist)}
                      onChange={() => {
                        setFilterOptions((prev) => ({
                          ...prev,
                          therapist: prev.therapist.includes(therapist)
                            ? prev.therapist.filter((t) => t !== therapist)
                            : [...prev.therapist, therapist],
                        }));
                      }}
                      className="mr-2"
                    />
                    <label htmlFor={`therapist-${therapist}`}>
                      {therapist}
                    </label>
                  </div>
                ))}
              </DropdownMenuItem>

              <DropdownMenuItem className="flex flex-col items-start">
                <label className="mb-2">Status</label>
                {uniqueStatuses.map((status) => (
                  <div key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`status-${status}`}
                      checked={filterOptions.status.includes(status)}
                      onChange={() => {
                        setFilterOptions((prev) => ({
                          ...prev,
                          status: prev.status.includes(status)
                            ? prev.status.filter((s) => s !== status)
                            : [...prev.status, status],
                        }));
                      }}
                      className="mr-2"
                    />
                    <label htmlFor={`status-${status}`}>{status}</label>
                  </div>
                ))}
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={clearFilters}
                className="text-red-500 hover:bg-red-50 cursor-pointer"
              >
                <X className="mr-2 h-4 w-4" /> Clear All Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            placeholder="Search reports..."
            className="w-64 ml-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableHead>
                <TableHead
                  onClick={() => handleSort("id")}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {dict?.reports?.report_id}
                  {sortColumn === "id" &&
                    (sortDirection === "asc" ? " ▲" : " ▼")}
                </TableHead>
                <TableHead
                  onClick={() => handleSort("therapist")}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {dict?.reports?.student_therapist}
                  {sortColumn === "therapist" &&
                    (sortDirection === "asc" ? " ▲" : " ▼")}
                </TableHead>
                <TableHead
                  onClick={() => handleSort("appointment")}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {dict?.reports?.appointments}
                  {sortColumn === "appointment" &&
                    (sortDirection === "asc" ? " ▲" : " ▼")}
                </TableHead>
                <TableHead
                  onClick={() => handleSort("details")}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {dict?.reports?.details}
                  {sortColumn === "details" &&
                    (sortDirection === "asc" ? " ▲" : " ▼")}
                </TableHead>
                <TableHead
                  onClick={() => handleSort("date")}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {dict?.reports?.date}
                  {sortColumn === "date" &&
                    (sortDirection === "asc" ? " ▲" : " ▼")}
                </TableHead>
                <TableHead>{dict?.reports?.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedReports.map((report) => (
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
                      onClick={() => handleViewReport(report)}
                    >
                      {dict?.reports?.view_report}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <ReportViewModal
              isOpen={modalOpen}
              onClose={handleCloseModal}
              previousReports={previousReports}
              recentReports={recentReports}
            />
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
      </div> */}

      {/* Right Sidebar */}
      {/* <RightSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      /> */}
    </div>
  );
};

export default StudentReportsPage;
