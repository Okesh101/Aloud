// // src/pages/Landing.tsx
// import React, { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { readingService } from "../services/readingService";
// import { Play, Mic, Headphones, Zap } from "lucide-react";
// import toast from "react-hot-toast";

// export const Landing: React.FC = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [text, setText] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [audioUrl, setAudioUrl] = useState<string | null>(null);
//   const audioRef = useRef<HTMLAudioElement>(null);

//   const handleSpeak = async () => {
//     if (!text.trim()) {
//       toast.error("Please enter some text to read");
//       return;
//     }

//     setIsLoading(true);
//     if (audioUrl) {
//       URL.revokeObjectURL(audioUrl);
//     }
//     setAudioUrl(null);

//     try {
//       let audioBlob: Blob;
//       if (user) {
//         audioBlob = await readingService.speakText(text);
//       } else {
//         audioBlob = await readingService.speakVisitorText(text);
//       }

//       const url = URL.createObjectURL(audioBlob);

//       setAudioUrl(url);

//       if (audioRef.current) {
//         const audioEl = audioRef.current;
//         audioEl.src = url;

//         await new Promise<void>((resolve, reject) => {
//           const handleLoaded = () => {
//             audioEl.removeEventListener("loadedmetadata", handleLoaded);
//             audioEl.removeEventListener("error", handleError);
//             resolve();
//           };
//           const handleError = () => {
//             audioEl.removeEventListener("loadedmetadata", handleLoaded);
//             audioEl.removeEventListener("error", handleError);
//             reject(new Error("Audio failed to load"));
//           };

//           audioEl.addEventListener("loadedmetadata", handleLoaded);
//           audioEl.addEventListener("error", handleError);
//           audioEl.load();
//         });

//         await audioEl.play();
//       }

//       toast.success("Audio generated successfully!");
//     } catch (error: any) {
//       console.error("Landing TTS error", error);
//       toast.error(error?.message || "Failed to generate speech");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative overflow-hidden">
//       {/* Animated Background Blobs */}
//       <div className="absolute inset-0 overflow-hidden -z-10">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
//         <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
//         <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
//       </div>

//       {/* Hero Section */}
//       <div className="container mx-auto px-4 py-20">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           {/* Left Content */}
//           <div className="space-y-8">
//             <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
//               <Zap className="w-4 h-4 text-yellow-500" />
//               <span className="text-sm font-medium">
//                 Read less, listen more
//               </span>
//             </div>

//             <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
//               Transform <span className="gradient-text">Text to Speech</span>
//               <br />
//               Instantly
//             </h1>

//             <p className="text-xl text-gray-600">
//               Stop straining your eyes. Listen to articles, emails, or any text
//               while you commute, workout, or relax. Save 2 seconds of reading
//               time - every time.
//             </p>

//             <div className="flex flex-wrap gap-4">
//               <button
//                 onClick={() =>
//                   document
//                     .getElementById("text-input")
//                     ?.scrollIntoView({ behavior: "smooth" })
//                 }
//                 className="glass-button flex items-center gap-2"
//               >
//                 <Play className="w-5 h-5" />
//                 Start Listening
//               </button>

//               {!user && (
//                 <button
//                   onClick={() => navigate("/signup")}
//                   className="px-6 py-3 glass-card font-semibold hover:bg-white/40 transition"
//                 >
//                   Sign Up Free
//                 </button>
//               )}
//             </div>

//             <div className="flex items-center space-x-8 pt-4">
//               <div className="flex items-center space-x-2">
//                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                   <Mic className="w-5 h-5 text-green-600" />
//                 </div>
//                 <span className="text-sm">Natural Voice</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                   <Headphones className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <span className="text-sm">High Quality</span>
//               </div>
//             </div>
//           </div>

//           {/* Right Content - Text Input Card */}
//           <div className="glass-card p-8 transform transition-transform duration-300">
//             <div className="space-y-6">
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-800 mb-2">
//                   Try it now
//                 </h3>
//                 <p className="text-gray-600">
//                   Paste any text and hear it instantly
//                 </p>
//               </div>

//               <textarea
//                 id="text-input"
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 placeholder="Paste your text here... (e.g., Hello the product lead will follow up with you via email, please be patient.)"
//                 className="glass-input w-full h-48 resize-none transition-all duration-200 hover:ring-2 hover:ring-purple-600"
//               />

//               <div className="flex justify-between items-center">
//                 <div className="text-sm text-gray-500">
//                   {text.split(/\s+/).filter((w) => w).length} words
//                 </div>
//                 <button
//                   onClick={handleSpeak}
//                   disabled={isLoading || !text.trim()}
//                   className="glass-button flex items-center gap-2"
//                 >
//                   <Play className="w-5 h-5" />
//                   {isLoading ? "Generating..." : "Read Aloud"}
//                 </button>
//               </div>
//               {audioUrl && (
//                 <div className="mt-6 p-4 glass-card">
//                   <audio ref={audioRef} controls className="w-full" />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Features Section */}
//       <div className="container mx-auto px-4 py-20">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-bold mb-4">
//             Why Choose <span className="gradient-text">Aloud</span>?
//           </h2>
//           <p className="text-xl text-gray-600">
//             Experience the future of reading
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8">
//           {features.map((feature, index) => (
//             <div
//               key={index}
//               className="glass-card p-6 text-center group hover:transform hover:scale-105 transition-all duration-300"
//             >
//               <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition">
//                 {feature.icon}
//               </div>
//               <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
//               <p className="text-gray-600">{feature.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const features = [
//   {
//     icon: <Zap className="w-8 h-8 text-white" />,
//     title: "Lightning Fast",
//     description:
//       "Generate speech in milliseconds with our optimized TTS engine",
//   },
//   {
//     icon: <Mic className="w-8 h-8 text-white" />,
//     title: "Natural Voices",
//     description: "Human-like speech with proper intonation and emphasis",
//   },
//   {
//     icon: <Headphones className="w-8 h-8 text-white" />,
//     title: "Track Progress",
//     description: "Monitor your reading habits and see your daily stats",
//   },
// ];


