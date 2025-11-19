// MenuAccordion.tsx - ShadCN olmadan
"use client";

import { useMemo, useState } from "react";
import { Post } from "@/app/components/hooks/usePosts";

interface MenuAccordionProps {
  posts: Post[];
  history: string[];
  favorites: number[];
  onReload: () => void;
  onClearHistory: () => void;
  onSelectHistory: (term: string) => void;
  onNavigateToUser: (userId: number) => void;
  removeHistoryItem: (term: string) => void;
  removeFavorite: (postId: number) => void;
}

// Basit Accordion Item Componenti
function AccordionItem({ 
  title, 
  children, 
  defaultOpen = false 
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-white/10 rounded-2xl px-4 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3 text-base flex items-center justify-between text-left hover:text-white/80 transition"
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-3">
          {children}
        </div>
      )}
    </div>
  );
}

export default function MenuAccordion({
  posts,
  history,
  favorites,
  onReload,
  onClearHistory,
  onSelectHistory,
  onNavigateToUser,
  removeHistoryItem,
  removeFavorite,
}: MenuAccordionProps) {
  const uniqueUserIds = useMemo(
    () => Array.from(new Set(posts.map(post => post.userId))).sort((a, b) => a - b),
    [posts]
  );

  const favoriteDetails = useMemo(
    () =>
      favorites.map(postId => {
        const post = posts.find(p => p.id === postId);
        return { postId, userId: post?.userId };
      }),
    [favorites, posts]
  );

  return (
    <div className="h-full w-full flex flex-col bg-white/10 backdrop-blur-md border-r border-white/10 p-4 text-white shadow-xl overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 text-white/90">Menü</h2>

      <div className="space-y-2">
        {/* Verileri Temizle */}
        <AccordionItem title="Verileri Temizle" defaultOpen={true}>
          <div className="flex flex-col gap-3">
            <button
              onClick={onReload}
              className="rounded-2xl bg-emerald-500 py-2 font-semibold text-sm shadow hover:bg-emerald-400 transition"
            >
              Verileri Yenile
            </button>
            <button
              onClick={onClearHistory}
              className="rounded-xl bg-rose-500 py-2 font-semibold text-sm shadow hover:bg-rose-400 transition"
            >
              Geçmişi Temizle
            </button>
          </div>
        </AccordionItem>

        {/* Geçmiş */}
        <AccordionItem title="Geçmiş">
          <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-xs text-white/60">Henüz arama geçmişi yok.</p>
            ) : (
              history.map(term => (
                <div
                  key={term}
                  className="flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2"
                >
                  <button
                    onClick={() => onSelectHistory(term)}
                    className="flex-1 text-left text-sm font-medium hover:text-white/70"
                  >
                    {term}
                  </button>
                  <button
                    onClick={() => removeHistoryItem(term)}
                    className="text-white/60 hover:text-white text-lg"
                    aria-label="Geçmişten kaldır"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </AccordionItem>

        {/* Favoriler */}
        <AccordionItem title="Favoriler">
          <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
            {favoriteDetails.length === 0 ? (
              <p className="text-xs text-white/60">Favoriye eklenmiş gönderi yok.</p>
            ) : (
              favoriteDetails.map(({ postId, userId }) => (
                <div
                  key={postId}
                  className="flex items-center gap-2 rounded-2xl bg-amber-500/10 px-3 py-2"
                >
                  <button
                    onClick={() => userId && onNavigateToUser(userId)}
                    className="flex-1 text-left text-sm font-semibold text-amber-200 hover:text-amber-100"
                    disabled={!userId}
                    title={
                      userId
                        ? `Kullanıcı #${userId} sayfasına git`
                        : "Bu gönderi için kullanıcı bulunamadı"
                    }
                  >
                    Gönderi #{postId}
                  </button>
                  <button
                    onClick={() => removeFavorite(postId)}
                    className="text-white/70 hover:text-white text-lg"
                    aria-label="Favoriden çıkar"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </AccordionItem>

        {/* Kullanıcı ID'leri */}
        <AccordionItem title="Kullanıcı ID'leri">
          <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
            {uniqueUserIds.map(uid => (
              <button
                key={uid}
                onClick={() => onNavigateToUser(uid)}
                className="rounded-2xl border border-white/20 px-3 py-2 text-sm font-semibold hover:bg-white/10 transition"
              >
                #{uid}
              </button>
            ))}
          </div>
        </AccordionItem>
      </div>
    </div>
  );
}