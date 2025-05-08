import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Play,
  Square,
  Video,
  VideoOff,
  Music,
  Music2,
  Mic,
  MicOff,
} from "lucide-react";

const emotions = [
  {
    name: "Happy",
    image:
      "https://thumbs.dreamstime.com/b/happy-emotion-face-portrait-young-woman-happy-emotion-face-portrait-young-woman-isolated-white-119778308.jpg",
    emoji: "😊",
  },
  {
    name: "Sad",
    image:
      "https://th.bing.com/th/id/OIP.gUHSX-82M_RzNh1wSvJB0AHaFy?rs=1&pid=ImgDetMain",
    emoji: "😢",
  },
  {
    name: "Angry",
    image:
      "https://th.bing.com/th/id/OIP.z39-59s90QbgKtMytLmYfQHaE8?rs=1&pid=ImgDetMain",
    emoji: "😠",
  },
  {
    name: "Surprise",
    image:
      "https://media.istockphoto.com/photos/surprised-little-boy-picture-id184150665?k=6&m=184150665&s=612x612&w=0&h=QI945J3JFloZcR6AKOBQiaA1aRb7JEaOfAgZpXdDH9A=",
    emoji: "😲",
  },
  {
    name: "Scared",
    image:
      "https://th.bing.com/th/id/R.cd285b5eab3443d9b2f20780ffd2b130?rik=ndvNZRP7nlQB9w&pid=ImgRaw&r=0",
    emoji: "😨",
  },
  {
    name: "Disgusted",
    image:
      "https://media.istockphoto.com/photos/young-woman-making-a-disgusting-face-expression-picture-id174868744?k=6&m=174868744&s=612x612&w=0&h=hVXvkRAoweAPAlyP8IVT044YOzwvsJLhEM_hJQCwyMQ=",
    emoji: "🤢",
  },
  {
    name: "Excited",
    image:
      "https://image.freepik.com/free-photo/front-view-excited-woman_23-2148369475.jpg",
    emoji: "🤩",
  },
];

