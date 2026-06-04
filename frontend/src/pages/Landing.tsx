// src/pages/Landing.tsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { readingService } from "../services/readingService";
import { Play, Mic, Headphones, Zap } from "lucide-react";
import toast from "react-hot-toast";

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSpeak = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to read");
      return;
    }

    setIsLoading(true);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);

    try {
      let audioBlob: Blob;
      if (user) {
        audioBlob = await readingService.speakText(text);
      } else {
        audioBlob = await readingService.speakVisitorText(text);
      }

      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      if (audioRef.current) {
        const audioEl = audioRef.current;
        audioEl.src = url;

        await new Promise<void>((resolve, reject) => {
          const handleLoaded = () => {
            audioEl.removeEventListener("loadedmetadata", handleLoaded);
            audioEl.removeEventListener("error", handleError);
            resolve();
          };
          const handleError = () => {
            audioEl.removeEventListener("loadedmetadata", handleLoaded);
            audioEl.removeEventListener("error", handleError);
            reject(new Error("Audio failed to load"));
          };

          audioEl.addEventListener("loadedmetadata", handleLoaded);
          audioEl.addEventListener("error", handleError);
          audioEl.load();
        });

        await audioEl.play();
      }

      toast.success("Audio generated successfully!");
    } catch (error: any) {
      console.error("Landing TTS error", error);
      toast.error(error?.message || "Failed to generate speech");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Blobs */}
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

          {/* Right Content - Text Input Card */}
          <div className="glass-card p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Try it now
                </h3>
                <p className="text-gray-600">
                  Paste any text and hear it instantly
                </p>
              </div>

              <textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here... (e.g., Hello the product lead will follow up with you via email, please be patient.)"
                className="glass-input w-full h-48 resize-none"
              />

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {text.split(/\s+/).filter((w) => w).length} words
                </div>
                <button
                  onClick={handleSpeak}
                  disabled={isLoading || !text.trim()}
                  className="glass-button flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  {isLoading ? "Generating..." : "Read Aloud"}
                </button>
              </div>
              {audioUrl && (
                <div className="mt-6 p-4 glass-card">
                  <audio ref={audioRef} controls className="w-full" />
                </div>
              )}
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
