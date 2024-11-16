import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Bell } from "lucide-react";
import Sidebar from "@/components/Sidebar";

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

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Current Month</h1>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { title: "Total Patients", value: "348" },
              { title: "Student Therapists", value: "12" },
              { title: "Appointments", value: "678" },
              { title: "Therapy Sessions", value: "567" },
            ].map((stat) => (
              <Card key={stat.title}>
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
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Patients Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="thisYear" stroke="#8884d8" />
                    <Line type="monotone" dataKey="lastYear" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Therapy Sessions By Student Therapists</CardTitle>
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

            <Card>
              <CardHeader>
                <CardTitle>Patient Distribution by Therapy Type</CardTitle>
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

            <Card>
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <div key={i} className="flex items-center gap-4 py-4">
                        <Avatar>
                          <AvatarImage src={`/api/placeholder/${32 + i}/32`} />
                          <AvatarFallback>AP</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Patient Name</p>
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
  );
};

export default Dashboard;
