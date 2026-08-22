import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Settings, Lock, Gift } from "lucide-react";

import EbeveynPaneli from "./components/EbeveynPaneli.jsx";
import {
  ilerlemeyiOku,
  oyunTamamlandi,
  gununGorevleri,
  odulOyunlariAcikMi,
  aktifSinifOku,
  aktifSinifKaydet,
  sinifIcerigiVarMi,
} from "./lib/progress.js";
import { anaEkranMesajiSec } from "./lib/maskotMesajlari.js";

import HizliYaris from "./games/HizliYaris.jsx";
import MatematikEslestirme from "./games/MatematikEslestirme.jsx";
import BoslukDoldurmaMatematik from "./games/BoslukDoldurmaMatematik.jsx";
import PratikModuMatematik from "./games/PratikModuMatematik.jsx";
import TurkceEslestirme from "./games/TurkceEslestirme.jsx";
import TurkceHarfTamamlama from "./games/TurkceHarfTamamlama.jsx";
import IngilizceEslestirme from "./games/IngilizceEslestirme.jsx";
import IngilizceHarfTamamlama from "./games/IngilizceHarfTamamlama.jsx";
import HayatBilgisiDogaGozlem from "./games/HayatBilgisiDogaGozlem.jsx";
import HayatBilgisiGunlerSirasi from "./games/HayatBilgisiGunlerSirasi.jsx";
import FarkBulma from "./games/FarkBulma.jsx";
import GizliNesneBulma from "./games/GizliNesneBulma.jsx";
import BoyamaKitabi from "./games/BoyamaKitabi.jsx";
import YapBoz from "./games/YapBoz.jsx";

// Tek yerden yönetilen oyun kayıt defteri - yeni bir oyun eklemek
// istediğinde sadece buraya bir satır eklemen yeterli. Sınıf bazlı ayrılmış
// durumda: her sınıfın kendi müfredatı/oyun kataloğu var (ilkokul 1-4.
// sınıf, bkz. progress.js#DESTEKLENEN_SINIFLAR). 2-3-4. sınıf henüz boş -
// mimari hazır, içerik (soru bankaları + oyunlar) sınıf sınıf ekleniyor.
const GAMES_SINIF1 = [
  {
    ders: "Matematik",
    dersIkon: "🔢",
    renk: "#5AB4E0",
    items: [
      { id: "pratik-matematik", ad: "Pratik Modu", emoji: "📚", Component: PratikModuMatematik },
      { id: "hizli-yaris", ad: "Hızlı Yarış", emoji: "🏎️", Component: HizliYaris },
      { id: "mat-eslestirme", ad: "Eşleştirme", emoji: "🃏", Component: MatematikEslestirme },
      { id: "bosluk-mat", ad: "Boşluk Doldur", emoji: "❓", Component: BoslukDoldurmaMatematik },
    ],
  },
  {
    ders: "Türkçe",
    dersIkon: "📖",
    renk: "#FF9F5A",
    items: [
      { id: "tr-eslestirme", ad: "Kelime Eşleştir", emoji: "🃏", Component: TurkceEslestirme },
      { id: "tr-harf", ad: "Harf Tamamla", emoji: "🔤", Component: TurkceHarfTamamlama },
    ],
  },
  {
    ders: "İngilizce",
    dersIkon: "🌍",
    renk: "#8FCB6B",
    items: [
      { id: "en-eslestirme", ad: "Word Match", emoji: "🃏", Component: IngilizceEslestirme },
      { id: "en-harf", ad: "Word Fill", emoji: "🔤", Component: IngilizceHarfTamamlama },
    ],
  },
  {
    ders: "Hayat Bilgisi",
    dersIkon: "🏡",
    renk: "#B497D6",
    items: [
      { id: "hb-doga", ad: "Doğa Gözlemi", emoji: "🦋", Component: HayatBilgisiDogaGozlem },
      { id: "hb-gunler", ad: "Günler Sırası", emoji: "📅", Component: HayatBilgisiGunlerSirasi },
    ],
  },
  {
    ders: "Genel Beceriler",
    dersIkon: "🧠",
    renk: "#FFC93C",
    items: [
      { id: "gb-fark", ad: "Farklı Olan", emoji: "🔍", Component: FarkBulma },
      { id: "gb-gizli", ad: "Gizli Nesne", emoji: "🕵️", Component: GizliNesneBulma },
    ],
  },
];

