import { useState, useCallback, useRef, useEffect } from "react";
import { Star, Trophy, RotateCcw } from "lucide-react";
import turkceBankasi from "../data/turkce-1-sinif.json";

// ---- Oyun ayarları ----
const ROUND_LENGTH = 5;
// Kelime + eksik harf pozisyonu + görsel ipucu (görsel > metin ilkesi).
// Tur ilerledikçe kelimeler uzuyor ve eksik harf sayısı artıyor.
// Kelime/emoji/ipucu içeriği artık gerçek soru bankasından (harf_tamamlama
// kayıtları) okunuyor - müfredat güncellemesi kod değil veri güncellemesi
// olsun diye. Banka "tema" alanı taşımadığı için (tema rotasyonu -
// concreteness fading tasarımı korunsun diye) bu eşleme kod tarafında
// tutuluyor.
// Banka'daki bazı temalar (ev_aile: sadece EV, okul: sadece KİTAP) tek
// kelimeye düşüyor - bu da bir turda aynı kelimenin tekrar tekrar
// gelmesine yol açar. Küçük temaları "günlük hayat" başlığında
// birleştirip her temanın en az 3-4 kelimesi olmasını sağlıyoruz.
const TEMA_ESLEME = {
  KEDİ: "hayvanlar", KÖPEK: "hayvanlar", KUŞ: "hayvanlar", BALIK: "hayvanlar", KELEBEK: "hayvanlar",
  GÜNEŞ: "doga", AY: "doga", YILDIZ: "doga", ÇİÇEK: "doga",
  TOP: "oyuncaklar", ARABA: "oyuncaklar", BALON: "oyuncaklar",
  EV: "gunluk_hayat", KİTAP: "gunluk_hayat", ELMA: "gunluk_hayat", MUZ: "gunluk_hayat",
};
const WORD_BANK = turkceBankasi.sorular
  .filter((s) => s.soru_tipi === "harf_tamamlama")
  .map((s) => ({
    word: s.tam_kelime,
    emoji: s.gorsel_emoji,
    tema: TEMA_ESLEME[s.tam_kelime] || "diger",
  }));
const THEMES = [...new Set(WORD_BANK.map((w) => w.tema))];
const TURKISH_LETTERS = ["A","B","C","Ç","D","E","F","G","Ğ","H","I","İ","J","K","L","M","N","O","Ö","P","R","S","Ş","T","U","Ü","V","Y","Z"];
// tur1: kelime sonunda tek harf eksik (en kolay), tur2: ortada tek harf,
// tur3: iki harf eksik (en zor)
const ROUNDS = [
  { blanksCount: 1, positionMode: "end" },
  { blanksCount: 1, positionMode: "any" },
  { blanksCount: 2, positionMode: "any" },
];
const TOTAL_ROUNDS = ROUNDS.length;
// Kelime sorularının yanına "alfabe sırası" soruları da karışıyor - MEB'in
// "harf/ses bilgisi - sıralama" kazanımına karşılık geliyor.
const SEQUENCE_RATIO = 0.3;

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

function generateWordPuzzle(round, theme) {
  const { blanksCount, positionMode } = ROUNDS[round];
  const pool = WORD_BANK.filter((w) => w.tema === theme);
  const entry = pool[rand(0, pool.length - 1)];
  const letters = entry.word.split("");
  let positions;
  if (positionMode === "end") {
    positions = [letters.length - 1];
  } else {
    positions = shuffle(letters.map((_, i) => i)).slice(0, Math.min(blanksCount, letters.length - 1));
  }
  return { type: "word", word: entry.word, emoji: entry.emoji, letters, blankPositions: positions };
}

const HARF_SIRA_SORULARI = turkceBankasi.sorular.filter((s) => s.soru_tipi === "harf_sira");

function generateSequencePuzzle() {
  const kayit = HARF_SIRA_SORULARI[rand(0, HARF_SIRA_SORULARI.length - 1)];
  const parcalar = kayit.soru_metni.split(" → ");
  const blankIndex = parcalar.indexOf("?");
  const seq = parcalar.map((p) => (p === "?" ? kayit.dogru_cevap : p));
  return { type: "sequence", seq, blankIndex, answer: kayit.dogru_cevap };
}

function generatePuzzle(round, theme) {
  if (Math.random() < SEQUENCE_RATIO) return generateSequencePuzzle();
  return generateWordPuzzle(round, theme);
}

