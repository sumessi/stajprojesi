"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { RefreshCcw, Clock, Star, Users } from "lucide-react";

type Props = {
  reloadPosts?: () => void;
  setShowHistory?: (v: boolean) => void;
  clearHistory?: () => void;
  setShowFavorites?: (v: boolean) => void;
  setShowUserIds?: (v: boolean) => void;
  showUserIds?: boolean;
};

export function AppSidebar({
  reloadPosts,
  setShowHistory,
  clearHistory,
  setShowFavorites,
  setShowUserIds,
  showUserIds,
}: Props) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-semibold text-gray-700 dark:text-gray-100">
            Menü
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={reloadPosts}>
                <RefreshCcw className="w-5 h-5 mr-2" /> Verileri Yenile
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setShowHistory?.(true)}>
                <Clock className="w-5 h-5 mr-2" /> Arama Geçmişi
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setShowFavorites?.(true)}>
                <Star className="w-5 h-5 mr-2 text-yellow-400" /> Favoriler
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setShowUserIds?.(!showUserIds)}
              >
                <Users className="w-5 h-5 mr-2" /> Kullanıcı ID’leri
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={clearHistory}>
                <Clock className="w-5 h-5 mr-2 text-red-500" /> Geçmişi Temizle
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
