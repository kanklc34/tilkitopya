"""
2. sınıf Matematik soru bankası üretici.
1. sınıf bankasıyla (matematik-1-sinif.json) AYNI ŞEMAYI kullanır - bilinçli
olarak: PratikModuMatematik.jsx bu şemayı bekliyor, şema değişirse oyun
kodu da değişmeli. Üretilen JSON src/data/matematik-2-sinif.json'a yazılır.

Kapsam (devir teslim dokümanındaki yol haritasından):
- 100'e kadar sayılar (sıralama, basamak değeri)
- elden yürütmeli toplama/çıkarma (100'e kadar)
- saat okuma (tam ve yarım saat)
- para
- basit çarpma (eşit gruplama kavramı)

Seviye ilerlemesi (Pratik Modu'nun ustalık sistemiyle uyumlu, 1. sınıftaki
concreteness-fading mantığının devamı):
  Seviye 1: sayı sıralama + elde olmadan toplama + onluk bozmadan çıkarma
  Seviye 2: elde var toplama + onluk bozarak çıkarma + saat okuma
  Seviye 3: para + çarpma (gruplama)
"""
import json
import random

random.seed(42)

THEMES = [
    {"ad": "hayvanlar", "emoji": "🐦", "nesne": "kuş",
     "add": "{a} kuş vardı, {b} kuş daha geldi.", "sub": "{a} kuş vardı, {b} kuş uçtu gitti."},
    {"ad": "doga", "emoji": "🌸", "nesne": "çiçek",
     "add": "{a} çiçek vardı, {b} çiçek daha açtı.", "sub": "{a} çiçek vardı, {b} tanesi soldu."},
    {"ad": "oyuncaklar", "emoji": "🎈", "nesne": "balon",
     "add": "{a} balon vardı, {b} balon daha eklendi.", "sub": "{a} balon vardı, {b} tanesi uçtu."},
    {"ad": "ev_aile", "emoji": "🏠", "nesne": "misafir",
     "add": "Evde {a} misafir vardı, {b} misafir daha geldi.", "sub": "Evde {a} misafir vardı, {b} misafir ayrıldı."},
    {"ad": "yiyecek", "emoji": "🍎", "nesne": "elma",
     "add": "{a} elma vardı, {b} elma daha kondu.", "sub": "{a} elma vardı, {b} elma yendi."},
    {"ad": "okul", "emoji": "📖", "nesne": "kitap",
     "add": "{a} kitap vardı, {b} kitap daha kondu.", "sub": "{a} kitap vardı, {b} kitap ödünç verildi."},
]

sorular = []
sayac = 1


def id_uret():
    global sayac
    s = f"MAT-2-{sayac:04d}"
    sayac += 1
    return s


def secenek_uret(dogru, delta_havuzu, min_v=0, max_v=999):
    secenekler = {dogru}
    denemeler = 0
    while len(secenekler) < 3 and denemeler < 50:
        delta = random.choice(delta_havuzu)
        aday = dogru + delta
        if min_v <= aday <= max_v and aday not in secenekler:
            secenekler.add(aday)
        denemeler += 1
    while len(secenekler) < 3:
        aday = random.randint(min_v, max_v)
        secenekler.add(aday)
    secenekler = list(secenekler)
    random.shuffle(secenekler)
    return secenekler


