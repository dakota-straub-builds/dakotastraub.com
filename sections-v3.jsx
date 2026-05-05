// dakotastraub.com v3
const { useEffect, useRef, useState } = React;

/* ═══════════════════════════════════════════════════════════════
   STARFIGHTERS — ships chase + shoot each other across the page
═══════════════════════════════════════════════════════════════ */
function Starfighters() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    const GREEN = "#7ee787", RED = "#ff7a7a";

    function drawShip(x, y, angle, color) {
      ctx.save();
      ctx.translate(x, y); ctx.rotate(angle);
      ctx.strokeStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 10; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(14,0); ctx.lineTo(-8,-6); ctx.lineTo(-5,0); ctx.lineTo(-8,6); ctx.closePath(); ctx.stroke();
      ctx.globalAlpha = 0.45;
      ctx.beginPath(); ctx.moveTo(-5,0); ctx.lineTo(-16,0); ctx.lineWidth = 1.5; ctx.stroke();
      ctx.globalAlpha = 1; ctx.restore();
    }

    function drawLaser(x, y, vx, vy, color) {
      ctx.save();
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-vx*4, y-vy*4);
      ctx.strokeStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 12; ctx.lineWidth = 2; ctx.stroke();
      ctx.restore();
    }

    function drawExplosion(x, y, p) {
      const r = p*34, a = 1-p;
      ctx.save();
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
      ctx.strokeStyle=`rgba(240,181,97,${a})`; ctx.shadowColor="#f0b561"; ctx.shadowBlur=20; ctx.lineWidth=2.5; ctx.stroke();
      ctx.restore();
    }

    function makeShip(team, i) {
      const g = team==="green";
      return {
        x: g ? 60+Math.random()*W*0.25 : W*0.75+Math.random()*W*0.2,
        y: 80+Math.random()*(H*0.65),
        vx: (0.6+Math.random()*0.8)*(g?1:-1),
        vy: (Math.random()-0.5)*0.6,
        angle: g?0:Math.PI, team, hp:3, alive:true,
        fireTimer: 30+Math.floor(Math.random()*80), respawnIn:0,
      };
    }

    const ships = [
      makeShip("green",0), makeShip("green",1), makeShip("green",2),
      makeShip("red",0),   makeShip("red",1),   makeShip("red",2),
    ];
    const lasers=[], explosions=[];

    function fire(ship) {
      const enemies = ships.filter(s=>s.team!==ship.team&&s.alive);
      if (!enemies.length) return;
      const target = enemies.reduce((b,s)=>Math.hypot(s.x-ship.x,s.y-ship.y)<Math.hypot(b.x-ship.x,b.y-ship.y)?s:b, enemies[0]);
      const SPEED=7, dist=Math.hypot(target.x-ship.x,target.y-ship.y)||1;
      const t=dist/SPEED, ax=target.x+target.vx*t, ay=target.y+target.vy*t;
      const d=Math.hypot(ax-ship.x,ay-ship.y)||1;
      lasers.push({ x:ship.x, y:ship.y, vx:(ax-ship.x)/d*SPEED, vy:(ay-ship.y)/d*SPEED, color:ship.team==="green"?GREEN:RED, owner:ship.team, life:65 });
    }

    let raf;
    function tick() {
      ctx.clearRect(0,0,W,H);
      for (const ship of ships) {
        if (!ship.alive) { ship.respawnIn--; if (ship.respawnIn<=0) Object.assign(ship, makeShip(ship.team, ships.indexOf(ship)%3)); continue; }
        const enemies = ships.filter(s=>s.team!==ship.team&&s.alive);
        if (enemies.length) {
          const target = enemies.reduce((b,s)=>Math.hypot(s.x-ship.x,s.y-ship.y)<Math.hypot(b.x-ship.x,b.y-ship.y)?s:b, enemies[0]);
          const dist=Math.hypot(target.x-ship.x,target.y-ship.y)||1;
          const force=dist>150?0.03:0.008;
          ship.vx+=(target.x-ship.x)/dist*force; ship.vy+=(target.y-ship.y)/dist*force;
          ship.angle=Math.atan2(ship.vy,ship.vx);
          ship.fireTimer--; if(ship.fireTimer<=0){ if(dist<600) fire(ship); ship.fireTimer=50+Math.floor(Math.random()*70); }
        }
        const spd=Math.hypot(ship.vx,ship.vy); if(spd>2.2){ship.vx=ship.vx/spd*2.2;ship.vy=ship.vy/spd*2.2;}
        ship.x+=ship.vx; ship.y+=ship.vy;
        if(ship.x<50) ship.vx+=0.5; if(ship.x>W-50) ship.vx-=0.5;
        if(ship.y<55) ship.vy+=0.5; if(ship.y>H*0.78) ship.vy-=0.5;
        drawShip(ship.x,ship.y,ship.angle,ship.team==="green"?GREEN:RED);
      }
      for(let i=lasers.length-1;i>=0;i--){
        const l=lasers[i]; l.x+=l.vx; l.y+=l.vy; l.life--;
        if(l.life<=0||l.x<-20||l.x>W+20||l.y<-20||l.y>H+20){lasers.splice(i,1);continue;}
        let hit=false;
        for(const ship of ships){
          if(!ship.alive||ship.team===l.owner) continue;
          if(Math.hypot(ship.x-l.x,ship.y-l.y)<14){
            ship.hp--; if(ship.hp<=0){explosions.push({x:ship.x,y:ship.y,t:0}); ship.alive=false; ship.respawnIn=120+Math.floor(Math.random()*80);}
            lasers.splice(i,1); hit=true; break;
          }
        }
        if(!hit) drawLaser(l.x,l.y,l.vx,l.vy,l.color);
      }
      for(let i=explosions.length-1;i>=0;i--){
        const e=explosions[i]; drawExplosion(e.x,e.y,e.t); e.t+=0.045; if(e.t>=1) explosions.splice(i,1);
      }
      raf=requestAnimationFrame(tick);
    }
    tick();
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize",onResize); };
  },[]);
  return <canvas ref={canvasRef} style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:1,opacity:0.6}}/>;
}

