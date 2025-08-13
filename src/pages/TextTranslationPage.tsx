import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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
  
  &:hover {
    background-color: #0056b3;
  }
`;

const SecondaryButton = styled(ActionButton)`
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const TertiaryButton = styled(ActionButton)`
  background-color: transparent;
  color: #007bff;
  border: 1px dashed #b6d4fe;

  &:hover {
    background-color: #e7f1ff;
  }
`;

const TextTranslationPage: React.FC = () => {
  const navigate = useNavigate();
  const [originalText, setOriginalText] = useState('こんにちは');
  const [translatedText, setTranslatedText] = useState('Hello');

  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    try {
      setIsTranslating(true);
      const result = await apiService.translateText(originalText, 'ja', 'en');
      setTranslatedText(result.translatedText);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleReTranslate = async () => {
    await handleTranslate();
  };

  const handleContinueToAudio = () => {
    navigate('/audio-result');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <PageContainer>
      <TextContainer>
        <TextSection>
          <SectionHeader>Original input text</SectionHeader>
          <TextArea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Enter text to translate..."
          />
        </TextSection>
        
        <TextSection>
          <SectionHeader>Translated text</SectionHeader>
          <TextArea
            value={translatedText}
            readOnly
            placeholder="Translation will appear here..."
          />
          <InlineActions>
            <TertiaryButton onClick={handleReTranslate} disabled={isTranslating}>
              {isTranslating ? 'Translating...' : 'Re-translate'}
            </TertiaryButton>
          </InlineActions>
        </TextSection>
      </TextContainer>
      
      <ButtonContainer>
        <SecondaryButton onClick={handleBack}>
          Back
        </SecondaryButton>
        <PrimaryButton onClick={handleContinueToAudio}>
          Continue to Audio
        </PrimaryButton>
      </ButtonContainer>
    </PageContainer>
  );
};

export default TextTranslationPage; 