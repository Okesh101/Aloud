// src/components/Dashboard/TextToSpeech.tsx
import React, { useState } from "react";
import { Play, Loader, Volume2, Trash2 } from "lucide-react";
import { readingService } from "../../services/readingService";
import toast from "react-hot-toast";

interface TextToSpeechProps {
  onSuccess?: () => void;
}

export const TextToSpeech: React.FC<TextToSpeechProps> = ({ onSuccess }) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handleSpeak = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to read");
      return;
    }

    setIsLoading(true);
    try {
      const audioBlob = await readingService.speakText(text);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
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

      onSuccess?.();
      toast.success("Audio generated successfully!");
    } catch (error: any) {
      console.error("TTS error", error);
      toast.error(error?.message || "Failed to generate speech");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((w) => w).length;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Volume2 className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold">Read Text Aloud</h2>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here... (up to 5000 characters)"
        className="glass-input w-full h-48 resize-none mb-4"
        maxLength={5000}
      />

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {wordCount} words • {text.length} characters
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            disabled={isLoading || !text}
            className="px-4 py-2 glass-card hover:bg-white/40 transition disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleSpeak}
            disabled={isLoading || !text}
            className="glass-button flex items-center gap-2"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            {isLoading ? "Generating..." : "Read Aloud"}
          </button>
        </div>
      </div>

      {audioUrl && (
        <div className="mt-4 p-4 glass-card">
          <audio ref={audioRef} controls className="w-full" />
        </div>
      )}
    </div>
  );
};
