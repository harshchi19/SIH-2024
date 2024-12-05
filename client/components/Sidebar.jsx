import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Inbox,
  FileText,
  MessageSquare,
  LogOut,
  MoveRight,
  Hospital,
  Clock,
  NotebookPen,
  User,
} from "lucide-react";
import HoverSpecializationPopup from "./HoverSpecializationPopup";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { useById } from "@/hooks/useById.js";
import Image from "next/image";
import { calendar, logo } from "@/assets";
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

  // useEffect(() => {
  //   const getUserById = async () => {
  //     if (upcomingEvent.userId && upcomingEvent.userType) {
  //       const response = await fetch(
  //         `${GET_USER_DETAILS_BY_ID_ROUTE}/${upcomingEvent.userId}/${upcomingEvent.userType}`,
  //         {
  //           method: "GET",
  //         }
  //       );

  //       if (response.ok) {
  //         const result = await response.json();
  //         console.log(result);
  //       }
  //     }
  //   };

  //   getUserById();
  // }, [upcomingEvent]);

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

  function formatTime(timeString) {
    const date = new Date(timeString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return { time: `${hours}:${formattedMinutes}`, ampm: ampm };
  }

  return (
    <aside className="flex h-screen w-80 flex-col justify-between bg-[#5DB075] p-6 px-3">
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
        {upcomingEvent && (
          <Card
            className="w-full max-w-md overflow-hidden transition-all duration-300 bg-white/10 border-[1px] border-white/20 backdrop-blur-xl shadow-2xl"
            style={{
              borderRadius: "12px",
              boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
            }}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-x-3">
                <Image src={calendar} alt="Calendar" className="h-10 w-auto" />
                <div className="max-w-full truncate flex-grow overflow-hidden whitespace-nowrap">
                  <h1 className="text-xl font-extrabold text-white truncate flex-grow drop-shadow-md">
                    {upcomingEvent?.title}
                  </h1>
                  <h4 className="text-sm font-medium text-gray-200 truncate flex-grow overflow-hidden whitespace-nowrap">
                    {upcomingEvent?.description}
                  </h4>
                </div>
              </div>

              <div className="w-full h-[1px] bg-gray-500/30 rounded-full" />

              <div className="flex items-center justify-center space-x-3 p-1">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col justify-center">
                    <span className="text-3xl font-semibold text-gray-100 tracking-wide">
                      {formatTime(upcomingEvent?.start_time).time}
                    </span>
                    <span className="text-md font-semibold text-gray-100 tracking-wide">
                      {formatTime(upcomingEvent?.start_time).ampm}
                    </span>
                  </div>
                  <MoveRight className="text-gray-100 mx-2 opacity-80 h-8 w-auto" />
                  <div className="flex flex-col justify-center">
                    <span className="text-3xl font-semibold text-gray-100 tracking-wide">
                      {formatTime(upcomingEvent?.end_time).time}
                    </span>
                    <span className="text-md font-semibold text-gray-100 tracking-wide">
                      {formatTime(upcomingEvent?.end_time).ampm}
                    </span>
                  </div>
                </div>
              </div>

              {upcomingEvent?.userId && (
                <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg hover:bg-white/20 transition-all">
                  <User className="h-6 w-6 text-blue-600" />
                  <span className="text-lg text-gray-100 font-semibold tracking-wide">
                    {user?.name || "Unknown"}
                  </span>
                </div>
              )}

              {upcomingEvent?.room_no && (
                <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg hover:bg-white/20 transition-all">
                  <Hospital className="h-6 w-6 text-green-600" />
                  <span className="text-lg text-gray-100 font-semibold tracking-wide">
                    {upcomingEvent.room_no || "Not Available"}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
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
