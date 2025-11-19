"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { usePerformanceOptimization } from "@/app/components/hooks/usePerformanceOptimization";

import SearchSection from "@/app/components/SearchSection";
import ResultsSection from "@/app/components/ResultsSection";
import Footer from "@/app/components/Footer";
import { usePosts } from "@/app/components/hooks/usePosts";
import { useMatchedUsers } from "@/app/components/useMatchedUsers";
import LoadingScreen from "@/app/components/LoadingScreen";
import MenuAccordion from "@/app/components/MenuAccordion";

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
  const handleHistorySelect = (term: string) => {
    setSearchTerm(term);
    setActiveSearch(term);
  };
  const handleNavigateToUser = (userId: number) => router.push(`/post/${userId}`);

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
    <main className="relative animated-gradient transition-colors min-h-screen w-full overflow-x-hidden">
      <div className="w-full min-h-screen flex">
        {/* Sol Menü - Fixed */}
        <aside className="fixed left-0 top-0 h-screen w-[320px] z-40">
          <MenuAccordion
            posts={posts}
            history={history}
            favorites={favorites}
            onReload={reloadPosts}
            onClearHistory={clearHistory}
            onSelectHistory={handleHistorySelect}
            onNavigateToUser={handleNavigateToUser}
            removeHistoryItem={removeHistoryItem}
            removeFavorite={removeFavorite}
          />
        </aside>

        {/* Ana İçerik - Sol taraftan itilmiş */}
        <section className="flex-1 min-h-screen flex flex-col justify-center ml-[320px] w-full max-w-[calc(100vw-320px)]">
          <SearchSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleClearSearch={handleClearSearch}
            searchField={searchField}
            error={error || undefined}
          />

          <ResultsSection activeSearch={activeSearch} matchedUsers={matchedUsers} />
          <Footer />
        </section>
      </div>
    </main>
  );
}
