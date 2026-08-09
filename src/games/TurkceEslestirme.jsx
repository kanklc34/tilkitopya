import { useState, useEffect, useCallback, useRef } from "react";
import { Star, Trophy, RotateCcw } from "lucide-react";
import turkceBankasi from "../data/turkce-1-sinif.json";

// ---- Oyun ayarları ----
// İngilizce Word Match ile aynı motor, içerik Türkçe kelime <-> görsel.
// Aynı 6 tema, Harf Tamamlama motoruyla ortak kelime dağarcığı - içerik
// artık gerçek soru bankasından (eslestirme kayıtları) okunuyor.
const TEMA_ESLEME = {
  KEDİ: "hayvanlar", KÖPEK: "hayvanlar", KUŞ: "hayvanlar", BALIK: "hayvanlar", KELEBEK: "hayvanlar",
  GÜNEŞ: "doga", AY: "doga", YILDIZ: "doga", ÇİÇEK: "doga",
  TOP: "oyuncaklar", ARABA: "oyuncaklar", BALON: "oyuncaklar",
  EV: "gunluk_hayat", KİTAP: "gunluk_hayat", ELMA: "gunluk_hayat", MUZ: "gunluk_hayat",
};
const WORD_BANK = turkceBankasi.sorular
  .filter((s) => s.soru_tipi === "eslestirme")
  .map((s) => ({
    word: s.tam_kelime,
    emoji: s.gorsel_emoji,
    tema: TEMA_ESLEME[s.tam_kelime] || "diger",
  }));
const THEMES = [...new Set(WORD_BANK.map((w) => w.tema))];
const ROUNDS = [
  { pairs: 3, columns: 3 },
  { pairs: 4, columns: 4 },
  { pairs: 6, columns: 3 },
];
const TOTAL_ROUNDS = ROUNDS.length;

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(round) {
  const { pairs } = ROUNDS[round];
  // Son tur (en zor) tam karışık havuzdan geliyor - erken turlar tek bir
  // temaya bağlı kalıyor (concreteness fading ile aynı mantık: destek
  // ustalık seviyesinde kalkıyor). Yeterli kelimesi olmayan temalar elenir.
  const eligible = THEMES.filter((t) => WORD_BANK.filter((w) => w.tema === t).length >= pairs);
  const pool = eligible.length > 0 ? WORD_BANK.filter((w) => w.tema === eligible[rand(0, eligible.length - 1)]) : WORD_BANK;
  const entries = shuffle(pool).slice(0, pairs);
  const cards = [];
  entries.forEach((entry, idx) => {
    const pairId = `p${idx}`;
    cards.push({ id: `${pairId}-word`, pairId, kind: "word", value: entry.word });
    cards.push({ id: `${pairId}-img`, pairId, kind: "image", value: entry.emoji });
  });
  return shuffle(cards);
}

function CardFace({ card }) {
  if (card.kind === "word") return <span className="card-word">{card.value}</span>;
  return <span className="card-image">{card.value}</span>;
}

// Basit, dosyasız sesli geri bildirim (Web Audio) - ortak desen
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

export default function TurkishMatchGame({ onExit, onComplete } = {}) {
  const [round, setRound] = useState(0);
  const [deck, setDeck] = useState(() => buildDeck(0));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [pesPeseYanlis, setPesPeseYanlis] = useState(0);
  const [roundDone, setRoundDone] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [burstPairId, setBurstPairId] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [paused, setPaused] = useState(false);

  const startRound = useCallback((r) => {
    setDeck(buildDeck(r));
    setFlipped([]);
    setMatched(new Set());
    setLocked(false);
    setMoves(0);
    setMistakes(0);
    setPesPeseYanlis(0);
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
        setPesPeseYanlis(0);
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
        setPesPeseYanlis((p) => p + 1);
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

  const reportedRef = useRef(false);
  useEffect(() => {
    if (allDone && !reportedRef.current) {
      reportedRef.current = true;
      onComplete?.(stars);
    }
  }, [allDone, stars, onComplete]);

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
          margin: 0;
          align-items: center;
          gap: 8px;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 19px;
        }
        .brand-emoji { font-size: 26px; }
        .brand-emoji-img { width: 26px; height: 26px; }
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
        .strategy-tip {
          text-align: center;
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          color: #1F2E45;
          background: #FFF3D6;
          border-radius: 12px;
          padding: 8px 14px;
          margin-bottom: 12px;
        }
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

        .board { display: grid; gap: 10px; }

        .card-slot {
          perspective: 800px;
          aspect-ratio: 1 / 1;
          position: relative;
          border: none;
          background: none;
          padding: 0;
          font: inherit;
          width: 100%;
        }
        .card-slot:focus-visible {
          outline: 3px solid #5AB4E0;
          outline-offset: 3px;
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
        .card-slot.is-matched .card-inner { transform: rotateY(180deg); }
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
        }
        .card-back-icon { font-size: 24px; position: relative; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.15)); }
        .card-back-icon-img { width: 26px; height: 26px; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.15)) brightness(0) invert(1); }
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
        .card-word {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 15px;
          color: var(--ink);
          letter-spacing: 0.3px;
          text-align: center;
        }
        .card-image { font-size: 32px; }

        .round-overlay, .finish-overlay, .tutorial-overlay {
          position: absolute;
          inset: 0;
          background: rgba(31,46,69,0.92);
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
        <h1 className="brand"><img src={`${import.meta.env.BASE_URL}fox-mascot.png`} className="brand-emoji-img" alt="Tilki" /> Kelime Eşleştir</h1>
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


      {pesPeseYanlis >= 3 && (


        <div className="strategy-tip">💡 Kartların yerini hatırlamaya çalış, aceleye gerek yok</div>


      )}

      <div className="board" style={{ gridTemplateColumns: `repeat(${ROUNDS[round].columns}, 1fr)` }}>
        {deck.map((card) => {
          const isFlipped = flipped.includes(card.id);
          const isMatched = matched.has(card.pairId);
          return (
            <button
              type="button"
              key={card.id}
              className={`card-slot ${isFlipped || isMatched ? "is-flipped" : ""} ${isMatched ? "is-matched" : ""}`}
              onClick={() => handleFlip(card)}
              aria-label="Kart"
            >
              <div className="card-inner">
                <div className="card-face card-back"><img src={`${import.meta.env.BASE_URL}fox-mascot.png`} className="card-back-icon-img" alt="Tilki" /></div>
                <div className="card-face card-front"><CardFace card={card} /></div>
              </div>
              {burstPairId === card.pairId && <div className="burst">✨</div>}
            </button>
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
      <button className="secondary-btn" onClick={onExit}>Menüye Dön</button>
        </div>
      )}

      {showTutorial && (
        <div className="tutorial-overlay">
          <img src={`${import.meta.env.BASE_URL}fox-mascot.png`} className="tutorial-emoji-img" alt="Tilki" />
          <div className="finish-title">Nasıl Oynanır?</div>
          <div className="tutorial-steps">
            <div className="tutorial-step">
              <span className="tutorial-step-icon">🔤</span>
              <span>Kelimeyi resmiyle eşleştir</span>
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
