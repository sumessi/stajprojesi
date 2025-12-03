"use client";

import { useMemo } from "react";
import { Post } from "@/hooks/usePosts";

export function useMatchedUsers(
  posts: Post[],
  activeSearch: string,
  searchField: "title" | "id" | "body",
  sortBy: "userId" | "id",
  usersById?: Record<number, { name: string; username: string; email: string }>
) {
  return useMemo(() => {
    const results = new Map<number, number[]>(),
      term = activeSearch.toLowerCase();

    if (!term) return [];

    // Her kullanıcı için post'ları grupla
    const userPostsMap = new Map<number, Post[]>();
    for (const p of posts) {
      if (!userPostsMap.has(p.userId)) userPostsMap.set(p.userId, []);
      userPostsMap.get(p.userId)!.push(p);
    }

    // Her kullanıcıyı kontrol et
    for (const [userId, userPosts] of userPostsMap.entries()) {
      let matchedPostIds: number[] = [];

      // SADECE kullanıcı adı veya username kontrolü
      if (usersById && usersById[userId]) {
        const user = usersById[userId];
        const nameMatch = user.name.toLowerCase().includes(term);
        const usernameMatch = user.username.toLowerCase().includes(term);

        if (nameMatch || usernameMatch) {
          // Kullanıcı adı eşleşirse TÜM postlarını ekle
          matchedPostIds = userPosts.map(p => p.id);
          results.set(userId, matchedPostIds);
        }
      }
      // Post içeriklerinde arama KALDIRILDI
    }

    let arr = Array.from(results.entries());
    return sortBy === "userId"
      ? arr.sort(([a], [b]) => a - b)
      : arr.sort(([a, idsA], [b, idsB]) => Math.min(...idsA) - Math.min(...idsB));
  }, [posts, activeSearch, searchField, sortBy, usersById]);
}
