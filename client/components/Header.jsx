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
import { useById } from "@/hooks/useById";
import RightSidebar from "./RightSidebar";

const Header = () => {
  const pathname = usePathname();
  const { dict, currentLang } = useLanguage();
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const { getById, isLoading, error } = useById();
  const [role, setRole] = useState(null); // State to store role

  // Sidebar visibility state
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleBellClick = () => {
    setSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  useEffect(() => {
    const pathWithoutLang = pathname.replace(/^\/[a-z]{2}\//, "");
    const pathParts = pathWithoutLang.split("/").filter((part) => part !== "");

    const breadcrumbList = pathParts.map((part, index) => {
      const normalizedPart = part.trim();

      console.log(normalizedPart);

      // Check if the part matches the role format (e.g., STT-xxxx-xxxxx)
      if (
        /^(STT|PAT|SUP|ADM|HOD)-[a-z0-9]{8}-[A-Z0-9]{6}$/.test(normalizedPart)
      ) {
        const extractedRole = normalizedPart.split("-")[0];
        setRole(extractedRole);
        setUserId(normalizedPart);
      }

      let label = dict?.breadcrumb?.[normalizedPart] || normalizedPart;

      const isRole = [
        "student-therapist",
        "supervisor",
        "patient",
        "admin",
        "head-of-department",
      ].includes(normalizedPart);
      const href = isRole
        ? `/${currentLang}/${normalizedPart}/${pathParts[1]}`
        : `/${currentLang}/` + pathParts.slice(0, index + 1).join("/");

      return {
        label,
        href,
        originalLabel: label, // Store the original label to revert to if needed
      };
    });
    setBreadcrumbItems(breadcrumbList);
  }, [pathname, dict]);

  const fetchUser = async () => {
    if (userId && role) {
      const result = await getById(userId, role);
      if (result.success) {
        setUser(result.user);

        // Update breadcrumb labels with user names
        setBreadcrumbItems((prevBreadcrumbItems) =>
          prevBreadcrumbItems.map((item) => {
            if (item.originalLabel === userId) {
              // If the part is an ID, update the label with the user's name
              return { ...item, label: result.user.name || item.originalLabel };
            }
            return item;
          })
        );
      }
    }
  };
  useEffect(() => {
    fetchUser();
  }, [userId]); // Dependency on userId and role to re-fetch when these change

  if (isLoading || !dict) {
    return <Loader />;
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6 px-8 mt-10">
        <div className="flex flex-col items-start">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <BreadcrumbItem key={index}>
                  {index < breadcrumbItems.length - 1 ? (
                    <BreadcrumbLink href={item.href}>
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                  {index < breadcrumbItems.length - 1 && (
                    <BreadcrumbSeparator />
                  )}
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
          <Button variant="outline" size="icon" onClick={handleBellClick}>
            <Bell className="h-4 w-4" />
          </Button>
        </div>

        {/* Right Sidebar */}
        <RightSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setSidebarOpen(!isSidebarOpen)}
        />
      </div>
    </div>
  );
};

export default Header;