/* ═══════════════════════════════════════════════════════════════
   RUNNER — pure canvas mini-game, SPACE or tap to jump
═══════════════════════════════════════════════════════════════ */
function Runner() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = 100;
    window.addEventListener("resize", () => { W = canvas.width = canvas.offsetWidth; });

    const GROUND=H-28, CHAR_X=90, GRAVITY=0.55, JUMP_V=-11, OBS_SPD=3.2;
    const GREEN="#7ee787", AMBER="#f0b561", RED="#ff7a7a", MUTED="#5d6f66", DIM="#3d4a44";

    let charY=GROUND, velY=0, onGround=true, frame=0, frameTick=0;
    let obstacles=[], spawnT=160, dead=false, deadTimer=0, score=0, hi=0, raf;

    const jump = () => { if(onGround&&!dead){velY=JUMP_V;onGround=false;} };
    const onKey   = (e) => { if(e.code==="Space"){e.preventDefault();jump();} };
    const onTouch = ()  => jump();
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouch, {passive:true});

    const SPRITES = [
      ["^‿^"," | ","/\\ "],
      ["^‿^"," | ","| |"],
      ["^‿^"," | ","/ \\"],
      ["^‿^"," | ","\\ /"],
    ];
    const DEAD_S=["X_X"," | ","xxx"], JUMP_S=["^‿^"," | "," | "];

    function drawChar() {
      const rows=dead?DEAD_S:!onGround?JUMP_S:SPRITES[frame], color=dead?RED:GREEN;
      ctx.save();
      ctx.font=`13px "JetBrains Mono",monospace`; ctx.fillStyle=color; ctx.shadowColor=color; ctx.shadowBlur=dead?6:10; ctx.textAlign="center";
      for(let r=0;r<3;r++) ctx.fillText(rows[2-r], CHAR_X, charY-2-r*16);
      ctx.restore();
    }

    function drawObs(o) {
      const color=o.type===1?AMBER:GREEN, ch=o.type===0?"╥":o.type===1?"◆":"╥ ╥", size=o.type===0?22:o.type===1?18:16;
      ctx.save();
      ctx.font=`${size}px "JetBrains Mono",monospace`; ctx.fillStyle=color; ctx.shadowColor=color; ctx.shadowBlur=10; ctx.textAlign="center";
      ctx.fillText(ch, o.x, GROUND-2);
      ctx.restore();
    }

    function txt(str, x, y, color, size, align="left") {
      ctx.save(); ctx.font=`${size}px "JetBrains Mono",monospace`; ctx.fillStyle=color; ctx.textAlign=align; ctx.shadowBlur=0; ctx.fillText(str,x,y); ctx.restore();
    }

    function tick() {
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="rgba(6,14,9,0.88)"; ctx.fillRect(0,0,W,H);
      ctx.fillStyle="#2d3b34"; ctx.fillRect(0,GROUND+2,W,1);
      txt(`HI  ${String(hi).padStart(5,"0")}`, 16, 18, MUTED, 11);
      txt(String(score).padStart(5,"0"), 90, 18, GREEN, 11);
      txt("SPACE / tap to jump", W-16, 18, DIM, 10, "right");

      if(!dead){
        if(!onGround){ velY+=GRAVITY; charY+=velY; if(charY>=GROUND){charY=GROUND;velY=0;onGround=true;} }
        frameTick++; if(frameTick>=7){frame=(frame+1)%4;frameTick=0;}
        score++; if(score>hi) hi=score;
        spawnT--; if(spawnT<=0){ obstacles.push({x:W+40,type:Math.floor(Math.random()*3)}); spawnT=120+Math.floor(Math.random()*130); }
        obstacles.forEach(o=>o.x-=OBS_SPD);
        obstacles=obstacles.filter(o=>o.x>-60);
        for(const o of obstacles){
          const obsH=o.type===0?28:22;
          if(Math.abs(o.x-CHAR_X)<18&&charY>GROUND-obsH){dead=true;deadTimer=90;break;}
        }
      } else {
        deadTimer--;
        if(deadTimer<=0){dead=false;charY=GROUND;velY=0;onGround=true;obstacles=[];spawnT=160;score=0;}
        if(deadTimer%10<7){ ctx.save(); ctx.font=`11px "JetBrains Mono",monospace`; ctx.fillStyle=RED; ctx.shadowColor=RED; ctx.shadowBlur=8; ctx.textAlign="left"; ctx.fillText("GAME OVER — respawning...",CHAR_X+30,GROUND-18); ctx.restore(); }
      }
      obstacles.forEach(drawObs);
      drawChar();
      raf=requestAnimationFrame(tick);
    }
    raf=requestAnimationFrame(tick);
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("keydown",onKey); window.removeEventListener("touchstart",onTouch); };
  },[]);
  return <canvas ref={canvasRef} style={{position:"absolute",bottom:0,left:0,width:"100%",height:"100px",display:"block",zIndex:10,borderTop:"1px solid #1f2a25"}}/>;
}

