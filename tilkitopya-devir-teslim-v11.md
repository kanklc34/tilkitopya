# Tilkitopya — Proje Durumu (Devir Teslim Dokümanı v11)

> Yeni bir sohbette kaldığımız yerden devam etmek için bu dosyayı Claude'a ver.
> v10'un güncellenmiş halidir.

---

## 1. Proje Nedir

**Tilkitopya** — ilkokul çocukları için oyunla öğrenen bir eğitim platformu. Web tabanlı
(React), PWA. **1. sınıf müfredatı tam çalışır durumda.** **2. sınıf artık hem 5/5 ders
grubuyla HEM DE Matematik/Türkçe'de 1. sınıfla yakın oyun çeşitliliğiyle** çalışıyor (bkz.
Bölüm 3). Mimari **1-2-3-4. sınıfı** genel olarak destekliyor, **3-4. sınıf içeriği hâlâ
hiç başlanmadı** (bilinçli olarak bu oturuma dahil edilmedi, bkz. Bölüm 4).

## 2. Teknik Bilgiler (değişmedi)

- Vite + React, `https://github.com/kanklc34/tilkitopya.git`,
  `https://kanklc34.github.io/tilkitopya/`, GitHub Actions ile otomatik deploy.
- `npm install && npm run dev` | `npx oxlint src/` | `npm run build` — her değişiklikten
  sonra ikisi de 0 hatayla bitmeli.
- Test disiplini: Playwright ile gerçek tarayıcıda uçtan uca test + ekran görüntüsü
  doğrulaması bu oturumda da korundu (her yeni/değişen oyun için tutorial → soru →
  yanlış/doğru cevap → bitiş ekranı akışı, ayrıca ilgili sınıfta regresyon kontrolü).
- **Yeni bu oturumda:** `.github/workflows/deploy.yml` eklendi — teslim edilen zip'te
  bu dosya eksikti (muhtemelen önceki zip dışa aktarımı gizli `.github/` klasörünü
  atlamış), standart bir GitHub Pages Actions deploy workflow'u yazıldı. Repo
  ayarlarında **Settings → Pages → Source: GitHub Actions** seçili olduğundan emin ol.
- **Yeni bu oturumda:** Kod tabanı artık **git reposu** (`git init` bu oturumda yapıldı,
  daha önce yoktu) + `.gitignore` eklendi (`node_modules`, `dist` vb.).

## 3. Bu Oturumda Tamamlananlar

### A) 2. sınıf Matematik oyun çeşitliliği (roadmap madde 1) → TAMAMLANDI
`HizliYaris.jsx` ve `BoslukDoldurmaMatematik.jsx` artık `sinif` prop'u alıyor,
`CONFIG_BY_SINIF`/`ROUNDS_BY_SINIF` ile 2. sınıfın 100'e kadar soyut sayı aralığına
uyarlandı. 2. sınıfta somut nesne görselleştirmesi (nesne sayma) tamamen kapatıldı,
yerine "onlukları ve birlikleri ayrı ayrı düşün" yer-değeri ipucu geldi.
**MatematikEslestirme.jsx** için 2. sınıfta nesne-sayma yerine **onluk-birlik blok**
temsiline geçildi (yeşil çubuk=onluk, sarı kare=birlik) - `ROUNDS_BY_SINIF` ile aynı
desen. **Sonuç: 2. sınıf Matematik artık 4/4 oyun** (Pratik Modu, Hızlı Yarış,
Eşleştirme, Boşluk Doldur), 1. sınıfla birebir aynı çeşitlilikte.