# ---- 1) Sayı sıralama (100'e kadar) — seviye 1 ----
KAZANIM_SIRA = "M.2.1.1 Sayıları okur, yazar, sıralar (100'e kadar)"
for _ in range(18):
    tip = random.choice(["ileri1", "geri1", "onluk", "arada", "basamak"])
    if tip == "ileri1":
        baslangic = random.randint(1, 97)
        soru_metni = f"{baslangic} → {baslangic+1} → ?"
        dogru = baslangic + 2
        secenekler = secenek_uret(dogru, [-1, 1, 2, -2], 1, 100)
        ipucu = "Bir ileri say"
    elif tip == "geri1":
        baslangic = random.randint(4, 100)
        soru_metni = f"{baslangic} → {baslangic-1} → ?"
        dogru = baslangic - 2
        secenekler = secenek_uret(dogru, [-1, 1, 2, -2], 0, 100)
        ipucu = "Bir geri say"
    elif tip == "onluk":
        baslangic = random.choice([10, 20, 30, 40, 50, 60, 70, 80])
        soru_metni = f"{baslangic} → {baslangic+10} → ?"
        dogru = baslangic + 20
        secenekler = secenek_uret(dogru, [-10, 10, -5, 5], 0, 100)
        ipucu = "Onarlı ilerle: 10, 20, 30..."
    elif tip == "arada":
        alt = random.randint(1, 96)
        soru_metni = f"{alt} → ? → {alt+2}"
        dogru = alt + 1
        secenekler = secenek_uret(dogru, [-1, 1, 2, -2], 0, 100)
        ipucu = "İkisinin ortasındaki sayıyı bul"
    else:  # basamak
        onlar = random.randint(1, 9)
        birler = random.randint(0, 9)
        sayi = onlar * 10 + birler
        hangi = random.choice(["onlar", "birler"])
        if hangi == "onlar":
            soru_metni = f"{sayi} sayısında onlar basamağındaki rakam kaçtır?"
            dogru = onlar
            secenekler = secenek_uret(dogru, [-1, 1, -2, 2], 0, 9)
        else:
            soru_metni = f"{sayi} sayısında birler basamağındaki rakam kaçtır?"
            dogru = birler
            secenekler = secenek_uret(dogru, [-1, 1, -2, 2], 0, 9)
        ipucu = "Sayıyı onlar ve birler olarak ayır"

    sorular.append({
        "id": id_uret(), "ders": "Matematik", "sinif": 2, "kazanim": KAZANIM_SIRA,
        "seviye": 1, "oyun_tipi": "bosluk_doldurma", "soru_tipi": "sira",
        "tema": None, "tema_emoji": None, "baglam_metni": None,
        "soru_metni": soru_metni, "soru_gorseli": None, "ses_dosyasi": None,
        "secenekler": secenekler, "dogru_cevap": dogru, "ipucu": ipucu, "zorluk_puani": 1,
    })


# ---- 2) Toplama — elde olmadan (seviye 1) ve elde var (seviye 2) ----
def toplama_uret(elde_var, adet):
    kazanim = ("M.2.1.2 Toplama işlemi yapar (elde var, 100'e kadar)" if elde_var
               else "M.2.1.2 Toplama işlemi yapar (elde olmadan, 100'e kadar)")
    seviye = 2 if elde_var else 1
    for _ in range(adet):
        while True:
            a = random.randint(10, 89)
            b = random.randint(1, 99 - a)
            birler_toplam = (a % 10) + (b % 10)
            if elde_var and birler_toplam >= 10:
                break
            if not elde_var and birler_toplam < 10:
                break
        dogru = a + b
        theme = random.choice(THEMES)
        baglam = theme["add"].format(a=a, b=b)
        secenekler = secenek_uret(dogru, [-10, 10, -1, 1, -9, 9], 0, 199)
        sorular.append({
            "id": id_uret(), "ders": "Matematik", "sinif": 2, "kazanim": kazanim,
            "seviye": seviye, "oyun_tipi": "arac_yarisi", "soru_tipi": "denklem",
            "tema": theme["ad"], "tema_emoji": theme["emoji"], "baglam_metni": baglam,
            "soru_metni": f"{a} + {b} = ?", "soru_gorseli": None, "ses_dosyasi": None,
            "secenekler": secenekler, "dogru_cevap": dogru,
            "ipucu": "Önce onlukları, sonra birlikleri topla" if elde_var else "Onlukları ve birlikleri ayrı ayrı topla",
            "zorluk_puani": 2 if elde_var else 1,
        })


toplama_uret(elde_var=False, adet=16)
toplama_uret(elde_var=True, adet=16)


# ---- 3) Çıkarma — onluk bozmadan (seviye 1) ve onluk bozarak (seviye 2) ----
def cikarma_uret(bozarak, adet):
    kazanim = ("M.2.1.3 Çıkarma işlemi yapar (onluk bozarak, 100'e kadar)" if bozarak
               else "M.2.1.3 Çıkarma işlemi yapar (onluk bozmadan, 100'e kadar)")
    seviye = 2 if bozarak else 1
    for _ in range(adet):
        while True:
            a = random.randint(11, 99)
            b = random.randint(1, a - 1)
            birler_a, birler_b = a % 10, b % 10
            gerekli_bozma = birler_a < birler_b
            if bozarak and gerekli_bozma:
                break
            if not bozarak and not gerekli_bozma:
                break
        dogru = a - b
        theme = random.choice(THEMES)
        baglam = theme["sub"].format(a=a, b=b)
        secenekler = secenek_uret(dogru, [-10, 10, -1, 1, -9, 9], 0, 99)
        sorular.append({
            "id": id_uret(), "ders": "Matematik", "sinif": 2, "kazanim": kazanim,
            "seviye": seviye, "oyun_tipi": "arac_yarisi", "soru_tipi": "denklem",
            "tema": theme["ad"], "tema_emoji": theme["emoji"], "baglam_metni": baglam,
            "soru_metni": f"{a} - {b} = ?", "soru_gorseli": None, "ses_dosyasi": None,
            "secenekler": secenekler, "dogru_cevap": dogru,
            "ipucu": "Bir onluğu bozup birlik olarak kullan" if bozarak else "Onlukları ve birlikleri ayrı ayrı çıkar",
            "zorluk_puani": 2 if bozarak else 1,
        })