/* ═══════════════════════════════════════════════════════════════
   STATUS BAR
═══════════════════════════════════════════════════════════════ */
function StatusBar() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      setTime(`${String(d.getUTCHours()).padStart(2,"0")}:${String(d.getUTCMinutes()).padStart(2,"0")}:${String(d.getUTCSeconds()).padStart(2,"0")} UTC`);
    };
    fmt(); const t = setInterval(fmt,1000); return ()=>clearInterval(t);
  },[]);
  return (
    <div className="statusbar">
      <div><span className="sb-mark">●</span> dakotastraub.com</div>
      <div className="sb-hide-sm">web · seo · paid ads</div>
      <div className="sb-hide-sm">louisville, ky</div>
      <div className="sb-spacer"></div>
      <div className="sb-hide-sm"><span className="live-dot"></span> taking clients</div>
      <div className="sb-time">{time}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════════════════ */
function Nav() {
  return (
    <nav className="nav">
      <a href="#top" className="nav-mark">Dakota Straub<span className="cursor"></span></a>
      <div className="nav-links">
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#work">Work</a>
        <a href="#stack">Stack</a>
        <a href="#resume">Resume</a>
        <a href="#contact">Contact</a>
      </div>
      <a href="#contact" className="nav-cta">Hire me</a>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════ */
function SysInfo() {
  return (
    <div className="sysinfo">
      <div className="sysinfo-head">
        <div className="dots"><i/><i/><i/></div>
        <div className="title">dakota.profile</div>
      </div>
      <div className="sysinfo-body">
        <div className="sysinfo-portrait">
          <img src="headshot.png" alt="Dakota Straub"/>
        </div>
        <div className="sysinfo-fields">
          <div className="sysinfo-row"><span className="k">Name</span><span className="v">Dakota Straub</span></div>
          <div className="sysinfo-row"><span className="k">Role</span><span className="v">Web & Marketing</span></div>
          <div className="sysinfo-row"><span className="k">Based</span><span className="v">Louisville, KY</span></div>
          <div className="sysinfo-row"><span className="k">Status</span><span className="v" style={{color:"var(--green)"}}>Open for work</span></div>
          <div className="sysinfo-divider">─────────────────────</div>
          <div className="sysinfo-row"><span className="k">Focus</span><span className="v">Web · SEO · Ads</span></div>
          <div className="sysinfo-row"><span className="k">Since</span><span className="v">2020</span></div>
        </div>
      </div>
      <div className="sysinfo-bars">
        <div className="sysinfo-bar">
          <div className="row"><span>Focus</span><span>92%</span></div>
          <div className="track"><div className="fill" style={{width:"92%"}}></div></div>
        </div>
        <div className="sysinfo-bar">
          <div className="row"><span>Years in tech</span><span>5+</span></div>
          <div className="track"><div className="fill" style={{width:"70%"}}></div></div>
        </div>
        <div className="sysinfo-bar">
          <div className="row"><span>Client slots open</span><span>2 of 4</span></div>
          <div className="track"><div className="fill" style={{width:"50%",background:"var(--amber)"}}></div></div>
        </div>
      </div>
      <div className="sysinfo-foot">
        <span>Available now</span>
        <span style={{color:"var(--green)"}}>● online</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="top" style={{position:"relative"}}>
      <div className="hero-inner">

        <div className="hero-text">
          <div className="hero-eyebrow">Web Design · SEO · Google Ads · Louisville, KY</div>

          <h1>
            I build brands<br/>
            <span className="h1-dim">from the ground up.</span>
          </h1>

          <p className="hero-summary">
            I work with <span className="key">local service businesses</span> — HVAC, plumbing,
            electrical, dumpster rental, landscaping, and more. I build the website,
            get you ranking on Google, and run the ads that bring in the calls.
          </p>

          <div className="hero-cta">
            <a className="btn btn-primary" href="#contact">Start a project</a>
            <a className="btn" href="#work">See my work</a>
            <a className="btn" href="#resume">View resume</a>
          </div>

          <div className="hero-tip">
            Press <span className="kbd">SPACE</span> to play · <span className="kbd">↓</span> to explore
          </div>
        </div>

        <div className="hero-card">
          <SysInfo/>
        </div>

      </div>
      <Runner/>
    </section>
  );
}

function AsciiDivider() {
  return (
    <div className="ascii-divider">
      ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ABOUT
═══════════════════════════════════════════════════════════════ */
function About() {
  return (
    <section id="about">
      <div className="wrap">
        <div className="section-tag">
          <span className="num">01</span>
          <span>About</span>
          <span className="line"></span>
          <span className="meta">Who I am</span>
        </div>
        <div className="about-grid">
          <div>
            <h2>Your phone should be ringing. Let's make that happen.</h2>
            <p style={{marginTop:24}}>
              I work specifically with local service businesses — the kind that live and die
              by phone calls, booked jobs, and word of mouth. HVAC companies, plumbers,
              electricians, dumpster rental, landscapers, roofers. If you rely on people
              finding you locally, I'm your guy.
            </p>
            <p>
              I <span className="green">build the website</span> that actually converts visitors,
              get you <span className="green">ranking on Google</span> when someone searches your service,
              and run <span className="green">Google Ads</span> that bring in calls — not just clicks.
            </p>
            <p>
              I've spent years inside ops teams and engineering departments at Apple, KFC, Humana,
              and digital agencies. I understand systems, processes, and what it takes to grow a
              business — not just build a pretty site.
            </p>
          </div>
          <div className="tree">
            <div className="head">Who I work with</div>
            <pre>
{`local-service-businesses/
├── `}<span className="accent">HVAC</span>{`
├── `}<span className="accent">Plumbing</span>{`
├── `}<span className="accent">Electrical</span>{`
├── `}<span className="accent">Dumpster Rental</span>{`
├── `}<span className="accent">Landscaping</span>{`
├── `}<span className="accent">Roofing</span>{`
├── `}<span className="file">Pest Control</span>{`
├── `}<span className="file">Pressure Washing</span>{`
└── `}<span className="file">+ any trade service</span>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SERVICES
═══════════════════════════════════════════════════════════════ */
function Services() {
  const cmds = [
    { num:"01", name:"Web Design",
      desc:"A clean, fast website built to convert visitors into calls and form fills. Not a template — a real site designed around your business and your customers.",
      tags:["custom design","mobile-first","fast load","built to convert"] },
    { num:"02", name:"Local SEO",
      desc:"Get found when someone in your area searches for your service. I handle technical SEO, Google Business Profile, local citations, and content that ranks.",
      tags:["Google Business","local rankings","technical SEO","content"] },
    { num:"03", name:"Google Ads",
      desc:"Search and Local Services Ads that bring in calls, not just clicks. I build, manage, and report on campaigns with real ROI — no fluff.",
      tags:["Google Search Ads","local services ads","call tracking","monthly reporting"] },
    { num:"04", name:"Brand Identity",
      desc:"Logo, colors, and a visual identity that makes your business look professional and trustworthy from the first impression — online and off.",
      tags:["logo design","brand colors","typography","brand guidelines"] },
  ];
  return (
    <section id="services">
      <div className="wrap">
        <div className="section-tag">
          <span className="num">02</span>
          <span>Services</span>
          <span className="line"></span>
          <span className="meta">What I do</span>
        </div>
        <h2>Everything you need to get found and get called</h2>
        <div className="cmd-list">
          {cmds.map(c => (
            <div className="cmd-row" key={c.num}>
              <div className="cmd-num">{c.num}</div>
              <div className="cmd-name">{c.name}</div>
              <div>
                <div className="cmd-desc">{c.desc}</div>
                <div className="cmd-tags">{c.tags.map(t=><span key={t}>{t}</span>)}</div>
              </div>
              <div className="cmd-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROJECTS
═══════════════════════════════════════════════════════════════ */
function ProjThumb({ kind }) {
  const label = kind==="site"?"Web Design":kind==="seo"?"Local SEO":kind==="ads"?"Google Ads":"Brand Identity";
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" style={{width:"100%",height:"100%"}}>
      <rect width="400" height="250" fill="#0f1411"/>
      <rect x="30" y="30" width="340" height="190" rx="6" fill="#0a0e0c" stroke="#1f2a25"/>
      <text x="48" y="60" fontFamily="JetBrains Mono" fontSize="12" fill="#7ee787">{label}</text>
      <line x1="48" y1="76" x2="350" y2="76" stroke="#1f2a25"/>
      <rect x="48" y="100" width="160" height="10" rx="2" fill="#7ee787"/>
      <rect x="48" y="122" width="230" height="8"  rx="2" fill="#2d3b34"/>
      <rect x="48" y="140" width="190" height="8"  rx="2" fill="#2d3b34"/>
      <rect x="48" y="174" width="90"  height="24" rx="3" fill="#7ee787" opacity="0.85"/>
      <rect x="250" y="100" width="78" height="78" rx="6" fill="#7ee787" opacity="0.12" stroke="#7ee787"/>
    </svg>
  );
}

function Projects() {
  const items = [
    { id:"001", title:"Local service websites", kind:"site", badge:"ACTIVE",
      desc:"Custom sites for HVAC, plumbing, electrical, and trade businesses. Built to convert visitors into calls.",
      stats:[["Sites built","12+"],["Avg Lighthouse","98"],["Timeline","2–4 weeks"]] },
    { id:"002", title:"Local SEO programs",     kind:"seo",  badge:"RECURRING",
      desc:"Google rankings for local service businesses. More searches, more calls, more booked jobs.",
      stats:[["Clients","Ongoing"],["Traffic lift","2–5×"],["Reporting","Monthly"]] },
    { id:"003", title:"Google Ads campaigns",   kind:"ads",  badge:"RUNNING",
      desc:"Search and Local Services Ads that bring in inbound calls. Managed monthly with full reporting.",
      stats:[["Spend managed","6-fig"],["Avg ROAS","3.8×"],["Platform","Google"]] },
    { id:"004", title:"Brand identity",         kind:"brand",badge:"DESIGN",
      desc:"Logo, palette, and visual system that makes a local business look credible and professional.",
      stats:[["Deliverables","Full kit"],["Revisions","Included"],["Timeline","2–4 weeks"]] },
  ];
  return (
    <section id="work">
      <div className="wrap">
        <div className="section-tag">
          <span className="num">03</span>
          <span>Work</span>
          <span className="line"></span>
          <span className="meta">Recent projects</span>
        </div>
        <h2>Real work for real service businesses</h2>
        <div className="proj-grid">
          {items.map(p=>(
            <article className="proj-card" key={p.id}>
              <div className="proj-head">
                <span className="id">PRJ_{p.id}</span>
                <span className="badge">{p.badge}</span>
              </div>
              <div className="proj-thumb"><ProjThumb kind={p.kind}/></div>
              <div className="proj-body">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="proj-stats">
                  {p.stats.map(([k,v])=>(
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

/* ═══════════════════════════════════════════════════════════════
   STACK
═══════════════════════════════════════════════════════════════ */
function Stack() {
  const cells = [
    { cat:"Front-end",     items:["React","TypeScript","Tailwind CSS","Vanilla JS","HTML / CSS"] },
    { cat:"Back-end",      items:["Node.js","SQL","REST APIs","Supabase","Webhooks"] },
    { cat:"Marketing",     items:["Google Ads","Google LSA","GA4 / GTM","SEO tooling","CMS"] },
    { cat:"Ops & Systems", items:["Agile / Scrum","SRE practices","Palo Alto","Monitoring","Process design"] },
  ];
  return (
    <section id="stack">
      <div className="wrap">
        <div className="section-tag">
          <span className="num">04</span>
          <span>Stack</span>
          <span className="line"></span>
          <span className="meta">Tools I use</span>
        </div>
        <h2>The toolkit</h2>
        <div className="stack-grid">
          {cells.map(c=>(
            <div className="stack-cell" key={c.cat}>
              <div className="cat">{c.cat}</div>
              <ul>{c.items.map(i=><li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RESUME
═══════════════════════════════════════════════════════════════ */
function Resume() {
  const jobs = [
    { yr:"Nov 2024 — Present", title:"Director of Operations & Client Experience", co:"Spear Crest Digital — Louisville, KY",
      bullets:[
        "Grew monthly revenue from $20K to $70K+ through operational and strategic improvements.",
        "Led cross-functional teams executing project plans aligned with company objectives.",
        "Streamlined workflows across digital marketing campaigns for local and national clients.",
        "Oversee daily operations across multiple departments.",
      ]},
    { yr:"Jan 2023 — Dec 2024", title:"Senior Solutions Architect", co:"SIG Digital",
      bullets:[
        "Improved development efficiency and reduced time to market via agile practices.",
        "Optimized application performance and led architectural design of complex client solutions.",
        "Developed integration strategies for web-based applications.",
      ]},
    { yr:"Feb 2022 — Jan 2023", title:"Site Reliability Engineer", co:"KFC",
      bullets:[
        "Built SRE team capabilities supporting 2,000+ retail locations.",
        "Increased incident response efficiency via automated alerting and monitoring.",
      ]},
    { yr:"Jul 2021 — Feb 2022", title:"Network Engineer (Contract)", co:"Humana",
      bullets:[
        "Palo Alto firewall assessments, SQL Server health, and network infrastructure projects.",
      ]},
    { yr:"Jul 2020 — Jul 2021", title:"Tech Sales Associate", co:"Apple",
      bullets:[
        "Helped customers identify and solve technology needs with strong product knowledge.",
      ]},
  ];
  return (
    <section className="resume" id="resume">
      <div className="wrap">
        <div className="section-tag">
          <span className="num">05</span>
          <span>Resume</span>
          <span className="line"></span>
          <span className="meta">Work history</span>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",flexWrap:"wrap",gap:16}}>
          <h2>Experience</h2>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <a className="btn" href="Dakota_Straub_Resume.pdf" target="_blank" rel="noreferrer">Download PDF</a>
            <a className="btn btn-primary" href="https://www.linkedin.com/in/dakotastraub/" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
        <div className="resume-doc">
          <aside className="resume-side">
            <h3>Dakota Straub</h3>
            <div className="role">Operations · Web · Marketing</div>
            <div className="block">
              <div className="lbl">Contact</div>
              <ul>
                <li className="row"><span>Email</span><a href="mailto:dakotastraub@outlook.com">dakotastraub@…</a></li>
                <li className="row"><span>Phone</span><span>502.445.5589</span></li>
                <li className="row"><span>Based</span><span>Louisville, KY</span></li>
                <li className="row"><span>LinkedIn</span><a href="https://www.linkedin.com/in/dakotastraub/" target="_blank" rel="noreferrer">in/dakotastraub</a></li>
              </ul>
            </div>
            <div className="block">
              <div className="lbl">Core Skills</div>
              <ul>
                <li>Project & ops management</li>
                <li>Strategic planning</li>
                <li>Process improvement</li>
                <li>Cross-functional leadership</li>
                <li>Web · SEO · Paid ads</li>
              </ul>
            </div>
            <div className="block">
              <div className="lbl">Education</div>
              <ul>
                <li>A.S. Information Systems<br/><span style={{color:"var(--muted)"}}>Jefferson C&TC</span></li>
              </ul>
            </div>
            <div className="block">
              <div className="lbl">Certifications</div>
              <ul>
                <li>CompTIA A+</li>
                <li>CompTIA Security+</li>
                <li>CompTIA Network+</li>
              </ul>
            </div>
          </aside>
          <div className="resume-main">
            <h4>Summary</h4>
            <p className="resume-summary">
              Operations professional with a strong background in managing complex projects and
              driving operational excellence. Collaborative, dependable, and adaptable — with
              proven skills in strategic planning, team leadership, and digital marketing.
            </p>
            <h4>Work History</h4>
            {jobs.map((j,i)=>(
              <div className="resume-job" key={i}>
                <div className="resume-job-head">
                  <div>
                    <div className="title">{j.title}</div>
                    <div className="co">{j.co}</div>
                  </div>
                  <div className="yr">{j.yr}</div>
                </div>
                <ul>{j.bullets.map((b,k)=><li key={k}>{b}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VISION
═══════════════════════════════════════════════════════════════ */
function Vision() {
  const items = [
    { lbl:"01 — Mission", title:"Help local businesses get found and get called",
      desc:"Most service businesses are incredible at their trade but invisible online. I fix that — one website, one market, one business at a time." },
    { lbl:"02 — Growth",  title:"Make marketing feel predictable",
      desc:"No mystery dashboards. No vague reports. Clear plans, real numbers, and campaigns that tie directly to calls and booked jobs." },
    { lbl:"03 — Studio",  title:"Build a small, focused studio",
      desc:"Fewer clients, deeper work. I want to be the person you call first when something needs to grow — not just a vendor." },
  ];
  return (
    <section id="vision">
      <div className="wrap">
        <div className="section-tag">
          <span className="num">06</span>
          <span>Vision</span>
          <span className="line"></span>
          <span className="meta">Where this is headed</span>
        </div>
        <h2>Where this is going</h2>
        <div className="panel-grid">
          {items.map(i=>(
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

/* ═══════════════════════════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════════════════════════ */
function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <div className="section-tag">
          <span className="num">07</span>
          <span>Contact</span>
          <span className="line"></span>
          <span className="meta">Let's talk</span>
        </div>
        <h2>Ready to get more calls? Let's talk.</h2>
        <p style={{maxWidth:540,marginTop:16,color:"var(--fg-2)"}}>
          I work with local service businesses that are serious about growing. If that's you,
          reach out — I respond fast and I'll tell you straight whether I can help.
        </p>
        <div className="contact-shell">
          <div className="terminal">
            <div className="terminal-head">
              <div className="dots"><i/><i/><i/></div>
              <div>Contact — dakotastraub.com</div>
            </div>
            <div className="terminal-body">
              <div className="line cmd"><span className="prompt">$</span><span>reach out</span></div>
              <div className="line out"><span><span className="k">→</span> Email: <a href="mailto:dakotastraub@outlook.com" style={{color:"var(--green)",borderBottom:"1px dashed currentColor"}}>dakotastraub@outlook.com</a></span></div>
              <div className="line out"><span><span className="k">→</span> Phone: <a href="tel:5024455589" style={{color:"var(--green)",borderBottom:"1px dashed currentColor"}}>+1 502.445.5589</a></span></div>
              <div className="line empty"></div>
              <div className="line cmd"><span className="prompt">$</span><span>how it works</span></div>
              <div className="line out">1. Tell me about your business and goals</div>
              <div className="line out">2. I scope it out and you approve</div>
              <div className="line out">3. We build, launch, and grow</div>
              <div className="line empty"></div>
              <div className="line cmd">
                <span className="prompt">$</span>
                <span style={{display:"inline-flex",alignItems:"center",gap:4}}>
                  waiting
                  <span style={{display:"inline-block",width:7,height:14,background:"var(--green)",verticalAlign:"middle",animation:"cursor 1s step-end infinite"}}></span>
                </span>
              </div>
            </div>
          </div>
          <div className="contact-side">
            {[
              {k:"Email",     v:"dakotastraub@outlook.com", href:"mailto:dakotastraub@outlook.com"},
              {k:"LinkedIn",  v:"in/dakotastraub",          href:"https://www.linkedin.com/in/dakotastraub/"},
              {k:"Instagram", v:"@dakotastraub",            href:"https://www.instagram.com/dakotastraub/"},
              {k:"Phone",     v:"502.445.5589",             href:"tel:5024455589"},
              {k:"Location",  v:"Louisville, KY",           href:"#"},
            ].map(r=>(
              <a className="contact-row" key={r.k} href={r.href} target={r.href.startsWith("http")?"_blank":undefined} rel="noreferrer">
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

/* ═══════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer>
      <span>© {new Date().getFullYear()} Dakota Straub · Louisville, KY</span>
      <span className="pulse"><i></i> Online · Available for work</span>
    </footer>
  );
}

Object.assign(window, {
  Starfighters,
  StatusBar, Nav, Hero, AsciiDivider,
  About, Services, Projects, Stack,
  Resume, Vision, Contact, Footer,
});
