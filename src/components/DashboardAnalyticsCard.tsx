import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardAnalyticsCardProps {
  title: string;
  data: number[];
  labels: string[];
  increase: number;
  timeframe: string;
}

export default function DashboardAnalyticsCard({
  title,
  data,
  labels,
  increase,
  timeframe
}: DashboardAnalyticsCardProps) {
  // Find max value for scaling
  const maxValue = Math.max(...data);
  
  return (
    <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-24 relative flex items-end justify-between mb-2">
          {data.map((value, index) => {
            const height = (value / maxValue) * 100;
            return (
              <div key={index} className="flex flex-col items-center w-full">
                <div 
                  className="w-full bg-indigo-600 rounded-sm hover:bg-indigo-500 transition-colors cursor-pointer relative group"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          {labels.map((label, index) => (
            <div key={index}>{label}</div>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-green-600/20 text-green-400 text-xs font-medium px-2 py-1 rounded-full flex items-center">
            <TrendingUp size={12} className="mr-1" />
            {increase}%
          </div>
          <span className="text-xs text-gray-400">{timeframe}</span>
        </div>
      </CardContent>
    </Card>
  );
} 