import { useState, useEffect, useCallback } from "react";
import { Star, Trophy, RotateCcw } from "lucide-react";

// ---- Oyun ayarları ----
const OBJECT_POOL = ["🍎", "⭐", "⚽", "🚗", "🎈", "🐟"];
// Her tur: sayı aralığı, çift sayısı ve ızgara sütunu birlikte büyüyor.
// İlk tur bilinçli olarak küçük (3 çift / 3x2) - kafa karışmasın diye.
const ROUNDS = [
  { min: 1, max: 5, pairs: 3, columns: 3 }, // 3x2 - basit başlangıç
  { min: 1, max: 8, pairs: 4, columns: 4 }, // 4x2
  { min: 1, max: 10, pairs: 6, columns: 3 }, // 3x4 - en zor tur
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

function pickNumbers(count, min, max) {
  const pool = [];
  for (let n = min; n <= max; n++) pool.push(n);
  return shuffle(pool).slice(0, count);
}

function buildDeck(round) {
  const { min, max, pairs } = ROUNDS[round];
  const numbers = pickNumbers(pairs, min, max);
  const emojis = shuffle(OBJECT_POOL).slice(0, pairs);
  const cards = [];
  numbers.forEach((n, idx) => {
    const pairId = `p${idx}`;
    const emoji = emojis[idx];
    cards.push({ id: `${pairId}-num`, pairId, kind: "number", value: n });
    cards.push({ id: `${pairId}-obj`, pairId, kind: "objects", value: n, emoji });
  });
  return shuffle(cards);
}

function CardFace({ card }) {
  if (card.kind === "number") {
    return <span className="card-number">{card.value}</span>;
  }
  return (
    <span className="card-objects">
      {Array.from({ length: card.value }).map((_, i) => (
        <span key={i} className="card-obj-item">{card.emoji}</span>
      ))}
    </span>
  );
}

// Basit, dosyasız sesli geri bildirim (Web Audio) - Hızlı Yarış'la aynı desen
function playTone(kind) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = kind === "match" ? [523.25, 659.25, 783.99] : [220, 180];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = kind === "match" ? "triangle" : "sine";
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

export default function MatchGame({ onExit } = {}) {
  const [round, setRound] = useState(0);
  const [deck, setDeck] = useState(() => buildDeck(0));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [roundDone, setRoundDone] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [burstPairId, setBurstPairId] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  const [paused, setPaused] = useState(false);

  const startRound = useCallback((r) => {
    setDeck(buildDeck(r));
    setFlipped([]);
    setMatched(new Set());
    setLocked(false);
    setMoves(0);
    setMistakes(0);
    setRoundDone(false);
  }, []);

  useEffect(() => {
    if (matched.size > 0 && matched.size === deck.length) {
      setTimeout(() => setRoundDone(true), 500);
    }
  }, [matched, deck]);

  function handleFlip(card) {
    if (locked || paused || flipped.includes(card.id) || matched.has(card.pairId)) return;
    if (flipped.length === 2) return;

    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [firstId, secondId] = newFlipped;
      const first = deck.find((c) => c.id === firstId);
      const second = deck.find((c) => c.id === secondId);

      if (first.pairId === second.pairId) {
        if (soundOn) playTone("match");
        setBurstPairId(first.pairId);
        setTimeout(() => {
          setMatched((prev) => new Set(prev).add(first.pairId));
          setFlipped([]);
          setLocked(false);
          setBurstPairId(null);
        }, 500);
      } else {
        if (soundOn) playTone("wrong");
        setMistakes((m) => m + 1);
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  }

  function nextRound() {
    if (round + 1 >= TOTAL_ROUNDS) {
      setAllDone(true);
    } else {
      const r = round + 1;
      setRound(r);
      startRound(r);
    }
  }

  function restartAll() {
    setRound(0);
    setAllDone(false);
    startRound(0);
  }

  const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;

  return (
    <div className="match-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;700;800&display=swap');

        .match-root {
          --bg: #EAF6FD;
          --card: #FFFFFF;
          --ink: #1F2E45;
          --ink-soft: #5C6B85;
          --sun: #FFC93C;
          --grass: #6FBF73;
          --grass-dark: #4E9F53;
          --track-bg: #D8ECF7;
          --wrong: #D9534F;
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
        .top-right { display: flex; align-items: center; gap: 8px; }
        .round-pill {
          background: var(--sun);
          color: var(--ink);
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 13px;
          padding: 5px 12px;
          border-radius: 999px;
        }
        .moves-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: var(--ink-soft);
        }
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

        .board {
          display: grid;
          gap: 10px;
          position: relative;
        }

        .card-slot {
          perspective: 800px;
          aspect-ratio: 1 / 1;
          position: relative;
        }
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.4s cubic-bezier(0.4, 0.2, 0.2, 1);
          cursor: pointer;
        }
        .card-slot.is-flipped .card-inner,
        .card-slot.is-matched .card-inner {
          transform: rotateY(180deg);
        }
        .card-face {
          position: absolute;
          inset: 0;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          backface-visibility: hidden;
        }
        .card-back {
          background: linear-gradient(160deg, #6FA8DC, #4A87C4);
          box-shadow: 0 4px 0 rgba(0,0,0,0.15);
          overflow: hidden;
        }
        .card-back::before {
          content: '';
          position: absolute;
          width: 140%;
          height: 140%;
          background: repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 8px, transparent 8px, transparent 16px);
        }
        .card-back-icon {
          font-size: 24px;
          position: relative;
          filter: drop-shadow(0 2px 2px rgba(0,0,0,0.15));
        }
        .card-front {
          background: var(--card);
          transform: rotateY(180deg);
          box-shadow: 0 3px 10px rgba(31,46,69,0.12);
          padding: 4px;
        }
        .card-slot.is-matched .card-front {
          background: #E4F7E6;
          box-shadow: 0 0 0 3px var(--grass-dark) inset;
        }
        .card-slot.is-wrong .card-front {
          background: #FBE7E6;
          box-shadow: 0 0 0 3px var(--wrong) inset;
        }
        .card-number {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 36px;
          color: var(--ink);
        }
        .card-objects {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 2px;
          max-width: 90%;
        }
        .card-obj-item { font-size: 18px; line-height: 1; }

        .burst {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          font-size: 30px;
          animation: pop 0.6s ease forwards;
          z-index: 5;
        }
        @keyframes pop {
          0% { transform: scale(0.4); opacity: 0; }
          40% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
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
          gap: 10px;
          text-align: center;
          padding: 24px;
          z-index: 10;
        }
        .finish-title {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 26px;
        }
        .finish-stars { display: flex; gap: 6px; margin: 8px 0; }
        .primary-btn {
          margin-top: 14px;
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
        <div className="brand"><span className="brand-emoji">🦊</span> Eşleştirme</div>
        <div className="top-right">
          <span className="round-pill">Tur {round + 1}/{TOTAL_ROUNDS}</span>
          <span className="moves-pill"><Star size={14} fill="#FFC93C" stroke="#FFC93C" /> {moves}</span>
          <button className="icon-btn" onClick={() => setSoundOn((s) => !s)} aria-label="Ses aç/kapat">
            {soundOn ? "🔊" : "🔇"}
          </button>
          <button className="icon-btn" onClick={() => setPaused(true)} aria-label="Duraklat">
            ⏸️
          </button>
        </div>
      </div>

      <div className="board" style={{ gridTemplateColumns: `repeat(${ROUNDS[round].columns}, 1fr)` }}>
        {deck.map((card) => {
          const isFlipped = flipped.includes(card.id);
          const isMatched = matched.has(card.pairId);
          return (
            <div
              key={card.id}
              className={`card-slot ${isFlipped || isMatched ? "is-flipped" : ""} ${isMatched ? "is-matched" : ""}`}
              onClick={() => handleFlip(card)}
            >
              <div className="card-inner">
                <div className="card-face card-back">
                  <span className="card-back-icon">🦊</span>
                </div>
                <div className="card-face card-front">
                  <CardFace card={card} />
                </div>
              </div>
              {burstPairId === card.pairId && <div className="burst">✨</div>}
            </div>
          );
        })}
      </div>

      {roundDone && !allDone && (
        <div className="round-overlay">
          <Trophy size={40} color="#FFC93C" />
          <div className="finish-title">Tur {round + 1} tamam!</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>{moves} hamlede eşleştirdin</div>
          <button className="primary-btn" onClick={nextRound}>
            {round + 1 >= TOTAL_ROUNDS ? "Bitir" : "Sonraki Tur"}
          </button>
        </div>
      )}

      {allDone && (
        <div className="finish-overlay">
          <Trophy size={44} color="#FFC93C" />
          <div className="finish-title">Hepsini eşleştirdin!</div>
          <div className="finish-stars">
            {[1, 2, 3].map((i) => (
              <Star key={i} size={28} fill={i <= stars ? "#FFC93C" : "none"} stroke="#FFC93C" />
            ))}
          </div>
          <div style={{ fontFamily: "Nunito", fontSize: 14, opacity: 0.9 }}>
            {mistakes === 0 ? "Hiç yanlış yapmadın, harikasın!" : `${mistakes} kere yanlış eşleştirdin, sorun değil!`}
          </div>
          <button className="primary-btn" onClick={restartAll}>
            <RotateCcw size={16} /> Tekrar Oyna
          </button>
        </div>
      )}

      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-emoji">🦊</div>
          <div className="finish-title">Nasıl Oynanır?</div>
          <div className="tutorial-steps">
            <div className="tutorial-step">
              <span className="tutorial-step-icon">🔢</span>
              <span>Rakamı, nesne sayısıyla eşleştir</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">👆</span>
              <span>İki kart aç, aynı çiftse kalır</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">🎉</span>
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
