import React, { useEffect } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Users, UserCircle, Check, ArrowRight } from "lucide-react";
import { BrandOutLogotype } from "@/components/BrandOutIcon";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TeamSelectionPage() {
  const { workspaceType, setWorkspaceType, nextStep } = useOnboarding();
  const { user } = useAuth();

  // Auto-select personal use on mount
  useEffect(() => {
    if (!workspaceType) {
      setWorkspaceType("personal");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-background text-foreground relative overflow-hidden">
      {/* Background with simple blue gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-primary/5"></div>
      </div>
      
      <div className="max-w-3xl w-full text-center">
        <div className="mb-10 flex justify-center">
          <BrandOutLogotype className="h-12 w-auto" />
          </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          How would you like to use BrandOut?
        </h1>
        
        <p className="text-xl text-gray-600 mb-10">
          We'll setup your workspace accordingly.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center relative opacity-50 cursor-not-allowed shadow-sm">
            <div className="absolute top-4 right-4">
              <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                Coming Soon
              </span>
            </div>
            <div className="p-5 rounded-full mb-6 bg-gray-100">
              <Users className="w-14 h-14 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-500">For my team</h3>
            <p className="text-gray-400 text-base mb-6">
              One place to create, review and track content for your team.
            </p>
          </div>
          
          <div 
            className={`bg-white border ${workspaceType === "personal" ? "border-primary ring-2 ring-primary/30" : "border-gray-200"} rounded-xl p-6 flex flex-col items-center cursor-pointer shadow-sm hover:shadow-md transition-all`}
            onClick={() => setWorkspaceType("personal")}
          >
            <div className={`p-5 rounded-full mb-6 ${workspaceType === "personal" ? "bg-primary/10" : "bg-gray-100"}`}>
              {user?.profilePicture ? (
                <Avatar className="w-14 h-14">
                  <AvatarImage src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                </Avatar>
              ) : (
                <UserCircle className={`w-14 h-14 ${workspaceType === "personal" ? "text-primary" : "text-gray-500"}`} />
              )}
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">For personal use</h3>
            <p className="text-gray-600 text-base mb-6">
              Create content for a single social media profile.
            </p>
            {workspaceType === "personal" && (
              <div className="mt-2 flex items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-primary">Selected</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button
            onClick={nextStep}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base rounded-full shadow-md w-full max-w-md flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
