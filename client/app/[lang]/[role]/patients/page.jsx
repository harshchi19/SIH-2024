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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  Stethoscope,
  Ban,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useParams } from "next/navigation";
import {
  GET_ALL_PAT_ROUTE,
  GET_STT_BY_OBJECT_ID_ROUTE,
  TERMINATION_ROUTE,
  TRANSFER_ROUTE,
} from "@/utils/constants";
import { studentTherapistData } from "@/constants/mockData";

const PatientDetailView = ({ patient, isOpen, onClose }) => {
  if (!patient) return null;
  const userType = localStorage.getItem("userType");

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

const TerminationModal = ({ isOpen, onClose, patient, onConfirm }) => {
  const [terminationReason, setTerminationReason] = useState("");

  const handleConfirm = () => {
    if (terminationReason.trim() === "") {
      alert("Please provide a reason for termination.");
      return;
    }
    onConfirm(patient, terminationReason);
    setTerminationReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terminate Patient</DialogTitle>
          <DialogDescription>
            Are you sure you want to terminate <strong>{patient?.name}</strong>?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium">
              Patient Name
            </label>
            <Input id="patientName" value={patient?.name} readOnly />
          </div>
          <div>
            <label htmlFor="caseNo" className="block text-sm font-medium">
              Case No.
            </label>
            <Input id="caseNo" value={patient?.case_no} readOnly />
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium">
              Reason for Termination
            </label>
            <Textarea
              id="reason"
              placeholder="Enter the reason for termination..."
              value={terminationReason}
              onChange={(e) => setTerminationReason(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const TransferModal = ({ isOpen, onClose, patient, onConfirm }) => {
  const [transferReason, setTransferReason] = useState("");

  const handleConfirm = () => {
    if (transferReason.trim() === "") {
      alert("Please provide a reason for termination.");
      return;
    }
    onConfirm(patient, transferReason);
    setTransferReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Patient</DialogTitle>
          <DialogDescription>
            Are you sure you want to transfer <strong>{patient?.name}</strong>?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium">
              Patient Name
            </label>
            <Input id="patientName" value={patient?.name} readOnly />
          </div>
          <div>
            <label htmlFor="caseNo" className="block text-sm font-medium">
              Case No.
            </label>
            <Input id="caseNo" value={patient?.case_no} readOnly />
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium">
              Reason for Transfer
            </label>
            <Textarea
              id="reason"
              placeholder="Enter the reason for transfer..."
              value={transferReason}
              onChange={(e) => setTransferReason(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const StudentPatients = () => {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [therapistNames, setTherapistNames] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
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

  const fetchTherapistNames = async (therapistIds) => {
    try {
      const promises = therapistIds.map(async (id) => {
        const response = await fetch(`${GET_STT_BY_OBJECT_ID_ROUTE}/${id}`);

        if (response.ok) {
          const result = await response.json();
          console.log(result);
          return { id, name: result.name };
        }
        throw new Error(`Failed to fetch therapist with id ${id}`);
      });

      const resolvedNames = await Promise.all(promises);
      const namesMap = resolvedNames.reduce((acc, curr) => {
        acc[curr.id] = curr.name;
        return acc;
      }, {});

      setTherapistNames((prev) => ({ ...prev, ...namesMap }));
    } catch (error) {
      console.error("Error fetching therapist names", error);
    }
  };

  useEffect(() => {
    const allTherapistIds = patients
      .flatMap((patient) => patient.medical_details.student_therapist_id)
      .filter((id, index, array) => array.indexOf(id) === index);

    fetchTherapistNames(allTherapistIds);
  }, [patients]);

  const handleTerminateClick = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleTransferClick = (patient) => {
    setSelectedPatient(patient);
    setIsTransferModalOpen(true);
  };

  const handleConfirmTermination = async (patient, reason) => {
    const data = {
      patient_id: patient?._id,
      case_no: patient?.case_no,
      reason,
      actionBy: localStorage.getItem("user"),
      actionByUserType: "ADM",
      actionType: "TERMINATED",
    };

    const response = await fetch(TERMINATION_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);
    }
  };

  const handleConfirmTransfer = async (patient, reason) => {
    const data = {
      patient_id: patient?._id,
      case_no: patient?.case_no,
      reason,
      actionBy: localStorage.getItem("user"),
      actionByUserType: "ADM",
      actionType: "TRANSFER",
    };

    const response = await fetch(TRANSFER_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      toast({ title: result.message });
    }
  };

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
              className="w-full hover:shadow-md transition-shadow overflow-hidden"
            >
              <CardHeader
                className={`${
                  patient.patient_status === "TERMINATED"
                    ? "bg-red-200"
                    : "bg-slate-50"
                } border-b flex items-center gap-x-4`}
              >
                <CardTitle className="flex justify-between items-center gap-x-2">
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
                    <div className="border rounded-md p-3 text-sm flex gap-x-2">
                      <Stethoscope className="h-5 w-auto" />
                      {patient.medical_details.student_therapist_id.length > 0
                        ? patient.medical_details.student_therapist_id.map(
                            (therapist) => (
                              <div key={therapist}>
                                {therapistNames[therapist] || "Loading..."}
                              </div>
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

              <CardFooter className="flex flex-col justify-between border-t pt-4">
                <div className="flex justify-between items-center w-full">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <Eye className="w-4 h-4" />
                    Full Details
                  </Button>
                  <Button
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                    onClick={() => handleProfile(patient)}
                  >
                    View Profile
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex justify-between items-center w-full mt-4 gap-x-3">
                  {patient.patient_status !== "TERMINATED" && (
                    <Button
                      variant="destructive"
                      className="flex items-center gap-2 w-1/2"
                      onClick={() => handleTerminateClick(patient)}
                    >
                      <Ban className="w-4 h-4" />
                      Terminate Patient
                    </Button>
                  )}

                  {patient.patient_status !== "TERMINATED" && (
                    <Button
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 w-1/2"
                      onClick={() => handleTransferClick(patient)}
                    >
                      <Stethoscope className="h-5 w-auto" />
                      Assign New Therapist
                    </Button>
                  )}
                  <TerminationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    patient={selectedPatient}
                    onConfirm={handleConfirmTermination}
                  />

                  <TransferModal
                    isOpen={isTransferModalOpen}
                    onClose={() => setIsTransferModalOpen(false)}
                    patient={selectedPatient}
                    onConfirm={handleConfirmTransfer}
                  />
                </div>
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
