// app v3
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#7ee787",
  "scanlines": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", tweaks.accent);
    document.documentElement.style.setProperty("--green", tweaks.accent);
    document.body.style.setProperty("--scanline-opacity", tweaks.scanlines ? "0.18" : "0");
    if (tweaks.scanlines) document.body.classList.remove("no-scan");
    else document.body.classList.add("no-scan");
  }, [tweaks]);

  useEffect(() => {
    const els = document.querySelectorAll("section h2, .cmd-row, .proj-card, .stack-cell, .panel, .resume-doc");
    els.forEach(el => el.classList.add("reveal"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "-10% 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <React.Fragment>
      <Starfighters />
      <StatusBar />
      <Nav />
      <main>
        <Hero />
        <AsciiDivider />
        <About />
        <Services />
        <Projects />
        <Stack />
        <Resume />
        <Vision />
        <Contact />
      </main>
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Color">
          <TweakColor label="Terminal accent" value={tweaks.accent} onChange={v => setTweak("accent", v)} />
        </TweakSection>
        <TweakSection title="Effects">
          <TweakToggle label="Scanlines" value={tweaks.scanlines} onChange={v => setTweak("scanlines", v)} />
        </TweakSection>
        <TweakSection title="Quick presets">
          <TweakButton onClick={() => setTweak({ accent: "#7ee787" })}>Matrix green (default)</TweakButton>
          <TweakButton onClick={() => setTweak({ accent: "#f0b561" })}>Amber CRT</TweakButton>
          <TweakButton onClick={() => setTweak({ accent: "#79b8ff" })}>IBM blue</TweakButton>
          <TweakButton onClick={() => setTweak({ accent: "#ff7a7a" })}>Red phosphor</TweakButton>
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
