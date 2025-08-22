import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MicIcon from '../components/MicIcon';

const PageContainer = styled.div`
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
  margin-bottom: 40px;
`;

const MicrophoneButton = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border: 8px solid #ffffff;
  box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.2), 0 8px 32px rgba(0, 123, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 140px;
    height: 140px;
    border: 2px solid rgba(0, 123, 255, 0.2);
    border-radius: 50%;
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

const ResultLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #495057;
  margin-bottom: 24px;
`;

const AudioPlayerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 16px 24px;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
`;

const PauseButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
`;

const PauseIcon = styled.div`
  display: flex;
  gap: 2px;
  
  &::before,
  &::after {
    content: '';
    width: 2px;
    height: 10px;
    background-color: white;
    border-radius: 1px;
  }
`;

const WaveformContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  height: 40px;
`;

const WaveformBar = styled.div<{ height: number; active?: boolean; playing?: boolean }>`
  width: 3px;
  height: ${props => props.height}px;
  background-color: ${props => props.active ? '#007bff' : '#dee2e6'};
  border-radius: 2px;
  transition: all 0.2s ease;
  animation: ${props => props.playing && props.active ? 'wave 0.5s ease-in-out infinite alternate' : 'none'};
  
  @keyframes wave {
    0% {
      transform: scaleY(1);
    }
    100% {
      transform: scaleY(1.2);
    }
  }
`;

const TimeDisplay = styled.div`
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
  min-width: 60px;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
`;

const ActionButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
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

const AudioPlayingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentProgress, setCurrentProgress] = useState(0);

  const waveformHeights = [12, 20, 16, 24, 18, 28, 22, 16, 20, 14, 26, 18, 22, 16, 20, 24, 18, 14, 22, 16];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentProgress(prev => {
          if (prev >= waveformHeights.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isPlaying, waveformHeights.length]);

  const handlePause = () => {
    setIsPlaying(false);
    navigate('/audio-result');
  };

  return (
    <PageContainer>
      <MicrophoneContainer>
        <MicrophoneButton onClick={() => navigate('/') }>
          <MicIcon size={32} color="#FFFFFF" />
        </MicrophoneButton>
        <ResultLabel>Translated result</ResultLabel>
      </MicrophoneContainer>

      <AudioPlayerContainer>
        <PauseButton onClick={handlePause}>
          <PauseIcon />
        </PauseButton>
        
        <WaveformContainer>
          {waveformHeights.map((height, index) => (
            <WaveformBar 
              key={index} 
              height={height} 
              active={index <= currentProgress}
              playing={isPlaying && index === currentProgress}
            />
          ))}
        </WaveformContainer>
        
        <TimeDisplay>00:05:00</TimeDisplay>
        
        <ActionButtonsContainer>
          <ActionButton onClick={() => navigate('/')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M17 1l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 11V9a4 4 0 014-4h14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 23l-4-4 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 13v2a4 4 0 01-4 4H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionButton>
          
          <ActionButton onClick={() => navigate('/')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="18" cy="5" r="3" stroke="white" strokeWidth="2"/>
              <circle cx="6" cy="12" r="3" stroke="white" strokeWidth="2"/>
              <circle cx="18" cy="19" r="3" stroke="white" strokeWidth="2"/>
              <path d="M8.59 13.51l6.83 3.98" stroke="white" strokeWidth="2"/>
              <path d="M15.41 6.51l-6.82 3.98" stroke="white" strokeWidth="2"/>
            </svg>
          </ActionButton>
        </ActionButtonsContainer>
      </AudioPlayerContainer>

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
    </PageContainer>
  );
};

export default AudioPlayingPage; 
