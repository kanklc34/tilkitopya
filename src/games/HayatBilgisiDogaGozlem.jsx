import { useState, useCallback, useRef, useEffect } from "react";
import { Star, Trophy, RotateCcw } from "lucide-react";

// ---- Oyun ayarları ----
const DECOY_POOL = ["🍃", "☁️", "🌸", "🪨", "🍂", "🌿"];
const TARGET_POOL = ["🐛", "🐞", "🦋", "🐝", "🐌"];
// Tur büyüdükçe sahne kalabalıklaşıyor ve bulunacak hedef sayısı artıyor
const ROUNDS = [
  { decoyCount: 12, targetCount: 2 }, // tur1: az kalabalık, 2 hedef
  { decoyCount: 18, targetCount: 3 }, // tur2
  { decoyCount: 26, targetCount: 4 }, // tur3: en kalabalık, 4 hedef
];
const TOTAL_ROUNDS = ROUNDS.length;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Kartlar üst üste binmesin diye sahneyi görünmez bir ızgaraya bölüp
// her hücreye hafif rastgele kaydırma (jitter) uyguluyoruz - sonuç
// hizalı bir grid değil, dağınık/organik bir sahne gibi görünüyor.
function buildScene(round) {
  const { decoyCount, targetCount } = ROUNDS[round];
  const total = decoyCount + targetCount;
  const cols = Math.ceil(Math.sqrt(total * 1.4));
  const rows = Math.ceil(total / cols);
  const cellW = 100 / cols;
  const cellH = 100 / rows;

  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) cells.push({ r, c });
  }
  const chosenCells = shuffle(cells).slice(0, total);

  const decoyEmoji1 = DECOY_POOL[Math.floor(Math.random() * DECOY_POOL.length)];
  let decoyEmoji2 = decoyEmoji1;
  while (decoyEmoji2 === decoyEmoji1) decoyEmoji2 = DECOY_POOL[Math.floor(Math.random() * DECOY_POOL.length)];
  const targetEmoji = TARGET_POOL[Math.floor(Math.random() * TARGET_POOL.length)];

  const items = chosenCells.map((cell, i) => {
    const isTarget = i < targetCount;
    const jitterX = (Math.random() - 0.5) * cellW * 0.5;
    const jitterY = (Math.random() - 0.5) * cellH * 0.5;
    return {
      id: `item-${i}`,
      x: cell.c * cellW + cellW / 2 + jitterX,
      y: cell.r * cellH + cellH / 2 + jitterY,
      rotate: Math.random() * 40 - 20,
      emoji: isTarget ? targetEmoji : Math.random() < 0.5 ? decoyEmoji1 : decoyEmoji2,
      isTarget,
    };
  });

  return { items: shuffle(items), targetEmoji, targetCount };
}


// Basit, dosyasız sesli geri bildirim (Web Audio) - ortak desen
function playTone(kind) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = kind === "correct" ? [523.25, 659.25, 783.99] : [220, 180];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = kind === "correct" ? "triangle" : "sine";
      osc.frequency.value = freq;
      const start = ctx.currentTime + i * 0.09;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.16, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.2);
    });
    setTimeout(() => ctx.close(), 600);
  } catch {
    // ses desteklenmiyorsa sessizce geç
  }
}

