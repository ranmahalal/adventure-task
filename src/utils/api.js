// API utilities for communicating with the backend
import axios from 'axios';
import { APIError, NetworkError, TimeoutError, withRetry } from './errorHandler';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`DEBUG: API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('ERROR: API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`INFO: API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('ERROR: API Response Error:', error);
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`Server Error ${status}:`, data);
      
      const apiError = new APIError(
        data.message || 'Server error occurred. Please try again.',
        status,
        data
      );
      
      throw apiError;
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      throw new NetworkError('Network error. Please check your connection and try again.');
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      throw new TimeoutError('Request timed out. Please try again.');
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
      throw new Error('Request failed. Please try again.');
    }
  }
);

// API functions
export const exerciseAPI = {
  // Generate exercises for a topic
  generateExercises: async (topic, tone = 'professional') => {
    return withRetry(async () => {
      console.log(`INFO: Generating exercises for topic: ${topic}, tone: ${tone}`);
      
      const response = await api.post('/api/exercises/generate', {
        topic: topic.trim(),
        language: 'en',
        tone
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new APIError(response.data.message || 'Failed to generate exercises', response.status, response.data);
      }
    }, 3, { topic, tone });
  }
};

// Background API for Unsplash images
export const backgroundAPI = {
  // Get background image for a topic
  getBackgroundImage: async (topic, tone = 'professional') => {
    console.log('DEBUG: Starting background image fetch for:', { topic, tone });
    
    try {
      const unsplashKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
      
      if (!unsplashKey) {
        console.warn('WARN: Unsplash API key not configured');
        return null;
      }
      
      // Create search query based on topic and tone
      const searchQuery = createSearchQuery(topic, tone);
      console.log('DEBUG: Created search query:', searchQuery);
      
      console.log(`INFO: Fetching background image for: ${searchQuery}`);
      
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: searchQuery,
          per_page: 1,
          orientation: 'landscape',
          content_filter: 'high'
        },
        headers: {
          'Authorization': `Client-ID ${unsplashKey}`
        },
        timeout: 10000 // 10 seconds timeout for background images
      });
      
      console.log('DEBUG: Unsplash API response:', response.data);
      
      if (response.data.results && response.data.results.length > 0) {
        const image = response.data.results[0];
        console.log('DEBUG: Selected image:', image);
        
        const imageData = {
          url: image.urls.regular,
          alt: image.alt_description || `Background image for ${topic}`,
          photographer: image.user.name,
          photographerUrl: image.user.links.html
        };
        
        console.log('DEBUG: Returning image data:', imageData);
        return imageData;
      }
      
      console.log('WARN: No images found in Unsplash response');
      return null;
    } catch (error) {
      console.error('ERROR: Background image fetch failed:', error);
      console.error('ERROR: Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      return null;
    }
  }
};

// Helper function to create search query based on topic and tone
function createSearchQuery(topic, tone) {
  const toneKeywords = {
    'professional': ['business', 'office', 'corporate'],
    'casual': ['relaxed', 'friendly', 'comfortable'],
    'humorous': ['fun', 'playful', 'colorful'],
    'encouraging': ['motivational', 'inspiring', 'positive'],
    'technical': ['technology', 'digital', 'modern'],
    'simple': ['minimal', 'clean', 'simple']
  };
  
  const keywords = toneKeywords[tone] || toneKeywords['professional'];
  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
  
  return `${topic} ${randomKeyword}`;
}

// Export the configured axios instance
export default api;
