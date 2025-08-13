import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MicIcon from '../components/MicIcon';

const HomeContainer = styled.div`
  min-height: calc(100vh - 73px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  position: relative;
`;

const MicrophoneContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  margin-bottom: 80px;
`;

const MicrophoneButton = styled.button`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border: 8px solid #ffffff;
  box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.2), 0 8px 32px rgba(0, 123, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.3), 0 12px 40px rgba(0, 123, 255, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }

  &::before {
    content: '';
    position: absolute;
    width: 140px;
    height: 140px;
    border: 2px solid rgba(0, 123, 255, 0.2);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
`;

const MicrophoneIcon = styled.div`
  width: 32px;
  height: 32px;
  background-color: white;
  border-radius: 8px 8px 8px 2px;
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 20px;
    background-color: #007bff;
    border-radius: 8px 8px 0 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 8px;
    background-color: #007bff;
  }
`;

const HistorySection = styled.div`
  position: absolute;
  bottom: 40px;
  left: 24px;
  right: 24px;
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const HistoryTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HistoryIcon = styled.span`
  font-size: 18px;
`;

const ViewAllButton = styled.button`
  background: none;
  color: #6c757d;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 16px;
  border: 1px solid #dee2e6;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const HistoryList = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
`;

const HistoryItem = styled.div`
  min-width: 200px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const HistoryItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const LanguageTag = styled.span`
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const HistoryText = styled.p`
  font-size: 14px;
  color: #495057;
  margin-bottom: 4px;
  line-height: 1.4;
`;

const HistoryTranslation = styled.p`
  font-size: 14px;
  color: #6c757d;
  line-height: 1.4;
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleMicrophoneClick = () => {
    // Simulate recording and navigate to text translation page
    setTimeout(() => {
      navigate('/text');
    }, 1000);
  };

  return (
    <HomeContainer>
      <MicrophoneContainer>
        <MicrophoneButton onClick={handleMicrophoneClick}>
          <MicIcon size={32} color="#FFFFFF" />
        </MicrophoneButton>
      </MicrophoneContainer>

      <HistorySection>
        <HistoryHeader>
          <HistoryTitle>
            Translation history
          </HistoryTitle>
          <ViewAllButton>Xem tất cả</ViewAllButton>
        </HistoryHeader>
        
        <HistoryList>
          <HistoryItem>
            <HistoryItemHeader>
              <LanguageTag>EN → JP</LanguageTag>
            </HistoryItemHeader>
            <HistoryText>Hello, nice to meet you</HistoryText>
            <HistoryTranslation>こんにちは、初めまして</HistoryTranslation>
          </HistoryItem>
          
          <HistoryItem>
            <HistoryItemHeader>
              <LanguageTag>EN → JP</LanguageTag>
            </HistoryItemHeader>
            <HistoryText>Hello, nice to meet you</HistoryText>
            <HistoryTranslation>こんにちは、初めまして</HistoryTranslation>
          </HistoryItem>
          
          <HistoryItem>
            <HistoryItemHeader>
              <LanguageTag>EN → JP</LanguageTag>
            </HistoryItemHeader>
            <HistoryText>Hello, nice to meet you</HistoryText>
            <HistoryTranslation>こんにちは、初めまして</HistoryTranslation>
          </HistoryItem>
        </HistoryList>
      </HistorySection>
    </HomeContainer>
  );
};

export default HomePage; 