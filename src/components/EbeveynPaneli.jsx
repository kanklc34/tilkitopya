import { useState, useMemo, useRef, useEffect } from "react";
import { X, TrendingUp, Calendar, RotateCcw } from "lucide-react";
import {
  ilerlemeyiOku,
  dersOzetiHesapla,
  gununGorevleri,
  ilerlemeyiSifirla,
  ayarKaydet,
} from "../lib/progress.js";

// ---- Ebeveyn Kapısı ----
// Çocuğun yanlışlıkla girip kafasının karışmaması için bir "ebeveyn
// kapısı" deseni. Okuma/rakam bilmeyen ebeveynleri de dışlamamak için
// matematik sorusu yerine basılı tutma (long-press) kullanılıyor:
// hatırlanacak hiçbir şey yok, sadece "parmağını 3 saniye çekme"
// gibi fiziksel bir eylem. Küçük çocuklar sabırsız dokunduğu için
// doğal bir engel oluşturuyor, yetişkin için ise zahmetsiz.
const BASILI_TUTMA_SURESI_MS = 2800;

// Modal/overlay bileşenlerinde ortak davranış: Escape tuşuyla kapatma.
// Klavye kullanıcıları fareye/dokunmaya gerek kalmadan çıkabilsin diye.
function useEscKapat(onKapat) {
  useEffect(() => {
    function handler(e) {
      if (e.key === "Escape") onKapat();
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onKapat]);
}

function EbeveynKapisi({ onBasarili, onKapat }) {
  useEscKapat(onKapat);
  const [yuzde, setYuzde] = useState(0);
  const basiliMi = useRef(false);
  const baslangicRef = useRef(null);
  const rafRef = useRef(null);

  function dongu(ts) {
    if (!basiliMi.current) return;
    if (baslangicRef.current === null) baslangicRef.current = ts;
    const gecen = ts - baslangicRef.current;
    const yeniYuzde = Math.min(100, (gecen / BASILI_TUTMA_SURESI_MS) * 100);
    setYuzde(yeniYuzde);
    if (yeniYuzde >= 100) {
      basiliMi.current = false;
      onBasarili();
      return;
    }
    rafRef.current = requestAnimationFrame(dongu);
  }

  function basla(e) {
    e.preventDefault();
    basiliMi.current = true;
    baslangicRef.current = null;
    rafRef.current = requestAnimationFrame(dongu);
  }

  function birak() {
    basiliMi.current = false;
    baslangicRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setYuzde(0);
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const CEVRE = 2 * Math.PI * 54;
  const dashOffset = CEVRE - (yuzde / 100) * CEVRE;
  const kapatBtnRef = useRef(null);
  useEffect(() => {
    kapatBtnRef.current?.focus();
  }, []);

  return (
    <div className="ep-overlay">
      <div className="ep-gate-card" role="dialog" aria-modal="true" aria-label="Ebeveyn kapısı">
        <button type="button" ref={kapatBtnRef} className="ep-close" onClick={onKapat} aria-label="Kapat">
          <X size={18} />
        </button>
        <h2 className="ep-gate-title">Ebeveyn Alanı</h2>
        <div className="ep-gate-sub">Parmağınızı basılı tutun</div>
        <div
          className="ep-hold-circle"
          role="button"
          tabIndex={0}
          aria-label="3 saniye basılı tutarak ebeveyn alanını aç"
          onPointerDown={basla}
          onPointerUp={birak}
          onPointerLeave={birak}
          onPointerCancel={birak}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !e.repeat) {
              e.preventDefault();
              basla(e);
            }
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter" || e.key === " ") birak();
          }}
        >
          <svg width="130" height="130" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r="54" fill="#EAF6FD" stroke="#D8ECF7" strokeWidth="10" />
            <circle
              cx="65"
              cy="65"
              r="54"
              fill="none"
              stroke="#5AB4E0"
              strokeWidth="10"
              strokeDasharray={CEVRE}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 65 65)"
            />
          </svg>
          <span className="ep-hold-icon">🔒</span>
        </div>
        <div className="ep-gate-hint">3 saniye basılı tutun</div>
      </div>
    </div>
  );
}

