// Footer.tsx - Düzeltilmiş
export default function Footer() {
  return (
    <footer className="bg-white/0 text-center text-white/80 py-5 mt-14 border-t border-white/20">
      <div className="max-w-4xl mx-auto px-4">
        <p className="mb-4 text-lg font-semibold">⚡︎ Sümeyye Ceylan</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-sm">
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
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} Veri Görselleştirme Paneli — Tüm Hakları Saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}