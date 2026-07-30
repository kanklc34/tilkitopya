# İlkokul Platformu — 1. Sınıf (Vite + React)

## Yerel geliştirme

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` açılır.

## Canlıya alma (ücretsiz)

Bu proje tamamen istemci tarafı (sunucu gerektirmez). En kolay seçenekler:

1. **Vercel**: `vercel.com` üzerinden GitHub reposunu bağla, otomatik deploy eder. Ücretsiz katman bu ölçek için fazlasıyla yeterli.
2. **Netlify**: Aynı mantık, `netlify.com`.
3. **Cloudflare Pages**: Aynı mantık, sınırsız bant genişliği ile ücretsiz.

Herhangi birinde: `npm run build` komutu `dist/` klasörünü üretir, o klasörü deploy edersin.

## Proje Yapısı

```
src/
  App.jsx              -> Ana menü + oyun yönlendirme (tek kayıt noktası)
  games/                -> Her oyun kendi dosyasında, bağımsız bileşen
  data/                 -> Soru bankaları (JSON) - tek veri katmanı kaynağı
```

## Yeni bir oyun eklemek

1. `src/games/` içine yeni `.jsx` dosyası ekle (mevcutlardan birini örnek al — hepsi aynı tasarım dilini paylaşıyor: CSS değişkenleri, Fredoka/Nunito fontları, tilki maskotu).
2. `src/App.jsx` içindeki `GAMES` dizisine bir satır ekle.

## Yeni sorular eklemek / güncellemek

`src/data/*.json` dosyalarını düzenle. `PratikModuMatematik.jsx` bu dosyayı doğrudan import ediyor —
kod değiştirmeden içerik güncellenir. Diğer oyunlar (Türkçe/İngilizce/Hayat Bilgisi) şu an kendi
içlerinde gömülü kelime listeleri kullanıyor; bunları da `src/data/*.json`'a bağlamak (matematik
Pratik Modu'ndaki gibi) sıradaki mimari iyileştirme.

## Bilinen sonraki adımlar

- Türkçe/İngilizce/Hayat Bilgisi oyunlarını da `src/data/*.json` dosyalarına bağlamak (tek veri katmanı).
- 2-4. sınıf içeriklerinin eklenmesi.
- Maskot için özgün görsel tasarım (şu an 🦊 emoji yer tutucu).
- Gerçek öğretmen/pedagog gözden geçirmesi (soru içerikleri kural tabanlı üretildi).
- Seviye haritası / ilerleme sistemi (ayrı bir tasarım kararı olarak planlandı).
