# LinkedIn Carousel Editor with React Konva

This is a modern canvas-based LinkedIn carousel editor built with React and React Konva, designed to replace the previous hardcoded canvas implementation.

## Features

- **Canvas Setup**: Default canvas size of 1080x1350 (4:5) with a toggle for 1080x1080 (1:1)
- **Slide System**: Add, duplicate, delete slides with a left-side slide navigator showing thumbnails
- **Text Tools**: Add draggable/resizable text blocks with customization for font, size, color, alignment, etc.
- **Image Support**: Upload images to canvas with drag, resize, rotate, and z-index control
- **Global Styling**: Apply background styles to all slides or individual slides
- **Export Options**: Export slides as PNG or as a multi-page PDF

## Getting Started

Make sure you have the required dependencies installed:

```
npm install react-konva konva react-konva-utils react-colorful html2canvas jspdf
```

## Components

- **KonvaCarouselContext**: Context provider for state management
- **KonvaCanvas**: The main canvas component that renders slides
- **KonvaSlideNavigator**: Slide thumbnails and controls
- **KonvaTextToolbar**: Toolbar for text editing
- **KonvaImageToolbar**: Toolbar for image editing
- **KonvaGlobalControls**: Global styling and controls
- **KonvaCarouselEditor**: Main editor component that combines all components

## Usage

Simply import and use the KonvaCarouselEditor component:

```jsx
import React from 'react';
import KonvaCarouselEditor from '../components/KonvaCarouselEditor';

const MyPage = () => {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <KonvaCarouselEditor />
    </div>
  );
};

export default MyPage;
```

## Keyboard Shortcuts

- Use arrow keys to navigate between slides
- Press Delete key to remove selected nodes (if implemented)

## How It Works

The editor uses Konva.js to create a lightweight canvas-based editing experience. Each slide is a Konva Stage, and text/images are Konva nodes that can be manipulated directly on the canvas.

Unlike the previous implementation, this editor:

1. Uses proper canvas rendering for better performance
2. Offers direct manipulation of objects on canvas
3. Avoids hardcoded positioning and calculations
4. Provides a more responsive and intuitive user experience

## Credit

Built with:
- React
- React Konva
- Konva.js
- html2canvas
- jsPDF 