### B) Türkçe/İngilizce/Hayat Bilgisi oyun çeşitliliği (roadmap madde 2) → TAMAMLANDI
Her üç derste de hem 1. hem 2. sınıfa **yeni bir oyun türü** eklendi (önceden bu
derslerde sadece 2'şer oyun türü vardı, Matematik'in 4'üne kıyasla eksikti):
- **Türkçe:** `TurkceKelimeYarisi.jsx` ("Kelime Yarışı") — Hızlı Yarış motoru, resim
  gösterilip doğru kelime 3 seçenek arasından seçiliyor. Zorluk ekseni "çeldirici
  benzerliği" (kelime uzunluğu yakınlığı).
- **İngilizce:** `IngilizceKelimeYarisi.jsx` ("Word Race") — aynı motor, ama zorluk
  ekseni `TEMA_ESLEME` sözlüğü üzerinden (aynı temadan çeldirici, ör. hayvanlar
  kategorisinde CAT/DOG/LION) - Türkçe'dekinden daha güçlü bir zorluk sinyali.
- **Hayat Bilgisi:** `HayatBilgisiKuralBilgisi.jsx` ("Kural Bilgisi" / "Doğru mu Yanlış
  mı?") — Pratik Modu'nun ustalık-bazlı seviye motoruyla, okul kuralları/güvenlik/
  sağlık/aile-toplum/çevre temalı Doğru-Yanlış soruları. **Yeni veri:** her iki JSON
  bankasına da `kural_bilgisi` soru tipi eklendi (1. sınıf +18, 2. sınıf +20 kayıt) -
  bu temalar `meta.kaynak_not` alanında zaten "henüz eklenmedi" diye işaretliydi.

**Sonuç: Matematik (4/4), Türkçe (3/3), İngilizce (3/3), Hayat Bilgisi (3/3) artık
paralel.** Genel Beceriler zaten 2/2 ile istisnaydı (1. sınıfta da öyleydi).

### C) Kelime Avı — yeni oyun türü (roadmap madde 3) → TAMAMLANDI
`KelimeAvi.jsx` — ızgarada kelime bulma oyunu, hem 1. hem 2. sınıfa eklendi (Türkçe
grubunun 4. oyunu). **Bilinçli tasarım kararı:** sürükleyerek seçim yerine **iki
dokunuşlu** mekanik (ilk harfe dokun, son harfe dokun) — mobil dokunmatikte sürükleme/
kaydırma çakışması riskini ortadan kaldırmak için. Kelimeler ızgaraya yatay/dikey
yerleştiriliyor (çakışan harfler paylaşılabilir), boş hücreler Türk alfabesiyle
dolduruluyor. Tur büyüdükçe ızgara büyüyor: 1. sınıf 6x6→7x7→8x8, 2. sınıf
7x7→8x8→10x10. Mevcut Türkçe kelime bankasını doğrudan kullanıyor, yeni veri gerekmedi.

### D) Cümle Tamamlama — kısmi kapsam (roadmap madde 4) → KISMEN TAMAMLANDI
Roadmap'teki madde 4 dört alt başlık içeriyordu: bitişik el yazısı, cümle tamamlama,
paragraf okuma, noktalama. **Bilinçli olarak sadece "cümle tamamlama" yapıldı:**
`TurkceCumleTamamlama.jsx`, sadece 2. sınıfta (1. sınıf müfredatı bu seviyede tam
cümle kurmaya henüz gelmiyor). Boşluklu cümle + 3 seçenekli çoktan seçmeli, Kural
Bilgisi'yle aynı ustalık-bazlı seviye motoru. **Yeni veri:** `turkce-2-sinif.json`'a
`cumle_tamamlama` soru tipi eklendi (+20 kayıt, `meta.kaynak_not` güncellendi).
**YAPILMADI ve nedeni:**
- **Bitişik el yazısı** — canvas/çizim-izleme (tracing) motoru gerektiriyor, mevcut
  "soru bankası + tıkla-seç" mimarisiyle tamamen farklı bir teknoloji. Ayrı bir
  tasarım/uygulama kararı gerekiyor.
- **Paragraf okuma** — kısa boşluklu cümlelerden çok daha büyük bir içerik yazım işi
  (gerçek paragraflar + anlama soruları), bu oturumun kapsamına alınmadı.
- **Noktalama** — henüz ele alınmadı, muhtemelen Kural Bilgisi'ne benzer bir
  çoktan-seçmeli motorla yapılabilir (ör. "Bu cümlenin sonuna hangisi gelmeli: . ? !"),
  ama içerik yazımı gerekiyor.

### E) Bundle boyutu / code-splitting (roadmap madde 6) → TAMAMLANDI
`App.jsx`'teki tüm oyun importları statik `import`'tan `React.lazy(() => import(...))`'a
çevrildi, `ActiveComponent` render'ı `<Suspense>` ile sarıldı. **Sonuç: ana bundle
743kB'tan 238kB'a (gzip 72kB) düştü**, "500kB chunk" build uyarısı tamamen kayboldu.
Her oyun artık kendi küçük parçasında (6-20kB), sadece açıldığında yükleniyor.
Playwright ile 5 farklı dersten oyun sırayla açılıp lazy-load'ın sorunsuz çalıştığı
doğrulandı.

### F) Dokunma alanı kontrolü (roadmap madde 7) → TAMAMLANDI
`FarkBulma.jsx` kontrol edildi — hedefler zaten tam ızgara hücreleri (en zor turda bile
70px+), sorun yok, değişiklik yapılmadı. `GizliNesneBulma.jsx`'te Boyama Kitabı'ndaki
ile aynı kök neden bulundu: emoji `font-size:24px` + `padding:6px` ≈ 36px dokunma alanı
(44px önerisinin altında). **Çözüm:** padding 6px→10px (≈44px'e çıktı). Boyama
Kitabı'ndaki 12px'in tamamı uygulanmadı çünkü en kalabalık turda (2. sınıf, 36 nesne)
öğeler arası mesafe dar - daha büyük bir hitbox komşu öğelerle çakışma riski taşıyordu.
Playwright ile en kalabalık tur test edildi, görsel bozulma yok, hit-area gerçek ölçümü
44-57px aralığında.

## 4. Roadmap — Kalan Tek Madde

**Madde 5: 3-4. sınıf içeriği.** Kullanıcıyla konuşuldu, **bilinçli olarak bu oturuma
alınmadı** — bu oturumda yapılan işin (19 oyun dosyası, ~10.500 satır kod, 9 JSON veri
bankası) yaklaşık iki katı büyüklüğünde bir içerik yazım işi olurdu, aynı kalitede
bitirmek gerçekçi değildi. **Kullanıcı "başka bir oturumda ele alırız" dedi** - bir
sonraki oturumda buradan devam edilebilir. Mimari zaten hazır (`DESTEKLENEN_SINIFLAR`,
`sinif` prop deseni her oyunda kurulu) - asıl iş içerik yazımı (JSON soru bankaları,
MEB müfredatına uygun kazanımlar) ve muhtemelen bazı oyun motorlarının 3-4. sınıf
seviyesine (daha büyük sayılar, daha karmaşık kelimeler/cümleler) uyarlanması.

**Ayrıca madde 4'ün geri kalanı** (bitişik el yazısı, paragraf okuma, noktalama) da
bekliyor - bkz. Bölüm 3.D.

## 5. Devir Teslim Dokümanının Bilinen Eksikleri — Güncel Durum

- ~~2. sınıf OYUN ÇEŞİTLİLİĞİ~~ → **ÇÖZÜLDÜ** (Matematik/Türkçe/İngilizce/Hayat Bilgisi
  hepsi 1. sınıfla paralel çeşitlilikte).
- ~~Kelime Avı~~ → **ÇÖZÜLDÜ**.
- ~~Bundle boyutu~~ → **ÇÖZÜLDÜ** (code-splitting).
- ~~Dokunma alanı kontrolü diğer oyunlarda~~ → **ÇÖZÜLDÜ** (GizliNesneBulma düzeltildi,
  FarkBulma zaten sorunsuzdu).
- Cümle tamamlama → **ÇÖZÜLDÜ** (sadece bu alt başlık). Bitişik el yazısı / paragraf
  okuma / noktalama → **hâlâ yapılmadı**.
- 3-4. sınıf İÇERİĞİ → **hâlâ hiç başlanmadı** (bilinçli erteleme, bkz. Bölüm 4).
- Gerçek öğretmen/pedagog gözden geçirmesi → **hâlâ yapılmadı**.
- Maskotu oyun içine taşıma → **hâlâ başlanmadı**.
- Gerçek dokunmatik cihazda test → **hâlâ yapılmadı** (mobil viewport simülasyonuyla
  Playwright testi yapıldı, ama gerçek cihazda parmakla dokunma testi değil).

## 6. Önemli Bağlam / Hatırlanması Gerekenler

- Git akışı: `git add -A && git commit -m "..." && git push origin main`. **Bu oturumda
  kod tabanı ilk kez git reposuna dönüştürüldü** (`git init` + `.gitignore` + ilk
  commit) - önceki oturumlarda muhtemelen kullanıcı kendi tarafında git yönetiyordu,
  bu zip'e o geçmiş dahil değildi.
- Her değişiklikten sonra `npx oxlint` + `npm run build` + Playwright ile gerçek akış
  testi + (görsel değişiklik varsa) ekran görüntüsü doğrulaması alışkanlığı sürüyor.
- Yeni bir JSON soru bankası eklerken **1. sınıf şemasını birebir kopyala** - oyun
  kodları bu şemaya sıkı bağımlı.
- Yeni bir sınıfın/oyunun kataloğa girmesi için **iki dosya senkron güncellenmeli**:
  `App.jsx`'teki `GAMES_SINIF{N}` (Component referanslı, artık `lazy()` ile) ve
  `progress.js`'teki `GUN_PLANI_KATALOGU_SINIF{N}` (saf veri) - id'ler birebir aynı.
- **Oyun başlıkları kısa tutulmalı:** Bu oturumda iki kez ("Doğru mu Yanlış mı?",
  "Cümle Tamamlama") oyun içi başlık üstteki tur/seviye pill'iyle çakıştı (2 satıra
  taştı) - `top-row` düzeni ~15 karakteri geçen başlıklarda risk taşıyor, yeni oyun
  eklerken başlığı kısa tut ya da `top-row` CSS'ini `flex-wrap` ile daha toleranslı
  hale getirmeyi düşün (henüz yapılmadı, sadece başlıklar kısaltılarak çözüldü).
  Uzun ad görünmesi isteniyorsa (`ad` alanı) katalogtaki `ad` ile oyun içi `brand`
  başlığı FARKLI olabilir - örn. katalogtaki `ad: "Doğru mu Yanlış mı?"`, oyun içi
  başlık `"Kural Bilgisi"`.
- **`React.lazy` sonrası:** Yeni bir oyun eklerken `App.jsx`'in en üstündeki importu
  `const X = lazy(() => import("./games/X.jsx"));` şeklinde ekle - eski `import X
  from "..."` deseni artık kullanılmıyor. `<ActiveComponent>` zaten `<Suspense>` ile
  sarılı, ekstra bir şey yapmaya gerek yok.
- **Türkçe/İngilizce oyunlarına özgü (değişmedi):** `TEMA_ESLEME` sözlüğü birden çok
  dosyada ayrı kopya duruyor (artık `IngilizceKelimeYarisi.jsx`'te de bir kopyası var) -
  yeni kelime eklenirse hepsine eklenmeli. Ortak dosyaya taşımak hâlâ yapılmadı.
- **Hayat Bilgisi Kural Bilgisi'ne özgü (yeni):** `ipucu` alanı yanlış cevapta kısa
  açıklama gösteriyor - yeni `kural_bilgisi` kaydı eklerken mümkünse `ipucu` doldur
  (boş bırakılabilir ama pedagojik değeri düşüyor).
- **Cümle Tamamlama'ya özgü (yeni):** `soru_metni` alanında boşluk **birebir `"___"`**
  (3 alt çizgi) ile işaretlenmeli - motor `split("___")` ile ayırıyor, farklı bir
  format (ör. `"____"` 4 alt çizgi) sessizce bozulur (boşluk render edilmez).
- `gununGorevleri` her ders grubundan bir alt küme seçiyor - bir dersin birden fazla
  oyunu varsa hepsi "Bugünün Görevi" listesinde çıkmayabilir, bu normal; tüm oyunlara
  "Tüm Oyunlar" sekmesinden her zaman erişilebiliyor.
- **`npx oxlint` sürüm değişkenliği:** Önceki oturumlarda not edilen bu risk hâlâ
  geçerli - "0/0" beklerken birkaç uyarı görülürse önce sürüm farkına bak.
- Kullanıcıya karşı dürüst ol: platform hâlâ **1. sınıfı tam, 2. sınıfı hem ders
  grubu HEM oyun çeşitliliği açısından 1. sınıfla paralel, ama 3-4. sınıfı hiç
  içermeyen bir MVP**. Gerçek pedagog incelemesi ve gerçek cihaz testi olmadan
  "bitmiş" sayılmamalı.
