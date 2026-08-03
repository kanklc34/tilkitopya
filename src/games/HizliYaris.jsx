import { useState, useEffect, useCallback, useRef } from "react";
import { Star, HelpCircle, Trophy, RotateCcw } from "lucide-react";

// ---- Oyun ayarları ----
const RACE_LENGTH = 10;
const LAP_SIZE = 4;
const OPTION_COLORS = ["#5AB4E0", "#FF9F5A", "#8FCB6B"]; // sabit, cevap doğruluğuyla ilgisiz - sadece görsel çeşitlilik

// Tema havuzu: her tema kısa bağlam cümlesi + eşleşen emoji taşıyor.
// Sıfır durumunda işlemi (özellikle çıkarmayı) gizlememek için toplama/
// çıkarma ayrı şablonlara sahip (bkz. soru bankası üretimindeki aynı ders).
const THEMES = [
  { ad: "hayvanlar", emoji: "🐦", add: "{a} kuş vardı, {b} kuş daha geldi.", sub: "{a} kuş vardı, {b} kuş uçtu gitti.", addZero: "{a} kuş vardı, hiç kuş gelmedi.", subZero: "{a} kuş vardı, hiç kuş uçup gitmedi." },
  { ad: "doga", emoji: "🌸", add: "{a} çiçek vardı, {b} çiçek daha açtı.", sub: "{a} çiçek vardı, {b} tanesi soldu.", addZero: "{a} çiçek vardı, hiç çiçek açmadı.", subZero: "{a} çiçek vardı, hiç çiçek solmadı." },
  { ad: "oyuncaklar", emoji: "🎈", add: "{a} balon vardı, {b} balon daha eklendi.", sub: "{a} balon vardı, {b} tanesi uçtu.", addZero: "{a} balon vardı, hiç balon eklenmedi.", subZero: "{a} balon vardı, hiç balon uçmadı." },
  { ad: "yiyecek", emoji: "🍎", add: "{a} elma vardı, {b} elma daha kondu.", sub: "{a} elma vardı, {b} elma yendi.", addZero: "{a} elma vardı, hiç elma konmadı.", subZero: "{a} elma vardı, hiç elma yenmedi." },
  { ad: "okul", emoji: "📖", add: "{a} kitap vardı, {b} kitap daha kondu.", sub: "{a} kitap vardı, {b} kitap verildi.", addZero: "{a} kitap vardı, hiç kitap konmadı.", subZero: "{a} kitap vardı, hiç kitap verilmedi." },
];

function ObjectGroup({ n, crossed = 0, emoji }) {
  if (n === 0) {
    return (
      <span className="object-group">
        <span className="object-empty">0</span>
      </span>
    );
  }
  return (
    <span className="object-group">
      {Array.from({ length: n }).map((_, i) => {
        const isCrossed = i >= n - crossed;
        return (
          <span key={i} className={`object-item ${isCrossed ? "object-crossed" : ""}`}>
            {emoji}
          </span>
        );
      })}
    </span>
  );
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion(maxNumber, withContext) {
  const op = Math.random() < 0.5 ? "+" : "-";
  let a, b, answer;
  if (op === "+") {
    a = rand(0, maxNumber);
    b = rand(0, maxNumber - a);
    answer = a + b;
  } else {
    a = rand(0, maxNumber);
    b = rand(0, a);
    answer = a - b;
  }
  const theme = THEMES[rand(0, THEMES.length - 1)];
  const emoji = theme.emoji;

  let baglamMetni = null;
  if (withContext) {
    let tpl;
    if (b === 0) tpl = op === "+" ? theme.addZero : theme.subZero;
    else tpl = op === "+" ? theme.add : theme.sub;
    baglamMetni = tpl.replace("{a}", a).replace("{b}", b);
  }

  return { a, b, op, answer, emoji, baglamMetni };
}

function generateOptions(answer, maxNumber) {
  const opts = new Set([answer]);
  while (opts.size < 3) {
    const delta = rand(-3, 3);
    const candidate = answer + delta;
    if (candidate >= 0 && candidate <= maxNumber + 3 && candidate !== answer) {
      opts.add(candidate);
    }
  }
  return Array.from(opts).sort(() => Math.random() - 0.5);
}

function Dots({ n }) {
  return (
    <div className="hint-dots">
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className="hint-dot" />
      ))}
    </div>
  );
}

