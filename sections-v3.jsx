// dakotastraub.com v3 — terminal/nerd sections
const { useEffect, useRef, useState } = React;

/* ───────── Starfighters background ───────── */
function Starfighters() {
  return (
    <div className="starfighters" aria-hidden="true">
      <div className="ship ship-a">▸</div>
      <div className="ship ship-b">◂</div>
      <div className="ship ship-c">▸</div>
      <div className="ship ship-d">◂</div>

      <div className="laser laser-a"></div>
      <div className="laser laser-b"></div>
      <div className="laser laser-c"></div>
      <div className="laser laser-d"></div>
    </div>
  );
}

/* ───────── Runner lane ───────── */
function RunnerLane() {
  return (
    <div className="runner-lane" aria-hidden="true">
      <div className="runner">ᕕ( ᐛ )ᕗ</div>
      <div className="obstacle obstacle-a">▣</div>
      <div className="obstacle obstacle-b">▲</div>
      <div className="obstacle obstacle-c">▥</div>
    </div>
  );
}

/* ───────── Status bar ───────── */
function StatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const h = String(d.getUTCHours()).padStart(2, "0");
      const m = String(d.getUTCMinutes()).padStart(2, "0");
      const s = String(d.getUTCSeconds()).padStart(2, "0");
      setTime(`${h}:${m}:${s} UTC`);
    };

    fmt();
    const t = setInterval(fmt, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="statusbar">
      <div><span className="sb-mark">●</span> dakotastraub.com</div>
      <div className="sb-hide-sm">v3.0.0-nerd</div>
      <div className="sb-hide-sm">node: kentucky-01</div>
      <div className="sb-spacer"></div>
      <div className="sb-hide-sm"><span className="live-dot"></span> taking clients</div>
      <div className="sb-time">{time}</div>
    </div>
  );
}

/* ───────── Nav ───────── */
function Nav() {
  return (
    <nav className="nav">
      <a href="#top" className="nav-mark">
        <span className="prompt">~/</span>dakota<span className="cursor"></span>
      </a>

      <div className="nav-links">
        <a href="#about">about</a>
        <a href="#services">services</a>
        <a href="#work">projects</a>
        <a href="#stack">stack</a>
        <a href="#resume">resume</a>
        <a href="#contact">contact</a>
      </div>

      <a href="#contact" className="nav-cta">./hire-me.sh</a>
    </nav>
  );
}

/* ───────── Hero ───────── */
function BootLog() {
  const lines = [
    { ts: "[00.000]", lvl: "ok", msg: "boot: dakotastraub.com / kernel up" },
    { ts: "[00.012]", lvl: "info", msg: "loading services: web · seo · ads · brand" },
    { ts: "[00.034]", lvl: "ok", msg: "auth: dakota_straub@operator [verified]" },
    { ts: "[00.072]", lvl: "warn", msg: "queue: accepting 2 freelance slots" },
    { ts: "[00.091]", lvl: "ok", msg: "ready. waiting for input ▌" },
  ];

  const [shown, setShown] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setShown(s => Math.min(s + 1, lines.length));
    }, 350);

    return () => clearInterval(t);
  }, []);

  return (
    <div className="boot-log">
      {lines.slice(0, shown).map((l, i) => (
        <div className="line" key={i}>
          <span className="ts">{l.ts}</span>
          <span className={`lvl-${l.lvl}`}>[{l.lvl.toUpperCase()}]</span>
          <span>{l.msg}</span>
        </div>
      ))}
    </div>
  );
}

