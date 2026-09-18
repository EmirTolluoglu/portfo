"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

type Lesson = { id: number; name: string; question_count: number };
type CW = [number, number];
type Scores = Record<number, CW>;

const TYT_LESSONS: Lesson[] = [
  { id: 1, name: "Türkçe", question_count: 40 },
  { id: 2, name: "Sosyal Bilimler", question_count: 20 },
  { id: 3, name: "Matematik", question_count: 40 },
  { id: 4, name: "Fen Bilimleri", question_count: 20 },
];

const AYT_LESSONS: Lesson[] = [
  { id: 12, name: "Matematik", question_count: 40 },
  { id: 13, name: "Fizik", question_count: 14 },
  { id: 14, name: "Kimya", question_count: 13 },
  { id: 15, name: "Biyoloji", question_count: 13 },
];

const ZERO_GROUPS = [
  { id: 2, lessons: [{ id: 5, q: 24 }, { id: 6, q: 10 }, { id: 7, q: 6 }] },
  { id: 3, lessons: [{ id: 8, q: 11 }, { id: 9, q: 11 }, { id: 10, q: 12 }, { id: 11, q: 6 }] },
  { id: 5, lessons: [{ id: 16, q: 80 }] },
];

const PRIMARY_YEAR = "2026";
const OTHER_YEARS = ["2025", "2024", "2023", "2022"];

// Easter egg ön ayarları
const EGG_PRESETS: { obp: number; tyt: Scores; ayt: Scores }[] = [
  {
    obp: 90.02,
    tyt: { 1: [38, 2], 2: [16, 4], 3: [35, 3], 4: [20, 0] },
    ayt: { 12: [36, 1], 13: [14, 0], 14: [13, 0], 15: [13, 0] },
  },
  {
    obp: 89.67,
    tyt: { 1: [27, 8], 2: [14, 4], 3: [13, 3], 4: [17, 2] },
    ayt: { 12: [18, 1], 13: [11, 2], 14: [8, 3], 15: [8, 3] },
  },
];

// Başlangıç değerleri
const INITIAL_OBP = 89.67;
const INITIAL_TYT: Scores = { 1: [30, 5], 2: [15, 3], 3: [20, 5], 4: [17, 2] };
const INITIAL_AYT: Scores = { 12: [15, 5], 13: [10, 2], 14: [9, 2], 15: [9, 2] };

type YearData = {
  content: string;
  exam_types: { id: number; result: { rank: { real: number } } }[];
};

const fmtRank = (v: number) => Math.round(v).toLocaleString("tr-TR");

function LessonRow({
  lesson,
  value,
  onChange,
}: {
  lesson: Lesson;
  value: CW;
  onChange: (id: number, v: CW) => void;
}) {
  const [c, w] = value;
  const net = Math.max(0, c - w / 4).toFixed(2);

  return (
    <div className={styles.lesson}>
      <div className={styles.lessonHead}>
        <span className={styles.name}>{lesson.name}</span>
        <span className={styles.net}>
          Net: <strong>{net}</strong> / {lesson.question_count}
        </span>
      </div>
      <div className={`${styles.sliderRow} ${styles.correct}`}>
        <span className={styles.lbl}>DOĞRU</span>
        <input
          type="range"
          min={0}
          max={lesson.question_count}
          step={1}
          value={c}
          onChange={(e) => {
            const nc = parseInt(e.target.value, 10);
            const nw = Math.min(w, lesson.question_count - nc);
            onChange(lesson.id, [nc, nw]);
          }}
        />
        <span className={styles.val}>{c}</span>
      </div>
      <div className={`${styles.sliderRow} ${styles.wrong}`}>
        <span className={styles.lbl}>YANLIŞ</span>
        <input
          type="range"
          min={0}
          max={lesson.question_count - c}
          step={1}
          value={w}
          onChange={(e) => onChange(lesson.id, [c, parseInt(e.target.value, 10)])}
        />
        <span className={styles.val}>{w}</span>
      </div>
    </div>
  );
}

