import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Star, Trophy, RotateCcw } from "lucide-react";
import turkceBankasiSinif1 from "../data/turkce-1-sinif.json";
import turkceBankasiSinif2 from "../data/turkce-2-sinif.json";

// ---- Oyun ayarları ----
// Matematik'teki Hızlı Yarış'la aynı motor (araba/pist/tur mekaniği),
// içerik Türkçe kelime tanıma: resim gösterilir, doğru kelime 3 seçenek
// arasından seçilir. Eşleştirme'nin (bellek) ve Harf Tamamla'nın (yazım)
// yanına "hızlı okuma/kelime tanıma" becerisini ekliyor - bkz. devir-teslim
// Bölüm 4 madde 2. Aynı `turkce-N-sinif.json` bankasını, TurkceEslestirme
// ile birebir aynı okuma mantığıyla (eslestirme kayıtları) kullanıyor.
const BANKALAR = { 1: turkceBankasiSinif1, 2: turkceBankasiSinif2 };
const RACE_LENGTH = 10;
const LAP_SIZE = 4;
const WRONG_STREAK_TO_LEVEL_DOWN = 2;
const OPTION_COLORS = ["#5AB4E0", "#FF9F5A", "#8FCB6B"];
// Zorluk ekseni sayı değil "çeldirici benzerliği": seviye 1 = rastgele
// çeldirici (kolay ayırt edilir), seviye 2 = aynı temadan çeldirici (daha
// zor - kelimeler görsel/anlamsal olarak yakın, ör. KEDİ vs KÖPEK).
const MAX_LEVEL = 2;

