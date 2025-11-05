"use client";

import { useMemo } from "react";
import { Post } from "@/app/components/hooks/usePosts";

export function useMatchedUsers(
  posts: Post[],
  activeSearch: string,
  searchField: "title" | "id" | "body",
  sortBy: "userId" | "id"
) {
  return useMemo(() => {
    const results = new Map<number, number[]>(),
      term = activeSearch.toLowerCase();

    if (!term) return [];

    for (const p of posts) {
      const match =
        searchField === "title"
          ? p.title.toLowerCase().includes(term)
          : searchField === "body"
          ? p.body.toLowerCase().includes(term)
          : String(p.id).includes(term);

      if (match) {
        if (!results.has(p.userId)) results.set(p.userId, []);
        results.get(p.userId)!.push(p.id);
      }
    }

    let arr = Array.from(results.entries());
    return sortBy === "userId"
      ? arr.sort(([a], [b]) => a - b)
      : arr.sort(([a, idsA], [b, idsB]) => Math.min(...idsA) - Math.min(...idsB));
  }, [posts, activeSearch, searchField, sortBy]);
}
