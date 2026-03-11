import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || "";
const supabase = SUPABASE_URL ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// ─── CONSTELLATION NODES ────────────────────────────────────────────────────
const STYLE_NODES = [
  { id: "minimal",       x: 28, y: 48 },
  { id: "editorial",     x: 40, y: 36 },
  { id: "dark",          x: 16, y: 70 },
  { id: "romantic",      x: 65, y: 20 },
  { id: "preppy",        x: 80, y: 28 },
  { id: "sporty",        x: 74, y: 75 },
  { id: "vintage",       x: 52, y: 62 },
  { id: "streetwear",    x: 58, y: 80 },
  { id: "bohemian",      x: 46, y: 16 },
  { id: "classic",       x: 86, y: 48 },
  { id: "avant-garde",   x: 20, y: 26 },
  { id: "feminine",      x: 74, y: 16 },
  { id: "androgynous",   x: 34, y: 30 },
  { id: "maximalist",    x: 62, y: 38 },
  { id: "coastal",       x: 88, y: 62 },
  { id: "cottagecore",   x: 54, y: 10 },
  { id: "luxe",          x: 92, y: 36 },
  { id: "grunge",        x: 12, y: 82 },
  { id: "ethereal",      x: 38, y: 8  },
  { id: "urban",         x: 44, y: 72 },
  { id: "architectural", x: 18, y: 52 },
  { id: "sensual",       x: 70, y: 56 },
  { id: "playful",       x: 60, y: 26 },
  { id: "sophisticated", x: 82, y: 54 },
  { id: "raw",           x: 24, y: 86 },
];

const NODE_IDS = STYLE_NODES.map(n => n.id);