// 2. sınıf: içerik sınıf sınıf ekleniyor.
// - Matematik soru bankası hazır (src/data/matematik-2-sinif.json) -
//   şimdilik sadece Pratik Modu bu bankayı kullanıyor. Hızlı Yarış/
//   Eşleştirme/Boşluk Doldur gibi diğer matematik oyunları kendi
//   içlerinde 1. sınıf seviyesine (10-20 arası) göre sayı üretiyor, 2.
//   sınıfa (100'e kadar) uyarlanana kadar burada yer almıyorlar.
// - Türkçe soru bankası hazır (src/data/turkce-2-sinif.json) - Kelime
//   Eşleştir ve Harf Tamamla bu bankayı kullanıyor (1. sınıfla aynı
//   motor, daha uzun kelime dağarcığı). Bitişik el yazısı/cümle
//   tamamlama/paragraf okuma/noktalama için yeni oyun motoru gerekiyor,
//   henüz yok.
// - İngilizce soru bankası hazır (src/data/ingilizce-2-sinif.json) - Word
//   Match ve Word Fill bu bankayı kullanıyor (1. sınıfla aynı motor,
//   genişletilmiş kelime dağarcığı + yeni "renkler" teması).
// - Hayat Bilgisi soru bankası hazır (src/data/hayat-bilgisi-2-sinif.json) -
//   Doğa Gözlemi ve Günler/Zaman Sırası bu bankayı kullanıyor (1. sınıftan
//   bir adım ileri: yeni "ay sırası" kazanımı + daha kalabalık doğa
//   gözlemi sahneleri).
// - Genel Beceriler: Fark Bulma ve Gizli Nesne Bulma JSON tabanlı DEĞİL -
//   kod içi ROUNDS_BY_SINIF + hedef/grup havuzları sınıfa göre genişletildi
//   (daha kalabalık ızgara/sahne + daha fazla emoji çeşidi).
// 2. sınıf kataloğu artık 5/5 ders grubunu kapsıyor - "yakında" ekranından
// çıkıp gerçek kullanıcıya sunulabilir hale gelmeden önceki teknik eşik
// geçildi (bkz. devir teslim dokümanı: pedagog incelemesi hâlâ gerekiyor).
const GAMES_SINIF2 = [
  {
    ders: "Matematik",
    dersIkon: "🔢",
    renk: "#5AB4E0",
    items: [
      { id: "pratik-matematik-2", ad: "Pratik Modu", emoji: "📚", Component: PratikModuMatematik },
    ],
  },
  {
    ders: "Türkçe",
    dersIkon: "🔤",
    renk: "#FF9F5A",
    items: [
      { id: "tr-eslestirme-2", ad: "Kelime Eşleştir", emoji: "🃏", Component: TurkceEslestirme },
      { id: "tr-harf-2", ad: "Harf Tamamla", emoji: "🔤", Component: TurkceHarfTamamlama },
    ],
  },
  {
    ders: "İngilizce",
    dersIkon: "🌍",
    renk: "#8B7FD9",
    items: [
      { id: "en-eslestirme-2", ad: "Word Match", emoji: "🃏", Component: IngilizceEslestirme },
      { id: "en-harf-2", ad: "Word Fill", emoji: "🔤", Component: IngilizceHarfTamamlama },
    ],
  },
  {
    ders: "Hayat Bilgisi",
    dersIkon: "🌻",
    renk: "#6FBF73",
    items: [
      { id: "hb-doga-2", ad: "Doğa Gözlemi", emoji: "🦋", Component: HayatBilgisiDogaGozlem },
      { id: "hb-gunler-2", ad: "Zaman Sırası", emoji: "📅", Component: HayatBilgisiGunlerSirasi },
    ],
  },
  {
    ders: "Genel Beceriler",
    dersIkon: "🧠",
    renk: "#E0855A",
    items: [
      { id: "gb-fark-2", ad: "Farklı Olan", emoji: "🔍", Component: FarkBulma },
      { id: "gb-gizli-2", ad: "Gizli Nesne", emoji: "🕵️", Component: GizliNesneBulma },
    ],
  },
];
const GAMES_SINIF3 = [];
const GAMES_SINIF4 = [];