cikarma_uret(bozarak=False, adet=16)
cikarma_uret(bozarak=True, adet=16)


# ---- 4) Saat okuma (tam ve yarım saat) — seviye 2 ----
KAZANIM_SAAT = "M.2.2.1 Saati okur (tam ve yarım saat)"
GUN_ICI_OLAYLARI = [
    ("okula gidiyor", "🎒"), ("kahvaltı ediyor", "🥣"), ("uyanıyor", "☀️"),
    ("ödevini yapıyor", "📚"), ("oyun oynuyor", "⚽"), ("yemek yiyor", "🍽️"),
    ("uyumaya gidiyor", "🌙"), ("parka gidiyor", "🌳"),
]
for _ in range(16):
    saat = random.randint(1, 12)
    yarim_mi = random.random() < 0.5
    olay, emoji = random.choice(GUN_ICI_OLAYLARI)
    if yarim_mi:
        gosterilen = f"{saat}:30"
        sonraki = (saat % 12) + 1
        soru_metni = f"Akrep {saat} ile {sonraki} arasında, yelkovan 6'yı gösteriyor. Saat kaçtır?"
        dogru_str = gosterilen
        yanlis1 = f"{saat}:00"
        yanlis2 = f"{sonraki}:00"
    else:
        gosterilen = f"{saat}:00"
        soru_metni = f"Akrep {saat} rakamının üzerinde, yelkovan 12'yi gösteriyor. Saat kaçtır?"
        dogru_str = gosterilen
        yanlis1 = f"{saat}:30"
        yanlis2 = f"{(saat % 12) + 1}:00"
    secenekler = list({dogru_str, yanlis1, yanlis2})
    while len(secenekler) < 3:
        ekstra = f"{random.randint(1,12)}:{'30' if random.random()<0.5 else '00'}"
        if ekstra not in secenekler:
            secenekler.append(ekstra)
    random.shuffle(secenekler)
    sorular.append({
        "id": id_uret(), "ders": "Matematik", "sinif": 2, "kazanim": KAZANIM_SAAT,
        "seviye": 2, "oyun_tipi": "bosluk_doldurma", "soru_tipi": "saat",
        "tema": "gunluk_yasam", "tema_emoji": emoji,
        "baglam_metni": f"Ali saat {gosterilen}'de {olay}.",
        "soru_metni": soru_metni, "soru_gorseli": None, "ses_dosyasi": None,
        "secenekler": secenekler, "dogru_cevap": dogru_str,
        "ipucu": "Yelkovan 12'deyse tam saat, 6'daysa buçuktur", "zorluk_puani": 2,
    })


