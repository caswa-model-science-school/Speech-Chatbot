import React from 'react';
import logoImg from '../src/assets/images/caswa_logo_1785940202046.jpg';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-blue-100 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src={logoImg} 
            alt="CASWA Model Science School Logo" 
            className="w-12 h-12 object-contain rounded-full shadow-md bg-white p-0.5 border border-blue-100"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="text-lg md:text-xl font-extrabold text-[#002147] tracking-tight leading-none uppercase">
              CASWA Model Science School
            </h1>
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mt-1">
              <p className="text-[10px] font-bold text-blue-400 tracking-[0.2em] uppercase">
                JACOBABAD, SINDH
              </p>
              <span className="hidden md:inline text-slate-300 text-[10px]">|</span>
              <p className="text-[10px] font-black text-rose-500 tracking-wider uppercase">
                Jacobabad's first AI-powered digital school
              </p>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex gap-8 text-sm font-semibold text-[#002147]/70">
          <a href="#" className="hover:text-[#002147] transition-colors">Curriculum</a>
          <a href="#" className="hover:text-[#002147] transition-colors">STEM</a>
          <a href="#" className="hover:text-[#002147] transition-colors">Admissions</a>
        </div>
      </div>
    </header>
  );
};