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
    return date.toTimeString().slice(0, 5);
  }

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
        <Card
          className="w-full max-w-md overflow-hidden shadow-xl border-none transition-all duration-300"
          style={{
            background:
              "linear-gradient(145deg, rgba(0,0,0,0.3), rgba(0,0,0,0.4))",
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          }}
        >
          <CardContent className="p-3 space-y-2">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold text-white truncate flex-grow pr-4">
                {upcomingEvent.title}
              </h1>
            </div>

            {user._id !== upcomingEvent.userId && (
              <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg">
                <User className="h-5 w-5 text-blue-300" />
                <span className="text-md text-gray-100 font-semibold">
                  {user?.name ? user.name : ""}
                </span>
              </div>
            )}

            {upcomingEvent.room_no && (
              <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg">
                <Hospital className="h-5 w-5 text-green-300" />
                <span className="text-md text-gray-100 font-semibold">
                  {upcomingEvent.room_no || "NA"}
                </span>
              </div>
            )}

            <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg">
              <Clock className="h-5 w-5 text-purple-300" />
              <div className="flex items-center space-x-2">
                <span className="text-md font-semibold text-gray-100">
                  {formatTime(upcomingEvent.start_time)}
                </span>
                <MoveRight className="text-gray-400 mx-2" />
                <span className="text-md font-semibold text-gray-100">
                  {formatTime(upcomingEvent.end_time)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg">
              <NotebookPen className="h-5 w-5 text-red-300" />
              <p className="text-md text-gray-300 truncate">
                {upcomingEvent.description}
              </p>
            </div>
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
