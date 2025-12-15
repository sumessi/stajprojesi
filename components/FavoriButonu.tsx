"use client";
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface FavoriButonuProps {
  id: number;
  className?: string;
}

export default function FavoriButonu({ id, className = "" }: FavoriButonuProps) {
  const [favorimi, setFavorimi] = useState(false);

  // Sayfa yüklendiğinde favori durumunu kontrol et
  useEffect(() => {
    const checkFavorite = () => {
      const favoriler = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorimi(favoriler.includes(id));
    };

    checkFavorite();

    const handleStorageChange = (e: Event) => {
      checkFavorite();
    };

    // Custom event listener ekle
    window.addEventListener('favoritesChanged', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('favoritesChanged', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [id]);

  const toggleFavori = (e: React.MouseEvent) => {
    e.stopPropagation(); // Kutucuğa tıklama olayının çalışmasını engelle
    
    const favoriler = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favoriler.includes(id)) {
      // Favorilerden çıkar
      const yeniFavoriler = favoriler.filter((favId: number) => favId !== id);
      localStorage.setItem('favorites', JSON.stringify(yeniFavoriler));
      setFavorimi(false);
    } else {
      // Favorilere ekle
      favoriler.push(id);
      localStorage.setItem('favorites', JSON.stringify(favoriler));
      setFavorimi(true);
    }

    // Custom event dispatch et
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  };

  return (
    <button
      onClick = {toggleFavori}
      className = {`absolute top-3 left-3 p-2 rounded-full bg-[#f8f5f1] dark:bg-zinc-800 shadow-md hover:shadow-lg transition-all z-10 ${className}`}
      aria-label = "Favorilere ekle"
    >
      <Heart
        className={`w-5 h-5 transition-colors ${
          favorimi
            ? 'fill-red-500 text-red-500'
            : 'text-gray-400 hover:text-red-400'
        }`}
      />
    </button>
  );
}
