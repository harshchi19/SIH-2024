import { useLanguage } from "@/context/LanguageContext";
import React from "react";

const RangeSelector = ({ selected, setSelected }) => {
  const { dict } = useLanguage();

  const handleChange = (value) => {
    setSelected(value);
  };

  const getBorderClass = (value) => {
    if (value === selected) return "border-4";
    return "border-2";
  };

  const getBackgroundColor = (value) => {
    switch (value) {
      case "veryPoor":
        return "bg-red-700";
      case "poor":
        return "bg-red-400";
      case "adequate":
        return "bg-yellow-400";
      case "good":
        return "bg-green-300";
      case "veryGood":
        return "bg-green-700";
      default:
        return "bg-gray-200";
    }
  };

  const getEmojiColor = (value) => {
    return value === selected ? "text-white" : "text-black";
  };

  return (
    <div className="flex items-center justify-between w-full space-x-6">
      {[
        {
          label: dict?.addPatient?.very_poor,
          value: "veryPoor",
          borderClass: "border-red-700",
          emoji: "😞",
        },
        {
          label: dict?.addPatient?.poor,
          value: "poor",
          borderClass: "border-red-400",
          emoji: "😔",
        },
        {
          label: dict?.addPatient?.adequate,
          value: "adequate",
          borderClass: "border-yellow-400",
          emoji: "😐",
        },
        {
          label: dict?.addPatient?.good,
          value: "good",
          borderClass: "border-green-300",
          emoji: "😊",
        },
        {
          label: dict?.addPatient?.very_good,
          value: "veryGood",
          borderClass: "border-green-700",
          emoji: "😁",
        },
      ].map((range) => (
        <div
          key={range.value}
          className="w-full flex flex-col items-center cursor-pointer mt-4"
          onClick={() => handleChange(range.value)}
        >
          <div
            className={`h-20 w-20 rounded-full flex items-center justify-center ${
              range.borderClass
            } ${getBorderClass(range.value)} ${
              selected === range.value && getBackgroundColor(range.value)
            } hover:opacity-80 transition`}
          >
            <span className={`text-3xl ${getEmojiColor(range.value)}`}>
              {range.emoji}
            </span>
          </div>
          <h1
            className={`text-sm mt-2 ${
              selected === range.value
                ? "font-semibold text-gray-800"
                : "text-gray-500"
            }`}
          >
            {range.label}
          </h1>
        </div>
      ))}
    </div>
  );
};

export default RangeSelector;
