// API service for backend integration
// This file contains the API calls for the three main services:
// 1. Speech to Text
// 2. Machine Translation  
// 3. Text to Speech

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://mt-be-orcin.vercel.app';
// Dedicated base URL for speech-related services via ngrok
const NGROK_BASE_URL = 'https://c535d1b93a78.ngrok-free.app';

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
  audioData: Blob; // Thêm audioData để lưu trữ blob
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
  audioData?: Blob; // Thêm audioData để lưu trữ blob
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

  private async requestWithBase<T>(baseUrl: string, endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${baseUrl}${endpoint}`;
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
      console.error('API Request (custom base) failed:', error);
      throw error;
    }
  }

  // Speech to Text API
  async speechToText(audioFile: File, language: string = 'auto'): Promise<SpeechToTextResponse> {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('language', language);

    try {
      console.log('[DEBUG] STT request payload', {
        file: { name: audioFile.name, type: audioFile.type, sizeBytes: audioFile.size },
        language,
        url: `${NGROK_BASE_URL}/api/speech-to-text`
      });
      const response = await fetch(`${NGROK_BASE_URL}/api/speech-to-text`, {
        method: 'POST',
        // Important: Do not set Content-Type for FormData; browser will set boundary
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Speech to Text API Error: ${response.status}`);
      }

      const json = await response.json();
      console.log('[DEBUG] STT response', json);
      return json;
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
    sourceLanguage: 'ja' | 'en',
    targetLanguage: 'en' | 'ja' | 'zh' | 'ko'
  ): Promise<TranslationResponse> {
    try {
      const response = await this.request<any>('/api/translate', {
        method: 'POST',
        body: JSON.stringify({
          text,
          sourceLanguage,
          targetLanguage,
        }),
      });

      // Map snake_case response to our camelCase type
      const mapped: TranslationResponse = {
        translatedText: response.translated_text,
        sourceLanguage: response.source_language,
        targetLanguage: response.target_language,
        confidence: 1.0,
      };

      return mapped;
    } catch (error) {
      console.error('Translation failed:', error);
      // Return mock data for development
      let mockTranslatedText = '';
      if (sourceLanguage === 'ja') {
        switch (targetLanguage) {
          case 'en':
            mockTranslatedText = 'Hello, nice to meet you';
            break;
          case 'zh':
            mockTranslatedText = '你好，很高兴见到你';
            break;
          case 'ko':
            mockTranslatedText = '안녕하세요, 만나서 반갑습니다';
            break;
          default:
            mockTranslatedText = 'Hello, nice to meet you';
        }
      } else if (sourceLanguage === 'en') {
        mockTranslatedText = 'こんにちは、初めまして';
      }
      
      return {
        translatedText: mockTranslatedText,
        sourceLanguage,
        targetLanguage,
        confidence: 0.92,
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
      const response = await fetch(`${NGROK_BASE_URL}/api/text-to-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`TTS Error: ${response.status}`);
      }

      // Backend trả về file audio trực tiếp, không phải JSON
      // Tạo blob URL từ response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      return {
        audioUrl,
        audioData: audioBlob,
        duration: 0 // Không thể xác định duration từ blob, sẽ được tính khi phát
      };
    } catch (error) {
      console.error('Text to Speech failed:', error);
      // Return mock data for development
      return {
        audioUrl: '/mock-audio.mp3',
        audioData: new Blob(),
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
          targetLanguage: 'ja',
          timestamp: new Date().toISOString(),
          audioData: new Blob(),
        },
        {
          id: '2',
          sourceText: '電車が遅延しております',
          translatedText: '列车延误了',
          sourceLanguage: 'ja',
          targetLanguage: 'zh',
          timestamp: new Date().toISOString(),
          audioData: new Blob(),
        },
        {
          id: '3',
          sourceText: 'お疲れ様です',
          translatedText: '수고하셨습니다',
          sourceLanguage: 'ja',
          targetLanguage: 'ko',
          timestamp: new Date().toISOString(),
          audioData: new Blob(),
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
        audioData: translation.audioData || new Blob(),
      };
    }
  }
}

export const apiService = new ApiService(); 
