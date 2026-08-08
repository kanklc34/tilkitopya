// Maskotun konuşma balonunda gösterdiği mesajlar. Kategoriler ayrı
// tutuluyor ki hem ana ekranda (zaman/ilerleme bazlı) hem de ileride
// oyun içinde (doğru/yanlış anlarında) aynı kütüphane kullanılabilsin.

export const ZAMAN_SELAMLARI = {
  sabah: [
    "Günaydın! Bugün ne öğrenelim?",
    "Günaydın kahraman! Hazır mısın?",
    "Yeni bir gün, yeni maceralar! 🌞",
  ],
  ogle: [
    "Merhaba! Bugün ne oynamak istersin?",
    "Hazır mısın? Hadi başlayalım!",
    "Bugün hangi oyunla eğleneceğiz?",
  ],
  aksam: [
    "İyi akşamlar! Biraz oynayalım mı?",
    "Akşam eğlencesi zamanı! 🌆",
  ],
  gece: [
    "Biraz geç oldu ama olsun, kısa bir oyun oynayalım!",
    "Hazırsan başlayalım, sonra uyku zamanı 🌙",
  ],
};

export const ILERLEME_MESAJLARI = {
  gunTamamlandi: [
    "Bugünü tamamladın, harikasın! 🎉",
    "Tüm görevleri bitirdin, seninle gurur duyuyorum! ⭐",
    "Bugün süper bir iş çıkardın!",
  ],
  yariYolda: [
    "Yarı yoldasın, devam et!",
    "Güzel gidiyorsun, birkaç görev daha kaldı!",
  ],
  hicBaslamadi: [
    "Bugünün görevlerine başlamaya ne dersin?",
    "Hadi bugünün ilk görevini birlikte yapalım!",
  ],
};

// Şimdilik sadece kütüphanede hazır bekliyor - ana ekranda
// kullanılmıyor, oyun içi entegrasyon yapıldığında (sonraki aşama)
// yanlış cevap anlarında gösterilecek.
export const CESARETLENDIRME_MESAJLARI = [
  "Sorun değil, tekrar deneyelim!",
  "Herkes böyle öğrenir, pes etme!",
  "Yanlış da olsa denemen çok değerli!",
  "Az kalsın! Bir daha dene.",
  "Öğrenmenin en güzel yanı denemek 💪",
];

export const KUTLAMA_MESAJLARI = [
  "Harikasın! 🌟",
  "Süpersin! Böyle devam!",
  "Bunu başardın! 🎉",
  "Muhteşem bir iş çıkardın!",
];

function rastgeleSec(dizi) {
  return dizi[Math.floor(Math.random() * dizi.length)];
}

function gunDilimiGetir() {
  const saat = new Date().getHours();
  if (saat >= 6 && saat < 11) return "sabah";
  if (saat >= 11 && saat < 18) return "ogle";
  if (saat >= 18 && saat < 22) return "aksam";
  return "gece";
}

// Ana ekranda gösterilecek bağlamsal mesajı seçer: önce günün
// ilerleme durumuna, o da nötr çıkarsa günün saatine bakar.
export function anaEkranMesajiSec({ tamamlananSayisi, toplamGorev }) {
  if (toplamGorev > 0 && tamamlananSayisi >= toplamGorev) {
    return rastgeleSec(ILERLEME_MESAJLARI.gunTamamlandi);
  }
  if (tamamlananSayisi === 0) {
    // %50 ihtimalle görev teşviki, %50 zaman bazlı selam - tekdüze olmasın
    if (Math.random() < 0.5) return rastgeleSec(ILERLEME_MESAJLARI.hicBaslamadi);
    return rastgeleSec(ZAMAN_SELAMLARI[gunDilimiGetir()]);
  }
  if (tamamlananSayisi > 0 && tamamlananSayisi < toplamGorev) {
    return rastgeleSec(ILERLEME_MESAJLARI.yariYolda);
  }
  return rastgeleSec(ZAMAN_SELAMLARI[gunDilimiGetir()]);
}
