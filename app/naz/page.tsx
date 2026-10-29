"use client";

import { CSSProperties, FormEvent, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  ✏️  BURAYI KENDİ AĞZINDAN DÜZENLE — oyunun asıl mesajı bu          */
/* ------------------------------------------------------------------ */
const SINCERE_MESSAGE = [
  "Yapılan analizler sonucu Emir'in hatalı olduğu ve özür dilemesi gerektiği sonucuna varıldı. Bu nedenle Emir, Kraliçe'ye gönül alma ve affettirme sistemini kullanarak özür dileme hakkını kazandı. Gerekli adımlar gerçekleştirişiyor",
];

const CHARGES = [
  { id: "kanıyosun", text: "“Kolay kanıyosun” deyip seni küçümsemek" },
  { id: "saf", text: "“Saf” çağrışımı yaptırıp “saf salak” sonucuna götürmek" },
  { id: "ozlu", text: "“Üzülmeden adam olunmaz” özlü sözleriyle işi kötüleştirmek" },
  { id: "kan", text: "“Kanını satıp rakip eliyorum” diye saçmalamak" },
  { id: "kimyon", text: "Kimyonla gönül almaya kalkmak" },
  { id: "iki", text: "Seni tek günde 2 kez küstürmek" },
];

/* Küsme butonu her ıskalandığında sırayla bunlardan biri çıkar */
const MISS_REACTIONS = [
  "🫣 Iskaladın! Buton seni gördü.",
  "💨 Buton rüzgar gibi kaçtı.",
  "🥷 Buton ninja eğitimi almış.",
  "😮‍💨 Küsme butonu nefes nefese kaldı.",
  "📉 Küsmeter düşüyor, farkındasın değil mi?",
  "👑 Kraliçe bile yakalayamıyor, buton çok hızlı.",
  "🍞 Hamur bile bu butondan daha yavaş.",
  "🌿 Kimyon bile bu kadar kaçmaz.",
  "💖 Affet butonu sana göz kırpıyor.",
  "🫡 Buton: “Ben küsmek istemiyorum, beni zorlama.”",
];

/* Her 2. ıskalamada sohbetinizden bir easter egg çıkar */
const EASTER_EGGS = [
  "📜 K. Naz: “Ben trip atmıyorum, ben üzüldüm.”",
  "📝 Gönül alma puanı: 0. Kimyon ve hamur itiraz hakkını kaybetti.",
  "🇺🇸 “Ben Amerikan bir kızım. Freedom.” Küsme hakkı anayasal güvence altında.",
  "🎵 “Çok güzel çaldın ama bu sana kırgın olmadığım anlamına gelmez.”",
  "🗑️ “Üzülmeden adam olunmaz” sözü arşivden silindi. Deve nehirde boğuldu, inşallah.",
  "🚨 Naz’ı kaybettik. Arkada 31 mi çekiyorsun?",
  "👑 “Kraliçeden onay aldım, o yeter.” (Şimdilik.)",
];

const MISS_DROP = 5;

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
  const [dodges, setDodges] = useState(0);
  const [reaction, setReaction] = useState("");
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState<Piece[]>([]);
  const lastDodge = useRef(0);

  // 0-1: ölçülen değer, 2: her ıskalamada düşer, 3: sıfır
  const meter =
    step <= 1 ? anger : step === 2 ? Math.max(0, anger - dodges * MISS_DROP) : 0;

  const next = (event: string, data: object) => {
    log(event, data);
    setStep((s) => s + 1);
  };

  const dodge = () => {
    // dokunmatikte pointerenter + click art arda gelir, çift saymasın
    const now = Date.now();
    if (now - lastDodge.current < 250) return;
    lastDodge.current = now;

    const n = dodges + 1;
    setDodges(n);
    setReaction(
      n % 2 === 0
        ? EASTER_EGGS[(n / 2 - 1) % EASTER_EGGS.length]
        : MISS_REACTIONS[((n + 1) / 2 - 1) % MISS_REACTIONS.length]
    );
    setPos({
      x: Math.round((Math.random() - 0.5) * 200),
      y: Math.round((Math.random() - 0.5) * 110),
    });
    log("iskaladi", { dodges: n });
  };

  const finish = () => {
    log("final", { anger, charges, sentence, dodges });
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
            <p style={S.p}>Ne kadar küs olduğunu yaz ona göre ayarlansın.</p>
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
            <h2 style={S.h2}>Neden küstün?</h2>
            <p style={S.p}>Sanık Emir’in iddianamesi aşağıda. Haklı bulduğun suçları işaretle.</p>
            {CHARGES.map((c) => (
              <label key={c.id} style={{ ...S.check, ...(charges.includes(c.id) ? S.checkOn : {}) }}>
                <input type="checkbox" checked={charges.includes(c.id)} onChange={() => setCharges(toggle(charges, c.id))} />
                <span>{c.text}</span>
              </label>
            ))}
            <label style={S.label} htmlFor="ceza">
              Emir’in yaptığını yaz.
            </label>
            <textarea id="ceza" style={S.area} rows={3} value={sentence} onChange={(e) => setSentence(e.target.value)} placeholder="Örn" />
            <button style={S.btn} onClick={() => next("durusma", { charges, sentence })}>
              Kararı ver ({charges.length} suç)
            </button>
          </section>
        )}

        {step === 2 && (
          <section style={S.card}>
            <h2 style={S.h2}>Affettiricimatik v2.</h2>
            {SINCERE_MESSAGE.map((line, i) => (
              <p key={i} style={S.msg}>
                {line}
              </p>
            ))}
            <p style={{ ...S.p, marginTop: 14 }}>Affediyor musun?</p>
            <div style={S.row}>
              <button
                style={S.btn}
                onClick={() => {
                  next("affetti", { dodges });
                  finish();
                }}
              >
                Affet 💖
              </button>
              <button
                style={{ ...S.btnGhost, transform: `translate(${pos.x}px, ${pos.y}px)`, transition: "transform .18s ease-out" }}
                onPointerEnter={dodge}
                onClick={dodge}
              >
                Küsmeye devam
              </button>
            </div>
            {dodges > 0 && (
              <p key={dodges} className="pop" style={S.reaction} aria-live="polite">
                {reaction} <span style={S.count}>(Iskalama: {dodges})</span>
              </p>
            )}
          </section>
        )}

        {step === 3 && (
          <section style={S.card}>
            <h2 style={S.h2}>Kraliçe affetti 👑</h2>
            <p style={S.p}>Küsmeter %0. Sistem kapanıyor. İyi geceler Naz.</p>
          </section>
        )}
      </div>
    </main>
  );
}

