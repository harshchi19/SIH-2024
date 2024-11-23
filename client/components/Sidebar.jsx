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
  LogOut,
} from "lucide-react";
import HoverSpecializationPopup from "./HoverSpecializationPopup";
import { useEffect, useState } from "react";
import { useById } from "@/hooks/useById.js";
import Image from "next/image";
import { logo } from "@/assets";

const iconMap = {
  LayoutDashboard,
  Users,
  Calendar,
  Inbox,
  FileText,
  MessageSquare,
};

const Sidebar = ({ sidebarData }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentLang } = useLanguage();

  const userId = localStorage.getItem("user");
  const userType = localStorage.getItem("userType");
  const ROLE_PREFIXES = {
    PAT: "Patient",
    STT: "Student Therapist",
    SUP: "Supervisor",
  };

  const { getById } = useById();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        const result = await getById(userId);
        if (result.success) {
          setUser(result.user);
        }
      }
    };

    fetchUser();
  }, [userId, getById]);

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  const handleNavigation = (path) => {
    router.push(`/${currentLang}${path}`);
  };

  const isActiveRoute = (route) => {
    return pathname?.includes(route);
  };

  return (
    <aside className="flex h-screen w-64 flex-col justify-between bg-[#5DB075] p-6">
      {/* Header */}
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-3">
          <Image
            src={logo}
            className="h-12 w-auto mb-4 cursor-pointer object-contain"
            alt="Logo"
          />
          {/* <AvatarFallback className="bg-[#54C174] text-white font-mono">
              VV
            </AvatarFallback> */}
          <span className="text-white font-semibold hover:cursor-pointer">
            <span className="text-lg font-medium font-mono cursor-pointer hover:text-black transition-colors">
              VANI VIKAS
            </span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {sidebarData.map((item) => {
            const IconComponent = iconMap[item.icon];
            const active = isActiveRoute(item.route);

            return (
              <Button
                key={item._id}
                variant="ghost"
                className={`w-full justify-start text-base transition-all duration-200 ${
                  active
                    ? "bg-[#54C174] text-white hover:bg-[#54C174]"
                    : "text-white hover:bg-white/90 hover:text-[#5DB075]"
                }`}
                onClick={() => handleNavigation(item.route)}
              >
                {IconComponent && (
                  <IconComponent
                    className={`mr-2 h-4 w-4 ${
                      active
                        ? "text-white"
                        : "text-white group-hover:text-[#5DB075]"
                    }`}
                  />
                )}
                <span className="capitalize">{item.name}</span>
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Event Card */}
      <div className="space-y-6">
        <Card className="bg-[#54C174] border-none text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Event
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <time className="text-2xl font-bold">8:45</time>
              <span className="text-sm">→</span>
              <time className="text-2xl font-bold">10:45</time>
            </div>
            <Button
              className="w-full bg-white text-[#5DB075] hover:bg-gray-100"
              variant="secondary"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Go to meet link
            </Button>
          </CardContent>
        </Card>

        {/* User Profile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="p-2 font-serif">
                {user?.name ? getInitials(user.name) : ""}
              </AvatarFallback>
            </Avatar>
            <span className="text-white font-semibold hover:cursor-pointer">
              <HoverSpecializationPopup
                name={user?.name}
                specialization={ROLE_PREFIXES[userType]}
              />
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-[#54C174]"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
