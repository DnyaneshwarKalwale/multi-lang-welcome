import { Template, FontFamily } from '../types';

export const templates: Template[] = [
  {
    id: 'blank',
    name: 'Blank',
    thumbnail: '/templates/blank.svg',
    backgroundColor: '#ffffff',
    textElements: [],
    imageElements: []
  },
  {
    id: 'title-slide',
    name: 'Title Slide',
    thumbnail: '/templates/title.svg',
    backgroundColor: '#f0f4f8',
    textElements: [
      {
        id: 'title',
        text: 'Presentation Title',
        fontFamily: 'inter' as FontFamily,
        fontSize: 72,
        fontWeight: '700',
        color: '#2d3748',
        position: { x: 540, y: 400 },
        textAlign: 'center' as const
      },
      {
        id: 'subtitle',
        text: 'Subtitle or Author Name',
        fontFamily: 'inter' as FontFamily,
        fontSize: 36,
        fontWeight: '400',
        color: '#4a5568',
        position: { x: 540, y: 500 },
        textAlign: 'center' as const
      }
    ],
    imageElements: []
  },
  {
    id: 'content-slide',
    name: 'Content Slide',
    thumbnail: '/templates/content.svg',
    backgroundColor: '#ffffff',
    textElements: [
      {
        id: 'heading',
        text: 'Section Heading',
        fontFamily: 'inter' as FontFamily,
        fontSize: 54,
        fontWeight: '600',
        color: '#2d3748',
        position: { x: 540, y: 200 },
        textAlign: 'center' as const
      },
      {
        id: 'content',
        text: 'Main content goes here. This area can contain important information, explanations, or key points you want to communicate.',
        fontFamily: 'inter' as FontFamily,
        fontSize: 32,
        fontWeight: '400',
        color: '#4a5568',
        position: { x: 540, y: 450 },
        textAlign: 'center' as const
      }
    ],
    imageElements: []
  },
  {
    id: 'image-content',
    name: 'Image with Content',
    thumbnail: '/templates/image-content.svg',
    backgroundColor: '#ffffff',
    textElements: [
      {
        id: 'title',
        text: 'Image Title',
        fontFamily: 'inter' as FontFamily,
        fontSize: 48,
        fontWeight: '600',
        color: '#2d3748',
        position: { x: 770, y: 300 },
        textAlign: 'left' as const
      },
      {
        id: 'description',
        text: 'Add a description or explanation about the image shown on the left side.',
        fontFamily: 'inter' as FontFamily,
        fontSize: 32,
        fontWeight: '400',
        color: '#4a5568',
        position: { x: 770, y: 450 },
        textAlign: 'left' as const
      }
    ],
    imageElements: []
  },
  {
    id: 'quote',
    name: 'Quote',
    thumbnail: '/templates/quote.svg',
    backgroundColor: '#edf2f7',
    textElements: [
      {
        id: 'quote-text',
        text: '"The greatest glory in living lies not in never falling, but in rising every time we fall."',
        fontFamily: 'georgia' as FontFamily,
        fontSize: 48,
        fontWeight: '500',
        color: '#2d3748',
        position: { x: 540, y: 400 },
        textAlign: 'center' as const
      },
      {
        id: 'attribution',
        text: '- Nelson Mandela',
        fontFamily: 'inter' as FontFamily,
        fontSize: 32,
        fontWeight: '400',
        color: '#4a5568',
        position: { x: 800, y: 550 },
        textAlign: 'right' as const
      }
    ],
    imageElements: []
  },
  {
    id: 'comparison',
    name: 'Comparison',
    thumbnail: '/templates/comparison.svg',
    backgroundColor: '#ffffff',
    textElements: [
      {
        id: 'heading',
        text: 'Comparison',
        fontFamily: 'inter' as FontFamily,
        fontSize: 54,
        fontWeight: '600',
        color: '#2d3748',
        position: { x: 540, y: 150 },
        textAlign: 'center' as const
      },
      {
        id: 'left-title',
        text: 'Option A',
        fontFamily: 'inter' as FontFamily,
        fontSize: 40,
        fontWeight: '600',
        color: '#3182ce',
        position: { x: 270, y: 250 },
        textAlign: 'center' as const
      },
      {
        id: 'left-content',
        text: 'Description of the first option, features, or characteristics.',
        fontFamily: 'inter' as FontFamily,
        fontSize: 32,
        fontWeight: '400',
        color: '#4a5568',
        position: { x: 270, y: 450 },
        textAlign: 'center' as const
      },
      {
        id: 'right-title',
        text: 'Option B',
        fontFamily: 'inter' as FontFamily,
        fontSize: 40,
        fontWeight: '600',
        color: '#e53e3e',
        position: { x: 810, y: 250 },
        textAlign: 'center' as const
      },
      {
        id: 'right-content',
        text: 'Description of the second option, features, or characteristics.',
        fontFamily: 'inter' as FontFamily,
        fontSize: 32,
        fontWeight: '400',
        color: '#4a5568',
        position: { x: 810, y: 450 },
        textAlign: 'center' as const
      }
    ],
    imageElements: []
  },
  {
    id: 'list',
    name: 'List',
    thumbnail: '/templates/list.svg',
    backgroundColor: '#ffffff',
    textElements: [
      {
        id: 'title',
        text: 'Key Points',
        fontFamily: 'inter' as FontFamily,
        fontSize: 54,
        fontWeight: '600',
        color: '#2d3748',
        position: { x: 540, y: 150 },
        textAlign: 'center' as const
      },
      {
        id: 'list-items',
        text: '• First important point\n• Second important point\n• Third important point\n• Fourth important point\n• Fifth important point',
        fontFamily: 'inter' as FontFamily,
        fontSize: 36,
        fontWeight: '400',
        color: '#4a5568',
        position: { x: 540, y: 400 },
        textAlign: 'left' as const
      }
    ],
    imageElements: []
  },
  {
    id: 'image-only',
    name: 'Image Only',
    thumbnail: '/templates/image-only.svg',
    backgroundColor: '#ffffff',
    textElements: [
      {
        id: 'caption',
        text: 'Optional image caption',
        fontFamily: 'inter' as FontFamily,
        fontSize: 28,
        fontWeight: '400',
        color: '#718096',
        position: { x: 540, y: 850 },
        textAlign: 'center' as const
      }
    ],
    imageElements: []
  },
  {
    id: 'dual-image',
    name: 'Dual Image',
    thumbnail: '/templates/dual-image.svg',
    backgroundColor: '#ffffff',
    textElements: [
      {
        id: 'heading',
        text: 'Image Comparison',
        fontFamily: 'inter' as FontFamily,
        fontSize: 54,
        fontWeight: '600',
        color: '#2d3748',
        position: { x: 540, y: 150 },
        textAlign: 'center' as const
      },
      {
        id: 'left-caption',
        text: 'Before',
        fontFamily: 'inter' as FontFamily,
        fontSize: 36,
        fontWeight: '500',
        color: '#4a5568',
        position: { x: 270, y: 600 },
        textAlign: 'center' as const
      },
      {
        id: 'right-caption',
        text: 'After',
        fontFamily: 'inter' as FontFamily,
        fontSize: 36,
        fontWeight: '500',
        color: '#4a5568',
        position: { x: 810, y: 600 },
        textAlign: 'center' as const
      }
    ],
    imageElements: []
  },
  {
    id: 'closing',
    name: 'Closing Slide',
    thumbnail: '/templates/closing.svg',
    backgroundColor: '#2d3748',
    textElements: [
      {
        id: 'thank-you',
        text: 'Thank You',
        fontFamily: 'inter' as FontFamily,
        fontSize: 72,
        fontWeight: '700',
        color: '#ffffff',
        position: { x: 540, y: 400 },
        textAlign: 'center' as const
      },
      {
        id: 'contact',
        text: 'Questions? Contact: your.email@example.com',
        fontFamily: 'inter' as FontFamily,
        fontSize: 32,
        fontWeight: '400',
        color: '#e2e8f0',
        position: { x: 540, y: 550 },
        textAlign: 'center' as const
      }
    ],
    imageElements: []
  }
];

export const DEFAULT_TEXT_ELEMENT = {
  text: 'New Text',
  fontFamily: 'inter' as FontFamily,
  fontSize: 50,
  fontWeight: '400',
  color: '#000000',
  position: { x: 540, y: 540 },
  textAlign: 'center' as const
};
