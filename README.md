# Staj Projesi Dashboard

## Proje amacı
- JSONPlaceholder verisiyle kullanıcı/post arama ve yönetim arayüzü
- Filtre ve arama state’lerini URL ile senkron çalışan dashboard (CV-ready)
- Rol bazlı aksiyon, favori ve audit log demonun gösterimi

## Kullanılan teknolojiler
- Next.js App Router, React 19
- TypeScript, TailwindCSS, shadcn/ui (Radix)
- Server Actions, `revalidateTag`, cmdk, lucide-react

## Özellikler
- URL senkron filtreler: `?role=&status=&minPosts=&sort=&q=`
- 300ms debounced arama, arama geçmişi
- Rol bazlı izinler (User/Moderator/Admin) ve hızlı aksiyonlar
- Favori ekleme/çıkarma + mini liste + sadece favoriler filtresi
- Skeleton & boş durumları, toast geri bildirimleri
- Audit/aktivite log (filtre, favori, profil görüntüleme)
- `/users/[id]` profil: tabs (Gönderiler, Aktivite, Bilgiler)

## Ekran görüntüleri
- Dashboard listesi
- Kullanıcı detay sayfası
- Filtre + audit log kartı

## Geliştirme
```bash
npm install
npm run dev
```

## Canlı demo
- (Varsa) Vercel linki buraya eklenebilir.
