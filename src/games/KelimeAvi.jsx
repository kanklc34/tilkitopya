import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Star, Trophy, RotateCcw } from "lucide-react";
import turkceBankasiSinif1 from "../data/turkce-1-sinif.json";
import turkceBankasiSinif2 from "../data/turkce-2-sinif.json";

// ---- Kelime Avı: yeni bir oyun türü (bkz. devir-teslim Bölüm 4 madde 3) ----
// Diğer Türkçe oyunlarının aksine (eşleştirme/hızlı seçim), burada çocuk
// ızgara içindeki harfleri tarayıp gizli kelimeleri buluyor - dikkat ve
// tarama becerisi. Etkileşim BİLEREK iki dokunuşlu tasarlandı (ilk harfe
// dokun, son harfe dokun) - sürükleyerek seçim mobil dokunmatikte kayma/
// scroll çakışması riski taşıdığından, bu daha güvenilir bir alternatif.
const BANKALAR = { 1: turkceBankasiSinif1, 2: turkceBankasiSinif2 };
const TR_ALFABE = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");

// Tur ilerledikçe ızgara büyüyor, kelime sayısı ve uzunluğu artıyor.
const ROUNDS_BY_SINIF = {
  1: [
    { gridSize: 6, wordCount: 3, maxLen: 4 },
    { gridSize: 7, wordCount: 4, maxLen: 5 },
    { gridSize: 8, wordCount: 5, maxLen: 7 },
  ],
  2: [
    { gridSize: 7, wordCount: 3, maxLen: 5 },
    { gridSize: 8, wordCount: 4, maxLen: 7 },
    { gridSize: 10, wordCount: 5, maxLen: 10 },
  ],
};
function roundsFor(sinif) {
  return ROUNDS_BY_SINIF[sinif] || ROUNDS_BY_SINIF[1];
}

function kelimeHavuzuHazirla(sinif) {
  const banka = BANKALAR[sinif] || BANKALAR[1];
  return banka.sorular
    .filter((s) => s.soru_tipi === "eslestirme")
    .map((s) => s.tam_kelime);
}

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

// Kelimeleri ızgaraya yerleştirir (sadece yatay/dikey, çakışma yoksa
// harfler paylaşılabilir). Yerleştirilemeyen kelime sessizce atlanır -
// nadir bir durum, ızgara boyutu kelime sayısına göre cömert seçildiği
// için pratikte neredeyse hiç olmaz.
function buildPuzzle(words, gridSize) {
  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
  const placements = [];

  for (const word of words) {
    let placed = false;
    for (let attempt = 0; attempt < 200 && !placed; attempt++) {
      const horizontal = Math.random() < 0.5;
      const len = word.length;
      if (horizontal && len <= gridSize) {
        const r = rand(0, gridSize - 1);
        const c = rand(0, gridSize - len);
        let ok = true;
        for (let i = 0; i < len; i++) {
          const cell = grid[r][c + i];
          if (cell !== null && cell !== word[i]) { ok = false; break; }
        }
        if (ok) {
          for (let i = 0; i < len; i++) grid[r][c + i] = word[i];
          placements.push({ word, cells: Array.from({ length: len }, (_, i) => [r, c + i]) });
          placed = true;
        }
      } else if (!horizontal && len <= gridSize) {
        const c = rand(0, gridSize - 1);
        const r = rand(0, gridSize - len);
        let ok = true;
        for (let i = 0; i < len; i++) {
          const cell = grid[r + i][c];
          if (cell !== null && cell !== word[i]) { ok = false; break; }
        }
        if (ok) {
          for (let i = 0; i < len; i++) grid[r + i][c] = word[i];
          placements.push({ word, cells: Array.from({ length: len }, (_, i) => [r + i, c]) });
          placed = true;
        }
      }
    }
  }

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === null) grid[r][c] = TR_ALFABE[rand(0, TR_ALFABE.length - 1)];
    }
  }

  return { grid, placements };
}

