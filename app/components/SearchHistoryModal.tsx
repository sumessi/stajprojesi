"use client";
import React from "react";

interface SearchHistoryModalProps {
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  history: string[];
  removeHistoryItem: (item: string) => void;
  setSearchTerm: (term: string) => void;
  setActiveSearch: (term: string) => void;
}

export default function SearchHistoryModal({
  showHistory,
  setShowHistory,
  history,
  removeHistoryItem,
  setSearchTerm,
  setActiveSearch,
}: SearchHistoryModalProps) {
  if (!showHistory) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg w-96 max-h-[70vh] overflow-y-auto relative">
        <h2 className="text-xl font-semibold mb-3 text-center dark:text-white">Arama Geçmişi</h2>
        <button onClick={() => setShowHistory(false)} className="absolute top-2 right-3 text-zinc-600 dark:text-zinc-300">✕</button>
        {history.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">Henüz geçmiş yok</p>
        ) : (
          <ul className="space-y-2">
            {history.map((t, i) => (
              <li key={i} className="flex items-center justify-between px-3 py-2 rounded-md bg-[#c5d5e0]/70 dark:bg-zinc-700">
                <button onClick={() => { setSearchTerm(t); setActiveSearch(t); setShowHistory(false); }} className="flex-1 text-left text-zinc-900 dark:text-zinc-100">{t}</button>
                <button onClick={() => removeHistoryItem(t)} className="ml-3 text-zinc-600 hover:text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
