import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const TesseractContainer = styled.div`
  width: 300px;
  height: 300px;
  position: relative;
`;

const TesseractSVG = styled.svg`
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: rotate 20s infinite linear;

  @keyframes rotate {
    0% { transform: rotateX(0) rotateY(0); }
    100% { transform: rotateX(360deg) rotateY(360deg); }
  }
`;

const Tesseract = ({ isDarkMode }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    // Add any additional setup or animations here
  }, []);

  return (
    <TesseractContainer>
      <TesseractSVG ref={svgRef} viewBox="0 0 100 100">
        {/* Tesseract SVG content */}
        <path d="M20,20 L80,20 L80,80 L20,80 Z" fill="none" stroke={isDarkMode ? "#fff" : "#000"} strokeWidth="2" />
        <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke={isDarkMode ? "#fff" : "#000"} strokeWidth="2" />
        {/* Add more paths for the complete tesseract */}
      </TesseractSVG>
    </TesseractContainer>
  );
};

export default Tesseract;