// ─── STYLES ─────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Mono:wght@300;400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0a; color: #fff; overflow-x: hidden; }
    .app { font-family: 'DM Mono', monospace; background: #0a0a0a; color: #fff; min-height: 100vh; }
    .page { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
    input, textarea, button { font-family: 'DM Mono', monospace; }
    input:focus, textarea:focus { outline: none; }
    input::placeholder, textarea::placeholder { color: #444; }
    button { cursor: pointer; }

    @keyframes fadeUp    { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes wordReveal{ from { opacity:0; transform:translateY(24px) skewY(2deg); } to { opacity:1; transform:translateY(0) skewY(0); } }
    @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
    @keyframes spin      { to { transform:rotate(360deg); } }
    @keyframes lineIn    { from { opacity:0; } to { opacity:1; } }
    @keyframes lineExpand{ from { width:0; opacity:0; } to { width:72px; opacity:1; } }
    @keyframes introWord { from { opacity:0; transform:translateY(10px) skewY(1deg); } to { opacity:1; transform:translateY(0) skewY(0); } }
    @keyframes subtleFade{ from { opacity:0; } to { opacity:0.38; } }
    @keyframes blink     { 0%,100% { opacity:1; } 50% { opacity:0; } }

    .fade-up    { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) forwards; }
    .word-reveal{ animation: wordReveal 0.7s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; }
    .fade-in    { animation: fadeIn 0.5s ease forwards; }
    .spinner    { animation: spin 0.8s linear infinite; }

    /* ── Site nav ── */
    .site-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 28px 0;
      border-bottom: 1px solid #161616;
    }

    /* ── Home hero ── */
    .home-hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      min-height: calc(100vh - 82px);
      justify-content: center;
      padding: 64px 0 80px;
    }
    @media (min-width: 860px) {
      .page { padding: 0 72px; }
      .home-hero { padding: 80px 0; }
    }

    /* ── Split layout (style input) ── */
    .split-layout {
      display: grid;
      grid-template-columns: 1fr;
      min-height: 100vh;
    }
    .split-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 88px 0 64px;
    }
    .split-right { display: none; }

    @media (min-width: 860px) {
      .split-layout { grid-template-columns: 1fr 1fr; gap: 80px; }
      .split-left   { padding: 80px 0; }
      .split-right  {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 80px 0;
      }
    }

    /* ── Generating ── */
    .generating-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 40px;
      padding: 60px 0;
    }

    /* ── Results ── */
    .results-layout {
      display: grid;
      grid-template-columns: 1fr;
      padding: 72px 0 88px;
      gap: 48px;
    }
    @media (min-width: 860px) {
      .results-layout {
        grid-template-columns: 1fr 1fr;
        gap: 80px;
        align-items: center;
        padding: 0;
        min-height: 100vh;
      }
    }

    ::-webkit-scrollbar { width: 0; }
    input[type="text"], input[type="email"] { -webkit-appearance:none; border-radius:0; }
    textarea { -webkit-appearance:none; border-radius:0; }
  `}</style>
);

// ─── SHARED STYLES ───────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%",
  border: "none",
  borderBottom: "1px solid #2a2a2a",
  padding: "12px 0",
  fontSize: 14,
  background: "transparent",
  color: "#fff",
  letterSpacing: "0.02em",
};

const btnStyle = {
  background: "#fff",
  color: "#0a0a0a",
  border: "none",
  padding: "14px 28px",
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  cursor: "pointer",
  display: "inline-block",
};

const ghostBtnStyle = {
  background: "transparent",
  color: "#fff",
  border: "1px solid #2a2a2a",
  padding: "14px 28px",
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  cursor: "pointer",
  display: "inline-block",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const resizeImage = (file) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 800;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
        else { width = Math.round(width * MAX / height); height = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.82).split(",")[1]);
    };
    img.src = URL.createObjectURL(file);
  });

const generateStyleWords = async (description, imageBase64 = null) => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const system = `You are a style analyst. Based on the user's description or image, choose exactly 3 words that best capture their aesthetic. You MUST choose from this list: ${NODE_IDS.join(", ")}. Return ONLY a valid JSON array of exactly 3 strings. Example: ["minimal","dark","editorial"]`;

  const content = imageBase64
    ? [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } },
        { type: "text", text: description ? `Style description: ${description}` : "Analyze the aesthetic in this image." },
      ]
    : description;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 80,
        system,
        messages: [{ role: "user", content }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const match = data.content[0].text.match(/\[[\s\S]*?\]/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    const validSet = new Set(NODE_IDS);
    const valid = parsed.filter(w => validSet.has(String(w).toLowerCase())).map(w => String(w).toLowerCase());
    return valid.length === 3 ? valid : null;
  } catch {
    return null;
  }
};

