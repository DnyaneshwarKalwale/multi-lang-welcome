import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button, Card, Container, Row, Col, Form, Spinner, Tabs, Tab, Alert, Stack } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import aiService, { ContentGenerationParams, ImageGenerationParams, YouTubeTranscriptParams } from '../services/aiService';
import { toast } from 'react-toastify';

const LinkedInContentGenerator: React.FC = () => {
  const { t } = useLanguage();
  
  // State for YouTube transcript
  const [videoUrl, setVideoUrl] = useState('');
  const [transcript, setTranscript] = useState<any>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [fetchingTranscript, setFetchingTranscript] = useState(false);
  
  // State for content generation
  const [inputText, setInputText] = useState('');
  const [contentType, setContentType] = useState<ContentGenerationParams['contentType']>('post');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [contentGoal, setContentGoal] = useState('');
  const [tone, setTone] = useState('');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [maxLength, setMaxLength] = useState<number | undefined>(undefined);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatingContent, setGeneratingContent] = useState(false);
  
  // State for image generation
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStyle, setImageStyle] = useState('professional');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [generatingImage, setGeneratingImage] = useState(false);
  
  // State for image upload
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState('input');

  // Dropzone setup for image uploads
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 5,
    onDrop: acceptedFiles => {
      handleImageUpload(acceptedFiles);
    }
  });

  // YouTube transcript handling
  const handleFetchTranscript = async () => {
    if (!videoUrl) {
      toast.error('Please enter a YouTube video URL');
      return;
    }
    
    setFetchingTranscript(true);
    try {
      const params: YouTubeTranscriptParams = { videoUrl };
      const response = await aiService.getYouTubeTranscript(params);
      
      if (response.success) {
        setTranscript(response.data.transcript);
        setVideoTitle(response.data.title);
        
        // Prepare transcript for content generation
        const transcriptText = response.data.transcript
          .map((segment: any) => segment.text)
          .join(' ');
        
        setInputText(`Video Title: ${response.data.title}\n\nTranscript: ${transcriptText}`);
        
        toast.success('Transcript fetched successfully');
        setActiveTab('content');
      }
    } catch (error: any) {
      console.error('Error fetching transcript:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch transcript');
    } finally {
      setFetchingTranscript(false);
    }
  };

  // Content generation handling
  const handleGenerateContent = async () => {
    if (!inputText) {
      toast.error('Please enter some text or fetch a transcript');
      return;
    }
    
    setGeneratingContent(true);
    try {
      const params: ContentGenerationParams = {
        inputText,
        contentType,
        industry: industry || undefined,
        targetAudience: targetAudience || undefined,
        contentGoal: contentGoal || undefined,
        tone: tone || undefined,
        includeHashtags,
        includeEmojis,
        maxLength: maxLength || undefined
      };
      
      const response = await aiService.generateLinkedInContent(params);
      
      if (response.success) {
        setGeneratedContent(response.data.content);
        toast.success('Content generated successfully');
        setActiveTab('result');
      }
    } catch (error: any) {
      console.error('Error generating content:', error);
      toast.error(error.response?.data?.message || 'Failed to generate content');
    } finally {
      setGeneratingContent(false);
    }
  };

  // Image generation handling
  const handleGenerateImage = async () => {
    if (!imagePrompt) {
      toast.error('Please enter a prompt for image generation');
      return;
    }
    
    setGeneratingImage(true);
    try {
      const params: ImageGenerationParams = {
        prompt: imagePrompt,
        style: imageStyle
      };
      
      const response = await aiService.generateImage(params);
      
      if (response.success) {
        setGeneratedImageUrl(response.data.url);
        toast.success('Image generated successfully');
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast.error(error.response?.data?.message || 'Failed to generate image');
    } finally {
      setGeneratingImage(false);
    }
  };
  
  // Image upload handling
  const handleImageUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setUploading(true);
    try {
      const uploadPromises = files.map(file => aiService.uploadImage(file));
      const results = await Promise.all(uploadPromises);
      
      const newImageUrls = results.map(result => result.data.url);
      setUploadedImageUrls(prev => [...prev, ...newImageUrls]);
      
      toast.success(`${files.length} image(s) uploaded successfully`);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast.error(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };
  
  // Copy to clipboard
  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Content copied to clipboard');
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">{t('LinkedIn Content Generator')}</h1>
      
      <Tabs activeKey={activeTab} onSelect={(k) => k && setActiveTab(k)} className="mb-4">
        <Tab eventKey="input" title={t('Input')}>
          <Card className="mb-4">
            <Card.Header>{t('YouTube Transcript')}</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>{t('YouTube Video URL')}</Form.Label>
                  <Form.Control
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <Form.Text className="text-muted">
                    {t('Enter the URL of a YouTube video to extract its transcript')}
                  </Form.Text>
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  onClick={handleFetchTranscript}
                  disabled={fetchingTranscript || !videoUrl}
                >
                  {fetchingTranscript ? (
                    <>
                      <Spinner as="span" size="sm" animation="border" className="me-2" />
                      {t('Fetching...')}
                    </>
                  ) : (
                    t('Fetch Transcript')
                  )}
                </Button>
              </Form>
              
              {transcript && (
                <Alert variant="success" className="mt-3">
                  <p><strong>{t('Video Title')}:</strong> {videoTitle}</p>
                  <p><strong>{t('Transcript Length')}:</strong> {transcript.length} {t('segments')}</p>
                </Alert>
              )}
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header>{t('Manual Input')}</Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>{t('Input Text')}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={8}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t('Enter text to generate LinkedIn content from...')}
                />
              </Form.Group>
              
              <Button 
                variant="primary" 
                onClick={() => setActiveTab('content')}
                disabled={!inputText}
              >
                {t('Next')}
              </Button>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="content" title={t('Content Settings')}>
          <Card>
            <Card.Header>{t('Content Generation Settings')}</Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('Content Type')}</Form.Label>
                    <Form.Select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value as any)}
                    >
                      <option value="post">{t('Post')}</option>
                      <option value="article">{t('Article')}</option>
                      <option value="carousel">{t('Carousel')}</option>
                      <option value="poll">{t('Poll')}</option>
                      <option value="comment">{t('Comment')}</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('Industry')}</Form.Label>
                    <Form.Control
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder={t('e.g., Technology, Finance, Healthcare')}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('Target Audience')}</Form.Label>
                    <Form.Control
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder={t('e.g., Professionals, Executives, Students')}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('Content Goal')}</Form.Label>
                    <Form.Control
                      type="text"
                      value={contentGoal}
                      onChange={(e) => setContentGoal(e.target.value)}
                      placeholder={t('e.g., Thought leadership, Lead generation')}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('Tone')}</Form.Label>
                    <Form.Control
                      type="text"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      placeholder={t('e.g., Professional, Conversational, Enthusiastic')}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('Max Length (characters)')}</Form.Label>
                    <Form.Control
                      type="number"
                      value={maxLength || ''}
                      onChange={(e) => setMaxLength(e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder={t('Leave empty for default')}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Check
                    type="checkbox"
                    label={t('Include Hashtags')}
                    checked={includeHashtags}
                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                  />
                </Col>
                <Col md={6}>
                  <Form.Check
                    type="checkbox"
                    label={t('Include Emojis')}
                    checked={includeEmojis}
                    onChange={(e) => setIncludeEmojis(e.target.checked)}
                  />
                </Col>
              </Row>
              
              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={() => setActiveTab('input')}>
                  {t('Back')}
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleGenerateContent}
                  disabled={generatingContent || !inputText}
                >
                  {generatingContent ? (
                    <>
                      <Spinner as="span" size="sm" animation="border" className="me-2" />
                      {t('Generating...')}
                    </>
                  ) : (
                    t('Generate Content')
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="result" title={t('Results')}>
          <Row>
            <Col md={8}>
              <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>{t('Generated Content')}</div>
                  {generatedContent && (
                    <Button variant="outline-primary" size="sm" onClick={handleCopyContent}>
                      {t('Copy to Clipboard')}
                    </Button>
                  )}
                </Card.Header>
                <Card.Body>
                  {generatedContent ? (
                    <div className="generated-content">
                      {contentType === 'carousel' ? (
                        // Render carousel content with slide separation
                        generatedContent.split('[SLIDE').map((slide, index) => {
                          if (index === 0 && !slide.trim()) return null;
                          return (
                            <div key={index} className="carousel-slide mb-4 p-3 border rounded">
                              {index > 0 ? <h5>Slide {index}</h5> : null}
                              <p>{slide.replace(/^\d+\]/, '').trim()}</p>
                            </div>
                          );
                        })
                      ) : contentType === 'article' ? (
                        // Render article with proper formatting
                        <div className="article-content">
                          {generatedContent.split('\n').map((line, index) => (
                            line.trim().startsWith('#') ? (
                              <h3 key={index}>{line.replace(/^#+\s/, '')}</h3>
                            ) : (
                              <p key={index}>{line}</p>
                            )
                          ))}
                        </div>
                      ) : (
                        // Render regular post
                        <p style={{ whiteSpace: 'pre-wrap' }}>{generatedContent}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted">{t('Generated content will appear here')}</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="mb-4">
                <Card.Header>{t('Image Generation')}</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('Image Prompt')}</Form.Label>
                    <Form.Control
                      type="text"
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder={t('Describe the image you want...')}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>{t('Style')}</Form.Label>
                    <Form.Select
                      value={imageStyle}
                      onChange={(e) => setImageStyle(e.target.value)}
                    >
                      <option value="professional">{t('Professional')}</option>
                      <option value="creative">{t('Creative')}</option>
                      <option value="minimal">{t('Minimal')}</option>
                      <option value="corporate">{t('Corporate')}</option>
                      <option value="tech">{t('Technology')}</option>
                    </Form.Select>
                  </Form.Group>
                  
                  <Button 
                    variant="primary" 
                    onClick={handleGenerateImage}
                    disabled={generatingImage || !imagePrompt}
                    className="w-100 mb-3"
                  >
                    {generatingImage ? (
                      <>
                        <Spinner as="span" size="sm" animation="border" className="me-2" />
                        {t('Generating...')}
                      </>
                    ) : (
                      t('Generate Image')
                    )}
                  </Button>
                  
                  {generatedImageUrl && (
                    <div className="text-center mt-3">
                      <img 
                        src={generatedImageUrl} 
                        alt="Generated" 
                        className="img-fluid rounded" 
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                  )}
                </Card.Body>
              </Card>
              
              <Card>
                <Card.Header>{t('Upload Images')}</Card.Header>
                <Card.Body>
                  <div {...getRootProps()} className="dropzone mb-3 p-4 border rounded text-center">
                    <input {...getInputProps()} />
                    {uploading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <p className="mb-0">{t('Drag and drop images here, or click to select files')}</p>
                    )}
                  </div>
                  
                  {uploadedImageUrls.length > 0 && (
                    <div>
                      <h6>{t('Uploaded Images')}</h6>
                      <Stack direction="horizontal" gap={2} className="flex-wrap">
                        {uploadedImageUrls.map((url, index) => (
                          <img 
                            key={index} 
                            src={url} 
                            alt={`Uploaded ${index}`} 
                            className="img-thumbnail" 
                            style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                          />
                        ))}
                      </Stack>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <div className="mt-4">
            <Button variant="secondary" onClick={() => setActiveTab('content')}>
              {t('Back to Settings')}
            </Button>
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default LinkedInContentGenerator; 