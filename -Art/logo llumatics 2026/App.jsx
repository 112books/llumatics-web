/**
 * Llumàtics — escola de fotografia química/anàloga.
 * Variacions del logotip: versió rodona (Instagram/web) i horitzontal.
 *
 * Fonts de la marca: system-ui (sans), Courier New (tècnic, "f/8").
 * Paleta: cambra fosca (fons fosc) + llum àmber.
 */

/* ---- Tweakes EDITMODE ---- */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#F2A64F",
  "logoSet": "all",
  "bgMode": "dark"
}/*EDITMODE-END*/;

const { accentColor, logoSet, bgMode } = TWEAK_DEFAULTS;

/* =========================================================
   Símbols de marca: diafragma f/8 i paraula "Llumàtics"
   ========================================================= */

/**
 * Diafragma de 8 aspes formant un octàgon central (obertura f/8).
 * Dins de l'octàgon hi ve la marca "f8".
 */
const Aperture = ({
  size = 100,
  bladeColor = "#262626",
  accentColor = "#F2A64F",
  mark = "f8",
}) => {
  const n = 8;
  const cx = 50,
    cy = 50,
    R = 46,
    r = 15,
    rShrunk = 12.5;

  let ring = [];
  let open = [];
  let bevel = [];
  for (let i = 0; i < n; i++) {
    const a = (i * 45) * (Math.PI / 180);
    const b = ((i + 1) * 45) * (Math.PI / 180);
    const ax = cx + R * Math.cos(a),
      ay = cy + R * Math.sin(a);
    const bx = cx + R * Math.cos(b),
      by = cy + R * Math.sin(b);
    const ix = cx + r * Math.cos(a),
      iy = cy + r * Math.sin(a);
    const jx = cx + r * Math.cos(b),
      jy = cy + r * Math.sin(b);
    const sx = cx + rShrunk * Math.cos(a),
      sy = cy + rShrunk * Math.sin(a);
    const tx = cx + rShrunk * Math.cos(b),
      ty = cy + rShrunk * Math.sin(b);
    // anella de l'octàgon (una aspa)
    ring.push(`${ax},${ay}`, `${bx},${by}`, `${jx},${jy}`, `${ix},${iy}`);
    // vèrtexs de l'obertura
    open.push(`${ix},${iy}`);
    // vora il·linada de l'obertura
    bevel.push(`${ix},${iy}`, `${jx},${jy}`, `${tx},${ty}`, `${sx},${sy}`);
  }

  const viewBox = "0 0 100 100";

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Diafragma f/8 de Llumàtics"
    >
      <defs>
        <linearGradient id="bladeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bladeColor} />
          <stop offset="100%" stopColor={shade(bladeColor, 22)} />
        </linearGradient>
        <linearGradient id="bevelGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={shade(bladeColor, 34)} />
          <stop offset="100%" stopColor={bladeColor} />
        </linearGradient>
      </defs>
      <g transform="rotate(-90 50 50)">
        {/* Aspes */}
        <polygon points={ring.join(" ")} fill="url(#bladeGrad)" />
        {/* Vora il·luminada (bevel) de l'obertura */}
        <polygon points={bevel.join(" ")} fill="url(#bevelGrad)" />
        {/* Límits de les ases (sompes radials) */}
        {Array.from({ length: n }).map((_, i) => {
          const a = (i * 45) * (Math.PI / 180);
          const aNext = ((i + 1) * 45) * (Math.PI / 180);
          const mx = cx + r * Math.cos(a),
            my = cy + r * Math.sin(a);
          const mx2 = cx + r * Math.cos(aNext),
            my2 = cy + r * Math.sin(aNext);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={mx}
              y2={my}
              stroke={shade(bladeColor, 50)}
              strokeWidth="0.6"
            />
          );
        })}
      </g>
      {/* L'obertura central (cambra fosca) */}
      <polygon points={open.join(" ")} fill="#0D0D0F" />
      {/* Marca f8 tècnica dins l'obertura */}
      <text
        x={cx}
        y={cy + 4.5}
        textAnchor="middle"
        fill={accentColor}
        fontFamily="'Courier New', monospace"
        fontSize="34"
        fontWeight="700"
        letterSpacing="-1"
      >
        {mark}
      </text>
    </svg>
  );
};

