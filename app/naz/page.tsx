"use client";

import { CSSProperties, FormEvent, useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  ✏️  BURAYI KENDİ AĞZINDAN DÜZENLE — oyunun asıl mesajı bu          */
/* ------------------------------------------------------------------ */
const SINCERE_MESSAGE = [
  "Emir kralımız diyor ki: Nazı üzmek istememiştim ama üzmüş bulundum. gönül alma denemeleri başarısız oluyor son hamleyi iyi yapmak istedim özrü.",
];

const CHARGES = [
  { id: "kanıyosun", text: "“Kolay kanıyosun” deyip seni küçümsemek" },
  { id: "saf", text: "“Saf” çağrışımı yaptırıp “saf salak” sonucuna götürmek" },
  { id: "ozlu", text: "“Üzülmeden adam olunmaz” özlü sözleriyle işi kötüleştirmek" },
  { id: "kan", text: "“Kanını satıp rakip eliyorum” diye saçmalamak" },
  { id: "kimyon", text: "Kimyonla gönül almaya kalkmak" },
  { id: "iki", text: "Seni tek günde 2 kez küstürmek" },
];

const ATTEMPTS = [
  { id: "kimyon", label: "🌿 Kimyon at", result: "Kimyon hiçbir işe yaramaz. — K. Naz" },
  { id: "hamur", label: "🍞 Hamur gönder", result: "Hamur bile bir şey yapamaz. Reddedildi." },
];

const COUPONS = [
  { id: "kan", text: "🩸 Cuma kan verme randevusu: Emir yanında olur, fazladan kan vermez." },
  { id: "biat", text: "🥋 kıyafet hkkı. Emir'e dershaneye gelirken aşşırı absürt olmayan ama absürt bir şey giydirme hakkı" },
  { id: "freedom", text: "🇺🇸 Freedom günü: Naz 24 saat boyunca Emir'e atölye şakası yapabilir" },
  { id: "kahve", text: "☕ Lipgloss kampanyası kahvesi ısmarlama" },

];

const MAX_COUPONS = 2;
const DODGE_LIMIT = 5;

const log = (event: string, data: unknown) => {
  const payload = { at: new Date().toISOString(), ...(data as object) };
  console.log(`[naz-oyunu] ${event}`, payload);
  // Sunucu loguna da gönder. Başarısız olursa oyun etkilenmez.
  fetch("/api/naz-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, ...payload }),
    keepalive: true,
  }).catch(() => {});
};

const toggle = (list: string[], id: string) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

type Piece = { left: number; delay: number; dur: number; emoji: string };

