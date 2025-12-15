"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Phone, UserRound, Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import FavoriButonu from "@/components/FavoriButonu";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type UserResponse = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: { city: string };
  company: { name: string };
};

export default function UserProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const paramId = Array.isArray(id) ? id[0] : id;
  const userId = Number(paramId);

  const [user, setUser] = useState<UserResponse | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Favori durumunu kontrol et
  useEffect(() => {
    const checkFavorite = () => {
      try {
        const raw = localStorage.getItem("favoriteUsers");
        const favorites = raw ? JSON.parse(raw) : [];
        setIsFavorite(favorites.includes(userId));
      } catch {
        setIsFavorite(false);
      }
    };

    checkFavorite();

    const handleStorageChange = (e: Event) => {
      checkFavorite();
    };

    // Custom event listener ekle
    window.addEventListener("favoriteUsersChanged", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("favoriteUsersChanged", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [userId]);

  useEffect(() => {
    if (!paramId || Number.isNaN(userId)) {
      setError("Geçersiz kullanıcı");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, postsRes] = await Promise.all([
          fetch(`https://jsonplaceholder.typicode.com/users/${userId}`),
          fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`),
        ]);

        if (!userRes.ok) throw new Error("Kullanıcı bilgisi alınamadı");
        if (!postsRes.ok) throw new Error("Gönderiler alınamadı");

        const userData: UserResponse = await userRes.json();
        const postsData: Post[] = await postsRes.json();
        setUser(userData);
        setPosts(postsData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const roleOptions = ["Admin", "User", "Moderator"] as const;
  const statusOptions = ["Aktif", "Pasif", "Engelli"] as const;
  const profileMeta = useMemo(() => {
    const role = roleOptions[userId % roleOptions.length];
    const status = statusOptions[(userId + 1) % statusOptions.length];
    const lastLogin = new Date(Date.now() - (userId % 6) * 3600000).toLocaleString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
    const joinedAt = new Date(Date.now() - userId * 86400000).toLocaleDateString("tr-TR");
    return { role, status, lastLogin, joinedAt };
  }, [userId]);

  const activity = useMemo(
    () => [
      { title: "Profil güncellendi", time: "5 dk önce" },
      { title: "Yeni gönderi paylaşıldı", time: "1 saat önce" },
      { title: "Bildirimler kontrol edildi", time: "Dün" },
      { title: "Favoriye eklendi", time: "2 gün önce" },
      { title: "Profil görüntülendi", time: "3 gün önce" },
      { title: "Filtre kullanıldı", time: "4 gün önce" },
    ],
    []
  );

  const toggleFavoriteUser = () => {
    try {
      const raw = localStorage.getItem("favoriteUsers");
      const favorites = raw ? JSON.parse(raw) : [];
      
      if (favorites.includes(userId)) {
        // Favorilerden çıkar
        const newFavorites = favorites.filter((id: number) => id !== userId);
        localStorage.setItem("favoriteUsers", JSON.stringify(newFavorites));
        setIsFavorite(false);
        toast({ 
          title: "Favorilerden çıkarıldı", 
          description: user?.name 
        });
      } else {
        // Favorilere ekle
        favorites.push(userId);
        localStorage.setItem("favoriteUsers", JSON.stringify(favorites));
        setIsFavorite(true);
        toast({ 
          title: "Favorilere eklendi", 
          description: user?.name 
        });
      }
      
      // Custom event dispatch et
      window.dispatchEvent(new CustomEvent('favoriteUsersChanged'));
    } catch (error) {
      console.error("Favori işlemi başarısız:", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </div>
          <Card className="p-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-3 h-8 w-3/4" />
            <Skeleton className="mt-4 h-24 w-full" />
          </Card>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="min-h-screen px-4 py-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 text-center">
          <p className="text-lg text-muted-foreground">{error || "Kullanıcı bulunamadı"}</p>
          <Button onClick={() => router.push("/")}>Ana sayfaya dön</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-1">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Geri
          </Button>
          <span>/</span>
          <span>Kullanıcı #{userId}</span>
        </div>

        <Card className="border-border bg-card/80 shadow-lg">
          <CardHeader className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.username)}`}
                    alt={user.name}
                  />
                  <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Kullanıcı ID</p>
                  <h1 className="text-2xl font-semibold text-foreground">{user.name}</h1>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{profileMeta.role}</Badge>
                <Badge variant={profileMeta.status === "Aktif" ? "success" : profileMeta.status === "Pasif" ? "muted" : "destructive"}>
                  {profileMeta.status}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleFavoriteUser}
                  className="gap-2"
                >
                  <Heart className={`h-4 w-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFavorite ? 'Favorilerden Çıkar' : 'Favori'}
                </Button>
              </div>
            </div>
            <Separator />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-background/80">
                <CardHeader className="p-6">
                  <CardDescription>Son giriş</CardDescription>
                  <CardTitle>{profileMeta.lastLogin}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="bg-background/80">
                <CardHeader className="p-6">
                  <CardDescription>Toplam gönderi</CardDescription>
                  <CardTitle>{posts.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="bg-background/80">
                <CardHeader className="p-6">
                  <CardDescription>Kayıt tarihi</CardDescription>
                  <CardTitle>{profileMeta.joinedAt}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="bg-background/80">
                <CardHeader className="p-6">
                  <CardDescription>Şirket</CardDescription>
                  <CardTitle className="truncate">{user.company?.name}</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="posts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="posts">Gönderiler</TabsTrigger>
            <TabsTrigger value="activity">Aktivite</TabsTrigger>
            <TabsTrigger value="info">Bilgiler</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-3">
            {posts.length === 0 ? (
              <Card className="p-6 text-muted-foreground">Bu kullanıcı için gönderi bulunamadı.</Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {posts.map((post) => (
                  <Card key={post.id} className="relative border-border bg-card/80">
                    <FavoriButonu id={post.id} />
                    <CardHeader className="pb-2">
                      <CardDescription className="pl-8">#{post.id}</CardDescription>
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      <p>{post.body}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Aktivite Geçmişi</CardTitle>
                <CardDescription>Son işlemler</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activity.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2">
                    <div className="flex items-center gap-3">
                      <UserRound className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Profil bilgileri</CardTitle>
                <CardDescription>İletişim ve detaylar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${user.email}`}
                    className="text-primary hover:underline transition-colors"
                  >
                    {user.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`tel:${user.phone}`}
                    className="text-primary hover:underline transition-colors"
                  >
                    {user.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{user.address?.city}</span>
                </div>
                <Separator className="my-2" />
                <div className="text-muted-foreground">
                  Son giriş: {profileMeta.lastLogin} • Rol: {profileMeta.role} • Durum: {profileMeta.status}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
