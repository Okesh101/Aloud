// src/components/Dashboard/StatsCard.tsx
import React from "react";

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  gradient: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  title,
  value,
  gradient,
}) => {
  return (
    <div className="glass-card p-6 hover:transform hover:scale-105 transition-all duration-300">
      <div
        className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-gray-600">{title}</p>
    </div>
  );
};
