import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SmallCalendar from "@/components/visualizations/SmallCalendar";
import { useLanguage } from "@/context/LanguageContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { GET_CALENDAR_VISUALS_ROUTE } from "@/utils/constants";
import { YT_NEWS_ROUTE } from "@/utils/ai.constants";
import Image from "next/image";
import { news, youtube } from "@/assets";
import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";
import Loader from "../Loader";

const monthlyData = [
  { month: "Jan", thisYear: 10, lastYear: 8 },
  { month: "Feb", thisYear: 15, lastYear: 10 },
  { month: "Mar", thisYear: 12, lastYear: 12 },
  { month: "Apr", thisYear: 8, lastYear: 15 },
  { month: "May", thisYear: 20, lastYear: 18 },
  { month: "Jun", thisYear: 25, lastYear: 22 },
  { month: "Jul", thisYear: 22, lastYear: 25 },
];

const therapistData = [
  { name: "Ananya", sessions: 2800 },
  { name: "Rohan", sessions: 2400 },
  { name: "Ishita", sessions: 2000 },
  { name: "Karan", sessions: 1800 },
  { name: "Sanya", sessions: 1000 },
  { name: "Kiran", sessions: 2200 },
];

const PatientDashboard = () => {
  const [newsData, setNewsData] = useState([]);
  const [youtubeData, setYoutubeData] = useState([]);
  const [message, setMessage] = useState("Speech And Language Therapy");
  const { dict } = useLanguage();
  const [calendarDates, setCalendarDates] = useState([]);

  console.log(youtubeData, newsData);

  const getCalendarDates = async (userId) => {
    const response = await fetch(`${GET_CALENDAR_VISUALS_ROUTE}/${userId}`, {
      method: "GET",
    });

    if (response.ok) {
      const result = await response.json();
      setCalendarDates(result.dates);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("user");
    getCalendarDates(userId);
  }, []);

  useEffect(() => {
    if (message) {
      const fetchData = async (dataType) => {
        const formData = new FormData();
        formData.append("message", message);
        formData.append("type", dataType);

        try {
          const response = await fetch(YT_NEWS_ROUTE, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();
          if (dataType === "youtube") setYoutubeData(result.youtube_videos);
          if (dataType === "news") setNewsData(result.news_articles);
        } catch (error) {
          console.error(`Error fetching ${dataType} data:`, error);
        }
      };
      fetchData("youtube");
      fetchData("news");
    }
  }, [message]);

  if (youtubeData.length === 0 || newsData.length === 0) {
    return <Loader />;
  }

  return (
    <div className="flex-1 overflow-y-scroll">
      <div className="p-8 py-0">
        {/* Charts */}
        <div className="flex flex-col gap-y-3">
          <div className="flex justify-center items-end gap-x-3">
            <Card className="w-2/5">
              <CardHeader>
                <CardTitle>{dict?.dashboard?.patient_overview}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="thisYear" stroke="#8884d8" />
                    <Line type="monotone" dataKey="lastYear" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="w-2/5">
              <CardHeader>
                <CardTitle>
                  {dict?.dashboard?.therapy_sessions_by_student_therapists}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={therapistData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <SmallCalendar calendarDates={calendarDates} />
          </div>

          <div className="w-full flex justify-center items-center gap-x-3">
            <Card className="w-1/2 transition-all duration-300 pb-5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2">
                  <span>{dict?.dashboard?.rel_news}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-80 space-y-3 p-4">
                {newsData?.length > 0 ? (
                  newsData.map((item, index) => (
                    <div
                      key={index}
                      className="bg-muted/30 border-2 border-gray-200 rounded-lg p-4 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <Image
                          src={news}
                          alt="News"
                          className="h-10 w-10 rounded-full"
                        />
                        <h2 className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {item.title}
                        </h2>
                      </div>

                      <Link
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {dict?.dashboard?.watch_news}
                        <SquareArrowOutUpRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-10">
                    {dict?.dashboard?.no_news}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="w-1/2 hover:shadow-lg transition-all duration-300 pb-5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2">
                  <span>{dict?.dashboard?.rel_yt}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-80 space-y-3 p-4">
                {youtubeData?.length > 0 ? (
                  youtubeData.map((item, index) => (
                    <div
                      key={index}
                      className="bg-muted/30 rounded-lg p-4 border-2 border-gray-200 hover:bg-muted/50 transition-colors group cursor-pointer"
                      onClick={() => window.open(item.link, "_blank")}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <Image
                          src={youtube}
                          alt="YouTube"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <h2 className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {item.title}
                        </h2>
                      </div>
                      <div className="flex items-center text-xs text-red-600 hover:text-red-800 transition-colors">
                        {dict?.dashboard?.watch_video}
                        <SquareArrowOutUpRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-10">
                    {dict?.dashboard?.no_yt}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