function bankalariHazirla(sinif) {
  const banka = BANKALAR[sinif] || BANKALAR[1];
  return banka.sorular
    .filter((s) => s.soru_tipi === "eslestirme")
    .map((s) => ({ word: s.tam_kelime, emoji: s.gorsel_emoji }));
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

function generateQuestion(wordBank, level) {
  const correct = wordBank[rand(0, wordBank.length - 1)];
  // Aynı emojili başka kelime yoksa (tekil emoji), çeldiriciler bu havuzdan
  // seçilir - correct ile aynı resme sahip bir çeldirici olmasın diye
  // farklı emojili kelimeler filtrelendi.
  const differentEmojiPool = wordBank.filter((w) => w.emoji !== correct.emoji);
  let distractorPool = differentEmojiPool;
  // Seviye 2: kelime uzunluğu yakın olanları önceliklendir - tam
  // eşanlam/kategori verisi yok ama uzunluk yakınlığı basit bir zorluk
  // ayarı sağlıyor (kısa kelimeler arasında ayırt etmek daha kolay).
  if (level >= MAX_LEVEL) {
    const benzer = differentEmojiPool.filter((w) => Math.abs(w.word.length - correct.word.length) <= 2);
    if (benzer.length >= 2) distractorPool = benzer;
  }
  const distractors = shuffle(distractorPool).slice(0, 2);
  const options = shuffle([correct, ...distractors]);
  return { correct, options };
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

export default function TurkceKelimeYarisi({ onExit, onComplete, sinif = 1 } = {}) {
  const wordBank = useMemo(() => bankalariHazirla(sinif), [sinif]);
  const [lap, setLap] = useState(1);
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => generateQuestion(wordBank, 1));
  const [progress, setProgress] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [wrongPick, setWrongPick] = useState(null);
  const [ayniSoruDenemeSayisi, setAyniSoruDenemeSayisi] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [seviyeFlash, setSeviyeFlash] = useState(null);
  const [finished, setFinished] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef(null);

  const nextQuestion = useCallback((newLevel) => {
    const l = newLevel ?? level;
    setRound(generateQuestion(wordBank, l));
    setFeedback(null);
    setWrongPick(null);
    setAyniSoruDenemeSayisi(0);
  }, [wordBank, level]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function handlePick(word) {
    if (feedback === "correct" || finished) return;
    if (feedback === "wrong" && ayniSoruDenemeSayisi >= 2) return;

    if (word === round.correct.word) {
      setFeedback("correct");
      if (soundOn) playTone("correct");
      setWrongStreak(0);
      const newProgress = progress + 1;
      setProgress(newProgress);

      let newLevel = level;
      if (newProgress % LAP_SIZE === 0 && level < MAX_LEVEL) {
        setLap((l) => l + 1);
        newLevel = Math.min(MAX_LEVEL, level + 1);
        setLevel(newLevel);
      }

      timeoutRef.current = setTimeout(() => {
        if (newProgress >= RACE_LENGTH) {
          setFinished(true);
        } else {
          nextQuestion(newLevel);
        }
      }, 800);
    } else {
      setFeedback("wrong");
      if (soundOn) playTone("wrong");
      setWrongPick(word);
      setTotalMistakes((n) => n + 1);
      const yeniDeneme = ayniSoruDenemeSayisi + 1;
      setAyniSoruDenemeSayisi(yeniDeneme);
      const yeniWrongStreak = wrongStreak + 1;
      setWrongStreak(yeniWrongStreak);

      if (yeniWrongStreak >= WRONG_STREAK_TO_LEVEL_DOWN && level > 1) {
        const demotedLevel = level - 1;
        setLevel(demotedLevel);
        setWrongStreak(0);
        setSeviyeFlash("down");
        timeoutRef.current = setTimeout(() => {
          setSeviyeFlash(null);
          nextQuestion(demotedLevel);
        }, yeniDeneme >= 2 ? 2200 : 900);
      } else if (yeniDeneme >= 2) {
        timeoutRef.current = setTimeout(() => {
          nextQuestion(level);
        }, 2200);
      } else {
        timeoutRef.current = setTimeout(() => {
          setFeedback(null);
          setWrongPick(null);
        }, 650);
      }
    }
  }

  function restart() {
    clearTimeout(timeoutRef.current);
    setLap(1);
    setLevel(1);
    setProgress(0);
    setTotalMistakes(0);
    setFinished(false);
    nextQuestion(1);
  }

  const stars = totalMistakes === 0 ? 3 : totalMistakes <= 3 ? 2 : 1;

  const reportedRef = useRef(false);
  useEffect(() => {
    if (finished && !reportedRef.current) {
      reportedRef.current = true;
      onComplete?.(stars);
    }
  }, [finished, stars, onComplete]);

  const trackFill = (progress / RACE_LENGTH) * 100;

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

        .top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .brand {
          display: flex;
          margin: 0;
          align-items: center;
          gap: 8px;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 19px;
          color: var(--ink);
        }
        .brand-emoji-img { width: 26px; height: 26px; }
        .top-right { display: flex; align-items: center; gap: 10px; }
        .lap-pill {
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

        .question-card {
          position: relative;
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
        .question-emoji { font-size: 64px; line-height: 1; }
        .question-prompt {
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 14px;
          color: var(--ink-soft);
          margin-top: 10px;
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
        .level-down-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: #F0A63E;
          color: white;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 12px;
          padding: 5px 14px;
          border-radius: 999px;
          animation: pop 0.6s ease;
          white-space: nowrap;
        }
        @keyframes pop {
          0% { transform: translateX(-50%) scale(0.5); opacity: 0; }
          50% { transform: translateX(-50%) scale(1.1); opacity: 1; }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }

        .options-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .option-btn {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 22px;
          color: white;
          border: none;
          border-radius: 16px;
          padding: 16px 12px;
          cursor: pointer;
          box-shadow: 0 5px 0 rgba(0,0,0,0.15);
          transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.2s ease;
          letter-spacing: 0.3px;
        }
        .option-btn:active { transform: translateY(3px); box-shadow: 0 2px 0 rgba(0,0,0,0.15); }
        .option-btn.correct { background: var(--grass-dark) !important; }
        .option-btn.wrong { background: #D9534F !important; }

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
        .secondary-btn {
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
        <h1 className="brand"><img src={`${import.meta.env.BASE_URL}fox-mascot.png`} className="brand-emoji-img" alt="Tilki" /> Kelime Yarışı</h1>
        <div className="top-right">
          <span className="lap-pill">Tur {lap}</span>
          <button className="icon-btn" onClick={() => setSoundOn((s) => !s)} aria-label="Ses aç/kapat">
            {soundOn ? "🔊" : "🔇"}
          </button>
          <button className="icon-btn" onClick={() => setPaused(true)} aria-label="Duraklat">
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
        {seviyeFlash === "down" && <div className="level-down-badge">💪 Biraz kolaylaştıralım</div>}
        <div className="question-emoji">{round.correct.emoji}</div>
        <div className="question-prompt">Bu resmin adı hangisi?</div>
        {feedback === "wrong" && ayniSoruDenemeSayisi >= 2 && (
          <div className="correct-reveal">Doğru cevap: <strong>{round.correct.word}</strong></div>
        )}
      </div>

      <div className="options-row">
        {round.options.map((opt, i) => {
          let cls = "option-btn";
          if (feedback === "correct" && opt.word === round.correct.word) cls += " correct";
          if (feedback === "wrong" && opt.word === wrongPick) cls += " wrong";
          if (feedback === "wrong" && ayniSoruDenemeSayisi >= 2 && opt.word === round.correct.word) cls += " correct";
          return (
            <button
              key={opt.word}
              className={cls}
              style={{ background: OPTION_COLORS[i % OPTION_COLORS.length] }}
              onClick={() => handlePick(opt.word)}
            >
              {opt.word}
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
          <button className="primary-btn" onClick={restart}>
            <RotateCcw size={16} /> Tekrar Oyna
          </button>
          <button className="secondary-btn" onClick={onExit}>Menüye Dön</button>
        </div>
      )}

      {showTutorial && (
        <div className="tutorial-overlay">
          <img src={`${import.meta.env.BASE_URL}fox-mascot.png`} className="tutorial-emoji-img" alt="Tilki" />
          <div className="tutorial-title">Nasıl Oynanır?</div>
          <div className="tutorial-steps">
            <div className="tutorial-step">
              <span className="tutorial-step-icon">🖼️</span>
              <span>Resme bak, adını bul</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">👉</span>
              <span>Doğru kelimeye dokun</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">🚗</span>
              <span>Araba ilerlesin, bitiş çizgisine ulaş!</span>
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
          <div className="tutorial-title">Duraklatıldı</div>
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
