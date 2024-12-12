"use client";

import React, { useEffect, useState } from "react";
import { User2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useByObjectId } from "@/hooks/useByObjectId";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import SessionReport from "@/components/reports/show/SessionReport";
import PreTherapyForm from "@/components/reports/show/PreTherapyReport";
import PreTherapyReport from "@/components/reports/show/PreTherapyReport";
// import { toast } from "@/components/ui/use-toast";

// Status configuration
const FEEDBACK_STATUSES = [
  {
    value: "accept",
    label: "Accept",
    color: "text-green-600",
  },
  {
    value: "modify",
    label: "Modify",
    color: "text-yellow-600",
  },
  {
    value: "reject",
    label: "Reject",
    color: "text-red-600",
  },
];

function TherapyReport() {
  const searchParams = useSearchParams();
  const reportDetailsParam = searchParams.get("report");

  const { getByObjectId } = useByObjectId();
  const [supervisor, setSupervisor] = useState([]);

  // Feedback Modal State
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    status: "",
    feedback: "",
    additionalInputs: {
      assignedTo: "",
      deadline: "",
      priority: "",
    },
  });

  const reportDetails = reportDetailsParam
    ? JSON.parse(decodeURIComponent(reportDetailsParam))
    : null;

  useEffect(() => {
    if (reportDetails?.student.supervisor_id) {
      getByObjectId(
        reportDetails?.student.supervisor_id ||
          reportDetails?.medicalDetails.supervisor_id,
        "SUP"
      )
        .then((res) => {
          setSupervisor(res.user);
        })
        .catch((err) => {
          console.error(err);
          toast({
            title: "Error",
            description: "Failed to fetch supervisor details",
            variant: "destructive",
          });
        });
    }
  }, [reportDetails.student.supervisor_id]);
  console.log(reportDetails);

  // Feedback Handling Functions
  const handleStatusChange = (status) => {
    setFeedbackData((prev) => ({
      ...prev,
      status,
      additionalInputs:
        status === "modify"
          ? { assignedTo: "", deadline: "", priority: "medium" }
          : { assignedTo: "", deadline: "", priority: "" },
    }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!feedbackData.status) {
      toast({
        title: "Validation Error",
        description: "Please select a feedback status",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Replace with actual API call
      // const response = await submitFeedback(feedbackData);

      toast({
        title: "Feedback Submitted",
        description: `Report ${reportDetails?.type} has been ${feedbackData.status}ed`,
        variant: "success",
      });

      // Reset and close modal
      setFeedbackData({
        status: "",
        feedback: "",
        additionalInputs: {
          assignedTo: "",
          deadline: "",
          priority: "",
        },
      });
      setIsFeedbackModalOpen(false);
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Helper function to get treatment plan parts
  const getTreatmentPlanParts = () => {
    const treatmentPlan = reportDetails?.treatment_plan || "";
    const treatmentPlanParts = treatmentPlan
      .split(".")
      .map((part) => part.trim());

    return treatmentPlanParts.map((part) => {
      const [title, description] = part
        .split(":")
        .map((subPart) => subPart?.trim());
      return {
        title: title || "Untitled",
        description: description || "No description provided",
      };
    });
  };

  // Helper function to get patient info fields
  const getInfoFields = () => [
    {
      label: "Name",
      value: reportDetails?.patient?.name || reportDetails?.name || "N/A",
    },
    {
      label: "Age",
      value: reportDetails?.patient?.age
        ? `${reportDetails.patient.age} yrs`
        : reportDetails?.age
        ? `${reportDetails.age} yrs`
        : "N/A",
    },
    {
      label: "Case No",
      value: reportDetails?.patient?.case_no || reportDetails?.case_no || "N/A",
    },
    {
      label: "Gender",
      value: reportDetails?.patient?.sex || reportDetails?.sex || "N/A",
    },
    {
      label: "Contact",
      value:
        reportDetails?.patient?.phone_no || reportDetails?.phone_no || "N/A",
    },
    {
      label: "Email",
      value: reportDetails?.patient?.email || reportDetails?.email || "N/A",
    },
  ];

  // Initials helper
  const getInitials = (name) => {
    if (!name) return "";
    const initials = name.match(/\b\w/g) || [];
    return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
  };

  // Render nothing if no report details
  if (!reportDetails) {
    return <div>No report data available</div>;
  }
  if (reportDetails.type === "Session") {
    return (
      <div className=" bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-400 to-teal-100 p-6 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white">
                  {getInitials(reportDetails?.patient.name)}
                </div>
                <h1 className="text-4xl font-serif text-white">
                  {reportDetails?.type} Report
                </h1>
              </div>
              <div className="flex gap-2">
                <div className="bg-teal-50/90 px-4 py-2 rounded-lg">
                  <p className="text-sm text-teal-800">Supervisor:</p>
                  <p className="font-semibold text-teal-900">
                    {supervisor?.name || "Not Assigned"}
                  </p>
                </div>
                <div className="bg-teal-50/90 px-4 py-2 rounded-lg ">
                  <Button
                    variant="ghost"
                    onClick={() => setIsFeedbackModalOpen(true)}
                    className="flex items-center h-full rounded-lg hover:shadow-sm hover:bg-teal-100"
                  >
                    Add Feedback
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Session Details */}
          <Card className="p-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Session Date</p>
              <p className="font-medium">{reportDetails?.date_of_session}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Session Number</p>
              <p className="font-medium">{reportDetails?.session_number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Session Timing</p>
              <p className="font-medium">
                {reportDetails?.start_time} - {reportDetails?.end_time}
              </p>
            </div>
          </Card>

          {/* Patient Details */}
          <Card className="p-4 grid grid-cols-3 gap-4">
            {getInfoFields().map((field) => (
              <div key={field.label}>
                <p className="text-sm text-muted-foreground">{field.label}</p>
                <p className="font-medium">{field.value}</p>
              </div>
            ))}
          </Card>

          {/* Machines Used Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Machines Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground leading-relaxed">
                {reportDetails?.machines_used?.length > 0 ? (
                  reportDetails.machines_used.map((machine, index) => (
                    <li key={index}>{machine}</li>
                  ))
                ) : (
                  <p>No machines used</p>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Goals and Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Session Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Current Goal:</strong> {reportDetails?.goals}
                </p>
                <p>
                  <strong>Progress:</strong> {reportDetails?.progress}%
                </p>
                <p>
                  <strong>Next Session Goal:</strong>{" "}
                  {reportDetails?.goals_next_session}
                </p>
                <p>
                  <strong>Next Session Progress Target:</strong>{" "}
                  {reportDetails?.progress_next_session}%
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notes and To-Do */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Notes and Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Session Notes:</strong> {reportDetails?.notes}
                </p>
                <p>
                  <strong>To-Do Before Next Session:</strong>
                </p>
                <ul className="list-disc list-inside">
                  {reportDetails?.to_do_before_next_session?.map(
                    (todo, index) => (
                      <li key={index}>{todo}</li>
                    )
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Student Therapist Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Student Therapist
                  </p>
                  <p className="text-lg font-medium text-emerald-700">
                    {reportDetails?.student?.name || "Unnamed Therapist"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {reportDetails?.student?.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Modal */}
          <Dialog
            open={isFeedbackModalOpen}
            onOpenChange={setIsFeedbackModalOpen}
          >
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Provide Feedback</DialogTitle>
                <DialogDescription>
                  Submit your feedback for this therapy report
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Feedback Status</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {FEEDBACK_STATUSES.map((status) => (
                      <Button
                        key={status.value}
                        type="button"
                        variant={
                          feedbackData.status === status.value
                            ? "default"
                            : "outline"
                        }
                        className={`
                               flex items-center justify-center 
                               ${
                                 feedbackData.status === status.value
                                   ? ""
                                   : status.color
                               }
                             `}
                        onClick={() => handleStatusChange(status.value)}
                      >
                        {status.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback">Feedback Details</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Provide detailed feedback..."
                    value={feedbackData.feedback}
                    onChange={(e) =>
                      setFeedbackData((prev) => ({
                        ...prev,
                        feedback: e.target.value,
                      }))
                    }
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ratings</Label>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Overall Performance</Label>
                      <Select
                        value={feedbackData.ratings?.overallPerformance}
                        onValueChange={(value) =>
                          setFeedbackData((prev) => ({
                            ...prev,
                            ratings: {
                              ...prev.ratings,
                              overallPerformance: value,
                            },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Rating" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <SelectItem key={rating} value={rating.toString()}>
                              {rating}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {feedbackData.status === "modify" && (
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Assigned To</Label>
                      <Input
                        placeholder="Assignee name"
                        value={feedbackData.additionalInputs.assignedTo}
                        onChange={(e) =>
                          setFeedbackData((prev) => ({
                            ...prev,
                            additionalInputs: {
                              ...prev.additionalInputs,
                              assignedTo: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Deadline</Label>
                      <Input
                        type="date"
                        value={feedbackData.additionalInputs.deadline}
                        onChange={(e) =>
                          setFeedbackData((prev) => ({
                            ...prev,
                            additionalInputs: {
                              ...prev.additionalInputs,
                              deadline: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        value={feedbackData.additionalInputs.priority}
                        onValueChange={(value) =>
                          setFeedbackData((prev) => ({
                            ...prev,
                            additionalInputs: {
                              ...prev.additionalInputs,
                              priority: value,
                            },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFeedbackModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!feedbackData.status}>
                    Submit Feedback
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  } else if (reportDetails.type === "Pre-Therapy") {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg border border-gray-200">
        <div className="flex justify-between items-center h-full bg-teal-50/90 px-4 py-2 rounded-lg ">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Pre-Therapy Report: {reportDetails.name}
          </h1>
          <Button
            variant="ghost"
            onClick={() => setIsFeedbackModalOpen(true)}
            className="flex rounded-lg hover:shadow-sm hover:bg-teal-100"
          >
            Add Feedback
          </Button>
        </div>

        {/* Personal Information */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Personal Information
          </h2>
          <p>
            <strong>Name:</strong> {reportDetails.name}
          </p>
          <p>
            <strong>Patient ID:</strong> {reportDetails.patient_id}
          </p>
          <p>
            <strong>Age:</strong> {reportDetails.age} years
          </p>
          <p>
            <strong>Sex:</strong> {reportDetails.sex}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {new Date(reportDetails.date_of_birth).toLocaleDateString()}
          </p>
          <p>
            <strong>Contact:</strong> {reportDetails.phone_no},{" "}
            {reportDetails.email}
          </p>
        </section>

        {/* Address Details */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Address Details
          </h2>
          <p>{reportDetails.address_details.address_line1},</p>
          <p>{reportDetails.address_details.address_line2},</p>
          <p>
            {reportDetails.address_details.city},{" "}
            {reportDetails.address_details.state} -{" "}
            {reportDetails.address_details.postal_code},{" "}
            {reportDetails.address_details.country}
          </p>
        </section>

        {/* Case Details */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Case Details
          </h2>
          <p>
            <strong>Case Number:</strong> {reportDetails.case_no}
          </p>
          <p>
            <strong>Type:</strong> {reportDetails.type}
          </p>
          <p>
            <strong>Status:</strong> {reportDetails.patient_status}
          </p>
          <p>
            <strong>Date of Assignment:</strong>{" "}
            {new Date(reportDetails.date_of_assignment).toLocaleDateString()}
          </p>
        </section>

        {/* Speech Development History */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Speech Development History
          </h2>
          <p>
            <strong>Vocalization:</strong>{" "}
            {reportDetails.speech_development_history.vocalization}
          </p>
          <p>
            <strong>Babbling:</strong>{" "}
            {reportDetails.speech_development_history.babbling}
          </p>
          <p>
            <strong>First Word:</strong>{" "}
            {reportDetails.speech_development_history.first_word}
          </p>
          <p>
            <strong>First Sentence:</strong>{" "}
            {reportDetails.speech_development_history.first_sentence}
          </p>
        </section>

        {/* Patient Concerns */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Patient Concerns
          </h2>
          <p className="italic text-gray-600">
            "{reportDetails.patient_issue}"
          </p>
        </section>

        {/* Non-Verbal Communication */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Non-Verbal Communication
          </h2>
          <p>
            <strong>Expression Level:</strong>{" "}
            {reportDetails.non_verbal_communication.expression_level}
          </p>
          <p>
            <strong>Comprehension Level:</strong>{" "}
            {reportDetails.non_verbal_communication.comprehension_level}
          </p>
        </section>

        {/* Suprasegmental Aspects */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Suprasegmental Aspects
          </h2>
          <p>
            <strong>Emphasis Level:</strong>{" "}
            {reportDetails.suprasegmental_aspects.emphasis_level}
          </p>
          <p>
            <strong>Intonation:</strong>{" "}
            {reportDetails.suprasegmental_aspects.intonation}
          </p>
          <p>
            <strong>Phrasing:</strong>{" "}
            {reportDetails.suprasegmental_aspects.phrasing}
          </p>
          <p>
            <strong>Speech Rate:</strong>{" "}
            {reportDetails.suprasegmental_aspects.speech_rate}
          </p>
        </section>

        <Dialog
          open={isFeedbackModalOpen}
          onOpenChange={setIsFeedbackModalOpen}
        >
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Provide Feedback</DialogTitle>
              <DialogDescription>
                Submit your feedback for this therapy report
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              {/* Status Selection */}
              <div className="space-y-2">
                <Label>Feedback Status</Label>
                <div className="grid grid-cols-3 gap-4">
                  {FEEDBACK_STATUSES.map((status) => (
                    <Button
                      key={status.value}
                      type="button"
                      variant={
                        feedbackData.status === status.value
                          ? "default"
                          : "outline"
                      }
                      className={`
                        flex items-center justify-center 
                        ${
                          feedbackData.status === status.value
                            ? ""
                            : status.color
                        }
                      `}
                      onClick={() => handleStatusChange(status.value)}
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Feedback Textarea */}
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback Details</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide detailed feedback..."
                  value={feedbackData.feedback}
                  onChange={(e) =>
                    setFeedbackData((prev) => ({
                      ...prev,
                      feedback: e.target.value,
                    }))
                  }
                  className="min-h-[120px]"
                  required
                />
              </div>

              {/* Ratings Section */}
              <div className="space-y-2">
                <Label>Ratings</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Overall Performance</Label>
                    <Select
                      value={feedbackData.ratings?.overallPerformance}
                      onValueChange={(value) =>
                        setFeedbackData((prev) => ({
                          ...prev,
                          ratings: {
                            ...prev.ratings,
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            {rating}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Conditional Additional Inputs for Modify Status */}
              {feedbackData.status === "modify" && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Assigned To</Label>
                    <Input
                      placeholder="Assignee name"
                      value={feedbackData.additionalInputs.assignedTo}
                      onChange={(e) =>
                        setFeedbackData((prev) => ({
                          ...prev,
                          additionalInputs: {
                            ...prev.additionalInputs,
                            assignedTo: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Deadline</Label>
                    <Input
                      type="date"
                      value={feedbackData.additionalInputs.deadline}
                      onChange={(e) =>
                        setFeedbackData((prev) => ({
                          ...prev,
                          additionalInputs: {
                            ...prev.additionalInputs,
                            deadline: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={feedbackData.additionalInputs.priority}
                      onValueChange={(value) =>
                        setFeedbackData((prev) => ({
                          ...prev,
                          additionalInputs: {
                            ...prev.additionalInputs,
                            priority: value,
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFeedbackModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!feedbackData.status}>
                  Submit Feedback
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="overflow-y-scroll bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-emerald-400 to-teal-100 p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white">
                {getInitials(reportDetails?.patient.name)}
              </div>
              <h1 className="text-4xl font-serif text-white">
                {reportDetails?.type} Report
              </h1>
            </div>
            <div className="flex gap-2">
              <div className="bg-teal-50/90 px-4 py-2 rounded-lg">
                <p className="text-sm text-teal-800">Supervisor:</p>
                <p className="font-semibold text-teal-900">
                  {supervisor?.name || "Not Assigned"}
                </p>
              </div>
              <div className="bg-teal-50/90 px-4 py-2 rounded-lg ">
                <Button
                  variant="ghost"
                  onClick={() => setIsFeedbackModalOpen(true)}
                  className="flex items-center h-full rounded-lg hover:shadow-sm hover:bg-teal-100"
                >
                  Add Feedback
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <Card className="p-4 grid grid-cols-3 gap-4">
          {getInfoFields().map((field) => (
            <div key={field.label}>
              <p className="text-sm text-muted-foreground">{field.label}</p>
              <p className="font-medium">{field.value}</p>
            </div>
          ))}
        </Card>

        {/* History Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {reportDetails?.history || "No history available"}
            </p>
          </CardContent>
        </Card>

        {/* Diagnosis Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Diagnosis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {reportDetails?.diagnosis || "No diagnosis available"}
            </p>
          </CardContent>
        </Card>

        {/* Medications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {reportDetails?.medicine || "No medications listed"}
            </p>
          </CardContent>
        </Card>

        {/* Treatment Plan Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Treatment Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              {getTreatmentPlanParts().length > 0 ? (
                getTreatmentPlanParts().map((item, index) => (
                  <li key={index} className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {item.title || `Step ${index + 1}`}:
                    </span>{" "}
                    {item.description}
                  </li>
                ))
              ) : (
                <li>No treatment plan available</li>
              )}
            </ol>
          </CardContent>
        </Card>

        {/* Student Therapist Section */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Student Therapist
                  </p>
                  <p className="text-lg font-medium text-emerald-700">
                    {reportDetails?.student.name || "Unnamed Therapist"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Modal */}
        <Dialog
          open={isFeedbackModalOpen}
          onOpenChange={setIsFeedbackModalOpen}
        >
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Provide Feedback</DialogTitle>
              <DialogDescription>
                Submit your feedback for this therapy report
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              {/* Status Selection */}
              <div className="space-y-2">
                <Label>Feedback Status</Label>
                <div className="grid grid-cols-3 gap-4">
                  {FEEDBACK_STATUSES.map((status) => (
                    <Button
                      key={status.value}
                      type="button"
                      variant={
                        feedbackData.status === status.value
                          ? "default"
                          : "outline"
                      }
                      className={`
                        flex items-center justify-center 
                        ${
                          feedbackData.status === status.value
                            ? ""
                            : status.color
                        }
                      `}
                      onClick={() => handleStatusChange(status.value)}
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Feedback Textarea */}
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback Details</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide detailed feedback..."
                  value={feedbackData.feedback}
                  onChange={(e) =>
                    setFeedbackData((prev) => ({
                      ...prev,
                      feedback: e.target.value,
                    }))
                  }
                  className="min-h-[120px]"
                  required
                />
              </div>

              {/* Ratings Section */}
              <div className="space-y-2">
                <Label>Ratings</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Overall Performance</Label>
                    <Select
                      value={feedbackData.ratings?.overallPerformance}
                      onValueChange={(value) =>
                        setFeedbackData((prev) => ({
                          ...prev,
                          ratings: {
                            ...prev.ratings,
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            {rating}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Conditional Additional Inputs for Modify Status */}
              {feedbackData.status === "modify" && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Assigned To</Label>
                    <Input
                      placeholder="Assignee name"
                      value={feedbackData.additionalInputs.assignedTo}
                      onChange={(e) =>
                        setFeedbackData((prev) => ({
                          ...prev,
                          additionalInputs: {
                            ...prev.additionalInputs,
                            assignedTo: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Deadline</Label>
                    <Input
                      type="date"
                      value={feedbackData.additionalInputs.deadline}
                      onChange={(e) =>
                        setFeedbackData((prev) => ({
                          ...prev,
                          additionalInputs: {
                            ...prev.additionalInputs,
                            deadline: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={feedbackData.additionalInputs.priority}
                      onValueChange={(value) =>
                        setFeedbackData((prev) => ({
                          ...prev,
                          additionalInputs: {
                            ...prev.additionalInputs,
                            priority: value,
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFeedbackModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!feedbackData.status}>
                  Submit Feedback
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default TherapyReport;