function Game() {
  const [step, setStep] = useState(0);
  const [anger, setAnger] = useState(70);
  const [charges, setCharges] = useState<string[]>([]);
  const [sentence, setSentence] = useState("");
  const [tried, setTried] = useState<string[]>([]);
  const [dodges, setDodges] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [coupons, setCoupons] = useState<string[]>([]);
  const [customCoupon, setCustomCoupon] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState<Piece[]>([]);

  const meter = step === 0 ? anger : Math.max(0, Math.round(anger * (1 - step / 5)));
  const next = (event: string, data: object) => {
    log(event, data);
    setStep((s) => s + 1);
  };

  const dodge = () => {
    if (dodges >= DODGE_LIMIT) return;
    setDodges((d) => d + 1);
    setPos({ x: Math.round((Math.random() - 0.5) * 180), y: Math.round((Math.random() - 0.5) * 90) });
  };

  const finish = () => {
    log("final", { anger, charges, sentence, tried, dodges, coupons, customCoupon, note });
    setConfetti(
      Array.from({ length: 28 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        dur: 2.8 + Math.random() * 2,
        emoji: ["💖", "👑", "💄", "✨", "🎀"][Math.floor(Math.random() * 5)],
      }))
    );
    setDone(true);
  };

  return (
    <main style={S.page}>
      <style>{CSS}</style>

      {done &&
        confetti.map((c, i) => (
          <span key={i} className="fall" style={{ left: `${c.left}%`, animationDelay: `${c.delay}s`, animationDuration: `${c.dur}s` }}>
            {c.emoji}
          </span>
        ))}

      <div style={S.wrap}>
        <header style={S.header}>
          <h1 style={S.title}>Kraliçe’nin Gönlü</h1>
          <p style={S.sub}>Gönül alma ve affettirme sistemi v1.0</p>
          <div style={S.tubeLabel}>
            <span>Küsmeter</span>
            <strong>%{meter}</strong>
          </div>
          <div style={S.tube} role="progressbar" aria-valuenow={meter} aria-valuemin={0} aria-valuemax={100}>
            <div style={{ ...S.fill, width: `${meter}%` }} />
            <div style={S.shine} />
          </div>
        </header>

        {step === 0 && (
          <section style={S.card}>
            <h2 style={S.h2}>Önce durumu ölçelim</h2>
            <p style={S.p}>Şu an ne kadar küssün? Dürüst ol, sistem yalan makinesi değil ama kayıt tutuyor.</p>
            <input
              type="range"
              min={0}
              max={100}
              value={anger}
              onChange={(e) => setAnger(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#ff3d97" }}
              aria-label="Küsme seviyesi"
            />
            <p style={S.big}>%{anger}</p>
            <button style={S.btn} onClick={() => next("kusme-seviyesi", { anger })}>
              Ölçümü onayla
            </button>
          </section>
        )}

        {step === 1 && (
          <section style={S.card}>
            <h2 style={S.h2}>Emir’in Duruşması</h2>
            <p style={S.p}>Sanık Emir’in iddianamesi aşağıda. Haklı bulduğun suçları işaretle.</p>
            {CHARGES.map((c) => (
              <label key={c.id} style={{ ...S.check, ...(charges.includes(c.id) ? S.checkOn : {}) }}>
                <input type="checkbox" checked={charges.includes(c.id)} onChange={() => setCharges(toggle(charges, c.id))} />
                <span>{c.text}</span>
              </label>
            ))}
            <label style={S.label} htmlFor="ceza">
              Emir’in cezasını sen yaz
            </label>
            <textarea id="ceza" style={S.area} rows={3} value={sentence} onChange={(e) => setSentence(e.target.value)} placeholder="Örn: 3 gün boyunca her mesaja “Kraliçem” diye başlasın" />
            <button style={S.btn} onClick={() => next("durusma", { charges, sentence })}>
              Kararı ver ({charges.length} suç)
            </button>
          </section>
        )}

        {step === 2 && (
          <section style={S.card}>
            <h2 style={S.h2}>Gönül alma denemeleri</h2>
            <p style={S.p}>Emir’in denediği yöntemler. Üçünü de dene, sonuncusu ancak ondan sonra açılır.</p>
            {ATTEMPTS.map((a) => (
              <div key={a.id}>
                <button
                  style={{ ...S.btnGhost, opacity: tried.includes(a.id) ? 0.6 : 1 }}
                  onClick={() => setTried(tried.includes(a.id) ? tried : [...tried, a.id])}
                >
                  {a.label}
                </button>
                {tried.includes(a.id) && <p style={S.fail}>❌ {a.result}</p>}
              </div>
            ))}
            <button
              style={{ ...S.btn, opacity: tried.length === ATTEMPTS.length ? 1 : 0.35 }}
              disabled={tried.length !== ATTEMPTS.length}
              onClick={() => next("denemeler", { tried })}
            >
              ✅ Düz, dürüst özür
            </button>
          </section>
        )}

        {step === 3 && (
          <section style={S.card}>
            <h2 style={S.h2}>Emir’in mesajı</h2>
            {SINCERE_MESSAGE.map((line, i) => (
              <p key={i} style={S.msg}>
                {line}
              </p>
            ))}
            <p style={{ ...S.p, marginTop: 14 }}>Affediyor musun?</p>
            <div style={S.row}>
              <button style={S.btn} onClick={() => next("affetti", { dodges })}>
                Affet 💖
              </button>
              {dodges < DODGE_LIMIT ? (
                <button
                  style={{ ...S.btnGhost, transform: `translate(${pos.x}px, ${pos.y}px)`, transition: "transform .18s ease-out" }}
                  onPointerEnter={dodge}
                  onClick={dodge}
                >
                  Küsmeye devam
                </button>
              ) : (
                <p style={S.small}>Küsme butonu yoruldu ve istifa etti 🫡</p>
              )}
            </div>
          </section>
        )}

        {step === 4 && (
          <section style={S.card}>
            <h2 style={S.h2}>Telafi kuponları</h2>
            <p style={S.p}>En fazla {MAX_COUPONS} tane seç. Süresiz geçerli, iade yok.</p>
            {COUPONS.map((c) => {
              const on = coupons.includes(c.id);
              const locked = !on && coupons.length >= MAX_COUPONS;
              return (
                <label key={c.id} style={{ ...S.check, ...(on ? S.checkOn : {}), opacity: locked ? 0.45 : 1 }}>
                  <input type="checkbox" checked={on} disabled={locked} onChange={() => setCoupons(toggle(coupons, c.id))} />
                  <span>{c.text}</span>
                </label>
              );
            })}
            <label style={S.label} htmlFor="ozel">
              Özel kupon: Emir’e ne yaptırmak istersin?
            </label>
            <textarea id="ozel" style={S.area} rows={2} value={customCoupon} onChange={(e) => setCustomCoupon(e.target.value)} />
            <button
              style={{ ...S.btn, opacity: coupons.length || customCoupon.trim() ? 1 : 0.35 }}
              disabled={!coupons.length && !customCoupon.trim()}
              onClick={() => next("kuponlar", { coupons, customCoupon })}
            >
              Kuponları al
            </button>
          </section>
        )}

        {step === 5 && (
          <section style={S.card}>
            <h2 style={S.h2}>{done ? "Kraliçe affetti 👑" : "Son adım"}</h2>
            {!done ? (
              <>
                <p style={S.p}>Emir’e bırakmak istediğin bir not var mı? Boş da bırakabilirsin.</p>
                <textarea style={S.area} rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Notun…" aria-label="Emir’e not" />
                <button style={S.btn} onClick={finish}>
                  Gönder
                </button>
              </>
            ) : (
              <p style={S.p}>Küsmeter %0. Sistem kapanıyor. İyi geceler Naz.</p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

const CSS = `
@keyframes fall { from { transform: translateY(-10vh) rotate(0deg); opacity: 1 } to { transform: translateY(110vh) rotate(360deg); opacity: .9 } }
.fall { position: fixed; top: 0; font-size: 26px; z-index: 10; pointer-events: none; animation: fall linear forwards; }
button:focus-visible, input:focus-visible, textarea:focus-visible { outline: 3px solid #5a2a1a; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .fall { display: none } button { transition: none !important } }
`;

const PINK = "#ff3d97";
const INK = "#3b0a24";

const S: Record<string, CSSProperties> = {
  page: {
    minHeight: "100dvh",
    padding: "28px 16px 48px",
    color: INK,
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
    background:
      "radial-gradient(circle at 20% 10%, #ffd0e6 0 18%, transparent 19%), radial-gradient(circle at 85% 30%, #ffc2dd 0 12%, transparent 13%), radial-gradient(circle at 40% 85%, #ffd9ea 0 15%, transparent 16%), #ffe9f3",
  },
  wrap: { maxWidth: 440, margin: "0 auto" },
  header: { marginBottom: 18 },
  title: { fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 38, lineHeight: 1.05, margin: 0, color: INK },
  sub: { margin: "6px 0 16px", fontSize: 14, color: "#8a4a66" },
  tubeLabel: { display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 },
  tube: { position: "relative", height: 22, borderRadius: 999, background: "#fff", border: `2px solid ${INK}`, overflow: "hidden" },
  fill: { height: "100%", background: `linear-gradient(90deg, #ff7ab8, ${PINK})`, transition: "width .7s ease" },
  shine: { position: "absolute", left: 10, right: 10, top: 3, height: 5, borderRadius: 999, background: "rgba(255,255,255,.65)" },
  card: { background: "#fff7fb", border: `2px solid ${INK}`, borderRadius: 22, padding: 20, boxShadow: `5px 5px 0 ${INK}` },
  h2: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 24, margin: "0 0 8px" },
  p: { margin: "0 0 14px", fontSize: 16, lineHeight: 1.5 },
  small: { fontSize: 14, margin: 0 },
  msg: { margin: "0 0 10px", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 17, lineHeight: 1.55 },
  big: { fontSize: 44, fontWeight: 800, margin: "10px 0 14px", color: PINK },
  label: { display: "block", margin: "14px 0 6px", fontSize: 15, fontWeight: 600 },
  area: { width: "100%", boxSizing: "border-box", padding: 10, fontSize: 16, fontFamily: "inherit", border: `2px solid ${INK}`, borderRadius: 12, background: "#fff", color: INK, resize: "vertical" },
  check: { display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", marginBottom: 8, border: "2px solid #e7b6cf", borderRadius: 14, background: "#fff", fontSize: 15, lineHeight: 1.4, cursor: "pointer" },
  checkOn: { borderColor: PINK, background: "#ffe3f0" },
  fail: { margin: "4px 0 12px", fontSize: 14, color: "#a3123f" },
  row: { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", minHeight: 64 },
  btn: { marginTop: 10, padding: "13px 20px", fontSize: 17, fontWeight: 700, color: "#fff", background: `linear-gradient(180deg, #ff6db0, ${PINK})`, border: `2px solid ${INK}`, borderRadius: 999, boxShadow: `0 4px 0 ${INK}`, cursor: "pointer" },
  btnGhost: { marginTop: 8, marginBottom: 4, padding: "11px 16px", fontSize: 16, color: INK, background: "#fff", border: `2px solid ${INK}`, borderRadius: 999, cursor: "pointer" },
};


/* ------------------------------------------------------------------ */
/*  Giriş ekranı                                                        */
/* ------------------------------------------------------------------ */
function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/naz-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) return onSuccess();
      setError(res.status === 429 ? "Çok fazla deneme. Biraz bekle." : "Yanlış şifre.");
    } catch {
      setError("Bağlantı hatası, tekrar dene.");
    }
    setBusy(false);
  };

  const off = busy || !password;
  return (
    <main style={L.page}>
      <form onSubmit={submit} style={L.card}>
        <h1 style={L.title}>Kraliçe’nin Odası</h1>
        <p style={L.p}>Giriş için şifreyi yaz.</p>
        <label htmlFor="pw" style={L.label}>
          Şifre
        </label>
        <input id="pw" type="password" autoComplete="current-password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} style={L.input} />
        {error && (
          <p role="alert" style={L.error}>
            {error}
          </p>
        )}
        <button type="submit" disabled={off} style={{ ...L.btn, opacity: off ? 0.5 : 1 }}>
          {busy ? "Kontrol ediliyor…" : "Gir"}
        </button>
      </form>
    </main>
  );
}

const L: Record<string, CSSProperties> = {
  page: {
    minHeight: "100dvh",
    display: "grid",
    placeItems: "center",
    padding: 16,
    color: INK,
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
    background:
      "radial-gradient(circle at 20% 10%, #ffd0e6 0 18%, transparent 19%), radial-gradient(circle at 85% 30%, #ffc2dd 0 12%, transparent 13%), #ffe9f3",
  },
  card: { width: "100%", maxWidth: 380, background: "#fff7fb", border: `2px solid ${INK}`, borderRadius: 22, padding: 22, boxShadow: `5px 5px 0 ${INK}` },
  title: { fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 32, lineHeight: 1.1, margin: 0 },
  p: { margin: "8px 0 16px", fontSize: 16 },
  label: { display: "block", marginBottom: 6, fontSize: 15, fontWeight: 600 },
  input: { width: "100%", boxSizing: "border-box", padding: 11, fontSize: 16, border: `2px solid ${INK}`, borderRadius: 12, background: "#fff", color: INK },
  error: { margin: "10px 0 0", fontSize: 14, color: "#a3123f" },
  btn: { marginTop: 14, padding: "13px 22px", fontSize: 17, fontWeight: 700, color: "#fff", background: `linear-gradient(180deg, #ff6db0, ${PINK})`, border: `2px solid ${INK}`, borderRadius: 999, boxShadow: `0 4px 0 ${INK}`, cursor: "pointer" },
};

/* ------------------------------------------------------------------ */
/*  Sayfa: cookie varsa oyun, yoksa giriş                               */
/* ------------------------------------------------------------------ */
export default function NazPage() {
  const [auth, setAuth] = useState<"loading" | "no" | "yes">("loading");

  useEffect(() => {
    fetch("/api/naz-login")
      .then((r) => r.json())
      .then((d) => setAuth(d.ok ? "yes" : "no"))
      .catch(() => setAuth("no"));
  }, []);

  if (auth === "loading") return <main style={L.page} />;
  return auth === "yes" ? <Game /> : <Login onSuccess={() => setAuth("yes")} />;
}