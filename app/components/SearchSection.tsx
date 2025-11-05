"use client";
import React from "react";

interface SearchSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleClearSearch: () => void;
  searchField: string;
  error?: string;
}

export default function SearchSection({
  searchTerm,
  setSearchTerm,
  handleClearSearch,
  searchField,
  error,
}: SearchSectionProps) {
  return (
    <section className="w-full flex items-center pt-50 py-10 justify-center">
      <div className="w-full max-w-2xl flex flex-col items-center justify-center p-6">
        <h1 className="mb-8 text-center text-5xl sm:text-7xl font-black tracking-wide text-white/70 drop-shadow-lg" style={{fontFamily: 'Arial Black, sans-serif', fontWeight: '800'}}>Kullanıcılar</h1>
        <div className="w-full max-w-lg">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 opacity-60" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              placeholder={`"${searchField}" içinde ara...`} 
              className="w-full pl-12 pr-4 py-4 border-2 border-white/30 rounded-4xl text-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            />
            {searchTerm && (
              <button 
                onClick={handleClearSearch} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            )}
          </div>
          {error && <div className="text-sm text-red-200 mt-3 text-center">{error}</div>}
        </div>
      </div>
    </section>
  );
}
