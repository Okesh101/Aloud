// src/components/Dashboard/ReadingHistory.tsx
import React, { useState } from "react";
import type { Reading } from "../../types";
import { Calendar, Search, Clock, BookOpen } from "lucide-react";

interface ReadingHistoryProps {
  readings: Reading[];
}

export const ReadingHistory: React.FC<ReadingHistoryProps> = ({ readings }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const filteredReadings = readings.filter((reading) => {
    const matchesSearch = reading.content
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDate =
      !filterDate || reading.created_at.startsWith(filterDate);
    return matchesSearch && matchesDate;
  });

  return (
    <div className="glass-card p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold">Reading History</h2>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input pl-9 w-48"
            />
          </div>

          {/* Date Filter */}
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="glass-input"
          />
        </div>
      </div>

      {filteredReadings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No reading history yet. Start reading to see your history!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReadings.map((reading) => (
            <div
              key={reading.id}
              className="glass-card p-4 hover:bg-white/20 transition"
            >
              <p className="text-gray-800 mb-2">{reading.content}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(reading.created_at).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(reading.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
