import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-blue-100 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#002147] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
            C
          </div>
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