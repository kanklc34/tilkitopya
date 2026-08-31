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
      { id: "tilki_kuyruk", tip: "path", boyanabilir: true, varsayilanRenk: "#F2924B", props: { d: "M196,316 Q232,300 224,250 Q220,218 198,222 Q214,248 202,282 Q198,302 196,316 Z" } },
      { id: "tilki_govde", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#F2924B", props: { cx: 150, cy: 312, rx: 58, ry: 46 } },
      { id: "pati_sol", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#F2924B", props: { cx: 120, cy: 350, rx: 16, ry: 10 } },
      { id: "pati_sag", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#F2924B", props: { cx: 180, cy: 352, rx: 16, ry: 10 } },
      { id: "tilki_kulak_sol", tip: "polygon", boyanabilir: true, varsayilanRenk: "#F2924B", props: { points: "110,224 132,219 96,174" } },
      { id: "kulak_ici_sol", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FFD9B0", props: { points: "114,219 129,216 104,186" } },
      { id: "tilki_kulak_sag", tip: "polygon", boyanabilir: true, varsayilanRenk: "#F2924B", props: { points: "190,224 168,219 204,174" } },
      { id: "kulak_ici_sag", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FFD9B0", props: { points: "186,219 171,216 196,186" } },
      { id: "tilki_kafa", tip: "circle", boyanabilir: true, varsayilanRenk: "#F2924B", props: { cx: 150, cy: 246, r: 42 } },
      { id: "tilki_karin", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFF6E9", props: { cx: 150, cy: 270, rx: 22, ry: 28 } },
      { id: "goz_sol", tip: "circle", boyanabilir: false, sabitRenk: "#2B2B2B", props: { cx: 134, cy: 244, r: 5 } },
      { id: "goz_sag", tip: "circle", boyanabilir: false, sabitRenk: "#2B2B2B", props: { cx: 166, cy: 244, r: 5 } },
      { id: "burun", tip: "polygon", boyanabilir: false, sabitRenk: "#2B2B2B", props: { points: "150,258 141,268 159,268" } },
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
      { id: "kelebek_kanat_sol_ust", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FF9F5A", props: { cx: 155, cy: 155, rx: 50, ry: 38 } },
      { id: "kelebek_kanat_sag_ust", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#5AB4E0", props: { cx: 245, cy: 155, rx: 50, ry: 38 } },
      { id: "kelebek_kanat_sol_alt", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFC93C", props: { cx: 165, cy: 205, rx: 36, ry: 28 } },
      { id: "kelebek_kanat_sag_alt", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#8FCB6B", props: { cx: 235, cy: 205, rx: 36, ry: 28 } },
      { id: "kelebek_kanat_nokta_sol", tip: "circle", boyanabilir: false, sabitRenk: "#FFFFFF", props: { cx: 150, cy: 148, r: 8 } },
      { id: "kelebek_kanat_nokta_sag", tip: "circle", boyanabilir: false, sabitRenk: "#FFFFFF", props: { cx: 250, cy: 148, r: 8 } },
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
      { id: "roket_govde", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#E4E9F0", props: { cx: 200, cy: 250, rx: 42, ry: 82 } },
      { id: "roket_burun", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FF6F5A", props: { points: "200,140 166,200 234,200" } },
      { id: "roket_pencere", tip: "circle", boyanabilir: true, varsayilanRenk: "#5AB4E0", props: { cx: 200, cy: 228, r: 20 } },
      { id: "roket_kanat_sol", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FF6F5A", props: { points: "162,296 118,340 162,326" } },
      { id: "roket_kanat_sag", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FF6F5A", props: { points: "238,296 282,340 238,326" } },
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
      { id: "araba_govde", tip: "rect", boyanabilir: true, varsayilanRenk: "#FF6F5A", props: { x: 70, y: 225, width: 260, height: 75, rx: 32 } },
      { id: "araba_kabin", tip: "path", boyanabilir: true, varsayilanRenk: "#FF6F5A", props: { d: "M140,225 Q158,165 205,165 Q252,165 268,225 Z" } },
      { id: "araba_cam", tip: "polygon", boyanabilir: true, varsayilanRenk: "#7EC8E3", props: { points: "155,220 195,180 235,180 258,220" } },
      { id: "yaris_seridi", tip: "rect", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { x: 70, y: 250, width: 260, height: 18, rx: 4 } },
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
      { id: "prenses_elbise", tip: "path", boyanabilir: true, varsayilanRenk: "#B497D6", props: { d: "M135,388 Q135,248 200,238 Q265,248 265,388 Z" } },
      { id: "prenses_elbise_bel", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FF6FA0", props: { points: "172,242 228,242 220,203 180,203" } },
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
