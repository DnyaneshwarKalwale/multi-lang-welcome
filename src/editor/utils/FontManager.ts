// FontManager.ts - Utility for managing custom fonts
import axios from 'axios';

export interface CustomFont {
  id: string;
  family: string;
  url: string;
  loaded: boolean;
  name?: string;  // Adding name property for display
  fontFamily?: string; // Adding fontFamily property for compatibility
}

interface ApiFont {
  _id: string;
  name: string;
  fontFamily: string;
  fileUrl: string;
  format: string;
  isGlobal: boolean;
  createdAt: string;
  updatedAt: string;
}

type FontLoadedListener = (font: CustomFont) => void;

// API base URL - make it configurable for different environments
const API_BASE_URL = (window as any)._env_?.NEXT_PUBLIC_API_URL || 'https://api.brandout.ai';

export class FontManager {
  private static instance: FontManager;
  private customFonts: CustomFont[] = [];
  private fontLoadedListeners: FontLoadedListener[] = [];
  private cssInjected = false;
  
  private constructor() {
    // Load fonts from API
    this.loadFontsFromAPI();
    
    // Also load any saved fonts from localStorage for backward compatibility
    this.loadSavedFonts();
  }
  
  public static getInstance(): FontManager {
    if (!FontManager.instance) {
      FontManager.instance = new FontManager();
    }
    return FontManager.instance;
  }
  
