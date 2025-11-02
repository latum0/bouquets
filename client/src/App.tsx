import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Bouquets from './pages/Bouquets';
import Fleurs from './pages/Fleurs';
import MonCompte from './pages/MonCompte';
import BackendSync from './components/BackendSync';

function App() {
  const [bouquets, setBouquets] = useState(() => {
    try {
      const data = localStorage.getItem('mesBouquets');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return [];
    }
  });

  const menu = [
    { url: '/bouquets', label: 'Bouquets' },
    { url: '/fleurs', label: 'Fleurs' },
    { url: '/moncompte', label: 'Mon Compte' },
  ];

  return (
    <BrowserRouter>
      <BackendSync onLoad={setBouquets} />
      <Navbar menu={menu} />
      <Routes>
        <Route path="/" element={<Bouquets bouquets={bouquets} />} />
        <Route path="/bouquets" element={<Bouquets bouquets={bouquets} />} />
        <Route path="/fleurs" element={<Fleurs />} />
        <Route path="/moncompte" element={<MonCompte />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
