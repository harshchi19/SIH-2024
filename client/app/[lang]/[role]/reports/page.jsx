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
import ReportViewModal from "@/components/report/ReportViewModal";

import { useLanguage } from "@/context/LanguageContext";
import { useGetReport } from "@/hooks/useGetReport";
import { useGetSessions } from "@/hooks/useGetSessions";
import { useByObjectId } from "@/hooks/useByObjectId";

const StudentReportsPage = () => {
  const { getByObjectId } = useByObjectId();
  const [students, setStudents] = useState([]);
  const [patient, setPatient] = useState([]);

  const { getAllReports } = useGetReport();
  const { getAllSessions } = useGetSessions();
  const [reports, setReports] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [preTherapyReports, setPreTherapyReports] = useState([]);
  const [allReports, setAllReports] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  const [filterOptions, setFilterOptions] = useState({
    therapist: [],
    status: [],
  });

  const { dict } = useLanguage();

  const fetchReports = async () => {
    try {
      const res = await getAllReports();
      if (res.success) {
        setReports(res.result);
      } else {
        console.error("Error fetching reports: ", res);
      }
    } catch (error) {
      console.error("Failed to fetch reports", error);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await getAllSessions();
      if (res.success) {
        setSessions(res.user);
      } else {
        console.error("Error fetching sessions: ", res);
      }
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchSessions();
  }, []);

  // Data enrichment effects (similar to your original code)
  useEffect(() => {
    const enrichReports = (reportsToEnrich) => {
      reportsToEnrich.forEach((report) => {
        if (report.student_therapist_id) {
          getByObjectId(report.student_therapist_id, "STT").then((res) => {
            if (res.success) {
              setStudents((prev) =>
                prev.some((student) => student._id === res.user._id)
                  ? prev
                  : [...prev, res.user]
              );
            }
          });
        }

        if (report.patient_id) {
          getByObjectId(report.patient_id, "PAT").then((res) => {
            if (res.success) {
              setPatient((prev) =>
                prev.some((p) => p._id === res.user._id)
                  ? prev
                  : [...prev, res.user]
              );
            }
          });
        }
      });
    };

    enrichReports(reports);
    enrichReports(sessions);
    // enrichReports(preTherapyReports);
  }, [reports, sessions]);

  // Enrich reports with additional data
  const enrichedReports = useMemo(() => {
    return reports.map((report) => {
      const date = new Date(report.createdAt).toLocaleDateString();
      const student = students.find(
        (s) => s._id === report.student_therapist_id
      );
      const patientData = patient.find((p) => p._id === report.patient_id);

      return {
        ...report,
        date,
        student: student || {},
        patient: patientData || {},
      };
    });
  }, [reports, students, patient]);

  const enrichedSessions = useMemo(() => {
    return sessions.map((session) => {
      const date = new Date(session.createdAt).toLocaleDateString();
      const student = students.find(
        (s) => s._id === session.student_therapist_id
      );
      const patientData = patient.find((p) => p._id === session.patient_id);

      return {
        ...session,
        date,
        student: student || {},
        patient: patientData || {},
      };
    });
  }, [sessions, students, patient]);

  // Filtering and sorting logic
  const uniqueTherapists = [
    ...new Set(enrichedReports.map((report) => report.student?.name || "")),
  ];

  const uniqueStatuses = [
    ...new Set(enrichedReports.map((report) => report.status || "")),
  ];

  const filteredReports = useMemo(() => {
    return enrichedReports.filter((report) => {
      const matchesSearch =
        !searchTerm ||
        Object.values(report).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesTherapist =
        filterOptions.therapist.length === 0 ||
        filterOptions.therapist.includes(report.student?.name || "");

      const matchesStatus =
        filterOptions.status.length === 0 ||
        filterOptions.status.includes(report.status || "");

      return matchesSearch && matchesTherapist && matchesStatus;
    });
  }, [searchTerm, filterOptions, enrichedReports]);

  const sortedReports = useMemo(() => {
    return [...filteredReports].sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredReports, sortColumn, sortDirection]);

  // Utility functions
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const getPlanNames = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .slice(0, 2)
      .map((part) => part.replace(/[^a-zA-Z0-9]/g, ""))
      .join(" ");
  };

  // Event Handlers
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
    setSelectedReport({
      preTherapyReports: preTherapyReports
        .filter((r) => r.patient_id === report.patient_id)
        .map((r) => ({ ...r, type: "Pre-Therapy" })),
      sessionReports: enrichedSessions
        .filter((s) => s.patient_id === report.patient_id)
        .map((s) => ({ ...s, type: "Session" })),

      finalReports: enrichedReports
        .filter((r) => r.patient_id === report.patient_id)
        .map((r) => ({ ...r, type: "Final" })),
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 p-6 space-y-4">
        {/* Top Actions Section */}
        <div className="flex items-center gap-4 mb-4">
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

              {/* Therapist Filter */}
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

              {/* Status Filter */}
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

        {/* Reports Table */}
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
                  onClick={() => handleSort("student")}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {dict?.reports?.student_therapist}
                  {sortColumn === "student" &&
                    (sortDirection === "asc" ? " ▲" : " ▼")}
                </TableHead>
                <TableHead
                  onClick={() => handleSort("patient")}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {dict?.reports?.appointments}
                  {sortColumn === "patient" &&
                    (sortDirection === "asc" ? " ▲" : " ▼")}
                </TableHead>
                <TableHead
                  onClick={() => handleSort("treatment_plan")}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {dict?.reports?.details}
                  {sortColumn === "treatment_plan" &&
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
                <TableRow key={report._id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell>
                    {report.case_no ? getPlanNames(report.case_no) : ""}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {getInitials(report?.student?.name)}
                        </AvatarFallback>
                      </Avatar>
                      {report?.student?.name}
                    </div>
                  </TableCell>
                  <TableCell>{report?.patient?.name}</TableCell>
                  <TableCell>
                    {report.treatment_plan
                      ? getPlanNames(report.treatment_plan)
                      : ""}
                  </TableCell>
                  <TableCell>{report?.date}</TableCell>
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
          </Table>
        </Card>
      </div>

      {/* Report View Modal */}
      <ReportViewModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        pretherapyReports={selectedReport?.preTherapyReports || []}
        sessionReports={selectedReport?.sessionReports || []}
        // postSessionReports={selectedReport?.postSessionReports || []}
        finalReports={selectedReport?.finalReports || []}
      />
    </div>
  );
};

export default StudentReportsPage;
