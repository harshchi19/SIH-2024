import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GET_ALL_PAT_ROUTE } from "@/utils/constants";
import { useEffect, useState } from "react";

export function ProgressReportForm({
  formData,
  studentTherapistId,
  handleInputChange,
}) {
  formData.student_therapist_id = studentTherapistId;
  console.log("formData", formData);
  const [patientData, setPatientData] = useState([]);
  const [caseNo, setCaseNo] = useState([]);
  const uniqueCaseNos = Array.from(
    new Set(patientData.map((patient) => patient.case_no))
  );

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await fetch(GET_ALL_PAT_ROUTE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const result = await response.json();
        setPatientData(result);
      }
    };

    fetchPatients();
    setCaseNo(uniqueCaseNos);
  }, []);

  console.log("patientData", patientData);

  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="case_no">Case Number</Label>
        <Select
          value={formData.case_no} // Selected case number
          onValueChange={(value) => {
            handleInputChange("progress-report", "case_no", value);

            // Find the patient name based on the selected case number
            const selectedPatient = patientData.find(
              (patient) => patient.case_no === value
            );
            handleInputChange(
              "progress-report",
              "name",
              selectedPatient?.name || ""
            );
          }}
        >
          <SelectTrigger id="case_no">
            <SelectValue placeholder="Select Case" />
          </SelectTrigger>
          <SelectContent>
            {uniqueCaseNos.map((caseNumber) => (
              <SelectItem key={caseNumber} value={caseNumber}>
                {caseNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="session_no">Session Number</Label>
        <Input
          id="session_no"
          placeholder="Enter session number"
          value={formData.session_no}
          onChange={(e) =>
            handleInputChange("progress-report", "session_no", e.target.value)
          }
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="name">Patient Name</Label>
        <Input id="name" placeholder="Patient Name" value={formData.name} />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) =>
            handleInputChange("progress-report", "status", value)
          }
          readOnly
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on-hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="history">History</Label>
        <Textarea
          id="history"
          placeholder="Enter patient history"
          value={formData.history}
          onChange={(e) =>
            handleInputChange("progress-report", "history", e.target.value)
          }
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="diagnosis">Diagnosis</Label>
        <Textarea
          id="diagnosis"
          placeholder="Enter diagnosis"
          value={formData.diagnosis}
          onChange={(e) =>
            handleInputChange("progress-report", "diagnosis", e.target.value)
          }
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="treatment_plan">Treatment Plan</Label>
        <Textarea
          id="treatment_plan"
          placeholder="Enter treatment plan"
          value={formData.treatment_plan}
          onChange={(e) =>
            handleInputChange(
              "progress-report",
              "treatment_plan",
              e.target.value
            )
          }
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="progress">Progress</Label>
        <Textarea
          id="progress"
          placeholder="Enter progress details"
          value={formData.progress}
          onChange={(e) =>
            handleInputChange("progress-report", "progress", e.target.value)
          }
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="medicine">Medicine</Label>
        <Textarea
          id="medicine"
          placeholder="Enter medicine details"
          value={formData.medicine}
          onChange={(e) =>
            handleInputChange("progress-report", "medicine", e.target.value)
          }
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="equipments">Equipment</Label>
        <Textarea
          id="equipments"
          placeholder="Enter equipment used"
          value={formData.equipments}
          onChange={(e) =>
            handleInputChange("progress-report", "equipments", e.target.value)
          }
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="findings">Findings</Label>
        <Textarea
          id="findings"
          placeholder="Enter findings"
          value={formData.findings}
          onChange={(e) =>
            handleInputChange("progress-report", "findings", e.target.value)
          }
        />
      </div>
    </div>
  );
}
