// "use client";

// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Clock,
//   User,
//   FileText,
//   ChevronRight,
//   ChevronLeft,
//   ChevronFirst,
//   ChevronLast,
// } from "lucide-react";
// import RightSidebar from "@/components/RightSidebar";
// import allPatients from "@/constants/patients";
// import Link from "next/link";
// import { useLanguage } from "@/context/LanguageContext";
// import { useParams } from "next/navigation";
// import { GET_ALL_PAT_ROUTE } from "@/utils/constants";

// const StudentPatients = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const { currentLang } = useLanguage();
//   const { role } = useParams();
//   const patientsPerPage = 6;

//   // Pagination calculations
//   const totalPages = Math.ceil(allPatients.length / patientsPerPage);
//   const indexOfLastPatient = currentPage * patientsPerPage;
//   const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
//   const currentPatients = allPatients.slice(
//     indexOfFirstPatient,
//     indexOfLastPatient
//   );

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   useEffect(() => {
//     const fetchAllPatients = async () => {
//       try {
//         const response = await fetch(GET_ALL_PAT_ROUTE, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         });
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         if (response.ok) {
//           const result = await response.json();
//           console.log(result);
//         }
//       } catch (error) {
//         console.error("Error fetching patients", error);
//       }
//     };

//     fetchAllPatients();
//   }, []);
//   return (
//     <>
//       {/* Main Content Area */}
//       <div className="flex-1 overflow-y-scroll px-6">
//         <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
//           <div>
//             <h1 className="text-2xl font-bold">Patients Overview</h1>
//             <p className="text-slate-500 text-sm">
//               Manage and monitor patient progress
//             </p>
//           </div>
//           <div className="flex items-center gap-4">
//             <Badge variant="secondary" className="text-lg">
//               Total Patients: {allPatients.length}
//             </Badge>
//             <Button variant="outline">Filter</Button>
//             <Link href={`/${currentLang}/${role}/patients/add-patient`}>
//               <Button className="bg-black">Add Patient</Button>
//             </Link>
//           </div>
//         </div>

//         {/* Patient Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//           {currentPatients.map((patient) => (
//             <Card
//               key={patient.id}
//               className="w-full hover:shadow-md transition-shadow"
//             >
//               <CardHeader className="bg-slate-50 border-b">
//                 <CardTitle className="flex justify-between items-center">
//                   {patient.name}
//                   <Badge variant="outline">{patient.age} years</Badge>
//                 </CardTitle>
//                 <CardDescription>
//                   <div className="flex items-center gap-2">
//                     <Clock className="w-4 h-4" />
//                     Admitted: {patient.admissionDate}
//                   </div>
//                 </CardDescription>
//               </CardHeader>

//               <CardContent className="pt-6">
//                 <div className="space-y-4">
//                   {/* Diagnosis */}
//                   <div className="bg-slate-50 p-3 rounded-lg">
//                     <p className="font-semibold text-sm text-slate-600">
//                       Diagnosis:
//                     </p>
//                     <p className="mt-1">{patient.diagnosis}</p>
//                   </div>

//                   {/* Assigned Therapists */}
//                   <div>
//                     <div className="flex items-center gap-2 mb-2">
//                       <User className="w-4 h-4" />
//                       <h3 className="font-semibold text-sm">
//                         Assigned Therapists ({patient.therapists.length})
//                       </h3>
//                     </div>
//                     <ScrollArea className="h-24 rounded-md border">
//                       {patient.therapists.map((therapist) => (
//                         <div
//                           key={therapist.id}
//                           className="flex justify-between items-center p-2 hover:bg-slate-50"
//                         >
//                           <span className="text-sm">{therapist.name}</span>
//                           <Badge variant="outline" className="text-xs">
//                             {therapist.role}
//                           </Badge>
//                         </div>
//                       ))}
//                     </ScrollArea>
//                   </div>

//                   {/* Timeline */}
//                   <div>
//                     <h3 className="font-semibold text-sm mb-2">
//                       Recent Timeline
//                     </h3>
//                     <ScrollArea className="h-32">
//                       {patient.timeline.map((event, index) => (
//                         <div
//                           key={index}
//                           className="border-l-2 border-slate-200 pl-4 pb-4 relative"
//                         >
//                           <div className="absolute w-2 h-2 bg-slate-400 rounded-full -left-1 top-2" />
//                           <p className="text-sm text-slate-500">{event.date}</p>
//                           <p className="text-sm">{event.event}</p>
//                         </div>
//                       ))}
//                     </ScrollArea>
//                   </div>
//                 </div>
//               </CardContent>

//               <CardFooter className="flex justify-between border-t pt-4">
//                 <Button variant="outline" className="flex items-center gap-2">
//                   <FileText className="w-4 h-4" />
//                   Latest Report
//                 </Button>
//                 <Button className="flex items-center gap-2">
//                   View All Reports
//                   <ChevronRight className="w-4 h-4" />
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>

//         {/* Pagination Controls */}
//         <div className="flex justify-center items-center gap-2 p-4 rounded-lg">
//           <Button
//             variant="outline"
//             onClick={() => handlePageChange(1)}
//             disabled={currentPage === 1}
//           >
//             <ChevronFirst className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </Button>

//           <div className="flex items-center gap-2">
//             {[...Array(totalPages)].map((_, index) => (
//               <Button
//                 key={index + 1}
//                 variant={currentPage === index + 1 ? "default" : "outline"}
//                 onClick={() => handlePageChange(index + 1)}
//                 className="w-10 h-10"
//               >
//                 {index + 1}
//               </Button>
//             ))}
//           </div>

//           <Button
//             variant="outline"
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             onClick={() => handlePageChange(totalPages)}
//             disabled={currentPage === totalPages}
//           >
//             <ChevronLast className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* Right Sidebar */}
//       {/* <RightSidebar
//         isOpen={sidebarOpen}
//         onToggle={() => setSidebarOpen(!sidebarOpen)}
//       /> */}
//     </>
//   );
// };

// export default StudentPatients;

// "use client";

// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Clock,
//   User,
//   FileText,
//   ChevronRight,
//   ChevronLeft,
//   ChevronFirst,
//   ChevronLast,
// } from "lucide-react";
// import Link from "next/link";
// import { useLanguage } from "@/context/LanguageContext";
// import { useParams } from "next/navigation";
// import { GET_ALL_PAT_ROUTE } from "@/utils/constants";

// const StudentPatients = () => {
//   const [patients, setPatients] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const { currentLang } = useLanguage();
//   const { role } = useParams();
//   const patientsPerPage = 6;

//   // Pagination calculations
//   const totalPages = Math.ceil(patients.length / patientsPerPage);
//   const indexOfLastPatient = currentPage * patientsPerPage;
//   const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
//   const currentPatients = patients.slice(
//     indexOfFirstPatient,
//     indexOfLastPatient
//   );

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   useEffect(() => {
//     const fetchAllPatients = async () => {
//       try {
//         const response = await fetch(GET_ALL_PAT_ROUTE, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         });
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         if (response.ok) {
//           const result = await response.json();
//           setPatients(result);
//         }
//       } catch (error) {
//         console.error("Error fetching patients", error);
//       }
//     };

//     fetchAllPatients();
//   }, []);

//   return (
//     <>
//       {/* Main Content Area */}
//       <div className="flex-1 overflow-y-scroll px-6">
//         <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
//           <div>
//             <h1 className="text-2xl font-bold">Patients Overview</h1>
//             <p className="text-slate-500 text-sm">
//               Manage and monitor patient progress
//             </p>
//           </div>
//           <div className="flex items-center gap-4">
//             <Badge variant="secondary" className="text-lg">
//               Total Patients: {patients.length}
//             </Badge>
//             <Button variant="outline">Filter</Button>
//             <Link href={`/${currentLang}/${role}/patients/add-patient`}>
//               <Button className="bg-black">Add Patient</Button>
//             </Link>
//           </div>
//         </div>

//         {/* Patient Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//           {currentPatients.map((patient) => (
//             <Card
//               key={patient._id}
//               className="w-full hover:shadow-md transition-shadow"
//             >
//               <CardHeader className="bg-slate-50 border-b">
//                 <CardTitle className="flex justify-between items-center">
//                   {patient.name}
//                   <Badge variant="outline">{patient.age} years</Badge>
//                 </CardTitle>
//                 <CardDescription>
//                   <div className="flex items-center gap-2">
//                     <Clock className="w-4 h-4" />
//                     Assigned:{" "}
//                     {new Date(patient.date_of_assignment).toLocaleDateString()}
//                   </div>
//                 </CardDescription>
//               </CardHeader>

//               <CardContent className="pt-6">
//                 <div className="space-y-4">
//                   {/* Patient Details */}
//                   <div className="bg-slate-50 p-3 rounded-lg">
//                     <div className="grid grid-cols-2 gap-2">
//                       <div>
//                         <p className="font-semibold text-sm text-slate-600">
//                           Sex:
//                         </p>
//                         <p>{patient.sex}</p>
//                       </div>
//                       <div>
//                         <p className="font-semibold text-sm text-slate-600">
//                           Languages:
//                         </p>
//                         <p>
//                           {patient.preferred_language1},{" "}
//                           {patient.preferred_language2},{""}
//                           {patient.preferred_language3}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Assigned Therapists */}
//                   <div>
//                     <div className="flex items-center gap-2 mb-2">
//                       <User className="w-4 h-4" />
//                       <h3 className="font-semibold text-sm">
//                         Assigned Therapists
//                       </h3>
//                     </div>
//                     <div className="border rounded-md p-3 text-sm">
//                       {patient.medical_details.student_therapist_id.length > 0
//                         ? patient.medical_details.student_therapist_id.map(
//                             (therapist) => (
//                               <div key={therapist}>{therapist}</div>
//                             )
//                           )
//                         : "No therapists assigned"}
//                     </div>
//                   </div>

//                   {/* Patient Issue */}
//                   <div>
//                     <h3 className="font-semibold text-sm mb-2">
//                       Patient Issue
//                     </h3>
//                     <p className="text-sm line-clamp-3">
//                       {patient.patient_issue}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>

//               <CardFooter className="flex justify-between border-t pt-4">
//                 <Button variant="outline" className="flex items-center gap-2">
//                   <FileText className="w-4 h-4" />
//                   Patient Details
//                 </Button>
//                 <Button className="flex items-center gap-2">
//                   View Full Profile
//                   <ChevronRight className="w-4 h-4" />
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>

//         {/* Pagination Controls */}
//         <div className="flex justify-center items-center gap-2 p-4 rounded-lg">
//           <Button
//             variant="outline"
//             onClick={() => handlePageChange(1)}
//             disabled={currentPage === 1}
//           >
//             <ChevronFirst className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </Button>

//           <div className="flex items-center gap-2">
//             {[...Array(totalPages)].map((_, index) => (
//               <Button
//                 key={index + 1}
//                 variant={currentPage === index + 1 ? "default" : "outline"}
//                 onClick={() => handlePageChange(index + 1)}
//                 className="w-10 h-10"
//               >
//                 {index + 1}
//               </Button>
//             ))}
//           </div>

//           <Button
//             variant="outline"
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             onClick={() => handlePageChange(totalPages)}
//             disabled={currentPage === totalPages}
//           >
//             <ChevronLast className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default StudentPatients;

"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Eye,
  User,
  FileText,
  ChevronRight,
  ChevronLeft,
  ChevronFirst,
  ChevronLast,
  MapPin,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useParams } from "next/navigation";
import { GET_ALL_PAT_ROUTE } from "@/utils/constants";

const PatientDetailView = ({ patient, isOpen, onClose }) => {
  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {patient.name} - Detailed Profile
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <User className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="font-semibold">Name</p>
                  <p>{patient.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="font-semibold">Age</p>
                  <p>{patient.age} years</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <User className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="font-semibold">Sex</p>
                  <p>{patient.sex}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="font-semibold">Contact Number</p>
                  <p>{patient.phone_no}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p>{patient.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle>Address Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="font-semibold">Address Line 1</p>
                  <p>{patient.address_details.address_line1}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="font-semibold">Address Line 2</p>
                  <p>{patient.address_details.address_line2}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="font-semibold">City</p>
                  <p>{patient.address_details.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="font-semibold">State</p>
                  <p>{patient.address_details.state}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="font-semibold">Postal Code</p>
                  <p>{patient.address_details.postal_code}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language and Medical Details */}
          <Card>
            <CardHeader>
              <CardTitle>Language Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold">Preferred Languages</p>
                <ul className="list-disc pl-5">
                  <li>{patient.preferred_language1}</li>
                  <li>{patient.preferred_language2}</li>
                  <li>{patient.preferred_language3}</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">Multilingual Factors</p>
                <p>{patient.medical_details.multilingual_factors}</p>
              </div>
            </CardContent>
          </Card>

          {/* Patient Issue and Medical Details */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold">Patient Issue</p>
                <p>{patient.patient_issue}</p>
              </div>
              <div>
                <p className="font-semibold">Diagnostic Formulation</p>
                <p>{patient.medical_details.diagnostic_formulation}</p>
              </div>
              <div>
                <p className="font-semibold">Clinical Impression</p>
                <p>{patient.medical_details.clinical_impression}</p>
              </div>
              <div>
                <p className="font-semibold">Recommendations</p>
                <p>{patient.medical_details.recommendations}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StudentPatients = () => {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { currentLang } = useLanguage();
  const patientsPerPage = 6;
  const navigate = useRouter();
  const pathname = usePathname();
  const { lang, role } = useParams();

  // Pagination calculations
  const totalPages = Math.ceil(patients.length / patientsPerPage);
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleProfile = (patient) => {
    navigate.push(`/${lang}/${role}/patients/${patient?.patient_id}`);
  };

  useEffect(() => {
    const fetchAllPatients = async () => {
      try {
        const response = await fetch(GET_ALL_PAT_ROUTE, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (response.ok) {
          const result = await response.json();
          setPatients(result);
        }
      } catch (error) {
        console.error("Error fetching patients", error);
      }
    };

    fetchAllPatients();
  }, []);

  return (
    <>
      <PatientDetailView
        patient={selectedPatient}
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
      <div className="flex-1 overflow-y-scroll px-6">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div>
            <h1 className="text-2xl font-bold">Patients Overview</h1>
            <p className="text-slate-500 text-sm">
              Manage and monitor patient progress
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg">
              Total Patients: {patients.length}
            </Badge>
            <Button variant="outline">Filter</Button>
            <Link href={`/${currentLang}/${role}/patients/add-patient`}>
              <Button className="bg-black">Add Patient</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {currentPatients.map((patient) => (
            <Card
              key={patient._id}
              className="w-full hover:shadow-md transition-shadow"
            >
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="flex justify-between items-center">
                  {patient.name}
                  <Badge variant="outline">{patient.age} years</Badge>
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Assigned:{" "}
                    {new Date(patient.date_of_assignment).toLocaleDateString()}
                  </div>
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Patient Details */}
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-semibold text-sm text-slate-600">
                          Sex:
                        </p>
                        <p>{patient.sex}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-600">
                          Languages:
                        </p>
                        <p>
                          {patient.preferred_language1},{" "}
                          {patient.preferred_language2},{""}
                          {patient.preferred_language3}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Assigned Therapists */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      <h3 className="font-semibold text-sm">
                        Assigned Therapists
                      </h3>
                    </div>
                    <div className="border rounded-md p-3 text-sm">
                      {patient.medical_details.student_therapist_id.length > 0
                        ? patient.medical_details.student_therapist_id.map(
                            (therapist) => (
                              <div key={therapist}>{therapist}</div>
                            )
                          )
                        : "No therapists assigned"}
                    </div>
                  </div>

                  {/* Patient Issue */}
                  <div>
                    <h3 className="font-semibold text-sm mb-2">
                      Patient Issue
                    </h3>
                    <p className="text-sm line-clamp-3">
                      {patient.patient_issue}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between border-t pt-4">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <Eye className="w-4 h-4" />
                  Full Details
                </Button>
                <Button
                  className="flex items-center gap-2"
                  onClick={() => handleProfile(patient)}
                >
                  View Profile
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 p-4 rounded-lg">
          <Button
            variant="outline"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronFirst className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 " />
          </Button>

          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index + 1}
                variant={currentPage === index + 1 ? "default" : "outline"}
                onClick={() => handlePageChange(index + 1)}
                className="w-10 h-10"
              >
                {index + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronLast className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default StudentPatients;
