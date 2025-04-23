export interface TextElement {
  id: string;
  text: string;
  fontFamily: FontFamily;
  fontSize: number;
  fontWeight: FontWeight;
  textAlign: TextAlign;
  color: string;
  position: {
    x: number;
    y: number;
  };
  backgroundColor?: string;
  isItalic?: boolean;
  width?: number;
  height?: number;
  zIndex?: number;
}

export interface ImageElement {
  type: string;
  imageUrl: string;
  id: string;
  src: string;
  alt: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  isCircle?: boolean;
}

export interface PdfElement {
  id: string;
  src: string;
  currentPage: number;
  totalPages: number;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}

export interface Slide {
  id: string;
  backgroundColor: string;
  textElements: TextElement[];
  imageElements: ImageElement[];
  pdfElements: PdfElement[];
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  backgroundColor: string;
  textElements: Omit<TextElement, 'id'>[];
  imageElements: Omit<ImageElement, 'id'>[];
}

export type FontFamily = 
  | 'inter' 
  | 'poppins' 
  | 'montserrat' 
  | 'playfair' 
  | 'roboto'
  | 'lato'
  | 'open-sans'
  | 'raleway'
  | 'oswald'
  | 'merriweather'
  | 'agrandir';
export type FontWeight = '300' | '400' | '500' | '600' | '700';
export type TextAlign = 'left' | 'center' | 'right';
