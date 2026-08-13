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
      { id: "gunes", tip: "circle", boyanabilir: true, varsayilanRenk: "#FFD93C", props: { cx: 70, cy: 70, r: 38 } },
      { id: "bulut1", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { cx: 300, cy: 82, rx: 42, ry: 24 } },
      { id: "bulut2", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { cx: 332, cy: 98, rx: 28, ry: 19 } },
      { id: "zemin", tip: "path", boyanabilir: true, varsayilanRenk: "#8FCB6B", props: { d: "M0,300 Q200,258 400,300 L400,400 L0,400 Z" } },
      { id: "agac_govde", tip: "rect", boyanabilir: true, varsayilanRenk: "#B98354", props: { x: 250, y: 228, width: 18, height: 74, rx: 6 } },
      { id: "agac_yaprak1", tip: "circle", boyanabilir: true, varsayilanRenk: "#5FAE4A", props: { cx: 259, cy: 208, r: 40 } },
      { id: "agac_yaprak2", tip: "circle", boyanabilir: true, varsayilanRenk: "#6FBE5A", props: { cx: 226, cy: 232, r: 28 } },
      { id: "tilki_kuyruk", tip: "path", boyanabilir: true, varsayilanRenk: "#F2924B", props: { d: "M205,320 Q262,302 252,248 Q247,216 213,224 Q236,254 220,292 Q214,310 205,320 Z" } },
      { id: "tilki_kuyruk_ucu", tip: "circle", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { cx: 223, cy: 233, r: 15 } },
      { id: "tilki_govde", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#F2924B", props: { cx: 160, cy: 312, rx: 55, ry: 42 } },
      { id: "tilki_kulak_sol", tip: "polygon", boyanabilir: true, varsayilanRenk: "#F2924B", props: { points: "104,224 93,188 126,214" } },
      { id: "tilki_kulak_sag", tip: "polygon", boyanabilir: true, varsayilanRenk: "#F2924B", props: { points: "166,214 182,183 176,230" } },
      { id: "tilki_kafa", tip: "circle", boyanabilir: true, varsayilanRenk: "#F2924B", props: { cx: 140, cy: 250, r: 38 } },
      { id: "tilki_karin", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFF6E9", props: { cx: 150, cy: 272, rx: 19, ry: 25 } },
      { id: "goz_sol", tip: "circle", boyanabilir: false, sabitRenk: "#2B2B2B", props: { cx: 128, cy: 245, r: 4 } },
      { id: "goz_sag", tip: "circle", boyanabilir: false, sabitRenk: "#2B2B2B", props: { cx: 153, cy: 245, r: 4 } },
      { id: "burun", tip: "polygon", boyanabilir: false, sabitRenk: "#2B2B2B", props: { points: "140,258 133,266 147,266" } },
    ],
  },
  {
    id: "kelebek-bahce",
    ad: "Kelebek Bahçesi",
    emoji: "🦋",
    viewBox: "0 0 400 400",
    shapes: [
      { id: "gokyuzu", tip: "rect", boyanabilir: true, varsayilanRenk: "#FDF3E7", props: { x: 0, y: 0, width: 400, height: 400 } },
      { id: "gunes", tip: "circle", boyanabilir: true, varsayilanRenk: "#FFD93C", props: { cx: 340, cy: 60, r: 30 } },
      { id: "zemin", tip: "path", boyanabilir: true, varsayilanRenk: "#A9DE8C", props: { d: "M0,320 Q200,288 400,320 L400,400 L0,400 Z" } },
      { id: "cicek1_sap", tip: "rect", boyanabilir: true, varsayilanRenk: "#4F9A4A", props: { x: 90, y: 250, width: 6, height: 72, rx: 3 } },
      { id: "cicek1_tac", tip: "circle", boyanabilir: true, varsayilanRenk: "#FF6FA0", props: { cx: 93, cy: 244, r: 22 } },
      { id: "cicek1_merkez", tip: "circle", boyanabilir: false, sabitRenk: "#FFD93C", props: { cx: 93, cy: 244, r: 8 } },
      { id: "cicek2_sap", tip: "rect", boyanabilir: true, varsayilanRenk: "#4F9A4A", props: { x: 290, y: 262, width: 6, height: 60, rx: 3 } },
      { id: "cicek2_tac", tip: "circle", boyanabilir: true, varsayilanRenk: "#B497D6", props: { cx: 293, cy: 256, r: 20 } },
      { id: "cicek2_merkez", tip: "circle", boyanabilir: false, sabitRenk: "#FFD93C", props: { cx: 293, cy: 256, r: 7 } },
      { id: "cim_tuft1", tip: "polygon", boyanabilir: true, varsayilanRenk: "#7BC968", props: { points: "150,320 158,268 166,320" } },
      { id: "cim_tuft2", tip: "polygon", boyanabilir: true, varsayilanRenk: "#7BC968", props: { points: "230,320 238,272 246,320" } },
      { id: "kelebek_kanat_sol_ust", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FF9F5A", props: { cx: 175, cy: 150, rx: 32, ry: 24 } },
      { id: "kelebek_kanat_sol_alt", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFC93C", props: { cx: 180, cy: 185, rx: 22, ry: 17 } },
      { id: "kelebek_kanat_sag_ust", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#5AB4E0", props: { cx: 225, cy: 150, rx: 32, ry: 24 } },
      { id: "kelebek_kanat_sag_alt", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#8FCB6B", props: { cx: 220, cy: 185, rx: 22, ry: 17 } },
      { id: "kelebek_govde", tip: "rect", boyanabilir: false, sabitRenk: "#2B2B2B", props: { x: 196, y: 133, width: 8, height: 62, rx: 4 } },
      { id: "kelebek_anten", tip: "path", boyanabilir: false, doluDegil: true, sabitRenk: "#2B2B2B", props: { d: "M198,138 Q188,118 180,110 M202,138 Q212,118 220,110" } },
    ],
  },
  {
    id: "uzay-roket",
    ad: "Uzay Macerası",
    emoji: "🚀",
    viewBox: "0 0 400 400",
    shapes: [
      { id: "uzay_arkaplan", tip: "rect", boyanabilir: true, varsayilanRenk: "#1F2E45", props: { x: 0, y: 0, width: 400, height: 400 } },
      { id: "gezegen_halka", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFC93C", props: { cx: 320, cy: 90, rx: 55, ry: 14 } },
      { id: "gezegen", tip: "circle", boyanabilir: true, varsayilanRenk: "#B497D6", props: { cx: 320, cy: 90, r: 34 } },
      { id: "ay", tip: "circle", boyanabilir: true, varsayilanRenk: "#E7ECF2", props: { cx: 60, cy: 110, r: 24 } },
      { id: "zemin_ay_yuzeyi", tip: "path", boyanabilir: true, varsayilanRenk: "#8892A6", props: { d: "M0,370 Q200,338 400,370 L400,400 L0,400 Z" } },
      { id: "roket_govde", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#E4E9F0", props: { cx: 200, cy: 250, rx: 34, ry: 70 } },
      { id: "roket_burun", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FF6F5A", props: { points: "200,150 172,200 228,200" } },
      { id: "roket_pencere", tip: "circle", boyanabilir: true, varsayilanRenk: "#5AB4E0", props: { cx: 200, cy: 230, r: 16 } },
      { id: "roket_kanat_sol", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FF6F5A", props: { points: "166,290 130,330 166,320" } },
      { id: "roket_kanat_sag", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FF6F5A", props: { points: "234,290 270,330 234,320" } },
      { id: "roket_alev1", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FFD93C", props: { points: "185,320 200,362 200,320" } },
      { id: "roket_alev2", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FF9F5A", props: { points: "200,320 215,320 200,372" } },
      { id: "yildiz1", tip: "circle", boyanabilir: false, sabitRenk: "#FFFFFF", props: { cx: 110, cy: 60, r: 3 } },
      { id: "yildiz2", tip: "circle", boyanabilir: false, sabitRenk: "#FFFFFF", props: { cx: 150, cy: 200, r: 2.5 } },
      { id: "yildiz3", tip: "circle", boyanabilir: false, sabitRenk: "#FFFFFF", props: { cx: 350, cy: 220, r: 3 } },
      { id: "yildiz4", tip: "circle", boyanabilir: false, sabitRenk: "#FFFFFF", props: { cx: 300, cy: 300, r: 2.5 } },
    ],
  },
];

// Boyama Kitabı'nda çocuğa sunulan renk paleti (nötr, canlı, geniş bir yelpaze).
export const BOYAMA_PALETI = [
  "#FF6F5A", "#FF9F5A", "#FFD93C", "#8FCB6B", "#5FAE4A",
  "#5AB4E0", "#7EC8E3", "#B497D6", "#FF6FA0", "#B98354",
  "#8892A6", "#1F2E45", "#FFFFFF",
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
