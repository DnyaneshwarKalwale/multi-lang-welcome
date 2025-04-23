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
    textElements: [],
    imageElements: []
  },
  {
    id: 'content-slide',
    name: 'Content Slide',
    thumbnail: '/templates/content.svg',
    backgroundColor: '#ffffff',
    textElements: [],
    imageElements: []
  },
  {
    id: 'image-content',
    name: 'Image with Content',
    thumbnail: '/templates/image-content.svg',
    backgroundColor: '#ffffff',
    textElements: [],
    imageElements: []
  },
  {
    id: 'quote',
    name: 'Quote',
    thumbnail: '/templates/quote.svg',
    backgroundColor: '#edf2f7',
    textElements: [],
    imageElements: []
  },
  {
    id: 'comparison',
    name: 'Comparison',
    thumbnail: '/templates/comparison.svg',
    backgroundColor: '#ffffff',
    textElements: [],
    imageElements: []
  },
  {
    id: 'list',
    name: 'List',
    thumbnail: '/templates/list.svg',
    backgroundColor: '#ffffff',
    textElements: [],
    imageElements: []
  },
  {
    id: 'image-only',
    name: 'Image Only',
    thumbnail: '/templates/image-only.svg',
    backgroundColor: '#ffffff',
    textElements: [],
    imageElements: []
  },
  {
    id: 'dual-image',
    name: 'Dual Image',
    thumbnail: '/templates/dual-image.svg',
    backgroundColor: '#ffffff',
    textElements: [],
    imageElements: []
  },
  {
    id: 'closing',
    name: 'Closing Slide',
    thumbnail: '/templates/closing.svg',
    backgroundColor: '#2d3748',
    textElements: [],
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
