import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Bouquets from './pages/Bouquets';
import Fleurs from './pages/Fleurs';
import MonCompte from './pages/MonCompte';

const menu = [
  { url: '/home', label: 'Home' },
  { url: '/bouquets', label: 'Bouquets' },
  { url: '/fleurs', label: 'Fleurs' },
  { url: '/moncompte', label: 'Mon Compte' },
];

const mesBouquets = [
  {
    id: 1,
    nom: "Bouquet de Tunis",
    desc:
      "Un dosage parfait de jasmins et de tulipes, des couleurs éclatantes et du soleil toute l’année chez vous.",
    image: "bouquetTunis.jpg",
    prix: 1500.0,
  },
  {
    id: 2,
    nom: "Bouquet d’Alger",
    desc:
      "Un mélange merveilleux de jasmins et de senteurs méditerranéennes, des odeurs éclatantes pour égayer votre bureau.",
    image: "bouquetAlger.webp",
    prix: 2000.0,
  },
  {
    id: 3,
    nom: "Bouquet d’Oran",
    desc:
      "Un mélange merveilleux de roses et de lys, des odeurs et des couleurs.",
    image: "bouquetOran.jpg",
    prix: 2000.0,
  },
];

function App() {
  return (
    <BrowserRouter>
      <Navbar menu={menu} />
      <Routes>

        <Route path="/bouquets" element={<Bouquets bouquets={mesBouquets} />} />
        <Route path="/fleurs" element={<Fleurs />} />
        <Route path="/moncompte" element={<MonCompte />} />
      </Routes>
    </BrowserRouter>


  );
}

export default App;
