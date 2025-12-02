"use client";

import { useMemo } from "react";
import { History, Search as SearchIcon, Users as UsersIcon, X } from "lucide-react";

interface SearchSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleClearSearch: () => void;
  error?: string;
  userIds: number[];
  matchedUsers: [number, number[]][];
  postsPerUser: Record<number, number>;
  onNavigateToUser: (userId: number) => void;
  history: string[];
  onHistorySelect: (term: string) => void;
  onClearHistory: () => void;
  usersById: Record<number, { name: string; username: string; email: string }>;
}

export default function SearchSection({
  searchTerm,
  setSearchTerm,
  handleClearSearch,
  error,
  userIds,
  matchedUsers,
  postsPerUser,
  onNavigateToUser,
  history,
  onHistorySelect,
  onClearHistory,
  usersById,
}: SearchSectionProps) {
  const trimmedSearch = searchTerm.trim();
  const hasSearch = Boolean(trimmedSearch);

  const matchMap = useMemo(() => {
    return new Map(matchedUsers);
  }, [matchedUsers]);

  const displayedIds = hasSearch
    ? matchedUsers.map(([uid]) => uid)
    : userIds;

  return (
    <section className="space-y-10 text-white">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-lg">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/15 p-3">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold">Kullanıcı ID Merkezi</p>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Kullanıcı ID, başlık veya içerikte ara..."
                  className="w-full rounded-full border border-white/15 bg-black/30 py-3 pl-12 pr-12 text-base text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-1 text-white/70 transition hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {history.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/70">
                <History className="h-4 w-4" />
                <span>Son aramalar</span>
              </div>
              {history.slice(0, 6).map((term) => (
                <button
                  key={term}
                  onClick={() => onHistorySelect(term)}
                  className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/80 transition hover:bg-white/10"
                >
                  {term}
                </button>
              ))}
              <button
                onClick={onClearHistory}
                className="text-sm text-white/60 underline-offset-2 hover:underline"
              >
                Temizle
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-white/60">Kullanıcılar</p>
            <p className="text-2xl font-semibold text-white">
              {hasSearch ? "Filtrelenen sonuçlar" : "Tüm kayıtlar"}
            </p>
          </div>
          <span className="rounded-full border border-white/15 px-4 py-1 text-sm text-white/80">
            {hasSearch ? displayedIds.length : userIds.length} kullanıcı
          </span>
        </div>

        {hasSearch && displayedIds.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
            Aramanızla eşleşen kullanıcı bulunamadı.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {displayedIds.map((uid) => {
              const matches = matchMap.get(uid);
              const user = usersById[uid];
              return (
                <button
                  key={uid}
                  onClick={() => onNavigateToUser(uid)}
                  className="rounded-2xl border border-white/15 bg-white/5 p-5 text-left transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/60">
                        {user ? user.username : `kullanici_${uid}`}
                      </p>
                      <p className="text-lg font-semibold">
                        {user ? user.name : `Kullanıcı #${uid}`}
                      </p>
                      {user && (
                        <p className="mt-1 text-xs text-white/70">{user.email}</p>
                      )}
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/70">
                      git
                    </span>
                  </div>
                  <div className="mt-4 text-sm text-white/70">
                    Toplam gönderi:{" "}
                    <span className="text-white">
                      {postsPerUser[uid] ?? 0}
                    </span>
                  </div>
                  {matches && (
                    <p className="mt-2 text-sm text-emerald-300">
                      Eşleşen gönderiler: {matches.length}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
