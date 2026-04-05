import React, { useState, useEffect, useRef } from "react";

// ── Design tokens ──────────────────────────────────────────────────────────
const C = {
  bg: "#f8f8f6",
  surface: "#ffffff",
  border: "#e9e9e3",
  text: "#1a1a18",
  sub: "#6b6b62",
  dim: "#b5b5aa",
  accent: "#2563eb",
  accentBg: "#eff6ff",
  success: "#16a34a",
  successBg: "#f0fdf4",
  error: "#dc2626",
  errorBg: "#fef2f2",
  warning: "#d97706",
  warningBg: "#fffbeb",
  tag: "#f1f1ef",
};

const card = (extra = {}) => ({
  background: C.surface,
  borderRadius: 16,
  border: `1px solid ${C.border}`,
  padding: 20,
  ...extra,
});

const primaryBtn = (extra = {}) => ({
  background: C.accent,
  color: "#fff",
  border: "none",
  borderRadius: 12,
  padding: "13px 20px",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  width: "100%",
  fontFamily: "inherit",
  ...extra,
});

const ghostBtn = (extra = {}) => ({
  background: C.tag,
  color: C.text,
  border: "none",
  borderRadius: 12,
  padding: "11px 20px",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  width: "100%",
  fontFamily: "inherit",
  ...extra,
});

// ── Data ──────────────────────────────────────────────────────────────────
const LEVELS = ["A1", "A2", "B1", "B2", "C1"];

const SENTENCES = {
  A1: ["The cat sits on the mat.", "She has two big dogs.", "I eat rice every day.", "He goes to school by bus.", "The sun is very bright today.", "We live in a small house.", "She drinks tea in the morning.", "The book is on the table."],
  A2: ["She usually wakes up at seven o'clock.", "Can you help me find the post office?", "I enjoy reading books in my free time.", "He doesn't like cold weather at all.", "We are planning a trip to the mountains.", "My sister is learning to play the violin.", "The train arrives in about ten minutes.", "She bought a new dress for the party."],
  B1: ["The conference has been postponed until next Friday.", "She has been studying English for nearly three years.", "Although it was raining, they continued with the match.", "He decided to quit his job and travel the world.", "The results of the experiment were quite surprising.", "Could you possibly reschedule our appointment for tomorrow?", "She managed to finish the report well before the deadline.", "The museum is closed on Mondays and national holidays."],
  B2: ["Despite the heavy rainfall, the outdoor festival proceeded as planned.", "She was awarded a full scholarship due to her exceptional academic performance.", "The documentary explores the profound impact of technology on modern relationships.", "The unprecedented rise in living costs has made homeownership increasingly difficult.", "Having carefully considered all available options, he chose to pursue medicine.", "Her groundbreaking research challenges many long-held assumptions about human behavior.", "The negotiations collapsed after both parties failed to reach a viable compromise.", "The government introduced sweeping new regulations to address the climate emergency."],
  C1: ["The multifaceted nature of the issue demands a comprehensive, cross-sectoral approach.", "Notwithstanding the preliminary findings, researchers remain cautious about definitive conclusions.", "The proliferation of misinformation across social media has far-reaching societal implications.", "Contemporary urban planning must reconcile economic growth with environmental and social equity.", "The committee's recommendations were largely disregarded, much to the dismay of campaigners.", "Her nuanced portrayal of the protagonist earned widespread critical acclaim and several awards.", "The ambiguity inherent in the legislation has led to contradictory judicial interpretations.", "The paradigm shift in renewable energy has fundamentally reshaped the geopolitical landscape."],
};

