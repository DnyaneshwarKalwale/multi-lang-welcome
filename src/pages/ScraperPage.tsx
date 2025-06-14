import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Linkedin, Globe, Youtube, Copy, 
  Lightbulb, MessageSquare, Save, Loader2,
  FileText, ArrowRight, PlusCircle, Twitter, ImageIcon, Folder,
  X, Download, ZoomIn, ZoomOut, RotateCw, RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';
import axios from 'axios';
import { saveImageToGallery } from '@/utils/cloudinaryDirectUpload';
import api from '@/services/api';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";

// Twitter imports
import { fetchUserTweets, groupThreads, saveSelectedTweets, TwitterConfig } from '@/utils/twitterApi';
import { Tweet, Thread, TweetCategory, TwitterResult } from '@/utils/twitterTypes';
import TweetCard from '@/components/twitter/TweetCard';
import TweetThread from '@/components/twitter/TweetThread';
import TweetCategories from '@/components/twitter/TweetCategories';

// PDF Viewer Modal Component
const PDFViewerModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  documentUrl: string; 
  documentTitle: string;
}> = ({ isOpen, onClose, documentUrl, documentTitle }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showFallback, setShowFallback] = useState(false);

  // Reset fallback state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setShowFallback(false);
      setZoom(100);
      setRotation(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = documentTitle;
    link.click();
  };

  // Check if this is a Cloudinary URL with auth token
  const isCloudinaryWithAuth = documentUrl.includes('cloudinary.com') && documentUrl.includes('auth_token');
  
  // For Cloudinary URLs with auth tokens, we need to handle them differently
  const getPdfViewerUrl = () => {
    if (isCloudinaryWithAuth) {
      // For Cloudinary PDFs with auth tokens, try direct URL first
      // The auth token should allow direct access
      return `${documentUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`;
    }
    return `${documentUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 truncate">{documentTitle}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-2"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">{zoom}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="p-2"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
              className="p-2"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="p-2"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className="flex justify-center">
            <div 
              style={{ 
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center top'
              }}
              className="transition-transform duration-200"
            >
              {!showFallback ? (
                <>
                  {/* Try iframe first, with fallback */}
                  <iframe
                    src={getPdfViewerUrl()}
                    className="w-[800px] h-[1000px] border border-gray-300 rounded shadow-lg bg-white"
                    title={documentTitle}
                    onLoad={(e) => {
                      console.log('PDF loaded successfully');
                      // Check if iframe content loaded properly
                      const iframe = e.target as HTMLIFrameElement;
                      try {
                        // For Cloudinary URLs, if we can't access the content, show fallback
                        if (isCloudinaryWithAuth) {
                          setTimeout(() => {
                            try {
                              // Try to access iframe content to see if it loaded
                              const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                              if (!iframeDoc || iframeDoc.body.innerHTML.includes('error') || iframeDoc.body.innerHTML.trim() === '') {
                                setShowFallback(true);
                              }
                            } catch (error) {
                              // Cross-origin error means it might be working, so don't show fallback
                              console.log('Cross-origin access blocked, PDF might be loading correctly');
                            }
                          }, 2000);
                        }
                      } catch (error) {
                        console.log('Error checking iframe content:', error);
                      }
                    }}
                    onError={() => {
                      console.warn('PDF iframe failed to load');
                      setShowFallback(true);
                    }}
                  />
                  
                  {/* Loading indicator for Cloudinary PDFs */}
                  {isCloudinaryWithAuth && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Loading document...</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Fallback content */
                <div className="w-[800px] h-[1000px] border border-gray-300 rounded shadow-lg bg-white flex flex-col items-center justify-center">
                  <FileText className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Document Preview Unavailable</h3>
                  <p className="text-sm text-gray-500 text-center mb-4 px-4">
                    This document cannot be previewed in the browser. You can download it to view the content.
                  </p>
                  <Button onClick={handleDownload} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download Document
                    </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Interfaces for existing functionality
interface ScraperResult {
  content: string;
  keyPoints: string[];
  tone: string;
  suggestedHook: string;
  estimatedReadTime: number;
  wordCount: number;
}

interface OldTweet {
  id: string;
  text: string;
  full_text?: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  author: {
    id: string;
    name: string;
    username: string;
    profile_image_url: string;
  };
  media?: {
    media_key: string;
    type: string;
    url: string;
    preview_image_url?: string;
    alt_text?: string;
    width?: number;
    height?: number;
  }[];
}

interface OldTwitterResult {
  tweets: OldTweet[];
  username: string;
  profileImageUrl?: string;
}

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  duration: string;
  view_count: number;
  upload_date: string;
  transcript?: string;
  formattedTranscript?: string[];
  language?: string;
  is_generated?: boolean;
  channelName?: string;
}

interface YouTubeChannelResult {
  videos: YouTubeVideo[];
  channelName: string;
  channelImageUrl?: string; // Optional channel image URL
}

interface LinkedInPost {
  id: string;
  content: string;
  date: string;
  dateRelative: string;
  likes: number;
  comments: number;
  shares: number;
  reactions: number;
  url: string;
  author: string;
  authorHeadline: string;
  authorAvatar: string;
  authorProfile: string;
  media: {
    type: string;
    url: string;
    width?: number;
    height?: number;
  }[];
  videos: {
    type: string;
    url: string;
    thumbnail?: string;
    duration?: string;
  }[];
  documents: {
    type: string;
    title: string;
    url: string;
    coverPages: any[];
    totalPageCount: number;
    fileType: string;
  }[];
  type: string;
  isRepost: boolean;
  originalPost?: {
    content: string;
    author: string;
    authorInfo: string;
    authorAvatar: string;
    date: string;
  };
}

interface LinkedInProfileData {
  name: string;
  headline: string;
  profileUrl: string;
  avatar: string;
  publicIdentifier: string;
  username: string;
}

interface LinkedInResult {
  profileData: LinkedInProfileData;
  posts: LinkedInPost[];
  totalPosts: number;
  message: string;
}

// Add custom styles for LinkedIn-like UI
const linkedinStyles = `
  .linkedin-post-card {
    transition: all 0.2s ease-in-out;
  }
  
  .linkedin-post-card:hover {
    transform: translateY(-2px);
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .break-words {
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }
  
  .text-overflow-ellipsis {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  
  .snap-x {
    scroll-snap-type: x mandatory;
  }
  
  .snap-start {
    scroll-snap-align: start;
  }
  
  .carousel-dots {
    transition: all 0.2s ease;
  }
  
  .carousel-dots:hover {
    transform: scale(1.2);
  }
  
  .linkedin-post-content {
    max-width: 100%;
    overflow: hidden;
  }
  
  .linkedin-post-content p {
    margin: 0;
    line-height: 1.5;
  }
  
  .document-carousel {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .document-carousel:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

// LinkedIn Document Carousel Component
const LinkedInDocumentCarousel: React.FC<{ 
  document: any, 
  postId: string,
  onOpenPdf: (url: string, title: string) => void 
}> = ({ document: docData, postId, onOpenPdf }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const coverPages = docData.coverPages || [];
  
  // Helper function to extract preview images from cover pages
  const getPreviewImages = React.useCallback(() => {
    const previewImages: string[] = [];
    coverPages.forEach((page: any) => {
      if (page.imageUrls && Array.isArray(page.imageUrls)) {
        // Handle the structure from the reference code: page.imageUrls array
        previewImages.push(...page.imageUrls);
      } else if (page.url || page.image || typeof page === 'string') {
        // Handle direct URL structure or string URLs
        previewImages.push(page.url || page.image || page);
      }
    });
    return previewImages;
  }, [coverPages]);
  
  React.useEffect(() => {
    const carousel = document.getElementById(`doc-carousel-${postId}-${docData.title}`);
    if (!carousel) return;
    
    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const itemWidth = carousel.offsetWidth;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(newIndex);
    };
    
    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, [postId, docData.title]);
  
  const scrollToIndex = (index: number) => {
    const carousel = document.getElementById(`doc-carousel-${postId}-${docData.title}`);
    if (carousel) {
      carousel.scrollTo({ 
        left: index * carousel.offsetWidth, 
        behavior: 'smooth' 
      });
    }
  };
  
    if (!coverPages || coverPages.length === 0) {
    // Fallback to simple document display
    return (
      <div 
        className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={() => docData.url && onOpenPdf(docData.url, docData.title)}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 break-words line-clamp-2">{docData.title}</p>
            <div className="flex items-center gap-2 mt-1">
              {docData.totalPageCount && (
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  {docData.totalPageCount} pages
                </span>
              )}
              <span className="text-xs text-gray-500 bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {docData.fileType?.toUpperCase() || 'PDF'}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
              View
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white document-carousel">
      {/* Document Header */}
      <div className="p-3 border-b border-gray-100 bg-gray-50">
                          <div className="flex items-center gap-2">
           <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
           <div className="flex-1 min-w-0">
             <p className="text-sm font-medium text-gray-900 break-words line-clamp-2">{docData.title}</p>
             <div className="flex items-center gap-2 mt-1">
               {docData.totalPageCount && (
                 <span className="text-xs text-gray-500">
                   {docData.totalPageCount} pages
                 </span>
               )}
               <span className="text-xs text-gray-400">•</span>
               <span className="text-xs text-gray-500">
                 {docData.fileType?.toUpperCase() || 'PDF'}
               </span>
             </div>
           </div>
         </div>
      </div>
      
      {/* Cover Pages Carousel */}
      <div className="relative">
        <div 
          id={`doc-carousel-${postId}-${docData.title}`}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        >
                    {(() => {
            const previewImages = getPreviewImages();
            
            return previewImages.map((imageUrl: string, pageIndex: number) => (
              <div 
                key={`${postId}-doc-page-${pageIndex}`}
                className="flex-none w-full snap-start"
              >
                <div className="relative bg-gray-100">
                  <img 
                    src={imageUrl} 
                    alt={`Page ${pageIndex + 1} of ${docData.title}`} 
                    className="w-full h-64 object-contain cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => docData.url && onOpenPdf(docData.url, docData.title)}
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {/* Fallback content if image fails */}
                  <div 
                    className="absolute inset-0 bg-gray-100 flex items-center justify-center"
                    style={{ display: 'none' }}
                  >
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Page {pageIndex + 1}</p>
                    </div>
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>
        
        {/* Navigation arrows */}
        {(() => {
          const previewImages = getPreviewImages();
          
          return previewImages.length > 1 && (
            <>
              <button
                onClick={() => scrollToIndex(Math.max(0, currentIndex - 1))}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all"
                disabled={currentIndex === 0}
              >
                ‹
              </button>
              <button
                onClick={() => scrollToIndex(Math.min(previewImages.length - 1, currentIndex + 1))}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all"
                disabled={currentIndex === previewImages.length - 1}
              >
                ›
              </button>
            </>
          );
        })()}
        
        {/* Page counter */}
        {(() => {
          const previewImages = getPreviewImages();
          
          return previewImages.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {currentIndex + 1} / {previewImages.length}
            </div>
          );
        })()}
      </div>
      
            {/* Footer with action */}
      <div className="p-3 bg-gray-50 border-t border-gray-100">
        {/* Show message if there are more pages than previews */}
        {(() => {
          const previewImages = getPreviewImages();
          
          return docData.totalPageCount && previewImages.length < docData.totalPageCount && (
            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700 flex items-center gap-2">
              <FileText className="h-3 w-3" />
              <span>
                Showing {previewImages.length} of {docData.totalPageCount} pages. 
                                 <button 
                   onClick={() => docData.url && onOpenPdf(docData.url, docData.title)}
                   className="ml-1 text-blue-600 hover:underline font-medium"
                 >
                   View full document
                 </button>
              </span>
            </div>
          );
        })()}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => docData.url && onOpenPdf(docData.url, docData.title)}
          className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <FileText className="h-3 w-3 mr-1" />
          View Full Document
        </Button>
      </div>
      
      {/* Dot indicators */}
      {(() => {
        const previewImages = getPreviewImages();
        
        return previewImages.length > 1 && (
          <div className="flex justify-center py-2 gap-1 bg-gray-50">
            {previewImages.map((_: string, dotIndex: number) => (
              <button 
                key={`doc-dot-${dotIndex}`}
                className={`w-1.5 h-1.5 rounded-full transition-all carousel-dots ${
                  dotIndex === currentIndex 
                    ? 'bg-blue-600 scale-110' 
                    : 'bg-gray-300 hover:bg-gray-500'
                }`}
                onClick={() => scrollToIndex(dotIndex)}
              />
            ))}
          </div>
        );
      })()}
    </div>
  );
};

// LinkedIn Carousel Component
const LinkedInCarousel: React.FC<{ post: LinkedInPost }> = ({ post }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  React.useEffect(() => {
    const carousel = document.getElementById(`carousel-${post.id}`);
    if (!carousel) return;
    
    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const itemWidth = carousel.offsetWidth;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(newIndex);
    };
    
    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, [post.id]);
  
  const scrollToIndex = (index: number) => {
    const carousel = document.getElementById(`carousel-${post.id}`);
    if (carousel) {
      carousel.scrollTo({ 
        left: index * carousel.offsetWidth, 
        behavior: 'smooth' 
      });
    }
  };
  
  return (
    <div className="relative">
      <div 
        id={`carousel-${post.id}`}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory rounded-lg"
      >
        {post.media.map((media, mediaIndex) => (
          <div 
            key={`${post.id}-media-${mediaIndex}`}
            className="flex-none w-full snap-start"
          >
            <img 
              src={media.url} 
              alt={`Post media ${mediaIndex + 1}`} 
              className="w-full h-48 object-cover cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => window.open(media.url, '_blank')}
            />
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      {post.media.length > 1 && (
        <>
          <button
            onClick={() => scrollToIndex(Math.max(0, currentIndex - 1))}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all"
            disabled={currentIndex === 0}
          >
            ‹
          </button>
          <button
            onClick={() => scrollToIndex(Math.min(post.media.length - 1, currentIndex + 1))}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all"
            disabled={currentIndex === post.media.length - 1}
          >
            ›
          </button>
        </>
      )}
      
      {/* Counter */}
      {post.media.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          {currentIndex + 1} / {post.media.length}
        </div>
      )}
      
      {/* Dot indicators */}
      {post.media.length > 1 && (
        <div className="flex justify-center mt-2 gap-1">
          {post.media.map((_, dotIndex) => (
            <button 
              key={`dot-${dotIndex}`}
              className={`w-2 h-2 rounded-full transition-all carousel-dots ${
                dotIndex === currentIndex 
                  ? 'bg-blue-600 scale-110' 
                  : 'bg-gray-300 hover:bg-gray-500'
              }`}
              onClick={() => scrollToIndex(dotIndex)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ScraperPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('youtube');
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScraperResult | null>(null);
  const [twitterResult, setTwitterResult] = useState<TwitterResult | null>(null);
  const [selectedTweets, setSelectedTweets] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<TweetCategory>('all');
  const [twitterThreads, setTwitterThreads] = useState<Thread[]>([]);
  const [selectedThreads, setSelectedThreads] = useState<Set<string>>(new Set());
  const [contentPreferences, setContentPreferences] = useState({
    format: 'short',
    tone: 'professional'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [linkedinContent, setLinkedinContent] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedContentImage, setGeneratedContentImage] = useState<string | null>(null);
  const [youtubeChannelResult, setYoutubeChannelResult] = useState<YouTubeChannelResult | null>(null);
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  const [isFetchingChannel, setIsFetchingChannel] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string>("");
  const [loadingTranscriptIds, setLoadingTranscriptIds] = useState<Set<string>>(new Set());
  const [retryCount, setRetryCount] = useState<Record<string, number>>({});
  const [lastSearchedChannel, setLastSearchedChannel] = useState<string>('');
  const [lastSearchedLinkedInProfile, setLastSearchedLinkedInProfile] = useState<string>('');
  const [videosWithTranscripts, setVideosWithTranscripts] = useState<Set<string>>(new Set());
  const [linkedinResult, setLinkedinResult] = useState<LinkedInResult | null>(null);
  const [selectedLinkedInPosts, setSelectedLinkedInPosts] = useState<Set<string>>(new Set());
  const [isScrapingLinkedIn, setIsScrapingLinkedIn] = useState(false);
  const [pdfViewerState, setPdfViewerState] = useState<{
    isOpen: boolean;
    documentUrl: string;
    documentTitle: string;
  }>({
    isOpen: false,
    documentUrl: '',
    documentTitle: ''
  });
  // Add Twitter-specific state
  const [lastSearchedTwitterUser, setLastSearchedTwitterUser] = useState<string>('');
  const [showSavedPosts, setShowSavedPosts] = useState(false);
  const [savedTwitterPosts, setSavedTwitterPosts] = useState<Tweet[]>([]);
  const [savedLinkedInPosts, setSavedLinkedInPosts] = useState<any[]>([]);
  const [savedPostsModalOpen, setSavedPostsModalOpen] = useState(false);

  // Load saved posts from localStorage
  const loadSavedPosts = () => {
    try {
      const savedTweets = JSON.parse(localStorage.getItem('savedTwitterPosts') || '[]');
      const savedLinkedIn = JSON.parse(localStorage.getItem('savedLinkedInPosts') || '[]');
      
      setSavedTwitterPosts(savedTweets);
      setSavedLinkedInPosts(savedLinkedIn);
    } catch (error) {
      console.error('Error loading saved posts:', error);
    }
  };

  // Load saved posts when component mounts
  useEffect(() => {
    loadSavedPosts();
  }, []);

  // Helper functions for toast
  const toastSuccess = (message: string) => {
    toast({
      description: message,
      variant: "default",
    });
  };

  const toastError = (message: string) => {
    toast({
      description: message,
      variant: "destructive",
    });
  };

  // PDF Viewer functions
  const openPdfViewer = (documentUrl: string, documentTitle: string) => {
    setPdfViewerState({
      isOpen: true,
      documentUrl,
      documentTitle
    });
  };

  const closePdfViewer = () => {
    setPdfViewerState({
      isOpen: false,
      documentUrl: '',
      documentTitle: ''
    });
  };

  // Save YouTube channel results to localStorage
  const saveYoutubeChannelToStorage = (channelResult: YouTubeChannelResult) => {
    try {
      localStorage.setItem('youtubeChannelResult', JSON.stringify(channelResult));
      localStorage.setItem('lastSearchedChannel', channelResult.channelName);
    } catch (error) {
      console.error('Error saving YouTube channel to localStorage:', error);
    }
  };

  // Save LinkedIn results to localStorage
  const saveLinkedInResultToStorage = (linkedinResult: LinkedInResult) => {
    try {
      localStorage.setItem('linkedinResult', JSON.stringify(linkedinResult));
      localStorage.setItem('lastSearchedLinkedInProfile', linkedinResult.profileData.username);
    } catch (error) {
      console.error('Error saving LinkedIn result to localStorage:', error);
    }
  };

  // Load YouTube channel results from localStorage
  const loadYoutubeChannelFromStorage = () => {
    try {
      const savedChannel = localStorage.getItem('youtubeChannelResult');
      const lastChannel = localStorage.getItem('lastSearchedChannel');
      
      if (savedChannel) {
        setYoutubeChannelResult(JSON.parse(savedChannel));
      }
      
      if (lastChannel) {
        setLastSearchedChannel(lastChannel);
      }
    } catch (error) {
      console.error('Error loading YouTube channel from localStorage:', error);
    }
  };

  // Load LinkedIn results from localStorage
  const loadLinkedInResultFromStorage = () => {
    try {
      const savedLinkedInResult = localStorage.getItem('linkedinResult');
      const lastLinkedInProfile = localStorage.getItem('lastSearchedLinkedInProfile');
      
      if (savedLinkedInResult) {
        setLinkedinResult(JSON.parse(savedLinkedInResult));
      }
      
      if (lastLinkedInProfile && !inputUrl) {
        setInputUrl(lastLinkedInProfile);
      }
    } catch (error) {
      console.error('Error loading LinkedIn result from localStorage:', error);
    }
  };

  // Save Twitter results to localStorage
  const saveTwitterResultToStorage = (twitterResult: TwitterResult) => {
    try {
      // Validate the data structure before saving
      const validatedResult = {
        tweets: Array.isArray(twitterResult.tweets) ? twitterResult.tweets : [],
        threads: Array.isArray(twitterResult.threads) ? twitterResult.threads : [],
        username: twitterResult.username || '',
        profileImageUrl: twitterResult.profileImageUrl || '',
        totalCount: typeof twitterResult.totalCount === 'number' ? twitterResult.totalCount : 0,
        categories: twitterResult.categories || {
          all: 0,
          normal: 0,
          thread: 0,
          long: 0
        }
      };

      localStorage.setItem('twitterResult', JSON.stringify(validatedResult));
      localStorage.setItem('lastSearchedTwitterUser', validatedResult.username);
    } catch (error) {
      console.error('Error saving Twitter result to localStorage:', error);
    }
  };

  // Load Twitter results from localStorage
  const loadTwitterResultFromStorage = () => {
    try {
      const savedTwitterResult = localStorage.getItem('twitterResult');
      const lastTwitterUser = localStorage.getItem('lastSearchedTwitterUser');
      
      if (savedTwitterResult) {
        const twitterData = JSON.parse(savedTwitterResult);
        
        // Validate and fix the data structure
        if (twitterData && typeof twitterData === 'object') {
          // Ensure required properties exist with proper defaults
          const validTwitterResult: TwitterResult = {
            tweets: Array.isArray(twitterData.tweets) ? twitterData.tweets : [],
            threads: Array.isArray(twitterData.threads) ? twitterData.threads : [],
            username: twitterData.username || '',
            profileImageUrl: twitterData.profileImageUrl || '',
            totalCount: typeof twitterData.totalCount === 'number' ? twitterData.totalCount : (twitterData.tweets?.length || 0),
            categories: twitterData.categories || {
              all: twitterData.totalCount || twitterData.tweets?.length || 0,
              normal: 0,
              thread: 0,
              long: 0
            }
          };
          
          setTwitterResult(validTwitterResult);
          setTwitterThreads(validTwitterResult.threads);
          console.log(`Loaded ${validTwitterResult.totalCount} tweets from cache for @${validTwitterResult.username}`);
        } else {
          console.warn('Invalid Twitter data structure, clearing cache');
          localStorage.removeItem('twitterResult');
        }
      }
      
      if (lastTwitterUser) {
        setLastSearchedTwitterUser(lastTwitterUser);
      }
    } catch (error) {
      console.error('Error loading Twitter result from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('twitterResult');
      localStorage.removeItem('lastSearchedTwitterUser');
    }
  };

  // Clear previous channel results when searching for a new channel
  useEffect(() => {
    if (activeTab === 'youtube' && inputUrl && lastSearchedChannel && !inputUrl.includes(lastSearchedChannel)) {
      // User is searching for a different channel, clear the previous results
      setYoutubeChannelResult(null);
    }
  }, [activeTab, inputUrl, lastSearchedChannel]);

  // Clear previous LinkedIn results when searching for a new profile
  useEffect(() => {
    if (activeTab === 'linkedin' && inputUrl && lastSearchedLinkedInProfile && !inputUrl.includes(lastSearchedLinkedInProfile)) {
      // User is searching for a different profile, clear the previous results
      setLinkedinResult(null);
    }
  }, [activeTab, inputUrl, lastSearchedLinkedInProfile]);

  // Clear previous Twitter results when searching for a new user
  useEffect(() => {
    if (activeTab === 'twitter' && inputUrl && lastSearchedTwitterUser && !inputUrl.includes(lastSearchedTwitterUser)) {
      // User is searching for a different Twitter user, clear the previous results
      setTwitterResult(null);
    }
  }, [activeTab, inputUrl, lastSearchedTwitterUser]);

  // Update input URL on mount if we have a last searched channel
  useEffect(() => {
    if (activeTab === 'youtube' && lastSearchedChannel && !inputUrl) {
      setInputUrl(lastSearchedChannel.startsWith('@') ? lastSearchedChannel : `@${lastSearchedChannel}`);
    }
  }, [activeTab, lastSearchedChannel, inputUrl]);

  // Update input URL on mount if we have a last searched LinkedIn profile
  useEffect(() => {
    if (activeTab === 'linkedin' && lastSearchedLinkedInProfile && !inputUrl) {
      setInputUrl(lastSearchedLinkedInProfile);
    }
  }, [activeTab, lastSearchedLinkedInProfile, inputUrl]);

  // Update input URL on mount if we have a last searched Twitter user
  useEffect(() => {
    if (activeTab === 'twitter' && lastSearchedTwitterUser && !inputUrl) {
      setInputUrl(lastSearchedTwitterUser.startsWith('@') ? lastSearchedTwitterUser : `@${lastSearchedTwitterUser}`);
    }
  }, [activeTab, lastSearchedTwitterUser, inputUrl]);

  // Handle clearing YouTube results when needed
  const clearYoutubeResults = () => {
    setYoutubeChannelResult(null);
    setLastSearchedChannel('');
    localStorage.removeItem('youtubeChannelResult');
    localStorage.removeItem('lastSearchedChannel');
  };

  // Handle clearing LinkedIn results when needed
  const clearLinkedInResults = () => {
    setLinkedinResult(null);
    setLastSearchedLinkedInProfile('');
    localStorage.removeItem('linkedinResult');
    localStorage.removeItem('lastSearchedLinkedInProfile');
  };

  // Handle clearing Twitter results when needed
  const clearTwitterResults = () => {
    setTwitterResult(null);
    setLastSearchedTwitterUser('');
    setSelectedTweets(new Set());
    setSelectedThreads(new Set());
    localStorage.removeItem('twitterResult');
    localStorage.removeItem('lastSearchedTwitterUser');
  };

  // Handle LinkedIn profile scraping
  const handleLinkedInScrape = async () => {
    if (!inputUrl) {
      toastError('Please enter a LinkedIn username');
      return;
    }

    // Extract username from URL or use as is
    let username = inputUrl.trim();
    if (username.includes('linkedin.com/in/')) {
      const match = username.match(/linkedin\.com\/in\/([^\/\?]+)/);
      username = match ? match[1] : username;
    }
    
    // Remove @ if present
    username = username.replace('@', '').replace('/', '');

    // If searching for a different profile, clear previous results
    if (lastSearchedLinkedInProfile && lastSearchedLinkedInProfile !== username) {
      clearLinkedInResults();
    }

    setIsScrapingLinkedIn(true);
    setLinkedinResult(null);
    setSelectedLinkedInPosts(new Set());

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
      const token = localStorage.getItem('token');
      
      // Prepare headers - include auth if available, but don't require it
      const headers: any = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.post(`${apiBaseUrl}/linkedin/scrape-profile`, {
        username: username
      }, { headers });

      if (response.data.success) {
        setLinkedinResult(response.data);
        setLastSearchedLinkedInProfile(username);
        
        // Save to localStorage for persistence
        saveLinkedInResultToStorage(response.data);
        
        toastSuccess(`Successfully scraped ${response.data.totalPosts} posts from @${username}`);
      } else {
        toastError(response.data.message || 'Failed to scrape LinkedIn profile');
      }
    } catch (error: any) {
      console.error('LinkedIn scraping error:', error);
      toastError(error.response?.data?.message || 'Failed to scrape LinkedIn profile');
    } finally {
      setIsScrapingLinkedIn(false);
    }
  };

  // Modified YouTube channel scrape handler to clear previous results
  const handleYouTubeChannelScrape = async () => {
    if (!inputUrl) {
      toastError('Please enter a YouTube channel URL or @handle');
      return;
    }

    // Extract channel name for comparison
    const inputChannelName = inputUrl.includes('@') ? inputUrl.split('@')[1] : inputUrl;
    
    // If searching for a different channel, clear previous results
    if (lastSearchedChannel && lastSearchedChannel !== inputChannelName) {
      clearYoutubeResults();
    }

    setIsFetchingChannel(true);
    
    try {
      const response = await api.post('/youtube/channel', {
        channelName: inputUrl
      });
      
      if (response.data && response.data.success) {
        // Get channel name from the first video if available
        let detectedChannelName = inputChannelName;
        if (response.data.data && response.data.data.length > 0 && response.data.data[0].channelName) {
          detectedChannelName = response.data.data[0].channelName;
        }
        
        const channelResult = {
          videos: response.data.data,
          channelName: detectedChannelName
        };
        
        setYoutubeChannelResult(channelResult);
        setLastSearchedChannel(inputChannelName); // Keep using input for search comparison
        
        // Save to localStorage for persistence
        saveYoutubeChannelToStorage(channelResult);
        
        toastSuccess(`Found ${response.data.data.length} videos from ${detectedChannelName}`);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch channel videos');
      }
    } catch (error) {
      console.error('Error fetching YouTube channel:', error);
      toastError('Failed to fetch channel videos. Please try again.');
    } finally {
      setIsFetchingChannel(false);
    }
  };

  const handleScrape = async () => {
    if (!inputUrl) {
      toastError('Please enter a valid URL');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (activeTab === 'twitter') {
        await handleTwitterScrape();
      } else if (activeTab === 'youtube') {
        if (inputUrl.includes('/channel/') || inputUrl.includes('/@') || inputUrl.startsWith('@')) {
          await handleYouTubeChannelScrape();
        } else {
          toastError('Please enter a YouTube channel URL or @handle');
        }
      } else if (activeTab === 'linkedin') {
        await handleLinkedInScrape();
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResult({
          content: "This is sample extracted content. In a real implementation, this would be the content scraped from the provided URL.",
          keyPoints: [
            "Sample key point 1",
            "Sample key point 2",
            "Sample key point 3"
          ],
          tone: "Professional",
          suggestedHook: "Here's an interesting insight from the content...",
          estimatedReadTime: 2,
          wordCount: 150
        });
        toastSuccess('Content scraped successfully!');
      }
    } catch (error) {
      console.error(`Error scraping content from ${activeTab}:`, error);
      toastError(`Failed to scrape content from ${activeTab}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwitterScrape = async () => {
    let username = inputUrl;
    
    if (inputUrl.includes('twitter.com/') || inputUrl.includes('x.com/')) {
      const urlParts = inputUrl.split('/');
      username = urlParts[urlParts.length - 1];
      username = username.split('?')[0];
    }
    
    if (username.startsWith('@')) {
      username = username.substring(1);
    }
    
    if (!username) {
      toastError('Please enter a valid Twitter username');
      return;
    }
    
    // If searching for a different user, clear previous results
    if (lastSearchedTwitterUser && lastSearchedTwitterUser !== username) {
      clearTwitterResults();
    }
    
    try {
      // Use the backend API instead of frontend API calls
      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
      const apiUrl = baseUrl.endsWith('/api') 
        ? `${baseUrl}/twitter/user/${username}`
        : `${baseUrl}/api/twitter/user/${username}`;
      
      const response = await axios.get(apiUrl);
    
    if (response.data && response.data.success) {
        const tweets: Tweet[] = response.data.data;
        
        // Group tweets into threads
        const groupedData = groupThreads(tweets);
        const threads: Thread[] = [];
        const standaloneTweets: Tweet[] = [];
        
        groupedData.forEach(item => {
          if ('tweets' in item) {
            threads.push(item);
          } else {
            standaloneTweets.push(item);
          }
        });
        
        // Calculate category counts
        const categories: Record<TweetCategory, number> = {
          all: tweets.length,
          normal: standaloneTweets.length,
          thread: threads.reduce((count, thread) => count + thread.tweets.length, 0),
          long: tweets.filter(tweet => tweet.is_long || (tweet.full_text && tweet.full_text.length > 280)).length
        };
        
        const twitterResult: TwitterResult = {
          tweets: standaloneTweets,
          threads,
          username,
          profileImageUrl: tweets[0]?.author?.profile_image_url,
          totalCount: tweets.length,
          categories
        };
        
        setTwitterResult(twitterResult);
        setTwitterThreads(threads);
        setLastSearchedTwitterUser(username);
        
        // Save to localStorage for persistence
        saveTwitterResultToStorage(twitterResult);
      
      toastSuccess(`Successfully retrieved ${tweets.length} tweets from @${username}`);
    } else {
      throw new Error(response.data?.message || 'Failed to fetch tweets');
      }
    } catch (error) {
      console.error('Error fetching tweets:', error);
      toastError('Failed to fetch tweets. Please try again.');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toastSuccess('Copied to clipboard!');
  };

  const handleSaveToInspiration = () => {
    toastSuccess('Saved to Inspiration Vault!');
  };

  const handleCreatePost = () => {
    navigate('/dashboard/post');
  };

  const handleToggleTweetSelection = (tweet: Tweet) => {
    const newSelection = new Set(selectedTweets);
    
    if (newSelection.has(tweet.id)) {
      newSelection.delete(tweet.id);
    } else {
      newSelection.add(tweet.id);
    }
    
    setSelectedTweets(newSelection);
  };

  const handleToggleThreadSelection = (thread: Thread, select: boolean) => {
    const newSelectedThreads = new Set(selectedThreads);
    const newSelectedTweets = new Set(selectedTweets);
    
    if (select) {
      newSelectedThreads.add(thread.id);
      thread.tweets.forEach(tweet => newSelectedTweets.add(tweet.id));
    } else {
      newSelectedThreads.delete(thread.id);
      thread.tweets.forEach(tweet => newSelectedTweets.delete(tweet.id));
    }
    
    setSelectedThreads(newSelectedThreads);
    setSelectedTweets(newSelectedTweets);
  };

  const handleToggleLinkedInPostSelection = (postId: string) => {
    const newSelection = new Set(selectedLinkedInPosts);
    
    if (newSelection.has(postId)) {
      newSelection.delete(postId);
    } else {
      newSelection.add(postId);
    }
    
    setSelectedLinkedInPosts(newSelection);
  };

  const handleSaveSelectedTweets = async () => {
    if (selectedTweets.size === 0) {
      toastError('Please select at least one tweet to save');
      return;
    }
    
    if (!twitterResult || !twitterResult.tweets) {
      toastError('No tweets available to save');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Collect all selected tweets from both standalone tweets and threads
      const allTweets = [
        ...(Array.isArray(twitterResult.tweets) ? twitterResult.tweets : []),
        ...(Array.isArray(twitterResult.threads) ? twitterResult.threads.flatMap(thread => thread.tweets || []) : [])
      ];
      
      const tweetsToSave = allTweets.filter(tweet => 
        tweet && tweet.id && selectedTweets.has(tweet.id)
      );
      
      if (tweetsToSave.length === 0) {
        toastError('No valid tweets found to save');
        return;
      }
      
      // Use the saveSelectedTweets function from twitterApi
      const success = await saveSelectedTweets(tweetsToSave, user?.email || 'anonymous');
      
      if (success) {
        toastSuccess(`Saved ${tweetsToSave.length} tweets successfully!`);
        setSelectedTweets(new Set());
        setSelectedThreads(new Set());
        // Refresh saved posts list
        loadSavedPosts();
      } else {
        throw new Error('Failed to save tweets');
      }
    } catch (error) {
      console.error('Error saving tweets:', error);
      toastError('Failed to save tweets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSelectedLinkedInPosts = async () => {
    if (selectedLinkedInPosts.size === 0) {
      toastError('Please select at least one LinkedIn post to save');
      return;
    }
    
    if (!linkedinResult || !linkedinResult.posts) {
      toastError('No LinkedIn posts available to save');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const postsToSave = linkedinResult.posts.filter(post => 
        selectedLinkedInPosts.has(post.id)
      );
      
      // Save to backend first
      let backendSaveSuccess = false;
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://backend-scripe.onrender.com/api';
        const response = await axios.post(`${apiBaseUrl}/linkedin/save-scraped-posts`, {
          posts: postsToSave,
          profileData: linkedinResult.profileData,
          userId: user?.id || 'anonymous'
        });

        if (response.data.success) {
          backendSaveSuccess = true;
          toastSuccess(`Saved ${response.data.count} LinkedIn posts to cloud!`);
        } else {
          console.warn("Backend save warning:", response.data.message);
          toastError("Failed to save posts to cloud: " + response.data.message);
        }
      } catch (backendError) {
        console.error("Error saving LinkedIn posts to backend:", backendError);
        toastError("Failed to save posts to cloud. Saving locally as backup.");
      }
      
      // Save to localStorage as backup (even if backend save succeeds)
      try {
        const existingSavedPosts = JSON.parse(localStorage.getItem('savedLinkedInPosts') || '[]');
        const newSavedPosts = [...existingSavedPosts, ...postsToSave.map(post => ({
          ...post,
          savedAt: new Date().toISOString(),
          profileData: linkedinResult.profileData
        }))];
        
        localStorage.setItem('savedLinkedInPosts', JSON.stringify(newSavedPosts));
        
        if (!backendSaveSuccess) {
          toastSuccess(`Saved ${postsToSave.length} LinkedIn posts to local storage as backup`);
        } else {
          toastSuccess(`Posts saved successfully to cloud and local storage!`);
        }
      } catch (localStorageError) {
        console.error("Error saving to localStorage:", localStorageError);
        if (!backendSaveSuccess) {
          toastError("Failed to save posts both to cloud and locally.");
        }
      }
      
      setSelectedLinkedInPosts(new Set());
      // Refresh saved posts list
      loadSavedPosts();
    } catch (error) {
      console.error('Error saving LinkedIn posts:', error);
      toastError('Failed to save LinkedIn posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSelectedVideos = async () => {
    if (selectedVideos.size === 0 || !youtubeChannelResult) {
      toastError('Please select at least one video');
      return;
    }

    setIsLoading(true);
    
    try {
      const videosToSave = youtubeChannelResult.videos.filter(video => 
        selectedVideos.has(video.id)
      );

      // Current timestamp to ensure all videos in this batch have the same save time
      const savedTimestamp = new Date().toISOString();

      // Enhance videos but WITHOUT dummy transcripts
      const enhancedVideos = videosToSave.map(video => ({
        ...video,
        // Don't include transcript data if we haven't fetched it
        // transcript: "This is a placeholder transcript. The real transcript would contain the full text from the video.", // Dummy full transcript - REMOVED
        // formattedTranscript: generateDummyTranscript(video.id), // Array of bullet points - REMOVED
        language: "English",
        is_generated: false,
        savedAt: savedTimestamp,
        status: 'ready',
        videoId: video.id, // Ensure videoId is explicitly set
        savedTimestamp: savedTimestamp, // Add explicit timestamp for sorting
        userId: user?.id || 'anonymous'
      }));

      let backendSaveSuccess = false;
      
      // Save to backend first - this should be the primary storage
      try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
      const apiUrl = baseUrl.endsWith('/api')
          ? `${baseUrl}/youtube/save-videos`
          : `${baseUrl}/api/youtube/save-videos`;
        
        const backendResponse = await axios.post(apiUrl, {
          videos: enhancedVideos,
          userId: user?.id || 'anonymous'
        });
        
        if (backendResponse.data.success) {
          backendSaveSuccess = true;
          toastSuccess(`Saved ${backendResponse.data.count} videos to cloud!`);
        } else {
          console.warn("Backend save warning:", backendResponse.data.message);
          toastError("Failed to save videos to cloud: " + backendResponse.data.message);
        }
      } catch (backendError) {
        console.error("Error saving videos to backend:", backendError);
        toastError("Failed to save videos to cloud. Saving locally as backup.");
      }

      // Save videos locally as a backup/fallback (even if backend save succeeds)
      let existingSavedVideos = [];
      try {
        const existingSavedVideosStr = localStorage.getItem('savedYoutubeVideos');
        if (existingSavedVideosStr) {
          existingSavedVideos = JSON.parse(existingSavedVideosStr);
        }
      } catch (error) {
        console.error("Error parsing existing saved videos:", error);
      }
      
      // Combine existing videos with new ones, replacing duplicates
      const allVideoIds = new Map();
      
      // First add existing videos
      existingSavedVideos.forEach((video: any) => {
        allVideoIds.set(video.id || video.videoId, video);
      });
      
      // Then add new videos (will overwrite existing ones with same ID)
      enhancedVideos.forEach(video => {
        allVideoIds.set(video.id || video.videoId, video);
      });
      
      // Convert map back to array
      const allSavedVideos = Array.from(allVideoIds.values());
      
      // Save to localStorage as backup
        localStorage.setItem('savedYoutubeVideos', JSON.stringify(allSavedVideos));
        
      // Let user know videos were saved
      if (!backendSaveSuccess) {
        toastSuccess(`Saved ${enhancedVideos.length} videos to local storage as backup`);
      } else {
        toastSuccess(`Videos saved successfully to cloud and local storage!`);
      }
      
        setSelectedVideos(new Set());
      
      // Try creating carousels only if backend save was successful
      if (backendSaveSuccess) {
        try {
          const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
          const carouselApiUrl = baseUrl.endsWith('/api')
            ? `${baseUrl}/youtube-carousels` // Use the new non-protected endpoint
            : `${baseUrl}/api/youtube-carousels`; // Use the new non-protected endpoint
          
          const carouselResponse = await axios.post(carouselApiUrl, {
            videos: enhancedVideos,
            userId: user?.id || 'anonymous'
          });
          
          if (carouselResponse.data.success) {
            toastSuccess(`Created ${carouselResponse.data.count} carousel(s)!`);
          }
        } catch (carouselError) {
          console.error("Error creating carousels:", carouselError);
          toastError("Failed to create carousels, but videos were saved successfully.");
        }
      }
      
      // Navigate to carousel page
      navigate('/dashboard/request-carousel');
    } catch (error) {
      console.error('Error saving videos:', error);
      toastError('Failed to save videos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImageFromContent = async () => {
    if (!linkedinContent && !youtubeChannelResult?.videos.length) {
      toastError('No content available to generate an image');
      return;
    }
    
    setIsGeneratingImage(true);
    
    try {
      const prompt = youtubeChannelResult?.videos.length ? youtubeChannelResult.videos[0].title : linkedinContent.substring(0, 200);
      
      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
      const apiUrl = baseUrl.endsWith('/api') 
        ? `${baseUrl}/cloudinary/generate`
        : `${baseUrl}/api/cloudinary/generate`;
      
      const response = await axios.post(apiUrl, {
        prompt: `Create a professional, high-quality image based on this content: ${prompt}`,
        size: '1024x1024',
        style: 'vivid'
      });
      
      if (response.data && response.data.success) {
        const imageData = response.data.data;
        setGeneratedContentImage(imageData.secure_url);
        
        saveImageToGallery({
          id: imageData.public_id,
          url: imageData.url,
          secure_url: imageData.secure_url,
          public_id: imageData.public_id,
          title: 'Generated from YouTube: ' + (youtubeChannelResult?.videos[0]?.title || 'content'),
          tags: ['ai-generated', 'youtube', 'linkedin'],
          uploadedAt: new Date().toISOString(),
          type: 'ai-generated',
          width: imageData.width,
          height: imageData.height
        });
        
        toastSuccess('Image generated successfully!');
      } else {
        throw new Error(response.data?.message || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toastError('Failed to generate image. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGetTranscript = async (videoId: string) => {
    try {
      setLoadingTranscriptIds(prev => {
        const newSet = new Set(prev);
        newSet.add(videoId);
        return newSet;
      });
      
      setCurrentVideoId(videoId);
      setRetryCount(prev => ({ ...prev, [videoId]: 0 }));
      
      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
      const apiUrl = baseUrl.endsWith('/api') 
        ? `${baseUrl}/youtube/transcript` 
        : `${baseUrl}/api/youtube/transcript`;
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          videoId,
          useScraperApi: true // Always use ScraperAPI to avoid rate limits
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch transcript");
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Instead of setting youtubeTranscript state, directly handle saving the video with transcript
        const video = youtubeChannelResult?.videos.find(v => v.id === videoId);
        if (video) {
          await handleSaveVideoWithTranscript(video, data.transcript, data.language || "Unknown", data.is_generated || false);
          toastSuccess("Successfully retrieved and saved the video transcript.");
            } else {
          toastError("Could not find the video data for the transcript.");
        }
        return; // Success, exit function
      } else {
        throw new Error(data.message || "Failed to fetch transcript");
      }
    } catch (error: any) {
      console.error("Error fetching transcript:", error);
      toastError(error instanceof Error ? error.message : "Failed to fetch transcript");
    } finally {
      setLoadingTranscriptIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(videoId);
        return newSet;
      });
      // Reset retry count
      setRetryCount(prev => ({ ...prev, [videoId]: 0 }));
      setCurrentVideoId("");
    }
  };

  // Update: Instead of handling youtubeTranscript, create a direct method for saving with transcript
  const handleSaveVideoWithTranscript = async (
    video: YouTubeVideo, 
    transcript: string, 
    language: string,
    is_generated: boolean,
    formattedTranscript: string[] | null = null
  ) => {
    try {
      // Get the formatted transcript or use the raw transcript
      const bulletPoints = formattedTranscript || [transcript];
      
      // Current timestamp for consistent sorting
      const savedTimestamp = new Date().toISOString();
      
      // Create a new enhanced video object with the transcript
      const enhancedVideo = {
        ...video,
        transcript: transcript, // Store the full transcript
        formattedTranscript: bulletPoints, // Store as array with raw transcript
        language: language,
        is_generated: is_generated,
        savedAt: savedTimestamp,
        status: 'ready',
        videoId: video.id, // Ensure videoId is correctly set
        savedTimestamp: savedTimestamp, // Add explicit timestamp for sorting
        userId: user?.id || 'anonymous'
      };
      
      // Save to localStorage first to ensure we don't lose data even if backend fails
      try {
        // Get existing videos from localStorage
      const existingVideosJSON = localStorage.getItem("savedYoutubeVideos");
      let existingVideos = existingVideosJSON ? JSON.parse(existingVideosJSON) : [];
      
      // Check if the video already exists
      const existingIndex = existingVideos.findIndex((v: any) => v.id === enhancedVideo.id);
      
      if (existingIndex >= 0) {
        // Update the existing video
        existingVideos[existingIndex] = enhancedVideo;
      } else {
        // Add the new video
        existingVideos.push(enhancedVideo);
      }
      
      // Save back to localStorage
      localStorage.setItem("savedYoutubeVideos", JSON.stringify(existingVideos));
        console.log("Saved transcript to localStorage successfully");
        
        // Update videosWithTranscripts state
        setVideosWithTranscripts(prev => {
          const newSet = new Set(prev);
          newSet.add(video.id);
          return newSet;
        });
      } catch (localStorageError) {
        console.error("Error saving to localStorage:", localStorageError);
        toastError("Error saving locally: " + (localStorageError.message || "Unknown error"));
        // Continue with backend save attempt even if localStorage fails
      }
      
      // Now try to save to backend
      let backendSaveSuccess = false;
        try {
          const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
        const apiUrl = baseUrl.endsWith('/api')
          ? `${baseUrl}/youtube/save-video-transcript`
          : `${baseUrl}/api/youtube/save-video-transcript`;
        
        const backendResponse = await axios.post(apiUrl, {
          video: enhancedVideo,
          userId: user?.id || 'anonymous'
        }, { timeout: 10000 }); // Add timeout to prevent hanging requests
        
        if (backendResponse.data.success) {
          backendSaveSuccess = true;
          toastSuccess("Video saved to cloud with transcript!");
          
          // Try creating carousel entry if backend save was successful
          try {
          const carouselApiUrl = baseUrl.endsWith('/api')
            ? `${baseUrl}/youtube-carousels`
            : `${baseUrl}/api/youtube-carousels`;
          
            axios.post(carouselApiUrl, {
            videos: [enhancedVideo],
            userId: user?.id || 'anonymous'
            }, { timeout: 10000 }) // Non-blocking and with timeout
              .then(response => {
                if (response.data.success) {
                  console.log("Created carousel for the video");
          }
              })
              .catch(error => {
                console.error("Error creating carousel:", error);
              });
        } catch (carouselError) {
            console.error("Error setting up carousel creation:", carouselError);
            // Don't show error to user since the video was already saved
          }
        } else {
          console.warn("Backend save warning:", backendResponse.data.message);
          // Don't show error toast since localStorage save succeeded
        }
      } catch (backendError: any) {
        // More detailed error logging
        let errorDetail = "Unknown error";
        if (backendError.code === "ERR_NETWORK") {
          errorDetail = "Network connection error. API server may be down.";
        } else if (backendError.response) {
          errorDetail = `Status ${backendError.response.status}: ${backendError.response.statusText}`;
          if (backendError.response.data?.message) {
            errorDetail += ` - ${backendError.response.data.message}`;
          }
        } else if (backendError.message) {
          errorDetail = backendError.message;
        }
        
        console.error("Error saving to backend:", errorDetail);
        // Don't show error toast since localStorage save succeeded
        // and we don't want to confuse the user if backend is unavailable
      }
      
      // Navigate to request-carousel page regardless of backend success
      // as the video is already saved in localStorage
      navigate('/dashboard/request-carousel');
      
      return true;
    } catch (error: any) {
      console.error("Fatal error in handleSaveVideoWithTranscript:", error);
      toastError("Failed to save the video with transcript: " + (error.message || "Unknown error"));
      return false;
    }
  };

  // Add a helper function to maintain the raw transcript
  const formatTranscriptToBulletPoints = (text: string): string[] => {
    if (!text || text.length < 10) {
      return ["No transcript content available"];
    }
    
    // Just return the raw transcript as a single item in the array
    return [text];
  };

  // Update the button text in the video card to show retry status or transcript availability
  const getTranscriptButtonText = (videoId: string) => {
    // If this specific video is being processed
    if (loadingTranscriptIds.has(videoId)) {
      const retry = retryCount[videoId] || 0;
      if (retry > 0) {
        return `Retry ${retry}...`;
      }
      return "Loading...";
    }
    
    // If another video is being processed
    if (loadingTranscriptIds.size > 0) {
      return "Please wait...";
    }
    
    // Check if this video has a transcript
    if (videosWithTranscripts.has(videoId)) {
      return "Transcript Available";
    }
    
    // Default case - no transcript yet
    return "Get Transcript";
  };

  useEffect(() => {
    setInputUrl('');
    setResult(null);
    setTwitterResult(null);
    setSelectedTweets(new Set());
    
    // Don't clear YouTube and LinkedIn results when switching tabs - they should persist
    if (activeTab !== 'youtube') {
      // Only clear if switching away from YouTube and we don't have saved data
      const savedChannel = localStorage.getItem('youtubeChannelResult');
      if (!savedChannel) {
    setYoutubeChannelResult(null);
    setSelectedVideos(new Set());
      }
    }
    
    if (activeTab !== 'linkedin') {
      // Only clear if switching away from LinkedIn and we don't have saved data
      const savedLinkedIn = localStorage.getItem('linkedinResult');
      if (!savedLinkedIn) {
        setLinkedinResult(null);
        setSelectedLinkedInPosts(new Set());
      }
    }
  }, [activeTab]);

  // Load YouTube channel results on component mount
  useEffect(() => {
    if (activeTab === 'youtube') {
      loadYoutubeChannelFromStorage();
    }
  }, [activeTab]);

  // Load LinkedIn results on component mount
  useEffect(() => {
    if (activeTab === 'linkedin') {
      loadLinkedInResultFromStorage();
    }
  }, [activeTab]);

  // Load Twitter results on component mount
  useEffect(() => {
    if (activeTab === 'twitter') {
      loadTwitterResultFromStorage();
    }
  }, [activeTab]);

  // Clear other results when switching tabs but preserve YouTube and LinkedIn data
  useEffect(() => {
    if (activeTab !== 'youtube' && activeTab !== 'linkedin' && activeTab !== 'twitter') {
      // Clear other tab results but preserve YouTube, LinkedIn, and Twitter
      setResult(null);
      setLinkedinContent('');
    }
    
    // Restore input URL for YouTube
    if (activeTab === 'youtube' && lastSearchedChannel && inputUrl === '') {
      setInputUrl(lastSearchedChannel.startsWith('@') ? lastSearchedChannel : `@${lastSearchedChannel}`);
    }
    
    // Restore input URL for LinkedIn
    if (activeTab === 'linkedin' && lastSearchedLinkedInProfile && inputUrl === '') {
      setInputUrl(lastSearchedLinkedInProfile);
    }

    // Restore input URL for Twitter
    if (activeTab === 'twitter' && lastSearchedTwitterUser && inputUrl === '') {
      setInputUrl(lastSearchedTwitterUser.startsWith('@') ? lastSearchedTwitterUser : `@${lastSearchedTwitterUser}`);
    }
  }, [activeTab, lastSearchedChannel, lastSearchedLinkedInProfile, lastSearchedTwitterUser, inputUrl]);

  // Clean up selected videos when the channel result changes
  useEffect(() => {
    if (youtubeChannelResult) {
      // Validate that selected videos exist in the current result
      const validVideoIds = new Set(youtubeChannelResult.videos.map(v => v.id));
      setSelectedVideos(prev => {
        const newSelectedVideos = new Set<string>();
        prev.forEach(id => {
          if (validVideoIds.has(id)) {
            newSelectedVideos.add(id);
          }
        });
        return newSelectedVideos;
      });
    }
  }, [youtubeChannelResult]);

  // Restore transcript state and other data from localStorage if available
  useEffect(() => {
    try {
      // Load saved YouTube channel results from localStorage
      const savedChannel = localStorage.getItem('youtubeChannelResult');
      const lastChannel = localStorage.getItem('lastSearchedChannel');
      if (savedChannel) {
        setYoutubeChannelResult(JSON.parse(savedChannel));
      }
      if (lastChannel) {
        setLastSearchedChannel(lastChannel);
      }
      
      // Load saved LinkedIn results from localStorage
      const savedLinkedIn = localStorage.getItem('linkedinResult');
      const lastLinkedInProfile = localStorage.getItem('lastSearchedLinkedInProfile');
      if (savedLinkedIn) {
        const linkedInData = JSON.parse(savedLinkedIn);
        setLinkedinResult(linkedInData);
        console.log(`Loaded ${linkedInData.totalPosts} LinkedIn posts from cache for ${linkedInData.profileData.name}`);
      }
      if (lastLinkedInProfile) {
        setLastSearchedLinkedInProfile(lastLinkedInProfile);
      }

      // Load saved Twitter results from localStorage
      const savedTwitterResult = localStorage.getItem('twitterResult');
      const lastTwitterUser = localStorage.getItem('lastSearchedTwitterUser');
      if (savedTwitterResult) {
        const twitterData = JSON.parse(savedTwitterResult);
        
        // Validate and fix the data structure
        if (twitterData && typeof twitterData === 'object') {
          // Ensure required properties exist with proper defaults
          const validTwitterResult: TwitterResult = {
            tweets: Array.isArray(twitterData.tweets) ? twitterData.tweets : [],
            threads: Array.isArray(twitterData.threads) ? twitterData.threads : [],
            username: twitterData.username || '',
            profileImageUrl: twitterData.profileImageUrl || '',
            totalCount: typeof twitterData.totalCount === 'number' ? twitterData.totalCount : (twitterData.tweets?.length || 0),
            categories: twitterData.categories || {
              all: twitterData.totalCount || twitterData.tweets?.length || 0,
              normal: 0,
              thread: 0,
              long: 0
            }
          };
          
          setTwitterResult(validTwitterResult);
          setTwitterThreads(validTwitterResult.threads);
          console.log(`Loaded ${validTwitterResult.totalCount} tweets from cache for @${validTwitterResult.username}`);
        } else {
          console.warn('Invalid Twitter data structure, clearing cache');
          localStorage.removeItem('twitterResult');
        }
      }
      if (lastTwitterUser) {
        setLastSearchedTwitterUser(lastTwitterUser);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Add an event listener for beforeunload to save state
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Make sure all important state is saved to localStorage before page unload
      if (youtubeChannelResult) {
        saveYoutubeChannelToStorage(youtubeChannelResult);
      }
      if (linkedinResult) {
        saveLinkedInResultToStorage(linkedinResult);
      }
      if (twitterResult) {
        saveTwitterResultToStorage(twitterResult);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [youtubeChannelResult, linkedinResult, twitterResult]);

  // Fix missing handleToggleVideoSelection function (referenced in UI components)
  const handleToggleVideoSelection = (videoId: string) => {
    setSelectedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  // Check for videos with transcripts when component mounts or localStorage changes
  useEffect(() => {
    try {
      const savedVideosJSON = localStorage.getItem("savedYoutubeVideos");
      if (savedVideosJSON) {
        const savedVideos = JSON.parse(savedVideosJSON);
        
        // Collect video IDs that have transcripts
        const videoIdsWithTranscripts = new Set<string>();
        
        savedVideos.forEach((video: any) => {
          if (video.transcript && 
              typeof video.transcript === 'string' && 
              video.transcript.trim().length > 0) {
            videoIdsWithTranscripts.add(video.id);
          }
        });
        
        // Update state with videos that have transcripts
        setVideosWithTranscripts(videoIdsWithTranscripts);
      }
    } catch (error) {
      console.error("Error checking for videos with transcripts:", error);
    }
  }, []);

  // Add styles to head
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = linkedinStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Add Twitter-like styles
  const twitterStyles = `
    @layer components {
      .glass-card {
        @apply bg-white/70 backdrop-blur-sm border border-white/20 shadow-sm;
      }
      
      .tweet-card {
        @apply relative p-4 sm:p-6 rounded-2xl glass-card transition-all duration-300 hover:shadow-md overflow-hidden mb-4;
      }
      
      .tweet-thread {
        @apply relative p-4 sm:p-6 rounded-2xl glass-card transition-all duration-300 hover:shadow-md overflow-hidden mb-4 border-l-4 border-blue-500;
      }
      
      .thread-item {
        @apply border-l-2 border-blue-500/30 pl-6 py-3 ml-3 relative;
      }
      
      .thread-item:first-child {
        @apply pt-1;
      }
      
      .thread-item:last-child {
        @apply pb-1;
      }
      
      .thread-container {
        @apply pl-3 relative;
      }
      
      .thread-container::before {
        content: '';
        @apply absolute top-0 bottom-0 left-3 w-0.5 bg-blue-500/30 rounded;
      }
      
      .thread-item::before {
        content: '';
        @apply absolute left-[-4px] top-4 w-2 h-2 rounded-full bg-blue-500/50;
      }
      
      .thread-item + .thread-item {
        @apply mt-2;
      }
      
      .thread-container:empty::before {
        @apply hidden;
      }
      
      .show-more-button {
        @apply text-blue-500 text-sm font-medium transition-colors duration-200 hover:text-blue-700 flex items-center gap-1;
      }
      
      .checkbox-container {
        @apply absolute top-6 right-6 flex items-center gap-2;
      }
      
      .custom-checkbox {
        @apply h-5 w-5 rounded-md border border-input bg-white transition-colors hover:cursor-pointer;
      }
      
      .custom-checkbox-checked {
        @apply bg-blue-500 border-blue-500;
      }
      
      /* LinkedIn Masonry Layout Styles - Fixed alignment */
      .masonry-container {
        column-fill: balance;
        column-gap: 1.5rem;
        orphans: 1;
        widows: 1;
      }
      
      .masonry-container .linkedin-post-card {
        display: inline-block;
        width: 100%;
        margin: 0 0 1.5rem 0;
        break-inside: avoid;
        page-break-inside: avoid;
        -webkit-column-break-inside: avoid;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .masonry-container .linkedin-post-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      }
      
      /* Responsive masonry columns */
      @media (max-width: 768px) {
        .masonry-container {
          column-count: 1;
          column-width: auto;
        }
      }
      
      @media (min-width: 768px) and (max-width: 1024px) {
        .masonry-container {
          column-count: 2;
          column-width: auto;
        }
      }
      
      @media (min-width: 1024px) {
        .masonry-container {
          column-count: 3;
          column-width: auto;
        }
      }
      
      /* Smooth image loading for masonry */
      .masonry-container img {
        transition: opacity 0.3s ease;
      }
      
      .masonry-container img:not([src]) {
        opacity: 0;
      }
    }

    /* Animations */
    .animate-enter {
      animation: fade-in 0.3s ease-out, scale-in 0.2s ease-out;
    }

    .animate-content-expand {
      overflow: hidden;
      transition: max-height 0.3s ease-out;
    }

    .media-container {
      @apply rounded-lg overflow-hidden relative;
      aspect-ratio: auto;
      max-height: 400px;
    }

    .media-container img, .media-container video {
      @apply w-full h-auto object-contain;
      max-height: 400px;
    }

    .profile-media-container {
      @apply rounded-lg overflow-hidden relative;
      aspect-ratio: 1 / 1;
      max-height: 150px;
    }

    .profile-media-container img {
      @apply w-full h-full object-contain;
    }

    /* Image lazy loading blur effect */
    .lazy-image {
      @apply transition-opacity duration-500 opacity-0;
    }

    .lazy-image.loaded {
      @apply opacity-100;
    }

    .lazy-image.loading {
      @apply bg-gray-200 animate-pulse;
    }
    
    /* Pinterest-style masonry for LinkedIn posts */
    .linkedin-masonry {
      columns: 1;
      column-gap: 1.5rem;
    }
    
    @media (min-width: 768px) {
      .linkedin-masonry {
        columns: 2;
      }
    }
    
    @media (min-width: 1024px) {
      .linkedin-masonry {
        columns: 3;
      }
    }
    
    .linkedin-masonry .linkedin-post-card {
      break-inside: avoid;
      margin-bottom: 1.5rem;
      width: 100%;
      display: inline-block;
    }
  `;

  // Add custom styles to head
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = twitterStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Saved Posts Modal Component
  const SavedPostsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    savedTwitterPosts: Tweet[];
    savedLinkedInPosts: any[];
  }> = ({ isOpen, onClose, savedTwitterPosts, savedLinkedInPosts }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Folder className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Saved Posts</h2>
                <p className="text-sm text-gray-500">
                  {savedTwitterPosts.length + savedLinkedInPosts.length} total saved posts
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {savedTwitterPosts.length === 0 && savedLinkedInPosts.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Folder className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No saved posts yet</h3>
                <p>Start by scraping and saving some content!</p>
              </div>
            ) : (
              <Tabs defaultValue="twitter" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="twitter" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter ({savedTwitterPosts.length})
                  </TabsTrigger>
                  <TabsTrigger value="linkedin" className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn ({savedLinkedInPosts.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="twitter">
                  {savedTwitterPosts.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No saved Twitter posts</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedTwitterPosts.map((tweet) => (
                        <div key={tweet.id} className="w-full">
                          <TweetCard
                            tweet={tweet}
                            isSelected={false}
                            onSelectToggle={() => {}}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="linkedin">
                  {savedLinkedInPosts.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No saved LinkedIn posts</p>
                  ) : (
                    <div className="masonry-container columns-1 md:columns-2 xl:columns-3 gap-6">
                      {savedLinkedInPosts.map((post, index) => (
                        <Card 
                          key={`saved-${post.id}-${index}`} 
                          className="linkedin-post-card bg-white border border-gray-200 hover:shadow-lg transition-all duration-200 break-inside-avoid"
                        >
                          <CardHeader className="p-4 pb-3">
                            <div className="flex items-start gap-3">
                              <img 
                                src={post.authorAvatar || 'https://via.placeholder.com/40'} 
                                alt={post.author}
                                className="w-10 h-10 rounded-full object-cover" 
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm text-gray-900">{post.author}</h4>
                                <p className="text-xs text-gray-600 line-clamp-2">{post.authorHeadline}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Saved • {new Date(post.savedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="text-sm text-gray-800 leading-relaxed mb-3">
                              {post.content.length > 250 ? (
                                <>
                                  <p className="whitespace-pre-line break-words">
                                    {post.content.substring(0, 250)}...
                                  </p>
                                  <button className="text-blue-500 hover:text-blue-600 text-xs mt-1">
                                    Show more
                                  </button>
                                </>
                              ) : (
                                <p className="whitespace-pre-line break-words">{post.content}</p>
                              )}
                            </div>
                            
                            {/* Media Display */}
                            {post.media && post.media.length > 0 && (
                              <div className="mb-3">
                                {post.media.length === 1 ? (
                                  <img 
                                    src={post.media[0].url} 
                                    alt="Post media" 
                                    className="w-full object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                                    style={{ height: 'auto', maxHeight: '300px' }}
                                    onClick={() => window.open(post.media[0].url, '_blank')}
                                  />
                                ) : (
                                  <div className="grid grid-cols-2 gap-2">
                                    {post.media.slice(0, 4).map((media: any, idx: number) => (
                                      <img 
                                        key={idx}
                                        src={media.url} 
                                        alt={`Media ${idx + 1}`} 
                                        className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-95 transition-opacity"
                                        onClick={() => window.open(media.url, '_blank')}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Documents Display */}
                            {post.documents && post.documents.length > 0 && (
                              <div className="space-y-2">
                                {post.documents.map((doc: any, idx: number) => (
                                  <div key={idx} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-blue-600" />
                                      <span className="text-sm font-medium text-gray-900 truncate">{doc.title}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {doc.fileType?.toUpperCase()} • {doc.totalPageCount} pages
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
        <h1 className="text-3xl font-bold mb-2">Content Scraper</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Extract content from YouTube channels to repurpose for LinkedIn
        </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setSavedPostsModalOpen(true)}
          className="gap-2 whitespace-nowrap"
        >
          <Folder className="h-4 w-4" />
          View Saved Posts ({savedTwitterPosts.length + savedLinkedInPosts.length})
        </Button>
      </div>

      {/* Saved Posts Modal */}
      <SavedPostsModal
        isOpen={savedPostsModalOpen}
        onClose={() => setSavedPostsModalOpen(false)}
        savedTwitterPosts={savedTwitterPosts}
        savedLinkedInPosts={savedLinkedInPosts}
      />
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Input Source</CardTitle>
          <CardDescription>
            Enter a YouTube channel URL or handle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="youtube"
            value={activeTab}
            onValueChange={value => {
              setActiveTab(value);
              
              // Don't clear YouTube, LinkedIn, and Twitter channel results when switching tabs
              if (value !== 'youtube' && value !== 'linkedin' && value !== 'twitter') {
              setResult(null);
              setLinkedinContent('');
              }
            }}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 w-full mb-6">
              <TabsTrigger value="youtube" className="flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                <span className="hidden sm:inline">YouTube</span>
              </TabsTrigger>
              <TabsTrigger value="linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                <span className="hidden sm:inline">LinkedIn</span>
              </TabsTrigger>
              <TabsTrigger value="twitter" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                <span className="hidden sm:inline">Twitter</span>
              </TabsTrigger>
              <TabsTrigger value="web" className="flex items-center gap-2 relative opacity-70" disabled>
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Web</span>
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] px-1 rounded-full">Soon</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder={
                    activeTab === 'youtube' 
                      ? "Enter YouTube channel URL or @handle (e.g., @channelname)"
                      : activeTab === 'linkedin'
                      ? "Enter LinkedIn username (e.g., johndoe or linkedin.com/in/johndoe)"
                      : activeTab === 'twitter'
                      ? "Enter Twitter username (e.g., @username or twitter.com/username)"
                      : "Enter URL to scrape content"
                  }
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                onClick={handleScrape}
                disabled={isLoading || !inputUrl || (activeTab === 'linkedin' && isScrapingLinkedIn)}
                className="min-w-[120px]"
              >
                {(isLoading || (activeTab === 'linkedin' && isScrapingLinkedIn)) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {activeTab === 'linkedin' ? 'Scraping...' : 'Loading'}
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    {activeTab === 'youtube' 
                      ? 'Get Videos' 
                      : activeTab === 'linkedin'
                      ? 'Scrape Profile'
                      : activeTab === 'twitter'
                      ? 'Get Tweets'
                      : 'Scrape Content'
                    }
                  </>
                )}
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Twitter Results Section */}
      {activeTab === 'twitter' && twitterResult && (
        <div className="w-full space-y-6">
          {/* Twitter Profile Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border border-gray-100 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 min-w-0 flex-1">
              {twitterResult.profileImageUrl && (
                <img 
                  src={twitterResult.profileImageUrl} 
                  alt={twitterResult.username || 'User'}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-blue-500/20 flex-shrink-0" 
                />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base sm:text-lg truncate">@{twitterResult.username || 'Unknown'}</h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {twitterResult.totalCount || 0} tweets scraped
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const allTweetIds = new Set([
                    ...(Array.isArray(twitterResult.tweets) ? twitterResult.tweets.map(t => t.id) : []),
                    ...(Array.isArray(twitterResult.threads) ? twitterResult.threads.flatMap(thread => (thread.tweets || []).map(t => t.id)) : [])
                  ]);
                  setSelectedTweets(allTweetIds);
                  setSelectedThreads(new Set((twitterResult.threads || []).map(t => t.id)));
                }}
                disabled={isLoading}
                className="bg-white hover:bg-blue-50 text-xs whitespace-nowrap"
              >
                Select All
              </Button>
              <Button
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedTweets(new Set());
                  setSelectedThreads(new Set());
                }}
                disabled={isLoading || selectedTweets.size === 0}
                className="bg-white hover:bg-blue-50 text-xs whitespace-nowrap"
              >
                Clear Selection
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveSelectedTweets}
                disabled={isLoading || selectedTweets.size === 0}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-xs whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3 w-3" />
                    Save ({selectedTweets.size})
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Category Filter */}
          <TweetCategories
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            tweetCounts={twitterResult.categories}
          />

          {/* Twitter Content Display - Mixed tweets and threads chronologically */}
          <div className="space-y-6">
            {(() => {
              // Combine and sort tweets and threads chronologically
              const allContent: (Tweet | Thread)[] = [];
              
              // Add standalone tweets
              if (twitterResult.tweets && Array.isArray(twitterResult.tweets)) {
                const filteredTweets = twitterResult.tweets.filter(tweet => {
                  if (selectedCategory === 'normal') return !tweet.is_long;
                  if (selectedCategory === 'long') return tweet.is_long;
                  if (selectedCategory === 'thread') return false; // Don't show standalone tweets in thread category
                  return true; // Show all for 'all' category
                });
                allContent.push(...filteredTweets);
              }
              
              // Add threads
              if (twitterResult.threads && Array.isArray(twitterResult.threads)) {
                // Only show threads in 'all' and 'thread' categories
                // Do NOT show threads in 'long' or 'normal' categories  
                if (selectedCategory === 'all' || selectedCategory === 'thread') {
                  allContent.push(...twitterResult.threads);
                }
              }
              
              // Sort by date (newest first)
              allContent.sort((a, b) => {
                const dateA = new Date('tweets' in a ? a.tweets[0]?.created_at || a.created_at : a.created_at || '');
                const dateB = new Date('tweets' in b ? b.tweets[0]?.created_at || b.created_at : b.created_at || '');
                return dateB.getTime() - dateA.getTime();
              });
              
              if (allContent.length === 0) {
                return (
                  <div className="text-center py-10 bg-white/50 rounded-xl border border-gray-200">
                    <p className="text-gray-500">No {selectedCategory} content found.</p>
                    <Button 
                      onClick={() => setSelectedCategory('all')} 
                      variant="link" 
                      className="text-blue-500 mt-2"
                    >
                      Show all content
                  </Button>
                  </div>
                );
              }
              
              return (
                <div className="columns-1 md:columns-2 gap-6">
                  {allContent.map((item) => (
                    <div key={item.id} className="break-inside-avoid mb-6 w-full">
                      {'tweets' in item ? (
                        // This is a thread
                        <TweetThread
                          thread={item}
                          selectedTweets={selectedTweets}
                          onSelectToggle={handleToggleTweetSelection}
                          onSelectThread={handleToggleThreadSelection}
                        />
                      ) : (
                        // This is a standalone tweet
                        <TweetCard
                          tweet={item}
                          isSelected={selectedTweets.has(item.id)}
                          onSelectToggle={handleToggleTweetSelection}
                        />
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}
      
      {/* YouTube Channel Results */}
      {activeTab === 'youtube' && youtubeChannelResult && (
        <div className="space-y-6">
          {loadingTranscriptIds.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-center mb-4">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <div>
                <p className="font-medium">Fetching transcript...</p>
                <p className="text-sm">Please wait while we retrieve the transcript. This may take a few moments.</p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-3">
              <Youtube className="h-8 w-8" />
              <div>
                <h3 className="font-semibold">{youtubeChannelResult.channelName}</h3>
                <p className="text-sm text-gray-500">
                  {youtubeChannelResult.videos.length} videos found
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedVideos(new Set(youtubeChannelResult.videos.map(v => v.id)))}
                disabled={isLoading}
                className="text-xs whitespace-nowrap"
              >
                Select All
              </Button>
              <Button
                variant="outline" 
                size="sm"
                onClick={() => setSelectedVideos(new Set())}
                disabled={isLoading || selectedVideos.size === 0}
                className="text-xs whitespace-nowrap"
              >
                Clear Selection
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveSelectedVideos}
                disabled={isLoading || selectedVideos.size === 0}
                className="text-xs gap-1 whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3 w-3" />
                    Save ({selectedVideos.size})
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {youtubeChannelResult.videos.map(video => (
              <Card 
                key={video.id} 
                className={`overflow-hidden ${selectedVideos.has(video.id) ? 'border-primary' : ''}`}
              >
                <div className="h-40 bg-gray-100 dark:bg-gray-800 relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 rounded">
                    {video.duration !== "N/A" ? video.duration : "N/A"}
                  </div>
                </div>
                
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm line-clamp-2">{video.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{video.view_count.toLocaleString()} views</span>
                    <span>{new Date(video.upload_date).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {video.channelName || "Unknown Channel"}
                  </div>
                </CardContent>
                
                <CardFooter className="p-3 pt-0 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2 w-full">
                  <Button
                      variant="outline" 
                    size="sm" 
                    onClick={() => window.open(video.url, '_blank')}
                      className="w-full"
                  >
                    <Youtube className="h-4 w-4 mr-1" />
                    Watch
                  </Button>
                    <Button
                      variant={selectedVideos.has(video.id) ? "secondary" : "outline"}
                      size="sm" 
                      onClick={() => handleToggleVideoSelection(video.id)}
                      className="w-full"
                    >
                      {selectedVideos.has(video.id) ? "Selected" : "Select"}
                    </Button>
                  </div>
                    <Button
                    variant={videosWithTranscripts.has(video.id) ? "secondary" : "default"} 
                    size="sm" 
                    className={`w-full ${loadingTranscriptIds.size > 0 ? "opacity-70" : ""}`}
                    onClick={() => handleGetTranscript(video.id)}
                    disabled={loadingTranscriptIds.size > 0}
                  >
                    {getTranscriptButtonText(video.id)}
                    </Button>
                </CardFooter>
              </Card>
            ))}
                        </div>
        </div>
      )}
      
      {/* LinkedIn Profile Results */}
      {activeTab === 'linkedin' && linkedinResult && (
        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  {linkedinResult.profileData.avatar && (
                    <img 
                      src={linkedinResult.profileData.avatar} 
                      alt={linkedinResult.profileData.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-white shadow-lg flex-shrink-0" 
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{linkedinResult.profileData.name}</h2>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 line-clamp-2 break-words">{linkedinResult.profileData.headline}</p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Linkedin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{linkedinResult.totalPosts} posts</span>
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="truncate">@{linkedinResult.profileData.username}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedLinkedInPosts(new Set(linkedinResult.posts.map(p => p.id)))}
                    disabled={isLoading}
                    className="bg-white text-xs whitespace-nowrap"
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedLinkedInPosts(new Set())}
                    disabled={isLoading || selectedLinkedInPosts.size === 0}
                    className="bg-white text-xs whitespace-nowrap"
                  >
                    Clear Selection
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveSelectedLinkedInPosts}
                    disabled={isLoading || selectedLinkedInPosts.size === 0}
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-xs whitespace-nowrap"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-3 w-3" />
                        Save ({selectedLinkedInPosts.size})
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Posts Masonry Grid - Pinterest-style layout */}
          <div className="masonry-container columns-1 md:columns-2 lg:columns-3 gap-6">
            {linkedinResult.posts.map((post, postIndex) => (
              <Card 
                key={`${post.id}-${postIndex}`} 
                className={`linkedin-post-card bg-white border border-gray-200 hover:shadow-lg transition-all duration-200 break-inside-avoid ${
                  selectedLinkedInPosts.has(post.id) ? 'ring-2 ring-blue-500 border-blue-500' : ''
                }`}
              >
                {/* Post Header */}
                <CardHeader className="p-4 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <img 
                        src={post.authorAvatar || 'https://via.placeholder.com/40'} 
                        alt={post.author}
                        className="w-10 h-10 rounded-full object-cover" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm text-gray-900 truncate">{post.author}</h4>
                          {post.isRepost && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              Repost
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 break-words">{post.authorHeadline}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {post.dateRelative} • 🌐
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleLinkedInPostSelection(post.id)}
                        className="h-6 w-6 p-0 hover:bg-blue-50"
                      >
                        {selectedLinkedInPosts.has(post.id) ? (
                          <div className="h-4 w-4 rounded bg-blue-600 text-white flex items-center justify-center text-xs">
                            ✓
                          </div>
                        ) : (
                          <div className="h-4 w-4 rounded border-2 border-gray-300 hover:border-blue-500"></div>
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600">
                        •••
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {/* Post Content */}
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3 linkedin-post-content">
                    {/* Text Content - No truncation for masonry layout */}
                    <div className="text-sm text-gray-800 leading-relaxed">
                      {post.content.length > 300 ? (
                        <div>
                          <div id={`truncated-content-${post.id}`}>
                          <p className="whitespace-pre-line break-words overflow-hidden">
                              {post.content.substring(0, 300)}...
                          </p>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="p-0 h-auto text-xs text-gray-500 hover:text-blue-600 mt-1"
                            onClick={() => {
                                const truncatedElement = document.getElementById(`truncated-content-${post.id}`);
                                const fullElement = document.getElementById(`full-content-${post.id}`);
                              const button = document.getElementById(`see-more-btn-${post.id}`);
                                if (truncatedElement && fullElement && button) {
                                  if (fullElement.style.display === 'none' || !fullElement.style.display) {
                                    truncatedElement.style.display = 'none';
                                    fullElement.style.display = 'block';
                                  button.textContent = 'see less';
                                } else {
                                    truncatedElement.style.display = 'block';
                                    fullElement.style.display = 'none';
                                  button.textContent = 'see more';
                                }
                              }
                            }}
                          >
                            <span id={`see-more-btn-${post.id}`}>see more</span>
                          </Button>
                          </div>
                          <div id={`full-content-${post.id}`} style={{ display: 'none' }}>
                            <p className="whitespace-pre-line break-words overflow-hidden mt-2">
                              {post.content}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="whitespace-pre-line break-words overflow-hidden">{post.content}</p>
                      )}
                    </div>
                    
                    {/* Media Carousel */}
                    {post.media && post.media.length > 0 && (
                      <div className="relative">
                        {post.media.length === 1 ? (
                          <div className="rounded-lg overflow-hidden bg-gray-100">
                            <img 
                              src={post.media[0].url} 
                              alt="Post media" 
                              className="w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                              style={{ height: 'auto', maxHeight: '400px' }}
                              onClick={() => window.open(post.media[0].url, '_blank')}
                            />
                          </div>
                        ) : (
                          <LinkedInCarousel post={post} />
                        )}
                      </div>
                    )}
                    
                                         {/* Documents */}
                     {post.documents && post.documents.length > 0 && (
                       <div className="space-y-3">
                         {post.documents.map((doc, docIndex) => (
                           <LinkedInDocumentCarousel 
                             key={`${post.id}-doc-${docIndex}`}
                             document={doc}
                             postId={post.id}
                             onOpenPdf={openPdfViewer}
                           />
                         ))}
                       </div>
                     )}
                  </div>
                </CardContent>
                
                {/* Post Footer - LinkedIn Style */}
                <CardFooter className="p-4 pt-0">
                  {/* Engagement Stats */}
                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 border-b border-gray-100 pb-2">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <span className="text-blue-600">👍</span>
                          <span className="text-red-500">❤️</span>
                          <span className="text-green-600">💡</span>
                          {post.likes || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>{post.comments || 0} comments</span>
                        <span>•</span>
                        <span>{post.shares || 0} reposts</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100 px-3 py-1 h-8">
                          <span className="mr-1">👍</span>
                          <span className="text-xs">Like</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100 px-3 py-1 h-8">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          <span className="text-xs">Comment</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100 px-3 py-1 h-8">
                          <ArrowRight className="h-3 w-3 mr-1" />
                          <span className="text-xs">Repost</span>
                        </Button>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleCopy(post.content)}
                          className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 h-8"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        {post.url && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => window.open(post.url, '_blank')}
                            className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 h-8"
                          >
                            <Linkedin className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
                        </div>
        </div>
      )}
      
      {/* Results section - Original content for LinkedIn/Website/YouTube */}
      {activeTab !== 'twitter' && activeTab !== 'youtube' && result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Extracted content */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Extracted Content</CardTitle>
                <CardDescription>
                  Content extracted from {activeTab === 'linkedin' 
                    ? 'LinkedIn' 
                    : activeTab === 'website' 
                      ? 'website' 
                      : 'YouTube video'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-4 bg-white dark:bg-gray-900">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {result.content}
                  </p>
                </div>
                
                <Accordion type="single" collapsible className="mb-4">
                  <AccordionItem value="key-points">
                    <AccordionTrigger className="text-base font-medium">
                      Key Points
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {result.keyPoints.map((point, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Detected Tone
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">
                      {result.tone}
                    </div>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Details
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span>Word count:</span>
                        <span>{result.wordCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Read time:</span>
                        <span>{result.estimatedReadTime} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => handleCopy(result.content)}
                >
                  <Copy className="h-4 w-4" />
                  Copy Content
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={handleSaveToInspiration}
                >
                  <Save className="h-4 w-4" />
                  Save to Vault
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right column - AI suggestions */}
          <div>
            {/* Suggested Hook */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Suggested Hook
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                  {result.suggestedHook}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-1"
                  onClick={() => handleCopy(result.suggestedHook)}
                >
                  <Copy className="h-4 w-4" />
                  Copy Hook
                </Button>
              </CardContent>
            </Card>
            
            {/* Actions */}
            <Card className="bg-primary-50 dark:bg-primary-900/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Generate LinkedIn Post
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Use the extracted content to create an engaging LinkedIn post with AI assistance.
                </p>
                
                <Button 
                  className="w-full gap-2 mb-3"
                  onClick={handleCreatePost}
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Post
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => navigate('/dashboard/ai')}
                >
                  <MessageSquare className="h-4 w-4" />
                  Expand with AI Writer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* Instructions when no result */}
      {!result && !isLoading && !youtubeChannelResult && !linkedinResult && !twitterResult && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center max-w-xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 mb-4">
                {activeTab === 'youtube' ? (
                  <Youtube className="h-8 w-8 text-primary" />
                ) : activeTab === 'linkedin' ? (
                  <Linkedin className="h-8 w-8 text-primary" />
                ) : activeTab === 'twitter' ? (
                  <Twitter className="h-8 w-8 text-primary" />
                ) : (
                  <Search className="h-8 w-8 text-primary" />
                )}
              </div>
              
              <h3 className="text-lg font-medium mb-2">
                {activeTab === 'youtube' 
                  ? 'Extract Content from YouTube Channels'
                  : activeTab === 'linkedin'
                  ? 'Scrape LinkedIn Profiles'
                  : activeTab === 'twitter'
                  ? 'Extract Tweets from Twitter'
                  : 'Extract Content from Social Media'
                }
              </h3>
              
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {activeTab === 'youtube' 
                  ? 'Paste a YouTube channel handle (starting with @) or URL to extract videos and transcripts for your LinkedIn content.'
                  : activeTab === 'linkedin'
                  ? 'Enter a LinkedIn username to scrape their profile and recent posts for content inspiration.'
                  : activeTab === 'twitter'
                  ? 'Enter a Twitter username to fetch their recent tweets and threads for content analysis and inspiration.'
                  : 'Select a platform above and enter the appropriate URL or username to start scraping content.'
                }
              </p>
              
              <div className="flex flex-col space-y-2">
                {activeTab === 'youtube' && (
                  <>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium">
                    1
                  </div>
                  <span>Enter a YouTube channel handle (e.g., @channelname) in the input field above</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium">
                    2
                  </div>
                  <span>Click "Get Videos" to fetch content from the channel</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium">
                    3
                  </div>
                  <span>Select videos and fetch transcripts to create LinkedIn content</span>
                </div>
                  </>
                )}
                
                {activeTab === 'linkedin' && (
                  <>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium">
                        1
                      </div>
                      <span>Enter a LinkedIn username (e.g., johndoe) in the input field above</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium">
                        2
                      </div>
                      <span>Click "Scrape Profile" to fetch their posts and profile data</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium">
                        3
                      </div>
                      <span>Select posts to save for content inspiration and analysis</span>
                    </div>
                  </>
                )}

                {activeTab === 'twitter' && (
                  <>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium">
                        1
                      </div>
                      <span>Enter a Twitter username (e.g., @username) in the input field above</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium">
                        2
                      </div>
                      <span>Click "Get Tweets" to fetch their recent tweets and threads</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium">
                        3
                      </div>
                      <span>Select tweets and threads to save for content inspiration and analysis</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Generated Image Section */}
      {linkedinContent && (
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2">Generated Image</h4>
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={handleGenerateImageFromContent}
              disabled={isGeneratingImage}
              className="gap-2"
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Image...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4" />
                  Generate Image
                </>
              )}
            </Button>
          </div>
          
          {generatedContentImage && (
            <div className="mt-4">
              <div className="relative rounded-md overflow-hidden">
                <img 
                  src={generatedContentImage} 
                  alt="Generated image"
                  className="w-full max-h-[250px] object-cover"
                />
              </div>
              <div className="flex justify-between mt-2">
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard/images')}
                  className="gap-2"
                >
                  <Folder className="h-4 w-4" />
                  View in Gallery
                </Button>
                <Button
                  onClick={() => navigate('/dashboard/post', { 
                    state: { 
                      content: linkedinContent, 
                      image: generatedContentImage 
                    } 
                  })}
                  className="gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  Create Post with Image
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* PDF Viewer Modal */}
      <PDFViewerModal
        isOpen={pdfViewerState.isOpen}
        onClose={closePdfViewer}
        documentUrl={pdfViewerState.documentUrl}
        documentTitle={pdfViewerState.documentTitle}
      />
    </div>
  );
};

export default ScraperPage;