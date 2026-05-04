// dakotastraub.com v3 — app shell

function App() {
  React.useEffect(() => {
    const els = document.querySelectorAll(".reveal");

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
          }
        });
      },
      { threshold: 0.12 }
    );

    els.forEach(el => obs.observe(el));

    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Starfighters />

      <StatusBar />
      <Nav />

      <main>
        <Hero />

        <AsciiDivider />

        <div className="reveal">
          <About />
        </div>

        <div className="reveal">
          <Services />
        </div>

        <div className="reveal">
          <Projects />
        </div>

        <div className="reveal">
          <Stack />
        </div>

        <div className="reveal">
          <Resume />
        </div>

        <div className="reveal">
          <Vision />
        </div>

        <div className="reveal">
          <Contact />
        </div>
      </main>

      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);