const GAMES_BY_SINIF = { 1: GAMES_SINIF1, 2: GAMES_SINIF2, 3: GAMES_SINIF3, 4: GAMES_SINIF4 };

function HomeScreen({ onSelect, ilerleme, onEbeveynAc, sekme, setSekme, onOdulAc, aktifSinif }) {
  const oyunKatalogu = GAMES_BY_SINIF[aktifSinif] || [];
  const bugunGorevleri = gununGorevleri(ilerleme.aktifGun, aktifSinif);
  const bugunKayit = ilerleme.gunler[ilerleme.aktifGun];
  const tamamlananSayisi = bugunGorevleri.filter((g) => bugunKayit?.gorevler?.[g.id]).length;
  const tumOyunlarAcik = ilerleme.ayarlar.tumOyunlarSekmesiAcik;
  const odulAcikMi = odulOyunlariAcikMi(ilerleme);
  // Ebeveyn "Tüm Oyunlar" sekmesini kapattıysa çocuk her zaman görevler
  // ekranında kalır - sekme çubuğu bile gösterilmez, seçim şansı olmaz.
  const gosterilenSekme = tumOyunlarAcik ? sekme : "gorevler";
  const [mesajYenile, setMesajYenile] = useState(0);
  const [zipliyorMu, setZipliyorMu] = useState(false);
  const mesaj = useMemo(
    () => anaEkranMesajiSec({ tamamlananSayisi, toplamGorev: bugunGorevleri.length }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tamamlananSayisi, bugunGorevleri.length, mesajYenile]
  );

  // Maskot tamamen sabit kalmasın ama sürekli aynı ritimde de sallanmasın -
  // sakin bir "nefes alma" varsayılan, arada bir (rastgele aralıklarla)
  // daha belirgin bir zıplama ile doğal/canlı bir his veriyor.
  useEffect(() => {
    let zamanlayici;
    function planla() {
      const gecikme = 4500 + Math.random() * 4000;
      zamanlayici = setTimeout(() => {
        setZipliyorMu(true);
        setTimeout(() => setZipliyorMu(false), 700);
        planla();
      }, gecikme);
    }
    planla();
    return () => clearTimeout(zamanlayici);
  }, []);

  return (
    <div className="home-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;700;800&display=swap');

        .home-root {
          min-height: 100vh;
          background: #EAF6FD;
          font-family: 'Nunito', sans-serif;
          padding: 32px 20px 60px;
        }
        .home-header {
          text-align: center;
          margin-bottom: 36px;
        }
        .mascot-greeting {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin: 0 auto 18px;
          cursor: pointer;
          border: none;
          background: none;
          padding: 0;
          font: inherit;
        }
        .mascot-greeting:focus-visible {
          outline: 3px solid #5AB4E0;
          outline-offset: 4px;
          border-radius: 16px;
        }
        .mascot-mount-wrap {
          display: inline-block;
          animation: mascotMountPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .mascot-big {
          width: 96px;
          height: 96px;
          display: inline-block;
          filter: drop-shadow(0 6px 10px rgba(31,46,69,0.15));
        }
        .mascot-big.mascot-idle {
          animation: mascotBreath 3.6s ease-in-out infinite;
        }
        .mascot-big.mascot-hop {
          animation: mascotHop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .mascot-greeting:active .mascot-big { transform: scale(0.92); }
        @keyframes mascotMountPop {
          0% { transform: scale(0.4); opacity: 0; }
          70% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes mascotBreath {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
          50% { transform: translateY(-2px) scale(1.015) rotate(0deg); }
        }
        @keyframes mascotHop {
          0% { transform: translateY(0) rotate(0deg); }
          30% { transform: translateY(-16px) rotate(-8deg); }
          55% { transform: translateY(0) rotate(6deg); }
          78% { transform: translateY(-5px) rotate(-3deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        .mascot-bubble {
          background: white;
          color: #1F2E45;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 15px;
          padding: 10px 18px;
          border-radius: 999px;
          box-shadow: 0 4px 14px rgba(31,46,69,0.1);
        }
        .mascot-bubble-pop {
          animation: bubblePop 0.3s ease-out 0.25s backwards;
        }
        @keyframes bubblePop {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .home-title {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 24px;
          color: #1F2E45;
          margin: 0;
        }
        .home-subtitle {
          color: #5C6B85;
          font-size: 14px;
          margin-top: 4px;
        }
        .ders-block {
          max-width: 720px;
          margin: 0 auto 28px;
        }
        .ders-title {
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 18px;
          color: #1F2E45;
          margin-bottom: 12px;
          padding-left: 4px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ders-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          opacity: 0.85;
        }
        .game-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 14px;
        }
        .game-card {
          background: white;
          border: none;
          border-radius: 20px;
          padding: 22px 14px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(31,46,69,0.08);
          transition: transform 0.12s ease, box-shadow 0.15s ease;
        }
        .game-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(31,46,69,0.12); }
        .game-card-emoji { font-size: 34px; }
        .game-card-title {
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: #1F2E45;
          text-align: center;
        }

        .parent-btn {
          position: fixed;
          top: 14px;
          right: 14px;
          border: none;
          background: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #5C6B85;
          box-shadow: 0 3px 10px rgba(31,46,69,0.12);
          z-index: 20;
        }

        .today-block {
          max-width: 720px;
          margin: 0 auto 28px;
          background: white;
          border-radius: 20px;
          padding: 18px 20px;
          box-shadow: 0 4px 14px rgba(31,46,69,0.08);
        }
        .today-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .today-title {
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 16px;
          color: #1F2E45;
        }
        .today-count {
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 12px;
          color: #5C6B85;
          background: #EAF6FD;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .today-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          gap: 10px;
        }
        .today-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: #F5F8FC;
          border: none;
          border-radius: 16px;
          padding: 10px 8px;
          cursor: pointer;
        }
        .today-item.today-done {
          background: #E4F7E6;
        }
        .today-item-emoji { font-size: 24px; }
        .today-item-ad {
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 11px;
          color: #1F2E45;
          text-align: center;
        }
        .today-item-check { font-size: 12px; color: #4E9F53; }
        .today-complete-msg {
          text-align: center;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 13px;
          color: #4E9F53;
          padding: 6px 0;
        }

        .odul-banner {
          max-width: 720px;
          margin: 0 auto 22px;
          display: flex;
          align-items: center;
          gap: 14px;
          border: none;
          border-radius: 20px;
          padding: 16px 20px;
          width: 100%;
          box-sizing: border-box;
          text-align: left;
          cursor: pointer;
        }
        .odul-banner-acik {
          background: linear-gradient(135deg, #FFD93C, #FF9F5A);
          box-shadow: 0 6px 16px rgba(255,159,90,0.35);
          transition: transform 0.12s ease;
        }
        .odul-banner-acik:hover { transform: translateY(-2px); }
        .odul-banner-acik:focus-visible { outline: 3px solid #1F2E45; outline-offset: 3px; }
        .odul-banner-kilitli {
          background: #E7ECF2;
          cursor: default;
        }
        .odul-banner-emoji {
          font-size: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8892A6;
        }
        .odul-banner-baslik {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: #1F2E45;
        }
        .odul-banner-alt {
          font-size: 12px;
          color: #1F2E45;
          opacity: 0.75;
          margin-top: 2px;
        }
        .odul-banner-kilitli .odul-banner-baslik,
        .odul-banner-kilitli .odul-banner-alt {
          color: #5C6B85;
        }

        .tab-bar {
          max-width: 720px;
          margin: 0 auto 22px;
          display: flex;
          gap: 8px;
          background: white;
          padding: 5px;
          border-radius: 999px;
          box-shadow: 0 3px 10px rgba(31,46,69,0.08);
        }
        .tab-btn {
          flex: 1;
          border: none;
          background: transparent;
          padding: 10px 14px;
          border-radius: 999px;
          cursor: pointer;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 13px;
          color: #5C6B85;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .tab-btn.tab-active {
          background: #5AB4E0;
          color: #1F2E45;
          font-weight: 700;
        }
      `}</style>

      <button className="parent-btn" onClick={onEbeveynAc} aria-label="Ebeveyn Alanı">
        <Settings size={17} />
      </button>

      <div className="home-header">
        <button
          type="button"
          className="mascot-greeting"
          aria-label="Maskota dokun, yeni bir mesaj göster"
          onClick={() => {
            setMesajYenile((n) => n + 1);
            setZipliyorMu(true);
            setTimeout(() => setZipliyorMu(false), 700);
          }}
        >
          <div className="mascot-mount-wrap" key={mesajYenile}>
            <img
              src={`${import.meta.env.BASE_URL}fox-mascot.png`}
              className={`mascot-big ${zipliyorMu ? "mascot-hop" : "mascot-idle"}`}
              alt="Tilki maskot"
            />
          </div>
          <div key={`b-${mesajYenile}`} className="mascot-bubble mascot-bubble-pop">{mesaj}</div>
        </button>
        <h1 className="home-title">İlkokul Platformu</h1>
        <div className="home-subtitle">{aktifSinif}. Sınıf</div>
      </div>

      {odulAcikMi ? (
        <button type="button" className="odul-banner odul-banner-acik" onClick={onOdulAc}>
          <span className="odul-banner-emoji">🎁</span>
          <div className="odul-banner-metin">
            <div className="odul-banner-baslik">Ödül Oyunları</div>
            <div className="odul-banner-alt">Boyama Kitabı ve Yap Boz seni bekliyor!</div>
          </div>
        </button>
      ) : ilerleme.ayarlar.odulOyunlariModu === "gorevSonrasi" ? (
        <div className="odul-banner odul-banner-kilitli" aria-hidden="true">
          <span className="odul-banner-emoji"><Lock size={26} /></span>
          <div className="odul-banner-metin">
            <div className="odul-banner-baslik">Ödül Oyunları</div>
            <div className="odul-banner-alt">Bugünün görevlerini bitirince açılır</div>
          </div>
        </div>
      ) : null}

      {tumOyunlarAcik && (
        <div className="tab-bar">
          <button
            className={`tab-btn ${gosterilenSekme === "gorevler" ? "tab-active" : ""}`}
            onClick={() => setSekme("gorevler")}
          >
            🗓️ Görevler
          </button>
          <button
            className={`tab-btn ${gosterilenSekme === "tumOyunlar" ? "tab-active" : ""}`}
            onClick={() => setSekme("tumOyunlar")}
          >
            🎮 Tüm Oyunlar
          </button>
        </div>
      )}

      {gosterilenSekme === "gorevler" ? (
        <div className="today-block">
          <div className="today-title-row">
            <span className="today-title">🗓️ Bugünün Görevi</span>
            <span className="today-count">{tamamlananSayisi}/{bugunGorevleri.length}</span>
          </div>
          {tamamlananSayisi === bugunGorevleri.length ? (
            <div className="today-complete-msg">🎉 Bugünü tamamladın, harikasın!</div>
          ) : null}
          <div className="today-row">
            {bugunGorevleri.map((gorev) => {
              const yapildi = !!bugunKayit?.gorevler?.[gorev.id];
              return (
                <button
                  key={gorev.id}
                  className={`today-item ${yapildi ? "today-done" : ""}`}
                  onClick={() => onSelect(gorev.id)}
                >
                  <span className="today-item-emoji">{gorev.emoji}</span>
                  <span className="today-item-ad">{gorev.ad}</span>
                  {yapildi && <span className="today-item-check">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        oyunKatalogu.map((grup) => (
          <div className="ders-block" key={grup.ders}>
            <div className="ders-title" style={{ color: grup.renk }}>
              <span className="ders-icon" style={{ background: grup.renk }}>{grup.dersIkon}</span>
              {grup.ders}
            </div>
            <div className="game-grid">
              {grup.items.map((oyun) => (
                <button key={oyun.id} className="game-card" onClick={() => onSelect(oyun.id)}>
                  <span className="game-card-emoji">{oyun.emoji}</span>
                  <span className="game-card-title">{oyun.ad}</span>
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Ödül oyunları hub'ı - GAMES kataloğunun dışında, kendi yıldız/ilerleme
// takibi olmayan bağımsız bir mini-ekran. Bu yüzden App() içinde ayrı bir
// state (odulEkrani) ile yönetiliyor, activeId/oyunTamamlandi akışına
// karışmıyor.
function OdulSecim({ onGeri, onSec }) {
  return (
    <div style={{ maxWidth: 520, margin: "0 auto", fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        .os-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-top: 22px; }
        .os-kart {
          background: white; border: none; border-radius: 22px; padding: 30px 16px; cursor: pointer;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          box-shadow: 0 4px 14px rgba(31,46,69,0.08); transition: transform 0.12s ease;
        }
        .os-kart:hover { transform: translateY(-3px); }
        .os-kart:focus-visible { outline: 3px solid #5AB4E0; outline-offset: 3px; }
        .os-emoji { font-size: 44px; }
        .os-ad { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 16px; color: #1F2E45; }
      `}</style>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={onGeri}
          style={{
            display: "flex", alignItems: "center", gap: 6, background: "white", border: "none",
            borderRadius: 999, padding: "8px 16px", cursor: "pointer", fontFamily: "'Nunito', sans-serif",
            fontWeight: 700, fontSize: 14, color: "#5C6B85", boxShadow: "0 2px 8px rgba(31,46,69,0.08)",
          }}
        >
          <ArrowLeft size={16} /> Menüye Dön
        </button>
      </div>
      <div style={{ textAlign: "center", marginTop: 18, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: "#1F2E45" }}>
        <Gift size={22} style={{ verticalAlign: "-3px", marginRight: 6 }} />
        Ödül Oyunları
      </div>
      <div style={{ textAlign: "center", color: "#5C6B85", fontSize: 14, marginTop: 4 }}>
        Ders yok, sadece keyif! Hangisini oynamak istersin?
      </div>
      <div className="os-grid">
        <button className="os-kart" onClick={() => onSec("boyama")}>
          <span className="os-emoji">🎨</span>
          <span className="os-ad">Boyama Kitabı</span>
        </button>
        <button className="os-kart" onClick={() => onSec("yapboz")}>
          <span className="os-emoji">🧩</span>
          <span className="os-ad">Yap Boz</span>
        </button>
      </div>
    </div>
  );
}

// 2. sınıf müfredatı henüz hazırlanmadı - GAMES_BY_SINIF[2] boş olduğu
// sürece Ana Ekran yerine bu basit "yakında" ekranı gösteriliyor. Ebeveyn
// yanlışlıkla boş bir ekranla karşılaşmasın, ne olduğunu net anlasın diye.
function SinifYakindaEkrani({ sinif, onEbeveynAc, on1SinifaDon }) {
  return (
    <div style={{ minHeight: "100vh", background: "#EAF6FD", padding: "32px 20px 60px", fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", maxWidth: 460, margin: "0 auto 8px" }}>
        <button
          onClick={onEbeveynAc}
          aria-label="Ebeveyn Alanı"
          style={{
            background: "white", border: "none", borderRadius: "50%", width: 38, height: 38,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            boxShadow: "0 2px 8px rgba(31,46,69,0.08)", color: "#5C6B85",
          }}
        >
          <Settings size={17} />
        </button>
      </div>
      <div style={{ maxWidth: 420, margin: "60px auto 0", textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 18 }}>🚧</div>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22, color: "#1F2E45", marginBottom: 10 }}>
          {sinif}. Sınıf içerikleri hazırlanıyor
        </div>
        <div style={{ color: "#5C6B85", fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
          {sinif}. sınıf oyunları ve soru bankaları henüz hazır değil, çok yakında burada
          olacak! Şimdilik desteklenen sınıflara dönebilirsin.
        </div>
        <button
          onClick={on1SinifaDon}
          style={{
            background: "#5AB4E0", color: "white", border: "none", borderRadius: 999,
            padding: "12px 24px", cursor: "pointer", fontFamily: "'Fredoka', sans-serif",
            fontWeight: 600, fontSize: 14,
          }}
        >
          ← 1. Sınıfa Dön
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [activeId, setActiveId] = useState(null);
  const [aktifSinif, setAktifSinif] = useState(() => aktifSinifOku());
  const [ilerleme, setIlerleme] = useState(() => ilerlemeyiOku(aktifSinif));
  const [ebeveynAcik, setEbeveynAcik] = useState(false);
  const [sekme, setSekme] = useState("gorevler");
  const [odulEkrani, setOdulEkrani] = useState(null); // null | "secim" | "boyama" | "yapboz"

  // Ebeveyn panelinden ilerleme sıfırlanabildiği, ayarlar değiştirilebildiği
  // VE aktif sınıf değiştirilebildiği için, panel kapanınca hem güncel
  // sınıfı hem de o sınıfın ilerlemesini tekrar okuyup ana ekranı
  // tazeliyoruz.
  useEffect(() => {
    if (!ebeveynAcik) {
      const guncelSinif = aktifSinifOku();
      setAktifSinif(guncelSinif);
      setIlerleme(ilerlemeyiOku(guncelSinif));
    }
  }, [ebeveynAcik]);

  function handleSinifDegistir(yeniSinif) {
    aktifSinifKaydet(yeniSinif);
    setAktifSinif(yeniSinif);
    setIlerleme(ilerlemeyiOku(yeniSinif));
    setActiveId(null);
    setOdulEkrani(null);
    setSekme("gorevler");
    setEbeveynAcik(false);
  }

  function handleGameComplete(stars) {
    const guncel = oyunTamamlandi(activeId, stars, aktifSinif);
    setIlerleme(guncel);
  }

  if (odulEkrani) {
    return (
      <div style={{ minHeight: "100vh", background: "#EAF6FD", padding: "20px 16px 60px" }}>
        {odulEkrani === "secim" && (
          <OdulSecim onGeri={() => setOdulEkrani(null)} onSec={setOdulEkrani} />
        )}
        {odulEkrani === "boyama" && <BoyamaKitabi onGeri={() => setOdulEkrani("secim")} />}
        {odulEkrani === "yapboz" && <YapBoz onGeri={() => setOdulEkrani("secim")} />}
      </div>
    );
  }

  if (!sinifIcerigiVarMi(aktifSinif)) {
    return (
      <>
        <SinifYakindaEkrani
          sinif={aktifSinif}
          onEbeveynAc={() => setEbeveynAcik(true)}
          on1SinifaDon={() => handleSinifDegistir(1)}
        />
        {ebeveynAcik && (
          <EbeveynPaneli
            sinif={aktifSinif}
            onSinifSec={handleSinifDegistir}
            onKapat={() => setEbeveynAcik(false)}
          />
        )}
      </>
    );
  }

  if (!activeId) {
    return (
      <>
        <HomeScreen
          onSelect={setActiveId}
          ilerleme={ilerleme}
          onEbeveynAc={() => setEbeveynAcik(true)}
          sekme={sekme}
          setSekme={setSekme}
          onOdulAc={() => setOdulEkrani("secim")}
          aktifSinif={aktifSinif}
        />
        {ebeveynAcik && (
          <EbeveynPaneli
            sinif={aktifSinif}
            onSinifSec={handleSinifDegistir}
            onKapat={() => setEbeveynAcik(false)}
          />
        )}
      </>
    );
  }

  const allItems = (GAMES_BY_SINIF[aktifSinif] || []).flatMap((g) => g.items);
  const active = allItems.find((o) => o.id === activeId);
  const ActiveComponent = active.Component;

  return (
    <div style={{ minHeight: "100vh", background: "#EAF6FD", padding: "20px 16px 60px" }}>
      <button
        onClick={() => setActiveId(null)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "white",
          border: "none",
          borderRadius: 999,
          padding: "8px 16px",
          margin: "0 auto 18px",
          maxWidth: 460,
          cursor: "pointer",
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          color: "#5C6B85",
          boxShadow: "0 2px 8px rgba(31,46,69,0.08)",
        }}
      >
        <ArrowLeft size={16} /> Menüye Dön
      </button>
      <ActiveComponent key={activeId} onExit={() => setActiveId(null)} onComplete={handleGameComplete} sinif={aktifSinif} />
    </div>
  );
}