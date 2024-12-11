import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useRouter } from "next/navigation";
import { Brain } from "lucide-react"; // Import brain icon for AI model button

const ReportViewModal = ({
  isOpen,
  onClose,
  previousReports = [],
  recentReports = [],
}) => {
  const reports = [
    {
      id: "RPT-001",
      patient: "John Doe",
      therapist: "Dr. Emily Johnson",
      appointment: "Cognitive Behavioral Therapy",
      details: "Initial assessment and treatment plan discussion",
      date: "2024-03-15",
      status: "Completed",
    },
    {
      id: "RPT-002",
      patient: "John Doe",
      therapist: "Dr. Michael Chen",
      appointment: "Anxiety Management",
      details: "Progression review and strategy adjustment",
      date: "Just now",
      status: "In Progress",
    },
    {
      id: "RPT-003",
      patient: "Sarah Smith",
      therapist: "Dr. Sarah Rodriguez",
      appointment: "Stress Reduction Workshop",
      details: "Group session outcomes and individual insights",
      date: "2024-02-20",
      status: "Pending",
    },
    {
      id: "RPT-004",
      patient: "John Doe",
      therapist: "Dr. David Kim",
      appointment: "Trauma-Informed Counseling",
      details: "Personalized coping mechanism development",
      date: "2024-01-10",
      status: "Completed",
    },
    {
      id: "RPT-005",
      patient: "Sarah Smith",
      therapist: "Dr. Emily Johnson",
      appointment: "Follow-up Session",
      details: "Progress tracking and emotional support",
      date: "2024-03-20",
      status: "In Progress",
    },
  ];

  const [activeTab, setActiveTab] = useState("recent");
  const navigate = useRouter();
  const { lang, role } = useParams();
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleReportSelect = (report) => {
    // Set the selected patient for filtering previous reports
    setSelectedPatient(report.patient);

    // Navigate to report view page
    navigate.push(`/${lang}/${role}/reports/view-report`);
    onClose();
  };

  const handleAIModelReport = () => {
    // Navigate to AI model report generation page
    navigate.push(`/${lang}/${role}/reports/ai-model-report`);
  };

  // Filter previous reports for the same patient
  const patientPreviousReports = selectedPatient
    ? previousReports.filter((report) => report.patient === selectedPatient)
    : previousReports;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>View Reports</DialogTitle>
          <DialogDescription>
            Select a report to view its details or generate an AI-powered
            analysis
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recent">Recent Reports</TabsTrigger>
            <TabsTrigger value="previous">
              {selectedPatient
                ? `Previous Reports for ${selectedPatient}`
                : "Previous Reports"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent">
            <div className="grid gap-4 py-4">
              {recentReports.length > 0 ? (
                recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleReportSelect(report)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{report.therapist}</p>
                        <p className="text-sm text-gray-500">{report.date}</p>
                        <p className="text-xs text-gray-400">
                          {report.patient}
                        </p>
                      </div>
                      <Button variant="outline">View Details</Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No recent reports found
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="previous">
            <div className="grid gap-4 py-4">
              {patientPreviousReports.length > 0 ? (
                patientPreviousReports.map((report) => (
                  <div
                    key={report.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleReportSelect(report)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{report.therapist}</p>
                        <p className="text-sm text-gray-500">{report.date}</p>
                        <p className="text-xs text-gray-400">
                          {report.patient}
                        </p>
                      </div>
                      <Button variant="outline">View Details</Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  {selectedPatient
                    ? `No previous reports found for ${selectedPatient}`
                    : "No previous reports found"}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <div className="flex justify-start mb-4">
            <Button
              variant="outline"
              onClick={handleAIModelReport}
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              Generate AI Model Report
            </Button>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportViewModal;
