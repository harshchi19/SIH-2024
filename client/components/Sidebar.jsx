import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ExternalLink,
  LayoutDashboard,
  Users,
  Calendar,
  Inbox,
  FileText,
  MessageSquare,
} from "lucide-react";
import HoverSpecializationPopup from "./HoverSpecializationPopup";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = router.pathname;
  const { dict, currentLang } = useLanguage();

  const pathWithoutLang = pathname.replace(/^\/[a-z]{2}\//, "");
  const pathParts = pathWithoutLang.split("/").filter((part) => part !== "");

  console.log("currentPath", pathParts[0]);

  const navigationItems = [
    {
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: "Dashboard",
      path: `/${currentLang}/${pathParts[0]}/dashboard`,
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Student Therapist",
      path: `/${currentLang}/${pathParts[0]}/student-therapist`,
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Calendar",
      path: `/${currentLang}/${pathParts[0]}/calendar`,
    },
    {
      icon: <Inbox className="h-4 w-4" />,
      label: "Inbox",
      path: "/inbox",
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: "Reports",
      path: `/${currentLang}/${pathParts[0]}/reports`,
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Patients",
      path: `/${currentLang}/${pathParts[0]}/patients`,
    },
    {
      icon: <MessageSquare className="h-4 w-4" />,
      label: "Communication",
      path: `/${currentLang}/${pathParts[0]}/communication`,
    },
  ];

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="w-64 border-r bg-[#5DB075] p-6">
      <div className="flex items-center gap-2 mb-6">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/api/placeholder/32/32" alt="User" />
          <AvatarFallback>YB</AvatarFallback>
        </Avatar>
        <span className="text-white font-semibold hover:cursor-pointer">
          <HoverSpecializationPopup
            name="Yash Buddhadev"
            specialization="Supervisor"
          />
        </span>
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            variant={currentPath === item.path ? "secondary" : "ghost"}
            className={`w-full justify-start transition-colors duration-200 ${
              currentPath === item.path
                ? "bg-[#54C174] text-white hover:bg-[#54C174]"
                : "text-white hover:bg-[#FEFEFE] hover:text-[#5DB075]"
            }`}
            onClick={() => handleNavigation(item.path)}
          >
            {item.icon}
            <span className="ml-2">{item.label}</span>
          </Button>
        ))}
      </nav>

      {/* <Card className="mt-6 bg-[#54C174] border-none text-white">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Upcoming Event</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold">8:45</div>
            <div className="text-sm">→</div>
            <div className="text-2xl font-bold">10:45</div>
          </div>
          <Button className="w-full bg-white text-green-600 hover:bg-gray-100">
            <ExternalLink className="h-4 w-4 mr-2" />
            Go to meet link
          </Button>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default Sidebar;
