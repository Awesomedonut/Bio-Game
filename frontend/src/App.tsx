// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import HomePage from './components/HomePage';
import Canvas from './components/Canvas';
import Dialogue from './Dialogue';
import { CanvasProps } from './interfaces/CanvasProps';
import Signup from './Signup';
import MultiplayerCanvas from './components/MultiplayerCanvas';

function App() {

  const width: number = window.innerWidth;
  const height: number = window.innerHeight;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dialogue" element={<Dialogue />} />
        <Route path="/game" element={<Canvas width={width} height={height}/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/multiplayer' element={<MultiplayerCanvas width={width} height={height}/>}/>
      </Routes>
    </Router>
  );
}

export default App;
