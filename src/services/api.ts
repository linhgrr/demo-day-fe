// API service for backend integration
// This file contains the API calls for the three main services:
// 1. Speech to Text
// 2. Machine Translation  
// 3. Text to Speech

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

export interface SpeechToTextResponse {
  text: string;
  confidence: number;
  language: string;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
}

export interface TextToSpeechResponse {
  audioUrl: string;
  duration: number;
}

export interface TranslationHistory {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: string;
  audioUrl?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Speech to Text API
  async speechToText(audioFile: File, language: string = 'auto'): Promise<SpeechToTextResponse> {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('language', language);

    try {
      const response = await fetch(`${API_BASE_URL}/speech-to-text`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Speech to Text API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Speech to Text failed:', error);
      // Return mock data for development
      return {
        text: 'Hello, nice to meet you',
        confidence: 0.95,
        language: 'en'
      };
    }
  }

  // Machine Translation API
  async translateText(
    text: string, 
    sourceLanguage: string, 
    targetLanguage: string
  ): Promise<TranslationResponse> {
    try {
      return await this.request<TranslationResponse>('/translate', {
        method: 'POST',
        body: JSON.stringify({
          text,
          sourceLanguage,
          targetLanguage,
        }),
      });
    } catch (error) {
      console.error('Translation failed:', error);
      // Return mock data for development
      return {
        translatedText: text === 'Hello, nice to meet you' ? 'こんにちは、初めまして' : 'Hello',
        sourceLanguage,
        targetLanguage,
        confidence: 0.92
      };
    }
  }

  // Text to Speech API
  async textToSpeech(
    text: string, 
    language: string = 'en',
    voice: string = 'default'
  ): Promise<TextToSpeechResponse> {
    try {
      return await this.request<TextToSpeechResponse>('/text-to-speech', {
        method: 'POST',
        body: JSON.stringify({
          text,
          language,
          voice,
        }),
      });
    } catch (error) {
      console.error('Text to Speech failed:', error);
      // Return mock data for development
      return {
        audioUrl: '/mock-audio.mp3',
        duration: 5.0
      };
    }
  }

  // Get translation history
  async getTranslationHistory(): Promise<TranslationHistory[]> {
    try {
      return await this.request<TranslationHistory[]>('/history');
    } catch (error) {
      console.error('Failed to fetch history:', error);
      // Return mock data for development
      return [
        {
          id: '1',
          sourceText: 'Hello, nice to meet you',
          translatedText: 'こんにちは、初めまして',
          sourceLanguage: 'en',
          targetLanguage: 'jp',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          sourceText: 'Hello, nice to meet you',
          translatedText: 'こんにちは、初めまして',
          sourceLanguage: 'en',
          targetLanguage: 'jp',
          timestamp: new Date().toISOString(),
        },
        {
          id: '3',
          sourceText: 'Hello, nice to meet you',
          translatedText: 'こんにちは、初めまして',
          sourceLanguage: 'en',
          targetLanguage: 'jp',
          timestamp: new Date().toISOString(),
        },
      ];
    }
  }

  // Save translation to history
  async saveTranslation(translation: Omit<TranslationHistory, 'id' | 'timestamp'>): Promise<TranslationHistory> {
    try {
      return await this.request<TranslationHistory>('/history', {
        method: 'POST',
        body: JSON.stringify(translation),
      });
    } catch (error) {
      console.error('Failed to save translation:', error);
      // Return mock data for development
      return {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...translation,
      };
    }
  }
}

export const apiService = new ApiService(); 