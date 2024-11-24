"use client";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useLanguage } from "@/context/LanguageContext";

const AddressDetails = ({ data, updateData }) => {
  const { dict } = useLanguage();

  const handleChange = (e, id, value) => {
    if (e?.target) {
      const { id: eventId, value: eventValue } = e.target;
      updateData(eventId, eventValue);
    } else if (id && value !== undefined) {
      updateData(id, value);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <h1 className="text-xl font-semibold">2. {dict?.addPatient?.address}</h1>
      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label htmlFor="address_line1" className="text-gray-700 text-md">
            {dict?.addPatient?.address_line1}
          </Label>
          <Input
            type="text"
            id="address_line1"
            value={data.address_line1}
            placeholder={dict?.addPatient?.address_line1_plchldr}
            onChange={handleChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label htmlFor="address_line2" className="text-gray-700 text-md">
            {dict?.addPatient?.address_line2}
          </Label>
          <Input
            type="text"
            id="address_line2"
            value={data.address_line2}
            placeholder={dict?.addPatient?.address_line2_plchldr}
            onChange={handleChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label htmlFor="city" className="text-gray-700 text-md">
            {dict?.addPatient?.city}
          </Label>
          <Input
            type="text"
            id="city"
            value={data.city}
            placeholder={dict?.addPatient?.city_plchldr}
            onChange={handleChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>

        <div className="space-y-1 w-full">
          <Label htmlFor="state" className="text-gray-700 text-md">
            {dict?.addPatient?.state}
          </Label>
          <Input
            type="text"
            id="state"
            value={data.state}
            placeholder={dict?.addPatient?.state_plchldr}
            onChange={handleChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label htmlFor="postal_code" className="text-gray-700 text-md">
            {dict?.addPatient?.postal_code}
          </Label>
          <Input
            type="text"
            id="postal_code"
            value={data.postal_code}
            placeholder={dict?.addPatient?.postal_code_plchldr}
            onChange={handleChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>

        <div className="space-y-1 w-full">
          <Label htmlFor="country" className="text-gray-700 text-md">
            {dict?.addPatient?.country}
          </Label>
          <Input
            type="text"
            id="country"
            value={data.country}
            placeholder={dict?.addPatient?.country_plchldr}
            onChange={handleChange}
            className="border-gray-200 w-full h-12 text-md"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressDetails;
