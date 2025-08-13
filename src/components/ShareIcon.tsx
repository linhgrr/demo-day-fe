import React from 'react';

interface ShareIconProps {
  size?: number;
  color?: string;
  className?: string;
}

const ShareIcon: React.FC<ShareIconProps> = ({ size = 16, color = '#FFFFFF', className }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="18" cy="5" r="3" stroke={color} strokeWidth="2"/>
      <circle cx="6" cy="12" r="3" stroke={color} strokeWidth="2"/>
      <circle cx="18" cy="19" r="3" stroke={color} strokeWidth="2"/>
      <path d="M8.59 13.51l6.83 3.98" stroke={color} strokeWidth="2"/>
      <path d="M15.41 6.51l-6.82 3.98" stroke={color} strokeWidth="2"/>
    </svg>
  );
};

export default ShareIcon; 