"""
2. sınıf İngilizce soru bankası üretici.
1. sınıf bankasıyla (ingilizce-1-sinif.json) AYNI ŞEMAYI kullanır - bilinçli
olarak: IngilizceHarfTamamlama.jsx ve IngilizceEslestirme.jsx bu şemayı
bekliyor. Üretilen JSON src/data/ingilizce-2-sinif.json'a yazılır.

1. sınıf içeriği "erken tanışma" amaçlıydı (resmi müfredatta İngilizce 2.
sınıftan itibaren başlıyor - bkz. ingilizce-1-sinif.json meta notu). 2.
sınıf içeriği bu yüzden müfredatın asıl başlangıcı: daha geniş kelime
dağarcığı + yeni bir kategori (renkler - emoji renk daireleriyle doğal
temsil ediliyor, 2. sınıf İngilizce müfredatına uygun bir kazanım).
"""
import json

KELIME_HAVUZU = [
    ("LION", "🦁", "hayvanlar"), ("TIGER", "🐯", "hayvanlar"), ("RABBIT", "🐰", "hayvanlar"),
    ("DUCK", "🦆", "hayvanlar"), ("SHEEP", "🐑", "hayvanlar"), ("BEAR", "🐻", "hayvanlar"),
    ("CLOUD", "☁️", "doga"), ("RAIN", "🌧️", "doga"), ("RAINBOW", "🌈", "doga"),
    ("SNOW", "❄️", "doga"), ("TREE", "🌳", "doga"), ("LEAF", "🍃", "doga"),
    ("PIZZA", "🍕", "yiyecek"), ("BURGER", "🍔", "yiyecek"), ("COOKIE", "🍪", "yiyecek"),
    ("MILK", "🥛", "yiyecek"), ("EGG", "🥚", "yiyecek"), ("BREAD", "🍞", "yiyecek"),
    ("SCHOOL", "🏫", "okul"), ("PENCIL", "✏️", "okul"), ("CLOCK", "⏰", "okul"),
    ("DOOR", "🚪", "okul"), ("KEY", "🔑", "okul"), ("CHAIR", "🪑", "okul"),
    ("BALLOON", "🎈", "oyuncaklar"), ("ROBOT", "🤖", "oyuncaklar"), ("BOAT", "⛵", "oyuncaklar"),
    ("TRAIN", "🚂", "oyuncaklar"), ("KITE", "🪁", "oyuncaklar"), ("DRUM", "🥁", "oyuncaklar"),
    ("RED", "🔴", "renkler"), ("BLUE", "🔵", "renkler"), ("GREEN", "🟢", "renkler"),
    ("YELLOW", "🟡", "renkler"), ("PURPLE", "🟣", "renkler"), ("ORANGE", "🟠", "renkler"),
]

TURKISH_ALFABE = [chr(c) for c in range(ord("A"), ord("Z") + 1)]  # İngilizce alfabe (26 harf)

sorular = []
sayac = 1


def id_uret():
    global sayac
    s = f"ING-2-{sayac:04d}"
    sayac += 1
    return s


# ---- 1) Eksik harf tamamlama (kelime uzunluğuna göre 1-2 boşluk) ----
for kelime, emoji, tema in KELIME_HAVUZU:
    letters = list(kelime)
    if len(letters) <= 3:
        pozisyonlar = [len(letters) - 1]
    elif len(letters) >= 5:
        pozisyonlar = [1, len(letters) - 2]
    else:
        pozisyonlar = [1, len(letters) - 1]
    soru_metni = "".join("_" if i in pozisyonlar else ch for i, ch in enumerate(letters))
    dogru_cevap = "".join(letters[i] for i in pozisyonlar)
    sorular.append({
        "id": id_uret(), "ders": "İngilizce", "sinif": 2,
        "kazanim": "EN.2.1 Kelime dağarcığı - eksik harfleri tamamlar (genişletilmiş kelime havuzu)",
        "seviye": 2, "oyun_tipi": "bosluk_doldurma", "soru_metni": soru_metni,
        "soru_gorseli": None, "ses_dosyasi": None, "secenekler": None,
        "dogru_cevap": dogru_cevap, "ipucu": f"{emoji} resmine bak", "zorluk_puani": 2,
        "tam_kelime": kelime, "gorsel_emoji": emoji, "soru_tipi": "harf_tamamlama",
    })

# ---- 2) Kelime <-> görsel eşleştirme ----
for kelime, emoji, tema in KELIME_HAVUZU:
    sorular.append({
        "id": id_uret(), "ders": "İngilizce", "sinif": 2,
        "kazanim": "EN.2.2 Kelime-görsel eşleştirme (genişletilmiş kelime havuzu)",
        "seviye": 3, "oyun_tipi": "eslestirme", "soru_metni": kelime,
        "soru_gorseli": None, "ses_dosyasi": None, "secenekler": None,
        "dogru_cevap": emoji, "ipucu": None, "zorluk_puani": 2,
        "tam_kelime": kelime, "gorsel_emoji": emoji, "soru_tipi": "eslestirme",
    })

# ---- 3) Alfabetik sıra - 2 harf atlamalı (1. sınıf: 1 harf atlamalı) ----
for i in range(len(TURKISH_ALFABE) - 4):
    a, mid, b = TURKISH_ALFABE[i], TURKISH_ALFABE[i + 2], TURKISH_ALFABE[i + 4]
    sorular.append({
        "id": id_uret(), "ders": "İngilizce", "sinif": 2,
        "kazanim": "EN.2.3 Alfabetik sırayı bilir, iki harf atlayarak sıralar",
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
        "ders": "İngilizce", "sinif": 2,
        "kaynak_not": "EN.2.x kodları temsilidir, resmi kod ile değiştirilmeli. "
                       "1. sınıf 'erken tanışma' amaçlıydı, 2. sınıf müfredatın asıl "
                       "başlangıcı - kelime dağarcığı genişletildi + yeni bir kategori "
                       "(renkler) eklendi. 1. sınıf şemasıyla birebir uyumlu.",
        "toplam_soru": len(sorular),
        "temalar": sorted(set(t for _, _, t in KELIME_HAVUZU)),
    },
    "sorular": sorular,
}

with open("src/data/ingilizce-2-sinif.json", "w", encoding="utf-8") as f:
    json.dump(cikti, f, ensure_ascii=False, indent=2)

print(f"Yazıldı: {len(sorular)} soru")
