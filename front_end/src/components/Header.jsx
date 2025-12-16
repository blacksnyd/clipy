import React from 'react';
import SearchBar from './SearchBar';
import ButtonCreate from './ButtonCreate';
import logo from '../assets/logo.png';

const Header = ({ onOpenModal }) => {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Clipy"
            className="h-30 w-30 rounded-xl object-cover ring-1 ring-slate-200"
          />
        </div>

        <div className="w-full md:max-w-xl">
          <SearchBar />
        </div>

        <div className="flex items-center gap-3">
          <ButtonCreate onClick={onOpenModal} />
        </div>
      </div>
    </header>
  );
};

export default Header;
