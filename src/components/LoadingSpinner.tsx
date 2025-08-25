import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e9ecef;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #495057;
  text-align: center;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const SubText = styled.div`
  font-size: 14px;
  color: #6c757d;
  text-align: center;
  margin-top: 4px;
`;

interface LoadingSpinnerProps {
  text?: string;
  subText?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = "処理中...", 
  subText = "しばらくお待ちください" 
}) => {
  return (
    <LoadingContainer>
      <Spinner />
      <div>
        <LoadingText>{text}</LoadingText>
        <SubText>{subText}</SubText>
      </div>
    </LoadingContainer>
  );
};

export default LoadingSpinner;
