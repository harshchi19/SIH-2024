import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User2 } from "lucide-react";

const SessionReport = ({
  reportDetails,
  supervisor,
  setIsFeedbackModalOpen,
  isFeedbackModalOpen,
  handleFeedbackSubmit,
  feedbackData,
  setFeedbackData,
}) => {
  const getInitials = (name) => {
    const initials = name.match(/\b\w/g) || [];
    return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
  };
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
            <CardTitle className="text-lg font-medium">Machines Used</CardTitle>
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
            <CardTitle className="text-lg font-medium">Session Goals</CardTitle>
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
};

export default SessionReport;