function SysInfo() {
  return (
    <div className="sysinfo">
      <div className="sysinfo-head">
        <div className="dots"><i /><i /><i /></div>
        <div className="title">~/operator/dakota.profile</div>
      </div>

      <div className="sysinfo-body">
        <div className="sysinfo-portrait">
          <img src="headshot.png" alt="Dakota Straub" />
        </div>

        <div className="sysinfo-fields">
          <div className="sysinfo-row"><span className="k">user</span><span className="v">dakota_straub</span></div>
          <div className="sysinfo-row"><span className="k">role</span><span className="v">freelance / ops</span></div>
          <div className="sysinfo-row"><span className="k">host</span><span className="v">louisville-ky</span></div>
          <div className="sysinfo-row"><span className="k">status</span><span className="v">online · taking work</span></div>
          <div className="sysinfo-divider">─────────────────────</div>
          <div className="sysinfo-row"><span className="k">stack</span><span className="v">web · seo · paid</span></div>
          <div className="sysinfo-row"><span className="k">since</span><span className="v">2020</span></div>
        </div>
      </div>

      <div className="sysinfo-bars">
        <div className="sysinfo-bar">
          <div className="row"><span>cpu / focus</span><span>92%</span></div>
          <div className="track"><div className="fill" style={{ width: "92%" }}></div></div>
        </div>

        <div className="sysinfo-bar">
          <div className="row"><span>uptime / yrs in tech</span><span>5+</span></div>
          <div className="track"><div className="fill" style={{ width: "70%" }}></div></div>
        </div>

        <div className="sysinfo-bar">
          <div className="row"><span>queue / open slots</span><span>2/4</span></div>
          <div className="track"><div className="fill" style={{ width: "50%", background: "var(--amber)" }}></div></div>
        </div>
      </div>

      <div className="sysinfo-foot">
        <span>$ uname -a</span>
        <span>OK</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div>
        <BootLog />

        <div className="hero-comment">
          name = "Dakota Straub" · stack = ["web", "seo", "paid"]
        </div>

        <h1>
          <span className="tag">$</span> build_websites <span className="ascii-arrow">→</span><br />
          rank_them <span className="ascii-arrow">→</span><br />
          run_the_ads<span style={{ color: "var(--green)" }}>;</span>
        </h1>

        <p className="hero-summary">
          Freelance web designer + digital marketer based in Louisville, KY.
          I ship <span className="key">fast websites</span>, dial in <span className="key">targeted SEO</span>,
          and run <span className="key">paid campaigns</span> on Google &amp; Meta — so customers actually find what
          you're building.
        </p>

        <div className="hero-cta">
          <a className="btn btn-primary" href="#contact">start_project</a>
          <a className="btn" href="#resume">cat resume.md</a>
          <a className="btn" href="#work">ls ./projects</a>
        </div>

        <div style={{ marginTop: 22, fontSize: 11.5, color: "var(--muted)" }}>
          tip: press <span className="kbd">↓</span> to scroll, or <span className="kbd">⌘</span>+<span className="kbd">k</span> for nothing in particular
        </div>
      </div>

      <SysInfo />

      <RunnerLane />
    </section>
  );
}

function AsciiDivider() {
  return (
    <div className="ascii-divider">
      ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
    </div>
  );
}

