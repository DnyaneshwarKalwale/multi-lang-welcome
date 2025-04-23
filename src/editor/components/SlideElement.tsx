
import React from 'react';
import { useCarousel } from '../contexts/CarouselContext';

interface SlideElementProps {
  children: React.ReactNode;
}

const SlideElement: React.FC<SlideElementProps> = ({ children }) => {
  return (
    <div className="slide-element">
      {children}
    </div>
  );
};

export default SlideElement;
