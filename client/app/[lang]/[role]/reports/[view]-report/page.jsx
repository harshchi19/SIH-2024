"use client";

import React, { use, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { User, User2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reportData } from "@/constants/reportData";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { logo } from "@/assets/index.js";
import { useGetReport } from "@/hooks/useGetReport";
import { useSearchParams } from "next/navigation";
import { useByObjectId } from "@/hooks/useByObjectId";

function TherapyReport() {
  const searchParams = useSearchParams();
  const reportDetailsParam = searchParams.get("report");

  const { getByObjectId } = useByObjectId();
  const [supervisor, setSupervisor] = useState([]);

  const reportDetails = reportDetailsParam
    ? JSON.parse(decodeURIComponent(reportDetailsParam))
    : null;

  useEffect(() => {
    if (reportDetails) {
      console.log("Selected Report Details:", reportDetails);
    }
  }, [reportDetails]);

  console.log("reportDetails", reportDetails);

  useEffect(() => {
    if (reportDetails.student.supervisor_id) {
      getByObjectId(reportDetails.student.supervisor_id, "SUP")
        .then((res) => {
          setSupervisor(res.user);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [reportDetails.student]);

  console.log("supervisor", supervisor);

  const speechData = [
    { session: "Session 1", rate: 20 },
    { session: "Session 2", rate: 25 },
    { session: "Session 3", rate: 30 },
    { session: "Session 4", rate: 32 },
    { session: "Session 5", rate: 35 },
    { session: "Session 6", rate: 38 },
  ];

  const COLORS = ["#10b981", "#6366f1", "#f59e0b", "#ef4444"];

  const intonationData = [
    { name: "Phrasing", value: 2 },
    { name: "Pitch Variation", value: 4 },
    { name: "Rhythm", value: 3 },
    { name: "Stress Accuracy", value: 5 },
  ];

  const infoFields = [
    { label: "Name", value: reportDetails?.patient?.name || "N/A" },
    {
      label: "Age",
      value: reportDetails?.patient?.age
        ? `${reportDetails.patient.age} yrs`
        : "N/A",
    },
    { label: "Case No", value: reportDetails?.patient?.case_no || "N/A" },
    { label: "Gender", value: reportDetails?.patient?.sex || "N/A" },
    { label: "Contact", value: reportDetails?.patient?.phone_no || "N/A" },
    { label: "Email", value: reportDetails?.patient?.email || "N/A" },
  ];

  if (!reportData) {
    return <div>No report data available</div>;
  }

  return (
    <div className=" overflow-y-scroll bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-gradient-to-r from-emerald-400 to-teal-100 p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <img src={logo} alt="" />
              </div>
              <h1 className="text-4xl font-serif text-white">
                {reportDetails.type} Report
              </h1>
            </div>
            <div className="bg-teal-50/90 px-4 py-2 rounded-lg">
              <p className="text-sm text-teal-800">Supervisor:</p>
              <p className="font-semibold text-teal-900">
                {supervisor.name || "Not Assigned"}
              </p>
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <Card className="p-4 grid grid-cols-3 gap-4">
          {infoFields.map((field) => (
            <div key={field.label}>
              <p className="text-sm text-muted-foreground">{field.label}</p>
              <p className="font-medium">{field.value}</p>
            </div>
          ))}
        </Card>

        {/* History Detail */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {reportData.history || "No history available"}
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Speech Rate Development Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={speechData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rate" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Intonation and Stress Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={intonationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    startAngle={0}
                    endAngle={360}
                    paddingAngle={5}
                    label={({ name }) => `${name}`}
                  >
                    {/* {intonationData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))} */}
                  </Pie>
                  <Tooltip />
                  {/* <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconSize={10}
                  /> */}
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Diagnosis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Diagnosis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {reportData.diagnosis || "No diagnosis available"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {reportData.medications || "No medications listed"}
            </p>
          </CardContent>
        </Card>

        {/* Treatment Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Treatment Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              {reportData.treatmentPlan &&
              reportData.treatmentPlan.length > 0 ? (
                reportData.treatmentPlan.map((item, index) => (
                  <li key={index} className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {item.title || `Step ${index + 1}`}:
                    </span>{" "}
                    {item.description || "No description available"}
                  </li>
                ))
              ) : (
                <li>No treatment plan available</li>
              )}
            </ol>
          </CardContent>
        </Card>

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
                    {reportDetails.student.name || "Unnamed Therapist"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default TherapyReport;
