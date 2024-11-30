import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLanguage } from "@/context/LanguageContext";
import { ADD_CALENDAR_EVENT_ROUTE, GET_ALL_SUP_ROUTE } from "@/utils/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "../ui/textarea";

const EventModal = ({ selectedSlot, setSelectedSlot, events, setEvents }) => {
  const [data, setData] = useState({
    title: "",
    supervisor: "",
    patient: "",
    roomNo: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    color: "#0000FF",
    activeTab: "appointments",
  });
  const [supervisorData, setSupervisorData] = useState([]);
  const { dict } = useLanguage();

  useEffect(() => {
    const supervisorData = async () => {
      const response = await fetch(GET_ALL_SUP_ROUTE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSupervisorData(data);
      }
    };

    supervisorData();
  }, []);

  if (!selectedSlot) return null;

  const closeModal = () => {
    setSelectedSlot(null);
    setData({
      title: "",
      supervisor: "",
      patient: "",
      roomNo: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
      color: "#0000FF",
      activeTab: "appointments",
    });
  };

  const colors = [
    { value: "#FFFF00", label: dict?.colors?.yellow },
    { value: "#FF0000", label: dict?.colors?.red },
    { value: "#9D00FF", label: dict?.colors?.purple },
    { value: "#00FF00", label: dict?.colors?.green },
    { value: "#0000FF", label: dict?.colors?.blue },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const userType = localStorage.getItem("userType");
    const userId = localStorage.getItem("user");
    const formData = {
      ...data,
      userId,
      userType,
    };

    const response = await fetch(ADD_CALENDAR_EVENT_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = response.json();
      setEvents(...events, data.event);
    }

    closeModal();
  };

  return (
    <Dialog open={!!selectedSlot} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-4/5">
        <DialogHeader>
          <DialogTitle>
            {data.activeTab === "appointments"
              ? `${dict?.calendar?.title_app}`
              : `${dict?.calendar?.title_rem}`}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="appointments"
          onValueChange={(value) =>
            setData({
              title: "",
              supervisor: "",
              patient: "",
              roomNo: "",
              date: "",
              startTime: "",
              endTime: "",
              description: "",
              color: "#0000FF",
              activeTab: value,
            })
          }
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="appointments">
              {dict?.calendar?.appointment}
            </TabsTrigger>
            <TabsTrigger value="reminders">
              {dict?.calendar?.reminder}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <form id="appointmentsForm" className="space-y-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="title">{dict?.calendar?.app_title}</Label>
                <Input
                  id="title"
                  name="title"
                  value={data.title}
                  onChange={handleInputChange}
                  placeholder="Enter appointment title"
                  required
                />
              </div>

              <div className="space-y-1 w-full">
                <Label
                  htmlFor="preferred_language"
                  className="text-gray-700 text-sm"
                >
                  {dict?.calendar?.sel_sup}
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={`w-full flex items-center justify-start h-[2.25rem] rounded-md border ${
                      !data.supervisor ? "text-gray-500" : ""
                    } border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
                  >
                    {data.supervisor || dict?.calendar?.sel_sup_plchldr}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {supervisorData.length > 0 ? (
                      supervisorData.map((supervisor) => (
                        <DropdownMenuItem
                          key={supervisor.supervisor_id}
                          onClick={() =>
                            setData({ ...data, supervisor: supervisor._id })
                          }
                        >
                          {supervisor.name}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem disabled>
                        No supervisors available
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between gap-x-5">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="patient">{dict?.calendar?.patient}</Label>
                  <Input
                    id="patient"
                    name="patient"
                    value={data.patient}
                    onChange={handleInputChange}
                    placeholder="Enter patient name"
                    required
                  />
                </div>

                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="roomNo">{dict?.calendar?.room_no}</Label>
                  <Input
                    id="roomNo"
                    name="roomNo"
                    value={data.roomNo}
                    onChange={handleInputChange}
                    placeholder="Enter room number"
                    required
                  />
                </div>
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="date">{dict?.calendar?.date}</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={data.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="startTime">
                    {dict?.calendar?.start_time}
                  </Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={data.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="endTime">{dict?.calendar?.end_time}</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={data.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
                <div className="space-y-1 w-full">
                  <Label
                    htmlFor="description"
                    className="text-gray-700 text-sm flex items-center"
                  >
                    {dict?.calendar?.desc}
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={data.description}
                    placeholder={dict?.calendar?.desc_plchldr}
                    onChange={handleInputChange}
                    className="h-20"
                  />
                </div>
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="color">{dict?.calendar?.event_color}</Label>
                <div className="w-full flex items-center justify-between rounded-md p-2 bg-gray-100">
                  {colors.map((color) => (
                    <div
                      key={color.value}
                      onClick={() => setData({ ...data, color: color.value })}
                      className={`flex flex-col items-center space-y-3 cursor-pointer p-2 px-3 rounded-md ${
                        data.color === color.value
                          ? "ring-2 ring-offset-2 ring-gray-500"
                          : ""
                      }`}
                    >
                      <h1 className="text-sm font-semibold text-gray-700">
                        {color.label}
                      </h1>
                      <div
                        className="h-10 w-10 rounded-full shadow-lg"
                        style={{ backgroundColor: color.value }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="reminders">
            <form id="remindersForm" className="space-y-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="title">{dict?.calendar?.rem_title}</Label>
                <Input
                  id="title"
                  name="title"
                  value={data.title}
                  onChange={handleInputChange}
                  placeholder="Enter reminder title"
                  required
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="date">{dict?.calendar?.date}</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={data.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="startTime">{dict?.calendar?.time}</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={data.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="w-full flex-row-center gap-x-5 max-md:flex-col-center max-md:gap-y-5 mt-5">
                <div className="space-y-1 w-full">
                  <Label
                    htmlFor="description"
                    className="text-gray-700 text-sm flex items-center"
                  >
                    {dict?.calendar?.desc}
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={data.description}
                    placeholder={dict?.calendar?.desc_plchldr}
                    onChange={handleInputChange}
                    className="h-20"
                  />
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={closeModal}
            className="font-semibold"
          >
            {dict?.calendar?.cancel || "Cancel"}
          </Button>
          <Button
            form={
              data.activeTab === "appointments"
                ? "appointmentsForm"
                : "remindersForm"
            }
            className="bg-green-400 hover:bg-green-600"
            onClick={handleFormSubmit}
          >
            {dict?.calendar?.addEvent || "Add Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
