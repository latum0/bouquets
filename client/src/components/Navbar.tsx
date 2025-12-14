import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 🌟 NOUVEAU: useNavigate
import { useSelector, useDispatch } from 'react-redux'; // 🌟 NOUVEAU: useDispatch
import type { MenuItem } from '../types/navbar.dto';

import { type RootState } from '../store';
import {
  isAuthentificated,
  whoIsAuthentificated,
  handleLogout,
} from '../services/auth'; // 🌟 NOUVEAU: Importez handleLogout
import { logoutUser } from '../store/authSlice'; // 🌟 Importez l'action Redux

interface NavbarProps {
  menu: MenuItem[];
}

// =========================================================
// NOUVEAU COMPOSANT : MENU DÉROULANT UTILISATEUR
// =========================================================
interface UserMenuProps {
  userLabel: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ userLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const doLogout = () => {
    // 1. Dispatcher l'action Redux
    dispatch(logoutUser());
    // 2. Rediriger l'utilisateur (Redirection client après la déconnexion)
    navigate('/');
    setIsOpen(false); // Fermer le menu
  };

  return (
    <div className="relative">
      {/* Bouton du nom de l'utilisateur */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-full font-medium transition duration-150 ease-in-out flex items-center"
      >
        {userLabel}
        <svg
          className={`h-4 w-4 ml-1.5 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 py-1 border border-gray-200">
          <button
            onClick={doLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white flex items-center"
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
};

// =========================================================
// COMPOSANT PRINCIPAL : NAVBAR
// =========================================================
export const Navbar: React.FC<NavbarProps> = ({ menu }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const authenticated = useSelector(
    isAuthentificated as (state: RootState) => boolean,
  );
  const userLabel = useSelector(
    whoIsAuthentificated as (state: RootState) => string,
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const processedMenu = useMemo(() => {
    // 1. Filtrer ou ajuster le lien de Mon Compte si l'utilisateur est connecté
    const menuWithoutAccount = menu.filter((item) => item.url !== '/moncompte');

    // 2. Si non authentifié, ajouter le lien 'Mon Compte' (qui redirige vers login)
    if (!authenticated) {
      // Supposons que votre menu initial contient le lien de connexion/compte
      const monCompteItem = menu.find((item) => item.url === '/moncompte');
      return monCompteItem
        ? [...menuWithoutAccount, monCompteItem]
        : menuWithoutAccount;
    }

    // Si authentifié, le lien est remplacé par le composant UserMenu (géré plus tard)
    return menuWithoutAccount;
  }, [menu, authenticated]);

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

          {/* Desktop Menu & User/Login */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <ul className="flex space-x-4">
              {processedMenu.map((e) => (
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

            {/* 🌟 NOUVEAU: Affichage du UserMenu ou du bouton de connexion */}
            <div className="pl-4">
              {authenticated ? (
                <UserMenu userLabel={userLabel} />
              ) : (
                // Assurez-vous d'avoir un lien de connexion si 'Mon Compte' a été filtré
                <Link
                  to="/moncompte" // Assurez-vous que c'est la route vers la connexion
                  className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-150 ease-in-out font-bold"
                >
                  Se connecter
                </Link>
              )}
            </div>

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
