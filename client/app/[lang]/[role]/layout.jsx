"use client";

import FloatingChatbot from "@/components/FloatingChatbot";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import Sidebar from "@/components/Sidebar";
import { useLanguage } from "@/context/LanguageContext";
import { SIDEBAR_DATA_ROUTE } from "@/utils/constants";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function RoleLayout({ children }) {
  const params = useParams();
  const [sidebarData, setSidebarData] = useState();
  const { currentLang } = useLanguage();
  const router = useRouter();

  const checkUserType = {
    patient: "PAT",
    "student-therapist": "STT",
    supervisor: "SUP",
  };

  useEffect(() => {
    const userType = localStorage.getItem("userType");

    if (!userType) {
      router.push(`/${currentLang}/sign-in`);
    }

    const expectedRole = checkUserType[params.role];
    if (expectedRole !== userType) {
      router.push(`/${currentLang}/sign-in`);
      return;
    }

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
    <div className="relative h-screen flex bg-slate-50">
      <Sidebar sidebarData={sidebarData} />
      <div className="flex flex-col w-screen">
        <Header />
        {children}
      </div>
      <FloatingChatbot />
    </div>
  );
}
