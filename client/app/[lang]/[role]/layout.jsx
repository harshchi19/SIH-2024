"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function RoleLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-col w-screen">
        <Header />
        {children}
      </div>
    </div>
  );
}