/* ───────── About ───────── */
function About() {
  return (
    <section id="about">
      <div className="wrap">
        <div className="section-tag">
          <span className="num">[01]</span><span>about / readme.md</span>
          <span className="line"></span><span className="meta">last updated: 2026</span>
        </div>

        <div className="about-grid">
          <div>
            <h2>// the website is step one.</h2>

            <p style={{ marginTop: 24 }}>
              Most small businesses don't need a more complicated website. They need a
              clean one that loads fast, says the right things, and shows up when someone
              in their neighborhood searches for what they offer.
            </p>

            <p>
              That's what I do. I <span className="green">design</span> and <span className="green">build</span> the site,
              dial in the <span className="green">SEO</span>, and run <span className="green">paid campaigns</span> on
              Google and Meta — so the traffic shows up too.
            </p>

            <p>
              I've spent years inside ops teams, retail floors, and engineering rooms — at Apple,
              KFC, Humana, and digital agencies — which means I think about your business,
              not just your homepage.
            </p>
          </div>

          <div className="tree">
            <div className="head">$ tree ~/dakota --depth=2</div>
            <pre>
{`dakota/
├── `}<span className="dir">work/</span>{`
│   ├── `}<span className="accent">websites.ts</span>{`        // primary
│   ├── `}<span className="accent">seo-programs.ts</span>{`    // recurring
│   ├── `}<span className="accent">paid-ads.ts</span>{`        // monthly retainer
│   └── `}<span className="file">brand-systems.ts</span>{`
├── `}<span className="dir">history/</span>{`
│   ├── `}<span className="file">apple.log</span>{`
│   ├── `}<span className="file">humana.log</span>{`
│   ├── `}<span className="file">kfc-sre.log</span>{`
│   └── `}<span className="file">sig-digital.log</span>{`
├── `}<span className="dir">certs/</span>{`
│   ├── `}<span className="file">comptia-a+</span>{`
│   ├── `}<span className="file">comptia-net+</span>{`
│   └── `}<span className="file">comptia-sec+</span>{`
└── `}<span className="accent">README.md</span>
            }
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Services ───────── */
function Services() {
  const cmds = [
    {
      num: "01",
      name: "build",
      flag: "--site",
      desc: "Custom websites, landing pages, e-commerce. Built fast, designed to convert, hosted somewhere that doesn't fall over.",
      tags: ["custom design", "responsive", "cms", "fast hosting"],
    },
    {
      num: "02",
      name: "rank",
      flag: "--seo",
      desc: "Local + national SEO. Technical fixes, keyword strategy, on-page work, and content that compounds.",
      tags: ["local seo", "technical", "content", "analytics"],
    },
    {
      num: "03",
      name: "ads",
      flag: "--paid",
      desc: "Google Search, Performance Max, Meta. Real campaigns with real reporting — not just spend with a screenshot.",
      tags: ["google ads", "meta ads", "reporting", "tracking"],
    },
    {
      num: "04",
      name: "brand",
      flag: "--identity",
      desc: "Logo, palette, typography, and the site that ties it all together. So your business looks like itself everywhere.",
      tags: ["identity", "voice", "site systems"],
    },
  ];

  return (
    <section id="services">
      <div className="wrap">
        <div className="section-tag">
          <span className="num">[02]</span><span>services / man pages</span>
          <span className="line"></span><span className="meta">$ man dakota</span>
        </div>

        <h2>// available commands</h2>

        <div className="cmd-list">
          {cmds.map(c => (
            <div className="cmd-row" key={c.num}>
              <div className="cmd-num">{c.num}</div>
              <div className="cmd-name">{c.name} <span className="flag">{c.flag}</span></div>
              <div>
                <div className="cmd-desc">{c.desc}</div>
                <div className="cmd-tags">
                  {c.tags.map(t => <span key={t}>{t}</span>)}
                </div>
              </div>
              <div className="cmd-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Projects ───────── */
function ProjThumb({ kind }) {
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%" }}>
      <rect width="400" height="250" fill="#0f1411" />
      <rect x="30" y="30" width="340" height="190" rx="6" fill="#0a0e0c" stroke="#1f2a25" />
      <text x="48" y="60" fontFamily="JetBrains Mono" fontSize="11" fill="#7ee787">
        {kind === "site" ? "$ ./build-site" : kind === "seo" ? "$ ./rank-tracker" : kind === "ads" ? "$ ./campaigns" : "$ ./brand-system"}
      </text>
      <line x1="48" y1="76" x2="350" y2="76" stroke="#1f2a25" />
      <rect x="48" y="100" width="160" height="10" rx="2" fill="#7ee787" />
      <rect x="48" y="122" width="230" height="8" rx="2" fill="#2d3b34" />
      <rect x="48" y="140" width="190" height="8" rx="2" fill="#2d3b34" />
      <rect x="48" y="174" width="90" height="24" rx="3" fill="#7ee787" opacity="0.85" />
      <rect x="250" y="100" width="78" height="78" rx="6" fill="#7ee787" opacity="0.16" stroke="#7ee787" />
    </svg>
  );
}

function Projects() {
  const items = [
    {
      id: "PRJ_001",
      title: "Local business websites",
      kind: "site",
      badge: "ACTIVE",
      desc: "Custom marketing sites for small businesses. Design, build, copy, launch.",
      stats: [["sites_shipped", "12+"], ["avg_lighthouse", "98"], ["timeline", "2-4w"]],
    },
    {
      id: "PRJ_002",
      title: "Targeted SEO programs",
      kind: "seo",
      badge: "RECURRING",
      desc: "Local + national programs. Technical audits, keyword work, content systems.",
      stats: [["clients", "ongoing"], ["traffic_lift", "2-5×"], ["report", "monthly"]],
    },
    {
      id: "PRJ_003",
      title: "Paid ad campaigns",
      kind: "ads",
      badge: "RUNNING",
      desc: "Google Search, Performance Max, Meta. Built around real conversion goals.",
      stats: [["ad_spend_managed", "6-fig"], ["avg_roas", "3.8×"], ["channels", "G+M"]],
    },
    {
      id: "PRJ_004",
      title: "Brand identity systems",
      kind: "brand",
      badge: "DESIGN",
      desc: "Logo, palette, typography, and the site that ties it together.",
      stats: [["deliverables", "full"], ["revisions", "incl"], ["timeline", "3-6w"]],
    },
  ];

  return (
    <section id="work">
      <div className="wrap">
        <div className="section-tag">
          <span className="num">[03]</span><span>projects / ./projects</span>
          <span className="line"></span><span className="meta">$ ls -la</span>
        </div>

        <h2>// recent work + ongoing engagements</h2>

        <div className="proj-grid">
          {items.map(p => (
            <article className="proj-card" key={p.id}>
              <div className="proj-head">
                <span className="id">{p.id}</span>
                <span className="badge">{p.badge}</span>
              </div>

              <div className="proj-thumb"><ProjThumb kind={p.kind} /></div>

              <div className="proj-body">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>

                <div className="proj-stats">
                  {p.stats.map(([k, v]) => (
                    <div key={k}><div>{k}</div><div className="v">{v}</div></div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Stack ───────── */
function Stack() {
  const cells = [
    { cat: "frontend", items: ["React", "TypeScript", "Tailwind", "Vanilla JS", "HTML/CSS"] },
    { cat: "backend / infra", items: ["Node", "Cloud (AWS/GCP)", "SQL", "REST APIs", "Webhooks"] },
    { cat: "marketing", items: ["Google Ads", "Meta Ads", "GA4 / GTM", "SEO tools", "CMS"] },
    { cat: "ops & systems", items: ["Agile / SCRUM", "SRE practices", "Palo Alto", "Monitoring", "Process design"] },
  ];

  return (
    <section id="stack">
      <div className="wrap">
        <div className="section-tag">
          <span className="num">[04]</span><span>stack / dependencies.json</span>
          <span className="line"></span><span className="meta">$ cat package.json</span>
        </div>

        <h2>// the toolkit</h2>

        <div className="stack-grid">
          {cells.map(c => (
            <div className="stack-cell" key={c.cat}>
              <div className="cat">// {c.cat}</div>
              <ul>
                {c.items.map(i => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Resume ───────── */
function Resume() {
  return (
    <section className="resume" id="resume">
      <div className="wrap">
        <div className="section-tag">
          <span className="num">[05]</span><span>resume / resume.md</span>
          <span className="line"></span><span className="meta">$ cat resume.md</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 16 }}>
          <h2>// for recruiters & hiring managers</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a className="btn" href="Dakota Straub Resume.pdf" target="_blank" rel="noreferrer">download.pdf</a>
            <a className="btn btn-primary" href="https://www.linkedin.com/in/dakotastraub/" target="_blank" rel="noreferrer">linkedin</a>
          </div>
        </div>

        <div className="resume-doc">
          <aside className="resume-side">
            <h3>dakota_straub</h3>
            <div className="role">// operations · architecture · web</div>

            <div className="block">
              <div className="lbl">// contact</div>
              <ul>
                <li className="row"><span>email</span><a href="mailto:dakotastraub@outlook.com">dakotastraub@…</a></li>
                <li className="row"><span>phone</span><span>502.445.5589</span></li>
                <li className="row"><span>based</span><span>Louisville, KY</span></li>
                <li className="row"><span>linkedin</span><a href="https://www.linkedin.com/in/dakotastraub/" target="_blank" rel="noreferrer">in/dakota…</a></li>
              </ul>
            </div>

            <div className="block">
              <div className="lbl">// core skills</div>
              <ul>
                <li>project & ops mgmt</li>
                <li>strategic planning</li>
                <li>process improvement</li>
                <li>cross-functional leadership</li>
                <li>cloud architecture</li>
                <li>web · seo · paid ads</li>
              </ul>
            </div>
          </aside>

          <div className="resume-main">
            <h4>// summary</h4>
            <p className="resume-summary">
              Operations professional with a strong background in managing complex projects and
              driving operational excellence. Collaborative, dependable, adaptable. Proven skills
              in strategic planning and team leadership.
            </p>

            <h4>// work history</h4>

            {[
              ["11/2024 — Current", "Director of Operations & Client Experience", "Spear Crest Digital, Louisville, KY"],
              ["01/2023 — 12/2024", "Senior Solutions Architect", "SIG Digital"],
              ["02/2022 — 01/2023", "Site Reliability Engineer", "KFC"],
              ["07/2021 — 02/2022", "Network Engineer (Contract)", "Humana"],
              ["07/2020 — 07/2021", "Tech Sales Associate", "Apple"],
            ].map(([yr, title, co]) => (
              <div className="resume-job" key={title}>
                <div className="resume-job-head">
                  <div>
                    <div className="title">{title}</div>
                    <div className="co">{co}</div>
                  </div>
                  <div className="yr">{yr}</div>
                </div>
                <ul>
                  <li>Managed complex projects and improved operational workflows.</li>
                  <li>Collaborated across teams to ship better systems and customer experiences.</li>
                  <li>Used technical and strategic planning skills to support business growth.</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Vision ───────── */
function Vision() {
  const items = [
    {
      lbl: "// 01_mission",
      title: "Help small businesses look like themselves",
      desc: "Most are amazing in person and invisible online. I close that gap one site at a time.",
    },
    {
      lbl: "// 02_growth",
      title: "Make growth feel boring (good)",
      desc: "Predictable, compounding SEO and ads. No mystery dashboards. Clear plans, clear reports.",
    },
    {
      lbl: "// 03_studio",
      title: "Build a small, sharp studio",
      desc: "Fewer clients, deeper work. The kind of partnership where I'm the first call.",
    },
  ];

  return (
    <section id="vision">
      <div className="wrap">
        <div className="section-tag">
          <span className="num">[06]</span><span>vision / TODO.md</span>
          <span className="line"></span><span className="meta">// mission file</span>
        </div>

        <h2>// where this is headed</h2>

        <div className="panel-grid">
          {items.map(i => (
            <div className="panel" key={i.lbl}>
              <div className="lbl">{i.lbl}</div>
              <h3>{i.title}</h3>
              <p>{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Contact ───────── */
function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <div className="section-tag">
          <span className="num">[07]</span><span>contact / open a session</span>
          <span className="line"></span><span className="meta">$ ssh dakota@…</span>
        </div>

        <h2 style={{ maxWidth: 720 }}>// got an idea? let's build it.</h2>

        <p style={{ maxWidth: 540, marginTop: 16, color: "var(--fg-2)" }}>
          Open for new freelance projects, contract work, and full-time conversations.
          Tell me what you're working on — I respond fast.
        </p>

        <div className="contact-shell">
          <div className="terminal">
            <div className="terminal-head">
              <div className="dots"><i /><i /><i /></div>
              <div>~/contact — zsh</div>
            </div>

            <div className="terminal-body">
              <div className="line cmd"><span className="prompt">$</span><span>./connect --user=you</span></div>
              <div className="line out"><span><span className="k">→</span> initializing handshake…</span></div>
              <div className="line out"><span><span className="k">→</span> route: <a href="mailto:dakotastraub@outlook.com" style={{ color: "var(--green)", borderBottom: "1px dashed currentColor" }}>dakotastraub@outlook.com</a></span></div>
              <div className="line out"><span><span className="k">→</span> fallback: <a href="tel:5024455589" style={{ color: "var(--green)", borderBottom: "1px dashed currentColor" }}>+1 502.445.5589</a></span></div>
              <div className="line empty"></div>
              <div className="line cmd"><span className="prompt">$</span><span>cat next-steps.txt</span></div>
              <div className="line out">1. tell me about your project</div>
              <div className="line out">2. i scope, you approve</div>
              <div className="line out">3. we ship</div>
            </div>
          </div>

          <div className="contact-side">
            {[
              { k: "email", v: "dakotastraub@outlook.com", href: "mailto:dakotastraub@outlook.com" },
              { k: "linkedin", v: "in/dakotastraub", href: "https://www.linkedin.com/in/dakotastraub/" },
              { k: "instagram", v: "@dakotastraub", href: "https://www.instagram.com/dakotastraub/" },
              { k: "facebook", v: "dakota.straub.2025", href: "https://www.facebook.com/dakota.straub.2025" },
              { k: "phone", v: "502.445.5589", href: "tel:5024455589" },
              { k: "location", v: "Louisville, KY", href: "#" },
            ].map(r => (
              <a className="contact-row" key={r.k} href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                <span className="k">{r.k}</span>
                <span className="v">{r.v}</span>
                <span className="arrow">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <span>© {new Date().getFullYear()} dakota_straub · Louisville, KY · all rights reserved</span>
      <span className="pulse"><i></i> system: nominal · uptime: 100%</span>
    </footer>
  );
}

Object.assign(window, {
  Starfighters,
  StatusBar,
  Nav,
  Hero,
  AsciiDivider,
  About,
  Services,
  Projects,
  Stack,
  Resume,
  Vision,
  Contact,
  Footer,
});