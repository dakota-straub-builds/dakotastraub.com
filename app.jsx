const root = ReactDOM.createRoot(document.getElementById("root"));

function SysCard() {
  return (
    <div className="sys-card">
      <div className="sys-header">
        <span className="dot"></span>
        SysInfo
      </div>

      <div className="avatar">DS</div>

      <div className="row"><span>name</span> Dakota</div>
      <div className="row"><span>stack</span> web · seo · paid</div>
      <div className="row"><span>mode</span> build</div>
      <div className="row"><span>status</span> online</div>
    </div>
  );
}

function App() {
  return (
    <div className="hero">

      <div className="left">
        <div className="boot">
          <p>&gt; booting...</p>
          <p>&gt; loading profile</p>
          <p>&gt; ready</p>
        </div>

        <h1>
          build_websites →
          <br/>
          rank_them →
          <br/>
          run_ads;
        </h1>

        <p className="desc">
          I build websites, rank them, and run ads that actually convert.
        </p>

        <div className="actions">
          <a className="btn primary">start_project</a>
          <a className="btn secondary">projects</a>
        </div>
      </div>

      <div className="right">
        <SysCard />
      </div>

    </div>
  );
}

root.render(<App />);