const CSS = `
@keyframes fall { from { transform: translateY(-10vh) rotate(0deg); opacity: 1 } to { transform: translateY(110vh) rotate(360deg); opacity: .9 } }
@keyframes pop { 0% { transform: scale(.85); opacity: 0 } 60% { transform: scale(1.06); opacity: 1 } 100% { transform: scale(1) } }
.fall { position: fixed; top: 0; font-size: 26px; z-index: 10; pointer-events: none; animation: fall linear forwards; }
.pop { animation: pop .3s ease-out; }
button:focus-visible, input:focus-visible, textarea:focus-visible { outline: 3px solid #5a2a1a; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .fall, .pop { animation: none; display: none } .pop { display: block } button { transition: none !important } }
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
  card: { background: "#fff7fb", border: `2px solid ${INK}`, borderRadius: 22, padding: 20, boxShadow: `5px 5px 0 ${INK}`, overflow: "hidden" },
  h2: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 24, margin: "0 0 8px" },
  p: { margin: "0 0 14px", fontSize: 16, lineHeight: 1.5 },
  msg: { margin: "0 0 10px", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 17, lineHeight: 1.55 },
  big: { fontSize: 44, fontWeight: 800, margin: "10px 0 14px", color: PINK },
  label: { display: "block", margin: "14px 0 6px", fontSize: 15, fontWeight: 600 },
  area: { width: "100%", boxSizing: "border-box", padding: 10, fontSize: 16, fontFamily: "inherit", border: `2px solid ${INK}`, borderRadius: 12, background: "#fff", color: INK, resize: "vertical" },
  check: { display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", marginBottom: 8, border: "2px solid #e7b6cf", borderRadius: 14, background: "#fff", fontSize: 15, lineHeight: 1.4, cursor: "pointer" },
  checkOn: { borderColor: PINK, background: "#ffe3f0" },
  row: { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", minHeight: 140 },
  reaction: { margin: "8px 0 0", fontSize: 15, lineHeight: 1.4, color: "#a3123f", fontWeight: 600 },
  count: { fontWeight: 400, color: "#8a4a66" },
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