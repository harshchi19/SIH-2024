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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, SlidersHorizontal, X, FileText, Bot } from "lucide-react";
import ReportViewModal from "@/components/report/ReportViewModal";
import AISummaryReportsModal from "@/components/report/AISummaryReportsModal";

import { useLanguage } from "@/context/LanguageContext";
import { useGetReport } from "@/hooks/useGetReport";
import { useByObjectId } from "@/hooks/useByObjectId";
import useAISummaryReports from "@/hooks/useAISummaryReports";

const StudentReportsPage = () => {
  const { getByObjectId } = useByObjectId();
  const [students, setStudents] = useState([]);
  const [patient, setPatient] = useState([]);

  const { getAllReports } = useGetReport();
  const { generateAISummary } = useAISummaryReports();
  const [reports, setReports] = useState([]);
  const [aiSummaryReports, setAISummaryReports] = useState([]);

  const [activeTab, setActiveTab] = useState("allReports");
  const [modalOpen, setModalOpen] = useState(false);
  const [aiSummaryModalOpen, setAISummaryModalOpen] = useState(false);
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

  const fetchAISummaries = async () => {
    try {
      // const res = await generateAISummary(reports);
      if (res.success) {
        setAISummaryReports(res.summaries);
      } else {
        console.error("Error generating AI summaries: ", res);
      }
    } catch (error) {
      console.error("Failed to generate AI summaries", error);
    }
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

  // Process reports with additional data
  reports.forEach((report) => {
    const date = new Date(report.createdAt).toLocaleDateString();
    report.date = date;

    if (report.student_therapist_id) {
      const matchingStudent = students.find(
        (student) => student._id === report.student_therapist_id
      );
      if (matchingStudent) {
        report.student = matchingStudent;
      }
    }

    if (report.patient_id) {
      const matchingPatient = patient.find(
        (patient) => patient._id === report.patient_id
      );
      if (matchingPatient) {
        report.patient = matchingPatient;
      }
    }
  });

  const uniqueTherapists = [
    ...new Set(reports.map((report) => report.student?.name || "")),
  ];

  const uniqueStatuses = [
    ...new Set(reports.map((report) => report.status || "")),
  ];

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
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

  const handleGenerateAISummaries = () => {
    fetchAISummaries();
  };

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

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 p-6 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="allReports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> All Reports
            </TabsTrigger>
            <TabsTrigger
              value="aiSummaryReports"
              className="flex items-center gap-2"
              onClick={handleGenerateAISummaries}
            >
              <Bot className="h-4 w-4" /> AI Summary Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="allReports">
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
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
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
          </TabsContent>

          <TabsContent value="aiSummaryReports">
            <Card className="mt-4">
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">
                  AI Generated Summary Reports
                </h2>
                {aiSummaryReports.length === 0 ? (
                  <div className="text-center text-gray-500">
                    No AI summaries generated. Click "Generate Summaries" to
                    create them.
                  </div>
                ) : (
                  <div>
                    {/* Placeholder for AI summary reports view */}
                    {aiSummaryReports.map((summary) => (
                      <div
                        key={summary.id}
                        className="border-b py-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          // Open detailed view of AI summary
                          setAISummaryModalOpen(true);
                        }}
                      >
                        <h3 className="font-medium">{summary.title}</h3>
                        <p className="text-sm text-gray-600">
                          {summary.shortDescription}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Summary Reports Modal */}
      {/* <AISummaryReportsModal
        isOpen={aiSummaryModalOpen}
        onClose={() => setAISummaryModalOpen(false)}
        summaries={aiSummaryReports}
      /> */}

      {/* Existing ReportViewModal */}
      <ReportViewModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        reports={reports}
      />
    </div>
  );
};

export default StudentReportsPage;
