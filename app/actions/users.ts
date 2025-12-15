"use server";

import "server-only";

export type ServerUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
};

export async function getUsers(): Promise<ServerUser[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    next: { tags: ["users", "layout"] },
  });
  if (!res.ok) throw new Error("Kullanıcılar alınamadı");
  return res.json();
}

export async function revalidateUsers() {
  const { revalidateTag } = await import("next/cache");
  revalidateTag("users", "layout");
}

