"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { usePerformanceOptimization } from "@/app/components/hooks/usePerformanceOptimization";

import UserIdList from "@/app/components/UserIdList";
import SearchHistoryModal from "@/app/components/SearchHistoryModal";
import FavoritesModal from "@/app/components/FavoritesModal";
import SearchSection from "@/app/components/SearchSection";
import ResultsSection from "@/app/components/ResultsSection";
import Footer from "@/app/components/Footer";
import { usePosts } from "@/app/components/hooks/usePosts";
import { useMatchedUsers } from "@/app/components/useMatchedUsers";
import LoadingScreen from "@/app/components/LoadingScreen";

// Lazy load edilen bileşen
const UserCard = dynamic(() => import("@/app/components/UserCard"), {
  loading: () => (
    <div className="rounded-2xl border-2 border-zinc-300/60 bg-zinc-100 dark:bg-zinc-800 shadow-lg p-8 min-h-[180px] flex items-center justify-center animate-pulse">
      <div className="text-zinc-400">Yükleniyor...</div>
    </div>
  ),
  ssr: false,
});

// LocalStorage hook'u
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

// Ana Sayfa Bileşeni
export default function Page() {
  const router = useRouter();

  // --- Post Hook ---
  const { posts, loading, error, reloadPosts } = usePosts();

  // --- State tanımlamaları ---
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showUserIds, setShowUserIds] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [history, setHistory] = useLocalStorage<string[]>("searchHistory", []);
  const [favorites, setFavorites] = useLocalStorage<number[]>("favorites", []);
  const [searchField] = useLocalStorage<"title" | "id" | "body">("searchField", "title");
  const [sortBy] = useLocalStorage<"userId" | "id">("sortBy", "userId");

  // --- Performans optimizasyonu hook'u ---
  const { useDebounce } = usePerformanceOptimization();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // --- Geçmiş ve favori işlemleri ---
  const clearHistory = () => setHistory([]);
  const removeHistoryItem = (i: string) => setHistory(p => p.filter(x => x !== i));
  const removeFavorite = (postId: number) => setFavorites(p => p.filter(id => id !== postId));
  const handleClearSearch = () => {
    setSearchTerm("");
    setActiveSearch("");
  };

  // --- Debounce edilmiş arama ---
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      setActiveSearch(debouncedSearchTerm.trim());
      setHistory(p => [...new Set([debouncedSearchTerm.trim(), ...p])].slice(0, 10));
    } else {
      setActiveSearch("");
    }
  }, [debouncedSearchTerm]);

  // --- Arama sonucu hesaplama ---
  const matchedUsers = useMatchedUsers(posts, activeSearch, searchField, sortBy);

  // --- Yüklenme ekranı ---
  if (loading) return <LoadingScreen />;

  // --- Ana render ---
  return (
    <main className="relative min-h-screen animated-gradient transition-colors">
      
      {/* Hamburger Menü */}
      
      {/* Sidebar */}
      
      {/* Modallar */}
      <UserIdList posts={posts} showUserIds={showUserIds} setShowUserIds={setShowUserIds} />
      <SearchHistoryModal
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        history={history}
        removeHistoryItem={removeHistoryItem}
        setSearchTerm={setSearchTerm}
        setActiveSearch={setSearchTerm}
      />
      <FavoritesModal
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        favorites={favorites}
        removeFavorite={removeFavorite}
      />

      {/* Arama Alanı */}
      <SearchSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleClearSearch={handleClearSearch}
        searchField={searchField}
        error={error || undefined}
      />

      {/* Arama Sonuçları */}
      <ResultsSection activeSearch={activeSearch} matchedUsers={matchedUsers} />

      {/* Footer */}
      <Footer />
    </main>
  );
}
