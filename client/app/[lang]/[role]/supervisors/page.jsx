// "use client";
// import React, { useState, useMemo, useEffect } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import SupervisorCard from "@/components/supervisor/SupervisorCard";
// import { Input } from "@/components/ui/input";
// import { SearchIcon } from "lucide-react";
// import { useGetRole } from "@/hooks/useGetRole";

// // Supervisors Dashboard Component
// export default function SupervisorsDashboard() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterDepartment, setFilterDepartment] = useState("All Departments");
//   const [supervisors, setSupervisors] = useState([]);
//   const [isLoading, setIsLoading] = useState(true); // Loading state

//   const { getAll } = useGetRole();

//   // Fetch supervisors data
//   const fetchUser = async () => {
//     try {
//       setIsLoading(true); // Start loading
//       const { success, users } = await getAll("SUP");
//       if (success) {
//         setSupervisors(users);
//       }
//     } catch (error) {
//       console.error("Error fetching supervisors:", error);
//     } finally {
//       setIsLoading(false); // Stop loading
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []); // No dependencies other than initial load

//   // Get unique departments for filter
//   const departments = [
//     "All Departments",
//     ...new Set(supervisors.map((sup) => sup.department)),
//   ];

//   // Filtered Supervisors
//   const filteredSupervisors = useMemo(() => {
//     return supervisors.filter((supervisor) => {
//       const matchesSearchTerm =
//         searchTerm === "" ||
//         supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         supervisor.department.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesDepartment =
//         filterDepartment === "All Departments" ||
//         supervisor.department === filterDepartment;

//       return matchesSearchTerm && matchesDepartment;
//     });
//   }, [searchTerm, filterDepartment, supervisors]);

//   return (
//     <div className="container mx-auto px-4 py-8 space-y-6">
//       {/* Loading State */}
//       {isLoading ? (
//         <div className="text-center py-10">Loading supervisors...</div>
//       ) : (
//         <>
//           {/* Search and Filter */}
//           <div className="flex flex-col justify-between md:flex-row mb-6">
//             <div>Overview of our training therapists and their progress</div>
//             <div className="relative flex gap-4">
//               <div>
//                 <SearchIcon
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
//                   size={20}
//                 />
//                 <Input
//                   placeholder="Search supervisors..."
//                   className="pl-10"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>

//               {/* Department Filter */}
//               <Select
//                 value={filterDepartment}
//                 onValueChange={setFilterDepartment}
//               >
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Filter Department">
//                     {filterDepartment || "All Departments"}
//                   </SelectValue>
//                 </SelectTrigger>
//                 <SelectContent>
//                   {departments.map((dept) => (
//                     <SelectItem key={dept} value={dept}>
//                       {dept}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Supervisors Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredSupervisors.map((supervisor) => (
//               <SupervisorCard key={supervisor._id} supervisor={supervisor} />
//             ))}
//           </div>

//           {/* No Results State */}
//           {filteredSupervisors.length === 0 && (
//             <div className="text-center text-muted-foreground py-10">
//               No supervisors found matching your search criteria.
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// "use client";
// import React, { useState, useMemo, useEffect } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import SupervisorCard from "@/components/supervisor/SupervisorCard";
// import { Input } from "@/components/ui/input";
// import { SearchIcon } from "lucide-react";
// import { useGetRole } from "@/hooks/useGetRole";

// const ITEMS_PER_PAGE = 6;

// export default function SupervisorsDashboard() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterDepartment, setFilterDepartment] = useState("All Departments");
//   const [supervisors, setSupervisors] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);

//   const { getAll } = useGetRole();

//   const fetchUser = async () => {
//     try {
//       setIsLoading(true);
//       const { success, users } = await getAll("SUP");
//       if (success) {
//         setSupervisors(users);
//       }
//     } catch (error) {
//       console.error("Error fetching supervisors:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const departments = [
//     "All Departments",
//     ...new Set(supervisors.map((sup) => sup.department)),
//   ];

//   const filteredSupervisors = useMemo(() => {
//     return supervisors.filter((supervisor) => {
//       const matchesSearchTerm =
//         searchTerm === "" ||
//         supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         supervisor.department.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesDepartment =
//         filterDepartment === "All Departments" ||
//         supervisor.department === filterDepartment;

//       return matchesSearchTerm && matchesDepartment;
//     });
//   }, [searchTerm, filterDepartment, supervisors]);

//   const totalPages = Math.ceil(filteredSupervisors.length / ITEMS_PER_PAGE);
//   const currentPageSupervisors = filteredSupervisors.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   return (
//     <div className="container mx-auto px-4 py-8 space-y-6">
//       {isLoading ? (
//         <div className="text-center py-10">Loading supervisors...</div>
//       ) : (
//         <>
//           <div className="flex flex-col justify-between md:flex-row mb-6">
//             <div>Overview of our training therapists and their progress</div>
//             <div className="relative flex gap-4">
//               <div>
//                 <SearchIcon
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
//                   size={20}
//                 />
//                 <Input
//                   placeholder="Search supervisors..."
//                   className="pl-10"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//               <Select
//                 value={filterDepartment}
//                 onValueChange={setFilterDepartment}
//               >
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Filter Department">
//                     {filterDepartment || "All Departments"}
//                   </SelectValue>
//                 </SelectTrigger>
//                 <SelectContent>
//                   {departments.map((dept) => (
//                     <SelectItem key={dept} value={dept}>
//                       {dept}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {currentPageSupervisors.map((supervisor) => (
//               <SupervisorCard key={supervisor._id} supervisor={supervisor} />
//             ))}
//           </div>

//           {filteredSupervisors.length === 0 && (
//             <div className="text-center text-muted-foreground py-10">
//               No supervisors found matching your search criteria.
//             </div>
//           )}

//           {totalPages > 1 && (
//             <div className="flex justify-center space-x-2">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (page) => (
//                   <button
//                     key={page}
//                     className={`px-4 py-2 rounded ${
//                       currentPage === page
//                         ? "bg-black text-white"
//                         : "bg-gray-200 text-gray-600"
//                     }`}
//                     onClick={() => setCurrentPage(page)}
//                   >
//                     {page}
//                   </button>
//                 )
//               )}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

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

const ITEMS_PER_PAGE = 6;

export default function SupervisorsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All Departments");
  const [supervisors, setSupervisors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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
  }, []);

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
      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-10">Loading supervisors...</div>
      ) : (
        <>
          <div className="flex flex-col justify-between md:flex-row mb-6">
            <div>Overview of our training therapists and their progress</div>
            <div className="relative flex gap-4">
              <div>
                <SearchIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <Input
                  placeholder="Search supervisors..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