function currentLetterOf(puzzle, filledCount) {
  if (puzzle.type === "sequence") return puzzle.answer;
  const pos = puzzle.blankPositions[filledCount];
  return pos !== undefined ? puzzle.word[pos] : null;
}

function generateLetterPad(correctLetter) {
  const pool = new Set([correctLetter]);
  while (pool.size < 6) pool.add(TURKISH_LETTERS[rand(0, TURKISH_LETTERS.length - 1)]);
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

export default function TurkishFillGame({ onExit, onComplete } = {}) {
  const [currentTheme, setCurrentTheme] = useState(() => THEMES[rand(0, THEMES.length - 1)]);
  const [round, setRound] = useState(0);
  const [puzzle, setPuzzle] = useState(() => generatePuzzle(0, currentTheme));
  const [pad, setPad] = useState(() => generateLetterPad(currentLetterOf(puzzle, 0)));
  const [filledCount, setFilledCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [wrongPick, setWrongPick] = useState(null);
  const [ayniHarfDenemeSayisi, setAyniHarfDenemeSayisi] = useState(0);
  const [finished, setFinished] = useState(false);
  const [roundDone, setRoundDone] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [paused, setPaused] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const timeoutRef = useRef(null);

  const nextPuzzle = useCallback((r, theme) => {
    const p = generatePuzzle(r, theme);
    setPuzzle(p);
    setPad(generateLetterPad(currentLetterOf(p, 0)));
    setFilledCount(0);
    setFeedback(null);
    setWrongPick(null);
    setAyniHarfDenemeSayisi(0);
  }, []);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const currentLetter = currentLetterOf(puzzle, filledCount);
  const totalBlanks = puzzle.type === "sequence" ? 1 : puzzle.blankPositions.length;
  const harfAcikMi = feedback === "correct" || (feedback === "wrong" && ayniHarfDenemeSayisi >= 2);

  function harfiIlerlet(nextFilled) {
    setAyniHarfDenemeSayisi(0);
    if (nextFilled >= totalBlanks) {
      const newProgress = progress + 1;
      setProgress(newProgress);
      if (newProgress >= ROUND_LENGTH) {
        if (round + 1 >= TOTAL_ROUNDS) {
          setFinished(true);
        } else {
          setRoundDone(true);
        }
      } else {
        nextPuzzle(round, currentTheme);
      }
    } else {
      setFilledCount(nextFilled);
      setPad(generateLetterPad(currentLetterOf(puzzle, nextFilled)));
      setFeedback(null);
      setWrongPick(null);
    }
  }

  function handlePick(letter) {
    if (paused || finished || roundDone || feedback === "correct") return;
    if (feedback === "wrong" && ayniHarfDenemeSayisi >= 2) return; // cevap gösteriliyor, bekle

    if (letter === currentLetter) {
      setFeedback("correct");
      if (soundOn) playTone("correct");
      setShowBurst(true);
      const nextFilled = filledCount + 1;

      timeoutRef.current = setTimeout(() => harfiIlerlet(nextFilled), 550);
    } else {
      setFeedback("wrong");
      if (soundOn) playTone("wrong");
      setWrongPick(letter);
      setTotalMistakes((m) => m + 1);
      const yeniDeneme = ayniHarfDenemeSayisi + 1;
      setAyniHarfDenemeSayisi(yeniDeneme);

      if (yeniDeneme >= 2) {
        // Çocuk aynı harfte sonsuza dek denemesin - doğru harfi göster,
        // biraz bekleyip devam et.
        timeoutRef.current = setTimeout(() => harfiIlerlet(filledCount + 1), 1800);
      } else {
        timeoutRef.current = setTimeout(() => {
          setFeedback(null);
          setWrongPick(null);
        }, 600);
      }
    }
  }

  function nextRound() {
    const r = round + 1;
    const theme = THEMES[rand(0, THEMES.length - 1)];
    setRound(r);
    setCurrentTheme(theme);
    setProgress(0);
    setRoundDone(false);
    nextPuzzle(r, theme);
  }

  // patlama efektini kısa süre sonra kapat
  useEffect(() => {
    if (!showBurst) return;
    const t = setTimeout(() => setShowBurst(false), 500);
    return () => clearTimeout(t);
  }, [showBurst]);

  function restart() {
    clearTimeout(timeoutRef.current);
    const theme = THEMES[rand(0, THEMES.length - 1)];
    setRound(0);
    setCurrentTheme(theme);
    setProgress(0);
    setTotalMistakes(0);
    setFinished(false);
    setRoundDone(false);
    nextPuzzle(0, theme);
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
    <div className="word-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;700;800&display=swap');

        .word-root {
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
          padding: 26px 20px;
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
        .word-emoji { font-size: 46px; margin-bottom: 10px; }
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
        .word-row {
          display: flex;
          justify-content: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .letter-slot {
          width: 40px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 26px;
          border-radius: 10px;
        }
        .letter-slot.is-blank {
          background: var(--track-bg);
          border: 3px dashed #C4D3E3;
          color: transparent;
          opacity: 0.55;
        }
        .letter-slot.is-blank.is-current {
          border-color: var(--sun);
          border-style: solid;
          opacity: 1;
          background: #FFF7E0;
          animation: pulseBlank 1s ease-in-out infinite;
          position: relative;
        }
        .letter-slot.is-blank.is-current::after {
          content: '👇';
          position: absolute;
          top: -26px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 16px;
          animation: bounceArrow 0.9s ease-in-out infinite;
        }
        @keyframes pulseBlank {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,201,60,0.5); }
          50% { transform: scale(1.08); box-shadow: 0 0 0 6px rgba(255,201,60,0); }
        }
        @keyframes bounceArrow {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-4px); }
        }
        .letter-slot.is-blank.is-filled {
          background: #E4F7E6;
          border: 3px solid var(--grass-dark);
          color: var(--grass-dark);
          opacity: 1;
          animation: none;
        }

        .letterpad {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .pad-key {
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 24px;
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
        <h1 className="brand"><img src={`${import.meta.env.BASE_URL}fox-mascot.png`} className="brand-emoji-img" alt="Tilki" /> Harf Tamamla</h1>
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
        {puzzle.type === "word" ? (
          <>
            <div className="word-emoji">{puzzle.emoji}</div>
            <div className="word-row">
              {puzzle.letters.map((l, i) => {
                const blankOrder = puzzle.blankPositions.indexOf(i);
                const isBlank = blankOrder !== -1;
                const isDone = isBlank && blankOrder < filledCount;
                const isCurrent = isBlank && blankOrder === filledCount;
                return (
                  <span
                    key={i}
                    className={`letter-slot ${isBlank ? "is-blank" : ""} ${isCurrent ? "is-current" : ""} ${isDone || (isCurrent && harfAcikMi) ? "is-filled" : ""}`}
                  >
                    {isBlank && !isDone && !(isCurrent && harfAcikMi) ? "" : l}
                  </span>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="word-emoji">🔤</div>
            <div className="word-row">
              {puzzle.seq.map((l, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    className={`letter-slot ${puzzle.blankIndex === i ? "is-blank" : ""} ${puzzle.blankIndex === i && harfAcikMi ? "is-filled" : ""}`}
                  >
                    {puzzle.blankIndex === i && !harfAcikMi ? "" : l}
                  </span>
                  {i < 2 && <span style={{ fontSize: 20, color: "#9AB4CE" }}>→</span>}
                </span>
              ))}
            </div>
          </>
        )}
        {feedback === "wrong" && puzzle.type === "word" && (
          <div className="hint-text">💡 {puzzle.emoji} resmine bak</div>
        )}
        {feedback === "wrong" && ayniHarfDenemeSayisi >= 2 && (
          <div className="correct-reveal">Doğru harf: <strong>{currentLetter}</strong></div>
        )}
      </div>

      <div className="letterpad">
        {pad.map((letter) => {
          let cls = "pad-key";
          if (feedback === "correct" && letter === currentLetter) cls += " correct";
          if (feedback === "wrong" && letter === wrongPick) cls += " wrong";
          if (feedback === "wrong" && ayniHarfDenemeSayisi >= 2 && letter === currentLetter) cls += " correct";
          return (
            <button key={letter} className={cls} onClick={() => handlePick(letter)}>
              {letter}
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
          <div className="finish-title">Hepsini tamamladın!</div>
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
              <span className="tutorial-step-icon">🖼️</span>
              <span>Resme bak, kelimeyi düşün</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">❓</span>
              <span>Kesikli kutu eksik harf demek</span>
            </div>
            <div className="tutorial-step">
              <span className="tutorial-step-icon">👉</span>
              <span>Doğru harfe dokun</span>
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
