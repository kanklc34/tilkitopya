# Tilkitopya — İlkokul Platformu (1. Sınıf)

## Yerel geliştirme

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` açılır.

## Canlıya alma — GitHub Pages (bu repo için hazır)

Repo zaten yapılandırıldı: `vite.config.js` içindeki `base: '/tilkitopya/'` ve
`.github/workflows/deploy.yml` otomatik deploy için hazır. Tek yapman gereken:

1. Bu klasörü push et:
   ```bash
   git push -u origin main
   ```
2. GitHub'da repo sayfasına git → **Settings → Pages**
3. "Build and deployment" → **Source** kısmını **"GitHub Actions"** olarak seç (tek seferlik, manuel bir adım)
4. Push sonrası Actions sekmesinde deploy otomatik başlar (~1 dakika sürer)
5. Site şu adreste yayında olur: **https://kanklc34.github.io/tilkitopya/**

Bundan sonra `main` branch'ine her push'ta site otomatik güncellenir.

## Proje Yapısı

```
src/
  App.jsx              -> Ana menü + oyun yönlendirme (tek kayıt noktası)
  games/                -> Her oyun kendi dosyasında, bağımsız bileşen
  data/                 -> Soru bankaları (JSON) - tek veri katmanı kaynağı
.github/workflows/      -> Otomatik GitHub Pages dağıtımı
```

## Yeni bir oyun eklemek

1. `src/games/` içine yeni `.jsx` dosyası ekle (mevcutlardan birini örnek al — hepsi aynı tasarım dilini paylaşıyor: CSS değişkenleri, Fredoka/Nunito fontları, tilki maskotu, ses geri bildirimi, duraklatma kontrolü).
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
- Gerçek öğretmen/pedagog gözden geçirmesi (soru içerikleri kural tabanlı üretildi, henüz pedagojik doğrulamadan geçmedi).
- Erişilebilirlik denetimi (ekran okuyucu, klavye navigasyonu henüz ele alınmadı).
- Seviye haritası / ilerleme sistemi (ayrı bir tasarım kararı olarak planlandı).
