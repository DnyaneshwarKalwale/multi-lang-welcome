import React from 'react';
import { KonvaCarouselProvider, Slide, useKonvaCarousel } from '../contexts/KonvaCarouselContext';
import KonvaCanvas from './KonvaCanvas';
import KonvaSlideNavigator from './KonvaSlideNavigator';
import KonvaTextToolbar from './KonvaTextToolbar';
import KonvaImageToolbar from './KonvaImageToolbar';
import KonvaGlobalControls from './KonvaGlobalControls';
import Sidebar from './Sidebar';

// Editor toolbar that shows either text or image controls based on selection
const EditorToolbar: React.FC = () => {
  const { selectedNodeId, slides, currentSlideIndex } = useKonvaCarousel();
  
  // If no node selected or no current slide, don't show toolbar
  if (!selectedNodeId || !slides[currentSlideIndex]) {
    return null;
  }
  
  const selectedNode = slides[currentSlideIndex].nodes.find(
    node => node.id === selectedNodeId
  );
  
  if (!selectedNode) {
    return null;
  }
  
  // Show appropriate toolbar based on node type
  return (
    <div className="w-[280px] border-l flex-shrink-0 flex flex-col h-full">
      {selectedNode.type === 'text' && <KonvaTextToolbar />}
      {selectedNode.type === 'image' && <KonvaImageToolbar />}
    </div>
  );
};

// Main editor layout - wrapped with context provider
interface KonvaCarouselEditorProps {
  initialSlides?: Slide[];
}

const KonvaCarouselEditor: React.FC = () => {
  const { selectedNodeId, slides, currentSlideIndex } = useKonvaCarousel();
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with global controls */}
      <KonvaGlobalControls />
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Slide navigator */}
        <KonvaSlideNavigator />
        
        {/* Canvas */}
        <div className="flex-1 relative overflow-auto hide-scrollbar editor-panel">
          <KonvaCanvas />
        </div>
        
        {/* Properties toolbar */}
        <EditorToolbar />
      </div>
    </div>
  );
};

const KonvaCarouselEditorWithProvider: React.FC<KonvaCarouselEditorProps> = ({ initialSlides }) => {
  return (
    <KonvaCarouselProvider initialSlides={initialSlides}>
      <KonvaCarouselEditor />
    </KonvaCarouselProvider>
  );
};

// Export with provider wrapper
export default KonvaCarouselEditorWithProvider; 