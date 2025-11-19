"use client";
import React from "react";
import { useRouter } from "next/navigation";

// ✅ Tipi buraya ekle
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface UserIdListProps {
  posts: Post[];
  showUserIds: boolean;
  setShowUserIds: (show: boolean) => void;
}

export default function UserIdList({ posts, showUserIds, setShowUserIds }: UserIdListProps) {
  const router = useRouter();

  if (!showUserIds) return null;

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white/20 backdrop-blur-sm shadow-xl z-30 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Kullanıcı ID'leri</h2>
          <button
            onClick={() => setShowUserIds(false)}
            className="text-white/80 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-2">
          {Array.from(new Set(posts.map(p => p.userId)))
            .sort((a, b) => a - b)
            .map(uid => (
              <button
                key={uid}
                onClick={() => router.push(`/post/${uid}`)}
                className="w-full text-left px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white hover:text-white transition-all duration-200"
              >
                <div className="font-semibold">Kullanıcı #{uid}</div>
                <div className="text-sm text-white/70">
                  {posts.filter(p => p.userId === uid).length} gönderi
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
