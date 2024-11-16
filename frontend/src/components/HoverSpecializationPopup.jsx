import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// eslint-disable-next-line react/prop-types
const HoverSpecializationPopup = ({ name, specialization }) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-lg font-medium cursor-pointer hover:text-black transition-colors">
            {name}
          </span>
        </TooltipTrigger>
        <TooltipContent
          className="bg-white border shadow-lg rounded-lg animate-in fade-in-0 zoom-in-95"
          sideOffset={5}
        >
          <div className="">
            <p className="text-sm text-gray-600">{specialization}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HoverSpecializationPopup;
