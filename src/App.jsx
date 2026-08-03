import { useState } from "react";
import { ArrowLeft } from "lucide-react";

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

function HomeScreen({ onSelect }) {
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
        }
        .mascot-big {
          width: 96px;
          height: 96px;
          animation: mascotBob 2.2s ease-in-out infinite;
          display: inline-block;
          filter: drop-shadow(0 6px 10px rgba(31,46,69,0.15));
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
      `}</style>

      <div className="home-header">
        <div className="mascot-greeting">
          <img src={`${import.meta.env.BASE_URL}fox-mascot.svg`} className="mascot-big" alt="Tilki maskot" />
          <div className="mascot-bubble">Merhaba! Bugün ne oynamak istersin?</div>
        </div>
        <div className="home-title">İlkokul Platformu</div>
        <div className="home-subtitle">1. Sınıf</div>
      </div>

      {GAMES.map((grup) => (
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
      ))}
    </div>
  );
}

export default function App() {
  const [activeId, setActiveId] = useState(null);

  if (!activeId) {
    return <HomeScreen onSelect={setActiveId} />;
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
      <ActiveComponent key={activeId} onExit={() => setActiveId(null)} />
    </div>
  );
}
