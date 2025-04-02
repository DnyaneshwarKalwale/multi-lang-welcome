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
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 50 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col h-full">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-600/20 flex items-center justify-center mb-5 animate-spin-slow">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
            {icon}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-3 text-gradient">{title}</h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">{description}</p>
        
        {ctaText && ctaAction && (
          <Button 
            variant="ghost" 
            onClick={ctaAction}
            className="justify-start p-0 hover:bg-transparent text-cyan-600 dark:text-cyan-400 hover:text-violet-600 dark:hover:text-violet-400 group"
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
      className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: "spring" }}
      viewport={{ once: true }}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex-shrink-0 flex items-center justify-center text-white">
          {icon}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
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
      className="glass-card rounded-xl p-5 hover:translate-y-[-2px] transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: "spring" }}
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white">
          {icon}
        </div>
      </div>
      
      <div className="flex items-end gap-3">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        {trend && (
          <div className={`text-xs ${trend.positive ? 'text-emerald-500' : 'text-rose-500'} flex items-center`}>
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
      className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: "spring" }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4 text-cyan-500 dark:text-cyan-400">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
        
        <p className="text-gray-700 dark:text-gray-200 mb-6 flex-grow italic">&ldquo;{quote}&rdquo;</p>
        
        <div className="flex items-center mt-auto">
          <img 
            src={avatarUrl} 
            alt={author} 
            className="w-10 h-10 rounded-full mr-3 object-cover ring-2 ring-cyan-500/50"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{author}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{role}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 