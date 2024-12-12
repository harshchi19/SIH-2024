"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Play } from "lucide-react";
import Image from "next/image";
import { roomData } from "@/constants/roomData";
import { useState } from "react";
import { room1, room2, room3 } from "@/assets";
import { useLanguage } from "@/context/LanguageContext";
import Loader from "@/components/Loader";
import Video from "next-video";
import RoomVideo from "@/videos/RoomVideo.mp4";

const GuidePage = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { dict } = useLanguage();

  const roomImages = [room1, room2, room3];

  const getRandomImage = () => {
    return roomImages[Math.floor(Math.random() * roomImages.length)];
  };

  const handleOpenVideo = (videoRoute) => {
    setSelectedVideo(videoRoute);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  if (!dict) {
    return <Loader />;
  }

  return (
    <div className="px-8 overflow-y-scroll">
      {roomData.map((floor) => (
        <div key={floor.floorNo} className="mb-8">
          <h2 className="font-bold items-start">
            <Building2 className="mr-2 h-7 w-auto" />
            <p className="text-2xl">
              {dict?.navigation?.floor} {floor.floorNo}
            </p>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {floor.rooms.map((room) => (
              <Card
                key={room.roomNo}
                className="hover:shadow-lg transition-all duration-300 group h-[210px]"
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center gap-x-2">
                    <div className="flex items-center">
                      <MapPin className="mr-2 text-primary" />
                      {room.roomName}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex space-x-4">
                  <div className="w-1/3">
                    <Image
                      src={getRandomImage()}
                      alt={room.roomName}
                      width={200}
                      height={150}
                      className="rounded-lg object-cover"
                    />
                  </div>

                  <div className="w-2/3 space-y-3">
                    <div>
                      <h3 className="font-semibold text-sm mb-1">
                        {dict?.navigation?.therapy_type}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {room.therapyTypes.map((therapy, index) => (
                          <span
                            key={index}
                            className="bg-muted/50 px-2 py-1 rounded-full text-xs"
                          >
                            {therapy}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleOpenVideo(room.videoRoute)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      View Room Video
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Video Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={handleCloseVideo}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Room Video Tour</DialogTitle>
          </DialogHeader>

          {selectedVideo && <Video src={RoomVideo} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuidePage;
