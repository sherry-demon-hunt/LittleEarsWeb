// app.jsx — Little Ears, Big Ideas landing page

const { useState, useEffect, useRef } = React;

/* ---------- Data ---------- */
const PLATFORMS = [
  { key: "spotify",    label: "Spotify",         sub: "Listen on Spotify",      url: "https://open.spotify.com/show/033nX1b2ppBSHqZsId9qQK" },
  { key: "apple",      label: "Apple Podcasts",  sub: "Subscribe on Apple",     url: "https://podcasts.apple.com/" },
  { key: "xiaoyuzhou", label: "小宇宙",            sub: "在小宇宙收听",             url: "https://www.xiaoyuzhoufm.com/" },
  { key: "youtube",    label: "YouTube",         sub: "Watch on YouTube",       url: "https://www.youtube.com/" },
];

const EPISODE_FEED_URL = "data/episodes.json";

/* ---------- Platform link (renders per layout) ---------- */
function PlatformLink({ p, layout }) {
  const Icon = PLATFORM_ICONS[p.key];
  if (layout === "bubbles") {
    return (
      <a className="plat" href={p.url} target="_blank" rel="noopener" aria-label={p.label}>
        <span className="ico"><Icon size={40} /></span>
        <span className="lbl">{p.label}</span>
      </a>
    );
  }
  if (layout === "panel") {
    return (
      <a className="plat" href={p.url} target="_blank" rel="noopener">
        <span className="ico"><Icon size={40} /></span>
        <span className="meta"><span className="lbl">{p.label}</span><span className="sub">{p.sub}</span></span>
        <span className="go">›</span>
      </a>
    );
  }
  // cards (default)
  return (
    <a className="plat" href={p.url} target="_blank" rel="noopener">
      <span className="ico"><Icon size={42} /></span>
      <span className="meta"><span className="lbl">{p.label}</span><span className="sub">{p.sub}</span></span>
    </a>
  );
}

/* ---------- Decoration layer ---------- */
function Decoration() {
  const bubbles = React.useMemo(() => (
    Array.from({ length: 16 }, (_, i) => ({
      left: Math.random() * 100,
      size: 10 + Math.random() * 30,
      dur: 10 + Math.random() * 12,
      delay: -Math.random() * 14,
      wob: (Math.random() * 60 - 30) + "px",
    }))
  ), []);
  return (
    <div className="deco-layer" aria-hidden="true">
      {/* drifting creatures */}
      <div className="deco anim-drift" style={{ top: "12%", "--dur": "46s", "--delay": "-6s" }}><Whale size={150} /></div>
      <div className="deco anim-sway" style={{ top: "20%", left: "8%", "--dur": "8s" }}><Jellyfish size={70} color="#C9A2F2" /></div>
      <div className="deco anim-sway" style={{ top: "58%", right: "6%", "--dur": "9s", "--delay": "-2s" }}><Jellyfish size={60} color="#7FC6F2" /></div>
      <div className="deco anim-bob" style={{ top: "70%", left: "5%", "--dur": "6s" }}><Starfish size={50} color="#FF9EC4" /></div>
      <div className="deco anim-bob" style={{ top: "40%", right: "10%", "--dur": "5.5s", "--delay": "-1.5s" }}><Fish size={56} color="#FFD36E" /></div>
      <div className="deco anim-bob" style={{ top: "82%", right: "18%", "--dur": "7s" }}><Fish size={44} color="#9CE6C0" /></div>
      {/* sparkles */}
      <div className="deco anim-twinkle" style={{ top: "16%", left: "44%", "--dur": "3.5s" }}><Sparkle size={26} /></div>
      <div className="deco anim-twinkle" style={{ top: "30%", right: "30%", "--dur": "4.2s", "--delay": "-1s" }}><Sparkle size={18} color="#F9A8E7" /></div>
      <div className="deco anim-twinkle" style={{ top: "66%", left: "38%", "--dur": "3.8s", "--delay": "-2s" }}><Sparkle size={22} color="#A5C9FF" /></div>
      {/* rising bubbles */}
      {bubbles.map((b, i) => (
        <div key={i} className="bubble-col" style={{ left: b.left + "%", "--dur": b.dur + "s", "--delay": b.delay + "s", "--wob": b.wob }}>
          <Bubble size={b.size} />
        </div>
      ))}
    </div>
  );
}

/* ---------- Hero ---------- */
function Hero({ layout }) {
  return (
    <header className="hero" data-screen-label="Hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="kicker"><Sparkle size={15} color="#fff" /> A Kids' Science Podcast</span>
          <h1 className="title" aria-label="Little Ears, Big Ideas">
            <span className="row"><span className="word w-little">Little</span> <span className="word w-ears">Ears,</span></span>
            <span className="row row-2"><span className="word w-big">Big</span> <span className="word w-ideas">Ideas</span></span>
          </h1>
          <p className="lede">Big questions from tiny scientists — answered with wonder, giggles, and a splash of ocean magic. 🫧</p>

          <div className="listen">
            <p className="listen-eyebrow"><Sparkle size={16} color="var(--sun)" /> Listen wherever you play podcasts</p>
            <div className={"links " + layout}>
              {PLATFORMS.map((p) => <PlatformLink key={p.key} p={p} layout={layout} />)}
            </div>
          </div>
        </div>

        <div className="cover-stage">
          <div className="cover-card floaty">
            <img src="images/cover-art.jpg" alt="Little Ears, Big Ideas cover art featuring hosts Lily and Max exploring underwater" />
          </div>
          <span className="cover-badge">NEW<br/>EVERY<br/>WEEK</span>
        </div>
      </div>
    </header>
  );
}

