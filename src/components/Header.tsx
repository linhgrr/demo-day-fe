import React, { useEffect, useMemo, useState } from 'react';
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

const Dropdown = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #343a40;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e9ecef;
  }
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 44px;
  left: 0;
  min-width: 180px;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  padding: 8px;
  list-style: none;
  margin: 0;
  z-index: 1000;
`;

const DropdownItem = styled.li<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.$active ? '#0d6efd' : '#495057'};
  background: ${props => props.$active ? 'rgba(13, 110, 253, 0.08)' : 'transparent'};

  &:hover {
    background: #f8f9fa;
  }
`;

const ArrowIcon = styled.span`
  font-size: 12px;
  color: #6c757d;
`;

const Header: React.FC = () => {
  const options = useMemo(() => ([
    { key: 'ja-en', label: 'JA → EN', source: 'ja', target: 'en' },
    { key: 'ja-zh', label: 'JA → ZH', source: 'ja', target: 'zh' },
    { key: 'ja-ko', label: 'JA → KO', source: 'ja', target: 'ko' },
    { key: 'en-ja', label: 'EN → JA', source: 'en', target: 'ja' },
  ]), []);

  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>(() => {
    return localStorage.getItem('translation.direction') || 'ja-en';
  });

  const selected = options.find(o => o.key === selectedKey) || options[0];

  useEffect(() => {
    localStorage.setItem('translation.direction', selectedKey);
    localStorage.setItem('translation.source', selected.source);
    localStorage.setItem('translation.target', selected.target);
  }, [selectedKey, selected]);

  const toggle = () => setOpen(v => !v);
  const choose = (key: string) => {
    setSelectedKey(key);
    setOpen(false);
    
    // Update localStorage first
    const selectedOption = options.find(o => o.key === key);
    if (selectedOption) {
      localStorage.setItem('translation.source', selectedOption.source);
      localStorage.setItem('translation.target', selectedOption.target);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('translationDirectionChanged'));
    }
  };

  return (
    <HeaderContainer>
      <LanguageSelector>
        <Dropdown>
          <DropdownButton onClick={toggle} aria-expanded={open} aria-haspopup="menu">
            {selected.label}
            <ArrowIcon>▼</ArrowIcon>
          </DropdownButton>
          {open && (
            <DropdownMenu role="menu">
              {options.map(opt => (
                <DropdownItem key={opt.key} onClick={() => choose(opt.key)} $active={opt.key === selectedKey}>
                  <span>{opt.label}</span>
                  {opt.key === selectedKey && <span>✓</span>}
                </DropdownItem>
              ))}
            </DropdownMenu>
          )}
        </Dropdown>
      </LanguageSelector>
      <div />
    </HeaderContainer>
  );
};

export default Header; 
