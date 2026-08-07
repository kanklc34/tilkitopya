import { useState, useMemo } from "react";
import { X, TrendingUp, Calendar, RotateCcw } from "lucide-react";
import {
  ilerlemeyiOku,
  dersOzetiHesapla,
  gununGorevleri,
  ilerlemeyiSifirla,
} from "../lib/progress.js";

// ---- Ebeveyn Kapısı ----
// Çocuğun yanlışlıkla girip kafasının karışmaması için basit bir
// "ebeveyn kapısı" deseni (pek çok çocuk uygulamasında standart).
// KVKK/hassas veri toplanmadığı için PIN yerine bir işlem yeterli.
// Çarpma kullanılıyor çünkü MEB müfredatında 1. sınıfta çarpma hiç
// yok (2-3. sınıfta başlıyor) - çıkarmanın aksine, sayılar ne olursa
// olsun tutarlı şekilde çocuğun bilgisi dışında kalıyor.
function rastgeleSoru() {
  const a = Math.floor(Math.random() * 6) + 4; // 4-9
  const b = Math.floor(Math.random() * 6) + 4; // 4-9
  return { a, b, cevap: a * b };
}

function EbeveynKapisi({ onBasarili, onKapat }) {
  const soru = useMemo(rastgeleSoru, []);
  const [deger, setDeger] = useState("");
  const [hata, setHata] = useState(false);

  function kontrolEt(e) {
    e.preventDefault();
    if (parseInt(deger, 10) === soru.cevap) {
      onBasarili();
    } else {
      setHata(true);
      setDeger("");
      setTimeout(() => setHata(false), 1200);
    }
  }

  return (
    <div className="ep-overlay">
      <form className="ep-gate-card" onSubmit={kontrolEt}>
        <button type="button" className="ep-close" onClick={onKapat} aria-label="Kapat">
          <X size={18} />
        </button>
        <div className="ep-gate-title">Ebeveyn Alanı</div>
        <div className="ep-gate-sub">Devam etmek için işlemi çöz:</div>
        <div className="ep-gate-question">
          {soru.a} × {soru.b} = ?
        </div>
        <input
          className={`ep-gate-input ${hata ? "ep-gate-input-error" : ""}`}
          type="number"
          inputMode="numeric"
          autoFocus
          value={deger}
          onChange={(e) => setDeger(e.target.value)}
          placeholder="Cevap"
        />
        {hata && <div className="ep-gate-error">Tekrar dene</div>}
        <button type="submit" className="ep-gate-btn">
          Onayla
        </button>
      </form>
    </div>
  );
}