/* ---------- About ---------- */
function About() {
  return (
    <section className="section tint" id="about" data-screen-label="About">
      <div className="wrap about-grid">
        <div className="about-card">
          <img src="images/underwater-scene.jpg" alt="Lily and Max swimming with sea creatures" />
        </div>
        <div className="about-body">
          <p className="sec-kicker">Meet your hosts</p>
          <h2 className="sec-title" style={{ textAlign: "left", marginBottom: 18 }}>Curiosity, served bite-sized.</h2>
          <p><strong>Little Ears, Big Ideas</strong> turns the questions kids actually ask — Why is the sky blue? Do fish sleep? — into short, joyful adventures. Each episode is built for little attention spans and big imaginations, so screen-free car rides and bedtimes become mini science expeditions.</p>
          <p>Hosted by <strong>Lily</strong> the question-chaser and <strong>Max</strong> the experiment-maker, every show ends with a simple thing you can try together at home.</p>
          <div className="hosts">
            <span className="host-chip"><span className="host-dot" style={{ background: "linear-gradient(135deg,#8B5CF6,#EC4899)" }}>L</span> Lily</span>
            <span className="host-chip"><span className="host-dot" style={{ background: "linear-gradient(135deg,#38BDF8,#4F8DF5)" }}>M</span> Max</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Episodes ---------- */
function useEpisodeFeed() {
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    let alive = true;

    fetch(EPISODE_FEED_URL, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Episode feed unavailable");
        return res.json();
      })
      .then((data) => {
        const items = Array.isArray(data) ? data : data.items;
        if (alive && Array.isArray(items) && items.length > 0) {
          setEpisodes(items.slice(0, 5));
        }
      })
      .catch(() => {
        if (alive) setEpisodes([]);
      });

    return () => {
      alive = false;
    };
  }, []);

  return episodes;
}

function Episodes() {
  const episodes = useEpisodeFeed();

  return (
    <section className="section" id="episodes" data-screen-label="Episodes">
      <div className="wrap">
        <div className="sec-head">
          <p className="sec-kicker">Fresh from the deep</p>
          <h2 className="sec-title">Latest Episodes</h2>
        </div>
        {episodes.length === 0 ? (
          <div className="ep-empty">
            <p>Latest Spotify episodes are syncing.</p>
            <a href={PLATFORMS[0].url} target="_blank" rel="noopener">Open Spotify</a>
          </div>
        ) : (
          <div className="ep-grid">
            {episodes.map((e, i) => {
            const featured = i === 0;
            const artStyle = e.art
              ? { backgroundImage: `url(${e.art})` }
              : { background: `linear-gradient(135deg, ${e.c1 || "var(--sky)"}, ${e.c2 || "var(--violet)"})` };

            return (
            <article key={e.id || e.title || i} className={"ep" + (featured ? " feat" : "")}>
              <div className="ep-art" style={artStyle}>
                {featured && <span className="feat-tag">Latest</span>}
              </div>
              <div className="ep-top">
                <span className="ep-num">{e.n}</span>
                <h3 className="ep-title">{e.title}</h3>
                <p className="ep-desc">{e.desc}</p>
                <div className="ep-meta"><span>{e.len}</span><span>{e.date}</span></div>
                <a className="ep-play" href={e.url || PLATFORMS[0].url} target="_blank" rel="noopener">Play episode</a>
              </div>
            </article>
            );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="foot" data-screen-label="Footer">
      <div className="wrap">
        <h2 className="title" aria-label="Little Ears, Big Ideas">
          <span className="word w-little" style={{ fontSize: "0.7em" }}>Ready to dive in?</span>
        </h2>
        <div className="foot-links">
          {PLATFORMS.map((p) => {
            const Icon = PLATFORM_ICONS[p.key];
            return <a key={p.key} className="foot-mini plat" href={p.url} target="_blank" rel="noopener" aria-label={p.label}><Icon size={34} /></a>;
          })}
        </div>
        <p className="foot-note">© {new Date().getFullYear()} Little Ears, Big Ideas · A kids' science podcast made with curiosity 💜</p>
      </div>
    </footer>
  );
}

/* ---------- Tweaks defaults ---------- */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "linkLayout": "cards",
  "backdrop": "photo",
  "motion": true
}/*EDITMODE-END*/;

const LAYOUT_LABELS = { cards: "Cards", bubbles: "Bubbles", panel: "Player panel" };

/* ---------- App ---------- */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.body.classList.toggle("motion-off", !t.motion);
  }, [t.motion]);

  return (
    <React.Fragment>
      <div className={"backdrop " + (t.backdrop === "photo" ? "photo" : "dream")}></div>
      <Decoration />
      <div className={"page " + (t.backdrop === "photo" ? "photo" : "dream")}>
        <Hero layout={t.linkLayout} />
        <About />
        <Episodes />
        <Footer />
      </div>

      <TweaksPanel>
        <TweakSection label="Listen links" />
        <TweakRadio label="Layout" value={t.linkLayout}
          options={[{ value: "cards", label: "Cards" }, { value: "bubbles", label: "Bubbles" }, { value: "panel", label: "Panel" }]}
          onChange={(v) => setTweak("linkLayout", v)} />
        <TweakSection label="Scene" />
        <TweakRadio label="Backdrop" value={t.backdrop}
          options={[{ value: "photo", label: "Underwater" }, { value: "dream", label: "Dreamy" }]}
          onChange={(v) => setTweak("backdrop", v)} />
        <TweakToggle label="Animation" value={t.motion} onChange={(v) => setTweak("motion", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
