import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import ButtonCreate from './ButtonCreate';
import logo from '../assets/logo.png';

const Header = ({ onOpenModal, onSearchChange }) => {
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

        <div className="w-full md:max-w-xl">
          <SearchBar onSearchChange={onSearchChange} />
        </div>

        <div className="flex items-center gap-3">
          <ButtonCreate onClick={onOpenModal} />
        </div>
      </div>
    </header>
  );
};

export default Header;
