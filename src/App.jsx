import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Settings } from "lucide-react";

import EbeveynPaneli from "./components/EbeveynPaneli.jsx";
import { ilerlemeyiOku, oyunTamamlandi, gununGorevleri } from "./lib/progress.js";
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

// Tek yerden yönetilen oyun kayıt defteri - yeni bir oyun eklemek
// istediğinde sadece buraya bir satır eklemen yeterli.
const GAMES = [
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

function HomeScreen({ onSelect, ilerleme, onEbeveynAc, sekme, setSekme }) {
  const bugunGorevleri = gununGorevleri(ilerleme.aktifGun);
  const bugunKayit = ilerleme.gunler[ilerleme.aktifGun];
  const tamamlananSayisi = bugunGorevleri.filter((g) => bugunKayit?.gorevler?.[g.id]).length;
  const tumOyunlarAcik = ilerleme.ayarlar.tumOyunlarSekmesiAcik;
  // Ebeveyn "Tüm Oyunlar" sekmesini kapattıysa çocuk her zaman görevler
  // ekranında kalır - sekme çubuğu bile gösterilmez, seçim şansı olmaz.
  const gosterilenSekme = tumOyunlarAcik ? sekme : "gorevler";
  const [mesajYenile, setMesajYenile] = useState(0);
  const mesaj = useMemo(
    () => anaEkranMesajiSec({ tamamlananSayisi, toplamGorev: bugunGorevleri.length }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tamamlananSayisi, bugunGorevleri.length, mesajYenile]
  );

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
          margin-bottom: 18px;
          cursor: pointer;
        }
        .mascot-big {
          width: 96px;
          height: 96px;
          animation: mascotPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), mascotBob 2.2s ease-in-out 0.45s infinite;
          display: inline-block;
          filter: drop-shadow(0 6px 10px rgba(31,46,69,0.15));
        }
        .mascot-greeting:active .mascot-big { transform: scale(0.92); }
        @keyframes mascotPop {
          0% { transform: scale(0.4) translateY(20px); opacity: 0; }
          70% { transform: scale(1.08) translateY(-4px); opacity: 1; }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes mascotBob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(-3deg); }
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
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
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
          color: #9AA6BC;
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
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 2px;
        }
        .today-item {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: #F5F8FC;
          border: none;
          border-radius: 16px;
          padding: 10px 14px;
          cursor: pointer;
          min-width: 72px;
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
          color: #9AA6BC;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .tab-btn.tab-active {
          background: #5AB4E0;
          color: white;
        }
      `}</style>

      <button className="parent-btn" onClick={onEbeveynAc} aria-label="Ebeveyn Alanı">
        <Settings size={17} />
      </button>

      <div className="home-header">
        <div className="mascot-greeting" onClick={() => setMesajYenile((n) => n + 1)}>
          <img
            key={mesajYenile}
            src={`${import.meta.env.BASE_URL}fox-mascot.png`}
            className="mascot-big mascot-pop"
            alt="Tilki maskot"
          />
          <div key={`b-${mesajYenile}`} className="mascot-bubble mascot-bubble-pop">{mesaj}</div>
        </div>
        <div className="home-title">İlkokul Platformu</div>
        <div className="home-subtitle">1. Sınıf</div>
      </div>

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
        GAMES.map((grup) => (
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

export default function App() {
  const [activeId, setActiveId] = useState(null);
  const [ilerleme, setIlerleme] = useState(() => ilerlemeyiOku());
  const [ebeveynAcik, setEbeveynAcik] = useState(false);
  const [sekme, setSekme] = useState("gorevler");

  // Ebeveyn panelinden ilerleme sıfırlanabildiği ve ayarlar
  // değiştirilebildiği için, panel kapanınca en güncel veriyi tekrar
  // okuyup ana ekranı tazeliyoruz.
  useEffect(() => {
    if (!ebeveynAcik) setIlerleme(ilerlemeyiOku());
  }, [ebeveynAcik]);

  function handleGameComplete(stars) {
    const guncel = oyunTamamlandi(activeId, stars);
    setIlerleme(guncel);
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
        />
        {ebeveynAcik && <EbeveynPaneli onKapat={() => setEbeveynAcik(false)} />}
      </>
    );
  }

  const allItems = GAMES.flatMap((g) => g.items);
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
      <ActiveComponent key={activeId} onExit={() => setActiveId(null)} onComplete={handleGameComplete} />
    </div>
  );
}