// Basit, dosyasız sesli geri bildirim (Web Audio)
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

export default function MathRaceGame({ onExit } = {}) {
  const [lap, setLap] = useState(1);
  const [maxNumber, setMaxNumber] = useState(5);
  const [question, setQuestion] = useState(() => generateQuestion(5, true));
  const [options, setOptions] = useState(() => generateOptions(question.answer, 5));
  const [progress, setProgress] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [wrongPick, setWrongPick] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef(null);

  const nextQuestion = useCallback((newMax) => {
    const m = newMax ?? maxNumber;
    const withContext = m <= 10; // lap<=2 ile eşdeğer eşik
    const q = generateQuestion(m, withContext);
    setQuestion(q);
    setOptions(generateOptions(q.answer, m));
    setShowHint(false);
    setFeedback(null);
    setWrongPick(null);
  }, [maxNumber]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function handlePick(val) {
    if (feedback === "correct" || finished) return;

    if (val === question.answer) {
      setFeedback("correct");
      if (soundOn) playTone("correct");
      const newProgress = progress + 1;
      setProgress(newProgress);

      let newMax = maxNumber;
      if (newProgress % LAP_SIZE === 0 && maxNumber < 20) {
        setLap((l) => l + 1);
        newMax = Math.min(20, maxNumber + 5);
        setMaxNumber(newMax);
      }

      timeoutRef.current = setTimeout(() => {
        if (newProgress >= RACE_LENGTH) {
          setFinished(true);
        } else {
          nextQuestion(newMax);
        }
      }, 800);
    } else {
      setFeedback("wrong");
      if (soundOn) playTone("wrong");
      setWrongPick(val);
      setTotalMistakes((n) => n + 1);
      setShowHint(true);
      timeoutRef.current = setTimeout(() => {
        setFeedback(null);
        setWrongPick(null);
      }, 650);
    }
  }

  function restart() {
    clearTimeout(timeoutRef.current);
    setLap(1);
    setMaxNumber(5);
    setProgress(0);
    setTotalMistakes(0);
    setFinished(false);
    nextQuestion(5);
  }

  const stars = totalMistakes === 0 ? 3 : totalMistakes <= 3 ? 2 : 1;
  const trackFill = (progress / RACE_LENGTH) * 100;

  // Rakam HER ZAMAN görünür (planımızdaki ilkeye uygun); sadece görsel
  // destek turlara göre azalır: tur1 = varsayılan açık, tur2 = istenirse
  // açılır, tur3+ = sadece nokta ipucu. Sayı 6'yı geçerse (dağınıklık
  // riski) görsel destek hiç sunulmaz.
  const objectsFit = question.a <= 6 && question.b <= 6;
  const objectsAvailable = objectsFit && lap <= 2;
  const objectsVisible = objectsAvailable && showHint;

  return (
    <div className="game-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;700;800&display=swap');

        .game-root {
          --bg: #EAF6FD;
          --card: #FFFFFF;
          --ink: #1F2E45;
          --ink-soft: #5C6B85;
          --hero: #FF7A59;
          --hero-dark: #E05A3B;
          --sun: #FFC93C;
          --grass: #6FBF73;
          --grass-dark: #4E9F53;
          --track-bg: #D8ECF7;
          font-family: 'Nunito', sans-serif;
          color: var(--ink);
          background: var(--bg);
          border-radius: 28px;
          padding: 28px 24px;
          max-width: 480px;
          margin: 0 auto;
          box-shadow: 0 10px 32px rgba(31,46,69,0.12);
          position: relative;
        }

        /* ---- Üst bar ---- */
        .top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 19px;
          color: var(--ink);
        }
        .brand-emoji { font-size: 26px; }
        .brand-emoji-img { width: 26px; height: 26px; }
        .top-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .lap-pill {
          background: var(--sun);
          color: var(--ink);
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 13px;
          padding: 5px 12px;
          border-radius: 999px;
        }
        .sound-btn {
          border: none;
          background: var(--card);
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 15px;
          box-shadow: 0 2px 6px rgba(31,46,69,0.1);
        }

        /* ---- İnce yarış çubuğu ---- */
        .track-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 26px;
        }
        .track-bar {
          flex: 1;
          height: 14px;
          background: var(--track-bg);
          border-radius: 999px;
          position: relative;
          overflow: visible;
        }
        .track-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--grass) 0%, var(--grass-dark) 100%);
          border-radius: 999px;
          transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .track-car {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%) scaleX(-1);
          font-size: 22px;
          transition: left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .track-flag { font-size: 18px; }

        /* ---- Soru kartı ---- */
        .question-card {
          background: var(--card);
          border-radius: 24px;
          padding: 30px 20px;
          text-align: center;
          margin-bottom: 22px;
          box-shadow: 0 6px 20px rgba(31,46,69,0.08);
        }
        .question-card.shake { animation: shake 0.5s ease; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .object-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .object-group {
          display: inline-flex;
          gap: 2px;
          flex-wrap: wrap;
          max-width: 100%;
          justify-content: center;
        }
        .object-item {
          font-size: 22px;
          line-height: 1;
          position: relative;
          display: inline-flex;
        }
        .object-item.object-crossed {
          opacity: 0.32;
          filter: grayscale(60%);
        }
        .object-item.object-crossed::after {
          content: '';
          position: absolute;
          left: -2px;
          right: -2px;
          top: 50%;
          height: 2px;
          background: #D9534F;
          transform: rotate(-18deg);
        }
        .object-empty {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border: 2px dashed #B7C2D6;
          border-radius: 8px;
          color: #8593AC;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 15px;
        }
        .object-op {
          font-size: 20px;
        }
        .context-text {
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 14px;
          color: var(--ink-soft);
          background: var(--track-bg);
          border-radius: 12px;
          padding: 7px 12px;
          margin-bottom: 10px;
          line-height: 1.4;
        }
        .context-emoji { font-size: 15px; }
        .question-text {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 40px;
          color: var(--ink);
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
        .hint-dots {
          margin-top: 12px;
          display: flex;
          justify-content: center;
          gap: 7px;
          flex-wrap: wrap;
        }
        .hint-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--hero);
        }

        /* ---- Cevap butonları ---- */
        .options-row {
          display: flex;
          gap: 16px;
          justify-content: center;
        }
        .option-btn {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 30px;
          color: white;
          border: none;
          border-radius: 20px;
          width: 92px;
          height: 88px;
          cursor: pointer;
          box-shadow: 0 5px 0 rgba(0,0,0,0.15);
          transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.2s ease;
        }
        .option-btn:active { transform: translateY(3px); box-shadow: 0 2px 0 rgba(0,0,0,0.15); }
        .option-btn.correct { background: var(--grass-dark) !important; }
        .option-btn.wrong { background: #D9534F !important; }

        /* ---- Bitiş ekranı ---- */
        .finish-overlay {
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
        }
        .finish-title {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 26px;
        }
        .finish-stars { display: flex; gap: 6px; margin: 8px 0; }
        .replay-btn {
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

        .tutorial-overlay {
          position: absolute;
          inset: 0;
          background: rgba(31,46,69,0.95);
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
        .tutorial-emoji { font-size: 40px; }
        .tutorial-emoji-img { width: 46px; height: 46px; }
        .tutorial-title {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 22px;
          margin-bottom: 4px;
        }
        .tutorial-steps {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 6px 0 4px;
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
        .tutorial-note {
          font-size: 11px;
          opacity: 0.65;
          margin-top: 4px;
          max-width: 280px;
        }
        .pause-exit-btn {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.75);
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 13px;
          margin-top: 8px;
          cursor: pointer;
          text-decoration: underline;
        }
      `}</style>

      <div className="top-row">
        <div className="brand"><img src={`${import.meta.env.BASE_URL}fox-mascot.svg`} className="brand-emoji-img" alt="Tilki" /> Hızlı Yarış</div>
        <div className="top-right">
          <span className="lap-pill">Tur {lap}</span>
          <button className="sound-btn" onClick={() => setSoundOn((s) => !s)} aria-label="Ses aç/kapat">
            {soundOn ? "🔊" : "🔇"}
          </button>
          <button className="sound-btn" onClick={() => setPaused(true)} aria-label="Duraklat">
            ⏸️
          </button>
        </div>
      </div>

      <div className="track-row">
        <div className="track-bar">
          <div className="track-fill" style={{ width: `${trackFill}%` }} />
          <div className="track-car" style={{ left: `${Math.min(96, Math.max(4, trackFill))}%` }}>🚗</div>
        </div>
        <span className="track-flag">🏁</span>
      </div>

      <div className={`question-card ${feedback === "wrong" ? "shake" : ""}`}>
        {question.baglamMetni && (
          <div className="context-text">
            <span className="context-emoji">{question.emoji}</span> {question.baglamMetni}
          </div>
        )}

        {objectsVisible && (
          <div className="object-row">
            {question.op === "+" ? (
              <>
                <ObjectGroup n={question.a} emoji={question.emoji} />
                <span className="object-op">➕</span>
                <ObjectGroup n={question.b} emoji={question.emoji} />
              </>
            ) : (
              <ObjectGroup n={question.a} crossed={question.b} emoji={question.emoji} />
            )}
          </div>
        )}

        <div className="question-text">
          {question.a} {question.op} {question.b} = ?
        </div>

        {objectsAvailable && !objectsVisible && (
          <button className="hint-btn" onClick={() => setShowHint(true)}>
            <HelpCircle size={14} /> Görsel göster
          </button>
        )}
        {!objectsAvailable && !showHint && (
          <button className="hint-btn" onClick={() => setShowHint(true)}>
            <HelpCircle size={14} /> İpucu göster
          </button>
        )}
        {!objectsAvailable && showHint && <Dots n={question.a} />}
      </div>

      <div className="options-row">
        {options.map((opt, i) => {
          let cls = "option-btn";
          if (feedback === "correct" && opt === question.answer) cls += " correct";
          if (feedback === "wrong" && opt === wrongPick) cls += " wrong";
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

      {finished && (
        <div className="finish-overlay">
          <Trophy size={44} color="#FFC93C" />
          <div className="finish-title">Yarışı bitirdin!</div>
          <div className="finish-stars">
            {[1, 2, 3].map((i) => (
              <Star key={i} size={28} fill={i <= stars ? "#FFC93C" : "none"} stroke="#FFC93C" />
            ))}
          </div>
          <div style={{ fontFamily: "Nunito", fontSize: 14, opacity: 0.9 }}>
            {totalMistakes === 0 ? "Hiç yanlışın yok, harikasın!" : `${totalMistakes} kere zorlandın, sorun değil!`}
          </div>
          <button className="replay-btn" onClick={restart}>
            <RotateCcw size={16} /> Tekrar Oyna
          </button>
        </div>
      )}

      {showTutorial && (
        <div className="tutorial-overlay">
          <img src={`${import.meta.env.BASE_URL}fox-mascot.svg`} className="tutorial-emoji-img" alt="Tilki" />
          <div className="tutorial-title">Nasıl Oynanır?</div>
          <div className="tutorial-steps">
            <div className="tutorial-step">
              <span className="tutorial-step-icon">🔢</span>
              <span>Yukarıda bir soru var, cevabını bul</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">👉</span>
              <span>Doğru sayıya dokun</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">🚗</span>
              <span>Araba ilerlesin, bitiş çizgisine ulaş!</span>
            </div>
          </div>
          <div className="tutorial-note">(Veliye not: Görsel yardım için "İpucu" düğmesi kullanılabilir.)</div>
          <button className="replay-btn" onClick={() => setShowTutorial(false)}>
            Başla!
          </button>
        </div>
      )}

      {paused && (
        <div className="tutorial-overlay">
          <div className="tutorial-emoji">⏸️</div>
          <div className="tutorial-title">Duraklatıldı</div>
          <button className="replay-btn" onClick={() => setPaused(false)}>
            ▶️ Devam Et
          </button>
          <button className="pause-exit-btn" onClick={() => (onExit ? onExit() : setPaused(false))}>
            Oyundan Çık
          </button>
          <div className="tutorial-note">(Üretimde: çıkış öncesi veli onayı/PIN istenebilir.)</div>
        </div>
      )}
    </div>
  );
}
