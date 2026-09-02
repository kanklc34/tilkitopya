// Ödül oyunlarının (Boyama Kitabı + Yap Boz) paylaştığı sahne kataloğu.
//
// Her sahne, tek tek "şekil"lerden oluşuyor. Boyama Kitabı'nda her
// "boyanabilir" şekil başlangıçta beyaz/dolgusuz çizim olarak gösterilir,
// çocuk dokunup renklendirir. Yap Boz'da aynı sahne "varsayilanRenk"
// değerleriyle önceden renklendirilmiş haliyle çizilip resme dönüştürülür
// ve parçalara bölünür - böylece iki oyun aynı veriyi, aynı sanat
// üretmeden paylaşıyor (madde 6'daki karar).
//
// Yeni bir sahne eklemek sadece bu diziye bir öğe eklemek demek - kod
// değişikliği gerekmiyor (müfredat veri kararıyla aynı ilke, bkz. madde 11).

export const ODUL_SAHNELERI = [
  {
    id: "tilki-orman",
    ad: "Tilki ve Orman",
    emoji: "🦊",
    viewBox: "0 0 400 400",
    shapes: [
      { id: "gokyuzu", tip: "rect", boyanabilir: true, varsayilanRenk: "#BFE8FB", props: { x: 0, y: 0, width: 400, height: 400 } },
      { id: "bulut1", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { cx: 300, cy: 75, rx: 48, ry: 26 } },
      { id: "gunes", tip: "circle", boyanabilir: true, varsayilanRenk: "#FFD93C", props: { cx: 65, cy: 75, r: 36 } },
      { id: "zemin", tip: "path", boyanabilir: true, varsayilanRenk: "#8FCB6B", props: { d: "M0,300 Q200,258 400,300 L400,400 L0,400 Z" } },
      { id: "agac_govde", tip: "rect", boyanabilir: true, varsayilanRenk: "#B98354", props: { x: 286, y: 220, width: 24, height: 90, rx: 8 } },
      { id: "agac_yaprak1", tip: "circle", boyanabilir: true, varsayilanRenk: "#5FAE4A", props: { cx: 298, cy: 196, r: 52 } },
      { id: "tilki_kuyruk", tip: "path", boyanabilir: true, varsayilanRenk: "#F2924B", props: { d: "M196,320 Q236,302 226,248 Q221,214 196,219 Q214,246 200,284 Q197,306 196,320 Z" } },
      { id: "tilki_siluet", tip: "path", boyanabilir: true, varsayilanRenk: "#F2924B", props: { d: "M96,170 Q100,195 108,218 Q92,240 92,270 Q90,300 92,312 Q90,340 115,356 Q150,368 185,356 Q210,340 208,312 Q210,300 208,270 Q208,240 192,218 Q200,195 204,170 L172,210 Q150,200 128,210 Q112,190 96,170 Z" } },
      { id: "kulak_ici_sol", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FFD9B0", props: { points: "112,206 126,204 100,180" } },
      { id: "kulak_ici_sag", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FFD9B0", props: { points: "188,206 174,204 200,180" } },
      { id: "tilki_karin", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFF6E9", props: { cx: 150, cy: 300, rx: 26, ry: 34 } },
      { id: "goz_sol", tip: "circle", boyanabilir: false, sabitRenk: "#2B2B2B", props: { cx: 134, cy: 236, r: 5 } },
      { id: "goz_sag", tip: "circle", boyanabilir: false, sabitRenk: "#2B2B2B", props: { cx: 166, cy: 236, r: 5 } },
      { id: "burun", tip: "polygon", boyanabilir: false, sabitRenk: "#2B2B2B", props: { points: "150,250 141,260 159,260" } },
    ],
  },
  {
    id: "kelebek-bahce",
    ad: "Kelebek Bahçesi",
    emoji: "🦋",
    viewBox: "0 0 400 400",
    shapes: [
      { id: "gokyuzu", tip: "rect", boyanabilir: true, varsayilanRenk: "#FDF3E7", props: { x: 0, y: 0, width: 400, height: 400 } },
      { id: "gunes", tip: "circle", boyanabilir: true, varsayilanRenk: "#FFD93C", props: { cx: 330, cy: 65, r: 34 } },
      { id: "zemin", tip: "path", boyanabilir: true, varsayilanRenk: "#A9DE8C", props: { d: "M0,320 Q200,288 400,320 L400,400 L0,400 Z" } },
      { id: "kelebek_kanat_sol", tip: "path", boyanabilir: true, varsayilanRenk: "#FF9F5A", props: { d: "M200,120 Q140,90 100,120 Q68,145 75,185 Q70,225 100,255 Q135,285 175,255 Q205,225 205,180 Q208,145 200,120 Z" } },
      { id: "kelebek_kanat_sag", tip: "path", boyanabilir: true, varsayilanRenk: "#5AB4E0", props: { d: "M200,120 Q260,90 300,120 Q332,145 325,185 Q330,225 300,255 Q265,285 225,255 Q195,225 195,180 Q192,145 200,120 Z" } },
      { id: "kelebek_kanat_nokta_sol", tip: "circle", boyanabilir: false, sabitRenk: "#FFFFFF", props: { cx: 140, cy: 175, r: 12 } },
      { id: "kelebek_kanat_nokta_sag", tip: "circle", boyanabilir: false, sabitRenk: "#FFFFFF", props: { cx: 260, cy: 175, r: 12 } },
      { id: "kelebek_govde", tip: "rect", boyanabilir: false, sabitRenk: "#2B2B2B", props: { x: 194, y: 130, width: 12, height: 90, rx: 6 } },
      { id: "kelebek_anten", tip: "path", boyanabilir: false, doluDegil: true, sabitRenk: "#2B2B2B", props: { d: "M198,132 Q184,105 172,92 M202,132 Q216,105 228,92" } },
      { id: "cicek_sap", tip: "rect", boyanabilir: true, varsayilanRenk: "#4F9A4A", props: { x: 90, y: 300, width: 8, height: 70, rx: 4 } },
      { id: "cicek_tac", tip: "circle", boyanabilir: true, varsayilanRenk: "#FF6FA0", props: { cx: 94, cy: 290, r: 26 } },
    ],
  },
  {
    id: "uzay-roket",
    ad: "Uzay Macerası",
    emoji: "🚀",
    viewBox: "0 0 400 400",
    shapes: [
      { id: "uzay_arkaplan", tip: "rect", boyanabilir: true, varsayilanRenk: "#1F2E45", props: { x: 0, y: 0, width: 400, height: 400 } },
      { id: "yildiz1", tip: "circle", boyanabilir: false, sabitRenk: "#FFFFFF", props: { cx: 100, cy: 60, r: 4 } },
      { id: "yildiz2", tip: "circle", boyanabilir: false, sabitRenk: "#FFFFFF", props: { cx: 320, cy: 280, r: 4 } },
      { id: "gezegen_halka", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFC93C", props: { cx: 310, cy: 95, rx: 64, ry: 17 } },
      { id: "gezegen", tip: "circle", boyanabilir: true, varsayilanRenk: "#B497D6", props: { cx: 310, cy: 95, r: 40 } },
      { id: "ay", tip: "circle", boyanabilir: true, varsayilanRenk: "#E7ECF2", props: { cx: 68, cy: 115, r: 32 } },
      { id: "zemin_ay_yuzeyi", tip: "path", boyanabilir: true, varsayilanRenk: "#8892A6", props: { d: "M0,370 Q200,338 400,370 L400,400 L0,400 Z" } },
      { id: "roket_siluet", tip: "path", boyanabilir: true, varsayilanRenk: "#E4E9F0", props: { d: "M200,135 Q225,175 218,220 Q222,260 238,300 L272,338 L232,322 Q222,340 200,344 Q178,340 168,322 L128,338 L162,300 Q178,260 182,220 Q175,175 200,135 Z" } },
      { id: "roket_pencere", tip: "circle", boyanabilir: true, varsayilanRenk: "#5AB4E0", props: { cx: 200, cy: 218, r: 22 } },
      { id: "roket_alev1", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FFD93C", props: { points: "178,326 200,378 200,326" } },
      { id: "roket_alev2", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FF9F5A", props: { points: "200,326 222,326 200,378" } },
    ],
  },
  {
    id: "araba-yaris",
    ad: "Yarış Arabası",
    emoji: "🏎️",
    viewBox: "0 0 400 400",
    shapes: [
      { id: "gokyuzu", tip: "rect", boyanabilir: true, varsayilanRenk: "#BFE8FB", props: { x: 0, y: 0, width: 400, height: 400 } },
      { id: "gunes", tip: "circle", boyanabilir: true, varsayilanRenk: "#FFD93C", props: { cx: 340, cy: 60, r: 36 } },
      { id: "yol", tip: "path", boyanabilir: true, varsayilanRenk: "#8892A6", props: { d: "M0,300 Q200,290 400,300 L400,400 L0,400 Z" } },
      { id: "araba_siluet", tip: "path", boyanabilir: true, varsayilanRenk: "#FF6F5A", props: { d: "M60,300 Q60,260 90,255 L140,255 Q158,195 205,195 Q252,195 270,255 L330,255 Q340,260 340,300 L60,300 Z" } },
      { id: "araba_cam", tip: "polygon", boyanabilir: true, varsayilanRenk: "#7EC8E3", props: { points: "155,250 193,205 217,205 255,250" } },
      { id: "yaris_seridi", tip: "rect", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { x: 60, y: 278, width: 280, height: 18, rx: 4 } },
      { id: "far_on", tip: "circle", boyanabilir: true, varsayilanRenk: "#FFD93C", props: { cx: 322, cy: 248, r: 11 } },
      { id: "tekerlek_on_dis", tip: "circle", boyanabilir: false, sabitRenk: "#2B2B2B", props: { cx: 128, cy: 304, r: 36 } },
      { id: "tekerlek_on_jant", tip: "circle", boyanabilir: true, varsayilanRenk: "#C7CEDA", props: { cx: 128, cy: 304, r: 17 } },
      { id: "tekerlek_arka_dis", tip: "circle", boyanabilir: false, sabitRenk: "#2B2B2B", props: { cx: 272, cy: 304, r: 36 } },
      { id: "tekerlek_arka_jant", tip: "circle", boyanabilir: true, varsayilanRenk: "#C7CEDA", props: { cx: 272, cy: 304, r: 17 } },
    ],
  },
  {
    // Genel bir "prenses" arketipi (taç, elbise, kale) - herhangi bir isimli/
    // lisanslı karaktere (belirli bir Disney prensesi, Barbie vb.) atıfta
    // bulunmuyor, bilinçli olarak öyle tasarlandı (telif riski).
    // Saç BİLİNÇLİ olarak baştan daha büyük bir "hale" (ellipse) olarak
    // tasarlandı ve baştan/elbiseden ÖNCE çiziliyor - böylece yüzün etrafında
    // ve omuzlara kadar akan, gözden kaçmayacak kadar büyük bir saç
    // görünümü oluşuyor (önceki ince saç şekli "kel" gibi okunuyordu).
    id: "prenses-kale",
    ad: "Prenses ve Kale",
    emoji: "👑",
    viewBox: "0 0 400 400",
    shapes: [
      { id: "gokyuzu", tip: "rect", boyanabilir: true, varsayilanRenk: "#FDEEF6", props: { x: 0, y: 0, width: 400, height: 400 } },
      { id: "gunes", tip: "circle", boyanabilir: true, varsayilanRenk: "#FFD93C", props: { cx: 60, cy: 70, r: 32 } },
      { id: "kale_govde", tip: "rect", boyanabilir: true, varsayilanRenk: "#E7ECF2", props: { x: 278, y: 195, width: 95, height: 115, rx: 6 } },
      { id: "kale_capak", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FF6FA0", props: { points: "278,195 325,125 373,195" } },
      { id: "kale_bayrak", tip: "polygon", boyanabilir: true, varsayilanRenk: "#5AB4E0", props: { points: "323,125 323,102 342,113" } },
      { id: "zemin", tip: "path", boyanabilir: true, varsayilanRenk: "#A9DE8C", props: { d: "M0,330 Q200,312 400,330 L400,400 L0,400 Z" } },
      { id: "prenses_sac", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#B98354", props: { cx: 200, cy: 205, rx: 72, ry: 92 } },
      { id: "prenses_elbise", tip: "path", boyanabilir: true, varsayilanRenk: "#B497D6", props: { d: "M182,203 L218,203 Q222,225 220,242 Q265,255 265,388 L135,388 Q135,255 180,242 Q178,225 182,203 Z" } },
      { id: "prenses_kusak", tip: "rect", boyanabilir: false, sabitRenk: "#FF6FA0", props: { x: 178, y: 240, width: 44, height: 8, rx: 4 } },
      { id: "prenses_kafa", tip: "circle", boyanabilir: true, varsayilanRenk: "#FFD9B0", props: { cx: 200, cy: 172, r: 38 } },
      { id: "prenses_tac", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FFD93C", props: { points: "168,138 180,108 194,136 200,98 206,136 220,108 232,138" } },
      { id: "goz_sol", tip: "circle", boyanabilir: false, sabitRenk: "#2B2B2B", props: { cx: 188, cy: 175, r: 5 } },
      { id: "goz_sag", tip: "circle", boyanabilir: false, sabitRenk: "#2B2B2B", props: { cx: 212, cy: 175, r: 5 } },
      { id: "agiz", tip: "path", boyanabilir: false, doluDegil: true, sabitRenk: "#2B2B2B", props: { d: "M188,192 Q200,200 212,192" } },
    ],
  },
];

// Boyama Kitabı'nda çocuğa sunulan renk paleti (nötr, canlı, geniş bir yelpaze).
export const BOYAMA_PALETI = [
  "#FF6F5A", "#FF9F5A", "#FFD93C", "#8FCB6B", "#5FAE4A",
  "#5AB4E0", "#7EC8E3", "#B497D6", "#FF6FA0", "#FFD9B0",
  "#B98354", "#8892A6", "#C7CEDA", "#1F2E45", "#FFFFFF",
];

// Bir sahnenin belirli bir renk haritasıyla (id -> renk) SVG dış hatlarını
// oluşturan ortak yardımcı - hem <svg> render'ında hem de Yap Boz'un
// canvas'a çizim yaparken kullandığı path/shape üretiminde kullanılıyor.
export function sahneVarsayilanRenkleri(sahne) {
  const renkler = {};
  sahne.shapes.forEach((s) => {
    renkler[s.id] = s.boyanabilir ? s.varsayilanRenk : s.sabitRenk;
  });
  return renkler;
}

function ozniteliklerDizesi(props) {
  return Object.entries(props)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");
}

// Bir sahneyi, verilen renk haritasıyla ham bir SVG metnine (string)
// dönüştürür. Yap Boz bunu bir <img>/<canvas> üzerinden rasterize edip
// bulmaca parçalarına bölmek için kullanıyor - Boyama Kitabı'ndaki gibi
// tıklanabilir React elemanlarına ihtiyaç yok, tek parça bir "resim" yeterli.
export function sahneSvgMetni(sahne, renkler) {
  const parcalar = sahne.shapes.map((s) => {
    const renk = renkler[s.id] ?? (s.boyanabilir ? "#FFFFFF" : s.sabitRenk);
    const ortakStil = s.doluDegil
      ? `fill="none" stroke="${s.sabitRenk}" stroke-width="4" stroke-linecap="round"`
      : `fill="${renk}" stroke="#33404F" stroke-width="3"`;
    const etiket = { rect: "rect", circle: "circle", ellipse: "ellipse", polygon: "polygon", path: "path" }[s.tip];
    return `<${etiket} ${ozniteliklerDizesi(s.props)} ${ortakStil} />`;
  });
  const [, , w, h] = sahne.viewBox.split(" ");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${sahne.viewBox}" width="${w}" height="${h}">${parcalar.join("")}</svg>`;
}