// ---- Ebeveyn Paneli (kapıdan sonra gösterilen içerik) ----
function EbeveynPaneliIcerik({ onKapat }) {
  useEscKapat(onKapat);
  const [ilerleme, setIlerleme] = useState(() => ilerlemeyiOku());
  const [sifirlaOnay, setSifirlaOnay] = useState(false);
  const kapatBtnRef = useRef(null);

  useEffect(() => {
    kapatBtnRef.current?.focus();
  }, []);

  const dersOzeti = useMemo(() => dersOzetiHesapla(ilerleme), [ilerleme]);
  const tamamlananGunSayisi = Object.values(ilerleme.gunler).filter((g) => g.tamamlandi).length;
  const aktifGunGorevleri = gununGorevleri(ilerleme.aktifGun);
  const aktifGunKayit = ilerleme.gunler[ilerleme.aktifGun];

  function sifirla() {
    const yeni = ilerlemeyiSifirla();
    setIlerleme(yeni);
    setSifirlaOnay(false);
  }

  function tumOyunlarToggle() {
    const yeni = ayarKaydet({ tumOyunlarSekmesiAcik: !ilerleme.ayarlar.tumOyunlarSekmesiAcik });
    setIlerleme(yeni);
  }

  return (
    <div className="ep-overlay">
      <div className="ep-panel-card" role="dialog" aria-modal="true" aria-label="Ebeveyn paneli">
        <button type="button" ref={kapatBtnRef} className="ep-close" onClick={onKapat} aria-label="Kapat">
          <X size={18} />
        </button>
        <h2 className="ep-panel-title">Ebeveyn Paneli</h2>

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

        <div className="ep-section-title">Erişim ayarı</div>
        <label className="ep-toggle-row">
          <div>
            <div className="ep-toggle-label">Çocuk "Tüm Oyunlar" sekmesini görsün</div>
            <div className="ep-toggle-sub">
              {ilerleme.ayarlar.tumOyunlarSekmesiAcik
                ? "Açık: istediği oyunu özgürce seçebilir."
                : "Kapalı: sadece günlük görevleri görür, sekme çubuğu gizlenir."}
            </div>
          </div>
          <input
            type="checkbox"
            className="ep-toggle-switch"
            checked={ilerleme.ayarlar.tumOyunlarSekmesiAcik}
            onChange={tumOyunlarToggle}
          />
        </label>

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
          margin: 0;
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
        .ep-hold-circle {
          position: relative;
          width: 130px;
          height: 130px;
          margin: 20px auto 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          touch-action: none;
          -webkit-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
          border-radius: 50%;
        }
        .ep-hold-circle:focus-visible {
          outline: 3px solid #FFC93C;
          outline-offset: 4px;
        }
        .ep-hold-circle svg { position: absolute; top: 0; left: 0; }
        .ep-hold-circle svg circle:nth-child(2) { transition: stroke-dashoffset 0.05s linear; }
        .ep-hold-icon { font-size: 34px; pointer-events: none; }
        .ep-gate-hint {
          color: #5C6B85;
          font-size: 12px;
          margin-top: 4px;
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
          margin: 0 0 16px 0;
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
        .ep-empty { color: #5C6B85; font-size: 13px; }
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
        .ep-subject-sessions { color: #5C6B85; font-size: 11px; }
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
        .ep-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          background: #F5F8FC;
          border-radius: 14px;
          padding: 12px 14px;
          cursor: pointer;
          margin-bottom: 6px;
        }
        .ep-toggle-label {
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 13px;
          color: #1F2E45;
        }
        .ep-toggle-sub {
          font-size: 11px;
          color: #5C6B85;
          margin-top: 2px;
        }
        .ep-toggle-switch {
          flex-shrink: 0;
          width: 40px;
          height: 24px;
          cursor: pointer;
          accent-color: #5AB4E0;
        }

        .ep-reset-row { margin-top: 22px; text-align: center; }
        .ep-reset-btn {
          background: none;
          border: none;
          color: #5C6B85;
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
