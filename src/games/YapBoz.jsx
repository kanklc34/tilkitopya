import { useState, useEffect, useRef } from "react";
import { ArrowLeft, PartyPopper } from "lucide-react";
import { ODUL_SAHNELERI, sahneSvgMetni, sahneVarsayilanRenkleri } from "../data/odulSahneleri.js";

const ZORLUKLAR = [
  { boyut: 2, ad: "Kolay", altBaslik: "4 parça" },
  { boyut: 3, ad: "Orta", altBaslik: "9 parça" },
  { boyut: 4, ad: "Zor", altBaslik: "16 parça" },
];

const TUVAL_BOYUTU = 480;

// Sahneyi (renkli/tamamlanmış haliyle) bir <img> üzerinden canvas'a çizip
// tek parça bir PNG'ye dönüştürür. Yap Boz parçaları bu tek resmi
// background-position ile dilimleyerek gösteriyor - klasik "sprite" tekniği.
function sahneyiResimYap(sahne) {
  return new Promise((resolve, reject) => {
    const svgMetni = sahneSvgMetni(sahne, sahneVarsayilanRenkleri(sahne));
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = TUVAL_BOYUTU;
      canvas.height = TUVAL_BOYUTU;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, TUVAL_BOYUTU, TUVAL_BOYUTU);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMetni)}`;
  });
}

function karistir(boyut) {
  const toplam = boyut * boyut;
  const dizi = Array.from({ length: toplam }, (_, i) => i);
  // Fisher-Yates, ama başlangıçtaki sıralı (çözülmüş) haliyle aynı
  // çıkarsa tekrar karıştır - oyun hemen "bitmiş" başlamasın.
  do {
    for (let i = dizi.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dizi[i], dizi[j]] = [dizi[j], dizi[i]];
    }
  } while (toplam > 1 && dizi.every((v, i) => v === i));
  return dizi;
}

function SahneSecici({ onSec }) {
  return (
    <div className="yb-secici-grid">
      {ODUL_SAHNELERI.map((s) => (
        <button key={s.id} className="yb-sahne-kart" onClick={() => onSec(s.id)}>
          <span className="yb-sahne-emoji">{s.emoji}</span>
          <span className="yb-sahne-ad">{s.ad}</span>
        </button>
      ))}
    </div>
  );
}

export default function YapBoz({ onGeri }) {
  const [seciliSahneId, setSeciliSahneId] = useState(null);
  const [zorluk, setZorluk] = useState(null);
  const [resimUrlMap, setResimUrlMap] = useState({});
  const [yukleniyor, setYukleniyor] = useState(false);
  const [dizilim, setDizilim] = useState(null);
  const [seciliPozisyon, setSeciliPozisyon] = useState(null);
  const [tamamlandi, setTamamlandi] = useState(false);
  const geriBtnRef = useRef(null);

  const sahne = ODUL_SAHNELERI.find((s) => s.id === seciliSahneId);
  const resimUrl = seciliSahneId ? resimUrlMap[seciliSahneId] : null;

  useEffect(() => {
    if (!sahne || resimUrlMap[sahne.id]) return;
    setYukleniyor(true);
    sahneyiResimYap(sahne)
      .then((url) => {
        setResimUrlMap((prev) => ({ ...prev, [sahne.id]: url }));
        setYukleniyor(false);
      })
      .catch(() => setYukleniyor(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sahne?.id]);

  function zorlukSec(boyut) {
    setZorluk(boyut);
    setDizilim(karistir(boyut));
    setSeciliPozisyon(null);
    setTamamlandi(false);
  }

  function parcayaTikla(pozisyon) {
    if (tamamlandi) return;
    if (seciliPozisyon === null) {
      setSeciliPozisyon(pozisyon);
      return;
    }
    if (seciliPozisyon === pozisyon) {
      setSeciliPozisyon(null);
      return;
    }
    const yeni = [...dizilim];
    [yeni[seciliPozisyon], yeni[pozisyon]] = [yeni[pozisyon], yeni[seciliPozisyon]];
    setDizilim(yeni);
    setSeciliPozisyon(null);
    if (yeni.every((v, i) => v === i)) setTamamlandi(true);
  }

  function zorlukEkraninaDon() {
    setZorluk(null);
    setDizilim(null);
    setSeciliPozisyon(null);
    setTamamlandi(false);
  }

  function sahneyeDon() {
    setSeciliSahneId(null);
    zorlukEkraninaDon();
  }

  function geriTikla() {
    if (!sahne) return onGeri();
    if (zorluk) return zorlukEkraninaDon();
    return sahneyeDon();
  }

  return (
    <div className="yb-root">
      <style>{`
        .yb-root { max-width: 520px; margin: 0 auto; font-family: 'Nunito', sans-serif; }
        .yb-baslik-row { display: flex; align-items: center; gap: 10px; justify-content: center; margin-bottom: 18px; }
        .yb-baslik { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 22px; color: #1F2E45; text-align: center; }
        .yb-alt-baslik { text-align: center; color: #5C6B85; font-size: 14px; margin-bottom: 22px; }
        .yb-geri-btn {
          display: flex; align-items: center; gap: 6px; background: white; border: none;
          border-radius: 999px; padding: 8px 16px; cursor: pointer; font-family: 'Nunito', sans-serif;
          font-weight: 700; font-size: 14px; color: #5C6B85; box-shadow: 0 2px 8px rgba(31,46,69,0.08);
        }
        .yb-geri-btn:focus-visible { outline: 3px solid #5AB4E0; outline-offset: 2px; }
        .yb-secici-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; }
        .yb-sahne-kart {
          background: white; border: none; border-radius: 20px; padding: 26px 14px;
          cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 10px;
          box-shadow: 0 4px 14px rgba(31,46,69,0.08); transition: transform 0.12s ease;
        }
        .yb-sahne-kart:hover { transform: translateY(-3px); }
        .yb-sahne-kart:focus-visible { outline: 3px solid #5AB4E0; outline-offset: 3px; }
        .yb-sahne-emoji { font-size: 40px; }
        .yb-sahne-ad { font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 15px; color: #1F2E45; }
        .yb-zorluk-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 14px; }
        .yb-zorluk-kart {
          background: white; border: none; border-radius: 18px; padding: 20px 12px; cursor: pointer;
          box-shadow: 0 4px 14px rgba(31,46,69,0.08); font-family: 'Fredoka', sans-serif;
        }
        .yb-zorluk-kart:focus-visible { outline: 3px solid #5AB4E0; outline-offset: 2px; }
        .yb-zorluk-ad { font-weight: 700; font-size: 16px; color: #1F2E45; display: block; }
        .yb-zorluk-alt { font-weight: 500; font-size: 12px; color: #5C6B85; margin-top: 4px; display: block; }
        .yb-yukleniyor { text-align: center; color: #5C6B85; padding: 40px 0; font-weight: 700; }
        .yb-puzzle-wrap { background: white; border-radius: 24px; padding: 14px; box-shadow: 0 4px 14px rgba(31,46,69,0.08); }
        .yb-puzzle-grid {
          display: grid; gap: 3px; background: #1F2E45; border-radius: 14px; overflow: hidden; aspect-ratio: 1 / 1;
        }
        .yb-parca {
          border: none; padding: 0; cursor: pointer; background-repeat: no-repeat;
        }
        .yb-parca.yb-parca-secili { outline: 4px solid #FFD93C; outline-offset: -4px; }
        .yb-parca:focus-visible { outline: 4px solid #5AB4E0; outline-offset: -4px; }
        .yb-tamamlandi {
          margin-top: 16px; text-align: center; background: #E4F7E6; border-radius: 16px; padding: 16px;
          font-family: 'Fredoka', sans-serif; font-weight: 700; color: #2E7D32; display: flex;
          align-items: center; justify-content: center; gap: 8px; font-size: 15px;
        }
        .yb-tekrar-btn {
          margin: 14px auto 0; display: block; background: #5AB4E0; color: white; border: none;
          border-radius: 999px; padding: 10px 22px; cursor: pointer; font-family: 'Fredoka', sans-serif;
          font-weight: 600; font-size: 13px;
        }
      `}</style>

      <div className="yb-baslik-row">
        <button ref={geriBtnRef} className="yb-geri-btn" onClick={geriTikla}>
          <ArrowLeft size={16} /> {!sahne ? "Geri" : zorluk ? "Zorluk Seç" : "Sahneler"}
        </button>
      </div>

      {!sahne && (
        <>
          <div className="yb-baslik">🧩 Yap Boz</div>
          <div className="yb-alt-baslik">Bir sahne seç, sonra parçaları birleştir!</div>
          <SahneSecici onSec={setSeciliSahneId} />
        </>
      )}

      {sahne && !zorluk && (
        <>
          <div className="yb-baslik">{sahne.emoji} {sahne.ad}</div>
          <div className="yb-alt-baslik">Kaç parça olsun?</div>
          <div className="yb-zorluk-grid">
            {ZORLUKLAR.map((z) => (
              <button key={z.boyut} className="yb-zorluk-kart" onClick={() => zorlukSec(z.boyut)}>
                <span className="yb-zorluk-ad">{z.ad}</span>
                <span className="yb-zorluk-alt">{z.altBaslik}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {sahne && zorluk && (
        yukleniyor || !resimUrl ? (
          <div className="yb-yukleniyor">Hazırlanıyor…</div>
        ) : (
          <div className="yb-puzzle-wrap">
            <div
              className="yb-puzzle-grid"
              style={{ gridTemplateColumns: `repeat(${zorluk}, 1fr)` }}
            >
              {dizilim.map((parcaIndex, pozisyon) => {
                const satir = Math.floor(parcaIndex / zorluk);
                const sutun = parcaIndex % zorluk;
                const bgX = zorluk === 1 ? 0 : (sutun / (zorluk - 1)) * 100;
                const bgY = zorluk === 1 ? 0 : (satir / (zorluk - 1)) * 100;
                return (
                  <button
                    key={pozisyon}
                    className={`yb-parca ${seciliPozisyon === pozisyon ? "yb-parca-secili" : ""}`}
                    style={{
                      backgroundImage: `url(${resimUrl})`,
                      backgroundSize: `${zorluk * 100}% ${zorluk * 100}%`,
                      backgroundPosition: `${bgX}% ${bgY}%`,
                    }}
                    aria-label={`Bulmaca parçası, konum ${pozisyon + 1}`}
                    aria-pressed={seciliPozisyon === pozisyon}
                    onClick={() => parcayaTikla(pozisyon)}
                  />
                );
              })}
            </div>
            {tamamlandi && (
              <div className="yb-tamamlandi">
                <PartyPopper size={18} /> Harika, bulmacayı tamamladın!
              </div>
            )}
            <button className="yb-tekrar-btn" onClick={() => zorlukSec(zorluk)}>
              🔀 Karıştır, Tekrar Oyna
            </button>
          </div>
        )
      )}
    </div>
  );
}
