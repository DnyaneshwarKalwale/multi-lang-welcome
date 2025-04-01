import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface WelcomeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  ctaText?: string;
  ctaAction?: () => void;
  delay?: number;
}

export function WelcomeCard({ 
  title, 
  description, 
  icon, 
  ctaText, 
  ctaAction,
  delay = 0 
}: WelcomeCardProps) {
  return (
    <motion.div
      className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover-lift"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col h-full">
        <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center mb-5">
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        
        <p className="text-gray-400 mb-6 flex-grow">{description}</p>
        
        {ctaText && ctaAction && (
          <Button 
            variant="ghost" 
            onClick={ctaAction}
            className="justify-start p-0 hover:bg-transparent text-indigo-400 hover:text-indigo-300 group"
          >
            <span>{ctaText}</span>
            <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export function WelcomeFeatureCard({ 
  title, 
  description, 
  icon, 
  delay = 0 
}: Omit<WelcomeCardProps, 'ctaText' | 'ctaAction'>) {
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl p-5 hover-lift"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex-shrink-0 flex items-center justify-center">
          {icon}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function WelcomeStatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  delay = 0 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  trend?: { value: string; positive: boolean }; 
  delay?: number;
}) {
  return (
    <motion.div
      className="bg-gray-900 border border-gray-800 rounded-xl p-5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">{title}</span>
        <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center">
          {icon}
        </div>
      </div>
      
      <div className="flex items-end gap-3">
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className={`text-xs ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function WelcomeTestimonialCard({
  quote,
  author,
  role,
  avatarUrl,
  delay = 0
}: {
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4 text-indigo-400">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
        
        <p className="text-gray-300 mb-6 flex-grow italic">"{quote}"</p>
        
        <div className="flex items-center mt-auto">
          <img 
            src={avatarUrl} 
            alt={author} 
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
          <div>
            <div className="font-medium">{author}</div>
            <div className="text-xs text-gray-500">{role}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 