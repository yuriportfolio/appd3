import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';

const PixiParticles = () => {
  const containerRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    appRef.current = new PIXI.Application({
      width: 300,
      height: 300,
      backgroundColor: 0x1099bb,
    });

    containerRef.current.appendChild(appRef.current.view);

    return () => {
      appRef.current.destroy(true, { children: true });
    };
  }, []);

  return <div ref={containerRef}></div>;
};

export default PixiParticles;