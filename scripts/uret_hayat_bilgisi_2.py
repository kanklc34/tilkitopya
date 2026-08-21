"""
2. sınıf Hayat Bilgisi soru bankası üretici.
1. sınıf bankasıyla (hayat-bilgisi-1-sinif.json) AYNI ŞEMAYI kullanır -
bilinçli olarak: HayatBilgisiGunlerSirasi.jsx ve HayatBilgisiDogaGozlem.jsx
bu şemayı bekliyor. Üretilen JSON src/data/hayat-bilgisi-2-sinif.json'a
yazılır.

Kapsam (1. sınıftan bir adım ileri):
- gun_sira: haftanın günleri, 1. sınıfla aynı ama daha zor kombinasyonlar
  (komşu günler yerine 2 gün atlamalı - "? → (2 gün sonra) → X" yerine
  aynı basit format korunuyor, sadece bilinmeyenin konumu daha çeşitli).
- ay_sira: YENİ soru tipi - 12 ayın sıralaması. HayatBilgisiGunlerSirasi.jsx
  motoru "zaman sırası" kavramını genelleştirilmiş haliyle kullanacak
  şekilde güncellendi (gün VEYA ay havuzundan puzzle üretebiliyor).
- doga_gozlem: 1. sınıftan farklı/ek hedef nesneler (böcek/hayvan çeşitliliği
  arttı) + ROUNDS 2. sınıf için daha kalabalık sahnelerle tanımlandı (kod
  tarafında, bkz. HayatBilgisiDogaGozlem.jsx).
"""
import json

DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"]
MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos",
          "Eylül", "Ekim", "Kasım", "Aralık"]

# 2. sınıf için yeni doğa gözlemi hedefleri (1. sınıftan farklı, çeşitlilik
# artışı - roadmap'teki "daha yoğun/çok nesneli sahneler" hedefinin veri
# tarafı; kalabalık artışı ROUNDS'ta kod tarafında yapılacak).
DOGA_HEDEFLERI_SINIF2 = ["🐿️", "🦔", "🐌", "🦗", "🐜"]

sorular = []
sayac = 1


def id_uret():
    global sayac
    s = f"HB-2-{sayac:04d}"
    sayac += 1
    return s


def zaman_sorulari_uret(pool, kazanim, soru_tipi, adet):
    """3'lü ardışık pencere (X, Y, Z) alıp birini '?' yapan puzzle üretir -
    1. sınıfla aynı format, sadece hangi pozisyonun boş olduğu döngüsel."""
    n = len(pool)
    for i in range(adet):
        start = i % n
        ucgen = [pool[start % n], pool[(start + 1) % n], pool[(start + 2) % n]]
        bosluk_pos = i % 3
        dogru = ucgen[bosluk_pos]
        soru_metni = " → ".join("?" if j == bosluk_pos else ucgen[j] for j in range(3))
        sorular.append({
            "id": id_uret(), "ders": "Hayat Bilgisi", "sinif": 2, "kazanim": kazanim,
            "seviye": 1 if bosluk_pos == 0 else 2, "oyun_tipi": "bosluk_doldurma",
            "soru_tipi": soru_tipi, "soru_metni": soru_metni, "soru_gorseli": None,
            "ses_dosyasi": None, "secenekler": None, "dogru_cevap": dogru,
            "ipucu": None, "zorluk_puani": 2,
        })


# ---- 1) Gün sırası - 1. sınıfla aynı format, tüm gün çiftleri için tam tur ----
zaman_sorulari_uret(DAYS, "HB.2.1 Zaman kavramı - haftanın günlerini sırasıyla söyler", "gun_sira", 15)

# ---- 2) Ay sırası - YENİ, 12 ay ----
zaman_sorulari_uret(MONTHS, "HB.2.2 Zaman kavramı - yılın aylarını sırasıyla söyler", "ay_sira", 18)

# ---- 3) Doğa gözlemi - yeni hedef nesneler ----
for hedef in DOGA_HEDEFLERI_SINIF2:
    for hedef_sayisi, kalabalik in [(2, 16), (3, 22)]:
        sorular.append({
            "id": id_uret(), "ders": "Hayat Bilgisi", "sinif": 2,
            "kazanim": "HB.2.4 Doğa ve çevre farkındalığı - canlıları gözlemler (genişletilmiş tür çeşitliliği)",
            "seviye": 2, "oyun_tipi": "gizli_nesne_bulma", "soru_tipi": "doga_gozlem",
            "soru_metni": f"{hedef} nesnesini sahnede bul", "soru_gorseli": None,
            "ses_dosyasi": None,
            "secenekler": {"hedef": hedef, "hedef_sayisi": hedef_sayisi, "kalabalik": kalabalik},
            "dogru_cevap": hedef, "ipucu": None, "zorluk_puani": 2,
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
        "ders": "Hayat Bilgisi", "sinif": 2,
        "kaynak_not": "HB.2.x kodları temsilidir, resmi kod ile değiştirilmeli. "
                       "1. sınıftan bir adım ileri: gün sırası tekrar edildi + YENİ "
                       "kazanım (ay sırası, 12 ay) eklendi + doğa gözleminde tür "
                       "çeşitliliği artırıldı. Diğer alt temalar (aile, okul kuralları, "
                       "güvenlik) 1. sınıfta olduğu gibi henüz eklenmedi.",
        "toplam_soru": len(sorular),
    },
    "sorular": sorular,
}

with open("src/data/hayat-bilgisi-2-sinif.json", "w", encoding="utf-8") as f:
    json.dump(cikti, f, ensure_ascii=False, indent=2)

print(f"Yazıldı: {len(sorular)} soru")