const EmotionLearning: React.FC = () => {
  const [currentEmotion, setCurrentEmotion] = useState(0);
  const [isControlsExpanded, setIsControlsExpanded] = useState(false);
  const [isMusicPaused, setIsMusicPaused] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isDistracted, setIsDistracted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { backgroundColor, musicSrc } = location.state as {
    backgroundColor: string;
    musicSrc: string | null;
  };
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);


  useEffect(() => {
    const setupDevices = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      } catch (err) {
        console.error("Error accessing the camera or microphone:", err);
      }
    };

    setupDevices();

    if (audioRef.current && musicSrc) {
      audioRef.current.src = musicSrc;
      audioRef.current.loop = true;
      audioRef.current.play();
    }
    
    const checkDistraction = async () => {
      try {
        const response = await fetch("/get_flag");
        const data = await response.json();
        setIsDistracted(data.showFlag === 1);
      } catch (error) {
        console.error("Error checking distraction flag:", error);
      }
    };

    const intervalId = setInterval(checkDistraction, 3000);

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      clearInterval(intervalId);
    };
  }, [musicSrc]);

  useEffect(() => {
    const checkEmotionMatch = async () => {
      try {
        const response = await fetch("http://localhost:8000/get_emotion");
        const data = await response.json();
        const detectedEmotion = data.emotion.toLowerCase();
        const expectedEmotion = emotions[currentEmotion].name.toLowerCase();
  
        if (detectedEmotion === expectedEmotion && !showSuccessDialog) {
          setShowSuccessDialog(true);
        }
      } catch (error) {
        console.error("Error fetching emotion:", error);
      }
    };
  
    const intervalId = setInterval(checkEmotionMatch, 3000);
    return () => clearInterval(intervalId);
  }, [currentEmotion, showSuccessDialog]);  

  const nextEmotion = () => {
    setCurrentEmotion((prev) => (prev + 1) % emotions.length);
  };

  const prevEmotion = () => {
    setCurrentEmotion((prev) => (prev - 1 + emotions.length) % emotions.length);
  };

  const toggleControls = () => {
    setIsControlsExpanded(!isControlsExpanded);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPaused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsMusicPaused(!isMusicPaused);
    }
  };

  const stopActivity = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    navigate("/child-dashboard");
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach((track) => (track.enabled = !track.enabled));
    }
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach((track) => (track.enabled = !track.enabled));
    }
  };

  return (
    <div className="min-h-screen p-8 relative" style={{ backgroundColor }}>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 left-4 z-10"
        onClick={stopActivity}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Back to Dashboard</span>
      </Button>

      <div className="absolute top-4 right-4 w-[32rem] h-[24rem] rounded-lg overflow-hidden shadow-lg border-4 border-purple-400 bg-gray-100">
        <img
          src={"http://localhost:8000/video_feed"}
          alt="Video Feed"
          className="w-full h-full object-contain"
        />
        {!isCameraOn && (
          <div className="w-full h-full flex items-center justify-center">
            <VideoOff className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      <motion.h1
        className="text-4xl font-bold text-center text-purple-700 mb-12 pt-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Khám phá cảm xúc
      </motion.h1>

      <div className="flex justify-center items-center space-x-8">
        <Button
          onClick={prevEmotion}
          variant="outline"
          size="lg"
          className="h-16 w-16 rounded-full border-purple-400 text-purple-700"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        <motion.div
          key={currentEmotion}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-[28rem] h-[32rem] shadow-xl border-4 border-purple-300">
            <CardContent className="p-8 flex flex-col items-center justify-between h-full">
              <img
                src={emotions[currentEmotion].image}
                alt={emotions[currentEmotion].name}
                className="w-80 h-80 object-cover rounded-lg shadow-md mb-6"
              />
              <div className="text-center">
                <h2 className="text-6xl mb-4">
                  {emotions[currentEmotion].emoji}
                </h2>
                <h3 className="text-3xl font-bold text-purple-700">
                  {emotions[currentEmotion].name}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Button
          onClick={nextEmotion}
          variant="outline"
          size="lg"
          className="h-16 w-16 rounded-full border-purple-400 text-purple-700"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-xl text-purple-600">
          Chuyển qua các thẻ khác để khám phá nhiều cảm xúc hơn
        </p>
      </div>

      <motion.div
        className="fixed bottom-8 left-8 flex flex-col items-center space-y-2"
        animate={{ height: isControlsExpanded ? "auto" : "4rem" }}
      >
        <Button
          onClick={toggleControls}
          variant="outline"
          size="lg"
          className="w-16 h-16 rounded-full"
        >
          {isControlsExpanded ? (
            <Square className="h-8 w-8" />
          ) : (
            <Play className="h-8 w-8" />
          )}
        </Button>
        <AnimatePresence>
          {isControlsExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col space-y-2"
            >
              <Button
                onClick={toggleMusic}
                variant="outline"
                size="lg"
                className="w-16 h-16 rounded-full"
              >
                {isMusicPaused ? (
                  <Music2 className="h-8 w-8" />
                ) : (
                  <Music className="h-8 w-8" />
                )}
              </Button>
              <Button
                onClick={toggleCamera}
                variant="outline"
                size="lg"
                className="w-16 h-16 rounded-full"
              >
                {isCameraOn ? (
                  <Video className="h-8 w-8" />
                ) : (
                  <VideoOff className="h-8 w-8" />
                )}
              </Button>
              <Button
                onClick={toggleMic}
                variant="outline"
                size="lg"
                className="w-16 h-16 rounded-full"
              >
                {isMicOn ? (
                  <Mic className="h-8 w-8" />
                ) : (
                  <MicOff className="h-8 w-8" />
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="fixed bottom-8 right-8">
        <Button
          onClick={stopActivity}
          variant="outline"
          size="lg"
          className="w-16 h-16 rounded-full"
        >
          <Square className="h-8 w-8" />
        </Button>
      </div>

      {musicSrc && <audio ref={audioRef} />}

      <Dialog open={isDistracted} onOpenChange={setIsDistracted}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Attention Needed</DialogTitle>
            <DialogDescription>
              It seems like you might be distracted. Let's take a short break
              and continue this session after a few minutes.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setIsDistracted(false)}>OK</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>🎉 Thành công!</DialogTitle>
            <DialogDescription>
              Biểu cảm của bạn đã khớp với cảm xúc hiện tại.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowSuccessDialog(false)}>OK</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmotionLearning;
