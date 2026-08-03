import { useState, useMemo, useRef, useEffect } from "react";
import { Star, Trophy, RotateCcw, HelpCircle, BookOpen } from "lucide-react";
import matematikBankasi from "../data/matematik-1-sinif.json";

// ---- GERÇEK SORU BANKASI ----
// Gömülü/statik veri değil - src/data/matematik-1-sinif.json dosyasından
// gerçek zamanlı import ediliyor. Bankayı güncelleyince kod değişmeden
// bileşen otomatik güncel soruları kullanır (tek veri katmanı ilkesi).
const QUESTIONS = matematikBankasi.sorular.map((q) => ({
  id: q.id,
  seviye: q.seviye,
  soru_tipi: q.soru_tipi,
  soru_metni: q.soru_metni,
  baglam_metni: q.baglam_metni,
  tema_emoji: q.tema_emoji,
  secenekler: q.secenekler,
  dogru_cevap: q.dogru_cevap,
  ipucu: q.ipucu,
  kazanim: q.kazanim,
}));

// Ustalık bazlı ilerleme: seviye 1'den başla, art arda 4 doğruda bir üst
// seviyeye geç. Flow teorisi gereği: 2 yanlış üst üste olursa bir seviye
// geri düş (zorluk azalsın, kaygı birikmesin). Süre baskısı yok.
const STREAK_TO_LEVEL_UP = 4;
const WRONG_STREAK_TO_LEVEL_DOWN = 2;
const BATCH_SIZE = 10; // bir "oturum" kaç soru

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestion(seviye, askedIds) {
  const pool = QUESTIONS.filter((q) => q.seviye === seviye && !askedIds.has(q.id));
  const usable = pool.length > 0 ? pool : QUESTIONS.filter((q) => q.seviye === seviye);
  return usable[Math.floor(Math.random() * usable.length)];
}

