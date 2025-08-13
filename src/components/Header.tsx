import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #ffffff;
  border-bottom: 1px solid #e9ecef;
`;

const LanguageSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #495057;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e9ecef;
  }

  &.active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }
`;

const ArrowIcon = styled.span`
  font-size: 12px;
  color: #6c757d;
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <LanguageSelector>
        <LanguageButton className="active">
          EN → JP
          <ArrowIcon>▼</ArrowIcon>
        </LanguageButton>
      </LanguageSelector>
      <LanguageSelector>
        <LanguageButton>
          JP → EN
          <ArrowIcon>▼</ArrowIcon>
        </LanguageButton>
      </LanguageSelector>
    </HeaderContainer>
  );
};

export default Header; 