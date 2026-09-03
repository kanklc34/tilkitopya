import { useState, useMemo } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { ODUL_SAHNELERI, BOYAMA_PALETI } from "../data/odulSahneleri.js";

// Küçük yaştaki çocuklar için önerilen minimum dokunma hedefi ~44-48px
// (Apple HIG / Material). Sahnelerin viewBox'ı 400 birim, ekranda tuval
// genişliği ~350-380px olduğundan oran ~0.9 - viewBox biriminde 52 hedefi
// ekranda ~47px'e denk geliyor.
const MIN_HIT_BOYUT = 58;

// Gerçek görünen şekli DEĞİŞTİRMEDEN, dokunma/tıklama alanını büyütmek
// için her şeklin kaba bir bounding box'ını (x, y, width, height) çıkarır.
// path için d string'indeki tüm sayı çiftlerini (komut kontrol noktaları
// dahil) alıp min/max x-y hesaplar - eğri kontrol noktaları gerçek şeklin
// dışında kalabileceğinden bu bbox gerçek şekli her zaman kapsar (kasıtlı
// olarak biraz cömert - amaç zaten tıklama alanını büyütmek).
function sekilBoundingBox(sekil) {
  const p = sekil.props;
  if (sekil.tip === "rect") return { x: p.x, y: p.y, width: p.width, height: p.height };
  if (sekil.tip === "circle") return { x: p.cx - p.r, y: p.cy - p.r, width: p.r * 2, height: p.r * 2 };
  if (sekil.tip === "ellipse") return { x: p.cx - p.rx, y: p.cy - p.ry, width: p.rx * 2, height: p.ry * 2 };
  if (sekil.tip === "polygon" || sekil.tip === "path") {
    const kaynak = sekil.tip === "polygon" ? p.points : p.d;
    const sayilar = (kaynak.match(/-?\d+\.?\d*/g) || []).map(Number);
    const xs = sayilar.filter((_, i) => i % 2 === 0);
    const ys = sayilar.filter((_, i) => i % 2 === 1);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }
  return { x: 0, y: 0, width: 0, height: 0 };
}

// Tek bir boyanabilir/dekoratif şekli SVG elemanına çeviren ortak bileşen.
function Sekil({ sekil, renk }) {
  const ortak = {
    fill: sekil.doluDegil ? "none" : sekil.boyanabilir ? renk : sekil.sabitRenk,
    stroke: sekil.doluDegil ? sekil.sabitRenk : "#33404F",
    strokeWidth: sekil.doluDegil ? 4 : 3,
    strokeLinecap: sekil.doluDegil ? "round" : undefined,
  };
  if (sekil.tip === "rect") return <rect x={sekil.props.x} y={sekil.props.y} width={sekil.props.width} height={sekil.props.height} rx={sekil.props.rx} {...ortak} />;
  if (sekil.tip === "circle") return <circle cx={sekil.props.cx} cy={sekil.props.cy} r={sekil.props.r} {...ortak} />;
  if (sekil.tip === "ellipse") return <ellipse cx={sekil.props.cx} cy={sekil.props.cy} rx={sekil.props.rx} ry={sekil.props.ry} {...ortak} />;
  if (sekil.tip === "polygon") return <polygon points={sekil.props.points} {...ortak} />;
  if (sekil.tip === "path") return <path d={sekil.props.d} {...ortak} />;
  return null;
}

// Görünmez ama gerçek şekilden büyük bir dokunma hedefi - boyanabilir
// şekillerin üzerine (en son, en üstte) render edilir. Görseli hiç
// etkilemez, sadece parmakla/mouse ile dokunmayı kolaylaştırır. Küçük
// şekillerin hit-area'sı büyük şekillerinkinin altında kalıp bastırılmasın
// diye çağıran taraf küçükten büyüğe sıralayıp en son (en üstte) render
// eder (bkz. hitKatmani).
function HitAlani({ sekil, onTikla }) {
  const bbox = sekilBoundingBox(sekil);
  const cx = bbox.x + bbox.width / 2;
  const cy = bbox.y + bbox.height / 2;
  const w = Math.max(bbox.width, MIN_HIT_BOYUT);
  const h = Math.max(bbox.height, MIN_HIT_BOYUT);
  return (
    <rect
      x={cx - w / 2}
      y={cy - h / 2}
      width={w}
      height={h}
      fill="transparent"
      className="boyama-hit-alani"
      style={{ cursor: "pointer", pointerEvents: "all" }}
      onClick={(e) => {
        onTikla(sekil.id);
        // Dokunma/tıklama sonrası odağı hemen kaldır - bazı tarayıcı/webview
        // motorlarında ":focus-visible" özel role="button" elemanlarında
        // dokunma ile de tetiklenebiliyor, bu da boyanan şeklin etrafında
        // kalıcı bir kutu bırakıp diğer bölgeleri görsel olarak
        // kalabalıklaştırıyordu (kullanıcı geri bildirimi). Klavye ile
        // Enter/Space basımı bu handler'ı DEĞİL, aşağıdaki onKeyDown'ı
        // tetikliyor - o yüzden Tab ile gezinen klavye kullanıcıları için
        // odak halkası hâlâ görünür kalıyor, sadece dokunma/tıklamada kayboluyor.
        e.currentTarget.blur();
      }}
      role="button"
      tabIndex={0}
      aria-label={`${sekil.id} bölgesini boya`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onTikla(sekil.id);
        }
      }}
    />
  );
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

  // Küçük şekillerin dokunma alanı en üstte kalsın diye (büyük bir şeklin
  // hit-area'sı küçük komşularını bastırmasın) alana göre küçükten büyüğe
  // sırala - en büyük en altta, en küçük en üstte render edilir.
  const hitKatmani = useMemo(() => {
    if (!sahne) return [];
    return sahne.shapes
      .filter((s) => s.boyanabilir)
      .map((s) => ({ s, bbox: sekilBoundingBox(s) }))
      .sort((a, b) => b.bbox.width * b.bbox.height - a.bbox.width * a.bbox.height)
      .map(({ s }) => s);
  }, [sahne]);

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
        .boyama-hit-alani:focus-visible { outline: 3px solid #1F2E45; outline-offset: 1px; }
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
                <Sekil key={s.id} sekil={s} renk={renkler[s.id] || "#FFFFFF"} />
              ))}
              {hitKatmani.map((s) => (
                <HitAlani key={`hit-${s.id}`} sekil={s} onTikla={sekleBoyaFn} />
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
