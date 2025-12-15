"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  ChevronDown,
  History,
  Mail,
  MoreHorizontal,
  Search as SearchIcon,
  Sparkles,
  Star,
  Users as UsersIcon,
  X,
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "@/components/ui/toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export type DashboardUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: "Admin" | "User" | "Moderator";
  status: "Aktif" | "Pasif" | "Engelli";
  postsCount: number;
  lastLogin: string;
  joinedAt: string;
  avatarUrl?: string | null;
};

interface SearchSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleClearSearch: () => void;
  error?: string;
  users: DashboardUser[];
  onNavigateToUser: (userId: number) => void;
  history: string[];
  onHistorySelect: (term: string) => void;
  onHistoryRemove: (term: string) => void;
  onClearHistory: () => void;
  favorites: number[];
  onToggleFavorite: (userId: number) => void;
  loading: boolean;
  onToast: (title: string, description?: string) => void;
  currentUserRole: DashboardUser["role"];
  onRoleChangeSelf: (role: DashboardUser["role"]) => void;
  auditLogs: { message: string; ts: string }[];
  onLog: (message: string) => void;
  onLogRemove: (index: number) => void;
  roleFilter: string;
  statusFilter: string;
  minPosts: string;
  sortOrder: "az" | "za";
  onRoleChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onMinPostsChange: (val: string) => void;
  onSortChange: (val: "az" | "za") => void;
  onClearFilters: () => void;
}

const statusColors: Record<DashboardUser["status"], string> = {
  Aktif: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-200",
  Pasif: "bg-amber-500/15 text-amber-800 dark:text-amber-200",
  Engelli: "bg-rose-500/15 text-rose-800 dark:text-rose-200",
};

function highlight(text: string, term: string) {
  if (!term) return text;
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="bg-yellow-200 px-0.5 text-foreground dark:bg-yellow-500/40">{text.slice(idx, idx + term.length)}</span>
      {text.slice(idx + term.length)}
    </>
  );
}

