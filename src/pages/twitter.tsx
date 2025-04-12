import React, { useState } from 'react';
import { TwitterContent } from '@/components/twitter';
import { Tweet, Thread } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function TwitterPage() {
  const [savedItems, setSavedItems] = useState<(Tweet | Thread)[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveItems = (items: (Tweet | Thread)[]) => {
    setSavedItems(items);
    setSaveSuccess(true);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Twitter Content Explorer</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Search Twitter Content</CardTitle>
            <CardDescription>
              Search for tweets and threads from Twitter users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TwitterContent 
              onSaveSelected={handleSaveItems}
              allowMultiSelect={true}
            />
          </CardContent>
        </Card>
        
        {saveSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>Successfully saved {savedItems.length} {savedItems.length === 1 ? 'item' : 'items'}</span>
          </div>
        )}
      </div>
    </div>
  );
} 