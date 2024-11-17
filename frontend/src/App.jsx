import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import StudentTherapistCard from "./pages/StudentTherapistCard";
// import Calendar from "./pages/Calendar";
// import Inbox from "./pages/Inbox";
import ReportsPage from "./pages/ReportsPage";
// import Patients from "./pages/Patients";
// import Communication from "./pages/Communication";

const AppLayout = ({ children }) => (
  <div className="flex h-screen">
    {/* <Sidebar /> */}
    <main className="flex-1 overflow-auto">{children}</main>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/student-therapist"
          element={
            <AppLayout>
              <StudentTherapistCard />
            </AppLayout>
          }
        />
        {/* <Route
          path="/calendar"
          element={
            <AppLayout>
              <Calendar />
            </AppLayout>
          }
        />
        <Route
          path="/inbox"
          element={
            <AppLayout>
              <Inbox />
            </AppLayout>
          }
        /> */}
        <Route
          path="/reports"
          element={
            <AppLayout>
              <ReportsPage />
            </AppLayout>
          }
        />
        {/* <Route
          path="/patients"
          element={
            <AppLayout>
              <Patients />
            </AppLayout>
          }
        />
        <Route
          path="/communication"
          element={
            <AppLayout>
              <Communication />
            </AppLayout>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
