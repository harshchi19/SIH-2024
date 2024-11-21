"use client";

import Header from "@/components/Header";
import Loader from "@/components/Loader";
import Sidebar from "@/components/Sidebar";
import { SIDEBAR_DATA_ROUTE } from "@/utils/constants";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function RoleLayout({ children }) {
  const params = useParams();
  const [sidebarData, setSidebarData] = useState();

  useEffect(() => {
    const userType = localStorage.getItem("userType");

    const getSidebarData = async () => {
      const response = await fetch(`${SIDEBAR_DATA_ROUTE}/${userType}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        setSidebarData(result.sidebarData);
      }
    };

    getSidebarData();
  }, [params.role]);

  if (!sidebarData) {
    return (
      <div className="h-screen w-screen">
        <Loader />
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar sidebarData={sidebarData} />
      <div className="flex flex-col w-screen">
        <Header />
        {children}
      </div>
    </div>
  );
}
