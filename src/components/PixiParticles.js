import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';

const PixiParticles = () => {
  const containerRef = useRef(null);
  const pixiRef = useRef(null);
  const [error, setError] = useState(null);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const initializePixi = async () => {
      if (!containerRef.current) return;

      try {
        // Create application
        const app = new PIXI.Application({
          width: 300,
          height: 300,
          backgroundColor: 0x000000, // Black background
          resolution: window.devicePixelRatio || 1,
        });

        // Wait for the application to be ready
        await app.init();

        if (!isMounted) {
          app.destroy(true, { children: true });
          return;
        }

        // Append canvas to the container
        containerRef.current.appendChild(app.view);

        // Store the PIXI application in a ref
        pixiRef.current = app;

        // Create particles
        const particlesContainer = new PIXI.Container();
        app.stage.addChild(particlesContainer);

        const particlesArray = [];

        for (let i = 0; i < 1000; i++) {
          const particle = new PIXI.Graphics();
          particle.beginFill(Math.random() * 0xFFFFFF);
          particle.drawCircle(0, 0, 2 + Math.random() * 3);
          particle.endFill();
          particle.x = Math.random() * app.screen.width;
          particle.y = Math.random() * app.screen.height;
          particle.alpha = 0.5 + Math.random() * 0.5;
          particle.direction = Math.random() * Math.PI * 2;
          particle.turningSpeed = Math.random() - 0.8;
          particle.speed = (2 + Math.random() * 2) * 0.2;
          particlesContainer.addChild(particle);
          particlesArray.push(particle);
        }

        // Add FPS text
        const fpsText = new PIXI.Text('FPS: 0', { 
          fill: 0xffffff,
          fontSize: 12
        });
        app.stage.addChild(fpsText);

        let elapsed = 0;
        // Animation loop
        app.ticker.add((delta) => {
          elapsed += delta;
          particlesArray.forEach(particle => {
            particle.direction += particle.turningSpeed * 0.01;
            particle.x += Math.sin(particle.direction) * particle.speed;
            particle.y += Math.cos(particle.direction) * particle.speed;

            if (particle.x < 0) particle.x += app.screen.width;
            else if (particle.x > app.screen.width) particle.x -= app.screen.width;

            if (particle.y < 0) particle.y += app.screen.height;
            else if (particle.y > app.screen.height) particle.y -= app.screen.height;
          });

          // Update FPS counter
          if (elapsed > 30) { // Update every 30 frames
            const fps = Math.round(app.ticker.FPS);
            fpsText.text = `FPS: ${fps}`;
            setFps(fps);
            elapsed = 0;
          }
        });

        console.log('PIXI application initialized successfully');

      } catch (err) {
        console.error("Error initializing PIXI.js:", err);
        setError(err.message);
      }
    };

    initializePixi();

    return () => {
      isMounted = false;
      if (pixiRef.current) {
        pixiRef.current.destroy(true, { children: true });
        pixiRef.current = null;
      }
    };
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div ref={containerRef} style={{ width: '300px', height: '300px' }} />
      <p>FPS: {fps}</p>
    </div>
  );
};

export default PixiParticles;
