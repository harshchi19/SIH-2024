import { useRouter } from "next/navigation";
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
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

const iconMap = {
  LayoutDashboard: LayoutDashboard,
  Users: Users,
  Calendar: Calendar,
  Inbox: Inbox,
  FileText: FileText,
  MessageSquare: MessageSquare,
};

const Sidebar = ({ sidebarData }) => {
  const router = useRouter();
  const currentPath = router.pathname;
  const { currentLang } = useLanguage();

  // const navigationItems = [
  //   {
  //     icon: <LayoutDashboard className="h-4 w-4" />,
  //     label: "Dashboard",
  //     path: "/patient/dashboard",
  //   },
  //   {
  //     icon: <Users className="h-4 w-4" />,
  //     label: "Student Therapist",
  //     path: "/student-therapist",
  //   },
  //   {
  //     icon: <Calendar className="h-4 w-4" />,
  //     label: "Calendar",
  //     path: "/patient/calendar",
  //   },
  //   {
  //     icon: <Inbox className="h-4 w-4" />,
  //     label: "Inbox",
  //     path: "/inbox",
  //   },
  //   {
  //     icon: <FileText className="h-4 w-4" />,
  //     label: "Reports",
  //     path: "/reports",
  //   },
  //   {
  //     icon: <Users className="h-4 w-4" />,
  //     label: "Patients",
  //     path: "/patients",
  //   },
  //   {
  //     icon: <MessageSquare className="h-4 w-4" />,
  //     label: "Communication",
  //     path: "/communication",
  //   },
  // ];

  const handleNavigation = (path) => {
    router.push(`${path}`);
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

      {/* <nav className="space-y-2">
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
      </nav> */}

      <nav className="space-y-2">
        {sidebarData.map((item) => {
          const IconComponent = iconMap[item.icon];
          return (
            <Button
              key={item._id}
              variant={currentPath === item.route ? "secondary" : "ghost"}
              className={`w-full justify-start transition-colors duration-200 ${
                currentPath === item.route
                  ? "bg-[#54C174] text-white hover:bg-[#54C174]"
                  : "text-white hover:bg-[#FEFEFE] hover:text-[#5DB075]"
              }`}
              onClick={() => handleNavigation(`/${currentLang}/${item.route}`)}
            >
              {IconComponent && <IconComponent className="h-4 w-4" />}
              <span className="ml-2 capitalize">{item.name}</span>
            </Button>
          );
        })}
      </nav>

      <Card className="mt-6 bg-[#54C174] border-none text-white">
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
      </Card>
    </div>
  );
};

export default Sidebar;
