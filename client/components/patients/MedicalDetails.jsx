"use client";

import { Label } from "../ui/label";
import { useLanguage } from "@/context/LanguageContext";
import { Textarea } from "../ui/textarea";
import Info from "../Info";

const MedicalDetails = ({ data, updateData }) => {
  const { dict } = useLanguage();

  const handleChange = (e) => {
    updateData({
      ...data,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="flex flex-col items-start">
      <h1 className="text-xl font-semibold">9. {dict?.addPatient?.medical}</h1>
      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="multilingual_factors"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.multilingual_factors}
            <Info info={dict?.addPatient?.multilingual_factors_info} />
          </Label>
          <Textarea
            id="multilingual_factors"
            value={data.multilingual_factors}
            placeholder={dict?.addPatient?.multilingual_factors_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="details_to_pay_attention"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.details_to_pay_attention}
            <Info info={dict?.addPatient?.details_to_pay_attention_info} />
          </Label>
          <Textarea
            id="details_to_pay_attention"
            value={data.details_to_pay_attention}
            placeholder={dict?.addPatient?.details_to_pay_attention_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="language_evaluation"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.language_evaluation}
            <Info info={dict?.addPatient?.language_evaluation_info} />
          </Label>
          <Textarea
            id="language_evaluation"
            value={data.language_evaluation}
            placeholder={dict?.addPatient?.language_evaluation_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="auditory_skills"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.auditory_skills}
            <Info info={dict?.addPatient?.auditory_skills_info} />
          </Label>
          <Textarea
            id="auditory_skills"
            value={data.auditory_skills}
            placeholder={dict?.addPatient?.auditory_skills_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="formal_testing"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.formal_testing}
            <Info info={dict?.addPatient?.formal_testing_info} />
          </Label>
          <Textarea
            id="formal_testing"
            value={data.formal_testing}
            placeholder={dict?.addPatient?.formal_testing_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="diagnostic_formulation"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.diagnostic_formulation}
            <Info info={dict?.addPatient?.diagnostic_formulation_info} />
          </Label>
          <Textarea
            id="diagnostic_formulation"
            value={data.diagnostic_formulation}
            placeholder={dict?.addPatient?.diagnostic_formulation_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="clinical_impression"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.clinical_impression}
            <Info info={dict?.addPatient?.clinical_impression_info} />
          </Label>
          <Textarea
            id="clinical_impression"
            value={data.clinical_impression}
            placeholder={dict?.addPatient?.clinical_impression_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="recommendations"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.addPatient?.recommendations}
            <Info info={dict?.addPatient?.recommendations_info} />
          </Label>
          <Textarea
            id="recommendations"
            value={data.recommendations}
            placeholder={dict?.addPatient?.recommendations_plchldr}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MedicalDetails;
