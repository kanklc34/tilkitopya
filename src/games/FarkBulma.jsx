import { useState, useCallback } from "react";
import { Star, Trophy, RotateCcw } from "lucide-react";

// ---- Oyun ayarları ----
// Fark, birbirinden kategorik olarak uzak (araba/elma gibi) değil, aynı
// "aile"den seçiliyor (hepsi meyve, hepsi hayvan vb.) - bu taramayı/dikkati
// gerçekten gerektiriyor ama hâlâ net bir fark, belirsizlik yok.
const CONFUSABLE_GROUPS = [
  ["🍎", "🍊", "🍇", "🍓", "🍌"],
  ["🐶", "🐱", "🐭", "🐰", "🐻"],
  ["⭐", "🌙", "☀️", "✨", "🌟"],
  ["🚗", "🚕", "🚙", "🚓", "🚌"],
];
const PUZZLES_PER_ROUND = 3;
// Tur büyüdükçe ızgara büyüyor (daha çok tarama/dikkat gerekiyor)
const ROUNDS = [
  { total: 6, columns: 3 }, // tur1: 3x2
  { total: 9, columns: 3 }, // tur2: 3x3
  { total: 16, columns: 4 }, // tur3: 4x4 - en zor
];
const TOTAL_ROUNDS = ROUNDS.length;

function pickTwoDistinct(pool) {
  const a = pool[Math.floor(Math.random() * pool.length)];
  let b = a;
  while (b === a) b = pool[Math.floor(Math.random() * pool.length)];
  return [a, b];
}

function buildGrid(round) {
  const { total } = ROUNDS[round];
  const group = CONFUSABLE_GROUPS[Math.floor(Math.random() * CONFUSABLE_GROUPS.length)];
  const [base, odd] = pickTwoDistinct(group);
  const oddIndex = Math.floor(Math.random() * total);
  return Array.from({ length: total }, (_, i) => ({
    id: i,
    emoji: i === oddIndex ? odd : base,
    isOdd: i === oddIndex,
  }));
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

export default function OddOneOutGame({ onExit } = {}) {
  const [round, setRound] = useState(0);
  const [puzzleInRound, setPuzzleInRound] = useState(0);
  const [grid, setGrid] = useState(() => buildGrid(0));
  const [wrongId, setWrongId] = useState(null);
  const [correctId, setCorrectId] = useState(null);
  const [locked, setLocked] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [paused, setPaused] = useState(false);

  const nextPuzzle = useCallback((r) => {
    setGrid(buildGrid(r));
    setWrongId(null);
    setCorrectId(null);
    setLocked(false);
  }, []);

  function handleTap(cell) {
    if (locked || paused || finished) return;

    if (cell.isOdd) {
      setLocked(true);
      setCorrectId(cell.id);
      if (soundOn) playTone("correct");
      setTimeout(() => {
        if (puzzleInRound + 1 >= PUZZLES_PER_ROUND) {
          if (round + 1 >= TOTAL_ROUNDS) {
            setFinished(true);
          } else {
            const r = round + 1;
            setRound(r);
            setPuzzleInRound(0);
            nextPuzzle(r, 0);
          }
        } else {
          const p = puzzleInRound + 1;
          setPuzzleInRound(p);
          nextPuzzle(round, p);
        }
      }, 700);
    } else {
      setWrongId(cell.id);
      setMistakes((m) => m + 1);
      if (soundOn) playTone("wrong");
      setTimeout(() => setWrongId(null), 450);
    }
  }

  function restart() {
    setRound(0);
    setPuzzleInRound(0);
    setMistakes(0);
    setFinished(false);
    nextPuzzle(0, 0);
  }

  const stars = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;
  const totalPuzzles = TOTAL_ROUNDS * PUZZLES_PER_ROUND;
  const solvedCount = round * PUZZLES_PER_ROUND + puzzleInRound;

  return (
    <div className="odd-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;700;800&display=swap');

        .odd-root {
          --bg: #EAF6FD;
          --card: #FFFFFF;
          --ink: #1F2E45;
          --ink-soft: #5C6B85;
          --sun: #FFC93C;
          --grass: #6FBF73;
          --grass-dark: #4E9F53;
          --wrong: #D9534F;
          --track-bg: #D8ECF7;
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
          margin-bottom: 16px;
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

        .prompt {
          text-align: center;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 17px;
          color: var(--ink-soft);
          margin-bottom: 14px;
        }

        .progress-track {
          display: flex;
          gap: 4px;
          margin-bottom: 18px;
        }
        .progress-flag {
          flex: 1;
          height: 8px;
          border-radius: 4px;
          background: rgba(31,46,69,0.12);
          transition: background 0.3s ease;
        }
        .progress-flag.filled { background: var(--grass-dark); }

        .grid {
          display: grid;
          gap: 10px;
        }
        .cell {
          aspect-ratio: 1 / 1;
          background: var(--card);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 0 rgba(31,46,69,0.1), 0 5px 12px rgba(31,46,69,0.08);
          transition: transform 0.1s ease, box-shadow 0.15s ease;
        }
        .cell:active { transform: translateY(2px); box-shadow: 0 2px 0 rgba(31,46,69,0.1); }
        .cell-emoji { font-size: 30px; }
        .cell.is-wrong {
          animation: shake 0.45s ease;
          box-shadow: 0 0 0 3px var(--wrong) inset, 0 4px 0 rgba(31,46,69,0.1);
        }
        .cell.is-correct {
          box-shadow: 0 0 0 3px var(--grass-dark) inset, 0 4px 0 rgba(31,46,69,0.1);
          background: #E4F7E6;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
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
        <div className="brand"><img src={`${import.meta.env.BASE_URL}fox-mascot.svg`} className="brand-emoji-img" alt="Tilki" /> Farklı Olan</div>
        <div className="top-right">
          <span className="round-pill">Tur {round + 1}/{TOTAL_ROUNDS}</span>
          <button className="icon-btn" onClick={() => setSoundOn((s) => !s)} aria-label="Ses aç/kapat">{soundOn ? "🔊" : "🔇"}</button>
          <button className="icon-btn" onClick={() => setPaused(true)} aria-label="Duraklat">⏸️</button>
        </div>
      </div>

      <div className="prompt">Aralarından farklı olanı bul!</div>

      <div className="progress-track">
        {Array.from({ length: totalPuzzles }).map((_, i) => (
          <div key={i} className={`progress-flag ${i < solvedCount ? "filled" : ""}`} />
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: `repeat(${ROUNDS[round].columns}, 1fr)` }}>
        {grid.map((cell) => (
          <div
            key={cell.id}
            className={`cell ${wrongId === cell.id ? "is-wrong" : ""} ${correctId === cell.id ? "is-correct" : ""}`}
            onClick={() => handleTap(cell)}
          >
            <span className="cell-emoji">{cell.emoji}</span>
          </div>
        ))}
      </div>

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
        </div>
      )}

      {showTutorial && (
        <div className="tutorial-overlay">
          <img src={`${import.meta.env.BASE_URL}fox-mascot.svg`} className="tutorial-emoji-img" alt="Tilki" />
          <div className="finish-title">Nasıl Oynanır?</div>
          <div className="tutorial-steps">
            <div className="tutorial-step">
              <span className="tutorial-step-icon">👀</span>
              <span>Kutulara iyice bak</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">🔍</span>
              <span>Diğerlerinden farklı olan hangisi?</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">👉</span>
              <span>Ona dokun, doğruysa devam et!</span>
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
