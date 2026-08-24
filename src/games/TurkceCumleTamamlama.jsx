import { useState, useMemo, useRef, useEffect } from "react";
import { Star, Trophy, RotateCcw, PenLine } from "lucide-react";
import turkceBankasiSinif2 from "../data/turkce-2-sinif.json";

// ---- Cümle Tamamlama (bkz. devir-teslim Bölüm 4 madde 4) ----
// Kapsam BİLİNÇLİ olarak daraltıldı: bitişik el yazısı (çizim/tracing
// motoru gerektirir) ve paragraf okuma (çok daha büyük içerik yazımı
// gerektirir) bu oturumda YAPILMADI - ikisi de burada kurulan
// "soru bankası + basit motor" desenine uymuyor, ayrı bir tasarım kararı
// gerektiriyor. Bu oyun sadece "cümle bilgisi" alt kazanımını kapsıyor:
// çocuk cümledeki boşluğa anlama uygun kelimeyi 3 seçenek arasından
// seçiyor. Sadece 2. sınıfta mevcut - 1. sınıf müfredatı bu seviyede tam
// cümle kurma/tamamlamaya henüz gelmiyor (hece/kelime düzeyinde kalıyor).
const BANKALAR = { 2: turkceBankasiSinif2 };

function sorulariHazirla(sinif) {
  const banka = BANKALAR[sinif];
  if (!banka) return [];
  return banka.sorular
    .filter((s) => s.soru_tipi === "cumle_tamamlama")
    .map((s) => ({
      id: s.id,
      seviye: s.seviye,
      soru_metni: s.soru_metni,
      secenekler: s.secenekler,
      dogru_cevap: s.dogru_cevap,
    }));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const STREAK_TO_LEVEL_UP = 4;
const WRONG_STREAK_TO_LEVEL_DOWN = 2;
const BATCH_SIZE = 10;
const MAX_LEVEL = 2;
const OPTION_COLORS = ["#5AB4E0", "#FF9F5A", "#8FCB6B"];

function pickQuestion(questions, seviye, askedIds) {
  const pool = questions.filter((q) => q.seviye === seviye && !askedIds.has(q.id));
  const usable = pool.length > 0 ? pool : questions.filter((q) => q.seviye === seviye);
  const q = usable[Math.floor(Math.random() * usable.length)];
  return { ...q, options: shuffle(q.secenekler) };
}

export default function TurkceCumleTamamlama({ onExit, onComplete, sinif = 2 } = {}) {
  const QUESTIONS = useMemo(() => sorulariHazirla(sinif), [sinif]);
  const [seviye, setSeviye] = useState(1);
  const [streak, setStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [askedIds, setAskedIds] = useState(() => new Set());
  const [current, setCurrent] = useState(() => pickQuestion(QUESTIONS, 1, new Set()));
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [wrongPick, setWrongPick] = useState(null);
  const [ayniSoruDenemeSayisi, setAyniSoruDenemeSayisi] = useState(0);
  const [levelUpFlash, setLevelUpFlash] = useState(null);
  const [batchDone, setBatchDone] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function nextQuestion(nextSeviye, nextAskedIds) {
    setCurrent(pickQuestion(QUESTIONS, nextSeviye, nextAskedIds));
    setFeedback(null);
    setWrongPick(null);
    setAyniSoruDenemeSayisi(0);
  }

  function handlePick(val) {
    if (feedback === "correct" || batchDone || paused) return;
    if (feedback === "wrong" && ayniSoruDenemeSayisi >= 2) return;

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
      if (newStreak >= STREAK_TO_LEVEL_UP && seviye < MAX_LEVEL) {
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
      }, 800);
    } else {
      setFeedback("wrong");
      setWrongPick(val);
      setStreak(0);
      const newWrongStreak = wrongStreak + 1;
      setWrongStreak(newWrongStreak);
      const yeniDenemeSayisi = ayniSoruDenemeSayisi + 1;
      setAyniSoruDenemeSayisi(yeniDenemeSayisi);
      const cevapGosterilsinMi = yeniDenemeSayisi >= 2;

      if (newWrongStreak >= WRONG_STREAK_TO_LEVEL_DOWN && seviye > 1) {
        const demotedSeviye = seviye - 1;
        setSeviye(demotedSeviye);
        setWrongStreak(0);
        setLevelUpFlash("down");
        timeoutRef.current = setTimeout(() => {
          setLevelUpFlash(null);
          nextQuestion(demotedSeviye, newAskedIds);
        }, cevapGosterilsinMi ? 2200 : 900);
      } else if (cevapGosterilsinMi) {
        timeoutRef.current = setTimeout(() => nextQuestion(seviye, newAskedIds), 2200);
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
  const seviyeLabel = { 1: "Tanışma", 2: "Ustalık" }[seviye];

  const reportedRef = useRef(false);
  useEffect(() => {
    if (batchDone && !reportedRef.current) {
      reportedRef.current = true;
      onComplete?.(stars);
    }
  }, [batchDone, stars, onComplete]);

  const [before, after] = current.soru_metni.split("___");

  return (
    <div className="ct-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;700;800&display=swap');

        .ct-root {
          --bg: #EAF6FD;
          --card: #FFFFFF;
          --ink: #1F2E45;
          --ink-soft: #5C6B85;
          --sun: #FFC93C;
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
        .top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .brand { display: flex; margin: 0; align-items: center; gap: 8px; font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 19px; }
        .seviye-pill { background: var(--sun); color: var(--ink); font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 13px; padding: 5px 12px; border-radius: 999px; }
        .top-right { display: flex; align-items: center; gap: 8px; }
        .icon-btn { border: none; background: var(--card); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; box-shadow: 0 2px 6px rgba(31,46,69,0.1); }
        .secondary-btn { background: transparent; border: none; color: rgba(255,255,255,0.75); font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 13px; margin-top: 6px; cursor: pointer; text-decoration: underline; }

        .streak-row { display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 16px; }
        .streak-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--track-bg); transition: background 0.2s ease, transform 0.2s ease; }
        .streak-dot.filled { background: var(--grass-dark); transform: scale(1.15); }

        .progress-track { display: flex; gap: 4px; margin-bottom: 20px; }
        .progress-flag { flex: 1; height: 8px; border-radius: 4px; background: var(--track-bg); }
        .progress-flag.filled { background: var(--sun); }

        .question-card { background: var(--card); border-radius: 24px; padding: 30px 20px; text-align: center; margin-bottom: 18px; box-shadow: 0 6px 20px rgba(31,46,69,0.08); position: relative; }
        .question-card.shake { animation: shake 0.5s ease; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-6px); } 80% { transform: translateX(6px); } }
        .sentence {
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 19px;
          line-height: 1.5;
          color: var(--ink);
        }
        .blank-slot {
          display: inline-block;
          min-width: 70px;
          padding: 2px 10px;
          border-bottom: 3px dashed #5AB4E0;
          color: #5AB4E0;
          font-weight: 700;
        }
        .blank-slot.filled { color: var(--grass-dark); border-bottom-style: solid; border-bottom-color: var(--grass-dark); }
        .correct-reveal { margin-top: 12px; font-family: 'Nunito', sans-serif; font-size: 13px; color: #1F2E45; background: #E4F7E6; border-radius: 10px; padding: 6px 12px; display: inline-block; }

        .level-up-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--grass-dark); color: white; font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 12px; padding: 5px 14px; border-radius: 999px; animation: pop 0.6s ease; white-space: nowrap; }
        .level-down-badge { background: #F0A63E; }
        @keyframes pop { 0% { transform: translateX(-50%) scale(0.5); opacity: 0; } 50% { transform: translateX(-50%) scale(1.1); opacity: 1; } 100% { transform: translateX(-50%) scale(1); opacity: 1; } }

        .options-row { display: flex; flex-direction: column; gap: 12px; }
        .option-btn {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 19px;
          color: white;
          border: none;
          border-radius: 16px;
          padding: 15px 12px;
          cursor: pointer;
          box-shadow: 0 5px 0 rgba(0,0,0,0.15);
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }
        .option-btn:active { transform: translateY(3px); box-shadow: 0 2px 0 rgba(0,0,0,0.15); }
        .option-btn.correct { background: var(--grass-dark) !important; }
        .option-btn.wrong { background: #D9534F !important; }

        .finish-overlay, .tutorial-overlay { position: absolute; inset: 0; background: rgba(31,46,69,0.93); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; border-radius: 28px; gap: 8px; text-align: center; padding: 26px 22px; z-index: 10; }
        .finish-title { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 24px; }
        .finish-stars { display: flex; gap: 6px; margin: 8px 0; }
        .primary-btn { margin-top: 12px; background: var(--sun); color: var(--ink); border: none; padding: 12px 24px; border-radius: 999px; font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 15px; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
        .tutorial-emoji { font-size: 38px; }
        .tutorial-steps { display: flex; flex-direction: column; gap: 10px; margin: 10px 0 4px; width: 100%; }
        .tutorial-step { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.1); border-radius: 14px; padding: 10px 14px; font-size: 14px; text-align: left; }
        .tutorial-step-icon { font-size: 20px; flex-shrink: 0; }
      `}</style>

      <div className="top-row">
        <h1 className="brand"><PenLine size={20} color="#5AB4E0" /> Cümle Tamamla</h1>
        <div className="top-right">
          <span className="seviye-pill">{seviyeLabel}</span>
          <button className="icon-btn" onClick={() => setPaused(true)} aria-label="Duraklat">⏸️</button>
        </div>
      </div>

      <div className="streak-row">
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
        <div className="sentence">
          {before}
          <span className={`blank-slot ${feedback === "correct" ? "filled" : ""}`}>
            {feedback === "correct" ? current.dogru_cevap : "___"}
          </span>
          {after}
        </div>
        {feedback === "wrong" && ayniSoruDenemeSayisi >= 2 && (
          <div className="correct-reveal">Doğru cevap: <strong>{current.dogru_cevap}</strong></div>
        )}
      </div>

      <div className="options-row">
        {current.options.map((opt, i) => {
          let cls = "option-btn";
          if (feedback === "correct" && opt === current.dogru_cevap) cls += " correct";
          if (feedback === "wrong" && opt === wrongPick) cls += " wrong";
          if (feedback === "wrong" && ayniSoruDenemeSayisi >= 2 && opt === current.dogru_cevap) cls += " correct";
          return (
            <button
              key={opt}
              className={cls}
              style={{ background: OPTION_COLORS[i % OPTION_COLORS.length] }}
              onClick={() => handlePick(opt)}
            >
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
          <button className="secondary-btn" onClick={onExit}>Menüye Dön</button>
        </div>
      )}

      {showTutorial && (
        <div className="tutorial-overlay">
          <img src={`${import.meta.env.BASE_URL}fox-mascot.png`} style={{ width: 44, height: 44 }} alt="Tilki" />
          <div className="finish-title">Cümle Tamamlama</div>
          <div className="tutorial-steps">
            <div className="tutorial-step">
              <span className="tutorial-step-icon">📖</span>
              <span>Cümleyi oku, boşluğa uyan kelimeyi düşün</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">👉</span>
              <span>Doğru kelimeye dokun</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">🔥</span>
              <span>Art arda 4 doğru = seviye atla</span>
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