const VOCAB = {
  A1: [{ word: "happy", def: "feeling joy or pleasure" }, { word: "big", def: "large in size" }, { word: "fast", def: "moving quickly" }, { word: "cold", def: "low in temperature" }, { word: "hungry", def: "wanting to eat food" }, { word: "tired", def: "feeling a need to rest" }],
  A2: [{ word: "ancient", def: "very old, from long ago" }, { word: "polite", def: "having good manners" }, { word: "narrow", def: "small in width" }, { word: "exhausted", def: "extremely tired" }, { word: "generous", def: "happy to give to others" }, { word: "nervous", def: "anxious or worried" }],
  B1: [{ word: "ambitious", def: "having a strong desire to succeed" }, { word: "consequence", def: "a result of an action" }, { word: "diligent", def: "hardworking and careful" }, { word: "inevitable", def: "certain to happen" }, { word: "resilient", def: "able to recover quickly" }, { word: "collaborate", def: "work together toward a goal" }],
  B2: [{ word: "unprecedented", def: "never done or seen before" }, { word: "meticulous", def: "extremely careful about details" }, { word: "controversial", def: "causing public debate or dispute" }, { word: "alleviate", def: "make a problem less severe" }, { word: "pragmatic", def: "dealing with things practically" }, { word: "deteriorate", def: "become progressively worse" }],
  C1: [{ word: "ephemeral", def: "lasting only a very short time" }, { word: "juxtapose", def: "place close together for contrast" }, { word: "tenacious", def: "holding firmly to a goal or belief" }, { word: "eloquent", def: "fluent and persuasive in expression" }, { word: "pernicious", def: "causing harm in a gradual way" }, { word: "ambivalent", def: "having mixed or contradictory feelings" }],
};

const PASSAGES = {
  A1: { title: "My Best Friend", text: "My best friend is Anna. She is twelve years old. She has long brown hair and blue eyes. Anna likes music and painting. We go to the same school. We play together every afternoon. Anna is kind and funny. I am happy to have her as my friend.", questions: [{ q: "How old is Anna?", opts: ["Ten", "Eleven", "Twelve", "Thirteen"], ans: 2 }, { q: "What does Anna like?", opts: ["Sports and cooking", "Music and painting", "Reading and swimming", "Dancing and singing"], ans: 1 }] },
  A2: { title: "A Day at the Market", text: "Every Saturday morning, Maria visits the local market. She buys fresh vegetables, fruit, and sometimes flowers. The market is very busy and colorful. Maria always talks to the sellers because she knows them well. After shopping, she goes to a small café nearby and has a cup of coffee before going home.", questions: [{ q: "When does Maria visit the market?", opts: ["Every day", "On Fridays", "Saturday mornings", "Sunday afternoons"], ans: 2 }, { q: "What does she do after shopping?", opts: ["Goes straight home", "Visits a friend", "Has coffee at a café", "Takes a bus"], ans: 2 }] },
  B1: { title: "Remote Work", text: "Remote work has become increasingly popular in recent years. Many companies now allow employees to work from home, at least part of the time. This arrangement offers several advantages: workers save commuting time, can design their own workspace, and often report higher job satisfaction. However, remote work also presents challenges, including feelings of isolation and difficulty maintaining clear boundaries between work and personal life.", questions: [{ q: "What is one advantage of remote work?", opts: ["Higher salary", "Saving commute time", "Free meals", "More meetings"], ans: 1 }, { q: "What challenge does remote work create?", opts: ["Better equipment", "Feeling isolated", "Shorter hours", "More colleagues"], ans: 1 }] },
  B2: { title: "AI in Healthcare", text: "Artificial intelligence is rapidly transforming the healthcare sector. Machine learning algorithms can analyze medical images with remarkable accuracy, often detecting conditions such as cancer at earlier stages than human clinicians. AI-powered tools are also being used to predict patient deterioration, streamline administrative tasks, and personalize treatment plans. Despite these advances, significant concerns remain regarding data privacy, algorithmic bias, and the potential erosion of the doctor-patient relationship.", questions: [{ q: "How is AI used in medical imaging?", opts: ["It replaces all doctors", "It detects conditions with high accuracy", "It stores patient records", "It reduces hospital costs"], ans: 1 }, { q: "What is one concern about AI in healthcare?", opts: ["Too many nurses", "Algorithmic bias", "Lack of computers", "High treatment costs"], ans: 1 }] },
  C1: { title: "Cognitive Biases", text: "Cognitive biases are systematic patterns of deviation from rationality in judgment, arising from the brain's attempt to simplify information processing. Confirmation bias leads individuals to seek and interpret information in ways that affirm their preexisting beliefs, while the availability heuristic causes people to overestimate the likelihood of events that come easily to mind. Understanding these biases has profound implications for fields ranging from behavioral economics to public policy, suggesting that well-designed institutional structures may be more effective than appeals to rational deliberation alone.", questions: [{ q: "What causes cognitive biases?", opts: ["Lack of education", "Brain simplifying information", "Emotional instability", "Poor diet"], ans: 1 }, { q: "What does 'confirmation bias' involve?", opts: ["Doubting everything", "Seeking info that confirms beliefs", "Ignoring all evidence", "Overestimating risks"], ans: 1 }] },
};

