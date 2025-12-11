import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // <-- NOUVEAU: Importez useSelector
import type { MenuItem } from '../types/navbar.dto';

// Assurez-vous d'importer RootState pour le typage de l'état si vous utilisez TypeScript
import { type RootState } from '../store'; // <-- Ajustez le chemin vers votre store/index.ts

// Importez les sélecteurs. Le chemin '../services/auth' est utilisé ici,
// mais ils devraient idéalement être dans un dossier 'store' ou 'selectors'.
import { isAuthentificated, whoIsAuthentificated } from '../services/auth';

interface NavbarProps {
  menu: MenuItem[];
}

export const Navbar: React.FC<NavbarProps> = ({ menu }) => {
  // 1. State local pour le menu déroulant
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 2. Utilisation de l'hook useSelector pour obtenir les valeurs de l'état Redux

  // Appeler les sélecteurs en leur passant l'état global (state)
  // L'hook useSelector est la SEULE façon d'appeler ces fonctions sélecteurs dans un composant.
  const authenticated = useSelector(
    isAuthentificated as (state: RootState) => boolean,
  );
  const userLabel = useSelector(
    whoIsAuthentificated as (state: RootState) => string,
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 3. PROCESS THE MENU using authentication status
  const processedMenu = useMemo(() => {
    // La logique utilise directement les variables `authenticated` et `userLabel`
    // obtenues via useSelector, sans appel de fonction.
    return menu.map((item) => {
      // Check for the "Mon Compte" link
      if (item.url === '/moncompte') {
        // Appliquer le label dynamique si l'utilisateur est connecté.
        if (authenticated) {
          // Return the item with the dynamically updated label
          return { ...item, label: userLabel };
        }
      }
      return item; // Return all other items unchanged
    });
  }, [menu, authenticated, userLabel]); // <-- Dépendances mises à jour pour le useMemo

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ... Brand Link ... */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-blue-600 hover:text-blue-700"
            >
              Fleurs
            </Link>
          </div>

          {/* Desktop Menu & Search */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <ul className="flex space-x-4">
              {/* Map over the processed menu */}
              {processedMenu.map((e) => (
                // Utiliser une clé stable (comme l'url) est mieux si le label change
                <li key={e.url || e.label}>
                  <Link
                    to={e.url}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition duration-150 ease-in-out"
                  >
                    {e.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* ... Search Form ... */}
            <form className="flex space-x-2">
              <input
                type="search"
                placeholder="Search"
                aria-label="Search"
                className="
                  border border-gray-300 rounded-md py-1 px-3 
                  focus:ring-blue-500 focus:border-blue-500 
                  w-48 text-sm
                "
              />
              <button
                type="submit"
                className="
                  px-3 py-1 text-sm rounded-md 
                  bg-blue-600 text-white 
                  hover:bg-blue-700 
                  transition duration-150 ease-in-out
                "
              >
                Search
              </button>
            </form>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="
                inline-flex items-center justify-center p-2 rounded-md 
                text-gray-700 hover:text-blue-600 hover:bg-gray-100 
                focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500
              "
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                // Close icon (X)
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Menu icon (Hamburger)
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content (Hidden on Desktop) */}
      <div
        className={`${isMenuOpen ? 'block' : 'hidden'} lg:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {processedMenu.map((e) => (
            <Link
              to={e.url}
              key={e.url || e.label} // Utiliser l'URL comme clé
              onClick={toggleMenu} // Close menu when a link is clicked
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            >
              {e.label}
            </Link>
          ))}
        </div>

        {/* ... Mobile Search Form ... */}
        <div className="border-t border-gray-200 pt-4 pb-2 px-2 sm:px-3">
          <form className="flex space-x-2">
            <input
              type="search"
              placeholder="Search"
              className="
                        flex-grow border border-gray-300 rounded-md py-2 px-3 
                        focus:ring-blue-500 focus:border-blue-500 text-sm
                    "
            />
            <button
              type="submit"
              className="
                        px-3 py-2 text-sm rounded-md 
                        bg-blue-600 text-white 
                        hover:bg-blue-700
                    "
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};
