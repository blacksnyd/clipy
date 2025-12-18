import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import { isAuthenticated, logout } from '../services/auth.service';
import logo from '../assets/logo.png';

const Header = ({ onOpenModal, onSearchChange, onOpenRegister, onOpenLogin}) => {
  const authenticated = isAuthenticated();
  const location = useLocation();
  const isDetailPage = location.pathname.startsWith('/video/');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  const handleLogout = () => {
    logout();
    // Recharger la page pour mettre à jour l'interface
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Link to="/">
            <img
              src={logo}
              alt="Clipy"
              className="h-30 w-30 cursor-pointer rounded-xl object-cover ring-1 ring-slate-200 transition hover:ring-slate-300"
            />
          </Link>
        </div>

        {!(isDetailPage && isMobile) && (
          <div className="w-full md:max-w-xl">
            <SearchBar onSearchChange={onSearchChange} />
          </div>
        )}

        <div className="flex items-center gap-3">
          {!authenticated && (
            <>
              <button className="btn-sky btn-sky-md" onClick={onOpenRegister} type="button">
                S&apos;inscrire
              </button>
              <button className="btn-sky btn-sky-md" onClick={onOpenLogin} type="button">
                Se connecter
              </button>
            </>
          )}
          
          {authenticated && (
            <>
              <button
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                onClick={onOpenModal}
                type="button"
              >
                Importer
              </button>
              <button
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                onClick={handleLogout}
                type="button"
              >
                Déconnexion
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
