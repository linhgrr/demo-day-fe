import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import HomePage from './pages/HomePage';
import TextTranslationPage from './pages/TextTranslationPage';
import AudioResultPage from './pages/AudioResultPage';
import AudioPlayingPage from './pages/AudioPlayingPage';
import Header from './components/Header';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const MainContent = styled.main`
  padding: 0;
`;

function App() {
  return (
    <AppContainer>
      <Router>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/text" element={<TextTranslationPage />} />
            <Route path="/audio-result" element={<AudioResultPage />} />
            <Route path="/audio-playing" element={<AudioPlayingPage />} />
          </Routes>
        </MainContent>
      </Router>
    </AppContainer>
  );
}

export default App;
