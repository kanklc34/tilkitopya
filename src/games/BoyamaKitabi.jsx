import { useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { ODUL_SAHNELERI, BOYAMA_PALETI } from "../data/odulSahneleri.js";

// Tek bir boyanabilir/dekoratif şekli SVG elemanına çeviren ortak bileşen.
function Sekil({ sekil, renk, onTikla }) {
  const ortak = {
    fill: sekil.doluDegil ? "none" : sekil.boyanabilir ? renk : sekil.sabitRenk,
    stroke: sekil.doluDegil ? sekil.sabitRenk : "#33404F",
    strokeWidth: sekil.doluDegil ? 4 : 3,
    strokeLinecap: sekil.doluDegil ? "round" : undefined,
    onClick: sekil.boyanabilir ? () => onTikla(sekil.id) : undefined,
    role: sekil.boyanabilir ? "button" : undefined,
    tabIndex: sekil.boyanabilir ? 0 : undefined,
    "aria-label": sekil.boyanabilir ? `${sekil.id} bölgesini boya` : undefined,
    onKeyDown: sekil.boyanabilir
      ? (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onTikla(sekil.id);
          }
        }
      : undefined,
    style: sekil.boyanabilir ? { cursor: "pointer" } : undefined,
    className: sekil.boyanabilir ? "boyama-sekil" : undefined,
  };
  if (sekil.tip === "rect") return <rect x={sekil.props.x} y={sekil.props.y} width={sekil.props.width} height={sekil.props.height} rx={sekil.props.rx} {...ortak} />;
  if (sekil.tip === "circle") return <circle cx={sekil.props.cx} cy={sekil.props.cy} r={sekil.props.r} {...ortak} />;
  if (sekil.tip === "ellipse") return <ellipse cx={sekil.props.cx} cy={sekil.props.cy} rx={sekil.props.rx} ry={sekil.props.ry} {...ortak} />;
  if (sekil.tip === "polygon") return <polygon points={sekil.props.points} {...ortak} />;
  if (sekil.tip === "path") return <path d={sekil.props.d} {...ortak} />;
  return null;
}

function SahneSecici({ onSec }) {
  return (
    <div className="bk-secici-grid">
      {ODUL_SAHNELERI.map((s) => (
        <button key={s.id} className="bk-sahne-kart" onClick={() => onSec(s.id)}>
          <span className="bk-sahne-emoji">{s.emoji}</span>
          <span className="bk-sahne-ad">{s.ad}</span>
        </button>
      ))}
    </div>
  );
}

