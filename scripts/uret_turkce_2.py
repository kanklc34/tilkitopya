"""
2. sınıf Türkçe soru bankası üretici.
1. sınıf bankasıyla (turkce-1-sinif.json) AYNI ŞEMAYI kullanır - bilinçli
olarak: TurkceHarfTamamlama.jsx ve TurkceEslestirme.jsx bu şemayı bekliyor.
Üretilen JSON src/data/turkce-2-sinif.json'a yazılır.

Kapsam (devir teslim dokümanındaki yol haritasından, mevcut oyun motorlarıyla
karşılanabilen kısım):
- Kelime tanıma / eksik harf tamamlama - 1. sınıftan daha uzun kelimeler,
  daha fazla eksik harf (2 boşluk, "any" pozisyon - 1. sınıfın en zor turu
  2. sınıfın normu oluyor).
- Kelime <-> görsel eşleştirme - aynı genişletilmiş kelime havuzuyla.
- Alfabetik sıra - 1. sınıftan daha geniş aralıklı (3 harf atlama).

KAPSAM DIŞI (mevcut oyun motorları desteklemiyor, yeni motor gerekir):
- Bitişik el yazısı, cümle tamamlama, kısa paragraf okuma-anlama, noktalama.
  Bu dördü devir teslim dokümanında "henüz yapılamadı" olarak işaretli
  kalmalı - motor kararı kullanıcıyla netleştirilmeden içerik üretilmedi.
"""
import json

# 2. sınıf kelime havuzu: 1. sınıftan daha uzun/çok heceli, emoji ile temsil
# edilebilir, 6 tema (1. sınıfla aynı tema iskeleti + günlük_hayat).
KELIME_HAVUZU = [
    ("ASLAN", "🦁", "hayvanlar"), ("FİL", "🐘", "hayvanlar"), ("ZÜRAFA", "🦒", "hayvanlar"),
    ("PENGUEN", "🐧", "hayvanlar"), ("TAVŞAN", "🐰", "hayvanlar"), ("KAPLUMBAĞA", "🐢", "hayvanlar"),
    ("BULUT", "☁️", "doga"), ("YAĞMUR", "🌧️", "doga"), ("GÖKKUŞAĞI", "🌈", "doga"),
    ("ORMAN", "🌲", "doga"), ("DENİZ", "🌊", "doga"), ("YILDIZ", "⭐", "doga"),
    ("KALEM", "✏️", "okul"), ("DEFTER", "📓", "okul"), ("ÇANTA", "🎒", "okul"),
    ("SINIF", "🏫", "okul"), ("HARİTA", "🗺️", "okul"), ("MAKAS", "✂️", "okul"),
    ("PASTA", "🎂", "yiyecek"), ("DONDURMA", "🍦", "yiyecek"), ("LİMONATA", "🍋", "yiyecek"),
    ("ÇİLEK", "🍓", "yiyecek"), ("KARPUZ", "🍉", "yiyecek"), ("SALATA", "🥗", "yiyecek"),
    ("UÇAK", "✈️", "oyuncaklar"), ("GEMİ", "🚢", "oyuncaklar"), ("TREN", "🚂", "oyuncaklar"),
    ("BİSİKLET", "🚲", "oyuncaklar"), ("ROBOT", "🤖", "oyuncaklar"), ("BALON", "🎈", "oyuncaklar"),
    ("ANAHTAR", "🔑", "gunluk_hayat"), ("MERDİVEN", "🪜", "gunluk_hayat"), ("AYNA", "🪞", "gunluk_hayat"),
    ("LAMBA", "💡", "gunluk_hayat"), ("TELEFON", "📱", "gunluk_hayat"), ("SAAT", "⏰", "gunluk_hayat"),
]

TURKCE_ALFABE = ["A", "B", "C", "Ç", "D", "E", "F", "G", "Ğ", "H", "I", "İ", "J", "K", "L",
                  "M", "N", "O", "Ö", "P", "R", "S", "Ş", "T", "U", "Ü", "V", "Y", "Z"]

sorular = []
sayac = 1


def id_uret():
    global sayac
    s = f"TUR-2-{sayac:04d}"
    sayac += 1
    return s


