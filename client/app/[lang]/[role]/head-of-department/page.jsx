"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { GET_ALL_ADM_ROUTE, GET_ALL_HOD_ROUTE } from "@/utils/constants";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import AddHODModal from "@/components/AddHODModal";
import { useLanguage } from "@/context/LanguageContext";
import { useParams } from "next/navigation";

const HODPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { dict } = useLanguage();

  useEffect(() => {
    const getAllAdmins = async () => {
      try {
        const response = await fetch(GET_ALL_HOD_ROUTE, { method: "GET" });

        if (!response.ok) {
          throw new Error("Failed to fetch admins");
        }

        const result = await response.json();
        setAdmins(result.admin || result);
      } catch (err) {
        console.error(err);
        setError("Could not load HODs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getAllAdmins();
  }, []);

  if (loading || !dict) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="px-8">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Head of Department Overview</h1>
          <p className="text-slate-500 text-sm">
            Manage and monitor administration of VaniVikas
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-lg">
            Total HODs: {admins.length}
          </Badge>
          <Button variant="outline">Filter</Button>
          <div>
            <AddHODModal />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.map((admin) => (
          <Card
            key={admin._id}
            className="transition-shadow border border-gray-200 rounded-lg w-96"
          >
            <CardHeader className="flex flex-row items-center space-x-4 p-4 border-b">
              <Avatar className="h-16 w-16 border border-gray-300">
                <AvatarImage
                  src={admin.user_image || "/default-avatar.png"}
                  alt={admin.name || "HOD Avatar"}
                />
                <AvatarFallback>
                  {admin.name ? admin.name.slice(0, 2).toUpperCase() : "HD"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold">
                  {admin.name || "Unnamed HOD"}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  {admin.email || "No email provided"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <strong className="text-sm text-gray-600">Department:</strong>
                <Badge variant="outline">
                  {admin.department || "Not Assigned"}
                </Badge>
              </div>
              <div className="flex justify-between items-start">
                <strong className="text-sm text-gray-600">
                  Qualifications:
                </strong>
                <span className="text-sm text-gray-800">
                  {admin.qualifications || "Not specified"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <strong className="text-sm text-gray-600">Phone:</strong>
                <span className="text-sm text-gray-800">
                  {admin.phone_no || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <strong className="text-sm text-gray-600">Age:</strong>
                <span className="text-sm text-gray-800">
                  {admin.age ? `${admin.age} years` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <strong className="text-sm text-gray-600">Sex:</strong>
                <span className="text-sm text-gray-800">
                  {admin.sex || "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {admins.length === 0 && (
        <div className="text-center text-muted-foreground mt-10">
          No admins found
        </div>
      )}
    </div>
  );
};

export default HODPage;
