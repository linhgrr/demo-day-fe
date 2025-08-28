import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import LoadingOverlay from '../components/LoadingOverlay';
import { apiService } from '../services/api';

const PageContainer = styled.div`
  min-height: calc(100vh - 73px);
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 24px;
`;

const TextContainer = styled.div`
  display: flex;
  gap: 24px;
  flex: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TextSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SectionHeader = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #495057;
  margin-bottom: 12px;
`;

const TextArea = styled.textarea`
  flex: 1;
  min-height: 300px;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  background-color: #ffffff;
  font-size: 16px;
  line-height: 1.5;
  resize: none;
  font-family: inherit;
  
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
  
  &:read-only {
    background-color: #f8f9fa;
    color: #6c757d;
  }
`;

const TranslateButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  transition: all 0.2s ease;
  z-index: 10;
  
  &:hover {
    background-color: #0056b3;
    transform: translate(-50%, -50%) scale(1.1);
  }
  
  &:active {
    transform: translate(-50%, -50%) scale(0.95);
  }
  
  @media (max-width: 768px) {
    position: static;
    transform: none;
    align-self: center;
    margin: 16px 0;
    
    &:hover {
      transform: scale(1.1);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
`;

const ArrowIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  
  &::before,
  &::after {
    content: '';
    width: 8px;
    height: 2px;
    background-color: currentColor;
    border-radius: 1px;
  }
  
  &::after {
    transform: rotate(45deg) translate(-2px, -2px);
  }
  
  &::before {
    transform: rotate(-45deg) translate(-2px, 2px);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
`;

const InlineActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  gap: 12px;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
`;

const PrimaryButton = styled(ActionButton)`
  background-color: #007bff;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(ActionButton)`
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
  
  &:hover:not(:disabled) {
    background-color: #e9ecef;
  }
  
  &:disabled {
    background-color: #e9ecef;
    color: #6c757d;
    cursor: not-allowed;
  }
`;

const TertiaryButton = styled(ActionButton)`
  background-color: transparent;
  color: #007bff;
  border: 1px dashed #b6d4fe;

  &:hover:not(:disabled) {
    background-color: #e7f1ff;
  }
  
  &:disabled {
    color: #6c757d;
    border-color: #dee2e6;
    cursor: not-allowed;
  }
`;

const TextTranslationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [originalText, setOriginalText] = useState('こんにちは');
  const [translatedText, setTranslatedText] = useState('翻訳結果がここに表示されます...');

  const getPlaceholderText = () => {
    if (direction.source === 'ja') {
      switch (direction.target) {
        case 'en':
          return 'Translation results will appear here...';
        case 'zh':
          return '翻译结果将在这里显示...';
        case 'ko':
          return '번역 결과가 여기에 표시됩니다...';
        default:
          return '翻訳結果がここに表示されます...';
      }
    } else {
      return '翻訳結果がここに表示されます...';
    }
  };

  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [direction, setDirection] = useState<{ source: 'ja'|'en'; target: 'ja'|'en'|'zh'|'ko' }>(() => ({
    source: (localStorage.getItem('translation.source') as 'ja'|'en') || 'ja',
    target: (localStorage.getItem('translation.target') as 'ja'|'en'|'zh'|'ko') || 'en',
  }));



  const handleTranslate = async () => {
    try {
      setIsTranslating(true);
      toast.info('テキストを翻訳中...', {
        position: "top-center",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
      });
      
      const result = await apiService.translateText(originalText, direction.source, direction.target);
      setTranslatedText(result.translatedText);
      
      toast.dismiss();
      toast.success('テキスト翻訳が完了しました！', {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Translation failed:', error);
      toast.dismiss();
      toast.error('テキスト翻訳中にエラーが発生しました', {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleContinueToAudio = async () => {
    const trimmed = translatedText.trim();
    if (!trimmed || trimmed === '翻訳結果がここに表示されます...') {
      return;
    }
    try {
      setIsGeneratingAudio(true);
      toast.info('音声を生成中...', {
        position: "top-center",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
      });
      
      const tts = await apiService.textToSpeech(trimmed, direction.target);
      
      toast.dismiss();
      toast.success('音声生成が完了しました！', {
        position: "top-center",
        autoClose: 2000,
      });
      
      navigate('/audio-result', { state: { audioUrl: tts.audioUrl, audioData: tts.audioData, translatedText: trimmed } });
    } catch (error) {
      console.error('Text to Speech failed:', error);
      toast.dismiss();
      toast.error('音声生成中にエラーが発生しました', {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  useEffect(() => {
    const state = location.state as { originalText?: string } | null;
    if (state && state.originalText) {
      setOriginalText(state.originalText);
    }
  }, [location.state]);

  useEffect(() => {
    const source = (localStorage.getItem('translation.source') as 'ja'|'en') || 'ja';
    const target = (localStorage.getItem('translation.target') as 'ja'|'en'|'zh'|'ko') || 'en';
    setDirection({ source, target });
  }, []);

  // Listen for changes from Header dropdown
  useEffect(() => {
    const handleStorageChange = () => {
      const source = (localStorage.getItem('translation.source') as 'ja'|'en') || 'ja';
      const target = (localStorage.getItem('translation.target') as 'ja'|'en'|'zh'|'ko') || 'en';
      setDirection({ source, target });
      
      // Reset translated text when language changes
      setTranslatedText('翻訳結果がここに表示されます...');
    };

    // Listen for custom event from Header
    window.addEventListener('translationDirectionChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('translationDirectionChanged', handleStorageChange);
    };
  }, []);

  return (
    <PageContainer>
      <TextContainer>
        <TextSection>
          <SectionHeader>元のテキスト</SectionHeader>
          <TextArea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="翻訳するテキストを入力してください..."
          />
        </TextSection>
        
        <TextSection>
          <SectionHeader>翻訳されたテキスト</SectionHeader>
          <TextArea
            value={translatedText}
            readOnly
            placeholder={getPlaceholderText()}
          />
        </TextSection>
      </TextContainer>
      
      <ButtonContainer>
        <SecondaryButton 
          onClick={handleBack}
          disabled={isTranslating || isGeneratingAudio}
        >
          戻る
        </SecondaryButton>
        <TertiaryButton 
          onClick={handleTranslate} 
          disabled={isTranslating || isGeneratingAudio}
        >
          {isTranslating ? '翻訳中...' : 'テキストを翻訳'}
        </TertiaryButton>
        <PrimaryButton 
          onClick={handleContinueToAudio} 
          disabled={!translatedText.trim() || translatedText === '翻訳結果がここに表示されます...' || isGeneratingAudio || isTranslating}
        >
          {isGeneratingAudio ? '音声生成中...' : '音声に進む'}
        </PrimaryButton>
      </ButtonContainer>
      
      <LoadingOverlay 
        isVisible={isTranslating || isGeneratingAudio}
        text={isTranslating ? "テキストを翻訳中..." : "音声を生成中..."}
        subText={isTranslating ? "テキストを別の言語に変換中" : "翻訳されたテキストから音声を生成中"}
      />
    </PageContainer>
  );
};

export default TextTranslationPage; 