export default function SearchSection({
  searchTerm,
  setSearchTerm,
  handleClearSearch,
  error,
  users,
  onNavigateToUser,
  history,
  onHistorySelect,
  onHistoryRemove,
  onClearHistory,
  favorites,
  onToggleFavorite,
  loading,
  onToast,
  currentUserRole,
  onRoleChangeSelf,
  auditLogs,
  onLog,
  onLogRemove,
  roleFilter,
  statusFilter,
  minPosts,
  sortOrder,
  onRoleChange,
  onStatusChange,
  onMinPostsChange,
  onSortChange,
  onClearFilters,
}: SearchSectionProps) {
  const [favoriteQuery, setFavoriteQuery] = useState("");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [statusOverrides, setStatusOverrides] = useState<Record<number, DashboardUser["status"]>>({});
  const [openMenuUserId, setOpenMenuUserId] = useState<number | null>(null);

  const hasSearch = Boolean(searchTerm.trim());

  const mergedUsers = useMemo(
    () =>
      users.map((u) => ({
        ...u,
        status: statusOverrides[u.id] ?? u.status,
      })),
    [users, statusOverrides]
  );

  const filteredUsers = useMemo(() => {
    let result = [...mergedUsers];
    if (hasSearch) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.username.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      );
    }
    if (roleFilter !== "all") result = result.filter((u) => u.role === roleFilter);
    if (statusFilter !== "all") result = result.filter((u) => u.status === statusFilter);
    if (minPosts !== "all") {
      const threshold = Number(minPosts);
      result = result.filter((u) => u.postsCount >= threshold);
    }
    if (showOnlyFavorites) {
      result = result.filter((u) => favorites.includes(u.id));
    }
    result.sort((a, b) =>
      sortOrder === "az" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    return result;
  }, [mergedUsers, hasSearch, searchTerm, roleFilter, statusFilter, minPosts, sortOrder, showOnlyFavorites, favorites]);

  const favoriteUsers = useMemo(
    () =>
      mergedUsers.filter((u) => favorites.includes(u.id) && u.name.toLowerCase().includes(favoriteQuery.toLowerCase())),
    [favorites, mergedUsers, favoriteQuery]
  );

  const stats = useMemo(() => {
    const total = mergedUsers.length;
    const active = mergedUsers.filter((u) => u.status === "Aktif").length;
    const today = mergedUsers.filter((u) => new Date(u.joinedAt).toDateString() === new Date().toDateString()).length;
    const totalPosts = mergedUsers.reduce((acc, u) => acc + u.postsCount, 0);
    return [
      { label: "Toplam kullanıcı", value: total },
      { label: "Aktif kullanıcı", value: active },
      { label: "Bugün eklenen", value: today },
      { label: "Toplam gönderi", value: totalPosts },
    ];
  }, [mergedUsers]);

  const renderUserCard = (user: DashboardUser) => {
    const currentStatus = statusOverrides[user.id] ?? user.status;
    const canFavorite = currentUserRole !== "User";
    const canManage = currentUserRole === "Admin";

    return (
      <div
        key={user.id}
        className="group relative rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-ring hover:shadow-lg overflow-visible"
        onContextMenu={(e) => {
          e.preventDefault();
          setOpenMenuUserId(user.id);
        }}
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">#{user.id}</p>
              <Badge variant="secondary">{user.role}</Badge>
              <Badge className={cn("border-none", statusColors[currentStatus])}>{currentStatus}</Badge>
            </div>
            <p className="text-lg font-semibold leading-tight text-foreground">
              {highlight(user.name, searchTerm)}
            </p>
            <p className="text-sm text-muted-foreground">
              @{highlight(user.username, searchTerm)} · {highlight(user.email, searchTerm)}
            </p>
          </div>
          <div className="absolute right-4 top-4 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <DropdownMenu
              open={openMenuUserId === user.id}
              onOpenChange={(open) => setOpenMenuUserId(open ? user.id : null)}
            >
              <DropdownMenuTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost"
                  className="h-9 w-9 pointer-events-auto"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenMenuUserId(user.id);
                  }}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 z-[9999]">
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onNavigateToUser(user.id);
                    onToast("Kullanıcıya gidiliyor", `${user.name} profiline yönlendiriliyorsun`);
                    onLog("Profil görüntülendi");
                  }}
                >
                  <UsersIcon className="mr-2 h-4 w-4" /> Kullanıcıya git
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigator.clipboard.writeText(user.email);
                    onToast("E-posta kopyalandı", user.email);
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" /> E-postayı kopyala
                </DropdownMenuItem>
                {canFavorite && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onToggleFavorite(user.id);
                      onToast(
                        favorites.includes(user.id) ? "Favoriden çıkarıldı" : "Favorilere eklendi",
                        user.name
                      );
                      onLog("Favori aksiyonu");
                    }}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    {favorites.includes(user.id) ? "Favoriden çıkar" : "Favoriye ekle"}
                  </DropdownMenuItem>
                )}
                {canManage && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setStatusOverrides((prev) => ({
                        ...prev,
                        [user.id]: currentStatus === "Engelli" ? "Aktif" : "Engelli",
                      }));
                      onToast(
                        currentStatus === "Engelli" ? "Kullanıcı aktifleştirildi" : "Kullanıcı engellendi",
                        user.name
                      );
                      onLog("Rol bazlı durum değişikliği");
                    }}
                  >
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    {currentStatus === "Engelli" ? "Aktif et" : "Engelle"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="muted">Gönderi: {user.postsCount}</Badge>
          <BadgeCheck className="h-4 w-4 text-primary" />
          <span>Son giriş: {user.lastLogin}</span>
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-8">
      <Card className="border-border bg-card/80 shadow-xl backdrop-blur">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/15 p-3">
                <UsersIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">Kullanıcı ID Merkezi</p>
                
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              Dinamik filtreler & hızlı aksiyonlar
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[2fr,1fr]">
            <div className="relative">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name, username veya email ara..."
                className="h-12 rounded-2xl border-input pl-10 pr-12 text-base"
              />
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => {
                    handleClearSearch();
                    onToast("Arama temizlendi");
                  }}
                >
                  ✕
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 md:justify-center">
              <Select value={roleFilter} onValueChange={onRoleChange}>
                <SelectTrigger className="w-[120px] rounded-xl">
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Roller</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>

              <Select value={currentUserRole} onValueChange={(v: DashboardUser["role"]) => onRoleChangeSelf(v)}>
                <SelectTrigger className="w-[120px] rounded-xl">
                  <SelectValue placeholder="Benim rolüm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Ben: Admin</SelectItem>
                  <SelectItem value="Moderator">Ben: Moderator</SelectItem>
                  <SelectItem value="User">Ben: User</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="w-[140px] rounded-xl">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Pasif">Pasif</SelectItem>
                  <SelectItem value="Engelli">Engelli</SelectItem>
                </SelectContent>
              </Select>

              <Select value={minPosts} onValueChange={onMinPostsChange}>
                <SelectTrigger className="w-[140px] rounded-xl">
                  <SelectValue placeholder="Gönderi filtresi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Gönderi: hepsi</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                  <SelectItem value="10">10+</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={(val: "az" | "za") => onSortChange(val)}>
                <SelectTrigger className="w-[70px] rounded-xl">
                  <SelectValue placeholder="Sıralama" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="az">A-Z</SelectItem>
                  <SelectItem value="za">Z-A</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 rounded-xl border border-border px-3">
                <Toggle
                  className="border border-border bg-red-500 dark:bg-red-700 data-[state=checked]:bg-red-600 dark:data-[state=checked]:bg-red-600"
                  checked={showOnlyFavorites}
                  onCheckedChange={(checked) => {
                    setShowOnlyFavorites(checked);
                    onToast(checked ? "Sadece favoriler" : "Tüm kullanıcılar");
                  }}
                  aria-label="Sadece favoriler"
                />
                <span className="text-sm text-muted-foreground">Sadece favoriler</span>
              </div>

              <Button variant="ghost" onClick={() => {
                onClearFilters();
                setShowOnlyFavorites(false);
                onToast("Filtreler temizlendi");
                onLog("Filtre temizlendi");
              }}>
                Filtreyi sıfırla
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="border-dashed bg-background/80">
              <CardHeader>
                <CardDescription>{s.label}</CardDescription>
                <CardTitle className="text-2xl">{s.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-100">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-muted-foreground">
                Kullanıcılar
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {hasSearch ? "Filtrelenen sonuçlar" : "Tüm kayıtlar"}
              </p>
            </div>
            <Badge variant="muted">{filteredUsers.length} kullanıcı</Badge>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2" style={{ isolation: 'auto' }}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <Card key={idx} className="p-5">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                  <Skeleton className="mt-4 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-3/5" />
                </Card>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground">
              Bu filtreye uygun kullanıcı bulunamadı.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2" style={{ isolation: 'auto' }}>
              {filteredUsers.map((user) => renderUserCard(user))}
            </div>
          )}
        </div>

        <div className="space-y-4"></div>
      </div>
    </section>
  );
}