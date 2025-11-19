"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FavoriButonu from "@/app/components/FavoriButonu"; // Path'i projenize göre ayarlayın

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

  useEffect(() => {
    if (!id) return;

    const fetchPosts = async () => {
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`);
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
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-purple-700 via-blue-600 to-indigo-800">
        Yükleniyor...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-purple-700 via-blue-600 to-indigo-800">
        <p>Bir hata oluştu: {error}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg"
        >
          Ana Sayfaya Dön
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-blue-600 to-indigo-800 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Kullanıcı #{id} Gönderileri</h1>

      {posts.length === 0 ? (
        <p>Bu kullanıcıya ait gönderi bulunamadı.</p>
      ) : (
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative bg-white/10 hover:bg-white/20 backdrop-blur-sm p-6 rounded-2xl shadow-lg transition-all"
            >
              {/* Favori Butonu - Sol Üst Köşe */}
              <FavoriButonu id={post.id} />
              
              {/* Post İçeriği */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                <p className="text-sm text-white/80">{post.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
