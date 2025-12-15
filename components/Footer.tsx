export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/80 backdrop-blur-sm px-6 py-8 text-center">
      <div className="w-full">
        <p className="mb-4 text-lg font-semibold text-foreground">⚡︎ Sümeyye Ceylan</p>

        <div className="flex flex-col items-center justify-center gap-3 text-sm sm:flex-row sm:gap-6">

          {/* Email */}
          <a
            href="mailto:sumeyyeceylan@example.com"
            className="flex items-center gap-2 text-foreground hover:underline"
          >
            <span className="text-muted-foreground">📧</span>
            <span>sumeyyeceylan@example.com</span>
          </a>

          {/* Telephone */}
          <a
            href="tel:+905551234567"
            className="flex items-center gap-2 text-foreground hover:underline"
          >
            <span className="text-muted-foreground">📱</span>
            <span>+90 555 123 45 67</span>
          </a>

          {/* Website */}
          <a
            href="https://www.sumeyyeceylan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-foreground hover:underline"
          >
            <span className="text-muted-foreground">🌐</span>
            <span>www.sumeyyeceylan.com</span>
          </a>

        </div>

        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Veri Görselleştirme Paneli — Tüm Hakları Saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
