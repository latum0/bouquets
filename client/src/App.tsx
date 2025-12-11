import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Bouquets from './pages/Bouquets';
import Fleurs from './pages/Fleurs';
import MonCompte from './pages/MonCompte';
import BackendSync from './components/BackendSync';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import { Navbar } from './components/Navbar';

function App() {
  const bouquets = useSelector((state: RootState) => state.bouquets.items);

  const menu = [
    { url: '/bouquets', label: 'Bouquets' },
    { url: '/fleurs', label: 'Fleurs' },
    { url: '/moncompte', label: 'Mon Compte' },
  ];

  return (
    <BrowserRouter>
      <BackendSync />
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
