import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, PlusCircle, Trash2 } from "lucide-react";

export default function TherapyReportsSummary() {
  const [reports, setReports] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAISummary = async () => {
    // Validation check
    if (reports.length === 0) {
      setError("Please add some therapy reports before generating a summary.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reports }),
      });

      const data = await response.json();

      if (data.success) {
        setSummaries(data.summaries);
      } else {
        throw new Error(data.message || "Unknown error occurred");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const addReport = () => {
    const newReport = {
      patient_id: `patient-${reports.length + 1}`,
      session_date: new Date().toISOString(),
      notes: `Session notes for patient ${reports.length + 1}`,
    };
    setReports([...reports, newReport]);
  };

  const removeReport = (indexToRemove) => {
    setReports(reports.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Therapy Reports Summary</CardTitle>
          <CardDescription>
            Generate AI-powered insights from therapy reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Button onClick={addReport} variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Report
            </Button>
            <Button
              onClick={fetchAISummary}
              disabled={isLoading || reports.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Generating...
                </>
              ) : (
                "Generate AI Summary"
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Reports Table */}
          {reports.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Session Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report, index) => (
                  <TableRow key={report.patient_id}>
                    <TableCell>{report.patient_id}</TableCell>
                    <TableCell>
                      {new Date(report.session_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeReport(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* AI Summaries */}
      {summaries.map((summary) => (
        <Card key={summary.id}>
          <CardHeader>
            <CardTitle>{summary.title}</CardTitle>
            <CardDescription>{summary.shortDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-lg font-semibold mb-2">Full Summary</h4>
                <p className="text-muted-foreground">{summary.fullSummary}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">Key Metrics</h4>
                <ul className="space-y-1">
                  <li>Total Reports: {summary.keyMetrics.totalReports}</li>
                  <li>Unique Patients: {summary.keyMetrics.uniquePatients}</li>
                  <li>
                    Avg Session Duration:{" "}
                    {summary.keyMetrics.averageSessionDuration}
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-4 mb-2">
                  Key Insights
                </h4>
                <ul className="list-disc list-inside">
                  {summary.insights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
