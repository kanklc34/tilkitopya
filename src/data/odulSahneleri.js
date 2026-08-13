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
      { id: "bulut1", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { cx: 300, cy: 82, rx: 42, ry: 24 } },
      { id: "bulut2", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { cx: 332, cy: 98, rx: 28, ry: 19 } },
      { id: "bulut3", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { cx: 120, cy: 34, rx: 22, ry: 13 } },
      { id: "gunes", tip: "circle", boyanabilir: true, varsayilanRenk: "#FFD93C", props: { cx: 60, cy: 78, r: 30 } },
      { id: "kelebek_kucuk_kanat1", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FF9F5A", props: { cx: 288, cy: 178, rx: 10, ry: 7 } },
      { id: "kelebek_kucuk_kanat2", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#5AB4E0", props: { cx: 306, cy: 178, rx: 10, ry: 7 } },
      { id: "kelebek_kucuk_govde", tip: "rect", boyanabilir: false, sabitRenk: "#2B2B2B", props: { x: 296, y: 174, width: 4, height: 10, rx: 2 } },
      { id: "zemin", tip: "path", boyanabilir: true, varsayilanRenk: "#8FCB6B", props: { d: "M0,300 Q200,258 400,300 L400,400 L0,400 Z" } },
      { id: "tas1", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#B8C0CC", props: { cx: 60, cy: 340, rx: 16, ry: 10 } },
      { id: "tas2", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#A6AFBD", props: { cx: 340, cy: 348, rx: 20, ry: 12 } },
      { id: "cicek1_sap", tip: "rect", boyanabilir: true, varsayilanRenk: "#4F9A4A", props: { x: 40, y: 310, width: 4, height: 30, rx: 2 } },
      { id: "cicek1_tac", tip: "circle", boyanabilir: true, varsayilanRenk: "#FF6FA0", props: { cx: 42, cy: 305, r: 10 } },
      { id: "cicek2_sap", tip: "rect", boyanabilir: true, varsayilanRenk: "#4F9A4A", props: { x: 310, y: 320, width: 4, height: 26, rx: 2 } },
      { id: "cicek2_tac", tip: "circle", boyanabilir: true, varsayilanRenk: "#B497D6", props: { cx: 312, cy: 316, r: 9 } },
      { id: "cim_tuft_sol", tip: "polygon", boyanabilir: true, varsayilanRenk: "#7BC968", props: { points: "70,350 76,320 82,350" } },
      { id: "cim_tuft_sag", tip: "polygon", boyanabilir: true, varsayilanRenk: "#7BC968", props: { points: "290,355 296,325 302,355" } },
      { id: "agac_govde", tip: "rect", boyanabilir: true, varsayilanRenk: "#B98354", props: { x: 250, y: 228, width: 18, height: 74, rx: 6 } },
      { id: "agac_yaprak1", tip: "circle", boyanabilir: true, varsayilanRenk: "#5FAE4A", props: { cx: 259, cy: 208, r: 40 } },
      { id: "agac_yaprak2", tip: "circle", boyanabilir: true, varsayilanRenk: "#6FBE5A", props: { cx: 226, cy: 232, r: 28 } },
      { id: "tilki_kuyruk", tip: "path", boyanabilir: true, varsayilanRenk: "#F2924B", props: { d: "M205,320 Q262,302 252,248 Q247,216 213,224 Q236,254 220,292 Q214,310 205,320 Z" } },
      { id: "kuyruk_seridi", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFD9B0", props: { cx: 231, cy: 272, rx: 9, ry: 17 } },
      { id: "tilki_kuyruk_ucu", tip: "circle", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { cx: 223, cy: 233, r: 15 } },
      { id: "tilki_govde", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#F2924B", props: { cx: 160, cy: 312, rx: 55, ry: 42 } },
      { id: "pati_sol", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#F2924B", props: { cx: 130, cy: 347, rx: 14, ry: 9 } },
      { id: "pati_sag", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#F2924B", props: { cx: 172, cy: 349, rx: 14, ry: 9 } },
      { id: "tilki_kulak_sol", tip: "polygon", boyanabilir: true, varsayilanRenk: "#F2924B", props: { points: "104,224 93,188 126,214" } },
      { id: "kulak_ici_sol", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FFD9B0", props: { points: "107,219 100,197 118,213" } },
      { id: "tilki_kulak_sag", tip: "polygon", boyanabilir: true, varsayilanRenk: "#F2924B", props: { points: "166,214 182,183 176,230" } },
      { id: "kulak_ici_sag", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FFD9B0", props: { points: "169,213 179,192 175,222" } },
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
      { id: "bulut1", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { cx: 140, cy: 50, rx: 30, ry: 16 } },
      { id: "gunes", tip: "circle", boyanabilir: true, varsayilanRenk: "#FFD93C", props: { cx: 340, cy: 60, r: 30 } },
      { id: "kelebek2_kanat_sol", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFC93C", props: { cx: 78, cy: 92, rx: 14, ry: 10 } },
      { id: "kelebek2_kanat_sag", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FF9F5A", props: { cx: 100, cy: 92, rx: 14, ry: 10 } },
      { id: "kelebek2_govde", tip: "rect", boyanabilir: false, sabitRenk: "#2B2B2B", props: { x: 87, y: 86, width: 4, height: 14, rx: 2 } },
      { id: "zemin", tip: "path", boyanabilir: true, varsayilanRenk: "#A9DE8C", props: { d: "M0,320 Q200,288 400,320 L400,400 L0,400 Z" } },
      { id: "cim_tuft1", tip: "polygon", boyanabilir: true, varsayilanRenk: "#7BC968", props: { points: "150,320 158,268 166,320" } },
      { id: "cim_tuft2", tip: "polygon", boyanabilir: true, varsayilanRenk: "#7BC968", props: { points: "230,320 238,272 246,320" } },
      { id: "cim_tuft3", tip: "polygon", boyanabilir: true, varsayilanRenk: "#7BC968", props: { points: "20,330 27,290 34,330" } },
      { id: "cicek1_sap", tip: "rect", boyanabilir: true, varsayilanRenk: "#4F9A4A", props: { x: 90, y: 258, width: 6, height: 64, rx: 3 } },
      { id: "cicek1_petal_ust", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FF6FA0", props: { cx: 93, cy: 232, rx: 11, ry: 15 } },
      { id: "cicek1_petal_alt", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FF6FA0", props: { cx: 93, cy: 260, rx: 11, ry: 15 } },
      { id: "cicek1_petal_sol", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FF6FA0", props: { cx: 78, cy: 246, rx: 15, ry: 11 } },
      { id: "cicek1_petal_sag", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FF6FA0", props: { cx: 108, cy: 246, rx: 15, ry: 11 } },
      { id: "cicek1_merkez", tip: "circle", boyanabilir: false, sabitRenk: "#FFD93C", props: { cx: 93, cy: 246, r: 8 } },
      { id: "cicek2_sap", tip: "rect", boyanabilir: true, varsayilanRenk: "#4F9A4A", props: { x: 290, y: 270, width: 6, height: 52, rx: 3 } },
      { id: "cicek2_petal_ust", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#B497D6", props: { cx: 293, cy: 246, rx: 10, ry: 13 } },
      { id: "cicek2_petal_alt", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#B497D6", props: { cx: 293, cy: 270, rx: 10, ry: 13 } },
      { id: "cicek2_petal_sol", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#B497D6", props: { cx: 280, cy: 258, rx: 13, ry: 10 } },
      { id: "cicek2_petal_sag", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#B497D6", props: { cx: 306, cy: 258, rx: 13, ry: 10 } },
      { id: "cicek2_merkez", tip: "circle", boyanabilir: false, sabitRenk: "#FFD93C", props: { cx: 293, cy: 258, r: 7 } },
      { id: "cicek3_sap", tip: "rect", boyanabilir: true, varsayilanRenk: "#4F9A4A", props: { x: 57, y: 278, width: 6, height: 44, rx: 3 } },
      { id: "cicek3_petal_ust", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#5AB4E0", props: { cx: 60, cy: 258, rx: 9, ry: 12 } },
      { id: "cicek3_petal_alt", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#5AB4E0", props: { cx: 60, cy: 280, rx: 9, ry: 12 } },
      { id: "cicek3_petal_sol", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#5AB4E0", props: { cx: 48, cy: 269, rx: 12, ry: 9 } },
      { id: "cicek3_petal_sag", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#5AB4E0", props: { cx: 72, cy: 269, rx: 12, ry: 9 } },
      { id: "cicek3_merkez", tip: "circle", boyanabilir: false, sabitRenk: "#FFD93C", props: { cx: 60, cy: 269, r: 6 } },
      { id: "ugurbocegi_govde", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FF6F5A", props: { cx: 340, cy: 332, rx: 14, ry: 11 } },
      { id: "ugurbocegi_kafa", tip: "circle", boyanabilir: false, sabitRenk: "#2B2B2B", props: { cx: 340, cy: 319, r: 6 } },
      { id: "ugurbocegi_nokta1", tip: "circle", boyanabilir: false, sabitRenk: "#2B2B2B", props: { cx: 334, cy: 328, r: 2.5 } },
      { id: "ugurbocegi_nokta2", tip: "circle", boyanabilir: false, sabitRenk: "#2B2B2B", props: { cx: 346, cy: 334, r: 2.5 } },
      { id: "kelebek_kanat_sol_ust", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FF9F5A", props: { cx: 175, cy: 150, rx: 32, ry: 24 } },
      { id: "kelebek_kanat_sol_alt", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFC93C", props: { cx: 180, cy: 185, rx: 22, ry: 17 } },
      { id: "kelebek_kanat_sag_ust", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#5AB4E0", props: { cx: 225, cy: 150, rx: 32, ry: 24 } },
      { id: "kelebek_kanat_sag_alt", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#8FCB6B", props: { cx: 220, cy: 185, rx: 22, ry: 17 } },
      { id: "kelebek_kanat_nokta_sol", tip: "circle", boyanabilir: false, sabitRenk: "#FFFFFF", props: { cx: 172, cy: 146, r: 5 } },
      { id: "kelebek_kanat_nokta_sag", tip: "circle", boyanabilir: false, sabitRenk: "#FFFFFF", props: { cx: 228, cy: 146, r: 5 } },
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
      { id: "yildiz1", tip: "circle", boyanabilir: false, sabitRenk: "#FFFFFF", props: { cx: 110, cy: 60, r: 3 } },
      { id: "yildiz2", tip: "circle", boyanabilir: false, sabitRenk: "#FFFFFF", props: { cx: 150, cy: 200, r: 2.5 } },
      { id: "yildiz3", tip: "circle", boyanabilir: false, sabitRenk: "#FFFFFF", props: { cx: 350, cy: 220, r: 3 } },
      { id: "yildiz4", tip: "circle", boyanabilir: false, sabitRenk: "#FFFFFF", props: { cx: 300, cy: 300, r: 2.5 } },
      { id: "yildiz5", tip: "circle", boyanabilir: false, sabitRenk: "#FFFFFF", props: { cx: 250, cy: 50, r: 2.5 } },
      { id: "yildiz6", tip: "circle", boyanabilir: false, sabitRenk: "#FFFFFF", props: { cx: 30, cy: 200, r: 3 } },
      { id: "gezegen_halka", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFC93C", props: { cx: 320, cy: 90, rx: 55, ry: 14 } },
      { id: "gezegen", tip: "circle", boyanabilir: true, varsayilanRenk: "#B497D6", props: { cx: 320, cy: 90, r: 34 } },
      { id: "gezegen_krater", tip: "circle", boyanabilir: false, sabitRenk: "#C7AEE0", props: { cx: 310, cy: 82, r: 6 } },
      { id: "gezegen2", tip: "circle", boyanabilir: true, varsayilanRenk: "#8FCB6B", props: { cx: 345, cy: 175, r: 16 } },
      { id: "ay", tip: "circle", boyanabilir: true, varsayilanRenk: "#E7ECF2", props: { cx: 60, cy: 110, r: 24 } },
      { id: "ay_krater1", tip: "circle", boyanabilir: false, sabitRenk: "#C7CEDA", props: { cx: 52, cy: 104, r: 5 } },
      { id: "ay_krater2", tip: "circle", boyanabilir: false, sabitRenk: "#C7CEDA", props: { cx: 68, cy: 119, r: 4 } },
      { id: "asteroit1", tip: "circle", boyanabilir: true, varsayilanRenk: "#8892A6", props: { cx: 110, cy: 250, r: 6 } },
      { id: "asteroit2", tip: "circle", boyanabilir: true, varsayilanRenk: "#6B7686", props: { cx: 130, cy: 270, r: 8 } },
      { id: "asteroit3", tip: "circle", boyanabilir: true, varsayilanRenk: "#A0ABBB", props: { cx: 95, cy: 282, r: 5 } },
      { id: "zemin_ay_yuzeyi", tip: "path", boyanabilir: true, varsayilanRenk: "#8892A6", props: { d: "M0,370 Q200,338 400,370 L400,400 L0,400 Z" } },
      { id: "roket_govde", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#E4E9F0", props: { cx: 200, cy: 250, rx: 34, ry: 70 } },
      { id: "roket_govde_cizgi", tip: "rect", boyanabilir: true, varsayilanRenk: "#B9C2CE", props: { x: 178, y: 268, width: 44, height: 9, rx: 4 } },
      { id: "roket_burun", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FF6F5A", props: { points: "200,150 172,200 228,200" } },
      { id: "roket_pencere", tip: "circle", boyanabilir: true, varsayilanRenk: "#5AB4E0", props: { cx: 200, cy: 230, r: 16 } },
      { id: "roket_kanat_sol", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FF6F5A", props: { points: "166,290 130,330 166,320" } },
      { id: "roket_kanat_sag", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FF6F5A", props: { points: "234,290 270,330 234,320" } },
      { id: "roket_alev1", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FFD93C", props: { points: "185,320 200,362 200,320" } },
      { id: "roket_alev2", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FF9F5A", props: { points: "200,320 215,320 200,372" } },
      { id: "roket_alev3", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FF6F5A", props: { points: "192,320 200,345 208,320" } },
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
