"use client";

import { useEffect, useState } from "react";
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
import { Heart, LayoutDashboard, Users, Phone } from "lucide-react";

const navItems = [
  {
    title: "Kontrol Paneli",
    href: "/",
    icon: LayoutDashboard,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoritePosts, setFavoritePosts] = useState<
    { postId: number; title: string; userId: number; username: string }[]
  >([]);
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
  const [contacts, setContacts] = useState<
    { id: number; name: string; email: string; phone: string }[]
  >([]);

  useEffect(() => {
    const readFavorites = () => {
      try {
        const raw = localStorage.getItem("favorites");
        const parsed = raw ? (JSON.parse(raw) as number[]) : [];
        setFavorites(parsed);
      } catch {
        setFavorites([]);
      }
    };

    readFavorites();

    const handleStorage = () => {
      readFavorites();
    };

    window.addEventListener("storage", handleStorage as any);
    return () => window.removeEventListener("storage", handleStorage as any);
  }, []);

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

  return (
    <Sidebar className="border-border transition-all duration-300 ease-in-out group-data-[variant=sidebar]:bg-transparent">
      <SidebarHeader className="border-b border-border bg-card/80 backdrop-blur px-3 py-4 transition-colors duration-200">
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

      <SidebarContent className="bg-transparent">
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
                    {users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => router.push(`/post/${user.id}`)}
                        className="w-full rounded-xl px-3 py-1.5 text-left text-xs text-foreground transition-all duration-150 hover:bg-accent hover:scale-[1.02]"
                      >
                        {user.username}
                      </button>
                    ))}
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

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Heart className="h-3 w-3 text-pink-500" />
            <span>Favoriler</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {favoritePosts.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground transition-colors duration-200">
                Henüz favori eklenmedi.
              </div>
            ) : (
              <div className="space-y-2">
                <div className="max-h-56 space-y-2 overflow-y-auto scrollbar-hide">
                  {favoritePosts.map((fav) => (
                    <button
                      key={fav.postId}
                      onClick={() => router.push(`/post/${fav.userId}`)}
                      className="w-full rounded-2xl border border-pink-300 bg-pink-50 p-3 text-left text-xs text-pink-900 transition-all duration-200 hover:bg-pink-100 hover:scale-[1.02] dark:border-pink-400/40 dark:bg-pink-500/10 dark:text-pink-50 dark:hover:bg-pink-500/20"
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
                  ))}
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem("favorites");
                    setFavorites([]);
                  }}
                  className="w-full rounded-full border border-border px-3 py-1 text-center text-[11px] text-muted-foreground transition-all duration-200 hover:bg-accent hover:scale-[1.02]"
                >
                  Tüm favorileri temizle
                </button>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}