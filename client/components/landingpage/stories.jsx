"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Hospital,
  Syringe,
  VolumeUp,
  BookOpen,
  VolumeDown,
  Users,
  CircleX,
} from "lucide-react";
import { story_1_1, story_1_2, story_1_3, story_1_4 } from "@/assets";
import Image from "next/image";

const SpeechTherapyCards = () => {
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedSlide, setSelectedSlide] = useState(0);

  const cards = [
    {
      icon: <Hospital size={24} className="mx-auto" />,
      title: "Visiting the Speech Therapist",
      description: [
        {
          text: "Today, I am going to visit my speech therapist. I need to get ready and make sure I have everything I need.",
          illustration: (
            <img
              src={story_1_1}
              alt="Packing a bag"
              className="w-full max-w-[320px] h-auto mx-auto"
            />
          ),
        },
        {
          text: "When I reach the clinic, I will check in at the front desk and wait in the waiting area until my therapist is ready.",
          illustration: (
            <Image
              src={story_1_2}
              alt="Waiting in the clinic"
              className="w-full max-w-[320px] h-auto mx-auto"
            />
          ),
        },
        {
          text: "My therapist will greet me with a smile and take me to the therapy room. They are here to help me with my speech.",
          illustration: (
            <Image
              src={story_1_3}
              alt="Meeting the therapist"
              className="w-full max-w-[320px] h-auto mx-auto"
            />
          ),
        },
        {
          text: `The therapist will explain what we will do today. I can ask questions if I don't understand.`,
          illustration: (
            <Image
              src={story_1_4}
              alt="Starting the session"
              className="w-full max-w-[320px] h-auto mx-auto"
            />
          ),
        },
      ],
    },
    // Add more card data as needed
  ];

  const handleCardClick = (index) => {
    setSelectedStory(index);
    setSelectedSlide(0);
  };

  const handleSlideChange = (direction) => {
    if (direction === "prev" && selectedSlide > 0) {
      setSelectedSlide(selectedSlide - 1);
    } else if (
      direction === "next" &&
      selectedSlide < cards[selectedStory].description.length - 1
    ) {
      setSelectedSlide(selectedSlide + 1);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <Card key={index} onClick={() => handleCardClick(index)}>
          <CardHeader>
            <CardTitle>{card.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                {card.icon}
              </div>
              <p className="text-gray-600 ml-4">{card.description[0].text}</p>
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedStory !== null && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-80 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl relative">
            <button
              className="absolute top-0 left-0 rounded-md hover:bg-gray-300"
              onClick={() => setSelectedStory(null)}
            >
              <CircleX size={20} />
            </button>
            <div className="flex justify-between items-center mb-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => handleSlideChange("prev")}
                disabled={selectedSlide === 0}
              >
                Previous
              </button>
              <h2 className="text-2xl font-bold">
                {cards[selectedStory].title}
              </h2>
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => handleSlideChange("next")}
                disabled={
                  selectedSlide === cards[selectedStory].description.length - 1
                }
              >
                Next
              </button>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-gray-600 font-semibold text-center mb-4">
                {cards[selectedStory].description[selectedSlide].text}
              </p>
              <div>
                {cards[selectedStory].description[selectedSlide].illustration}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechTherapyCards;