export default function PratikModuMatematik({ onExit } = {}) {
  const [seviye, setSeviye] = useState(1);
  const [streak, setStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [askedIds, setAskedIds] = useState(() => new Set());
  const [current, setCurrent] = useState(() => pickQuestion(1, new Set()));
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [wrongPick, setWrongPick] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [levelUpFlash, setLevelUpFlash] = useState(null); // 'up' | 'down' | null
  const [batchDone, setBatchDone] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const options = useMemo(() => shuffle(current.secenekler), [current]);

  function nextQuestion(nextSeviye, nextAskedIds) {
    const q = pickQuestion(nextSeviye, nextAskedIds);
    setCurrent(q);
    setFeedback(null);
    setWrongPick(null);
    setShowHint(false);
  }

  function handlePick(val) {
    if (feedback === "correct" || batchDone || paused) return;

    const newAskedIds = new Set(askedIds);
    newAskedIds.add(current.id);
    setAskedIds(newAskedIds);

    if (val === current.dogru_cevap) {
      setFeedback("correct");
      const newCorrect = correctCount + 1;
      const newAnswered = answeredCount + 1;
      const newStreak = streak + 1;
      setCorrectCount(newCorrect);
      setAnsweredCount(newAnswered);
      setStreak(newStreak);
      setWrongStreak(0);

      let nextSeviye = seviye;
      if (newStreak >= STREAK_TO_LEVEL_UP && seviye < 3) {
        nextSeviye = seviye + 1;
        setSeviye(nextSeviye);
        setStreak(0);
        setLevelUpFlash("up");
      }

      timeoutRef.current = setTimeout(() => {
        setLevelUpFlash(null);
        if (newAnswered >= BATCH_SIZE) {
          setBatchDone(true);
        } else {
          nextQuestion(nextSeviye, newAskedIds);
        }
      }, 700);
    } else {
      setFeedback("wrong");
      setWrongPick(val);
      setStreak(0);
      setShowHint(true);
      const newWrongStreak = wrongStreak + 1;
      setWrongStreak(newWrongStreak);

      if (newWrongStreak >= WRONG_STREAK_TO_LEVEL_DOWN && seviye > 1) {
        const demotedSeviye = seviye - 1;
        setSeviye(demotedSeviye);
        setWrongStreak(0);
        setLevelUpFlash("down");
        timeoutRef.current = setTimeout(() => {
          setLevelUpFlash(null);
          nextQuestion(demotedSeviye, newAskedIds);
        }, 900);
      } else {
        timeoutRef.current = setTimeout(() => {
          setFeedback(null);
          setWrongPick(null);
        }, 700);
      }
    }
  }

  function restart() {
    clearTimeout(timeoutRef.current);
    setSeviye(1);
    setStreak(0);
    setWrongStreak(0);
    setAskedIds(new Set());
    setAnsweredCount(0);
    setCorrectCount(0);
    setBatchDone(false);
    nextQuestion(1, new Set());
  }

  const stars = correctCount >= BATCH_SIZE ? 3 : correctCount >= BATCH_SIZE - 2 ? 2 : 1;
  const seviyeLabel = { 1: "Tanışma", 2: "Pekiştirme", 3: "Ustalık" }[seviye];

  return (
    <div className="pratik-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;700;800&display=swap');

        .pratik-root {
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
          margin-bottom: 10px;
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
        .seviye-pill {
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

        .streak-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-bottom: 16px;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 13px;
          color: var(--ink-soft);
        }
        .streak-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--track-bg);
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .streak-dot.filled { background: var(--grass-dark); transform: scale(1.15); }

        .progress-track {
          display: flex;
          gap: 4px;
          margin-bottom: 20px;
        }
        .progress-flag {
          flex: 1;
          height: 8px;
          border-radius: 4px;
          background: var(--track-bg);
        }
        .progress-flag.filled { background: var(--sun); }

        .question-card {
          background: var(--card);
          border-radius: 24px;
          padding: 30px 20px;
          text-align: center;
          margin-bottom: 18px;
          box-shadow: 0 6px 20px rgba(31,46,69,0.08);
          position: relative;
        }
        .question-card.shake { animation: shake 0.5s ease; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .context-text {
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 15px;
          color: var(--ink-soft);
          background: var(--track-bg);
          border-radius: 12px;
          padding: 8px 14px;
          margin-bottom: 12px;
          line-height: 1.4;
        }
        .context-emoji { font-size: 16px; }
        .question-text {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 38px;
          color: var(--ink);
        }
        .kazanim-tag {
          margin-top: 10px;
          font-size: 11px;
          color: #A8B4C8;
          font-family: 'Nunito', sans-serif;
        }
        .hint-btn {
          margin-top: 12px;
          background: transparent;
          border: none;
          color: var(--ink-soft);
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 10px;
        }
        .hint-btn:hover { background: var(--track-bg); }
        .hint-text {
          margin-top: 10px;
          background: #FFF7E0;
          color: #8A6D1D;
          font-size: 13px;
          padding: 8px 14px;
          border-radius: 12px;
          display: inline-block;
        }

        .level-up-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--grass-dark);
          color: white;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 12px;
          padding: 5px 14px;
          border-radius: 999px;
          animation: pop 0.6s ease;
          white-space: nowrap;
        }
        .level-down-badge { background: #F0A63E; }
        @keyframes pop {
          0% { transform: translateX(-50%) scale(0.5); opacity: 0; }
          50% { transform: translateX(-50%) scale(1.1); opacity: 1; }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }

        .options-row {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .option-btn {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 26px;
          color: var(--ink);
          background: var(--card);
          border: none;
          border-radius: 18px;
          min-width: 78px;
          height: 78px;
          padding: 0 10px;
          cursor: pointer;
          box-shadow: 0 4px 0 rgba(31,46,69,0.15), 0 5px 10px rgba(31,46,69,0.06);
          transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.2s ease, color 0.2s ease;
        }
        .option-btn:active { transform: translateY(3px); box-shadow: 0 1px 0 rgba(31,46,69,0.15); }
        .option-btn.correct { background: var(--grass-dark); color: white; }
        .option-btn.wrong { background: #D9534F; color: white; }

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
        <div className="brand"><img src={`${import.meta.env.BASE_URL}fox-mascot.svg`} className="brand-emoji-img" alt="Tilki" /> Pratik Modu</div>
        <div className="top-right">
          <span className="seviye-pill">{seviyeLabel}</span>
          <button className="icon-btn" onClick={() => setPaused(true)} aria-label="Duraklat">⏸️</button>
        </div>
      </div>

      <div className="streak-row">
        <BookOpen size={14} />
        {Array.from({ length: STREAK_TO_LEVEL_UP }).map((_, i) => (
          <span key={i} className={`streak-dot ${i < streak ? "filled" : ""}`} />
        ))}
      </div>

      <div className="progress-track">
        {Array.from({ length: BATCH_SIZE }).map((_, i) => (
          <div key={i} className={`progress-flag ${i < answeredCount ? "filled" : ""}`} />
        ))}
      </div>

      <div className={`question-card ${feedback === "wrong" ? "shake" : ""}`}>
        {levelUpFlash === "up" && <div className="level-up-badge">🎉 Seviye atladın!</div>}
        {levelUpFlash === "down" && <div className="level-up-badge level-down-badge">💪 Biraz kolaylaştıralım</div>}
        {current.baglam_metni && (
          <div className="context-text">
            <span className="context-emoji">{current.tema_emoji}</span> {current.baglam_metni}
          </div>
        )}
        <div className="question-text">{current.soru_metni}</div>
        {!showHint && current.ipucu ? (
          <button className="hint-btn" onClick={() => setShowHint(true)}>
            <HelpCircle size={14} /> İpucu göster
          </button>
        ) : showHint && current.ipucu ? (
          <div className="hint-text">💡 {current.ipucu}</div>
        ) : null}
        {/* Kazanım kodu bilerek gösterilmiyor - teknik/idari bilgi, çocuk ekranına ait değil */}
      </div>

      <div className="options-row">
        {options.map((opt) => {
          let cls = "option-btn";
          if (feedback === "correct" && opt === current.dogru_cevap) cls += " correct";
          if (feedback === "wrong" && opt === wrongPick) cls += " wrong";
          return (
            <button key={opt} className={cls} onClick={() => handlePick(opt)}>
              {opt}
            </button>
          );
        })}
      </div>

      {batchDone && (
        <div className="finish-overlay">
          <Trophy size={44} color="#FFC93C" />
          <div className="finish-title">Bu oturumu bitirdin!</div>
          <div className="finish-stars">
            {[1, 2, 3].map((i) => (
              <Star key={i} size={28} fill={i <= stars ? "#FFC93C" : "none"} stroke="#FFC93C" />
            ))}
          </div>
          <div style={{ fontFamily: "Nunito", fontSize: 14, opacity: 0.9 }}>
            {correctCount}/{BATCH_SIZE} doğru — {seviyeLabel} seviyesindesin
          </div>
          <button className="primary-btn" onClick={restart}>
            <RotateCcw size={16} /> Yeni Oturum
          </button>
        </div>
      )}

      {showTutorial && (
        <div className="tutorial-overlay">
          <img src={`${import.meta.env.BASE_URL}fox-mascot.svg`} className="tutorial-emoji-img" alt="Tilki" />
          <div className="finish-title">Pratik Modu</div>
          <div className="tutorial-steps">
            <div className="tutorial-step">
              <span className="tutorial-step-icon">📚</span>
              <span>Soruları sırayla çöz, süre yok</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">🔥</span>
              <span>Art arda 4 doğru = seviye atla</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">💡</span>
              <span>Takılırsan ipucuna bakabilirsin</span>
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