/** Aplica un escalfament/fredor simple a un hex. */
function shade(hex, amount) {
  let h = hex.replace("#", "");
  let r = parseInt(h.slice(0, 2), 16);
  let g = parseInt(h.slice(2, 4), 16);
  let b = parseInt(h.slice(4, 6), 16);
  r = Math.min(255, Math.max(0, r + amount));
  g = Math.min(255, Math.max(0, g + amount));
  b = Math.min(255, Math.max(0, b + amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/** Logotip de paraula "Llumàtics". La "L" rep l'accent. */
const Wordmark = ({
  accentColor = "#F2A64F",
  textColor = "#F0F0F0",
  size = 34,
}) => (
  <svg
    width="auto"
    viewBox="0 0 220 44"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Llumàtics"
    style={{ height: size }}
  >
    <text
      x="0"
      y={size * 0.78}
      fill={textColor}
      fontFamily="system-ui"
      fontSize={size}
      fontWeight={700}
      letterSpacing="-0.02em"
    >
      <tSpan fill={accentColor}>L</tSpan>
      <tSpan fill={textColor}>lumàtics</tSpan>
    </text>
  </svg>
);

/* =========================================================
   Variants del logotip
   ========================================================= */

/** V1 — Medalló rodó (Instagram / Web).
 *   Cercle, "Llumàtics" a dalt, diafragma al centre, subtítol a baix. */
const LogoRoundBadge = ({ accentColor, textColor, muted, bg }) => {
  const text = "LLUMÀTICS";
  return (
    <svg
      viewBox="0 0 240 240"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Llumàtics – medalló rodó"
    >
      <defs>
        <clipPath id="circleClip">
          <circle cx="120" cy="120" r="116" />
        </clipPath>
        {/* arcs per al text corbel·lat */}
        <path
          id="topArc"
          d="M60,118 A60,60 0 0 1 180,118"
          fill="transparent"
        />
        <path
          id="botArc"
          d="M180,122 A60,60 0 0 1 60,122"
          fill="transparent"
        />
      </defs>
      {/* fons del medalló */}
      <circle cx="120" cy="120" r="116" fill={bg.surface} />
      <circle
        cx="120"
        cy="120"
        r="116"
        fill="none"
        stroke={accentColor}
        strokeWidth="3"
        opacity="0.55"
      />
      {/* text superior corbel·lat */}
      <g clipPath="url(#circleClip)">
        <text
          x="120"
          y="36"
          textAnchor="middle"
          fill={textColor}
          fontFamily="system-ui"
          fontSize="26"
          fontWeight={700}
          letterSpacing="-0.5"
        >
          <textPath href="#topArc" startOffset="50%" textAnchor="middle">
            {text}
          </textPath>
        </text>
        {/* text inferior corbel·lat */}
        <text
          x="120"
          y="212"
          textAnchor="middle"
          fill={muted}
          fontFamily="system-ui"
          fontSize="13"
          fontWeight={400}
          letterSpacing="1"
        >
          <textPath href="#botArc" startOffset="50%" textAnchor="middle">
            ESCOLA DE FOTOGRAFIA QUÍMICA
          </textPath>
        </text>
      </g>
      {/* cercle d'eliminat (crema fosca) */}
      <rect
        x="120"
        y="72"
        width="140"
        height="140"
        fill={bg.page}
        clipPath="url(#circleClip)"
        opacity="0.0"
      />
      {/* diafragma f/8 centre */}
      <g transform="translate(120 120)">
        <Aperture
          size={136}
          bladeColor="#262626"
          accentColor={accentColor}
          mark="f8"
        />
      </g>
    </svg>
  );
};

/** V2 — Icona rodona (avatar/faviorit).
 *   Només el diafragma f/8 dins d'un cercle. */
const LogoRoundIcon = ({ accentColor }) => (
  <svg
    viewBox="0 0 160 160"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Llumàtics – icona"
  >
    <circle cx="80" cy="80" r="78" fill="#171717" />
    <circle
      cx="80"
      cy="80"
      r="78"
      fill="none"
      stroke={accentColor}
      strokeWidth="2"
      opacity="0.35"
    />
    <g transform="translate(80 80)">
      <Aperture size={124} bladeColor="#2A2A2A" accentColor={accentColor} />
    </g>
  </svg>
);

/** V3 — Horitzontal clàssic. Icona + paraula + subtítol. */
const LogoHorizontalClassic = ({ accentColor, textColor, muted }) => (
  <svg
    viewBox="0 0 380 72"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Llumàtics – logotip horitzontal"
  >
    <g transform="translate(0 0)">
      <Aperture
        size={72}
        bladeColor="#262626"
        accentColor={accentColor}
        mark="f8"
      />
    </g>
    <text
      x="88"
      y="42"
      fill={textColor}
      fontFamily="system-ui"
      fontSize="34"
      fontWeight={700}
      letterSpacing="-0.02em"
    >
      <tSpan fill={accentColor}>L</tSpan>
      <tSpan fill={textColor}>lumàtics</tSpan>
    </text>
    <text
      x="88"
      y="62"
      fill={muted}
      fontFamily="system-ui"
      fontSize="12"
      fontWeight={400}
      letterSpacing="1"
    >
      escola de fotografia química
    </text>
  </svg>
);

/** V4 — Horitzontal tipogràfic. Paraula gran + "f/8" com a senzill. */
const LogoHorizontalTypo = ({ accentColor, textColor, muted }) => (
  <svg
    viewBox="0 0 400 80"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Llumàtics – logotip tipogràfic horitzontal"
  >
    <text
      x="0"
      y="52"
      fill={textColor}
      fontFamily="system-ui"
      fontSize="42"
      fontWeight={700}
      letterSpacing="-0.03em"
    >
      <tSpan fill={accentColor}>L</tSpan>
      <tSpan fill={textColor}>lumàtics</tSpan>
    </text>
    <g transform="translate(338 20)">
      <Aperture size={52} bladeColor="#262626" accentColor={accentColor} />
    </g>
    <text
      x="0"
      y="76"
      fill={muted}
      fontFamily="system-ui"
      fontSize="12"
      fontWeight={400}
      letterSpacing="1"
    >
      escola de fotografia química
    </text>
  </svg>
);

/* =========================================================
   Components de la pàgina de mostra
   ========================================================= */

const bg = {
  page: "#0D0D0F",
  surface: "#171717",
  // fons clar per a proves de versatl·litat
  light: "#F0F0F0",
  lightText: "#0D0D0F",
  // fons ambient (ambient light)
  amber: "#F2A64F",
  amberText: "#0D0D0F",
};

const muted = "#9AA0A6";
const textColor = "#F0F0F0";

/** Targetó que mostra un logotip sobre diversos fons. */
const LogoCard = ({ title, desc, children, accentColor }) => {
  const swatches = [
    { name: "cambra fosca", bg: bg.page, fg: bg.surface, labelColor: textColor },
    { name: "paper clar", bg: bg.light, fg: bg.light, labelColor: bg.lightText },
    { name: "sobre llum", bg: bg.amber, fg: "#171717", labelColor: bg.amberText },
  ];
  return (
    <div style={{ background: bg.surface, borderRadius: 16, padding: 20, boxShadow: "0 10px 30px rgba(0,0,0,.4)" }}>
      <h3 style={{ margin: "0 0 4px", color: textColor, fontFamily: "system-ui", fontSize: 16, fontWeight: 700 }}>
        {title}
      </h3>
      <p style={{ margin: "0 0 14px", color: muted, fontFamily: "system-ui", fontSize: 13 }}>{desc}</p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {swatches.map((s) => (
          <div
            key={s.name}
            style={{
              width: 176,
              height: 176,
              borderRadius: 14,
              background: s.bg,
              display: "grid",
              placeItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
            aria-label={`fons ${s.name}`}
          >
            {children(s)}
            <span
              style={{
                position: "absolute",
                bottom: 6,
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "system-ui",
                fontSize: 10,
                color: s.labelColor,
                opacity: 0.8,
              }}
            >
              {s.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const logos = [
  {
    id: "round-badge",
    kind: "rodona",
    title: "Medalló rodó · Instagram / Web",
    desc: "Cercle amb «Llumàtics», diafragma f/8 central i subtítol inferior. Versió quadrada 1:1.",
    render: (s) => (
      <LogoRoundBadge bg={s} accentColor={accentColor} textColor={textColor} muted={muted} />
    ),
  },
  {
    id: "round-icon",
    kind: "rodona",
    title: "Icona rodona",
    desc: "Només el diafragma f/8. Ideal per a favicon, avatar i app icon.",
    render: (s) => <LogoRoundIcon accentColor={accentColor} />,
  },
  {
    id: "horizontal-classic",
    kind: "horitzontal",
    title: "Horitzontal clàssic",
    desc: "Icona + logotip de paraula + subtítol. Ús en capçaleres i documents.",
    render: (s) => (
      <LogoHorizontalClassic accentColor={accentColor} textColor={textColor} muted={muted} />
    ),
  },
  {
    id: "horizontal-typo",
    kind: "horitzontal",
    title: "Horitzontal tipogràfic",
    desc: "Paraula gran amb el «L» de llum + diafragma f/8 minúscul. Elegància editorial.",
    render: (s) => (
      <LogoHorizontalTypo accentColor={accentColor} textColor={textColor} muted={muted} />
    ),
  },
];

const App = () => {
  const [active, setActive] = useState("all");
  const filtered =
    active === "all" ? logos : logos.filter((l) => l.kind === active);

  return (
    <div style={{ minHeight: "100vh", background: bg.page, color: textColor, padding: 32 }}>
      <header style={{ maxWidth: 1000, margin: "0 auto 32px" }}>
        <h1 style={{ margin: 0, fontFamily: "system-ui", fontSize: 32, fontWeight: 700 }}>
          <span style={{ color: accentColor }}>L</span>lumàtics
        </h1>
        <p style={{ margin: "6px 0 18px", color: muted, fontFamily: "system-ui", fontSize: 15 }}>
          Escola de fotografia química / anàloga — variacions de logotip
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["all", "rodona", "horitzontal"].map((k) => (
            <button
              key={k}
              onClick={() => setActive(k)}
              style={{
                fontFamily: "system-ui",
                fontSize: 13,
                fontWeight: active === k ? 600 : 400,
                padding: "8px 14px",
                borderRadius: 999,
                border: `1px solid ${active === k ? accentColor : "#333"}`,
                background: active === k ? "rgba(242,166,79,.15)" : "rgba(255,255,255,.04)",
                color: active === k ? accentColor : textColor,
                cursor: "pointer",
              }}
            >
              {k === "all" ? "Totes" : k === "rodona" ? "Rodones" : "Horitzontals"}
            </button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
        {filtered.length === 0 && (
          <p style={{ color: muted, fontFamily: "system-ui" }}>Cap variant per a aquesta filtra.</p>
        )}
        {filtered.map((logo) => (
          <LogoCard
            key={logo.id}
            title={logo.title}
            desc={logo.desc}
            accentColor={accentColor}
          >
            {(s) => logo.render(s)}
          </LogoCard>
        ))}
      </main>

      <footer style={{ maxWidth: 1000, margin: "40px auto 0", color: muted, fontFamily: "system-ui", fontSize: 12, textAlign: "center" }}>
        Variacions del logotip Llumàtics. Colors d'exemple: cambra fosca, paper clar, llum àmbar.
      </footer>
    </div>
  );
};

// pequeño ajust d'espaiat segons el número de columnes visibles
function colColsGap() {
  return "24px";
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