// src/pages/Landing.tsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { readingService } from "../services/readingService";
import { Play, Mic, Headphones, Zap, Pause, Volume2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Cleanup old URLs on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const generateAudio = async (textToSpeak: string) => {
    if (!textToSpeak.trim()) {
      toast.error("Please enter some text to read");
      return;
    }

    setIsLoading(true);
    
    // Clean up old audio URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setProgress(0);
    setCurrentTime(0);

    try {
      let audioBlob: Blob;
      if (user) {
        audioBlob = await readingService.speakText(textToSpeak);
      } else {
        audioBlob = await readingService.speakVisitorText(textToSpeak);
      }

      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
        // Auto-play will be handled by useEffect
      }

      toast.success("Audio ready!");
    } catch (error: any) {
      console.error("TTS error:", error);
      toast.error(error?.message || "Failed to generate speech");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-play when audio URL changes
  useEffect(() => {
    if (audioUrl && audioRef.current && !isLoading) {
      const playAudio = async () => {
        try {
          await audioRef.current?.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Auto-play failed:", error);
          // Most browsers require user interaction first
          toast((t) => (
            <div className="flex items-center gap-2">
              <span>Click play to start audio</span>
              <button 
                onClick={() => {
                  toast.dismiss(t.id);
                  togglePlayPause();
                }}
                className="px-2 py-1 bg-purple-600 text-white rounded"
              >
                Play
              </button>
            </div>
          ), { duration: 5000 });
        }
      };
      playAudio();
    }
  }, [audioUrl]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) {
      // If no audio, generate first
      if (text.trim()) {
        generateAudio(text);
      }
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Play failed:", err);
          toast.error("Failed to play audio");
        });
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration || 1;
      setCurrentTime(current);
      setDuration(dur);
      setProgress((current / dur) * 100);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = x * audioRef.current.duration;
  };

  const handleRegenerate = () => {
    if (text.trim()) {
      generateAudio(text);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">
                Read less, listen more
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Transform <span className="gradient-text">Text to Speech</span>
              <br />
              Instantly
            </h1>

            <p className="text-xl text-gray-600">
              Stop straining your eyes. Listen to articles, emails, or any text
              while you commute, workout, or relax. Save 2 seconds of reading
              time - every time.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() =>
                  document
                    .getElementById("text-input")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="glass-button flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Listening
              </button>

              {!user && (
                <button
                  onClick={() => navigate("/signup")}
                  className="px-6 py-3 glass-card font-semibold hover:bg-white/40 transition"
                >
                  Sign Up Free
                </button>
              )}
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Mic className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm">Natural Voice</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm">High Quality</span>
              </div>
            </div>
          </div>

          {/* Right Content - Enhanced Player */}
          <div className="glass-card p-8 transform transition-transform duration-300">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Try it now
                </h3>
                <p className="text-gray-600">
                  Paste any text and hear it instantly with natural intent
                </p>
              </div>

              <textarea
                id="text-input"
                value={text}
                onChange={handleTextChange}
                placeholder="Paste your text here... It will auto-play with natural pauses and emphasis!"
                className="glass-input w-full h-48 resize-none transition-all duration-200 hover:ring-2 hover:ring-purple-600"
              />

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {text.split(/\s+/).filter((w) => w).length} words • 
                  {isLoading ? " Generating..." : " Ready"}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleRegenerate}
                    disabled={isLoading || !text.trim()}
                    className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
                    title="Regenerate audio"
                  >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={togglePlayPause}
                    disabled={isLoading}
                    className="glass-button flex items-center gap-2"
                  >
                    {isLoading ? (
                      "⏳ Loading..."
                    ) : isPlaying ? (
                      <><Pause className="w-5 h-5" /> Pause</>
                    ) : (
                      <><Play className="w-5 h-5" /> {audioUrl ? "Resume" : "Generate"}</>
                    )}
                  </button>
                </div>
              </div>

              {/* Audio Player */}
              <div className="mt-4 space-y-3">
                {/* Progress Bar */}
                <div 
                  className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden cursor-pointer group"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 group-hover:from-purple-500 group-hover:to-blue-500"
                    style={{ width: `${progress}%` }}
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-purple-600 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `calc(${progress}% - 6px)` }}
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlayPause}
                      className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                      {isPlaying ? 
                        <Pause className="w-5 h-5" /> : 
                        <Play className="w-5 h-5" />
                      }
                    </button>
                    <span className="text-sm text-gray-600">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-gray-400" />
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setVolume(val);
                        if (audioRef.current) {
                          audioRef.current.volume = val;
                        }
                      }}
                      className="w-20 accent-purple-600"
                    />
                  </div>
                </div>

                <audio
                  ref={audioRef}
                  onEnded={handleAudioEnded}
                  onTimeUpdate={handleTimeUpdate}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose <span className="gradient-text">Aloud</span>?
          </h2>
          <p className="text-xl text-gray-600">
            Experience the future of reading
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-6 text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    icon: <Zap className="w-8 h-8 text-white" />,
    title: "Lightning Fast",
    description:
      "Generate speech in milliseconds with our optimized TTS engine",
  },
  {
    icon: <Mic className="w-8 h-8 text-white" />,
    title: "Natural Voices",
    description: "Human-like speech with proper intonation and emphasis",
  },
  {
    icon: <Headphones className="w-8 h-8 text-white" />,
    title: "Track Progress",
    description: "Monitor your reading habits and see your daily stats",
  },
];