// ─── STATIC CONSTELLATION ────────────────────────────────────────────────────
const Constellation = ({ highlightedWords }) => {
  const highlighted = new Set(highlightedWords || []);
  const W = 400, H = 290;
  const cx = (x) => (x / 100) * W;
  const cy = (y) => (y / 100) * H;
  const hNodes = STYLE_NODES.filter(n => highlighted.has(n.id));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
      {hNodes.length === 3 && (
        <polygon
          points={hNodes.map(n => `${cx(n.x)},${cy(n.y)}`).join(" ")}
          fill="rgba(255,255,255,0.05)"
          stroke="#fff"
          strokeWidth="0.7"
          strokeDasharray="4 3"
        />
      )}
      {STYLE_NODES.map((node) => {
        const isH = highlighted.has(node.id);
        const nx = cx(node.x);
        const ny = cy(node.y);
        const anchorEnd = node.x > 55;
        return (
          <g key={node.id}>
            {isH && <circle cx={nx} cy={ny} r={13} fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.2" />}
            <circle cx={nx} cy={ny} r={isH ? 5 : 2.5} fill={isH ? "#fff" : "#777"} />
            <text
              x={anchorEnd ? nx - 8 : nx + 8}
              y={ny - 8}
              textAnchor={anchorEnd ? "end" : "start"}
              fontSize="7.5"
              fontFamily="DM Mono, monospace"
              fill={isH ? "#fff" : "#888"}
              fontWeight={isH ? "400" : "300"}
              letterSpacing="0.03em"
            >
              {node.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── ANIMATED CONSTELLATION ───────────────────────────────────────────────────
const AnimatedConstellation = ({ fullScreen = false }) => {
  const [scanStep, setScanStep] = useState(0);
  const [lines, setLines]       = useState([]);

  useEffect(() => {
    const t = setInterval(() => setScanStep(s => s + 1), 300);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const genLines = () => {
      const used = new Set();
      const next = [];
      const count = 6 + Math.floor(Math.random() * 5);
      let attempts = 0;
      while (next.length < count && attempts < 80) {
        attempts++;
        const a = Math.floor(Math.random() * STYLE_NODES.length);
        const b = Math.floor(Math.random() * STYLE_NODES.length);
        const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
        if (a !== b && !used.has(key)) {
          used.add(key);
          next.push({ uid: `${key}-${Date.now()}`, a, b });
        }
      }
      setLines(next);
    };
    genLines();
    const t = setInterval(genLines, 1400);
    return () => clearInterval(t);
  }, []);

  const W = 560, H = 400;
  const cx = (x) => (x / 100) * W;
  const cy = (y) => (y / 100) * H;
  const n  = STYLE_NODES.length;

  const glowIds = new Set([
    STYLE_NODES[scanStep % n].id,
    STYLE_NODES[(scanStep + 8)  % n].id,
    STYLE_NODES[(scanStep + 16) % n].id,
  ]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio={fullScreen ? "xMidYMid slice" : "xMidYMid meet"}
      style={{
        width: "100%",
        height: fullScreen ? "100%" : "auto",
        maxWidth: fullScreen ? "none" : 560,
        display: "block",
      }}
    >
      {lines.map(({ uid, a, b }) => (
        <line
          key={uid}
          x1={cx(STYLE_NODES[a].x)} y1={cy(STYLE_NODES[a].y)}
          x2={cx(STYLE_NODES[b].x)} y2={cy(STYLE_NODES[b].y)}
          stroke="#fff"
          strokeWidth="0.5"
          opacity="0.22"
          style={{ animation: "lineIn 0.9s ease forwards" }}
        />
      ))}

      {STYLE_NODES.map((node) => {
        const isGlow  = glowIds.has(node.id);
        const nx      = cx(node.x);
        const ny      = cy(node.y);
        const anchorEnd = node.x > 55;
        return (
          <g key={node.id} style={{ transition: "opacity 0.3s" }}>
            {isGlow && (
              <>
                <circle cx={nx} cy={ny} r={20} fill="none" stroke="#fff" strokeWidth="0.4" opacity="0.07" />
                <circle cx={nx} cy={ny} r={11} fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.13" />
              </>
            )}
            <circle
              cx={nx} cy={ny}
              r={isGlow ? 5 : 2.5}
              fill={isGlow ? "#fff" : "#777"}
              style={{ transition: "fill 0.35s ease" }}
            />
            <text
              x={anchorEnd ? nx - 9 : nx + 9}
              y={ny - 9}
              textAnchor={anchorEnd ? "end" : "start"}
              fontSize="8"
              fontFamily="DM Mono, monospace"
              fill={isGlow ? "#fff" : "#888"}
              letterSpacing="0.04em"
              style={{ transition: "fill 0.35s ease" }}
            >
              {node.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── SHARE CARD ──────────────────────────────────────────────────────────────
const createShareCard = async (words) => {
  const W = 1080, H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  await Promise.all([
    document.fonts.load('italic 400 80px "Playfair Display"'),
    document.fonts.load('300 18px "DM Mono"'),
  ]);

  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#fff";
  ctx.font = 'italic 400 72px "Playfair Display", serif';
  ctx.fillText("taste.", 80, 130);

  ctx.fillStyle = "#aaa";
  ctx.font = '300 15px "DM Mono", monospace';
  ctx.fillText("YOUR STYLE IS", 82, 178);

  const sizes = [100, 86, 74];
  let ty = 310;
  words.forEach((word, i) => {
    ctx.fillStyle = "#fff";
    ctx.font = `italic 400 ${sizes[i] || 74}px "Playfair Display", serif`;
    ctx.fillText(word, 80, ty);
    ty += (sizes[i] || 74) * 1.25;
  });

  const highlighted = new Set(words);
  const hNodes = STYLE_NODES.filter(n => highlighted.has(n.id));
  const padL = 80, padR = 80, padTop = 730, padBot = 120;
  const cW = W - padL - padR, cH = H - padTop - padBot;
  const cx = (x) => padL + (x / 100) * cW;
  const cy = (y) => padTop + (y / 100) * cH;

  if (hNodes.length === 3) {
    ctx.beginPath();
    ctx.moveTo(cx(hNodes[0].x), cy(hNodes[0].y));
    ctx.lineTo(cx(hNodes[1].x), cy(hNodes[1].y));
    ctx.lineTo(cx(hNodes[2].x), cy(hNodes[2].y));
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([7, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  STYLE_NODES.forEach(node => {
    const isH = highlighted.has(node.id);
    const nx = cx(node.x), ny = cy(node.y);
    if (isH) {
      ctx.beginPath();
      ctx.arc(nx, ny, 26, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(nx, ny, isH ? 9 : 4.5, 0, Math.PI * 2);
    ctx.fillStyle = isH ? "#fff" : "#3a3a3a";
    ctx.fill();
    ctx.fillStyle = isH ? "#fff" : "#555";
    ctx.font = `${isH ? "400" : "300"} 13px "DM Mono", monospace`;
    const anchorEnd = node.x > 55;
    ctx.textAlign = anchorEnd ? "right" : "left";
    ctx.fillText(node.id, anchorEnd ? nx - 14 : nx + 14, ny - 14);
  });
  ctx.textAlign = "left";

  ctx.fillStyle = "#333";
  ctx.font = '300 15px "DM Mono", monospace';
  const mark = "taste.";
  const mw = ctx.measureText(mark).width;
  ctx.fillText(mark, W - padR - mw, H - 80);

  return canvas;
};

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep]                           = useState("home");
  const [name, setName]                           = useState("");
  const [email, setEmail]                         = useState("");
  const [description, setDescription]             = useState("");
  const [photo, setPhoto]                         = useState(null);
  const [photoPreview, setPhotoPreview]           = useState(null);
  const [styleWords, setStyleWords]               = useState([]);
  const [error, setError]                         = useState("");
  const [sharing, setSharing]       = useState(false);
  const [waitlistError, setWaitlistError] = useState("");
  const [typed, setTyped]           = useState("");
  const [heroReady, setHeroReady]   = useState(false);
  const fileRef = useRef(null);

  const HERO_TEXT = "shop with people who get it.";

  useEffect(() => {
    if (step !== "home") return;
    if (typed.length < HERO_TEXT.length) {
      const t = setTimeout(() => setTyped(HERO_TEXT.slice(0, typed.length + 1)), 78);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setHeroReady(true), 350);
      return () => clearTimeout(t);
    }
  }, [step, typed]);

  const handleShare = async () => {
    setSharing(true);
    try {
      const canvas = await createShareCard(styleWords);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
      const file = new File([blob], "my-taste.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "my taste.", text: `my style is ${styleWords.join(", ")}` });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "my-taste.png"; a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // user cancelled or share failed — no-op
    } finally {
      setSharing(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setPhoto(await resizeImage(file));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!description.trim() && !photo) { setError("describe your style or add a photo to continue"); return; }
    setError("");
    setStep("generating");

    const [words] = await Promise.all([
      generateStyleWords(description, photo),
      new Promise(resolve => setTimeout(resolve, 2500)),
    ]);
    const finalWords = words || ["minimal", "editorial", "dark"];
    setStyleWords(finalWords);
    setStep("email");
  };

  const handleWaitlist = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setWaitlistError("please enter your name"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setWaitlistError("please enter a valid email"); return; }
    setWaitlistError("");

    if (supabase) {
      const { error: err } = await supabase.from("signups").insert({
        name: name.trim(),
        email: email.trim(),
        description: description.trim(),
        style_words: styleWords,
      });
      if (err) console.error("Supabase error:", err);
    }

    setStep("results");
  };

  return (
    <>
      <GlobalStyles />
      <div className="app">

        <div className="page">

            {/* ── HOME ─────────────────────────────────────────────────────── */}
            {step === "home" && (
              <div className="fade-up">
                <nav className="site-nav">
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: 22,
                    letterSpacing: "-0.02em",
                  }}>
                    taste.
                  </span>
                  <span style={{ fontSize: 9, letterSpacing: "0.18em", color: "#555", textTransform: "uppercase" }}>
                    early access
                  </span>
                </nav>

                <div className="home-hero">
                  <h1 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(42px, 5.5vw, 80px)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                    marginBottom: 28,
                  }}>
                    {typed}
                    {!heroReady && (
                      <span style={{
                        display: "inline-block",
                        width: 3,
                        height: "0.85em",
                        background: "#fff",
                        marginLeft: 4,
                        verticalAlign: "middle",
                        animation: "blink 1s step-end infinite",
                      }} />
                    )}
                  </h1>

                  <p style={{ fontSize: 13, color: "#888", lineHeight: 1.8, marginBottom: 44, maxWidth: 480, letterSpacing: "0.02em", opacity: heroReady ? 1 : 0, animation: heroReady ? "fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0s both" : "none" }}>
                    a platform for people with a point of view — where your aesthetic connects you with others who share it
                  </p>
                  <button onClick={() => setStep("style")} style={{ ...btnStyle, opacity: heroReady ? 1 : 0, animation: heroReady ? "fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.18s both" : "none" }}>
                    Discover your aesthetic →
                  </button>
                  <p style={{ fontSize: 11, color: "#555", marginTop: 16, letterSpacing: "0.04em", lineHeight: 1.6, opacity: heroReady ? 1 : 0, animation: heroReady ? "fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.32s both" : "none" }}>
                    sign up to map your style and get early access when we launch
                  </p>
                </div>
              </div>
            )}

            {/* ── STYLE INPUT ──────────────────────────────────────────────── */}
            {step === "style" && (
              <div className="split-layout fade-up">
                <div className="split-left">
                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(28px, 4vw, 42px)",
                    lineHeight: 1.2,
                    marginBottom: 10,
                    letterSpacing: "-0.01em",
                  }}>
                    describe your style.
                  </h2>
                  <p style={{ fontSize: 11, color: "#aaa", marginBottom: 36, letterSpacing: "0.04em", lineHeight: 1.6 }}>
                    prose, references, vibes — or just a photo.
                  </p>

                  <form onSubmit={handleGenerate} style={{ width: "100%", maxWidth: 400 }}>
                    <textarea
                      placeholder="I'm drawn to clean lines and dark palettes, vintage pieces with a quiet edge..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={5}
                      style={{ ...inputStyle, resize: "none", height: 130, lineHeight: 1.7, paddingTop: 4 }}
                    />

                    <div
                      onClick={() => fileRef.current?.click()}
                      style={{
                        marginTop: 16,
                        border: "1px dashed #2a2a2a",
                        cursor: "pointer",
                        overflow: "hidden",
                        minHeight: photoPreview ? "auto" : 56,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {photoPreview
                        ? <img src={photoPreview} alt="style reference" style={{ width: "100%", display: "block", maxHeight: 220, objectFit: "cover" }} />
                        : <p style={{ fontSize: 11, color: "#bbb", letterSpacing: "0.08em" }}>+ add a photo reference</p>
                      }
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />

                    {error && <p style={{ fontSize: 11, color: "#999", marginTop: 10 }}>{error}</p>}
                    <button type="submit" style={{ ...btnStyle, marginTop: 28 }}>generate →</button>
                  </form>
                </div>

                <div className="split-right" style={{ opacity: 0.65 }}>
                  <Constellation highlightedWords={[]} />
                </div>
              </div>
            )}

            {/* ── GENERATING ───────────────────────────────────────────────── */}
            {step === "generating" && (
              <div className="generating-layout fade-in">
                <p style={{ fontSize: 11, letterSpacing: "0.14em", color: "#aaa", textTransform: "uppercase" }}>
                  reading your taste...
                </p>
                <div style={{ width: "100%", maxWidth: 560 }}>
                  <AnimatedConstellation />
                </div>
              </div>
            )}

            {/* ── EMAIL GATE ───────────────────────────────────────────────── */}
            {step === "email" && (
              <div className="generating-layout fade-up" style={{ gap: 0 }}>
                <p style={{ fontSize: 11, letterSpacing: "0.14em", color: "#999", marginBottom: 16, textTransform: "uppercase" }}>
                  your style is
                </p>
                {styleWords.map((word, i) => (
                  <div
                    key={word}
                    className="word-reveal"
                    style={{
                      animationDelay: `${i * 0.22}s`,
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: "italic",
                      fontWeight: 400,
                      fontSize: "clamp(38px, 5.5vw, 60px)",
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      textAlign: "center",
                    }}
                  >
                    {word}
                  </div>
                ))}

                <div style={{ marginTop: 52, width: "100%", maxWidth: 400 }}>
                  <p style={{ fontSize: 11, color: "#555", letterSpacing: "0.04em", marginBottom: 28, lineHeight: 1.6, textAlign: "center" }}>
                    enter your email to reveal your constellation
                  </p>
                  <form onSubmit={handleWaitlist}>
                    <div style={{ marginBottom: 14 }}>
                      <input
                        type="text"
                        placeholder="your name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        style={inputStyle}
                        autoComplete="name"
                      />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                      <input
                        type="email"
                        placeholder="your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={inputStyle}
                        autoComplete="email"
                      />
                    </div>
                    {waitlistError && <p style={{ fontSize: 11, color: "#999", marginBottom: 12 }}>{waitlistError}</p>}
                    <button type="submit" style={{ ...btnStyle, width: "100%", textAlign: "center" }}>
                      reveal my constellation →
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ── RESULTS ──────────────────────────────────────────────────── */}
            {step === "results" && (
              <div className="results-layout fade-up">
                <div>
                  <p style={{ fontSize: 11, letterSpacing: "0.14em", color: "#999", marginBottom: 20, textTransform: "uppercase" }}>
                    your style is
                  </p>
                  {styleWords.map((word, i) => (
                    <div
                      key={word}
                      className="word-reveal"
                      style={{
                        animationDelay: `${i * 0.22}s`,
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: "italic",
                        fontWeight: 400,
                        fontSize: "clamp(38px, 5.5vw, 60px)",
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {word}
                    </div>
                  ))}

                  <div style={{ marginTop: 52 }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.12em", color: "#aaa", marginBottom: 10, textTransform: "uppercase" }}>
                      you're on the list.
                    </p>
                    <p style={{ fontSize: 11, color: "#555", letterSpacing: "0.04em", lineHeight: 1.6, marginBottom: 28 }}>
                      We'll be in touch at {email}.
                    </p>
                    <button
                      onClick={handleShare}
                      disabled={sharing}
                      style={{ ...btnStyle, opacity: sharing ? 0.5 : 1 }}
                    >
                      {sharing ? "saving..." : "share →"}
                    </button>
                    <button
                      onClick={() => setStep("home")}
                      style={{ background: "none", border: "none", color: "#555", fontSize: 11, letterSpacing: "0.08em", marginTop: 20, padding: 0, cursor: "pointer", display: "block" }}
                    >
                      ← Back to home
                    </button>
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: 10, letterSpacing: "0.12em", color: "#bbb", marginBottom: 14, textTransform: "uppercase" }}>
                    in the constellation of taste
                  </p>
                  <Constellation highlightedWords={styleWords} />
                </div>
              </div>
            )}

          </div>

      </div>
    </>
  );
}
