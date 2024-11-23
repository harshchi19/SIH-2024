"use client";

import { useParams, usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageButton";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Loader from "./Loader";

const Header = () => {
  const pathname = usePathname();
  const { dict, currentLang } = useLanguage();
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  if (!dict) {
    return (
      <>
        <Loader />;
      </>
    );
  }

  useEffect(() => {
    const pathWithoutLang = pathname.replace(/^\/[a-z]{2}\//, "");
    const pathParts = pathWithoutLang.split("/").filter((part) => part !== "");
    console.log(pathParts);

    const breadcrumbList = pathParts.map((part, index) => {
      const normalizedPart = part.trim().toLowerCase();
      let label = dict?.breadcrumb?.[normalizedPart];

      const isRole = ["student-therapist", "supervisor", "patient"].includes(
        normalizedPart
      );
      const href = isRole
        ? `/${currentLang}/${normalizedPart}/${pathParts[1]}`
        : `/${currentLang}/` + pathParts.slice(0, index + 1).join("/");

      return {
        label,
        href,
      };
    });

    setBreadcrumbItems(breadcrumbList);
  }, [pathname, dict]);

  return (
    <div className="flex justify-between items-center mb-6 px-8 mt-10">
      <div className="flex flex-col items-start">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <BreadcrumbItem key={index}>
                {index < breadcrumbItems.length - 1 ? (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {breadcrumbItems[breadcrumbItems.length - 1]?.label}
        </h1>
      </div>
      <div className="flex-row-center gap-x-3">
        <LanguageSwitcher currentLang={currentLang} />
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Header;
