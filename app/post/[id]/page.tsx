"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FavoriButonu from "@/components/FavoriButonu"; // Path'i projenize göre ayarlayın

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export default function UserPostsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const fetchPosts = async () => {
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`);
        const userRes = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        if (!userRes.ok) throw new Error("Kullanıcı bilgisi alınamadı");
        const userData = await userRes.json();
        setName(userData.name);
        if (!res.ok) throw new Error("Veri alınamadı");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br bg-black">
        Yükleniyor...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br bg-black">
        <p>Bir hata oluştu: {error}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 bg-white hover:bg-white px-4 py-2 rounded-lg"
        >
          Ana Sayfaya Dön
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#1e1e1e] p-8">
      <h1 className="text-2xl font-bold mb-6 text-[#f8f5f1]">Kullanıcı: {name}'in Gönderileri</h1>

      {posts.length === 0 ? (
        <p>Bu kullanıcıya ait gönderi bulunamadı.</p>
      ) : (
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative bg-[#262626] hover:bg-white/20 backdrop-blur-sm p-6 rounded-2xl shadow-lg transition-all"
            >
              {/* Favori Butonu - Sol Üst Köşe */}
              <FavoriButonu id={post.id} />
              
              {/* Post İçeriği */}
              <div className="mt-8">
                <div className="mb-1 flex items-center justify-between text-xs text-[#9e9e9e]">
                  <span>Post #{post.id}</span>
                </div>
                <h2 className="text-lg font-semibold mb-2 text-[#ededed]">
                  {post.title}
                </h2>
                <p className="text-sm text-[#b3b3b3]">{post.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
