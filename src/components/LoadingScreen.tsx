import React from 'react';
import { Loader2 } from 'lucide-react';
import { ScripeLogotype } from './ScripeIcon';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <ScripeLogotype className="mb-8" />
      <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
      <p className="text-gray-400">Loading your experience...</p>
    </div>
  );
} 