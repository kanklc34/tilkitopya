// ---- İlerleme takip katmanı ----
// Sunucu maliyeti istemediğimiz için tamamen istemci taraflı: veri
// tarayıcının localStorage'ında JSON olarak tutulur. Veri hacmi küçük
// (tek çocuk, günlük birkaç oturum) olduğundan SQLite/IndexedDB gibi
// daha ağır çözümler yerine bilinçli olarak bu basit yaklaşım seçildi.

const STORAGE_KEY = "tilkitopya_ilerleme_v1";

// Gün planında dönen oyun kataloğu. App.jsx'teki GAMES ile aynı id'leri
// kullanır ama Component referansı taşımaz - bu dosya React'tan bağımsız,
// saf veri/mantık katmanı olarak kalsın diye kasıtlı olarak ayrı tutuldu.
export const GUN_PLANI_KATALOGU = [
  {
    ders: "Matematik",
    dersEmoji: "🔢",
    items: [
      { id: "pratik-matematik", ad: "Pratik Modu", emoji: "📚" },
      { id: "hizli-yaris", ad: "Hızlı Yarış", emoji: "🏎️" },
      { id: "mat-eslestirme", ad: "Eşleştirme", emoji: "🃏" },
      { id: "bosluk-mat", ad: "Boşluk Doldur", emoji: "❓" },
    ],
  },
  {
    ders: "Türkçe",
    dersEmoji: "📖",
    items: [
      { id: "tr-eslestirme", ad: "Kelime Eşleştir", emoji: "🃏" },
      { id: "tr-harf", ad: "Harf Tamamla", emoji: "🔤" },
    ],
  },
  {
    ders: "İngilizce",
    dersEmoji: "🌍",
    items: [
      { id: "en-eslestirme", ad: "Word Match", emoji: "🃏" },
      { id: "en-harf", ad: "Word Fill", emoji: "🔤" },
    ],
  },
  {
    ders: "Hayat Bilgisi",
    dersEmoji: "🏡",
    items: [
      { id: "hb-doga", ad: "Doğa Gözlemi", emoji: "🦋" },
      { id: "hb-gunler", ad: "Günler Sırası", emoji: "📅" },
    ],
  },
  {
    ders: "Genel Beceriler",
    dersEmoji: "🧠",
    items: [
      { id: "gb-fark", ad: "Farklı Olan", emoji: "🔍" },
      { id: "gb-gizli", ad: "Gizli Nesne", emoji: "🕵️" },
    ],
  },
];

function bosIlerleme() {
  return {
    surum: 1,
    aktifGun: 1, // çocuğun şu an üzerinde çalıştığı gün numarası
    gunler: {}, // { [gunNo]: { tamamlandi, tamamlanmaTarihi, gorevler: { [gameId]: { stars, tarih } } } }
    oturumSayisi: 0,
    ayarlar: {
      // Ebeveyn kapatırsa çocuk sadece "Görevler" sekmesini görür,
      // istediği oyunu özgürce seçemez. Varsayılan: açık (esnek).
      tumOyunlarSekmesiAcik: true,
    },
  };
}

export function ilerlemeyiOku() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return bosIlerleme();
    const parsed = JSON.parse(raw);
    const varsayilan = bosIlerleme();
    return { ...varsayilan, ...parsed, ayarlar: { ...varsayilan.ayarlar, ...parsed.ayarlar } };
  } catch {
    // localStorage okunamıyorsa (gizli mod, devre dışı vb.) sıfırdan başla -
    // uygulama ilerleme takibi olmadan da normal çalışmaya devam etmeli
    return bosIlerleme();
  }
}

function ilerlemeyiYaz(ilerleme) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ilerleme));
  } catch {
    // yazılamıyorsa sessizce geç
  }
}

// Bir gün için "bugünün görevleri"ni döndürür: her ders grubundan gün
// numarasına göre rotasyonla bir oyun seçilir (aynı oyun art arda gelmesin,
// çeşitlilik sağlansın diye). 5 ders grubu = günde 5 görev.
export function gununGorevleri(gunNo) {
  return GUN_PLANI_KATALOGU.map((grup) => {
    const index = (gunNo - 1) % grup.items.length;
    const oyun = grup.items[index];
    return { ders: grup.ders, dersEmoji: grup.dersEmoji, ...oyun };
  });
}

