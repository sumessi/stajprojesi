"use client";

import { useEffect, useMemo, useRef, useState, useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";

import SearchSection from "@/components/SearchSection";
import { usePosts } from "@/hooks/usePosts";
import { useToast } from "@/components/ui/use-toast";
import type { DashboardUser } from "@/components/SearchSection";
import { getUsers, type ServerUser } from "./actions/users";

// Ana Sayfa Bileşeni
export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // --- Post Hook ---
  const { posts, loading, error } = usePosts();

  // --- Kullanıcı verileri (JSONPlaceholder /users) ---
  const [users, setUsers] = useState<ServerUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // --- State tanımlamaları ---
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [minPosts, setMinPosts] = useState("all");
  const [sortOrder, setSortOrder] = useState<"az" | "za">("az");
  const [currentUserRole, setCurrentUserRole] = useState<DashboardUser["role"]>("Admin");
  const [auditLogs, setAuditLogs] = useState<{ message: string; ts: string }[]>([]);

  // --- Performans optimizasyonu hook'u ---
  const { useDebounce } = usePerformanceOptimization();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const initializedFromUrl = useRef(false);
  const isInitialMount = useRef(true);

  // Favorileri yükle
  useEffect(() => {
    try {
      const raw = localStorage.getItem("favoriteUsers");
      const parsed = raw ? JSON.parse(raw) : [];
      setFavorites(parsed);
    } catch {
      setFavorites([]);
    }
  }, []);

  // --- Server action ile kullanıcıları çek ---
  useEffect(() => {
    startTransition(async () => {
      try {
        setUsersLoading(true);
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        toast({ title: "Kullanıcılar alınamadı", description: String(err) });
      } finally {
        setUsersLoading(false);
      }
    });
  }, [toast]);

  // --- URL'den filtreleri oku (ilk yüklemede) ---
  useEffect(() => {
    if (initializedFromUrl.current) return;
    
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const sort = searchParams.get("sort");
    const min = searchParams.get("minPosts");
    const search = searchParams.get("q");

    if (role) setRoleFilter(role);
    if (status) setStatusFilter(status);
    if (sort === "az" || sort === "za") setSortOrder(sort);
    if (min) setMinPosts(min);
    if (search) setSearchTerm(search);
    
    initializedFromUrl.current = true;
  }, [searchParams]);

  // --- Filtreleri URL'e yaz ---
  useEffect(() => {
    // İlk mount'ta URL'i güncelleme (sonsuz döngü önleme)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams();
    
    // Sadece default olmayan değerleri URL'e ekle
    if (roleFilter !== "all") params.set("role", roleFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (minPosts !== "all") params.set("minPosts", minPosts);
    if (sortOrder !== "az") params.set("sort", sortOrder);
    if (debouncedSearchTerm.trim()) params.set("q", debouncedSearchTerm.trim());

    const qs = params.toString();
    const newUrl = qs ? `/?${qs}` : "/";
    
    // Mevcut URL ile aynıysa güncelleme yapma
    const currentUrl = window.location.pathname + window.location.search;
    if (currentUrl !== newUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [roleFilter, statusFilter, minPosts, sortOrder, debouncedSearchTerm, router]);

  // --- Geçmiş işlemleri - SADECE localStorage ---
  const clearHistory = useCallback(() => {
    localStorage.removeItem("searchHistory");
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const handleHistorySelect = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleNavigateToUser = useCallback((userId: number) => {
    const path = `/users/${userId}`;
    console.log("Navigate to user slug", { path, userId });
    try {
      router.push(path);
      setTimeout(() => {
        if (typeof window !== "undefined" && window.location.pathname !== path) {
          window.location.assign(path);
        }
      }, 80);
    } catch (err) {
      if (typeof window !== "undefined") {
        window.location.assign(path);
      }
    }
  }, [router]);
  
  const handleFavoriteToggle = useCallback((userId: number) => {
    setFavorites((prev) => {
      const exists = prev.includes(userId);
      const next = exists ? prev.filter((id) => id !== userId) : [...prev, userId];
      
      // localStorage'a kaydet
      localStorage.setItem("favoriteUsers", JSON.stringify(next));
      
      return next;
    });
  }, []);

  // Geçmişten tek öğe silme - SADECE localStorage
  const handleHistoryRemove = useCallback((term: string) => {
    try {
      const raw = localStorage.getItem("searchHistory");
      const history = raw ? JSON.parse(raw) : [];
      const newHistory = history.filter((t: string) => t !== term);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    } catch {}
  }, []);

  const postsPerUser = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const post of posts) {
      counts[post.userId] = (counts[post.userId] || 0) + 1;
    }
    return counts;
  }, [posts]);

  // --- Debounce edilmiş arama - Sadece localStorage'a kaydet ---
  useEffect(() => {
    const term = debouncedSearchTerm.trim();
    if (!term) return;
    
    try {
      const raw = localStorage.getItem("searchHistory");
      const history = raw ? JSON.parse(raw) : [];
      
      // Eğer zaten varsa ekleme
      if (history.includes(term)) return;
      
      // Yeni geçmişi oluştur (max 10 öğe)
      const newHistory = [term, ...history].slice(0, 10);
      
      // localStorage'a kaydet
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    } catch {}
  }, [debouncedSearchTerm]);

  // --- Audit log ekle ---
  useEffect(() => {
    if (isInitialMount.current) return;
    const ts = new Date().toLocaleTimeString("tr-TR");
    setAuditLogs((prev) => [{ message: "Filtre kullanıldı", ts }, ...prev].slice(0, 20));
  }, [roleFilter, statusFilter, minPosts, sortOrder, debouncedSearchTerm]);

  const roleOptions: DashboardUser["role"][] = ["Admin", "User", "Moderator"];
  const statusOptions: DashboardUser["status"][] = ["Aktif", "Pasif", "Engelli"];

  const dashboardUsers: DashboardUser[] = useMemo(() => {
    return users.map((u) => {
      const role = roleOptions[u.id % roleOptions.length];
      const status = statusOptions[(u.id + 1) % statusOptions.length];
      const joined = new Date(Date.now() - u.id * 86400000).toISOString();
      const lastLogin = new Date(Date.now() - (u.id % 5) * 3600000).toLocaleString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
      });
      return {
        id: u.id,
        name: u.name,
        username: u.username,
        email: u.email,
        role,
        status,
        postsCount: postsPerUser[u.id] || 0,
        lastLogin,
        joinedAt: joined,
        avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(u.username)}`,
      };
    });
  }, [users, postsPerUser]);

  // History'yi localStorage'dan oku - SearchSection için
  const [history, setHistory] = useState<string[]>([]);
  
  useEffect(() => {
    // İlk yüklemede history'yi oku
    try {
      const raw = localStorage.getItem("searchHistory");
      const parsed = raw ? JSON.parse(raw) : [];
      setHistory(parsed);
    } catch {
      setHistory([]);
    }

    // Polling ile güncelle
    const interval = setInterval(() => {
      try {
        const raw = localStorage.getItem("searchHistory");
        const parsed = raw ? JSON.parse(raw) : [];
        setHistory(parsed);
      } catch {
        setHistory([]);
      }
    }, 1000); // Her saniye kontrol et

    return () => clearInterval(interval);
  }, []);

  // --- Ana render ---
  return (
    <main className="min-h-screen w-full overflow-x-hidden pb-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <SearchSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleClearSearch={handleClearSearch}
          error={error || undefined}
          onNavigateToUser={handleNavigateToUser}
          history={history}
          onHistorySelect={handleHistorySelect}
          onHistoryRemove={handleHistoryRemove}
          onClearHistory={clearHistory}
          users={dashboardUsers}
          favorites={favorites}
          onToggleFavorite={handleFavoriteToggle}
          loading={loading || usersLoading}
          onToast={(title, description) =>
            toast({
              title,
              description,
            })
          }
          currentUserRole={currentUserRole}
          onRoleChangeSelf={setCurrentUserRole}
          auditLogs={auditLogs}
          onLog={(message) =>
            setAuditLogs((prev) => [{ message, ts: new Date().toLocaleTimeString("tr-TR") }, ...prev].slice(0, 20))
          }
          onLogRemove={(index) => setAuditLogs((prev) => prev.filter((_, i) => i !== index))}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          minPosts={minPosts}
          sortOrder={sortOrder}
          onRoleChange={setRoleFilter}
          onStatusChange={setStatusFilter}
          onMinPostsChange={setMinPosts}
          onSortChange={setSortOrder}
          onClearFilters={() => {
            setRoleFilter("all");
            setStatusFilter("all");
            setMinPosts("all");
            setSortOrder("az");
            setSearchTerm("");
          }}
        />
      </div>
    </main>
  );
}