const SPEAK_TOPICS = {
  A1: ["Introduce yourself", "Your family", "Your favourite food", "Your daily routine"],
  A2: ["Your hometown", "A recent trip", "Your hobbies", "Describe your school or workplace"],
  B1: ["Your career goals", "A film you enjoyed", "A challenge you overcame", "Your country's traditions"],
  B2: ["Impact of social media", "Climate change solutions", "Work-life balance", "A current global issue"],
  C1: ["AI and society", "Ethics of genetic engineering", "The future of education", "Globalisation and identity"],
};

const WRITE_PROMPTS = {
  task1: [
    "The graph below shows the percentage of households in three countries with internet access between 2000 and 2020. Summarize the information, selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    "The table below shows average monthly temperatures (°C) in four major cities across different seasons. Summarize the key features and make relevant comparisons. Write at least 150 words.",
    "The pie charts below show how people in two age groups spend their leisure time. Summarize the key similarities and differences. Write at least 150 words.",
  ],
  task2: [
    "Some people believe universities should focus on academic knowledge, while others think they should prepare students for employment. Discuss both views and give your own opinion. Write at least 250 words.",
    "In many countries, young people spend more time online than ever before. Do the advantages of this outweigh the disadvantages? Write at least 250 words.",
    "Some argue that governments should invest in public transport rather than building new roads. To what extent do you agree or disagree? Write at least 250 words.",
    "Many parents choose to home-school their children rather than send them to school. Do the advantages outweigh the disadvantages? Write at least 250 words.",
  ],
};