// ---- Ebeveyn Paneli (kapıdan sonra gösterilen içerik) ----
function EbeveynPaneliIcerik({ onKapat }) {
  const [ilerleme, setIlerleme] = useState(() => ilerlemeyiOku());
  const [sifirlaOnay, setSifirlaOnay] = useState(false);

  const dersOzeti = useMemo(() => dersOzetiHesapla(ilerleme), [ilerleme]);
  const tamamlananGunSayisi = Object.values(ilerleme.gunler).filter((g) => g.tamamlandi).length;
  const aktifGunGorevleri = gununGorevleri(ilerleme.aktifGun);
  const aktifGunKayit = ilerleme.gunler[ilerleme.aktifGun];

  function sifirla() {
    const yeni = ilerlemeyiSifirla();
    setIlerleme(yeni);
    setSifirlaOnay(false);
  }

  return (
    <div className="ep-overlay">
      <div className="ep-panel-card">
        <button className="ep-close" onClick={onKapat} aria-label="Kapat">
          <X size={18} />
        </button>
        <div className="ep-panel-title">Ebeveyn Paneli</div>

        <div className="ep-stat-row">
          <div className="ep-stat">
            <Calendar size={16} />
            <span className="ep-stat-num">{tamamlananGunSayisi}</span>
            <span className="ep-stat-label">gün tamamlandı</span>
          </div>
          <div className="ep-stat">
            <TrendingUp size={16} />
            <span className="ep-stat-num">{ilerleme.oturumSayisi}</span>
            <span className="ep-stat-label">toplam oturum</span>
          </div>
        </div>

        <div className="ep-section-title">Bugünkü görevler (Gün {ilerleme.aktifGun})</div>
        <div className="ep-today-list">
          {aktifGunGorevleri.map((gorev) => {
            const yapildi = !!aktifGunKayit?.gorevler?.[gorev.id];
            return (
              <div key={gorev.id} className={`ep-today-item ${yapildi ? "ep-done" : ""}`}>
                <span className="ep-today-emoji">{gorev.emoji}</span>
                <span className="ep-today-ad">{gorev.ad}</span>
                <span className="ep-today-ders">{gorev.ders}</span>
                {yapildi && <span className="ep-today-check">✓</span>}
              </div>
            );
          })}
        </div>

        <div className="ep-section-title">Ders bazlı özet</div>
        {dersOzeti.length === 0 ? (
          <div className="ep-empty">Henüz tamamlanmış oturum yok.</div>
        ) : (
          <div className="ep-subject-list">
            {dersOzeti.map((d) => (
              <div key={d.ders} className="ep-subject-row">
                <span className="ep-subject-name">{d.ders}</span>
                <span className="ep-subject-sessions">{d.oturumSayisi} oturum</span>
                <span className="ep-subject-stars">{"⭐".repeat(Math.round(d.ortalamaYildiz))}</span>
                {d.zorlaniyor && <span className="ep-warn-badge">Zorlanıyor olabilir</span>}
              </div>
            ))}
          </div>
        )}

        <div className="ep-reset-row">
          {!sifirlaOnay ? (
            <button className="ep-reset-btn" onClick={() => setSifirlaOnay(true)}>
              <RotateCcw size={13} /> İlerlemeyi sıfırla
            </button>
          ) : (
            <div className="ep-reset-confirm">
              <span>Emin misin? Geri alınamaz.</span>
              <button className="ep-reset-confirm-btn" onClick={sifirla}>Evet, sıfırla</button>
              <button className="ep-reset-cancel-btn" onClick={() => setSifirlaOnay(false)}>Vazgeç</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EbeveynPaneli({ onKapat }) {
  const [dogrulandi, setDogrulandi] = useState(false);

  return (
    <>
      <style>{`
        .ep-overlay {
          position: fixed;
          inset: 0;
          background: rgba(31,46,69,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 100;
          font-family: 'Nunito', sans-serif;
        }
        .ep-close {
          position: absolute;
          top: 14px;
          right: 14px;
          border: none;
          background: #EAF6FD;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #5C6B85;
        }

        .ep-gate-card {
          position: relative;
          background: white;
          border-radius: 24px;
          padding: 32px 26px;
          max-width: 320px;
          width: 100%;
          text-align: center;
          box-shadow: 0 12px 36px rgba(31,46,69,0.25);
        }
        .ep-gate-title {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 19px;
          color: #1F2E45;
        }
        .ep-gate-sub {
          color: #5C6B85;
          font-size: 13px;
          margin-top: 6px;
        }
        .ep-gate-question {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 30px;
          color: #1F2E45;
          margin: 18px 0 12px;
        }
        .ep-gate-input {
          width: 100%;
          box-sizing: border-box;
          border: 2px solid #D8ECF7;
          border-radius: 14px;
          padding: 10px 14px;
          font-size: 18px;
          font-family: 'Fredoka', sans-serif;
          text-align: center;
          outline: none;
        }
        .ep-gate-input:focus { border-color: #5AB4E0; }
        .ep-gate-input-error { border-color: #D9534F; animation: epShake 0.4s ease; }
        @keyframes epShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .ep-gate-error { color: #D9534F; font-size: 12px; margin-top: 6px; font-weight: 700; }
        .ep-gate-btn {
          margin-top: 16px;
          width: 100%;
          background: #FFC93C;
          color: #1F2E45;
          border: none;
          padding: 12px;
          border-radius: 999px;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
        }

        .ep-panel-card {
          position: relative;
          background: white;
          border-radius: 24px;
          padding: 28px 24px;
          max-width: 420px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 12px 36px rgba(31,46,69,0.25);
        }
        .ep-panel-title {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 20px;
          color: #1F2E45;
          margin-bottom: 16px;
        }
        .ep-stat-row {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        .ep-stat {
          flex: 1;
          background: #EAF6FD;
          border-radius: 16px;
          padding: 14px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          color: #5AB4E0;
        }
        .ep-stat-num {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 20px;
          color: #1F2E45;
        }
        .ep-stat-label {
          font-size: 11px;
          color: #5C6B85;
          text-align: center;
        }
        .ep-section-title {
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: #1F2E45;
          margin: 18px 0 10px;
        }
        .ep-today-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ep-today-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F5F8FC;
          border-radius: 12px;
          padding: 8px 12px;
          font-size: 13px;
          color: #5C6B85;
        }
        .ep-today-item.ep-done { background: #E4F7E6; color: #1F2E45; }
        .ep-today-emoji { font-size: 16px; }
        .ep-today-ad { font-weight: 700; flex: 1; }
        .ep-today-ders { font-size: 11px; opacity: 0.7; }
        .ep-today-check { color: #4E9F53; font-weight: 700; }
        .ep-empty { color: #9AA6BC; font-size: 13px; }
        .ep-subject-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ep-subject-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #F5F8FC;
          border-radius: 12px;
          font-size: 13px;
          flex-wrap: wrap;
        }
        .ep-subject-name { font-weight: 700; color: #1F2E45; flex: 1; }
        .ep-subject-sessions { color: #9AA6BC; font-size: 11px; }
        .ep-subject-stars { font-size: 11px; }
        .ep-warn-badge {
          background: #FFF3D6;
          color: #8A6D1D;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 999px;
          width: 100%;
        }
        .ep-reset-row { margin-top: 22px; text-align: center; }
        .ep-reset-btn {
          background: none;
          border: none;
          color: #9AA6BC;
          font-size: 12px;
          text-decoration: underline;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .ep-reset-confirm {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: center;
          font-size: 12px;
          color: #5C6B85;
        }
        .ep-reset-confirm-btn {
          background: #D9534F;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
        }
        .ep-reset-cancel-btn {
          background: none;
          border: none;
          color: #5C6B85;
          text-decoration: underline;
          cursor: pointer;
          font-size: 12px;
        }
      `}</style>

      {!dogrulandi ? (
        <EbeveynKapisi onBasarili={() => setDogrulandi(true)} onKapat={onKapat} />
      ) : (
        <EbeveynPaneliIcerik onKapat={onKapat} />
      )}
    </>
  );
}