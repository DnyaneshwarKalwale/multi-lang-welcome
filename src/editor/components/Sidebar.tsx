import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TemplatesPanel from './sidebar/TemplatesPanel';
import TextPanel from './sidebar/TextPanel';
import BackgroundPanel from './sidebar/BackgroundPanel';
import UploadPanel from './sidebar/UploadPanel';
import { 
  LayoutTemplate, 
  Type, 
  Image, 
  Upload, 
  PanelTop, 
  Palette, 
  Linkedin,
  FileText
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Sidebar = () => {
  return (
    <div className="w-80 border-r h-full bg-white overflow-y-auto shadow-sm hide-scrollbar editor-panel">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-2">
          <Linkedin className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-gray-800">LinkedIn Content Editor</h3>
        </div>
        <p className="text-xs text-gray-500">Create professional carousel posts for LinkedIn</p>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <div className="px-4 pt-4">
          <TabsList className="w-full grid grid-cols-4 h-auto p-1">
            <TabsTrigger value="templates" className="flex flex-col items-center py-2 px-1 h-auto text-xs">
              <LayoutTemplate className="h-4 w-4 mb-1" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="text" className="flex flex-col items-center py-2 px-1 h-auto text-xs">
              <Type className="h-4 w-4 mb-1" />
              Text
            </TabsTrigger>
            <TabsTrigger value="background" className="flex flex-col items-center py-2 px-1 h-auto text-xs">
              <Palette className="h-4 w-4 mb-1" />
              Design
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex flex-col items-center py-2 px-1 h-auto text-xs">
              <div className="flex space-x-1 mb-1">
                <Image className="h-4 w-4" />
                <FileText className="h-4 w-4" />
              </div>
              Media
            </TabsTrigger>
        </TabsList>
        </div>
        
        <Separator className="my-4" />
        
        <TabsContent value="templates" className="p-4 pt-0">
          <TemplatesPanel />
        </TabsContent>
        <TabsContent value="text" className="p-4 pt-0">
          <TextPanel />
        </TabsContent>
        <TabsContent value="background" className="p-4 pt-0">
          <BackgroundPanel />
        </TabsContent>
        <TabsContent value="upload" className="p-4 pt-0">
          <UploadPanel />
        </TabsContent>
      </Tabs>
      
      <div className="p-4 border-t mt-auto">
        <div className="bg-blue-50 rounded-md p-3 text-xs text-blue-800">
          <h4 className="font-medium mb-1">LinkedIn Post Tips</h4>
          <ul className="list-disc pl-4 space-y-1">
            <li>Keep text concise with 1-2 key points per slide</li>
            <li>Use consistent fonts throughout the carousel</li>
            <li>Utilize brand colors to maintain visual identity</li>
            <li>End with a clear call-to-action slide</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
