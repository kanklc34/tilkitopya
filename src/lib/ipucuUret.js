// Soru bankasında `ipucu` alanı doldurulmamışsa (henüz içerik
// girilmemiş kayıtlar için) soru tipine göre makul bir geri bildirim
// üretir - amaç hiçbir yanlış cevabın açıklamasız kalmaması.
// Gerçek, elle yazılmış ipucu her zaman önceliklidir; bu sadece
// eksik olduğunda devreye giren bir güvenlik ağı.
export function ipucuGetir(soru) {
  if (!soru) return "Sorun değil, tekrar dene!";
  if (soru.ipucu) return soru.ipucu;

  const tip = soru.soru_tipi || soru.oyun_tipi;
  const metin = soru.soru_metni || "";

  if (tip === "harf_tamamlama" && soru.gorsel_emoji) {
    return `${soru.gorsel_emoji} resmine bak, hangi harf eksik?`;
  }
  if ((tip === "bosluk_doldurma" || tip === "pratik") && /[-−+]/.test(metin)) {
    return "Parmaklarınla ya da nesnelerle say";
  }
  if (soru.tema_emoji) {
    return `${soru.tema_emoji} ile ilgili düşün, tekrar dene`;
  }
  return "Sorun değil, tekrar dene!";
}
