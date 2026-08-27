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
      { id: "kelebek_kucuk_kanat1", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FF9F5A", props: { cx: 310, cy: 140, rx: 10, ry: 7 } },
      { id: "kelebek_kucuk_kanat2", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#5AB4E0", props: { cx: 328, cy: 140, rx: 10, ry: 7 } },
      { id: "kelebek_kucuk_govde", tip: "rect", boyanabilir: false, sabitRenk: "#2B2B2B", props: { x: 318, y: 136, width: 4, height: 10, rx: 2 } },
      { id: "zemin", tip: "path", boyanabilir: true, varsayilanRenk: "#8FCB6B", props: { d: "M0,300 Q200,258 400,300 L400,400 L0,400 Z" } },
      { id: "tas1", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#B8C0CC", props: { cx: 60, cy: 340, rx: 16, ry: 10 } },
      { id: "tas2", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#A6AFBD", props: { cx: 340, cy: 348, rx: 20, ry: 12 } },
      { id: "cicek1_sap", tip: "rect", boyanabilir: true, varsayilanRenk: "#4F9A4A", props: { x: 40, y: 310, width: 4, height: 30, rx: 2 } },
      { id: "cicek1_tac", tip: "circle", boyanabilir: true, varsayilanRenk: "#FF6FA0", props: { cx: 42, cy: 305, r: 10 } },
      { id: "cicek2_sap", tip: "rect", boyanabilir: true, varsayilanRenk: "#4F9A4A", props: { x: 310, y: 320, width: 4, height: 26, rx: 2 } },
      { id: "cicek2_tac", tip: "circle", boyanabilir: true, varsayilanRenk: "#B497D6", props: { cx: 312, cy: 316, r: 9 } },
      { id: "cim_tuft_sol", tip: "polygon", boyanabilir: true, varsayilanRenk: "#7BC968", props: { points: "70,350 76,320 82,350" } },
      { id: "cim_tuft_sag", tip: "polygon", boyanabilir: true, varsayilanRenk: "#7BC968", props: { points: "290,355 296,325 302,355" } },
      { id: "agac_govde", tip: "rect", boyanabilir: true, varsayilanRenk: "#B98354", props: { x: 292, y: 228, width: 18, height: 74, rx: 6 } },
      { id: "agac_yaprak1", tip: "circle", boyanabilir: true, varsayilanRenk: "#5FAE4A", props: { cx: 301, cy: 208, r: 40 } },
      { id: "agac_yaprak2", tip: "circle", boyanabilir: true, varsayilanRenk: "#6FBE5A", props: { cx: 268, cy: 236, r: 22 } },
      { id: "tilki_kuyruk", tip: "path", boyanabilir: true, varsayilanRenk: "#F2924B", props: { d: "M196,316 Q232,300 224,250 Q220,218 198,222 Q214,248 202,282 Q198,302 196,316 Z" } },
      { id: "kuyruk_seridi", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFD9B0", props: { cx: 210, cy: 266, rx: 8, ry: 15 } },
      { id: "tilki_kuyruk_ucu", tip: "circle", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { cx: 203, cy: 228, r: 13 } },
      { id: "tilki_govde", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#F2924B", props: { cx: 150, cy: 312, rx: 52, ry: 40 } },
      { id: "pati_sol", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#F2924B", props: { cx: 124, cy: 345, rx: 14, ry: 9 } },
      { id: "pati_sag", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#F2924B", props: { cx: 176, cy: 347, rx: 14, ry: 9 } },
      { id: "tilki_kulak_sol", tip: "polygon", boyanabilir: true, varsayilanRenk: "#F2924B", props: { points: "114,222 133,218 100,178" } },
      { id: "kulak_ici_sol", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FFD9B0", props: { points: "117,218 130,216 108,190" } },
      { id: "tilki_kulak_sag", tip: "polygon", boyanabilir: true, varsayilanRenk: "#F2924B", props: { points: "186,222 167,218 200,178" } },
      { id: "kulak_ici_sag", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FFD9B0", props: { points: "183,218 170,216 192,190" } },
      { id: "tilki_kafa", tip: "circle", boyanabilir: true, varsayilanRenk: "#F2924B", props: { cx: 150, cy: 248, r: 36 } },
      { id: "tilki_karin", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFF6E9", props: { cx: 150, cy: 268, rx: 18, ry: 24 } },
      { id: "goz_sol", tip: "circle", boyanabilir: false, sabitRenk: "#2B2B2B", props: { cx: 138, cy: 246, r: 4 } },
      { id: "goz_sag", tip: "circle", boyanabilir: false, sabitRenk: "#2B2B2B", props: { cx: 162, cy: 246, r: 4 } },
      { id: "burun", tip: "polygon", boyanabilir: false, sabitRenk: "#2B2B2B", props: { points: "150,258 143,266 157,266" } },
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
  {
    id: "araba-yaris",
    ad: "Yarış Arabası",
    emoji: "🏎️",
    viewBox: "0 0 400 400",
    shapes: [
      { id: "gokyuzu", tip: "rect", boyanabilir: true, varsayilanRenk: "#BFE8FB", props: { x: 0, y: 0, width: 400, height: 400 } },
      { id: "gunes", tip: "circle", boyanabilir: true, varsayilanRenk: "#FFD93C", props: { cx: 340, cy: 60, r: 32 } },
      { id: "bulut1", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { cx: 80, cy: 70, rx: 34, ry: 18 } },
      { id: "bulut2", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { cx: 110, cy: 85, rx: 24, ry: 14 } },
      { id: "dag_sol", tip: "polygon", boyanabilir: true, varsayilanRenk: "#B497D6", props: { points: "0,260 60,180 120,260" } },
      { id: "dag_sag", tip: "polygon", boyanabilir: true, varsayilanRenk: "#B497D6", props: { points: "300,260 360,190 400,260" } },
      { id: "yol", tip: "path", boyanabilir: true, varsayilanRenk: "#8892A6", props: { d: "M0,300 Q200,290 400,300 L400,400 L0,400 Z" } },
      { id: "yol_cizgi1", tip: "rect", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { x: 60, y: 350, width: 50, height: 10, rx: 4 } },
      { id: "yol_cizgi2", tip: "rect", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { x: 200, y: 350, width: 50, height: 10, rx: 4 } },
      { id: "yol_cizgi3", tip: "rect", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { x: 320, y: 350, width: 50, height: 10, rx: 4 } },
      { id: "bayrak_direk", tip: "rect", boyanabilir: true, varsayilanRenk: "#B98354", props: { x: 350, y: 200, width: 6, height: 110, rx: 2 } },
      { id: "bayrak_bez", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FF6F5A", props: { points: "356,200 396,215 356,230" } },
      { id: "araba_govde", tip: "rect", boyanabilir: true, varsayilanRenk: "#FF6F5A", props: { x: 90, y: 240, width: 220, height: 60, rx: 26 } },
      { id: "araba_kabin", tip: "path", boyanabilir: true, varsayilanRenk: "#FF6F5A", props: { d: "M150,240 Q165,190 205,190 Q245,190 258,240 Z" } },
      { id: "araba_cam", tip: "polygon", boyanabilir: true, varsayilanRenk: "#7EC8E3", props: { points: "168,235 198,200 232,200 250,235" } },
      { id: "araba_spoiler_direk1", tip: "rect", boyanabilir: false, sabitRenk: "#2B2B2B", props: { x: 284, y: 215, width: 6, height: 28, rx: 2 } },
      { id: "araba_spoiler_direk2", tip: "rect", boyanabilir: false, sabitRenk: "#2B2B2B", props: { x: 300, y: 215, width: 6, height: 28, rx: 2 } },
      { id: "araba_spoiler_kanat", tip: "rect", boyanabilir: true, varsayilanRenk: "#FFD93C", props: { x: 278, y: 205, width: 34, height: 10, rx: 3 } },
      { id: "far_on", tip: "circle", boyanabilir: true, varsayilanRenk: "#FFD93C", props: { cx: 306, cy: 258, r: 8 } },
      { id: "far_arka", tip: "circle", boyanabilir: true, varsayilanRenk: "#FF6F5A", props: { cx: 96, cy: 258, r: 7 } },
      { id: "yaris_seridi", tip: "rect", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { x: 90, y: 262, width: 220, height: 14 } },
      { id: "tekerlek_on_dis", tip: "circle", boyanabilir: false, sabitRenk: "#2B2B2B", props: { cx: 140, cy: 306, r: 28 } },
      { id: "tekerlek_on_jant", tip: "circle", boyanabilir: true, varsayilanRenk: "#C7CEDA", props: { cx: 140, cy: 306, r: 13 } },
      { id: "tekerlek_arka_dis", tip: "circle", boyanabilir: false, sabitRenk: "#2B2B2B", props: { cx: 260, cy: 306, r: 28 } },
      { id: "tekerlek_arka_jant", tip: "circle", boyanabilir: true, varsayilanRenk: "#C7CEDA", props: { cx: 260, cy: 306, r: 13 } },
      { id: "egzoz_duman1", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#E7ECF2", props: { cx: 60, cy: 270, rx: 14, ry: 9 } },
      { id: "egzoz_duman2", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#E7ECF2", props: { cx: 40, cy: 258, rx: 10, ry: 7 } },
    ],
  },
  {
    // Genel bir "prenses" arketipi (taç, elbise, kale, asa) - herhangi bir
    // isimli/lisanslı karaktere (belirli bir Disney prensesi, Barbie vb.)
    // atıfta bulunmuyor, bilinçli olarak öyle tasarlandı (telif riski).
    id: "prenses-kale",
    ad: "Prenses ve Kale",
    emoji: "👑",
    viewBox: "0 0 400 400",
    shapes: [
      { id: "gokyuzu", tip: "rect", boyanabilir: true, varsayilanRenk: "#FDEEF6", props: { x: 0, y: 0, width: 400, height: 400 } },
      { id: "gunes", tip: "circle", boyanabilir: true, varsayilanRenk: "#FFD93C", props: { cx: 60, cy: 70, r: 28 } },
      { id: "bulut1", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { cx: 320, cy: 60, rx: 30, ry: 16 } },
      { id: "bulut2", tip: "ellipse", boyanabilir: true, varsayilanRenk: "#FFFFFF", props: { cx: 350, cy: 78, rx: 20, ry: 12 } },
      { id: "kale_kule_sol", tip: "rect", boyanabilir: true, varsayilanRenk: "#E7ECF2", props: { x: 250, y: 140, width: 40, height: 110, rx: 4 } },
      { id: "kale_kule_sag", tip: "rect", boyanabilir: true, varsayilanRenk: "#E7ECF2", props: { x: 330, y: 140, width: 40, height: 110, rx: 4 } },
      { id: "kale_govde", tip: "rect", boyanabilir: true, varsayilanRenk: "#E7ECF2", props: { x: 270, y: 180, width: 80, height: 70, rx: 4 } },
      { id: "kale_kule_sol_capak", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FF6FA0", props: { points: "250,140 270,100 290,140" } },
      { id: "kale_kule_sag_capak", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FF6FA0", props: { points: "330,140 350,100 370,140" } },
      { id: "kale_bayrak_direk_sol", tip: "rect", boyanabilir: false, sabitRenk: "#B98354", props: { x: 268, y: 85, width: 3, height: 20 } },
      { id: "kale_bayrak_sol", tip: "polygon", boyanabilir: true, varsayilanRenk: "#5AB4E0", props: { points: "271,85 290,92 271,99" } },
      { id: "kale_kapi", tip: "path", boyanabilir: true, varsayilanRenk: "#B98354", props: { d: "M295,250 Q295,225 310,225 Q325,225 325,250 Z" } },
      { id: "kale_pencere_sol", tip: "circle", boyanabilir: false, sabitRenk: "#8892A6", props: { cx: 270, cy: 175, r: 7 } },
      { id: "kale_pencere_sag", tip: "circle", boyanabilir: false, sabitRenk: "#8892A6", props: { cx: 350, cy: 175, r: 7 } },
      { id: "zemin", tip: "path", boyanabilir: true, varsayilanRenk: "#A9DE8C", props: { d: "M0,320 Q200,300 400,320 L400,400 L0,400 Z" } },
      { id: "cim_tuft1", tip: "polygon", boyanabilir: true, varsayilanRenk: "#7BC968", props: { points: "40,330 47,295 54,330" } },
      { id: "cim_tuft2", tip: "polygon", boyanabilir: true, varsayilanRenk: "#7BC968", props: { points: "360,335 367,300 374,335" } },
      { id: "cicek_sap", tip: "rect", boyanabilir: true, varsayilanRenk: "#4F9A4A", props: { x: 340, y: 290, width: 5, height: 40, rx: 2 } },
      { id: "cicek_tac", tip: "circle", boyanabilir: true, varsayilanRenk: "#FF6FA0", props: { cx: 342, cy: 282, r: 11 } },
      { id: "prenses_elbise", tip: "path", boyanabilir: true, varsayilanRenk: "#B497D6", props: { d: "M150,380 Q150,260 200,250 Q250,260 250,380 Z" } },
      { id: "prenses_elbise_bel", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FF6FA0", props: { points: "180,255 220,255 214,225 186,225" } },
      { id: "prenses_sac", tip: "path", boyanabilir: true, varsayilanRenk: "#B98354", props: { d: "M165,200 Q160,145 200,140 Q240,145 235,200 Q235,215 200,222 Q165,215 165,200 Z" } },
      { id: "prenses_kafa", tip: "circle", boyanabilir: true, varsayilanRenk: "#FFD9B0", props: { cx: 200, cy: 195, r: 30 } },
      { id: "prenses_tac", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FFD93C", props: { points: "178,150 186,128 194,148 200,122 206,148 214,128 222,150" } },
      { id: "prenses_tac_mucevher", tip: "circle", boyanabilir: false, sabitRenk: "#5AB4E0", props: { cx: 200, cy: 138, r: 4 } },
      { id: "goz_sol", tip: "circle", boyanabilir: false, sabitRenk: "#2B2B2B", props: { cx: 190, cy: 198, r: 4 } },
      { id: "goz_sag", tip: "circle", boyanabilir: false, sabitRenk: "#2B2B2B", props: { cx: 210, cy: 198, r: 4 } },
      { id: "agiz", tip: "path", boyanabilir: false, doluDegil: true, sabitRenk: "#2B2B2B", props: { d: "M190,212 Q200,218 210,212" } },
      { id: "asa_sopa", tip: "rect", boyanabilir: true, varsayilanRenk: "#B98354", props: { x: 255, y: 290, width: 5, height: 70, rx: 2 } },
      { id: "asa_yildiz", tip: "polygon", boyanabilir: true, varsayilanRenk: "#FFD93C", props: { points: "257,270 267,285 257,300 247,285" } },
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
