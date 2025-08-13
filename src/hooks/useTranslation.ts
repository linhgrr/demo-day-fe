import { useState, useCallback } from 'react';
import { apiService, TranslationHistory } from '../services/api';

export interface TranslationState {
  isLoading: boolean;
  error: string | null;
  originalText: string;
  translatedText: string;
  sourceLanguage: 'en' | 'ja';
  targetLanguage: 'en' | 'ja';
  audioUrl: string | null;
  history: TranslationHistory[];
}

export const useTranslation = () => {
  const [state, setState] = useState<TranslationState>({
    isLoading: false,
    error: null,
    originalText: '',
    translatedText: '',
    sourceLanguage: 'en',
    targetLanguage: 'ja',
    audioUrl: null,
    history: [],
  });

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading, error: null }));
  }, []);

  // Convert speech to text
  const speechToText = useCallback(async (audioFile: File) => {
    setLoading(true);
    try {
      const result = await apiService.speechToText(audioFile, state.sourceLanguage);
      setState(prev => ({
        ...prev,
        originalText: result.text,
        isLoading: false,
      }));
      return result.text;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Speech to text failed');
      return null;
    }
  }, [state.sourceLanguage, setLoading, setError]);

  // Translate text
  const translateText = useCallback(async (text?: string) => {
    const textToTranslate = text || state.originalText;
    if (!textToTranslate.trim()) {
      setError('No text to translate');
      return null;
    }

    setLoading(true);
    try {
      const result = await apiService.translateText(
        textToTranslate,
        state.sourceLanguage,
        state.targetLanguage
      );
      
      setState(prev => ({
        ...prev,
        translatedText: result.translatedText,
        isLoading: false,
      }));
      
      return result.translatedText;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Translation failed');
      return null;
    }
  }, [state.originalText, state.sourceLanguage, state.targetLanguage, setLoading, setError]);

  // Convert text to speech
  const textToSpeech = useCallback(async (text?: string) => {
    const textToSpeak = text || state.translatedText;
    if (!textToSpeak.trim()) {
      setError('No text to convert to speech');
      return null;
    }

    setLoading(true);
    try {
      const result = await apiService.textToSpeech(textToSpeak, state.targetLanguage);
      setState(prev => ({
        ...prev,
        audioUrl: result.audioUrl,
        isLoading: false,
      }));
      
      return result.audioUrl;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Text to speech failed');
      return null;
    }
  }, [state.translatedText, state.targetLanguage, setLoading, setError]);

  // Full translation pipeline: speech -> text -> translation -> speech
  const fullTranslation = useCallback(async (audioFile: File) => {
    try {
      // Step 1: Speech to Text
      const originalText = await speechToText(audioFile);
      if (!originalText) return false;

      // Step 2: Translate Text
      const translatedText = await translateText(originalText);
      if (!translatedText) return false;

      // Step 3: Text to Speech
      const audioUrl = await textToSpeech(translatedText);
      if (!audioUrl) return false;

      // Step 4: Save to history
      await saveTranslation();
      
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Full translation failed');
      return false;
    }
  }, [speechToText, translateText, textToSpeech]);

  // Save current translation to history
  const saveTranslation = useCallback(async () => {
    if (!state.originalText || !state.translatedText) {
      setError('Nothing to save');
      return null;
    }

    try {
      const savedTranslation = await apiService.saveTranslation({
        sourceText: state.originalText,
        translatedText: state.translatedText,
        sourceLanguage: state.sourceLanguage,
        targetLanguage: state.targetLanguage,
        audioUrl: state.audioUrl || undefined,
      });

      setState(prev => ({
        ...prev,
        history: [savedTranslation, ...prev.history],
      }));

      return savedTranslation;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save translation');
      return null;
    }
  }, [state.originalText, state.translatedText, state.sourceLanguage, state.targetLanguage, state.audioUrl, setError]);

  // Load translation history
  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const history = await apiService.getTranslationHistory();
      setState(prev => ({
        ...prev,
        history,
        isLoading: false,
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load history');
    }
  }, [setLoading, setError]);

  // Set languages
  const setLanguages = useCallback((sourceLanguage: 'en' | 'ja', targetLanguage: 'en' | 'ja') => {
    setState(prev => ({
      ...prev,
      sourceLanguage,
      targetLanguage,
    }));
  }, []);

  // Set text manually
  const setOriginalText = useCallback((text: string) => {
    setState(prev => ({
      ...prev,
      originalText: text,
    }));
  }, []);

  const setTranslatedText = useCallback((text: string) => {
    setState(prev => ({
      ...prev,
      translatedText: text,
    }));
  }, []);

  // Clear current translation
  const clearTranslation = useCallback(() => {
    setState(prev => ({
      ...prev,
      originalText: '',
      translatedText: '',
      audioUrl: null,
      error: null,
    }));
  }, []);

  return {
    ...state,
    speechToText,
    translateText,
    textToSpeech,
    fullTranslation,
    saveTranslation,
    loadHistory,
    setLanguages,
    setOriginalText,
    setTranslatedText,
    clearTranslation,
    setError,
  };
}; 