import { useState, useCallback, useRef, useEffect } from "react";
import { Star, Trophy, RotateCcw } from "lucide-react";

// ---- Oyun ayarları ----
// Boşluk doldurma motorunun "sıra" mantığı, içerik haftanın günleri.
// Hayat Bilgisi "zaman kavramı / günler-aylar sırası" kazanımına karşılık gelir.
const ROUND_LENGTH = 5;
const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

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

function generatePuzzle() {
  const idx = rand(1, DAYS.length - 2); // baş/son gün seçilmiyor ki iki komşusu da olsun
  const seq = [DAYS[idx - 1], DAYS[idx], DAYS[idx + 1]];
  const blankIndex = rand(0, 2);
  return { seq, blankIndex, answer: seq[blankIndex] };
}

function generateDayPad(correctDay) {
  const pool = new Set([correctDay]);
  while (pool.size < 4) pool.add(DAYS[rand(0, DAYS.length - 1)]);
  return shuffle(Array.from(pool));
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

export default function WeekdayOrderGame({ onExit, onComplete } = {}) {
  const [puzzle, setPuzzle] = useState(() => generatePuzzle());
  const [pad, setPad] = useState(() => generateDayPad(puzzle.answer));
  const [progress, setProgress] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [wrongPick, setWrongPick] = useState(null);
  const [finished, setFinished] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [paused, setPaused] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const timeoutRef = useRef(null);

  const nextPuzzle = useCallback(() => {
    const p = generatePuzzle();
    setPuzzle(p);
    setPad(generateDayPad(p.answer));
    setFeedback(null);
    setWrongPick(null);
  }, []);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function handlePick(day) {
    if (paused || finished || feedback === "correct") return;

    if (day === puzzle.answer) {
      setFeedback("correct");
      if (soundOn) playTone("correct");
      setShowBurst(true);
      const newProgress = progress + 1;
      setProgress(newProgress);
      timeoutRef.current = setTimeout(() => {
        if (newProgress >= ROUND_LENGTH) {
          setFinished(true);
        } else {
          nextPuzzle();
        }
      }, 700);
    } else {
      setFeedback("wrong");
      if (soundOn) playTone("wrong");
      setWrongPick(day);
      setTotalMistakes((m) => m + 1);
      timeoutRef.current = setTimeout(() => {
        setFeedback(null);
        setWrongPick(null);
      }, 650);
    }
  }

  // patlama efektini kısa süre sonra kapat
  useEffect(() => {
    if (!showBurst) return;
    const t = setTimeout(() => setShowBurst(false), 500);
    return () => clearTimeout(t);
  }, [showBurst]);

  function restart() {
    clearTimeout(timeoutRef.current);
    setProgress(0);
    setTotalMistakes(0);
    setFinished(false);
    nextPuzzle();
  }

  const stars = totalMistakes === 0 ? 3 : totalMistakes <= 3 ? 2 : 1;

  const reportedRef = useRef(false);
  useEffect(() => {
    if (finished && !reportedRef.current) {
      reportedRef.current = true;
      onComplete?.(stars);
    }
  }, [finished, stars, onComplete]);

  return (
    <div className="days-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;700;800&display=swap');

        .days-root {
          --bg: #EAF6FD;
          --card: #FFFFFF;
          --ink: #1F2E45;
          --ink-soft: #5C6B85;
          --sun: #FFC93C;
          --grass: #6FBF73;
          --grass-dark: #4E9F53;
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

        .progress-track {
          display: flex;
          gap: 4px;
          margin-bottom: 22px;
        }
        .progress-flag {
          flex: 1;
          height: 8px;
          border-radius: 4px;
          background: var(--track-bg);
          transition: background 0.3s ease;
        }
        .progress-flag.filled { background: var(--grass-dark); }

        .puzzle-card {
          position: relative;
          background: var(--card);
          border-radius: 24px;
          padding: 28px 16px;
          text-align: center;
          margin-bottom: 22px;
          box-shadow: 0 6px 20px rgba(31,46,69,0.08);
        }
        .puzzle-card.shake { animation: shake 0.5s ease; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }

        .seq-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .day-slot {
          min-width: 84px;
          padding: 10px 10px;
          border-radius: 14px;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 15px;
          text-align: center;
        }
        .day-slot.is-blank {
          background: var(--track-bg);
          border: 3px dashed #9AB4CE;
          color: transparent;
          min-height: 44px;
        }
        .day-slot.is-blank.is-filled {
          background: #E4F7E6;
          border: 3px solid var(--grass-dark);
          color: var(--grass-dark);
        }
        .seq-arrow { font-size: 18px; color: #9AB4CE; }

        .daypad {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .pad-key {
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 16px;
          color: var(--ink);
          background: var(--card);
          border: none;
          border-radius: 14px;
          padding: 14px 8px;
          cursor: pointer;
          box-shadow: 0 4px 0 rgba(31,46,69,0.12), 0 5px 10px rgba(31,46,69,0.06);
          transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.2s ease;
        }
        .pad-key:active { transform: translateY(2px); box-shadow: 0 2px 0 rgba(31,46,69,0.12); }
        .pad-key.correct { background: var(--grass-dark); color: white; }
        .pad-key.wrong { background: #D9534F; color: white; }

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
        .burst {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          font-size: 40px;
          animation: pop 0.5s ease forwards;
          z-index: 5;
        }
        @keyframes pop {
          0% { transform: scale(0.4); opacity: 0; }
          40% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
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
        <div className="brand"><img src={`${import.meta.env.BASE_URL}fox-mascot.svg`} className="brand-emoji-img" alt="Tilki" /> Günler Sırası</div>
        <div className="top-right">
          <span className="round-pill">{progress}/{ROUND_LENGTH}</span>
          <button className="icon-btn" onClick={() => setSoundOn((s) => !s)} aria-label="Ses aç/kapat">{soundOn ? "🔊" : "🔇"}</button>
          <button className="icon-btn" onClick={() => setPaused(true)} aria-label="Duraklat">⏸️</button>
        </div>
      </div>

      <div className="progress-track">
        {Array.from({ length: ROUND_LENGTH }).map((_, i) => (
          <div key={i} className={`progress-flag ${i < progress ? "filled" : ""}`} />
        ))}
      </div>

      <div className={`puzzle-card ${feedback === "wrong" ? "shake" : ""}`}>
        {showBurst && <div className="burst">⭐</div>}
        <div className="seq-row">
          {puzzle.seq.map((day, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className={`day-slot ${puzzle.blankIndex === i ? "is-blank" : ""} ${puzzle.blankIndex === i && feedback === "correct" ? "is-filled" : ""}`}>
                {puzzle.blankIndex === i && feedback !== "correct" ? "?" : day}
              </span>
              {i < 2 && <span className="seq-arrow">→</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="daypad">
        {pad.map((day) => {
          let cls = "pad-key";
          if (feedback === "correct" && day === puzzle.answer) cls += " correct";
          if (feedback === "wrong" && day === wrongPick) cls += " wrong";
          return (
            <button key={day} className={cls} onClick={() => handlePick(day)}>
              {day}
            </button>
          );
        })}
      </div>

      {finished && (
        <div className="finish-overlay">
          <Trophy size={44} color="#FFC93C" />
          <div className="finish-title">Hepsini bildin!</div>
          <div className="finish-stars">
            {[1, 2, 3].map((i) => (
              <Star key={i} size={28} fill={i <= stars ? "#FFC93C" : "none"} stroke="#FFC93C" />
            ))}
          </div>
          <div style={{ fontFamily: "Nunito", fontSize: 14, opacity: 0.9 }}>
            {totalMistakes === 0 ? "Hiç yanlışın yok, harikasın!" : `${totalMistakes} kere zorlandın, sorun değil!`}
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
              <span className="tutorial-step-icon">📅</span>
              <span>Haftanın günleri sırayla dizili</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">❓</span>
              <span>Kesikli kutu eksik gün demek</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">👉</span>
              <span>Doğru güne dokun</span>
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
