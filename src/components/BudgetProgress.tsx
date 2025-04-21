"use client";

import { motion } from "framer-motion";

interface BudgetProgressProps {
  current: number;
  goal: number;
  className?: string;
}

export default function BudgetProgress({ current, goal, className = "" }: BudgetProgressProps) {
  // Calculate percentage
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  
  // Determine color based on percentage
  const getColor = () => {
    if (percentage < 70) return "bg-green-500";
    if (percentage < 90) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className={`${className}`}>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">Budget Usage</span>
        <span className="text-sm font-medium text-gray-700">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <motion.div 
          className={`h-2.5 rounded-full ${getColor()}`}
          style={{ width: "0%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>${current.toFixed(2)} spent</span>
        <span>${goal.toFixed(2)} goal</span>
      </div>
    </div>
  );
}
