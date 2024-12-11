"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import RightSidebar from "@/components/RightSidebar";
import { useLanguage } from "@/context/LanguageContext";
import { GET_CALENDAR_VISUALS_ROUTE } from "@/utils/constants";
import SmallCalendar from "@/components/visualizations/SmallCalendar";
import PatientDashboard from "@/components/dashboard/PatientDashboard";

const monthlyData = [
  { month: "Jan", thisYear: 10, lastYear: 8 },
  { month: "Feb", thisYear: 15, lastYear: 10 },
  { month: "Mar", thisYear: 12, lastYear: 12 },
  { month: "Apr", thisYear: 8, lastYear: 15 },
  { month: "May", thisYear: 20, lastYear: 18 },
  { month: "Jun", thisYear: 25, lastYear: 22 },
  { month: "Jul", thisYear: 22, lastYear: 25 },
];

const therapistData = [
  { name: "Ananya", sessions: 2800 },
  { name: "Rohan", sessions: 2400 },
  { name: "Ishita", sessions: 2000 },
  { name: "Karan", sessions: 1800 },
  { name: "Sanya", sessions: 1000 },
  { name: "Kiran", sessions: 2200 },
];

const therapyTypeData = [
  { name: "Articulation Therapy", value: 38.6, color: "#8884d8" },
  { name: "Language Therapy", value: 22.5, color: "#82ca9d" },
  { name: "Fluency Therapy", value: 30.8, color: "#ffc658" },
  { name: "Voice Therapy", value: 8.1, color: "#ff8042" },
];

const DashboardPage = () => {
  const { dict } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [calendarDates, setCalendarDates] = useState([]);

  const userType = localStorage.getItem("userType");

  const getCalendarDates = async (userId) => {
    const response = await fetch(`${GET_CALENDAR_VISUALS_ROUTE}/${userId}`, {
      method: "GET",
    });

    if (response.ok) {
      const result = await response.json();
      setCalendarDates(result.dates);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("user");

    getCalendarDates(userId);
  }, []);

  return (
    <>
      {userType === "PAT" ? (
        <PatientDashboard />
      ) : (
        <div className="flex-1 overflow-y-scroll">
          <div className="p-8 py-0">
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { title: dict?.dashboard?.total_patients, value: "348" },
                { title: dict?.dashboard?.student_therapist, value: "12" },
                { title: dict?.dashboard?.appointments, value: "678" },
                { title: dict?.dashboard?.therapy_sessions, value: "567" },
              ].map((stat) => (
                <Card key={stat.value}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="flex flex-col gap-y-3">
              <div className="flex justify-center items-end gap-x-3">
                <Card className="w-2/5">
                  <CardHeader>
                    <CardTitle>{dict?.dashboard?.patient_overview}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="thisYear"
                          stroke="#8884d8"
                        />
                        <Line
                          type="monotone"
                          dataKey="lastYear"
                          stroke="#82ca9d"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="w-2/5">
                  <CardHeader>
                    <CardTitle>
                      {dict?.dashboard?.therapy_sessions_by_student_therapists}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={therapistData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sessions" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <SmallCalendar calendarDates={calendarDates} />
              </div>
              <div className="w-full flex justify-center items-center gap-x-3">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>
                      {dict?.dashboard?.patient_distribution_by_therapy_type}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={therapyTypeData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                        >
                          {therapyTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>
                      {dict?.dashboard?.recent_appointments}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      {Array(5)
                        .fill(null)
                        .map((_, i) => (
                          <div key={i} className="flex items-center gap-4 py-4">
                            <Avatar>
                              {/* <AvatarImage src={`/api/placeholder/${32 + i}/32`} /> */}
                              <AvatarFallback>AP</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                Patient Name
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Room No. {30 + i}
                              </p>
                            </div>
                            <Badge variant="outline">{i + 1} min ago</Badge>
                          </div>
                        ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* <RightSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      /> */}
    </>
  );
};

export default DashboardPage;