  private async loadFontsFromAPI(): Promise<void> {
    try {
      // Inject CSS link if not already done
      if (!this.cssInjected) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${API_BASE_URL}/api/fonts/css/fonts.css`;
        document.head.appendChild(link);
        this.cssInjected = true;
      }
      
      // Fetch available fonts from API
      const response = await axios.get(`${API_BASE_URL}/api/fonts`);
      const apiFonts: ApiFont[] = response.data;
      
      // Convert API fonts to local format
      const fonts = apiFonts.map(apiFont => ({
        id: apiFont._id,
        family: apiFont.fontFamily,
        url: `${API_BASE_URL}${apiFont.fileUrl}`,
        loaded: true, // We assume the CSS has loaded them
        name: apiFont.name,
        fontFamily: apiFont.fontFamily
      }));
      
      // Merge with existing fonts, avoiding duplicates
      const existingFontIds = this.customFonts.map(f => f.id);
      const existingFontFamilies = this.customFonts.map(f => f.family.toLowerCase());
      const newFonts = fonts.filter(f => 
        !existingFontIds.includes(f.id) && 
        !existingFontFamilies.includes(f.family.toLowerCase())
      );
      
      this.customFonts = [...this.customFonts, ...newFonts];
      
      // Notify listeners for each new font
      newFonts.forEach(font => this.notifyFontLoaded(font));
      
    } catch (error) {
      console.error('Failed to load fonts from API:', error);
    }
  }
  
  private loadSavedFonts(): void {
    try {
      const savedFonts = localStorage.getItem('customFonts');
      if (savedFonts) {
        const localFonts = JSON.parse(savedFonts) as CustomFont[];
        
        // Filter out any fonts that might already be in our array
        const existingFontIds = this.customFonts.map(f => f.id);
        const existingFontFamilies = this.customFonts.map(f => f.family.toLowerCase());
        const newLocalFonts = localFonts.filter(f => 
          !existingFontIds.includes(f.id) && 
          !existingFontFamilies.includes(f.family.toLowerCase())
        );
        
        this.customFonts = [...this.customFonts, ...newLocalFonts];
        
        // Attempt to load all saved fonts into the document
        newLocalFonts.forEach(font => {
          this.loadFontIntoDocument(font).catch(err => 
            console.error(`Failed to load font ${font.family}:`, err)
          );
        });
      }
    } catch (error) {
      console.error('Failed to load saved fonts:', error);
    }
  }
  
  private saveFontsToStorage(): void {
    try {
      // Only save locally-added fonts that don't come from the API
      const localFonts = this.customFonts.filter(font => !font.id.includes('-'));
      localStorage.setItem('customFonts', JSON.stringify(localFonts));
    } catch (error) {
      console.error('Failed to save fonts to storage:', error);
    }
  }
  
  public async addFont(file: File, name: string): Promise<CustomFont> {
    try {
      // Check file extension
      const fileName = file.name;
      const fileExt = '.' + fileName.split('.').pop()?.toLowerCase();
      const validExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
      
      if (!validExtensions.includes(fileExt)) {
        throw new Error('Invalid font file format. Supported formats: .ttf, .otf, .woff, .woff2');
      }
      
      // Normalize the font name to create a unique family name
      const normalizedName = name.trim().replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      
      // Check if a font with the same name already exists
      const existingFontWithSameName = this.customFonts.find(
        f => f.name?.toLowerCase() === name.toLowerCase() || 
             f.family.toLowerCase() === normalizedName
      );
      
      if (existingFontWithSameName) {
        console.log(`Font with name "${name}" already exists. Using existing font.`);
        return existingFontWithSameName;
      }
      
      // Try to upload to the API first
      const formData = new FormData();
      formData.append('fontFile', file);
      formData.append('name', name || fileName.split('.')[0]);
      
      // Make API call to upload font
      try {
        // Attempt to get user token for authentication if available
        let headers: Record<string, string> = {
          'Content-Type': 'multipart/form-data',
        };
        
        // Try to get token from localStorage using proper auth method pattern
        try {
          // Check for auth method first
          const authMethod = localStorage.getItem('auth-method');
          let token = null;
          
          if (authMethod) {
            // Get token based on auth method
            token = localStorage.getItem(`${authMethod}-login-token`);
          } else {
            // Fallback to legacy token keys
            token = localStorage.getItem('token') || 
                   localStorage.getItem('userToken') || 
                   localStorage.getItem('linkedin-login-token') || 
                   localStorage.getItem('google-login-token');
          }
          
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          } else {
            // No token available
          }
        } catch (tokenError) {
          // Error accessing localStorage
        }
        
        const response = await axios.post(`${API_BASE_URL}/api/fonts`, formData, { headers });
        
        const apiFont = response.data;
        
        // Convert API response to our format
        const newFont: CustomFont = {
          id: apiFont._id,
          family: apiFont.fontFamily,
          url: `${API_BASE_URL}${apiFont.fileUrl}`,
          loaded: false,
          name: apiFont.name,
          fontFamily: apiFont.fontFamily
        };
        
        // Add to local font collection
        this.customFonts.push(newFont);
        
        // Load the font
        await this.loadFontIntoDocument(newFont);
        
        return newFont;
        
      } catch (apiError: any) {
        console.error('API upload failed, falling back to local storage:', apiError);
        
        // If there's a specific error message from the server, pass it through
        if (apiError.response?.data?.message) {
          throw new Error(apiError.response.data.message);
        }
        
        // If CORS or network error, try local fallback
        if (apiError.message.includes('Network Error') || 
            apiError.message.includes('CORS') ||
            apiError.code === 'ECONNREFUSED') {
          console.log('Network or CORS issue, using local storage fallback');
          return this.addFontLocally(file, name);
        }
        
        // For authentication errors, tell the user
        if (apiError.response?.status === 401 || apiError.response?.status === 403) {
          throw new Error('You need to be logged in to upload fonts');
        }
        
        // Fallback to local storage for other errors
        return this.addFontLocally(file, name);
      }
    } catch (error: any) {
      console.error('Error adding font:', error);
      throw new Error(error.message || 'Failed to add font');
    }
  }
  
  // Fallback method for backward compatibility
  private async addFontLocally(file: File, name: string): Promise<CustomFont> {
    // Create URL for the font file
    const url = URL.createObjectURL(file);
    
    // Create a normalized family name (no spaces, lowercase)
    const family = `custom-${name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${Date.now()}`;
    
    // Check if a font with the same name already exists
    const existingFontWithSameName = this.customFonts.find(
      f => f.name?.toLowerCase() === name.toLowerCase() || 
           f.family.toLowerCase().includes(name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'))
    );
    
    if (existingFontWithSameName) {
      console.log(`Font with name "${name}" already exists locally. Using existing font.`);
      return existingFontWithSameName;
    }
    
    // Register the font
    const font = this.registerFont(family, url);
    font.name = name;
    font.fontFamily = family; // For compatibility with the Konva text component
    
    // Load the font into the document
    await this.loadFontIntoDocument(font);
    
    return font;
  }
  
  public registerFont(family: string, url: string): CustomFont {
    // Check for existing font with the same family name
    const existingFont = this.customFonts.find(f => 
      f.family.toLowerCase() === family.toLowerCase()
    );
    
    if (existingFont) {
      console.log(`Font with family "${family}" already registered.`);
      return existingFont;
    }
    
    const id = `local-${Date.now()}`;
    const newFont: CustomFont = {
      id,
      family,
      url,
      loaded: false
    };

    this.customFonts.push(newFont);
    this.saveFontsToStorage();
    return newFont;
  }
  
  public removeFont(fontId: string): boolean {
    const initialLength = this.customFonts.length;
    this.customFonts = this.customFonts.filter(font => font.id !== fontId);
    
    if (initialLength !== this.customFonts.length) {
      this.saveFontsToStorage();
      return true;
    }
    return false;
  }
  
  public getFontByFamily(family: string): CustomFont | undefined {
    return this.customFonts.find(font => font.family === family);
  }
  
  public getAllFonts(): CustomFont[] {
    return [...this.customFonts];
  }
  
  public async loadFontIntoDocument(font: CustomFont): Promise<void> {
    if (font.loaded) return;

    const fontFace = new FontFace(font.family, `url(${font.url})`);
    
    try {
      const loadedFont = await fontFace.load();
      document.fonts.add(loadedFont);
      
      // Update font status
      const fontIndex = this.customFonts.findIndex(f => f.id === font.id);
      if (fontIndex >= 0) {
        this.customFonts[fontIndex].loaded = true;
        this.saveFontsToStorage();
        
        // Notify listeners
        this.notifyFontLoaded(this.customFonts[fontIndex]);
      }
    } catch (error) {
      console.error(`Failed to load font '${font.family}':`, error);
      throw error;
    }
  }
  
  // Refresh fonts from API
  public refreshFonts(): Promise<void> {
    return this.loadFontsFromAPI();
  }
  
  public addFontLoadedListener(listener: FontLoadedListener): void {
    this.fontLoadedListeners.push(listener);
  }
  
  public removeFontLoadedListener(listener: FontLoadedListener): void {
    this.fontLoadedListeners = this.fontLoadedListeners.filter(l => l !== listener);
  }
  
  private notifyFontLoaded(font: CustomFont): void {
    this.fontLoadedListeners.forEach(listener => listener(font));
  }
}

export default FontManager; 