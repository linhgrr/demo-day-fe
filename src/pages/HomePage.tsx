import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MicIcon from '../components/MicIcon';
import LoadingOverlay from '../components/LoadingOverlay';
import { apiService } from '../services/api';

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

const MicrophoneButton = styled.button<{ $recording: boolean; disabled?: boolean }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => {
    if (props.disabled) {
      return 'linear-gradient(135deg, #6c757d 0%, #495057 100%)';
    }
    return props.$recording
      ? 'linear-gradient(135deg, #dc3545 0%, #b02a37 100%)'
      : 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)';
  }};
  border: 8px solid #ffffff;
  box-shadow: ${props => {
    if (props.disabled) {
      return '0 0 0 4px rgba(108, 117, 125, 0.2), 0 8px 32px rgba(108, 117, 125, 0.3)';
    }
    return props.$recording
      ? '0 0 0 4px rgba(220, 53, 69, 0.2), 0 8px 32px rgba(220, 53, 69, 0.3)'
      : '0 0 0 4px rgba(0, 123, 255, 0.2), 0 8px 32px rgba(0, 123, 255, 0.3)';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'scale(1.05)'};
    box-shadow: ${props => {
      if (props.disabled) {
        return '0 0 0 4px rgba(108, 117, 125, 0.2), 0 8px 32px rgba(108, 117, 125, 0.3)';
      }
      return props.$recording
        ? '0 0 0 4px rgba(220, 53, 69, 0.3), 0 12px 40px rgba(220, 53, 69, 0.4)'
        : '0 0 0 4px rgba(0, 123, 255, 0.3), 0 12px 40px rgba(0, 123, 255, 0.4)';
    }};
  }

  &:active {
    transform: ${props => props.disabled ? 'none' : 'scale(0.95)'};
  }

  &::before {
    content: '';
    position: absolute;
    width: 140px;
    height: 140px;
    border: ${props => {
      if (props.disabled) {
        return '2px solid rgba(108, 117, 125, 0.2)';
      }
      return props.$recording
        ? '2px solid rgba(220, 53, 69, 0.2)'
        : '2px solid rgba(0, 123, 255, 0.2)';
    }};
    border-radius: 50%;
    animation: ${props => props.disabled ? 'none' : 'pulse 2s infinite'};
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

const blobToWavFile = async (blob: Blob, fileName: string = 'recording.wav'): Promise<File> => {
  const arrayBuffer = await blob.arrayBuffer();
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
  const channelCount = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;
  const sampleRate = audioBuffer.sampleRate;
  const durationSec = audioBuffer.duration;

  console.log('[DEBUG] Decoded raw audio', {
    channelCount,
    sampleRate,
    length,
    durationSec: Number(durationSec.toFixed(3)),
  });

  const monoData = new Float32Array(length);
  for (let channel = 0; channel < channelCount; channel++) {
    const data = audioBuffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      monoData[i] += data[i] / channelCount;
    }
  }

  const bytesPerSample = 2;
  const blockAlign = 1 * bytesPerSample;
  const buffer = new ArrayBuffer(44 + monoData.length * bytesPerSample);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + monoData.length * bytesPerSample, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, monoData.length * bytesPerSample, true);

  let offset = 44;
  for (let i = 0; i < monoData.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, monoData[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  const wavBlob = new Blob([view], { type: 'audio/wav' });
  const wavFile = new File([wavBlob], fileName, { type: 'audio/wav' });

  console.log('[DEBUG] Built WAV file', {
    fileName,
    type: wavFile.type,
    sizeBytes: wavFile.size,
  });

  return wavFile;
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          setIsProcessing(true);
          toast.info('音声を処理中...', {
            position: "top-center",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
          });

          const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
          console.log('[DEBUG] Raw recording blob', {
            mimeType: mediaRecorder.mimeType,
            sizeBytes: audioBlob.size,
            type: audioBlob.type,
          });
          const wavFile = await blobToWavFile(audioBlob, 'recording.wav');
          console.log('[DEBUG] Sending WAV to STT', {
            name: wavFile.name,
            type: wavFile.type,
            sizeBytes: wavFile.size,
          });
          const result = await apiService.speechToText(wavFile, 'auto');
          const text = result?.text || '';
          
          toast.dismiss();
          toast.success('音声処理が完了しました！', {
            position: "top-center",
            autoClose: 2000,
          });
          
          navigate('/text', { state: { originalText: text } });
        } catch (err) {
          console.error('Failed to process recording:', err);
          toast.dismiss();
          toast.error('音声処理中にエラーが発生しました', {
            position: "top-center",
            autoClose: 3000,
          });
          navigate('/text');
        } finally {
          setIsProcessing(false);
        }
      };

      console.log('[DEBUG] Start recording', { mimeType: mediaRecorder.mimeType });
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone access denied or error:', error);
      toast.error('マイクにアクセスできません', {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
  };

  const handleMicrophoneClick = () => {
    if (!isRecording && !isProcessing) {
      startRecording();
    } else if (isRecording) {
      stopRecording();
    }
  };

  return (
    <HomeContainer>
      <MicrophoneContainer>
        <MicrophoneButton 
          onClick={handleMicrophoneClick} 
          aria-pressed={isRecording} 
          title={isRecording ? '録音を停止' : '録音を開始'} 
          $recording={isRecording}
          disabled={isProcessing}
        >
          <MicIcon size={32} color="#FFFFFF" />
        </MicrophoneButton>
      </MicrophoneContainer>

      <HistorySection>
        <HistoryHeader>
          <HistoryTitle>
            翻訳履歴
          </HistoryTitle>
          <ViewAllButton>すべて表示</ViewAllButton>
        </HistoryHeader>
        
        <HistoryList>
          <HistoryItem>
            <HistoryItemHeader>
              <LanguageTag>JP → EN</LanguageTag>
            </HistoryItemHeader>
            <HistoryText>こんにちは、初めまして</HistoryText>
            <HistoryTranslation>Hello, nice to meet you</HistoryTranslation>
          </HistoryItem>
          
          <HistoryItem>
            <HistoryItemHeader>
              <LanguageTag>JP → EN</LanguageTag>
            </HistoryItemHeader>
            <HistoryText>お疲れ様です</HistoryText>
            <HistoryTranslation>Thank you for your hard work</HistoryTranslation>
          </HistoryItem>
          
          <HistoryItem>
            <HistoryItemHeader>
              <LanguageTag>JP → EN</LanguageTag>
            </HistoryItemHeader>
            <HistoryText>ありがとうございます</HistoryText>
            <HistoryTranslation>Thank you very much</HistoryTranslation>
          </HistoryItem>
        </HistoryList>
      </HistorySection>
      
      <LoadingOverlay 
        isVisible={isProcessing}
        text="音声を処理中..." 
        subText="音声をテキストに変換中"
      />
    </HomeContainer>
  );
};

export default HomePage; 
