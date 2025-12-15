"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Heart, LayoutDashboard, Users, Phone, X, FileText, User, History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/components/theme-selector";
import { useUndo } from "@/hooks/use-undo";

const navItems = [
  {
    title: "Kontrol Paneli",
    href: "/",
    icon: LayoutDashboard,
  },
];

type FavoriteType = "posts" | "users";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { executeWithUndo } = useUndo<number>(5000);

  const [favoriteType, setFavoriteType] = useState<FavoriteType>("posts");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoritePosts, setFavoritePosts] = useState<
    { postId: number; title: string; userId: number; username: string }[]
  >([]);
  const [favoriteUsers, setFavoriteUsers] = useState<number[]>([]);
  const [allUsers, setAllUsers] = useState<{ id: number; name: string; username: string }[]>([]);
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
  const [contacts, setContacts] = useState<
    { id: number; name: string; email: string; phone: string }[]
  >([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [userFilter, setUserFilter] = useState("");

  // LocalStorage'dan oku
  const loadFavorites = useCallback(() => {
    try {
      const raw = localStorage.getItem("favorites");
      const parsed = raw ? (JSON.parse(raw) as number[]) : [];
      setFavorites(parsed);
    } catch {
      setFavorites([]);
    }
  }, []);

  const loadFavoriteUsers = useCallback(() => {
    try {
      const raw = localStorage.getItem("favoriteUsers");
      const parsed = raw ? (JSON.parse(raw) as number[]) : [];
      setFavoriteUsers(parsed);
    } catch {
      setFavoriteUsers([]);
    }
  }, []);

  const loadSearchHistory = useCallback(() => {
    try {
      const raw = localStorage.getItem("searchHistory");
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      setSearchHistory(parsed);
    } catch {
      setSearchHistory([]);
    }
  }, []);

  // İlk yükleme
  useEffect(() => {
    loadFavorites();
    loadFavoriteUsers();
    loadSearchHistory();
  }, [loadFavorites, loadFavoriteUsers, loadSearchHistory]);

  // POLLING - Her 500ms'de bir localStorage'ı kontrol et
  useEffect(() => {
    const interval = setInterval(() => {
      loadFavorites();
      loadFavoriteUsers();
      loadSearchHistory();
    }, 500);

    return () => clearInterval(interval);
  }, [loadFavorites, loadFavoriteUsers, loadSearchHistory]);

  // Post detaylarını çek
  useEffect(() => {
    if (!favorites.length) {
      setFavoritePosts([]);
      return;
    }

    const fetchDetails = async () => {
      const list: { postId: number; title: string; userId: number }[] = [];

      for (const postId of favorites) {
        try {
          const res = await fetch(
            `https://jsonplaceholder.typicode.com/posts/${postId}`
          );
          if (!res.ok) continue;
          const data = await res.json();
          list.push({
            postId,
            title: data.title,
            userId: data.userId,
          });
        } catch {
          // sessizce geç
        }
      }

      const users = await fetch("https://jsonplaceholder.typicode.com/users");
      const usersData = await users.json();
      const usersMap = usersData.reduce((acc: Record<number, string>, user: { id: number; username: string }) => {
        acc[user.id] = user.username;
        return acc;
      }, {});

      const favoritePosts = list.map((post) => ({
        ...post,
        username: usersMap[post.userId],
      }));

      setFavoritePosts(favoritePosts);
    };

    fetchDetails();
  }, [favorites]);

  // Tüm kullanıcıları çek
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) return;
        const data: { id: number; username: string }[] = await res.json();
        setUsers(data);
      } catch {
        // sessizce geç
      }
    };

    fetchUsers();
  }, []);

  // Tüm kullanıcıları çek (favori kullanıcılar için detaylı bilgi)
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) return;
        const data: { id: number; name: string; username: string }[] = await res.json();
        setAllUsers(data);
      } catch {
        // sessizce geç
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) return;
        const data: { id: number; name: string; email: string; phone: string }[] = await res.json();
        setContacts(data);
      } catch {
        // sessizce geç
      }
    };

    fetchContacts();
  }, []);

  const favoriteUsersData = allUsers.filter((user) => favoriteUsers.includes(user.id));

  const removeFavoritePost = (postId: number) => {
    const oldFavorites = [...favorites];
    
    executeWithUndo(
      postId,
      () => {
        const newFavorites = favorites.filter((id) => id !== postId);
        setFavorites(newFavorites);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
      },
      () => {
        setFavorites(oldFavorites);
        localStorage.setItem("favorites", JSON.stringify(oldFavorites));
      },
      "Post favorilerden çıkarıldı"
    );
  };

  const removeFavoriteUser = (userId: number) => {
    const oldFavorites = [...favoriteUsers];
    
    executeWithUndo(
      userId,
      () => {
        const newFavorites = favoriteUsers.filter((id) => id !== userId);
        setFavoriteUsers(newFavorites);
        localStorage.setItem("favoriteUsers", JSON.stringify(newFavorites));
      },
      () => {
        setFavoriteUsers(oldFavorites);
        localStorage.setItem("favoriteUsers", JSON.stringify(oldFavorites));
      },
      "Kullanıcı favorilerden çıkarıldı"
    );
  };

  const removeHistoryItem = (term: string) => {
    const oldHistory = [...searchHistory];
    
    executeWithUndo(
      0,
      () => {
        const newHistory = searchHistory.filter((item) => item !== term);
        setSearchHistory(newHistory);
        localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      },
      () => {
        setSearchHistory(oldHistory);
        localStorage.setItem("searchHistory", JSON.stringify(oldHistory));
      },
      "Geçmişten silindi"
    );
  };

  const clearAllFavorites = () => {
    if (favoriteType === "posts") {
      const oldFavorites = [...favorites];
      
      executeWithUndo(
        0,
        () => {
          localStorage.removeItem("favorites");
          setFavorites([]);
        },
        () => {
          setFavorites(oldFavorites);
          localStorage.setItem("favorites", JSON.stringify(oldFavorites));
        },
        "Tüm favoriler temizlendi"
      );
    } else {
      const oldFavorites = [...favoriteUsers];
      
      executeWithUndo(
        0,
        () => {
          localStorage.removeItem("favoriteUsers");
          setFavoriteUsers([]);
        },
        () => {
          setFavoriteUsers(oldFavorites);
          localStorage.setItem("favoriteUsers", JSON.stringify(oldFavorites));
        },
        "Tüm favoriler temizlendi"
      );
    }
  };

  const clearSearchHistory = () => {
    const oldHistory = [...searchHistory];
    
    executeWithUndo(
      0,
      () => {
        localStorage.removeItem("searchHistory");
        setSearchHistory([]);
      },
      () => {
        setSearchHistory(oldHistory);
        localStorage.setItem("searchHistory", JSON.stringify(oldHistory));
      },
      "Geçmiş temizlendi"
    );
  };

  return (
    <Sidebar className="border-border transition-colors duration-300 ease-in-out">
      <SidebarHeader className="border-b border-border px-3 py-4 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-sm font-black tracking-tight text-accent-foreground">
            SP
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Staj Projesi</p>
            <p className="text-[11px] text-muted-foreground">ID arama konsolu</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="text-[hsl(var(--foreground))]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Navigasyon
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    onClick={() => router.push(item.href)}
                    className="items-center gap-3 rounded-2xl bg-accent text-foreground transition-all duration-200 hover:bg-accent/80 hover:scale-[1.02] data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <Accordion
              type="single"
              collapsible
              className="mt-3 w-full"
            >
              <AccordionItem value="users">
                <AccordionTrigger className="rounded-2xl bg-accent px-3 py-2 text-left text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent/80 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Kullanıcılar</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="transition-all duration-300">
                  <div className="mt-2 flex max-h-56 flex-col gap-1 overflow-y-auto scrollbar-hide">
                    <div className="px-2 pt-1 pb-2">
                      <input
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                        placeholder="Kullanıcı ara..."
                        className="w-full rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                    {users
                      .filter((u) => u.username.toLowerCase().includes(userFilter.toLowerCase()))
                      .map((user) => (
                      <button
                        key={user.id}
                        onClick={() => router.push(`/users/${user.id}`)}
                        className="w-full rounded-xl px-3 py-1.5 text-left text-xs text-foreground transition-all duration-150 hover:bg-accent hover:scale-[1.02]"
                      >
                        {user.username}
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* TEMA SELECTİON BUTONU */}
              <div className="mt-3">
                <ThemeSelector />
              </div>

              {/* FAVORİLER ACCORDION */}
              <AccordionItem value="favorites" className="mt-3">
                <AccordionTrigger className="rounded-2xl bg-accent px-3 py-2 text-left text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent/80 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-500" />
                    <span>Favoriler</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="transition-all duration-300">
                  <div className="mt-2">
                    <Accordion type="single" collapsible className="w-full space-y-2">
                      {/* POSTLAR ACCORDION */}
                      <AccordionItem value="posts" className="border-none">
                        <AccordionTrigger className="rounded-xl bg-card px-3 py-2 text-left text-xs font-medium text-foreground transition-all duration-200 hover:bg-accent hover:no-underline">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>Postlar</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-1">
                          <div className="mt-2 space-y-2">
                            {favoritePosts.length === 0 ? (
                              <div className="rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                                Henüz favori post eklenmedi.
                              </div>
                            ) : (
                              <>
                                <div className="max-h-56 space-y-2 overflow-y-auto scrollbar-hide">
                                  {favoritePosts.map((fav) => (
                                    <div
                                      key={fav.postId}
                                      className="flex items-center justify-between gap-2 rounded-xl border border-pink-300 bg-pink-50 px-3 py-2 text-left text-xs text-pink-900 transition-all duration-200 hover:bg-pink-100 hover:scale-[1.02] dark:border-pink-400/40 dark:bg-pink-500/10 dark:text-pink-50 dark:hover:bg-pink-500/20"
                                    >
                                      <button
                                        onClick={() => router.push(`/users/${fav.userId}`)}
                                        className="flex-1 text-left"
                                      >
                                        <div className="flex items-center justify-between gap-2">
                                          <span className="font-semibold">
                                            Post #{fav.postId}
                                          </span>
                                          <span className="rounded-full bg-pink-200 px-2 py-0.5 text-[10px] uppercase tracking-wide text-pink-900 dark:bg-pink-500/20 dark:text-pink-50">
                                            {fav.username}
                                          </span>
                                        </div>
                                      </button>
                                      <button
                                        onClick={() => removeFavoritePost(fav.postId)}
                                        className="rounded-full p-1 text-pink-700 transition hover:bg-pink-200/60 dark:text-pink-100 dark:hover:bg-pink-500/30"
                                        aria-label="Favoriden çıkar"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const oldFavorites = [...favorites];
                                    executeWithUndo(
                                      0,
                                      () => {
                                        localStorage.removeItem("favorites");
                                        setFavorites([]);
                                      },
                                      () => {
                                        setFavorites(oldFavorites);
                                        localStorage.setItem("favorites", JSON.stringify(oldFavorites));
                                      },
                                      "Tüm post favorileri temizlendi"
                                    );
                                  }}
                                  className="mt-2 w-full gap-2 text-xs text-muted-foreground hover:text-foreground"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Tüm postları temizle
                                </Button>
                              </>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* KULLANICILAR ACCORDION */}
                      <AccordionItem value="users" className="border-none">
                        <AccordionTrigger className="rounded-xl bg-card px-3 py-2 text-left text-xs font-medium text-foreground transition-all duration-200 hover:bg-accent hover:no-underline">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Kullanıcılar</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-1">
                          <div className="mt-2 space-y-2">
                            {favoriteUsersData.length === 0 ? (
                              <div className="rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                                Henüz favori kullanıcı eklenmedi.
                              </div>
                            ) : (
                              <>
                                <div className="max-h-56 space-y-2 overflow-y-auto scrollbar-hide">
                                  {favoriteUsersData.map((user) => (
                                    <div
                                      key={user.id}
                                      className="flex items-center justify-between gap-2 rounded-xl border border-blue-300 bg-blue-50 px-3 py-2 text-left text-xs text-blue-900 transition-all duration-200 hover:bg-blue-100 hover:scale-[1.02] dark:border-blue-400/40 dark:bg-blue-500/10 dark:text-blue-50 dark:hover:bg-blue-500/20"
                                    >
                                      <button
                                        onClick={() => router.push(`/users/${user.id}`)}
                                        className="flex-1 text-left"
                                      >
                                        <div className="flex flex-col gap-1">
                                          <span className="font-semibold">
                                            {user.name}
                                          </span>
                                          <span className="text-[10px] text-blue-700 dark:text-blue-200">
                                            @{user.username}
                                          </span>
                                        </div>
                                      </button>
                                      <button
                                        onClick={() => removeFavoriteUser(user.id)}
                                        className="rounded-full p-1 text-blue-700 transition hover:bg-blue-200/60 dark:text-blue-100 dark:hover:bg-blue-500/30"
                                        aria-label="Favoriden çıkar"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const oldFavorites = [...favoriteUsers];
                                    executeWithUndo(
                                      0,
                                      () => {
                                        localStorage.removeItem("favoriteUsers");
                                        setFavoriteUsers([]);
                                      },
                                      () => {
                                        setFavoriteUsers(oldFavorites);
                                        localStorage.setItem("favoriteUsers", JSON.stringify(oldFavorites));
                                      },
                                      "Tüm kullanıcı favorileri temizlendi"
                                    );
                                  }}
                                  className="mt-2 w-full gap-2 text-xs text-muted-foreground hover:text-foreground"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Tüm kullanıcıları temizle
                                </Button>
                              </>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="history" className="mt-3">
                <AccordionTrigger className="rounded-2xl bg-accent px-3 py-2 text-left text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent/80 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <span>Geçmiş Aramalar</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="transition-all duration-300">
                  <div className="mt-2 flex max-h-80 flex-col gap-2 overflow-y-auto scrollbar-hide">
                    {searchHistory.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-muted-foreground">
                        Henüz arama geçmişi yok.
                      </div>
                    ) : (
                      <>
                        {searchHistory.map((term, index) => (
                          <div
                            key={`${term}-${index}`}
                            className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground transition-all duration-200 hover:scale-[1.02]"
                          >
                            <button
                              onClick={() => {
                                router.push(`/?q=${encodeURIComponent(term)}`);
                              }}
                              className="flex-1 text-left"
                            >
                              <p className="font-medium">{term}</p>
                            </button>
                            <button
                              onClick={() => removeHistoryItem(term)}
                              className="rounded-full p-1 text-muted-foreground transition hover:bg-accent hover:text-foreground"
                              aria-label="Geçmişten sil"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearSearchHistory}
                          className="mt-2 w-full gap-2 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <Trash2 className="h-3 w-3" />
                          Geçmişi temizle
                        </Button>
                      </>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="contacts" className="mt-3">
                <AccordionTrigger className="rounded-2xl bg-accent px-3 py-2 text-left text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent/80 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>İletişim Bilgileri</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="transition-all duration-300">
                  <div className="mt-2 flex max-h-80 flex-col gap-2 overflow-y-auto scrollbar-hide">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="rounded-xl border border-border bg-card p-3 text-xs text-foreground transition-all duration-200 hover:scale-[1.02]"
                      >
                        <p className="mb-2 font-semibold text-foreground">{contact.name}</p>
                        <div className="space-y-1 text-[11px]">
                          <p className="text-muted-foreground">
                            <span className="font-medium">Email:</span>{" "}
                            <a 
                              href={`mailto:${contact.email}`}
                              className="text-primary hover:underline"
                            >
                              {contact.email}
                            </a>
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-medium">Telefon:</span>{" "}
                            <a 
                              href={`tel:${contact.phone}`}
                              className="text-primary hover:underline"
                            >
                              {contact.phone}
                            </a>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
