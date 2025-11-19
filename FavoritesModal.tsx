"use client";
import React, { useEffect, useState } from "react";

interface FavoritesModalProps {
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
  favorites: number[];
  removeFavorite: (id: number) => void;
}

export default function FavoritesModal({
  showFavorites,
  setShowFavorites,
  favorites,
  removeFavorite,
}: FavoritesModalProps) {
  const [posts, setPosts] = useState<{[key: number]: {title: string; userId: number}}>({});

  // Favori post bilgilerini getir
  useEffect(() => {
    if (favorites.length === 0) return;

    const fetchPostDetails = async () => {
      const postData: {[key: number]: {title: string; userId: number}} = {};
      
      for (const postId of favorites) {
        try {
          const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
          if (res.ok) {
            const data = await res.json();
            postData[postId] = { title: data.title, userId: data.userId };
          }
        } catch (err) {
          console.error(`Post ${postId} yüklenemedi:`, err);
        }
      }
      
      setPosts(postData);
    };

    fetchPostDetails();
  }, [favorites]);

  if (!showFavorites) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg w-[500px] max-h-[80vh] overflow-y-auto relative">
        <h2 className="text-2xl font-semibold mb-6 text-center dark:text-white">Favoriler</h2>
        <button 
          onClick={() => setShowFavorites(false)} 
          className="absolute top-4 right-4 text-zinc-600 dark:text-zinc-300 text-xl hover:text-zinc-900 dark:hover:text-white"
        >
          ✕
        </button>
        
        {favorites.length === 0 ? (
          <p className="text-center text-lg text-zinc-500">Henüz favori yok</p>
        ) : (
          <ul className="space-y-3">
            {favorites.map((postId) => (
              <li 
                key={postId} 
                className="flex flex-col px-4 py-3 rounded-lg bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-pink-600 dark:text-pink-400">
                      Post #{postId}
                    </p>
                    {posts[postId] && (
                      <>
                        <p className="text-base text-zinc-900 dark:text-zinc-100 mt-1">
                          {posts[postId].title}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          Kullanıcı #{posts[postId].userId}
                        </p>
                      </>
                    )}
                  </div>
                  <button 
                    onClick={() => removeFavorite(postId)}
                    className="ml-4 text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300 p-2 rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
                    title="Favorilerden kaldır"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
            Toplam: <span className="font-semibold">{favorites.length}</span> favori
          </p>
        </div>
      </div>
    </div>
  );
}