export default function YksPlayground() {
  const [obp, setObp] = useState(INITIAL_OBP);
  const [tyt, setTyt] = useState<Scores>(INITIAL_TYT);
  const [ayt, setAyt] = useState<Scores>(INITIAL_AYT);
  const [years, setYears] = useState<YearData[] | null>(null);
  const [status, setStatus] = useState<{ text: string; error: boolean }>({
    text: "",
    error: false,
  });
  const [tytCollapsed, setTytCollapsed] = useState(false);
  const eggIndex = useRef(0); // sıradaki easter egg ön ayarı

  // Easter egg: OBP yazısına tıklayınca yalın -> emir -> yalın ...
  const onObpTagClick = () => {
    const p = EGG_PRESETS[eggIndex.current % EGG_PRESETS.length];
    eggIndex.current += 1;
    setObp(p.obp);
    setTyt(p.tyt);
    setAyt(p.ayt);
  };

  const buildPayload = useCallback(() => {
    const mk = (lessons: Lesson[], s: Scores) =>
      lessons.map((l) => ({
        id: l.id,
        question_count: l.question_count,
        wrong_tolerant: "4",
        input: { correct_count: s[l.id][0], wrong_count: s[l.id][1] },
      }));
    const zero = (id: number) => {
      const g = ZERO_GROUPS.find((x) => x.id === id)!;
      return {
        id: g.id,
        lessons: g.lessons.map((l) => ({
          id: l.id,
          question_count: l.q,
          wrong_tolerant: "4",
          input: { correct_count: 0, wrong_count: 0 },
        })),
      };
    };
    return {
      diploma_graduation_point: obp || 0,
      placed_last_year: false,
      exam_types: [
        { id: 1, lessons: mk(TYT_LESSONS, tyt) },
        zero(2),
        zero(3),
        { id: 4, lessons: mk(AYT_LESSONS, ayt) },
        zero(5),
      ],
    };
  }, [obp, tyt, ayt]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setStatus({ text: "Hesaplanıyor…", error: false });
      try {
        const res = await fetch("/api/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload()),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Sunucu hatası: " + res.status);
        const data = await res.json();
        const ys: YearData[] | undefined = data?.content?.years;
        if (!ys || !ys.length) throw new Error("Beklenmeyen yanıt biçimi");
        setYears(ys);
        setStatus({ text: "Güncellendi.", error: false });
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setStatus({
          text: "Hesaplanamadı: " + (err instanceof Error ? err.message : String(err)),
          error: true,
        });
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [buildPayload]);

  const rankOf = (yearLabel: string, examId: number) => {
    const y = years?.find((x) => x.content === yearLabel);
    const e = y?.exam_types.find((x) => x.id === examId);
    return e ? fmtRank(e.result.rank.real) : "—";
  };

  const primary = years ? years.find((y) => y.content === PRIMARY_YEAR) || years[0] : null;
  const primaryRank = (examId: number) => {
    const e = primary?.exam_types.find((x) => x.id === examId);
    return e ? fmtRank(e.result.rank.real) : "—";
  };

  return (
    <div className={styles.root}>
      <div className={styles.layout}>
        <div className={`${styles.card} ${styles.span2}`}>
          <h2>
            <span className={styles.h2Left}>
              Diploma Notu{" "}
              <span
                className={styles.tag}
                onClick={onObpTagClick}
                style={{ cursor: "default", userSelect: "none" }}
              >
                OBP
              </span>
            </span>
          </h2>
          <div className={styles.diplomaRow}>
            <div className={styles.diplomaHead}>
              <span className={styles.diplomaLbl}>100 üzerinden</span>
              <span className={styles.diplomaVal}>{obp.toFixed(2)}</span>
            </div>
            <div className={`${styles.sliderRow} ${styles.obp}`}>
              <span className={styles.lbl}>OBP</span>
              <input
                type="range"
                min={0}
                max={100}
                step={0.01}
                value={obp}
                onChange={(e) => setObp(parseFloat(e.target.value))}
              />
              <span className={styles.val}>{obp.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2>
            <span className={styles.h2Left}>
              TYT <span className={styles.tag}>Temel Yeterlilik Testi</span>
            </span>
          </h2>
          {TYT_LESSONS.map((l) => (
            <LessonRow
              key={l.id}
              lesson={l}
              value={tyt[l.id]}
              onChange={(id, v) => setTyt((s) => ({ ...s, [id]: v }))}
            />
          ))}
        </div>

        <div className={styles.card}>
          <h2>
            <span className={styles.h2Left}>
              AYT Sayısal <span className={styles.tag}>Matematik ve Fen Bilimleri</span>
            </span>
          </h2>
          {AYT_LESSONS.map((l) => (
            <LessonRow
              key={l.id}
              lesson={l}
              value={ayt[l.id]}
              onChange={(id, v) => setAyt((s) => ({ ...s, [id]: v }))}
            />
          ))}
        </div>
      </div>

      <div className={styles.results}>
        <div className={styles.resultBlock}>
          <div className={styles.typeRow}>
            <span className={styles.type}>AYT Sayısal (SAY)</span>
          </div>
          <div className={styles.primaryYear}>
            <div className={styles.year}>{PRIMARY_YEAR}</div>
            <div className={styles.rank}>{primaryRank(4)}</div>
          </div>
          <div className={styles.otherYears}>
            {OTHER_YEARS.map((y) => (
              <div className={styles.row} key={y}>
                <span className={styles.yr}>{y}</span>
                <span className={styles.pt}>{rankOf(y, 4)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.resultBlock}>
          <div className={styles.typeRow}>
            <button
              className={styles.hamburgerBtn}
              aria-label="TYT sonucunu aç/kapat"
              onClick={() => setTytCollapsed((v) => !v)}
            >
              <span className={styles.bar} />
            </button>
            <span className={styles.type}>TYT</span>
          </div>
          <div className={`${styles.resultContent} ${tytCollapsed ? styles.collapsed : ""}`}>
            <div className={styles.primaryYear}>
              <div className={styles.year}>{PRIMARY_YEAR}</div>
              <div className={styles.rank}>{primaryRank(1)}</div>
            </div>
            <div className={styles.otherYears}>
              {OTHER_YEARS.map((y) => (
                <div className={styles.row} key={y}>
                  <span className={styles.yr}>{y}</span>
                  <span className={styles.pt}>{rankOf(y, 1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`${styles.status} ${status.error ? styles.statusError : ""}`}>
          {status.text}
        </div>
      </div>
    </div>
  );
}