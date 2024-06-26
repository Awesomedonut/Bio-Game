// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import HomePage from './components/HomePage';
import Canvas from './components/Canvas';
import Flappy from './components/Flappy';
import Dialogue from './components/Dialogue';
import Signup from './Signup';
import MultiplayerCanvas from './components/MultiplayerCanvas';
import Intro from './components/Intro';
import PrivateRoutes from './utils/PrivateRoutes';
import Header from './components/Header';
import Win from './components/Win';
function App() {

  const width: number = window.innerWidth;
  const height: number = window.innerHeight;

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/intro" element={<Intro />} />
        <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/dialogue" element={<Dialogue />} />
            <Route path="/game" element={<Canvas width={width} height={height}/>} />
            <Route path='/multiplayer' element={<MultiplayerCanvas width={width} height={height}/>}/>
            <Route path="/flappy" element={<Flappy width={width} height={height} />} />
            <Route path="/intro" element={<Intro />} />
            <Route path="/win" element={<Win />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
