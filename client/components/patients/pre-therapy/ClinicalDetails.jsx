import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";
import Info from "@/components/Info";

const ClinicalDetails = ({ data, updateData }) => {
  const { dict } = useLanguage();

  const handleInputChange = (e, id, value) => {
    if (e?.target) {
      const { id: eventId, value: eventValue } = e.target;
      updateData(eventId, eventValue);
    } else if (id && value !== undefined) {
      updateData(id, value);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <h1 className="text-xl font-semibold">
        2. {dict?.pre_therapy?.clinical}
      </h1>

      <div className="w-full gap-x-5 max-md:gap-y-5 mt-5">
        <div className="space-y-1 w-full">
          <Label
            htmlFor="opme"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.pre_therapy?.opme}
            <Info info={dict?.pre_therapy?.opme} />
          </Label>
          <Textarea
            id="opme"
            value={data.opme}
            placeholder={dict?.pre_therapy?.gen_plchldr}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-1 w-full mt-5">
          <Label
            htmlFor="reception"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.pre_therapy?.reception}
          </Label>
          <Textarea
            id="reception"
            value={data.reception}
            placeholder={dict?.pre_therapy?.gen_plchldr}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-1 w-full mt-5">
          <Label
            htmlFor="expression"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.pre_therapy?.expression}
          </Label>
          <Textarea
            id="expression"
            value={data.expression}
            placeholder={dict?.pre_therapy?.gen_plchldr}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-1 w-full mt-5">
          <Label
            htmlFor="pragmatics"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.pre_therapy?.pragmatics}
          </Label>
          <Textarea
            id="pragmatics"
            value={data.pragmatics}
            placeholder={dict?.pre_therapy?.gen_plchldr}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-1 w-full mt-5">
          <Label
            htmlFor="attention"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.pre_therapy?.attention}
          </Label>
          <Textarea
            id="attention"
            value={data.attention}
            placeholder={dict?.pre_therapy?.gen_plchldr}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-1 w-full mt-5">
          <Label
            htmlFor="auditory_skill"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.pre_therapy?.auditory_skill}
          </Label>
          <Textarea
            id="auditory_skill"
            value={data.auditory_skill}
            placeholder={dict?.pre_therapy?.gen_plchldr}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-1 w-full mt-5">
          <Label
            htmlFor="play_behavior"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.pre_therapy?.play_behavior}
          </Label>
          <Textarea
            id="play_behavior"
            value={data.play_behavior}
            placeholder={dict?.pre_therapy?.gen_plchldr}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-1 w-full mt-5">
          <Label
            htmlFor="general_behavior"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.pre_therapy?.general_behavior}
          </Label>
          <Textarea
            id="general_behavior"
            value={data.general_behavior}
            placeholder={dict?.pre_therapy?.gen_plchldr}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-1 w-full mt-5">
          <Label
            htmlFor="formal_testing"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.pre_therapy?.formal_testing}
          </Label>
          <Textarea
            id="formal_testing"
            value={data.formal_testing}
            placeholder={dict?.pre_therapy?.gen_plchldr}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-1 w-full mt-5">
          <Label
            htmlFor="clinical_impression"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.pre_therapy?.clinical_impression}
          </Label>
          <Textarea
            id="clinical_impression"
            value={data.clinical_impression}
            placeholder={dict?.pre_therapy?.gen_plchldr}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-1 w-full mt-5">
          <Label
            htmlFor="additional_notes"
            className="text-gray-700 text-md flex items-center"
          >
            {dict?.pre_therapy?.additional_notes}
          </Label>
          <Textarea
            id="additional_notes"
            value={data.additional_notes}
            placeholder={dict?.pre_therapy?.gen_plchldr}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ClinicalDetails;
