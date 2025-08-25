import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const LoadingCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 400px;
  text-align: center;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #e9ecef;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #495057;
`;

const SubText = styled.div`
  font-size: 14px;
  color: #6c757d;
  line-height: 1.5;
`;

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  subText?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  text = "処理中...", 
  subText = "しばらくお待ちください" 
}) => {
  if (!isVisible) return null;

  return (
    <Overlay>
      <LoadingCard>
        <Spinner />
        <div>
          <LoadingText>{text}</LoadingText>
          <SubText>{subText}</SubText>
        </div>
      </LoadingCard>
    </Overlay>
  );
};

export default LoadingOverlay;
