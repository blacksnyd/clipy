import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import logo from '../assets/logo.png';

const Header = ({ onOpenModal, onSearchChange, onOpenRegister }) => {
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
          {/* <Link to="/login">
            <button className="btn btn-primary">Login</button>
          </Link> */}
        </div>

        <div className="w-full md:max-w-xl">
          <SearchBar onSearchChange={onSearchChange} />
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-sky btn-sky-md" onClick={onOpenRegister} type="button">
            S&apos;inscrire
          </button>
          <button
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            onClick={onOpenModal}
            type="button"
          >
            Importer
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
