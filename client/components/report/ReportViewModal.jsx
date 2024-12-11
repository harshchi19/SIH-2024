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
import { Brain } from "lucide-react";

const ReportViewModal = ({
  isOpen,
  onClose,
  pretherapyReports,
  sessionReports,
  // postSessionReports,
  finalReports,
}) => {
  const [activeTab, setActiveTab] = useState("pretherapy");
  const navigate = useRouter();
  const { lang, role } = useParams();
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [allReports, setAllReports] = useState([
    ...pretherapyReports,
    ...sessionReports,
    ...finalReports,
  ]);

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
  };

  const handleReportSelect = (report) => {
    // Create a detailed report object to pass
    const reportDetails = {
      _id: report._id,
      patient_id: report.patient_id,
      student_therapist_id: report.student_therapist_id,
      session_id: report.session_id,
      type: report.type, // Capture the current tab/report type
      createdAt: report.createdAt,
      patient: report.patient,
      student: report.student,
      // Include any other relevant report information
    };

    // Convert to JSON string and encode for URL
    const encodedReportDetails = encodeURIComponent(
      JSON.stringify(reportDetails)
    );

    // Navigate to report view page with encoded report details
    navigate.push(
      `/${lang}/${role}/reports/${report.type}-report?report=${encodedReportDetails}`
    );

    onClose();
  };

  console.log("finalReports", sessionReports);

  // Render function for report list
  const renderReportList = (reports, emptyMessage) => (
    <div className="grid gap-4 py-4">
      {reports.length > 0 ? (
        reports.map((report) => (
          <div
            key={report._id}
            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => handleReportSelect(report)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{report.patient.name}</p>
                <p className="text-sm text-gray-500">{report.date}</p>
                <p className="text-xs text-gray-400">{report.student.name}</p>
              </div>
              <Button variant="outline">View Details</Button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">{emptyMessage}</p>
      )}
    </div>
  );

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

        <Tabs
          value={activeTab}
          onValueChange={handleActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pretherapy">Pre-Therapy</TabsTrigger>
            <TabsTrigger value="therapy-plan">Therapy Plan</TabsTrigger>
            <TabsTrigger value="session">Sessions</TabsTrigger>
            <TabsTrigger value="finalReport">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="pretherapy">
            {renderReportList(
              pretherapyReports,
              "No pre-therapy reports found"
            )}
          </TabsContent>

          <TabsContent value="session">
            {renderReportList(sessionReports, "No session reports found")}
          </TabsContent>

          <TabsContent value="finalReport">
            {renderReportList(finalReports, "No final reports found")}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportViewModal;
