// Footer.tsx - Düzeltilmiş
export default function Footer() {
  return (
    <footer className="w-full border-t border-white/20 bg-[#171717] px-6 py-8 text-center text-white/80">
      <div className="w-full">
        <p className="mb-4 text-lg font-semibold">⚡︎ Sümeyye Ceylan</p>
        <div className="flex flex-col items-center justify-center gap-3 text-sm sm:flex-row sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="text-white/60">📧</span>
            <span>sumeyyeceylan@example.com</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/60">📱</span>
            <span>+90 555 123 45 67</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/60">🌐</span>
            <span>www.sumeyyeceylan.com</span>
          </div>
        </div>
        <div className="mt-4 border-t border-white/20 pt-4">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} Veri Görselleştirme Paneli — Tüm Hakları Saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}