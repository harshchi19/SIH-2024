import React, { useState } from "react";
import { Info as InfoIcon } from "lucide-react";

const Info = ({ info }) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      <InfoIcon className="text-red-700 cursor-pointer h-4 w-4 ml-1" />

      {showInfo && (
        <div
          className="absolute min-w-60 max-w-96 -top-3 z-10 p-2 text-sm text-black rounded-md shadow-md"
          style={{
            left: showInfo ? "100%" : "auto",
            right: !showInfo ? "100%" : "auto",
            transform: "translateX(10px)",
          }}
        >
          {info}
        </div>
      )}
    </div>
  );
};

export default Info;
