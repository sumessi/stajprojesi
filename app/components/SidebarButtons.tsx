"use client";
import React from "react";

interface SidebarButtonsProps {
  reloadPosts: () => void;
  setShowHistory: (show: boolean) => void;
  clearHistory: () => void;
  setShowFavorites: (show: boolean) => void;
  setShowUserIds: (show: boolean) => void;
  showUserIds: boolean;
  setShowSidebar: (show: boolean) => void;
}

export default function SidebarButtons({
  reloadPosts,
  setShowHistory,
  clearHistory,
  setShowFavorites,
  setShowUserIds,
  showUserIds,
  setShowSidebar,
}: SidebarButtonsProps) {
  return (
    <div className="fixed top-0 left-0 h-full w-24 bg-white/10 backdrop-blur-sm p-4 flex flex-col gap-4 items-center justify-start pt-21 z-40">
      <button 
        onClick={() => { reloadPosts(); setShowSidebar(false); }}
        className="h-12 w-12 bg-black/80 text-white rounded-full flex items-center justify-center hover:bg-gray-800/80 shadow"
        title="Yeniden Yükle"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="h-5 w-5"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><polyline points="21 3 21 9 15 9"/></svg>
      </button>

      <button 
        onClick={() => { setShowHistory(true); setShowSidebar(false); }}
        className="h-12 w-12 bg-[#1f3b57]/80 text-white rounded-full flex items-center justify-center hover:bg-[#2f5a85]/80 shadow"
        title="Geçmiş"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      </button>

      <button 
        onClick={() => { clearHistory(); setShowSidebar(false); }}
        className="h-12 w-12 bg-[#bd0000]/80 text-white rounded-full flex items-center justify-center hover:bg-[#ff0808]/80 shadow"
        title="Geçmişi Temizle"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M9 6V4h6v2m2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
      </button>

      <button 
        onClick={() => { setShowFavorites(true); setShowSidebar(false); }}
        className="h-12 w-12 bg-[#d5162c]/80 text-white rounded-full flex items-center justify-center hover:bg-[#ff0f3d]/80 shadow"
        title="Favoriler"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
      </button>

      <button 
        onClick={() => { setShowUserIds(!showUserIds); setShowSidebar(false); }}
        className="h-12 w-12 bg-[#595959]/80 text-white rounded-full flex items-center justify-center hover:bg-[#757575]/80 shadow"
        title="Kullanıcı ID'leri"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
      </button>
    </div>
  );
}
