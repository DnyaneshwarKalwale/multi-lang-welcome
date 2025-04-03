import React from "react";

/**
 * A loading screen component that displays a spinner
 */
export default function LoadingScreen() {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-background">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
} 