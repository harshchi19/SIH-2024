import { useLanguage } from "@/context/LanguageContext";
import { Mic, AudioLines } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { VANI_AI_ROUTE } from "@/utils/ai.constants";

export const TypingBox = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognition = useRef(null);
  const audioRef = useRef(null);
  const { dict } = useLanguage();

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.lang = "en-US";
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onresult = (event) => {
        const speechToText =
          event.results[event.results.length - 1][0].transcript;
        setQuestion(speechToText);
      };

      recognition.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
      };
    } else {
      console.warn("Speech Recognition API is not supported in this browser.");
    }
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    recognition.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognition.current.stop();
  };

  const handleAsk = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", question.trim());

      const response = await fetch(VANI_AI_ROUTE, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        audio.play();

        audio.addEventListener("play", () => {
          document.dispatchEvent(new CustomEvent("startDoctorAnimation"));
        });

        audio.addEventListener("ended", () => {
          document.dispatchEvent(new CustomEvent("stopDoctorAnimation"));
          URL.revokeObjectURL(audioUrl);
        });

        setQuestion("");
      } else {
        console.error("Request failed with status", response.status);
      }
    } catch (error) {
      console.error("Error fetching audio", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="z-10 max-w-[600px] flex space-y-6 flex-col bg-gradient-to-tr from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4 backdrop-blur-md rounded-xl border-slate-100/30 border">
      <div>
        <h2 className="text-white font-bold text-xl">{dict?.chatbot?.title}</h2>
        <p className="text-white/65">{dict?.chatbot?.desc}</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
          </span>
        </div>
      ) : (
        <div className="gap-3 flex items-center">
          <div className="flex gap-4">
            {isRecording ? (
              <button
                className="bg-red-600 p-2 rounded-full text-white"
                onClick={stopRecording}
              >
                <AudioLines />
              </button>
            ) : (
              <button
                className="bg-green-600 p-2 rounded-full text-white"
                onClick={startRecording}
              >
                <Mic />
              </button>
            )}
          </div>
          <input
            className="focus:outline focus:outline-white/80 flex-grow bg-slate-800/60 p-2 px-4 rounded-full text-white placeholder:text-white/50 shadow-inner shadow-slate-900/60"
            placeholder={dict?.chatbot?.placeholder}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAsk();
              }
            }}
          />
          <button
            className="bg-slate-100/20 p-2 px-6 rounded-full text-white"
            onClick={handleAsk}
          >
            {dict?.chatbot?.ask}
          </button>
          <audio ref={audioRef} />
        </div>
      )}
    </div>
  );
};