export default function BoyamaKitabi({ onGeri }) {
  const [seciliSahneId, setSeciliSahneId] = useState(null);
  const [renklerMap, setRenklerMap] = useState({});
  const [seciliRenk, setSeciliRenk] = useState(BOYAMA_PALETI[0]);

  const sahne = ODUL_SAHNELERI.find((s) => s.id === seciliSahneId);
  const renkler = renklerMap[seciliSahneId] || {};

  function sekleBoyaFn(shapeId) {
    setRenklerMap((prev) => ({
      ...prev,
      [seciliSahneId]: { ...(prev[seciliSahneId] || {}), [shapeId]: seciliRenk },
    }));
  }

  function temizle() {
    setRenklerMap((prev) => ({ ...prev, [seciliSahneId]: {} }));
  }

  return (
    <div className="bk-root">
      <style>{`
        .bk-root { max-width: 560px; margin: 0 auto; font-family: 'Nunito', sans-serif; }
        .bk-baslik-row {
          display: flex; align-items: center; gap: 10px; justify-content: center;
          margin-bottom: 18px;
        }
        .bk-baslik {
          font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 22px; color: #1F2E45;
          text-align: center;
        }
        .bk-alt-baslik { text-align: center; color: #5C6B85; font-size: 14px; margin-bottom: 22px; }
        .bk-secici-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 14px;
        }
        .bk-sahne-kart {
          background: white; border: none; border-radius: 20px; padding: 26px 14px;
          cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 10px;
          box-shadow: 0 4px 14px rgba(31,46,69,0.08); transition: transform 0.12s ease;
        }
        .bk-sahne-kart:hover { transform: translateY(-3px); }
        .bk-sahne-kart:focus-visible { outline: 3px solid #5AB4E0; outline-offset: 3px; }
        .bk-sahne-emoji { font-size: 40px; }
        .bk-sahne-ad { font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 15px; color: #1F2E45; }
        .bk-geri-btn {
          display: flex; align-items: center; gap: 6px; background: white; border: none;
          border-radius: 999px; padding: 8px 16px; cursor: pointer; font-family: 'Nunito', sans-serif;
          font-weight: 700; font-size: 14px; color: #5C6B85; box-shadow: 0 2px 8px rgba(31,46,69,0.08);
        }
        .bk-geri-btn:focus-visible { outline: 3px solid #5AB4E0; outline-offset: 2px; }
        .bk-tuval-wrap {
          background: white; border-radius: 24px; padding: 14px; box-shadow: 0 4px 14px rgba(31,46,69,0.08);
          margin-bottom: 18px;
        }
        .bk-tuval-wrap svg { width: 100%; height: auto; display: block; border-radius: 16px; }
        .boyama-sekil:focus-visible { outline: 3px solid #1F2E45; outline-offset: 1px; }
        .bk-alt-bar { display: flex; align-items: center; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .bk-palet { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
        .bk-renk-btn {
          width: 34px; height: 34px; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 6px rgba(31,46,69,0.18);
          border: 3px solid transparent;
        }
        .bk-renk-btn.bk-renk-secili { border-color: #1F2E45; transform: scale(1.12); }
        .bk-renk-btn:focus-visible { outline: 3px solid #1F2E45; outline-offset: 2px; }
        .bk-temizle-btn {
          display: flex; align-items: center; gap: 6px; background: #F5F8FC; border: none;
          border-radius: 999px; padding: 10px 18px; cursor: pointer; font-family: 'Fredoka', sans-serif;
          font-weight: 600; font-size: 13px; color: #5C6B85;
        }
        .bk-temizle-btn:focus-visible { outline: 3px solid #5AB4E0; outline-offset: 2px; }
      `}</style>

      {!sahne ? (
        <>
          <div className="bk-baslik-row">
            <button className="bk-geri-btn" onClick={onGeri}>
              <ArrowLeft size={16} /> Geri
            </button>
          </div>
          <div className="bk-baslik">🎨 Boyama Kitabı</div>
          <div className="bk-alt-baslik">Bir sahne seç, renklendirmeye başla!</div>
          <SahneSecici onSec={setSeciliSahneId} />
        </>
      ) : (
        <>
          <div className="bk-baslik-row">
            <button className="bk-geri-btn" onClick={() => setSeciliSahneId(null)}>
              <ArrowLeft size={16} /> Sahne Seç
            </button>
          </div>
          <div className="bk-tuval-wrap">
            <svg viewBox={sahne.viewBox} role="img" aria-label={sahne.ad}>
              {sahne.shapes.map((s) => (
                <Sekil key={s.id} sekil={s} renk={renkler[s.id] || "#FFFFFF"} onTikla={sekleBoyaFn} />
              ))}
            </svg>
          </div>
          <div className="bk-alt-bar">
            <div className="bk-palet">
              {BOYAMA_PALETI.map((renk) => (
                <button
                  key={renk}
                  className={`bk-renk-btn ${seciliRenk === renk ? "bk-renk-secili" : ""}`}
                  style={{ background: renk, borderColor: renk === "#FFFFFF" ? "#D8DFE8" : undefined }}
                  onClick={() => setSeciliRenk(renk)}
                  aria-label={`Renk seç: ${renk}`}
                  aria-pressed={seciliRenk === renk}
                />
              ))}
            </div>
            <button className="bk-temizle-btn" onClick={temizle}>
              <RotateCcw size={14} /> Temizle
            </button>
          </div>
        </>
      )}
    </div>
  );
}