# ---- 5) Para (tanıma, toplama, karşılaştırma) — seviye 3 ----
KAZANIM_PARA = "M.2.2.2 Parayı tanır, değerlerini karşılaştırır"
PARA_BIRIMLERI = [1, 5, 10, 20, 50, 100]
for _ in range(14):
    tip = random.choice(["toplam", "karsilastirma", "ustu"])
    if tip == "toplam":
        adet = random.randint(2, 3)
        secilenler = [random.choice(PARA_BIRIMLERI) for _ in range(adet)]
        dogru = sum(secilenler)
        kupurler = " + ".join(f"{v} TL" for v in secilenler)
        soru_metni = f"Cebinde {kupurler} var. Toplam kaç TL'n var?"
        secenekler = secenek_uret(dogru, [-10, 10, -5, 5, -1, 1], 0, 300)
        ipucu = "Kağıt paraları sırayla topla"
    elif tip == "karsilastirma":
        a = random.choice(PARA_BIRIMLERI)
        b = random.choice([v for v in PARA_BIRIMLERI if v != a])
        buyuk = max(a, b)
        soru_metni = f"{a} TL mi daha değerli, {b} TL mi?"
        dogru = buyuk
        secenekler = [a, b, min(a, b) if min(a,b) not in (a,b) else a]
        secenekler = list({a, b})
        while len(secenekler) < 3:
            aday = random.choice(PARA_BIRIMLERI)
            if aday not in secenekler:
                secenekler.append(aday)
        random.shuffle(secenekler)
        ipucu = "Büyük sayı, daha değerli parayı gösterir"
    else:  # ustu (para üstü hesaplama)
        urun_fiyati = random.choice([5, 10, 15, 20, 25, 30, 40])
        odenen = random.choice([v for v in PARA_BIRIMLERI if v > urun_fiyati])
        dogru = odenen - urun_fiyati
        soru_metni = f"{urun_fiyati} TL'lik bir oyuncak için {odenen} TL verdin. Kaç TL para üstü alırsın?"
        secenekler = secenek_uret(dogru, [-10, 10, -5, 5, -1, 1], 0, 100)
        ipucu = "Verdiğin paradan ürünün fiyatını çıkar"

    theme = random.choice(THEMES)
    sorular.append({
        "id": id_uret(), "ders": "Matematik", "sinif": 2, "kazanim": KAZANIM_PARA,
        "seviye": 3, "oyun_tipi": "arac_yarisi", "soru_tipi": "para",
        "tema": "para", "tema_emoji": "💰", "baglam_metni": None,
        "soru_metni": soru_metni, "soru_gorseli": None, "ses_dosyasi": None,
        "secenekler": secenekler, "dogru_cevap": dogru, "ipucu": ipucu, "zorluk_puani": 3,
    })


# ---- 6) Çarpma — eşit gruplama / tekrarlı toplama — seviye 3 ----
KAZANIM_CARPMA = "M.2.3.1 Çarpma kavramı (eşit gruplama, tekrarlı toplama)"
CARPMA_NESNELERI = [
    ("kutuda", "elma", "🍎"), ("sepette", "portakal", "🍊"), ("tabakta", "kurabiye", "🍪"),
    ("kavanozda", "bilye", "🔵"), ("çiçekte", "yaprak", "🍃"), ("sırada", "sıra", "🪑"),
]
for _ in range(14):
    grup = random.randint(2, 5)
    grup_basina = random.randint(2, 5)
    dogru = grup * grup_basina
    yer, nesne, emoji = random.choice(CARPMA_NESNELERI)
    soru_metni = f"{grup} {yer} {grup_basina}'er {nesne} var. Toplam kaç {nesne} vardır?"
    tekrarli_toplam = " + ".join([str(grup_basina)] * grup)
    secenekler = secenek_uret(dogru, [-grup_basina, grup_basina, -grup, grup, -1, 1], 0, 30)
    sorular.append({
        "id": id_uret(), "ders": "Matematik", "sinif": 2, "kazanim": KAZANIM_CARPMA,
        "seviye": 3, "oyun_tipi": "arac_yarisi", "soru_tipi": "denklem",
        "tema": "gruplama", "tema_emoji": emoji,
        "baglam_metni": f"{grup} x {grup_basina} = {tekrarli_toplam} = ?",
        "soru_metni": soru_metni, "soru_gorseli": None, "ses_dosyasi": None,
        "secenekler": secenekler, "dogru_cevap": dogru,
        "ipucu": f"{grup_basina}'i {grup} kere topla", "zorluk_puani": 3,
    })


# ---- Doğrulama ----
for s in sorular:
    assert s["dogru_cevap"] in s["secenekler"], s
    assert len(set(s["secenekler"])) == len(s["secenekler"]), s
    assert len(s["secenekler"]) == 3, s

cikti = {
    "meta": {
        "ders": "Matematik",
        "sinif": 2,
        "kaynak_not": "MEB Türkiye Yüzyılı Maarif Modeli esas alınmıştır. Concreteness fading 1. sınıftan devam eder: Seviye 1 somut/bağlamsal (sıralama, elde olmadan işlem), Seviye 2 yarı-soyut (elde var, onluk bozma, saat), Seviye 3 gerçek hayat uygulaması (para, çarpma).",
        "toplam_soru": len(sorular),
        "temalar": [t["ad"] for t in THEMES] + ["gunluk_yasam", "para", "gruplama"],
    },
    "sorular": sorular,
}

with open("src/data/matematik-2-sinif.json", "w", encoding="utf-8") as f:
    json.dump(cikti, f, ensure_ascii=False, indent=2)

print(f"Yazıldı: {len(sorular)} soru")
