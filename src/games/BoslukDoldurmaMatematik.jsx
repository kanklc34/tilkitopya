import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Star, Trophy, RotateCcw } from "lucide-react";

// ---- Oyun ayarları ----
const ROUND_LENGTH = 6; // her turu bitirmek için gereken doğru cevap
// Tur ilerledikçe hem sayı aralığı hem de tuş takımı büyüyor - baştan 21
// tuş göstermek çocuğu yorar, kademeli büyümek daha doğru.
const ROUNDS = [
  { max: 10, blankPositions: ["result"] },
  { max: 15, blankPositions: ["result", "second"] },
  { max: 20, blankPositions: ["second", "first"] },
];
const TOTAL_ROUNDS = ROUNDS.length;
// Denklem sorularının yanına "sıralama" (önce/sonra) soruları da karışıyor -
// bu, MEB'in "Sayılar ve Nicelikler: sıralama" kazanımına karşılık geliyor.
const SEQUENCE_RATIO = 0.35;

// Tema havuzu: sadece "sonuç eksik" (a op b = ?) sorularında bağlam cümlesi
// anlamlı okunuyor - "eksik toplama" (3 + ? = 5) türünde doğal bir cümle
// kurmak zorlaşıyor, o yüzden orada tema kullanmıyoruz (zaten daha soyut
// bir aşama - concreteness fading ile uyumlu).
const THEMES = [
  { emoji: "🐦", add: "{a} kuş vardı, {b} kuş daha geldi.", sub: "{a} kuş vardı, {b} kuş uçtu gitti.", addZero: "{a} kuş vardı, hiç kuş gelmedi.", subZero: "{a} kuş vardı, hiç kuş uçup gitmedi." },
  { emoji: "🌸", add: "{a} çiçek vardı, {b} çiçek daha açtı.", sub: "{a} çiçek vardı, {b} tanesi soldu.", addZero: "{a} çiçek vardı, hiç çiçek açmadı.", subZero: "{a} çiçek vardı, hiç çiçek solmadı." },
  { emoji: "🎈", add: "{a} balon vardı, {b} balon daha eklendi.", sub: "{a} balon vardı, {b} tanesi uçtu.", addZero: "{a} balon vardı, hiç balon eklenmedi.", subZero: "{a} balon vardı, hiç balon uçmadı." },
  { emoji: "🍎", add: "{a} elma vardı, {b} elma daha kondu.", sub: "{a} elma vardı, {b} elma yendi.", addZero: "{a} elma vardı, hiç elma konmadı.", subZero: "{a} elma vardı, hiç elma yenmedi." },
  { emoji: "📖", add: "{a} kitap vardı, {b} kitap daha kondu.", sub: "{a} kitap vardı, {b} kitap verildi.", addZero: "{a} kitap vardı, hiç kitap konmadı.", subZero: "{a} kitap vardı, hiç kitap verilmedi." },
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Tam aralığı (0..max) göstermek yerine doğru cevaba yakın 6 seçenek
// üretiyoruz - çocuk hâlâ gerçekten hesaplamak zorunda (3'ten eleme değil),
// ama gözü 21 tuş arasında taramıyor.
function generatePadOptions(answer, max) {
  const opts = new Set([answer]);
  let tries = 0;
  while (opts.size < 6 && tries < 60) {
    tries++;
    const delta = rand(-4, 4);
    const candidate = answer + delta;
    if (candidate >= 0 && candidate <= max && candidate !== answer) {
      opts.add(candidate);
    }
  }
  while (opts.size < 6) {
    opts.add(rand(0, max));
  }
  return Array.from(opts).sort(() => Math.random() - 0.5);
}

function generateEquationPuzzle(max, blankPositions) {
  const op = Math.random() < 0.5 ? "+" : "-";
  let a, b, c;
  if (op === "+") {
    a = rand(0, max);
    b = rand(0, max - a);
    c = a + b;
  } else {
    a = rand(0, max);
    b = rand(0, a);
    c = a - b;
  }
  const blank = blankPositions[rand(0, blankPositions.length - 1)];
  const answer = blank === "result" ? c : blank === "second" ? b : a;

  let baglamMetni = null;
  let emoji = null;
  if (blank === "result") {
    const theme = THEMES[rand(0, THEMES.length - 1)];
    emoji = theme.emoji;
    let tpl;
    if (b === 0) tpl = op === "+" ? theme.addZero : theme.subZero;
    else tpl = op === "+" ? theme.add : theme.sub;
    baglamMetni = tpl.replace("{a}", a).replace("{b}", b);
  }

  return { type: "equation", a, b, c, op, blank, answer, baglamMetni, emoji };
}

function generateSequencePuzzle(max) {
  const n = rand(1, Math.max(1, max - 1));
  const seq = [n - 1, n, n + 1];
  const blankIndex = rand(0, 2);
  return { type: "sequence", seq, blankIndex, answer: seq[blankIndex] };
}

function generatePuzzle(round) {
  const { max, blankPositions } = ROUNDS[round];
  if (Math.random() < SEQUENCE_RATIO) return generateSequencePuzzle(max);
  return generateEquationPuzzle(max, blankPositions);
}

// Bu oyun soru bankasından değil, anlık üretilen bulmacalardan besleniyor
// (ipucu alanı yok) - o yüzden puzzle tipine göre basit bir strateji
// ipucu üretiyoruz.
function puzzleIpucu(puzzle) {
  if (puzzle.type === "sequence") {
    return "Sayıları sırayla say: bir öncesi ve bir sonrası";
  }
  return "Parmaklarınla ya da nesnelerle say";
}

function Slot({ filled, value, isBlank }) {
  if (isBlank) {
    return <span className={`slot slot-blank ${filled ? "slot-filled" : ""}`}>{filled ? value : "?"}</span>;
  }
  return <span className="slot">{value}</span>;
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

export default function FillBlankGame({ onExit, onComplete } = {}) {
  const [round, setRound] = useState(0);
  const [puzzle, setPuzzle] = useState(() => generatePuzzle(0));
  const [progress, setProgress] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [wrongPick, setWrongPick] = useState(null);
  const [ayniSoruDenemeSayisi, setAyniSoruDenemeSayisi] = useState(0);
  const [finished, setFinished] = useState(false);
  const [roundDone, setRoundDone] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [paused, setPaused] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const timeoutRef = useRef(null);

  const nextPuzzle = useCallback((r) => {
    const p = generatePuzzle(r);
    setPuzzle(p);
    setFeedback(null);
    setWrongPick(null);
    setAyniSoruDenemeSayisi(0);
  }, []);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const pad = useMemo(
    () => generatePadOptions(puzzle.answer, ROUNDS[round].max),
    [puzzle, round]
  );
  const cevapAcikMi = feedback === "correct" || (feedback === "wrong" && ayniSoruDenemeSayisi >= 2);

  function handlePick(val) {
    if (feedback === "correct" || finished || roundDone) return;

    if (val === puzzle.answer) {
      setFeedback("correct");
      if (soundOn) playTone("correct");
      setShowBurst(true);
      const newProgress = progress + 1;
      setProgress(newProgress);

      timeoutRef.current = setTimeout(() => {
        if (newProgress >= ROUND_LENGTH) {
          if (round + 1 >= TOTAL_ROUNDS) {
            setFinished(true);
          } else {
            setRoundDone(true);
          }
        } else {
          nextPuzzle(round);
        }
      }, 800);
    } else {
      setFeedback("wrong");
      if (soundOn) playTone("wrong");
      setWrongPick(val);
      setTotalMistakes((m) => m + 1);
      const yeniDenemeSayisi = ayniSoruDenemeSayisi + 1;
      setAyniSoruDenemeSayisi(yeniDenemeSayisi);

      if (yeniDenemeSayisi >= 2) {
        // Çocuk sonsuza dek karanlıkta denemesin - doğru cevabı göster,
        // biraz bekleyip sonraki bulmacaya geç.
        timeoutRef.current = setTimeout(() => {
          nextPuzzle(round);
        }, 2200);
      } else {
        timeoutRef.current = setTimeout(() => {
          setFeedback(null);
          setWrongPick(null);
        }, 650);
      }
    }
  }

  // patlama efektini kısa süre sonra kapat
  useEffect(() => {
    if (!showBurst) return;
    const t = setTimeout(() => setShowBurst(false), 500);
    return () => clearTimeout(t);
  }, [showBurst]);

  function nextRound() {
    const r = round + 1;
    setRound(r);
    setProgress(0);
    setRoundDone(false);
    nextPuzzle(r);
  }

  function restart() {
    clearTimeout(timeoutRef.current);
    setRound(0);
    setProgress(0);
    setTotalMistakes(0);
    setFinished(false);
    setRoundDone(false);
    nextPuzzle(0);
  }

  const stars = totalMistakes === 0 ? 3 : totalMistakes <= 3 ? 2 : 1;

  // Oturum bittiğinde merkezi ilerleme sistemine bir kez bildir
  const reportedRef = useRef(false);
  useEffect(() => {
    if (finished && !reportedRef.current) {
      reportedRef.current = true;
      onComplete?.(stars);
    }
  }, [finished, stars, onComplete]);

  return (
    <div className="fill-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;700;800&display=swap');

        .fill-root {
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
          padding: 34px 20px;
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

        .context-text {
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 14px;
          color: var(--ink-soft);
          background: var(--track-bg);
          border-radius: 12px;
          padding: 7px 12px;
          margin-bottom: 12px;
          line-height: 1.4;
        }
        .context-emoji { font-size: 15px; }
        .hint-text {
          margin-top: 10px;
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          color: var(--ink-soft);
        }
        .correct-reveal {
          margin-top: 8px;
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          color: #1F2E45;
          background: #E4F7E6;
          border-radius: 10px;
          padding: 6px 12px;
          display: inline-block;
        }
        .equation-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 40px;
          color: var(--ink);
        }
        .slot {
          min-width: 52px;
          display: inline-block;
        }
        .slot-blank {
          background: var(--track-bg);
          border: 3px dashed #9AB4CE;
          border-radius: 14px;
          padding: 2px 10px;
          color: #9AB4CE;
        }
        .slot-blank.slot-filled {
          background: #E4F7E6;
          border: 3px solid var(--grass-dark);
          color: var(--grass-dark);
        }

        .numberpad {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .pad-key {
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 22px;
          color: var(--ink);
          background: var(--card);
          border: none;
          border-radius: 14px;
          aspect-ratio: 1 / 1;
          cursor: pointer;
          box-shadow: 0 4px 0 rgba(31,46,69,0.12), 0 5px 10px rgba(31,46,69,0.06);
          transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.2s ease;
        }
        .pad-key:active { transform: translateY(2px); box-shadow: 0 2px 0 rgba(31,46,69,0.12); }
        .pad-key.correct { background: var(--grass-dark); color: white; }
        .pad-key.wrong { background: #D9534F; color: white; }

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
        <h1 className="brand"><img src={`${import.meta.env.BASE_URL}fox-mascot.png`} className="brand-emoji-img" alt="Tilki" /> Boşluk Doldur</h1>
        <div className="top-right">
          <span className="round-pill">Tur {round + 1}/{TOTAL_ROUNDS}</span>
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
        {puzzle.baglamMetni && (
          <div className="context-text">
            <span className="context-emoji">{puzzle.emoji}</span> {puzzle.baglamMetni}
          </div>
        )}
        {puzzle.type === "equation" ? (
          <div className="equation-row">
            <Slot value={puzzle.a} isBlank={puzzle.blank === "first"} filled={cevapAcikMi && puzzle.blank === "first"} />
            <span>{puzzle.op}</span>
            <Slot value={puzzle.b} isBlank={puzzle.blank === "second"} filled={cevapAcikMi && puzzle.blank === "second"} />
            <span>=</span>
            <Slot value={puzzle.c} isBlank={puzzle.blank === "result"} filled={cevapAcikMi && puzzle.blank === "result"} />
          </div>
        ) : (
          <div className="equation-row">
            <Slot value={puzzle.seq[0]} isBlank={puzzle.blankIndex === 0} filled={cevapAcikMi && puzzle.blankIndex === 0} />
            <span>→</span>
            <Slot value={puzzle.seq[1]} isBlank={puzzle.blankIndex === 1} filled={cevapAcikMi && puzzle.blankIndex === 1} />
            <span>→</span>
            <Slot value={puzzle.seq[2]} isBlank={puzzle.blankIndex === 2} filled={cevapAcikMi && puzzle.blankIndex === 2} />
          </div>
        )}
        {feedback === "wrong" && (
          <div className="hint-text">💡 {puzzleIpucu(puzzle)}</div>
        )}
        {cevapAcikMi && (
          <div className="correct-reveal">Doğru cevap: <strong>{puzzle.answer}</strong></div>
        )}
      </div>

      <div className="numberpad">
        {pad.map((n) => {
          let cls = "pad-key";
          if (feedback === "correct" && n === puzzle.answer) cls += " correct";
          if (feedback === "wrong" && n === wrongPick) cls += " wrong";
          if (cevapAcikMi && n === puzzle.answer) cls += " correct";
          return (
            <button key={n} className={cls} onClick={() => handlePick(n)}>
              {n}
            </button>
          );
        })}
      </div>

      {roundDone && (
        <div className="round-overlay">
          <Trophy size={40} color="#FFC93C" />
          <div className="finish-title">Tur {round + 1} tamam!</div>
          <button className="primary-btn" onClick={nextRound}>
            Sonraki Tur
          </button>
        </div>
      )}

      {finished && (
        <div className="finish-overlay">
          <Trophy size={44} color="#FFC93C" />
          <div className="finish-title">Hepsini doldurdun!</div>
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
          <button className="secondary-btn" onClick={onExit}>Menüye Dön</button>
        </div>
      )}

      {showTutorial && (
        <div className="tutorial-overlay">
          <img src={`${import.meta.env.BASE_URL}fox-mascot.png`} className="tutorial-emoji-img" alt="Tilki" />
          <div className="finish-title">Nasıl Oynanır?</div>
          <div className="tutorial-steps">
            <div className="tutorial-step">
              <span className="tutorial-step-icon">❓</span>
              <span>Kesikli kutu eksik sayı demek</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">🤔</span>
              <span>Doğru sayıyı hesapla</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">👉</span>
              <span>Aşağıdan doğru sayıya dokun</span>
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
