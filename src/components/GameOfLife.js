import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Canvas = styled.canvas`
  border: 1px solid #000;
`;

const ControlPanel = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 5px 10px;
  cursor: pointer;
`;

const GameOfLife = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [cellSize, setCellSize] = useState(10);
  const [fps, setFps] = useState(10);
  const [birthRule, setBirthRule] = useState([3]);
  const [survivalRule, setSurvivalRule] = useState([2, 3]);

  const cols = Math.floor(300 / cellSize);
  const rows = Math.floor(300 / cellSize);

  const [grid, setGrid] = useState(() =>
    Array(rows).fill().map(() => Array(cols).fill(false))
  );

  const drawGrid = useCallback((context, currentGrid) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = currentGrid[row][col];
        
        context.fillStyle = cell ? '#000' : '#fff';
        context.fillRect(col * cellSize, row * cellSize, cellSize - 1, cellSize - 1);
      }
    }
  }, [cellSize, cols, rows]);

  const updateGrid = useCallback(() => {
    const newGrid = grid.map(arr => [...arr]);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const neighbors = countNeighbors(grid, row, col);
        if (grid[row][col]) {
          if (!survivalRule.includes(neighbors)) {
            newGrid[row][col] = false;
          }
        } else {
          if (birthRule.includes(neighbors)) {
            newGrid[row][col] = true;
          }
        }
      }
    }
    setGrid(newGrid);
  }, [grid, rows, cols, birthRule, survivalRule]);

  const countNeighbors = (grid, row, col) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newRow = (row + i + rows) % rows;
        const newCol = (col + j + cols) % cols;
        count += grid[newRow][newCol] ? 1 : 0;
      }
    }
    return count;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    drawGrid(context, grid);
  }, [drawGrid, grid]);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(updateGrid, 1000 / fps);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, updateGrid, fps]);

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    setGrid(currentGrid => {
      const newGrid = currentGrid.map(arr => [...arr]);
      newGrid[row][col] = !newGrid[row][col];
      return newGrid;
    });
  };

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setGrid(Array(rows).fill().map(() => Array(cols).fill(false)));
    setIsRunning(false);
  };
  const handleRandom = () => {
    setGrid(Array(rows).fill().map(() => Array(cols).fill().map(() => Math.random() > 0.7)));
  };

  return (
    <GameContainer>
      <Canvas 
        ref={canvasRef}
        width={300}
        height={300}
        onClick={handleCanvasClick}
      />
      <ControlPanel>
        <Button onClick={isRunning ? handleStop : handleStart}>
          {isRunning ? 'Stop' : 'Start'}
        </Button>
        <Button onClick={handleReset}>Reset</Button>
        <Button onClick={handleRandom}>Randomize</Button>
      </ControlPanel>
      <div>
        <label>
          Cell Size:
          <input 
            type="number" 
            value={cellSize} 
            onChange={(e) => setCellSize(Number(e.target.value))}
            min="1"
            max="20"
          />
        </label>
      </div>
      <div>
        <label>
          FPS:
          <input 
            type="number" 
            value={fps} 
            onChange={(e) => setFps(Number(e.target.value))}
            min="1"
            max="60"
          />
        </label>
      </div>
      <div>
        <label>
          Birth Rule:
          <input 
            type="text" 
            value={birthRule.join(',')} 
            onChange={(e) => setBirthRule(e.target.value.split(',').map(Number))}
          />
        </label>
      </div>
      <div>
        <label>
          Survival Rule:
          <input 
            type="text" 
            value={survivalRule.join(',')} 
            onChange={(e) => setSurvivalRule(e.target.value.split(',').map(Number))}
          />
        </label>
      </div>
    </GameContainer>
  );
};

export default GameOfLife;
