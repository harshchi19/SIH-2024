"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { User, Calendar, Phone, Mail, MapPin } from "lucide-react";
import { useById } from "@/hooks/useById";
import { useGetRole } from "@/hooks/useGetRole";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GET_PAT_BY_ID_ROUTE } from "@/utils/constants.js";

const PatientDetailView = ({
  patient,
  isOpen = true,
  onClose = () => {},
  isFullScreen = true,
}) => {
  //   if (!patient) return null;
  const { id } = useParams();
  const { getById } = useById();
  console.log("PARAMS: ", id);
  const [patientData, setPatientData] = useState([]);

  useEffect(() => {
    console.log("Inside useEffect, id:", id);
    const getPatById = async () => {
      try {
        const response = await fetch(`${GET_PAT_BY_ID_ROUTE}/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (response.ok) {
          const result = await response.json();
          console.log("Rsult:", result);
          //   setPatients(result);
        }
      } catch (error) {
        console.log("Error fetching patients", error);
      }
    };
    // if (id) {
    getPatById();

    // }
  }, []);
  const DetailCard = ({ title, children }) => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );

  const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4">
      <Icon className="w-5 h-5 text-slate-600" />
      <div>
        <p className="font-semibold">{label}</p>
        <p>{value}</p>
      </div>
    </div>
  );

  const content = (
    <div
      className={`${
        isFullScreen ? "h-full w-full p-8" : ""
      } grid md:grid-cols-2 gap-6 overflow-y-auto`}
    >
      {/* Personal Information */}
      <DetailCard title="Personal Information">
        <DetailItem icon={User} label="Name" value={patientData?.name} />
        <DetailItem
          icon={Calendar}
          label="Age"
          value={`${patientData?.age} years`}
        />
        <DetailItem icon={User} label="Sex" value={patientData?.sex} />
        <DetailItem
          icon={Phone}
          label="Contact Number"
          value={patientData?.phone_no}
        />
        <DetailItem icon={Mail} label="Email" value={patientData?.email} />
      </DetailCard>

      {/* Address Information */}
      <DetailCard title="Address Details">
        <DetailItem
          icon={MapPin}
          label="Address Line 1"
          value={patientData?.address_details?.address_line1}
        />
        <DetailItem
          icon={MapPin}
          label="Address Line 2"
          value={patientData?.address_details?.address_line2}
        />
        <DetailItem
          icon={MapPin}
          label="City"
          value={patientData?.address_details?.city}
        />
        <DetailItem
          icon={MapPin}
          label="State"
          value={patientData?.address_details?.state}
        />
        <DetailItem
          icon={MapPin}
          label="Postal Code"
          value={patientData?.address_details?.postal_code}
        />
      </DetailCard>
      {/* Language Details */}
      <DetailCard title="Language Details">
        <div>
          <p className="font-semibold">Preferred Languages</p>
          <ul className="list-disc pl-5">
            <li>{patientData?.preferred_language1}</li>
            <li>{patientData?.preferred_language2}</li>
            <li>{patientData?.preferred_language3}</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Multilingual Factors</p>
          <p>{patientData?.medical_details?.multilingual_factors}</p>
        </div>
      </DetailCard>
      {/* Medical Information */}
      <DetailCard title="Medical Information">
        <div>
          <p className="font-semibold">Patient Issue</p>
          <p>{patientData?.patient_issue}</p>
        </div>
        <div>
          <p className="font-semibold">Diagnostic Formulation</p>
          <p>{patientData?.medical_details?.diagnostic_formulation}</p>
        </div>
        <div>
          <p className="font-semibold">Clinical Impression</p>
          <p>{patientData?.medical_details?.clinical_impression}</p>
        </div>
        <div>
          <p className="font-semibold">Recommendations</p>
          <p>{patientData?.medical_details?.recommendations}</p>
        </div>
      </DetailCard>
    </div>
  );

  // If it's a full-screen view, render directly
  if (isFullScreen) {
    return content;
  }

  // If it's a modal view
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">
            {patientData?.name} - Detailed Profile
          </h2>
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailView;