# ---- 1) Eksik harf tamamlama (2 boşluk, herhangi konumda) ----
for kelime, emoji, tema in KELIME_HAVUZU:
    letters = list(kelime)
    # Çok kısa kelimelerde (3 harf, örn FİL) 2 boşluk kelimenin 2/3'ünü
    # boşaltıp aşırı zorlaştırıyor - bu durumda tek boşlukla sınırla.
    if len(letters) <= 3:
        pozisyonlar = [len(letters) - 1]
    elif len(letters) >= 5:
        pozisyonlar = [1, len(letters) - 2]
    else:
        pozisyonlar = [1, len(letters) - 1]
    soru_metni = "".join("_" if i in pozisyonlar else ch for i, ch in enumerate(letters))
    dogru_cevap = "".join(letters[i] for i in pozisyonlar)
    sorular.append({
        "id": id_uret(), "ders": "Türkçe", "sinif": 2,
        "kazanim": "T.2.3 Hece ve kelime tanıma - eksik harfleri tamamlar (çok heceli kelimeler)",
        "seviye": 2, "oyun_tipi": "bosluk_doldurma", "soru_metni": soru_metni,
        "soru_gorseli": None, "ses_dosyasi": None, "secenekler": None,
        "dogru_cevap": dogru_cevap, "ipucu": f"{emoji} resmine bak", "zorluk_puani": 2,
        "tam_kelime": kelime, "gorsel_emoji": emoji, "soru_tipi": "harf_tamamlama",
    })

# ---- 2) Kelime <-> görsel eşleştirme (aynı kelime havuzu) ----
for kelime, emoji, tema in KELIME_HAVUZU:
    sorular.append({
        "id": id_uret(), "ders": "Türkçe", "sinif": 2,
        "kazanim": "T.2.2 Kelime dağarcığı - kelimeyi görseliyle eşleştirir (genişletilmiş kelime havuzu)",
        "seviye": 3, "oyun_tipi": "eslestirme", "soru_metni": kelime,
        "soru_gorseli": None, "ses_dosyasi": None, "secenekler": None,
        "dogru_cevap": emoji, "ipucu": None, "zorluk_puani": 2,
        "tam_kelime": kelime, "gorsel_emoji": emoji, "soru_tipi": "eslestirme",
    })

# ---- 3) Alfabetik sıra - 1. sınıftan daha geniş aralık (2-3 harf atlama) ----
for i in range(len(TURKCE_ALFABE) - 4):
    a, mid, b = TURKCE_ALFABE[i], TURKCE_ALFABE[i + 2], TURKCE_ALFABE[i + 4]
    sorular.append({
        "id": id_uret(), "ders": "Türkçe", "sinif": 2,
        "kazanim": "T.2.1 Alfabetik sırayı bilir, iki harf atlayarak sıralar",
        "seviye": 2, "oyun_tipi": "bosluk_doldurma", "soru_tipi": "harf_sira",
        "soru_metni": f"{a} → ? → {b}", "soru_gorseli": None, "ses_dosyasi": None,
        "secenekler": None, "dogru_cevap": mid, "ipucu": None, "zorluk_puani": 2,
    })

# ---- Doğrulama ----
for s in sorular:
    assert s["dogru_cevap"], s
    for k in ["id", "ders", "sinif", "kazanim", "seviye", "oyun_tipi", "soru_tipi",
              "soru_metni", "soru_gorseli", "ses_dosyasi", "secenekler", "dogru_cevap",
              "ipucu", "zorluk_puani"]:
        assert k in s, (s["id"], k)

cikti = {
    "meta": {
        "ders": "Türkçe", "sinif": 2,
        "kaynak_not": "T.2.x kodları temsilidir, resmi kod ile değiştirilmeli. "
                       "1. sınıf şemasıyla birebir uyumlu, kelime havuzu genişletilip "
                       "zorlaştırıldı (daha uzun kelime + 2 boşluk + daha geniş alfabetik "
                       "atlama). Bitişik el yazısı / cümle tamamlama / paragraf okuma / "
                       "noktalama KAPSAM DIŞI - mevcut oyun motorları bunları desteklemiyor, "
                       "yeni motor kararı bekliyor.",
        "toplam_soru": len(sorular),
        "temalar": sorted(set(t for _, _, t in KELIME_HAVUZU)),
    },
    "sorular": sorular,
}

with open("src/data/turkce-2-sinif.json", "w", encoding="utf-8") as f:
    json.dump(cikti, f, ensure_ascii=False, indent=2)

print(f"Yazıldı: {len(sorular)} soru")
