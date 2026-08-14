// ---- İlerleme takip katmanı ----
// Sunucu maliyeti istemediğimiz için tamamen istemci taraflı: veri
// tarayıcının localStorage'ında JSON olarak tutulur. Veri hacmi küçük
// (tek çocuk, günlük birkaç oturum) olduğundan SQLite/IndexedDB gibi
// daha ağır çözümler yerine bilinçli olarak bu basit yaklaşım seçildi.
//
// SINIF SİSTEMİ: Her sınıfın kendi ilerlemesi, kendi ayarları ve kendi
// müfredat kataloğu var - birbirinden tamamen bağımsız localStorage
// anahtarlarında tutuluyor (kardeşler aynı cihazı paylaşabilir, ya da
// aynı çocuk yıl atlayınca eski yılın verisi kaybolmasın diye). Hangi
// sınıfın şu an aktif olduğu ayrı, üçüncü bir anahtarda tutuluyor.

const STORAGE_ANAHTARI_ONEKI = "tilkitopya_ilerleme_v1";
const AKTIF_SINIF_ANAHTARI = "tilkitopya_aktif_sinif";

// 1. sınıf, geriye dönük uyumluluk için orijinal (sınıf eki olmayan)
// anahtarı kullanmaya devam ediyor - böylece mevcut kullanıcıların
// birikmiş ilerlemesi kaybolmuyor.
function storageAnahtari(sinif) {
  return sinif === 2 ? `${STORAGE_ANAHTARI_ONEKI}_sinif2` : STORAGE_ANAHTARI_ONEKI;
}

export function aktifSinifOku() {
  try {
    return localStorage.getItem(AKTIF_SINIF_ANAHTARI) === "2" ? 2 : 1;
  } catch {
    return 1;
  }
}

export function aktifSinifKaydet(sinif) {
  try {
    localStorage.setItem(AKTIF_SINIF_ANAHTARI, String(sinif));
  } catch {
    // yazılamıyorsa sessizce geç - sadece bu oturumda hatırlanmaz
  }
}

