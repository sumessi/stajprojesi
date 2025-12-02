"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";

import SearchSection from "@/components/SearchSection";
import { usePosts } from "@/hooks/usePosts";
import { useMatchedUsers } from "@/components/useMatchedUsers";
import LoadingScreen from "@/components/LoadingScreen";

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
  const { posts, loading, error } = usePosts();

  // --- Kullanıcı verileri (JSONPlaceholder /users) ---
  const [usersById, setUsersById] = useState<
    Record<number, { name: string; username: string; email: string }>
  >({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) return;
        const data: any[] = await res.json();
        const map: Record<number, { name: string; username: string; email: string }> = {};
        for (const u of data) {
          map[u.id] = {
            name: u.name,
            username: u.username,
            email: u.email,
          };
        }
        setUsersById(map);
      } catch {
        // sessizce geç
      }
    };

    fetchUsers();
  }, []);

  // --- State tanımlamaları ---
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [history, setHistory] = useLocalStorage<string[]>("searchHistory", []);
  const [searchField] = useLocalStorage<"title" | "id" | "body">("searchField", "title");
  const [sortBy] = useLocalStorage<"userId" | "id">("sortBy", "userId");

  // --- Performans optimizasyonu hook'u ---
  const { useDebounce } = usePerformanceOptimization();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // --- Geçmiş ve favori işlemleri ---
  const clearHistory = () => setHistory([]);
  const handleClearSearch = () => {
    setSearchTerm("");
    setActiveSearch("");
  };
  const handleHistorySelect = (term: string) => {
    setSearchTerm(term);
    setActiveSearch(term);
  };
  const handleNavigateToUser = (userId: number) => router.push(`/post/${userId}`);

  const uniqueUserIds = useMemo(
    () => Array.from(new Set(posts.map((post) => post.userId))).sort((a, b) => a - b),
    [posts]
  );

  const postsPerUser = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const post of posts) {
      counts[post.userId] = (counts[post.userId] || 0) + 1;
    }
    return counts;
  }, [posts]);

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
    <main className="min-h-screen w-full overflow-x-hidden pb-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <SearchSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleClearSearch={handleClearSearch}
          error={error || undefined}
          userIds={uniqueUserIds}
          matchedUsers={matchedUsers}
          postsPerUser={postsPerUser}
          onNavigateToUser={handleNavigateToUser}
          history={history}
          onHistorySelect={handleHistorySelect}
          onClearHistory={clearHistory}
          usersById={usersById}
        />
      </div>
    </main>
  );
}