export default function NatureObserveGame({ onExit, onComplete } = {}) {
  const [round, setRound] = useState(0);
  const [scene, setScene] = useState(() => buildScene(0));
  const [foundIds, setFoundIds] = useState(new Set());
  const [wrongPulseId, setWrongPulseId] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [pesPeseYanlis, setPesPeseYanlis] = useState(0);
  const [ipucuHedefId, setIpucuHedefId] = useState(null);
  const [roundDone, setRoundDone] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [paused, setPaused] = useState(false);
  const wrongTimeout = useRef(null);
  const ipucuTimeout = useRef(null);

  const startRound = useCallback((r) => {
    setScene(buildScene(r));
    setFoundIds(new Set());
    setRoundDone(false);
    setPesPeseYanlis(0);
    setIpucuHedefId(null);
  }, []);

  function handleTap(item) {
    if (paused || finished || roundDone || foundIds.has(item.id)) return;

    if (item.isTarget) {
      if (soundOn) playTone("correct");
      const next = new Set(foundIds);
      next.add(item.id);
      setFoundIds(next);
      setPesPeseYanlis(0);
      setIpucuHedefId(null);
      if (next.size >= scene.targetCount) {
        setTimeout(() => setRoundDone(true), 500);
      }
    } else {
      if (soundOn) playTone("wrong");
      setMistakes((m) => m + 1);
      setWrongPulseId(item.id);
      clearTimeout(wrongTimeout.current);
      wrongTimeout.current = setTimeout(() => setWrongPulseId(null), 350);

      const yeniDeneme = pesPeseYanlis + 1;
      setPesPeseYanlis(yeniDeneme);

      if (yeniDeneme >= 4) {
        const kalanHedefler = scene.items.filter((it) => it.isTarget && !foundIds.has(it.id));
        if (kalanHedefler.length > 0) {
          const secilen = kalanHedefler[Math.floor(Math.random() * kalanHedefler.length)];
          setIpucuHedefId(secilen.id);
          clearTimeout(ipucuTimeout.current);
          ipucuTimeout.current = setTimeout(() => setIpucuHedefId(null), 1500);
        }
        setPesPeseYanlis(0);
      }
    }
  }

  function nextRound() {
    if (round + 1 >= TOTAL_ROUNDS) {
      setFinished(true);
    } else {
      const r = round + 1;
      setRound(r);
      startRound(r);
    }
  }

  function restart() {
    setRound(0);
    setMistakes(0);
    setFinished(false);
    startRound(0);
  }

  const stars = mistakes === 0 ? 3 : mistakes <= 4 ? 2 : 1;

  const reportedRef = useRef(false);
  useEffect(() => {
    if (finished && !reportedRef.current) {
      reportedRef.current = true;
      onComplete?.(stars);
    }
  }, [finished, stars, onComplete]);

  return (
    <div className="find-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;700;800&display=swap');

        .find-root {
          --bg: #EAF6FD;
          --card: #FFFFFF;
          --ink: #1F2E45;
          --ink-soft: #5C6B85;
          --sun: #FFC93C;
          --grass: #6FBF73;
          --grass-dark: #4E9F53;
          --scene-bg: #DCF3DE;
          font-family: 'Nunito', sans-serif;
          color: var(--ink);
          background: var(--bg);
          border-radius: 28px;
          padding: 26px 22px;
          max-width: 460px;
          margin: 0 auto;
          box-shadow: 0 10px 32px rgba(31,46,69,0.12);
          position: relative;
        }

        .top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 19px;
        }
        .brand-emoji { font-size: 26px; }
        .brand-emoji-img { width: 26px; height: 26px; }
        .round-pill {
          background: var(--sun);
          color: var(--ink);
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 13px;
          padding: 5px 12px;
          border-radius: 999px;
        }
        .top-right { display: flex; align-items: center; gap: 8px; }
        .icon-btn {
          border: none;
          background: var(--card);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          box-shadow: 0 2px 6px rgba(31,46,69,0.1);
        }

        .target-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: var(--card);
          border-radius: 16px;
          padding: 10px 16px;
          margin-bottom: 14px;
          box-shadow: 0 4px 12px rgba(31,46,69,0.08);
        }
        .target-label {
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: var(--ink-soft);
        }
        .target-emoji { font-size: 24px; }
        .target-dots { display: flex; gap: 5px; }
        .target-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid var(--grass-dark);
          background: transparent;
          transition: background 0.2s ease;
        }
        .target-dot.filled { background: var(--grass-dark); }

        .scene {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          background: var(--scene-bg);
          border-radius: 18px;
          overflow: hidden;
        }
        .scene-item {
          position: absolute;
          transform: translate(-50%, -50%);
          font-size: 24px;
          background: none;
          border: none;
          cursor: pointer;
          line-height: 1;
          padding: 6px;
          transition: opacity 0.25s ease, transform 0.2s ease;
        }
        .scene-item.is-found {
          opacity: 0;
          pointer-events: none;
        }
        .scene-item.is-wrong {
          animation: pulseWrong 0.35s ease;
        }
        .scene-item.is-hint {
          animation: pulseHint 0.6s ease infinite;
          filter: drop-shadow(0 0 8px #FFC93C);
        }
        @keyframes pulseHint {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.25); }
        }
        @keyframes pulseWrong {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(0.8); }
        }

        .round-overlay, .finish-overlay, .tutorial-overlay {
          position: absolute;
          inset: 0;
          background: rgba(31,46,69,0.93);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          border-radius: 28px;
          gap: 8px;
          text-align: center;
          padding: 26px 22px;
          z-index: 10;
        }
        .finish-title {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 24px;
        }
        .finish-stars { display: flex; gap: 6px; margin: 8px 0; }
        .primary-btn {
          margin-top: 12px;
          background: var(--sun);
          color: var(--ink);
          border: none;
          padding: 12px 24px;
          border-radius: 999px;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 15px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .secondary-btn {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.75);
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 13px;
          margin-top: 6px;
          cursor: pointer;
          text-decoration: underline;
        }
        .tutorial-emoji { font-size: 38px; }
        .tutorial-emoji-img { width: 44px; height: 44px; }
        .tutorial-steps {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 10px 0 4px;
          width: 100%;
        }
        .tutorial-step {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 10px 14px;
          font-size: 14px;
          text-align: left;
        }
        .tutorial-step-icon { font-size: 20px; flex-shrink: 0; }
      `}</style>

      <div className="top-row">
        <div className="brand"><img src={`${import.meta.env.BASE_URL}fox-mascot.png`} className="brand-emoji-img" alt="Tilki" /> Doğa Gözlemi</div>
        <div className="top-right">
          <span className="round-pill">Tur {round + 1}/{TOTAL_ROUNDS}</span>
          <button className="icon-btn" onClick={() => setSoundOn((s) => !s)} aria-label="Ses aç/kapat">{soundOn ? "🔊" : "🔇"}</button>
          <button className="icon-btn" onClick={() => setPaused(true)} aria-label="Duraklat">⏸️</button>
        </div>
      </div>

      <div className="target-bar">
        <span className="target-label">Bul:</span>
        <span className="target-emoji">{scene.targetEmoji}</span>
        <div className="target-dots">
          {Array.from({ length: scene.targetCount }).map((_, i) => (
            <span key={i} className={`target-dot ${i < foundIds.size ? "filled" : ""}`} />
          ))}
        </div>
      </div>

      <div className="scene">
        {scene.items.map((item) => (
          <button
            key={item.id}
            className={`scene-item ${foundIds.has(item.id) ? "is-found" : ""} ${wrongPulseId === item.id ? "is-wrong" : ""} ${ipucuHedefId === item.id ? "is-hint" : ""}`}
            style={{ left: `${item.x}%`, top: `${item.y}%`, transform: `translate(-50%, -50%) rotate(${item.rotate}deg)` }}
            onClick={() => handleTap(item)}
          >
            {item.emoji}
          </button>
        ))}
      </div>

      {roundDone && !finished && (
        <div className="round-overlay">
          <Trophy size={40} color="#FFC93C" />
          <div className="finish-title">Tur {round + 1} tamam!</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Hepsini buldun!</div>
          <button className="primary-btn" onClick={nextRound}>
            {round + 1 >= TOTAL_ROUNDS ? "Bitir" : "Sonraki Tur"}
          </button>
        </div>
      )}

      {finished && (
        <div className="finish-overlay">
          <Trophy size={44} color="#FFC93C" />
          <div className="finish-title">Hepsini buldun!</div>
          <div className="finish-stars">
            {[1, 2, 3].map((i) => (
              <Star key={i} size={28} fill={i <= stars ? "#FFC93C" : "none"} stroke="#FFC93C" />
            ))}
          </div>
          <div style={{ fontFamily: "Nunito", fontSize: 14, opacity: 0.9 }}>
            {mistakes === 0 ? "Hiç yanlışın yok, harikasın!" : `${mistakes} kere zorlandın, sorun değil!`}
          </div>
          <button className="primary-btn" onClick={restart}>
            <RotateCcw size={16} /> Tekrar Oyna
          </button>
      <button className="secondary-btn" onClick={onExit}>Menüye Dön</button>
        </div>
      )}

      {showTutorial && (
        <div className="tutorial-overlay">
          <img src={`${import.meta.env.BASE_URL}fox-mascot.png`} className="tutorial-emoji-img" alt="Tilki" />
          <div className="finish-title">Nasıl Oynanır?</div>
          <div className="tutorial-steps">
            <div className="tutorial-step">
              <span className="tutorial-step-icon">🔍</span>
              <span>Üstteki nesneyi sahnede ara</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">👉</span>
              <span>Bulduğunda ona dokun</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">✅</span>
              <span>Hepsini bulunca tur biter!</span>
            </div>
          </div>
          <button className="primary-btn" onClick={() => setShowTutorial(false)}>
            Başla!
          </button>
        </div>
      )}

      {paused && (
        <div className="tutorial-overlay">
          <div className="tutorial-emoji">⏸️</div>
          <div className="finish-title">Duraklatıldı</div>
          <button className="primary-btn" onClick={() => setPaused(false)}>
            ▶️ Devam Et
          </button>
          <button className="secondary-btn" onClick={() => (onExit ? onExit() : setPaused(false))}>
            Oyundan Çık
          </button>
        </div>
      )}
    </div>
  );
}
