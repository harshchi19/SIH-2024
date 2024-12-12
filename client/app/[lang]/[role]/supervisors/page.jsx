"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SupervisorCard from "@/components/supervisor/SupervisorCard";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useGetRole } from "@/hooks/useGetRole";
import { hospitalDepartments } from "@/constants/hospitalDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 6;

export default function SupervisorsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All Departments");
  const [supervisors, setSupervisors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { role } = useParams();

  const { getAll } = useGetRole();

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const { success, users } = await getAll("SUP");
      if (success) {
        setSupervisors(users);
      }
    } catch (error) {
      console.error("Error fetching supervisors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); // Fetch supervisors when supervisors change

  // Get unique departments for filter
  const departments = ["All Departments", ...hospitalDepartments];

  const filteredAndSearchedSupervisors = useMemo(() => {
    return supervisors.filter((supervisor) => {
      // Split and normalize the department values into an array
      const supervisorDepartments = supervisor.department
        .split(",")
        .map((dept) => dept.trim().toLowerCase()); // Split by comma and trim spaces

      const matchesSearchTerm =
        searchTerm === "" ||
        supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supervisorDepartments.some((dept) =>
          dept.includes(searchTerm.toLowerCase())
        ); // Check if any department matches the search term

      const matchesDepartment =
        filterDepartment === "All Departments" ||
        supervisorDepartments.includes(filterDepartment.toLowerCase()); // Match the department filter

      return matchesSearchTerm && matchesDepartment;
    });
  }, [searchTerm, filterDepartment, supervisors]);

  const totalPages = Math.ceil(
    filteredAndSearchedSupervisors.length / ITEMS_PER_PAGE
  );
  const currentPageSupervisors = filteredAndSearchedSupervisors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 overflow-y-scroll">
      {isLoading ? (
        <div className="text-center py-10">Loading supervisors...</div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div>
              <h1 className="text-2xl font-bold">Supervisors Overview</h1>
              <p className="text-slate-500 text-sm">
                Manage and monitor Patient progress and Student Therapists
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg">
                Total Supervisors: {supervisors.length}
              </Badge>
              <div>
                <SearchIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <Input
                  placeholder="Search supervisors..."
                  className="pl-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative flex gap-4">
                <Select
                  value={filterDepartment}
                  onValueChange={setFilterDepartment}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter Department">
                      {filterDepartment || "All Departments"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="border border-green-500 bg-white text-green-500 font-bold hover:bg-white active:scale-95"
                onClick={() =>
                  router.push(`/en/${role}/supervisors/add-supervisor`)
                }
              >
                Add Supervisor
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPageSupervisors.map((supervisor) => (
              <SupervisorCard key={supervisor._id} supervisor={supervisor} />
            ))}
          </div>

          {filteredAndSearchedSupervisors.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              No supervisors found matching your search criteria.
            </div>
          ) : (
            <div className="flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`px-4 py-2 rounded ${
                      currentPage === page
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
