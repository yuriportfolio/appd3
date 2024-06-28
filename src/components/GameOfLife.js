import React, { useEffect, useRef, useCallback } from 'react';

const GameOfLife = ({ rows, cols }) => {
  const canvasRef = useRef(null);

  const drawGrid = useCallback((context, currentGrid) => {
    if (!context || !context.canvas) return;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        context.fillStyle = currentGrid[row][col] ? 'black' : 'white';
        context.fillRect(col * 10, row * 10, 10, 10);
      }
    }
  }, [rows, cols]);

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    const currentGrid = Array(rows).fill().map(() => Array(cols).fill(false));
    drawGrid(context, currentGrid);
  }, [drawGrid, rows, cols]);

  return <canvas ref={canvasRef} width={cols * 10} height={rows * 10} />;
};

export default GameOfLife;