export function gunTamamlandiMi(ilerleme, gunNo) {
  return !!ilerleme.gunler[gunNo]?.tamamlandi;
}

// Bir oyun oturumu bittiğinde çağrılır. Oyun, o dersin bugün için ATANMIŞ
// olan görevi olmasa bile - çocuk "Tüm Oyunlar" sekmesinden aynı dersten
// farklı bir oyun seçmiş olabilir - o dersin bugünkü görevini tamamlanmış
// sayıyoruz (hangi oyunu oynadığı önemli değil, hangi dersi çalıştığı
// önemli). Günün tüm dersleri bitince gün "tamamlandı" sayılır ve aktif
// gün bir sonrakine geçer (takvimden bağımsız, tamamlama bazlı ilerleme).
export function oyunTamamlandi(gameId, stars) {
  const ilerleme = ilerlemeyiOku();
  const gunNo = ilerleme.aktifGun;
  const oynananGrup = GUN_PLANI_KATALOGU.find((g) => g.items.some((i) => i.id === gameId));

  ilerleme.oturumSayisi += 1;

  if (!ilerleme.gunler[gunNo]) {
    ilerleme.gunler[gunNo] = { tamamlandi: false, gorevler: {} };
  }

  if (oynananGrup) {
    const gorevler = gununGorevleri(gunNo);
    const gununGorevi = gorevler.find((g) => g.ders === oynananGrup.ders);

    ilerleme.gunler[gunNo].gorevler[gununGorevi.id] = {
      stars,
      tarih: new Date().toISOString(),
      oynananOyun: gameId, // şeffaflık için: gerçekte hangi oyun oynandı
    };

    const hepsiTamam = gorevler.every((g) => ilerleme.gunler[gunNo].gorevler[g.id]);
    if (hepsiTamam && !ilerleme.gunler[gunNo].tamamlandi) {
      ilerleme.gunler[gunNo].tamamlandi = true;
      ilerleme.gunler[gunNo].tamamlanmaTarihi = new Date().toISOString();
      ilerleme.aktifGun = gunNo + 1;
    }
  }

  ilerlemeyiYaz(ilerleme);
  return ilerleme;
}

// Ders bazlı özet (ebeveyn paneli için). Oyunlar arası ortak bir metrik
// olarak stars (1-3) kullanılıyor; ortalaması 1.6'nın altındaki dersler
// "zorlanıyor olabilir" olarak işaretleniyor - kesin tanı değil, sadece
// ebeveynin dikkatini çekecek kaba bir sinyal.
export function dersOzetiHesapla(ilerleme) {
  const ozet = {};
  Object.values(ilerleme.gunler).forEach((gun) => {
    Object.entries(gun.gorevler || {}).forEach(([gameId, kayit]) => {
      const grup = GUN_PLANI_KATALOGU.find((g) => g.items.some((i) => i.id === gameId));
      if (!grup) return;
      if (!ozet[grup.ders]) ozet[grup.ders] = { toplamOturum: 0, toplamYildiz: 0 };
      ozet[grup.ders].toplamOturum += 1;
      ozet[grup.ders].toplamYildiz += kayit.stars;
    });
  });
  return Object.entries(ozet).map(([ders, veri]) => ({
    ders,
    ortalamaYildiz: veri.toplamOturum ? veri.toplamYildiz / veri.toplamOturum : 0,
    oturumSayisi: veri.toplamOturum,
    zorlaniyor: veri.toplamOturum > 0 && veri.toplamYildiz / veri.toplamOturum < 1.6,
  }));
}

export function ilerlemeyiSifirla() {
  ilerlemeyiYaz(bosIlerleme());
  return bosIlerleme();
}

// Ebeveyn panelinden ayar değiştirmek için (örn. "Tüm Oyunlar" sekmesini
// açma/kapatma). İlerleme verisini sıfırlamadan sadece ayarları günceller.
export function ayarKaydet(patch) {
  const ilerleme = ilerlemeyiOku();
  ilerleme.ayarlar = { ...ilerleme.ayarlar, ...patch };
  ilerlemeyiYaz(ilerleme);
  return ilerleme;
}