"use client";
import React from "react";

interface UserCardProps {
  uid: number;
  ids: number[];
}

export default function UserCard({ uid, ids }: UserCardProps) {
  return (
    <button className="rounded-2xl p-6 bg-white/5 dark:bg-zinc-800/40 text-white shadow">
      <header className="mb-3">
        <h3 className="text-xl font-semibold">Kullanıcı #{uid}</h3>
        <p className="text-sm text-white/70">{ids.length} gönderi</p>
      </header>

      <div className="text-sm">
        <p className="mb-2 font-medium">Gönderi ID'leri:</p>
        <div className="text-xs break-words">
          {ids.join(", ")}
        </div>
      </div>
    </button>
  );
}
