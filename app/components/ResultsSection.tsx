"use client";
import { useRouter } from "next/navigation";

interface ResultsSectionProps {
  activeSearch: string;
  matchedUsers: [number, number[]][];
}

export default function ResultsSection({ activeSearch, matchedUsers }: ResultsSectionProps) {
  const router = useRouter();

  if (!activeSearch) return null;

  return (
    <section className="relative pt-1 px-20 py-50">
      {matchedUsers.length === 0 ? (
        <div className="text-center text-white/80 text-xl">
          <p>Sonuç bulunamadı.</p>
        </div>
      ) : (
        <div className="max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {matchedUsers.map(([uid, ids]) => (
            <button
              key={uid}
              onClick={() => router.push(`/post/${uid}`)}  // ✅ Yönlendirme burada
              className="bg-white/10 border border-white/20 rounded-4xl p-6 text-white hover:bg-white/20 transition shadow-md"
            >
              <p className="text-lg font-semibold mb-2">Kullanıcı ID: {uid}</p>
              <p className="text-sm opacity-80">Gönderi Sayısı: {ids.length}</p>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
