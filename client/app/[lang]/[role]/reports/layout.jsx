"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReportsLayout = ({ children }) => {
  const { lang, role } = useParams();
  const { dict } = useLanguage();

  const reportTabs = [
    {
      label: dict?.reports?.list_reports,
      path: `/${lang}/${role}/reports`,
    },
    {
      label: dict?.reports?.add_new,
      path: `/${lang}/${role}/reports/new`,
    },
    {
      label: dict?.reports?.analytics,
      path: `/${lang}/${role}/reports/analytics`,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-scroll">{children}</div>
    </div>
  );
};

export default ReportsLayout;
