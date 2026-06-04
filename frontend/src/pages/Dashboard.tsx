// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTimeGreeting } from "../hooks/useTimeGreeting";
import { TextToSpeech } from "../components/Dashboard/TextToSpeech";
import { StatsCard } from "../components/Dashboard/StatsCard";
import { ReadingHistory } from "../components/Dashboard/ReadingHistory";
import { readingService } from "../services/readingService";
import type { ReadingStats } from "../types";
import { BookOpen, TrendingUp, Calendar } from "lucide-react";

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { greeting, timeEmoji } = useTimeGreeting();
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await readingService.getReadingStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Greeting Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {greeting}, {user?.firstname}! {timeEmoji}
        </h1>
        <p className="text-xl text-gray-600">What are we reading today? 📖</p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="glass-card p-6 animate-pulse h-40 rounded-3xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={<BookOpen className="w-8 h-8" />}
            title="Total Reads"
            value={stats?.total_reads || 0}
            gradient="from-purple-500 to-pink-500"
          />
          <StatsCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Today's Reads"
            value={stats?.today_reads || 0}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatsCard
            icon={<Calendar className="w-8 h-8" />}
            title="Streak"
            value={`${Math.floor((stats?.total_reads || 0) / 10)} days`}
            gradient="from-green-500 to-emerald-500"
          />
        </div>
      )}

      {/* Text to Speech Section */}
      <div className="mb-8">
        <TextToSpeech onSuccess={fetchStats} />
      </div>

      {/* Reading History */}
      <div>
        <ReadingHistory readings={stats?.recent_reads || []} />
      </div>
    </div>
  );
};