// ── Utilities ───────────────────────────────────────────────────────────────
const normalize = (s) => s.toLowerCase().replace(/[.,!?;:'"]/g, "").replace(/\s+/g, " ").trim();

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ── Level Picker ─────────────────────────────────────────────────────────────
function LevelPicker({ level, setLevel }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ background: C.accentBg, border: `1.5px solid #bfdbfe`, borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 600, color: C.accent, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}
      >
        {level} <span style={{ fontSize: 9, opacity: 0.7 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 6, zIndex: 200, minWidth: 110, boxShadow: "0 8px 24px rgba(0,0,0,0.09)" }}>
          {LEVELS.map(l => (
            <button key={l} onClick={() => { setLevel(l); setOpen(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 14px", background: level === l ? C.accentBg : "transparent", border: "none", borderRadius: 10, cursor: "pointer", color: level === l ? C.accent : C.text, fontWeight: level === l ? 600 : 400, fontSize: 14, fontFamily: "inherit" }}>
              {l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── SPEAKING ─────────────────────────────────────────────────────────────────
function SpeakSection({ level }) {
  const [topic, setTopic] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [gotFeedback, setGotFeedback] = useState(false);
  const endRef = useRef(null);
  const topics = SPEAK_TOPICS[level] || SPEAK_TOPICS.B1;

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const startTopic = (t) => {
    setTopic(t);
    setMessages([{ role: "assistant", text: `Great! Let's practice: "${t}".\n\nTell me your thoughts — type naturally, as if you're speaking. I'll respond and gently correct any mistakes. Go ahead! 😊` }]);
    setInput("");
    setGotFeedback(false);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a friendly English conversation partner for a ${level} level learner. Topic: "${topic}".
Rules: 
- Respond naturally in 1-2 sentences
- If there's a grammar/vocab mistake, note it gently in parentheses: (💡 "correct version" would be more natural)
- Ask one follow-up question to continue the conversation
- Max 70 words total. Be warm and encouraging. English only.`,
          messages: newMessages.map(m => ({ role: m.role, content: m.text })),
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "Sorry, try again!";
      setMessages(prev => [...prev, { role: "assistant", text }]);
    } catch { setMessages(prev => [...prev, { role: "assistant", text: "Something went wrong. Please try again." }]); }
    setLoading(false);
  };

  const getFeedback = async () => {
    setLoading(true);
    setGotFeedback(true);
    const transcript = messages.filter(m => m.role === "user").map(m => m.text).join("\n");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are an IELTS speaking coach. Give brief, structured feedback. Respond in Uzbek. Be encouraging and specific.",
          messages: [{ role: "user", content: `${level} darajali talaba. Mavzu: "${topic}"\n\nYozuvlari:\n${transcript}\n\nQuyidagilarni baholang (qisqacha):\n1. Grammatika ✦\n2. Lug'at boyligi ✦\n3. Fikrni ifodalash ✦\n4. Umumiy baho (1-9)\n5. 2 ta asosiy maslahat` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      setMessages(prev => [...prev, { role: "feedback", text }]);
    } catch { /* ignore */ }
    setLoading(false);
  };

  if (!topic) return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Speaking</div>
        <div style={{ color: C.sub, fontSize: 15, lineHeight: 1.6 }}>AI conversation partner siz bilan {level} darajasida suhbatlashadi va xatolaringizni muloyimlik bilan tuzatadi.</div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.dim, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Mavzu tanlang</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {topics.map((t, i) => (
          <button key={i} onClick={() => startTopic(t)} style={{ ...card({ padding: "16px 18px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }), border: `1px solid ${C.border}` }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
            <span style={{ fontSize: 15, fontWeight: 500 }}>{t}</span>
            <span style={{ color: C.dim, fontSize: 18 }}>→</span>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 20, padding: "14px 16px", background: C.accentBg, borderRadius: 12, border: "1px solid #bfdbfe" }}>
        <div style={{ fontSize: 13, color: C.accent, lineHeight: 1.5 }}>💡 Real o'quvchi bilan jonli audio practice — Telegram bot versiyasida mavjud bo'ladi.</div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 155px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <button onClick={() => setTopic(null)} style={{ background: C.tag, border: "none", borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontSize: 13, color: C.sub, fontFamily: "inherit" }}>← Orqaga</button>
        <span style={{ background: C.accentBg, color: C.accent, padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{topic}</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 4 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "84%", background: m.role === "user" ? C.accent : m.role === "feedback" ? C.successBg : C.surface, color: m.role === "user" ? "#fff" : C.text, border: m.role === "feedback" ? "1px solid #bbf7d0" : m.role === "user" ? "none" : `1px solid ${C.border}`, borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "12px 16px", fontSize: 14, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
              {m.role === "feedback" && <div style={{ fontWeight: 700, color: C.success, marginBottom: 8, fontSize: 13 }}>📊 Feedback</div>}
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex" }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "18px 18px 18px 4px", padding: "14px 18px", display: "flex", gap: 5 }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.dim, animation: `dot 1.2s ${i * 0.2}s ease-in-out infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ paddingTop: 12 }}>
        {messages.filter(m => m.role === "user").length >= 3 && !gotFeedback && (
          <button onClick={getFeedback} style={{ ...ghostBtn({ marginBottom: 8, fontSize: 13, padding: "10px", color: C.success }) }}>📊 Suhbatim uchun feedback olish</button>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Inglizcha yozing..." style={{ flex: 1, background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "12px 16px", fontSize: 15, outline: "none", color: C.text, fontFamily: "inherit" }} onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
          <button onClick={send} disabled={loading || !input.trim()} style={{ background: C.accent, border: "none", borderRadius: 14, width: 48, height: 48, cursor: "pointer", fontSize: 20, opacity: !input.trim() || loading ? 0.4 : 1, flexShrink: 0 }}>↑</button>
        </div>
      </div>
      <style>{`@keyframes dot{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

// ── READING ───────────────────────────────────────────────────────────────────
function ReadSection({ level }) {
  const [mode, setMode] = useState("vocab");
  const [key, setKey] = useState(0);
  const passageLvl = Object.keys(PASSAGES).includes(level) ? level : level === "A2" ? "A1" : level === "C1" ? "B2" : "B1";

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Reading</div>
        <div style={{ color: C.sub, fontSize: 15 }}>Vocabulary matching va comprehension</div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[{ id: "vocab", label: "Vocab Match" }, { id: "passage", label: "Passage" }].map(t => (
          <button key={t.id} onClick={() => { setMode(t.id); setKey(k => k + 1); }} style={{ padding: "9px 20px", borderRadius: 12, border: "none", cursor: "pointer", background: mode === t.id ? C.accent : C.tag, color: mode === t.id ? "#fff" : C.sub, fontSize: 14, fontWeight: 600, fontFamily: "inherit" }}>{t.label}</button>
        ))}
      </div>
      {mode === "vocab" && <VocabMatch key={`vocab-${key}`} level={level} onReset={() => setKey(k => k + 1)} />}
      {mode === "passage" && <PassageRead key={`pass-${key}`} level={passageLvl} onReset={() => setKey(k => k + 1)} />}
    </div>
  );
}

function VocabMatch({ level, onReset }) {
  const words = VOCAB[level] || VOCAB.B1;
  const [shuffledDefs] = useState(() => shuffle(words.map((_, i) => i)));
  const [selectedWord, setSelectedWord] = useState(null);
  const [matched, setMatched] = useState({});
  const [flash, setFlash] = useState(null); // {wordIdx, defIdx, correct}

  const matchedCount = Object.keys(matched).length;
  const done = matchedCount === words.length;

  const handleWord = (i) => {
    if (matched[i] !== undefined || flash) return;
    setSelectedWord(selectedWord === i ? null : i);
  };

  const handleDef = (shuffledIdx) => {
    if (flash) return;
    const origIdx = shuffledDefs[shuffledIdx];
    if (Object.values(matched).includes(shuffledIdx)) return;
    if (selectedWord === null) return;

    const correct = origIdx === selectedWord;
    setFlash({ wordIdx: selectedWord, defIdx: shuffledIdx, correct });
    setTimeout(() => {
      if (correct) setMatched(prev => ({ ...prev, [selectedWord]: shuffledIdx }));
      setFlash(null);
      setSelectedWord(null);
    }, 600);
  };

  const wordMatched = (i) => matched[i] !== undefined;
  const defMatched = (si) => Object.values(matched).includes(si);

  const wordBorder = (i) => {
    if (flash?.wordIdx === i) return flash.correct ? C.success : C.error;
    if (selectedWord === i) return C.accent;
    if (wordMatched(i)) return C.success;
    return C.border;
  };
  const wordBg = (i) => {
    if (flash?.wordIdx === i) return flash.correct ? C.successBg : C.errorBg;
    if (selectedWord === i) return C.accentBg;
    if (wordMatched(i)) return C.successBg;
    return C.surface;
  };
  const wordColor = (i) => {
    if (flash?.wordIdx === i) return flash.correct ? C.success : C.error;
    if (selectedWord === i) return C.accent;
    if (wordMatched(i)) return C.success;
    return C.text;
  };
  const defBorder = (si) => {
    if (flash?.defIdx === si) return flash.correct ? C.success : C.error;
    if (defMatched(si)) return C.success;
    return C.border;
  };
  const defBg = (si) => {
    if (flash?.defIdx === si) return flash.correct ? C.successBg : C.errorBg;
    if (defMatched(si)) return C.successBg;
    return C.surface;
  };

  if (done) return (
    <div style={{ ...card(), textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 44, marginBottom: 14 }}>🎉</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Barcha so'zlar topildi!</div>
      <div style={{ color: C.sub, marginBottom: 24 }}>{words.length} / {words.length}</div>
      <button onClick={onReset} style={{ ...primaryBtn(), maxWidth: 180, margin: "0 auto" }}>Yana urinish</button>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: C.sub }}>{matchedCount} / {words.length}</div>
        <div style={{ background: C.border, height: 4, width: 100, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ background: C.success, height: 4, width: `${(matchedCount / words.length) * 100}%`, borderRadius: 4, transition: "width 0.3s" }} />
        </div>
      </div>
      {selectedWord === null && matchedCount === 0 && (
        <div style={{ fontSize: 13, color: C.dim, marginBottom: 12 }}>So'zni tanlang, keyin uning ta'rifini bosing</div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {words.map((w, i) => (
            <button key={i} onClick={() => handleWord(i)} style={{ padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${wordBorder(i)}`, background: wordBg(i), color: wordColor(i), fontSize: 14, fontWeight: 600, cursor: wordMatched(i) ? "default" : "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s", opacity: wordMatched(i) ? 0.65 : 1 }}>
              {w.word}{wordMatched(i) ? " ✓" : ""}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {shuffledDefs.map((origIdx, si) => (
            <button key={si} onClick={() => handleDef(si)} style={{ padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${defBorder(si)}`, background: defBg(si), color: defMatched(si) ? C.success : C.text, fontSize: 13, cursor: defMatched(si) ? "default" : "pointer", textAlign: "left", fontFamily: "inherit", lineHeight: 1.45, transition: "all 0.15s", opacity: defMatched(si) ? 0.65 : 1 }}>
              {words[origIdx].def}{defMatched(si) ? " ✓" : ""}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PassageRead({ level, onReset }) {
  const passage = PASSAGES[level];
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = passage.questions.filter((q, i) => answers[i] === q.ans).length;
  const allAnswered = Object.keys(answers).length === passage.questions.length;

  return (
    <div>
      <div style={{ ...card({ marginBottom: 16 }) }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{passage.title}</div>
        <div style={{ fontSize: 15, lineHeight: 1.8, color: C.text }}>{passage.text}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {passage.questions.map((q, qi) => (
          <div key={qi} style={card()}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{qi + 1}. {q.q}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {q.opts.map((opt, oi) => {
                const isSelected = answers[qi] === oi;
                const isCorrect = oi === q.ans;
                let bg = C.surface, border = C.border, color = C.text, fw = 400;
                if (submitted) {
                  if (isCorrect) { bg = C.successBg; border = C.success; color = C.success; fw = 600; }
                  else if (isSelected) { bg = C.errorBg; border = C.error; color = C.error; fw = 600; }
                } else if (isSelected) { bg = C.accentBg; border = C.accent; color = C.accent; fw = 600; }
                return (
                  <button key={oi} onClick={() => !submitted && setAnswers(prev => ({ ...prev, [qi]: oi }))} style={{ padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${border}`, background: bg, color, fontSize: 14, textAlign: "left", cursor: submitted ? "default" : "pointer", fontFamily: "inherit", fontWeight: fw, transition: "all 0.15s" }}>
                    {String.fromCharCode(65 + oi)}. {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {!submitted
        ? <button onClick={() => setSubmitted(true)} disabled={!allAnswered} style={{ ...primaryBtn({ marginTop: 16, opacity: allAnswered ? 1 : 0.4 }) }}>Tekshirish</button>
        : (
          <div style={{ ...card({ marginTop: 16, background: score === passage.questions.length ? C.successBg : C.warningBg, border: `1px solid ${score === passage.questions.length ? "#bbf7d0" : "#fde68a"}` }) }}>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>
              {score === passage.questions.length ? "🎉 Mukammal!" : score > 0 ? "👍 Yaxshi!" : "💪 Davom eting!"}
            </div>
            <div style={{ color: C.sub, fontSize: 14, marginBottom: 14 }}>{score} / {passage.questions.length} to'g'ri javob</div>
            <button onClick={onReset} style={ghostBtn({ fontSize: 13, padding: "10px" })}>Boshqa matn</button>
          </div>
        )}
    </div>
  );
}

// ── LISTENING ─────────────────────────────────────────────────────────────────
function ListenSection({ level }) {
  const startIdx = Math.max(0, LEVELS.indexOf(level));
  const [lvlIdx, setLvlIdx] = useState(startIdx);
  const [sentence, setSentence] = useState("");
  const [phase, setPhase] = useState("idle"); // idle | typing | result
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [streak, setStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [ttsSupported] = useState(() => typeof window !== "undefined" && "speechSynthesis" in window);

  const currentLevel = LEVELS[lvlIdx];

  const pickSentence = () => {
    const arr = SENTENCES[currentLevel];
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = lvlIdx <= 1 ? 0.82 : lvlIdx <= 3 ? 0.93 : 1.02;
    window.speechSynthesis.speak(utter);
  };

  const handlePlay = () => {
    if (phase === "idle") {
      const s = pickSentence();
      setSentence(s);
      speak(s);
      setPhase("typing");
      setPlayCount(1);
    } else if (phase === "typing") {
      speak(sentence);
      setPlayCount(p => p + 1);
    }
  };

  const check = () => {
    const isCorrect = normalize(input) === normalize(sentence);
    setResult({ isCorrect });
    setPhase("result");
    setAttempts(a => a + 1);
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setCorrect(c => c + 1);
      if (newStreak >= 3 && lvlIdx < LEVELS.length - 1) {
        setTimeout(() => { setLvlIdx(l => l + 1); setStreak(0); }, 1200);
      }
    } else {
      setStreak(0);
    }
  };

  const next = () => { setSentence(""); setInput(""); setResult(null); setPhase("idle"); setPlayCount(0); };

  if (!ttsSupported) return (
    <div style={{ ...card(), textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>🎧</div>
      <div style={{ color: C.sub, fontSize: 15 }}>Bu brauzer audio qo'llab-quvvatlamaydi. Boshqa brauzer sinab ko'ring.</div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Listening</div>
        <div style={{ color: C.sub, fontSize: 15 }}>Gapni eshiting va yozing — 3 ketma-ket to'g'ri → daraja oshadi</div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { label: "To'g'ri", value: correct, color: C.success },
          { label: "Streak 🔥", value: streak, color: streak >= 2 ? C.warning : C.text },
          { label: "Daraja", value: currentLevel, color: C.accent },
        ].map((s, i) => (
          <div key={i} style={{ ...card({ padding: "14px 12px", textAlign: "center" }) }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.dim, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {streak === 2 && (
        <div style={{ padding: "12px 16px", background: C.warningBg, borderRadius: 12, border: "1px solid #fde68a", marginBottom: 16, fontSize: 13, color: C.warning }}>
          🔥 2 ketma-ket! Yana 1 ta to'g'ri — {LEVELS[lvlIdx + 1] || "eng yuqori daraja"} ga o'tasiz!
        </div>
      )}

      <div style={card({ marginBottom: 16 })}>
        {phase === "idle" && (
          <div style={{ textAlign: "center", padding: "28px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🎧</div>
            <button onClick={handlePlay} style={{ ...primaryBtn({ maxWidth: 180, margin: "0 auto" }) }}>▶ O'ynating</button>
          </div>
        )}

        {phase === "typing" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Eshitganingizni yozing:</div>
              <button onClick={handlePlay} style={{ background: C.tag, border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 13, cursor: "pointer", color: C.sub, fontFamily: "inherit" }}>🔁 Qayta {playCount > 1 ? `(${playCount})` : ""}</button>
            </div>
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); input.trim() && check(); } }} rows={3} autoFocus placeholder="Bu yerga yozing..." style={{ width: "100%", boxSizing: "border-box", background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", fontSize: 15, fontFamily: "inherit", color: C.text, outline: "none", resize: "none" }} onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
            <button onClick={check} disabled={!input.trim()} style={{ ...primaryBtn({ marginTop: 12, opacity: !input.trim() ? 0.4 : 1 }) }}>Tekshirish</button>
          </div>
        )}

        {phase === "result" && result && (
          <div>
            <div style={{ padding: "16px", borderRadius: 12, background: result.isCorrect ? C.successBg : C.errorBg, border: `1px solid ${result.isCorrect ? "#bbf7d0" : "#fecaca"}`, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: result.isCorrect ? C.success : C.error, marginBottom: result.isCorrect ? 0 : 10 }}>
                {result.isCorrect ? "✅ To'g'ri!" + (streak >= 3 ? " 🚀 Daraja oshmoqda!" : streak >= 2 ? " 🔥" : "") : "❌ Noto'g'ri"}
              </div>
              {!result.isCorrect && (
                <div>
                  <div style={{ fontSize: 12, color: C.sub, marginBottom: 5 }}>To'g'ri javob:</div>
                  <div style={{ fontSize: 15, fontStyle: "italic", color: C.text, lineHeight: 1.6 }}>{sentence}</div>
                </div>
              )}
            </div>
            <button onClick={next} style={primaryBtn()}>Keyingi gap →</button>
          </div>
        )}
      </div>

      {/* Level track */}
      <div style={card({ padding: "14px 16px" })}>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.dim, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Daraja yo'li</div>
        <div style={{ display: "flex", gap: 6 }}>
          {LEVELS.map((l, i) => (
            <div key={l} style={{ flex: 1, textAlign: "center", padding: "7px 4px", borderRadius: 8, background: i === lvlIdx ? C.accentBg : i < lvlIdx ? C.successBg : C.tag, border: `1.5px solid ${i === lvlIdx ? C.accent : i < lvlIdx ? "#bbf7d0" : C.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: i === lvlIdx ? C.accent : i < lvlIdx ? C.success : C.dim }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── WRITING ───────────────────────────────────────────────────────────────────
function WriteSection({ level }) {
  const [taskType, setTaskType] = useState("task2");
  const [promptIdx, setPromptIdx] = useState(0);
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const minWords = taskType === "task1" ? 150 : 250;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const prompt = WRITE_PROMPTS[taskType][promptIdx % WRITE_PROMPTS[taskType].length];
  const ready = wordCount >= Math.floor(minWords * 0.7);

  const submit = async () => {
    setLoading(true); setFeedback("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are an experienced IELTS examiner. Evaluate the student's IELTS ${taskType === "task1" ? "Task 1" : "Task 2"} response. Student level: ${level}. 
Give structured feedback on: Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range. End with an estimated band score and top 2-3 improvements. Be encouraging. Max 180 words. Respond in Uzbek.`,
          messages: [{ role: "user", content: `Topshiriq: ${prompt}\n\nTalaba javobi:\n${text}` }],
        }),
      });
      const data = await res.json();
      setFeedback(data.content?.map(b => b.text || "").join("") || "Xatolik.");
    } catch (e) { setFeedback("❌ " + e.message); }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Writing</div>
        <div style={{ color: C.sub, fontSize: 15 }}>IELTS yozuv mashqi — AI band score feedback bilan</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[{ id: "task1", label: "Task 1" }, { id: "task2", label: "Task 2 (Essay)" }].map(t => (
          <button key={t.id} onClick={() => { setTaskType(t.id); setText(""); setFeedback(""); setPromptIdx(0); }} style={{ padding: "9px 20px", borderRadius: 12, border: "none", cursor: "pointer", background: taskType === t.id ? C.accent : C.tag, color: taskType === t.id ? "#fff" : C.sub, fontSize: 14, fontWeight: 600, fontFamily: "inherit" }}>{t.label}</button>
        ))}
      </div>

      <div style={{ ...card({ marginBottom: 14 }) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <span style={{ background: C.accentBg, color: C.accent, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>IELTS {taskType === "task1" ? "Task 1" : "Task 2"}</span>
          <button onClick={() => { setPromptIdx(p => p + 1); setText(""); setFeedback(""); }} style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Boshqa ↺</button>
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.75, color: C.text }}>{prompt}</div>
        <div style={{ marginTop: 10, fontSize: 12, color: C.dim }}>Kamida {minWords} ta so'z</div>
      </div>

      <div style={{ position: "relative", marginBottom: 14 }}>
        <textarea value={text} onChange={e => { setText(e.target.value); setFeedback(""); }} rows={11} placeholder="Bu yerga yozing..." style={{ width: "100%", boxSizing: "border-box", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: "16px 16px 36px 16px", fontSize: 15, fontFamily: "inherit", color: C.text, outline: "none", resize: "vertical", lineHeight: 1.75 }} onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
        <div style={{ position: "absolute", bottom: 12, right: 14, fontSize: 12, fontWeight: 600, color: wordCount >= minWords ? C.success : wordCount >= minWords * 0.5 ? C.warning : C.dim }}>{wordCount} / {minWords}</div>
      </div>

      <button onClick={submit} disabled={loading || !ready} style={{ ...primaryBtn({ marginBottom: 14, opacity: loading || !ready ? 0.45 : 1 }) }}>
        {loading ? "⏳ Baholanmoqda..." : "📝 AI Feedback olish"}
      </button>

      {feedback && (
        <div style={{ ...card({ background: C.successBg, border: "1px solid #bbf7d0" }) }}>
          <div style={{ fontWeight: 700, color: C.success, marginBottom: 10, fontSize: 14 }}>📊 IELTS Feedback</div>
          <div style={{ fontSize: 14, lineHeight: 1.75, color: C.text, whiteSpace: "pre-wrap" }}>{feedback}</div>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [level, setLevel] = useState("B1");
  const [tab, setTab] = useState("speak");

  useEffect(() => {
    const id = "lingua-font";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const NAV = [
    { id: "speak", icon: "🎤", label: "Speaking" },
    { id: "read", icon: "📖", label: "Reading" },
    { id: "listen", icon: "🎧", label: "Listening" },
    { id: "write", icon: "✍️", label: "Writing" },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", color: C.text, maxWidth: 480, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: -0.5 }}>Lingua<span style={{ color: C.accent }}>.</span></div>
        <LevelPicker level={level} setLevel={setLevel} />
      </div>

      {/* Content */}
      <div style={{ padding: "22px 20px 100px" }}>
        {tab === "speak" && <SpeakSection level={level} />}
        {tab === "read" && <ReadSection level={level} />}
        {tab === "listen" && <ListenSection level={level} />}
        {tab === "write" && <WriteSection level={level} />}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderTop: `1px solid ${C.border}`, display: "flex", padding: "10px 0 16px" }}>
        {NAV.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: tab === t.id ? C.accent : C.dim, padding: "4px 0", cursor: "pointer", fontFamily: "inherit" }}>
            <span style={{ fontSize: 22 }}>{t.icon}</span>
            <span style={{ fontSize: 11, fontWeight: tab === t.id ? 700 : 400 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
