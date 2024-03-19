// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import HomePage from './HomePage';
import Dialogue from './Dialogue';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dialogue" element={<Dialogue />} />

      </Routes>
    </Router>
  );
}

export default App;