function generateRound(wordPool, roundCfg) {
  const { gridSize, wordCount, maxLen } = roundCfg;
  let candidates = wordPool.filter((w) => w.length <= maxLen);
  if (candidates.length < wordCount) candidates = wordPool;
  const chosen = shuffle(candidates).slice(0, wordCount);
  return buildPuzzle(chosen, gridSize);
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
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
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

function cellKey(r, c) {
  return `${r},${c}`;
}

export default function KelimeAvi({ onExit, onComplete, sinif = 1 } = {}) {
  const wordPool = useMemo(() => kelimeHavuzuHazirla(sinif), [sinif]);
  const ROUNDS = useMemo(() => roundsFor(sinif), [sinif]);
  const TOTAL_ROUNDS = ROUNDS.length;

  const [round, setRound] = useState(0);
  const [puzzle, setPuzzle] = useState(() => generateRound(wordPool, ROUNDS[0]));
  const [foundWords, setFoundWords] = useState(() => new Set());
  const [foundCells, setFoundCells] = useState(() => new Set());
  const [anchor, setAnchor] = useState(null);
  const [wrongCells, setWrongCells] = useState(() => new Set());
  const [mistakes, setMistakes] = useState(0);
  const [roundDone, setRoundDone] = useState(false);
  const [finished, setFinished] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const startRound = useCallback((r) => {
    setPuzzle(generateRound(wordPool, ROUNDS[r]));
    setFoundWords(new Set());
    setFoundCells(new Set());
    setAnchor(null);
    setWrongCells(new Set());
    setRoundDone(false);
  }, [wordPool, ROUNDS]);

  function handleCellClick(r, c) {
    if (roundDone || finished || paused) return;
    if (foundCells.has(cellKey(r, c))) return;

    if (!anchor) {
      setAnchor([r, c]);
      return;
    }
    const [ar, ac] = anchor;
    if (ar === r && ac === c) {
      setAnchor(null);
      return;
    }
    const sameRow = ar === r;
    const sameCol = ac === c;
    if (!sameRow && !sameCol) {
      // Düz bir çizgi değil - yeni dokunuşu yeni başlangıç noktası say.
      setAnchor([r, c]);
      return;
    }

    const cells = [];
    if (sameRow) {
      const c0 = Math.min(ac, c), c1 = Math.max(ac, c);
      for (let cc = c0; cc <= c1; cc++) cells.push([r, cc]);
    } else {
      const r0 = Math.min(ar, r), r1 = Math.max(ar, r);
      for (let rr = r0; rr <= r1; rr++) cells.push([rr, c]);
    }

    const letters = cells.map(([rr, cc]) => puzzle.grid[rr][cc]).join("");
    const reversed = letters.split("").reverse().join("");
    const match = puzzle.placements.find(
      (p) => !foundWords.has(p.word) && (p.word === letters || p.word === reversed)
    );

    setAnchor(null);

    if (match) {
      if (soundOn) playTone("correct");
      const newFoundWords = new Set(foundWords);
      newFoundWords.add(match.word);
      setFoundWords(newFoundWords);
      setFoundCells((prev) => {
        const next = new Set(prev);
        match.cells.forEach(([rr, cc]) => next.add(cellKey(rr, cc)));
        return next;
      });

      if (newFoundWords.size >= puzzle.placements.length) {
        timeoutRef.current = setTimeout(() => setRoundDone(true), 500);
      }
    } else {
      if (soundOn) playTone("wrong");
      setMistakes((m) => m + 1);
      const wrongSet = new Set(cells.map(([rr, cc]) => cellKey(rr, cc)));
      setWrongCells(wrongSet);
      timeoutRef.current = setTimeout(() => setWrongCells(new Set()), 500);
    }
  }

  function nextRoundOrFinish() {
    if (round + 1 >= TOTAL_ROUNDS) {
      setFinished(true);
    } else {
      const r = round + 1;
      setRound(r);
      startRound(r);
    }
  }

  function restart() {
    clearTimeout(timeoutRef.current);
    setRound(0);
    setMistakes(0);
    setFinished(false);
    startRound(0);
  }

  const stars = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;

  const reportedRef = useRef(false);
  useEffect(() => {
    if (finished && !reportedRef.current) {
      reportedRef.current = true;
      onComplete?.(stars);
    }
  }, [finished, stars, onComplete]);

  const gridSize = ROUNDS[round].gridSize;

  return (
    <div className="avi-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;700;800&display=swap');

        .avi-root {
          --bg: #EAF6FD;
          --card: #FFFFFF;
          --ink: #1F2E45;
          --ink-soft: #5C6B85;
          --sun: #FFC93C;
          --grass: #6FBF73;
          --grass-dark: #4E9F53;
          --red: #D9534F;
          --anchor: #5AB4E0;
          --track-bg: #D8ECF7;
          font-family: 'Nunito', sans-serif;
          color: var(--ink);
          background: var(--bg);
          border-radius: 28px;
          padding: 26px 20px;
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
          margin: 0;
          align-items: center;
          gap: 8px;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 19px;
        }
        .brand-emoji-img { width: 26px; height: 26px; }
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

        .word-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-bottom: 16px;
        }
        .word-chip {
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 13px;
          padding: 6px 12px;
          border-radius: 999px;
          background: var(--card);
          color: var(--ink);
          box-shadow: 0 2px 6px rgba(31,46,69,0.08);
          transition: background 0.2s ease, color 0.2s ease;
        }
        .word-chip.found {
          background: var(--grass-dark);
          color: white;
          text-decoration: line-through;
          opacity: 0.85;
        }

        .grid-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
          touch-action: manipulation;
        }
        .grid {
          display: grid;
          gap: 3px;
          background: var(--card);
          padding: 8px;
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(31,46,69,0.08);
        }
        .cell {
          display: flex;
          align-items: center;
          justify-content: center;
          aspect-ratio: 1;
          border-radius: 6px;
          background: var(--track-bg);
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          color: var(--ink);
          cursor: pointer;
          user-select: none;
          -webkit-user-select: none;
          transition: background 0.15s ease, transform 0.1s ease;
        }
        .cell.anchor { background: var(--anchor); color: white; transform: scale(1.08); }
        .cell.found { background: var(--grass-dark); color: white; }
        .cell.wrong { background: var(--red); color: white; }

        .finish-overlay, .tutorial-overlay {
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
        .round-done-word { font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 16px; }
      `}</style>

      <div className="top-row">
        <h1 className="brand"><img src={`${import.meta.env.BASE_URL}fox-mascot.png`} className="brand-emoji-img" alt="Tilki" /> Kelime Avı</h1>
        <div className="top-right">
          <span className="round-pill">Tur {round + 1}/{TOTAL_ROUNDS}</span>
          <button className="icon-btn" onClick={() => setSoundOn((s) => !s)} aria-label="Ses aç/kapat">
            {soundOn ? "🔊" : "🔇"}
          </button>
          <button className="icon-btn" onClick={() => setPaused(true)} aria-label="Duraklat">⏸️</button>
        </div>
      </div>

      <div className="word-chips">
        {puzzle.placements.map((p) => (
          <span key={p.word} className={`word-chip ${foundWords.has(p.word) ? "found" : ""}`}>
            {p.word}
          </span>
        ))}
      </div>

      <div className="grid-wrap">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            width: `min(100%, ${gridSize * 40}px)`,
          }}
        >
          {puzzle.grid.map((row, r) =>
            row.map((letter, c) => {
              const key = cellKey(r, c);
              let cls = "cell";
              if (foundCells.has(key)) cls += " found";
              else if (wrongCells.has(key)) cls += " wrong";
              else if (anchor && anchor[0] === r && anchor[1] === c) cls += " anchor";
              return (
                <div
                  key={key}
                  className={cls}
                  style={{ fontSize: gridSize >= 9 ? 13 : gridSize >= 7 ? 15 : 17 }}
                  onClick={() => handleCellClick(r, c)}
                >
                  {letter}
                </div>
              );
            })
          )}
        </div>
      </div>

      {roundDone && !finished && (
        <div className="finish-overlay">
          <Trophy size={40} color="#FFC93C" />
          <div className="finish-title">Turu bitirdin!</div>
          <div className="round-done-word">Tüm kelimeleri buldun 🎉</div>
          <button className="primary-btn" onClick={nextRoundOrFinish}>
            {round + 1 >= TOTAL_ROUNDS ? "Bitir" : "Sonraki Tur"}
          </button>
        </div>
      )}

      {finished && (
        <div className="finish-overlay">
          <Trophy size={44} color="#FFC93C" />
          <div className="finish-title">Kelime Avını bitirdin!</div>
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
              <span>Üstteki kelimeleri ızgarada ara</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">👆</span>
              <span>İlk harfe dokun, sonra son harfe dokun</span>
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
