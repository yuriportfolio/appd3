import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import * as d3 from 'd3';

const PixiD3ForceGraph = () => {
  const containerRef = useRef(null);
  const appRef = useRef(null);
  const simulationRef = useRef(null);

  useEffect(() => {
    const initializePixi = async () => {
      if (!containerRef.current) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const numberOfItems = 500;

      // Initialize PIXI Application
      const app = new PIXI.Application();
      await app.init({
        width,
        height,
        backgroundColor: 0x212121,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
      });

      appRef.current = app;
      containerRef.current.appendChild(app.canvas);

    // Create viewport
    const viewport = new PIXI.Container();
    app.stage.addChild(viewport);

    // Create particle texture
    const makeParticleTexture = (props) => {
      const gfx = new PIXI.Graphics();
      gfx.beginFill(props.fill);
      gfx.lineStyle(props.strokeWidth, props.stroke);
      gfx.drawRect(0, 0, props.size, props.size);
      gfx.endFill();
      return app.renderer.generateTexture(gfx, PIXI.SCALE_MODES.LINEAR, 2);
    };

    const texture = makeParticleTexture({
      fill: 0xd30000,
      stroke: 0xffffff,
      strokeWidth: 1,
      size: 8
    });

    const textureHover = makeParticleTexture({
      fill: 0xffffff,
      stroke: 0xffffff,
      strokeWidth: 1,
      size: 10
    });

    // Create sprites
    const sprites = [];
    for (let i = 0; i < numberOfItems; i++) {
      const sprite = new PIXI.Sprite(texture);
      sprite.x = Math.random() * width;
      sprite.y = Math.random() * height;
      sprite.anchor.set(0.5);
      sprite.scale.set(Math.random() * 0.5 + 0.5);
      sprite.interactive = true;
      sprite.buttonMode = true;
      sprites.push(sprite);
      viewport.addChild(sprite);
    }

    // Create links
    const links = d3.range(numberOfItems - 1).map(i => ({
      source: Math.floor(Math.sqrt(i)),
      target: i + 1,
      value: Math.random() + 0.5
    }));

    // Create link graphics
    const linksGraphics = new PIXI.Graphics();
    viewport.addChild(linksGraphics);

    // Create D3 force simulation
   const simulation = d3.forceSimulation(sprites)
        .velocityDecay(0.8)
        .force("charge", d3.forceManyBody().strength(-50))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("link", d3.forceLink(links).id(d => sprites.indexOf(d)).distance(50))
        .force("collision", d3.forceCollide().radius(10))
        .on("tick", () => {
          updateLinks();
        });

      simulationRef.current = simulation;


    function updateLinks() {
      linksGraphics.clear();
      linksGraphics.alpha = 0.1;
      links.forEach(link => {
        linksGraphics.lineStyle(link.value, 0xfefefe);
        linksGraphics.moveTo(link.source.x, link.source.y);
        linksGraphics.lineTo(link.target.x, link.target.y);
      });
      linksGraphics.endFill();
    }

    // Interaction handlers
    function onDragStart(event) {
      const sprite = event.currentTarget;
      sprite.alpha = 0.5;
      sprite.dragging = true;
      simulation.alphaTarget(0.3).restart();
    }

    function onDragEnd(event) {
      const sprite = event.currentTarget;
      sprite.alpha = 1;
      sprite.dragging = false;
      sprite.data = null;
      sprite.texture = texture;
      simulation.alphaTarget(0);
    }

    function onDragMove(event) {
      const sprite = event.currentTarget;
      if (sprite.dragging) {
        const newPosition = event.data.getLocalPosition(sprite.parent);
        sprite.x = newPosition.x;
        sprite.y = newPosition.y;
      }
    }

    sprites.forEach(sprite => {
      sprite
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove)
        .on('pointerover', () => { sprite.texture = textureHover; })
        .on('pointerout', () => { if (!sprite.dragging) sprite.texture = texture; });
    });

    app.ticker.add(() => {
      simulation.tick();
      sprites.forEach(sprite => {
        sprite.position.set(sprite.x, sprite.y);
      });
    });
  };

  initializePixi();

  return () => {
    if (appRef.current) {
      appRef.current.destroy(true, { children: true, texture: true, baseTexture: true });
    }
    if (simulationRef.current) {
      simulationRef.current.stop();
    }
  };
}, []);

return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default PixiD3ForceGraph;