// Gün planında dönen oyun kataloğu. App.jsx'teki GAMES_BY_SINIF ile aynı
// id'leri kullanır ama Component referansı taşımaz - bu dosya React'tan
// bağımsız, saf veri/mantık katmanı olarak kalsın diye kasıtlı olarak
// ayrı tutuldu.
const GUN_PLANI_KATALOGU_SINIF1 = [
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

// 2. sınıf müfredatı henüz hazır değil - mimari (sınıf seçici, ayrı
// ilerleme/ayar deposu) bu oturumda kuruldu, içerik (soru bankaları,
// oyunlar) bir sonraki adım. Boş katalog kasıtlı: Ana Ekran bunu görüp
// "yakında" ekranını gösteriyor (bkz. sinifIcerigiVarMi).
const GUN_PLANI_KATALOGU_SINIF2 = [];

export const MUFREDAT_KATALOGLARI = {
  1: GUN_PLANI_KATALOGU_SINIF1,
  2: GUN_PLANI_KATALOGU_SINIF2,
};

export function sinifIcerigiVarMi(sinif) {
  return (MUFREDAT_KATALOGLARI[sinif]?.length ?? 0) > 0;
}

function bosIlerleme(sinif = 1) {
  return {
    surum: 1,
    sinif,
    aktifGun: 1, // çocuğun şu an üzerinde çalıştığı gün numarası
    gunler: {}, // { [gunNo]: { tamamlandi, tamamlanmaTarihi, gorevler: { [gameId]: { stars, tarih } } } }
    oturumSayisi: 0,
    ayarlar: {
      // Ebeveyn kapatırsa çocuk sadece "Görevler" sekmesini görür,
      // istediği oyunu özgürce seçemez. Varsayılan: açık (esnek).
      tumOyunlarSekmesiAcik: true,
      // Ödül oyunları (Boyama Kitabı, Yap Boz) ne zaman erişilebilir olsun.
      // "gorevSonrasi" (varsayılan): günün 5 görevi bitince o gün için açılır,
      // yeni gün başlayıp ilk görev oynanınca tekrar kilitlenir.
      // "herZaman": ebeveyn isterse kısıtlamayı tamamen kaldırabilir.
      odulOyunlariModu: "gorevSonrasi",
    },
  };
}

export function ilerlemeyiOku(sinif = 1) {
  try {
    const raw = localStorage.getItem(storageAnahtari(sinif));
    if (!raw) return bosIlerleme(sinif);
    const parsed = JSON.parse(raw);
    const varsayilan = bosIlerleme(sinif);
    return { ...varsayilan, ...parsed, sinif, ayarlar: { ...varsayilan.ayarlar, ...parsed.ayarlar } };
  } catch {
    // localStorage okunamıyorsa (gizli mod, devre dışı vb.) sıfırdan başla -
    // uygulama ilerleme takibi olmadan da normal çalışmaya devam etmeli
    return bosIlerleme(sinif);
  }
}

function ilerlemeyiYaz(ilerleme) {
  try {
    localStorage.setItem(storageAnahtari(ilerleme.sinif || 1), JSON.stringify(ilerleme));
  } catch {
    // yazılamıyorsa sessizce geç
  }
}

// Bir gün için "bugünün görevleri"ni döndürür: her ders grubundan gün
// numarasına göre rotasyonla bir oyun seçilir (aynı oyun art arda gelmesin,
// çeşitlilik sağlansın diye). 5 ders grubu = günde 5 görev.
export function gununGorevleri(gunNo, sinif = 1) {
  const katalog = MUFREDAT_KATALOGLARI[sinif] || [];
  return katalog.map((grup) => {
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
export function oyunTamamlandi(gameId, stars, sinif = 1) {
  const ilerleme = ilerlemeyiOku(sinif);
  const katalog = MUFREDAT_KATALOGLARI[sinif] || [];
  const gunNo = ilerleme.aktifGun;
  const oynananGrup = katalog.find((g) => g.items.some((i) => i.id === gameId));

  ilerleme.oturumSayisi += 1;

  if (!ilerleme.gunler[gunNo]) {
    ilerleme.gunler[gunNo] = { tamamlandi: false, gorevler: {} };
  }

  if (oynananGrup) {
    const gorevler = gununGorevleri(gunNo, sinif);
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
  const katalog = MUFREDAT_KATALOGLARI[ilerleme.sinif || 1] || [];
  const ozet = {};
  Object.values(ilerleme.gunler).forEach((gun) => {
    Object.entries(gun.gorevler || {}).forEach(([gameId, kayit]) => {
      const grup = katalog.find((g) => g.items.some((i) => i.id === gameId));
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

// Ödül oyunları (Boyama Kitabı, Yap Boz) şu an açık mı?
// - "herZaman" modunda her zaman açık.
// - "gorevSonrasi" modunda: bir önceki gün tamamlanmışsa VE bugünün
//   görevlerinden henüz hiçbiri oynanmamışsa açık sayılır (yani "günün
//   görevlerini bitirdin, ödül zamanı" penceresi). Çocuk yeni günün ilk
//   görevine başlar başlamaz pencere kapanır, bir sonraki gün tamamlanana
//   kadar tekrar kilitli kalır.
// Not: Ödül oyunları sınıftan bağımsız (her iki sınıfta da aynı Boyama
// Kitabı/Yap Boz kullanılıyor), bu yüzden bu fonksiyon sınıf bilgisine
// ihtiyaç duymuyor.
export function odulOyunlariAcikMi(ilerleme) {
  if (ilerleme.ayarlar.odulOyunlariModu === "herZaman") return true;
  const gunNo = ilerleme.aktifGun;
  const oncekiGun = ilerleme.gunler[gunNo - 1];
  if (!oncekiGun?.tamamlandi) return false;
  const bugunKayit = ilerleme.gunler[gunNo];
  const bugunBaslandiMi = !!bugunKayit && Object.keys(bugunKayit.gorevler || {}).length > 0;
  return !bugunBaslandiMi;
}

export function ilerlemeyiSifirla(sinif = 1) {
  const bos = bosIlerleme(sinif);
  ilerlemeyiYaz(bos);
  return bos;
}

// Ebeveyn panelinden ayar değiştirmek için (örn. "Tüm Oyunlar" sekmesini
// açma/kapatma). İlerleme verisini sıfırlamadan sadece ayarları günceller.
export function ayarKaydet(patch, sinif = 1) {
  const ilerleme = ilerlemeyiOku(sinif);
  ilerleme.ayarlar = { ...ilerleme.ayarlar, ...patch };
  ilerlemeyiYaz(ilerleme);
  return ilerleme;
}