import { useRouter, usePathname } from "next/navigation";
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
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { useById } from "@/hooks/useById.js";
import Image from "next/image";
import { logo } from "@/assets";
import { useLogout } from "@/hooks/useLogout";
import { GET_UPCOMING_EVENT_ROUTE } from "@/utils/constants";

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
  const [upcomingEvent, setUpcomingEvent] = useState([]);

  const startTime = new Date(upcomingEvent.start_time);
  const endTime = new Date(upcomingEvent.end_time);

  const startTimeFormatted = `${startTime.getHours()}:${startTime
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  const endTimeFormatted = `${endTime.getHours()}:${endTime
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  const getEventStatus = (selectedDate) => {
    const today = new Date();
    const eventDate = new Date(selectedDate);

    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    const diffTime = eventDate - today;
    const diffDays = diffTime / (1000 * 3600 * 24);

    console.log(diffDays);

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 2) {
      return "Tomorrow";
    }
  };

  const { logout, loading, error } = useLogout();

  const userId = localStorage.getItem("user");
  const userType = localStorage.getItem("userType");
  const ROLE_PREFIXES = {
    PAT: "Patient",
    STT: "Student Therapist",
    SUP: "Supervisor",
  };

  const { getById } = useById();
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    if (userId) {
      const result = await getById(userId, userType);
      if (result.success) {
        setUser(result.user);
      }
    }
  };

  const getCurrentData = async () => {
    if (userId) {
      const response = await fetch(`${GET_UPCOMING_EVENT_ROUTE}/${userId}`, {
        method: "GET",
      });

      if (response.ok) {
        const result = await response.json();
        setUpcomingEvent(result.event);
      }
    }
  };

  useEffect(() => {
    fetchUser();
    getCurrentData();
  }, [userId]);

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

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    router.push(`/${currentLang}/sign-in`);
  };

  return (
    <aside className="flex h-screen w-64 flex-col justify-between bg-[#5DB075] p-6 px-3">
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

      <div className="space-y-6">
        <div className="bg-black backdrop-blur-md bg-opacity-40 p-2 px-5 h-48 w-full flex flex-col items-start rounded-lg text-white">
          <div className="flex items-center justify-between">
            <h1 className="w-full text-md font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
              {upcomingEvent.title}
            </h1>
          </div>
        </div>

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
            onClick={handleLogout}
          >
            {loading && <span className="animate-spin">⏳</span>}
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
