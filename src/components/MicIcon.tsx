import React from 'react';

interface MicIconProps {
	size?: number;
	color?: string;
	className?: string;
}

const MicIcon: React.FC<MicIconProps> = ({ size = 32, color = '#FFFFFF', className }) => {
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
			<rect x="8" y="3" width="8" height="12" rx="4" fill={color} />
			<path d="M5 11a7 7 0 0014 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M12 18v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
		</svg>
	);
};

export default MicIcon; 