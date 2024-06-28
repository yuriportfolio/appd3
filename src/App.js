import React, { useState } from 'react';
import styled from 'styled-components';
import Tesseract from './components/Tesseract';
import GameOfLife from './components/GameOfLife';
import ThreeScene from './components/ThreeScene';
import PixiParticles from './components/PixiParticles';
import logo from './logo.svg';
import './App.css';

const AppContainer = styled.div`
  text-align: center;
  background-color: ${props => props.isDarkMode ? '#282c34' : '#f0f0f0'};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: ${props => props.isDarkMode ? 'white' : 'black'};
  transition: all 0.3s ease;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const Logo = styled.img`
  height: 40vmin;
  pointer-events: none;
  @media (prefers-reduced-motion: no-preference) {
    animation: App-logo-spin infinite 20s linear;
  }
`;

const VisualizationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
`;

const ControlPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #61dafb;
  border: none;
  color: #282c34;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #21a1c4;
  }
`;

const Link = styled.a`
  color: #61dafb;
`;

function App() {
  const [showTesseract, setShowTesseract] = useState(true);
  const [showGameOfLife, setShowGameOfLife] = useState(true);
  const [showThreeScene, setShowThreeScene] = useState(true);
  const [showPixiParticles, setShowPixiParticles] = useState(true);

  return (
    <AppContainer>
      <Header>
        <Logo src={logo} alt="logo" />
        <h1>React Visualization Hub</h1>
      </Header>

      <ControlPanel>
        <Button onClick={() => setShowTesseract(!showTesseract)}>
          Toggle Tesseract
        </Button>
        <Button onClick={() => setShowGameOfLife(!showGameOfLife)}>
          Toggle Game of Life
        </Button>
        <Button onClick={() => setShowThreeScene(!showThreeScene)}>
          Toggle Three.js Scene
        </Button>
        <Button onClick={() => setShowPixiParticles(!showPixiParticles)}>
          Toggle Pixi.js Particles
        </Button>
      </ControlPanel>

      <VisualizationGrid>
        {showTesseract && <Tesseract isDarkMode={isDarkMode} />}
        {showGameOfLife && <GameOfLife />}
        {showThreeScene && <ThreeScene />}
        {showPixiParticles && <PixiParticles />}
      </VisualizationGrid>

      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <Link
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </Link>
    </AppContainer>
  );
}

export default App;