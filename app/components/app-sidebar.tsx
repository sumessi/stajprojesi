"use client";

import { useMemo, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { RefreshCcw, Clock, Star, Users, Trash2, ChevronDown } from "lucide-react";
import { Post } from "@/app/components/hooks/usePosts";

interface AppSidebarProps {
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

export function AppSidebar({
  posts,
  history,
  favorites,
  onReload,
  onClearHistory,
  onSelectHistory,
  onNavigateToUser,
  removeHistoryItem,
  removeFavorite,
}: AppSidebarProps) {
  const [openSections, setOpenSections] = useState({
    history: false,
    favorites: false,
    users: false,
  });

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

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <Sidebar className="!bg-transparent border-r border-white/10">
      <SidebarHeader className="border-b border-white/10 p-4 bg-white/10 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white">Menü</h2>
      </SidebarHeader>

      <SidebarContent className="bg-white/10 backdrop-blur-md">
        {/* Verileri Temizle */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/90 text-sm font-semibold">
            Verileri Temizle
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={onReload}
                  className="text-white hover:bg-emerald-500/20 hover:text-emerald-200"
                >
                  <RefreshCcw className="w-4 h-4" />
                  <span>Verileri Yenile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={onClearHistory}
                  className="text-white hover:bg-rose-500/20 hover:text-rose-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Geçmişi Temizle</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Geçmiş */}
        <SidebarGroup>
          <SidebarGroupLabel 
            className="text-white/90 text-sm font-semibold cursor-pointer hover:text-white flex items-center justify-between"
            onClick={() => toggleSection('history')}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Geçmiş</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.history ? 'rotate-180' : ''}`} />
          </SidebarGroupLabel>
          {openSections.history && (
            <SidebarGroupContent>
              <SidebarMenu>
                {history.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-white/60">
                    Henüz arama geçmişi yok.
                  </div>
                ) : (
                  <SidebarMenuSub>
                    {history.map(term => (
                      <SidebarMenuSubItem key={term}>
                        <div className="flex items-center gap-2 w-full">
                          <SidebarMenuSubButton
                            onClick={() => onSelectHistory(term)}
                            className="text-white/80 hover:text-white flex-1"
                          >
                            <span className="truncate">{term}</span>
                          </SidebarMenuSubButton>
                          <button
                            onClick={() => removeHistoryItem(term)}
                            className="text-white/60 hover:text-red-400 px-2"
                          >
                            ✕
                          </button>
                        </div>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        {/* Favoriler */}
        <SidebarGroup>
          <SidebarGroupLabel 
            className="text-white/90 text-sm font-semibold cursor-pointer hover:text-white flex items-center justify-between"
            onClick={() => toggleSection('favorites')}
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>Favoriler</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.favorites ? 'rotate-180' : ''}`} />
          </SidebarGroupLabel>
          {openSections.favorites && (
            <SidebarGroupContent>
              <SidebarMenu>
                {favoriteDetails.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-white/60">
                    Favoriye eklenmiş gönderi yok.
                  </div>
                ) : (
                  <SidebarMenuSub>
                    {favoriteDetails.map(({ postId, userId }) => (
                      <SidebarMenuSubItem key={postId}>
                        <div className="flex items-center gap-2 w-full">
                          <SidebarMenuSubButton
                            onClick={() => userId && onNavigateToUser(userId)}
                            className={`flex-1 ${userId ? 'text-amber-200 hover:text-amber-100 cursor-pointer' : 'text-white/40 cursor-not-allowed'}`}
                            asChild={false}
                          >
                            <span className="truncate">Gönderi #{postId}</span>
                          </SidebarMenuSubButton>
                          <button
                            onClick={() => removeFavorite(postId)}
                            className="text-white/60 hover:text-red-400 px-2"
                          >
                            ✕
                          </button>
                        </div>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        {/* Kullanıcı ID'leri */}
        <SidebarGroup>
          <SidebarGroupLabel 
            className="text-white/90 text-sm font-semibold cursor-pointer hover:text-white flex items-center justify-between"
            onClick={() => toggleSection('users')}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Kullanıcı ID'leri</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.users ? 'rotate-180' : ''}`} />
          </SidebarGroupLabel>
          {openSections.users && (
            <SidebarGroupContent>
              <div className="grid grid-cols-2 gap-2 px-2 py-2">
                {uniqueUserIds.map(uid => (
                  <button
                    key={uid}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Clicking user:', uid);
                      onNavigateToUser(uid);
                    }}
                    type="button"
                    className="rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 transition cursor-pointer active:scale-95"
                  >
                    #{uid}
                  </button>
                ))}
              </div>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
