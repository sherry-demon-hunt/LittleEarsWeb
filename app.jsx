// app.jsx - Little Ears, Big Ideas landing page

const { useState, useEffect } = React;

/* ---------- Data ---------- */
const PLATFORMS = [
  { key: "spotify", label: "Spotify", sub: "Listen on Spotify", url: "https://open.spotify.com/show/033nX1b2ppBSHqZsId9qQK" },
  { key: "apple", label: "Apple Podcasts", sub: "Subscribe on Apple", url: "https://podcasts.apple.com/au/podcast/little-ears-big-ideas/id1896831868" },
  { key: "xiaoyuzhou", label: "Xiaoyuzhou", sub: "Listen on Xiaoyuzhou", url: "https://www.xiaoyuzhoufm.com/" },
  { key: "youtube", label: "YouTube", sub: "Watch on YouTube", url: "https://www.youtube.com/" },
];

const EPISODE_FEED_URL = "data/episodes.json";
const HOSTS = {
  lily: {
    name: "Lily",
    initial: "L",
    image: "images/Lily.png",
    alt: "Lily host portrait",
    blurb: "Hi, I'm Lily, and I love finding out how the world works, especially when the answer is hiding in a place no one expected! I ask big questions, follow curious clues, and help turn every \"Wait… why?\" into an adventure."
  },
  max: {
    name: "Max",
    initial: "M",
    image: "images/Max.png",
    alt: "Max host portrait",
    blurb: "Hi, I'm Max, and I have lots of excellent ideas that usually make total sense… at least to me! I ask big questions, test bold theories, and sometimes accidentally discover the real answer along the way."
  }
};

/* ---------- Platform link ---------- */
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
        <span className="go">></span>
      </a>
    );
  }
  return (
    <a className="plat" href={p.url} target="_blank" rel="noopener">
      <span className="ico"><Icon size={42} /></span>
      <span className="meta"><span className="lbl">{p.label}</span><span className="sub">{p.sub}</span></span>
    </a>
  );
}

/* ---------- Decoration layer ---------- */
function Decoration() {
  return (
    <div className="deco-layer" aria-hidden="true">
      <div className="deco anim-twinkle" style={{ top: "12%", left: "22%", "--dur": "3.8s" }}><Sparkle size={24} /></div>
      <div className="deco anim-twinkle" style={{ top: "22%", left: "50%", "--dur": "4.4s", "--delay": "-1s" }}><Sparkle size={18} color="#F9A8E7" /></div>
      <div className="deco anim-twinkle" style={{ top: "70%", left: "12%", "--dur": "4s", "--delay": "-2s" }}><Sparkle size={20} color="#A5C9FF" /></div>
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
          <p className="lede">Big questions from tiny scientists, answered with wonder, giggles, and everyday discoveries.</p>

          <div className="listen">
            <p className="listen-eyebrow"><Sparkle size={16} color="var(--sun)" /> Listen wherever you play podcasts</p>
            <div className={"links " + layout}>
              {PLATFORMS.map((p) => <PlatformLink key={p.key} p={p} layout={layout} />)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------- About ---------- */
function About() {
  const [activeHostKey, setActiveHostKey] = useState(null);
  const activeHost = activeHostKey ? HOSTS[activeHostKey] : null;

  useEffect(() => {
    if (!activeHost) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActiveHostKey(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeHost]);

  return (
    <section className="section tint" id="about" data-screen-label="About">
      <div className="wrap about-grid">
        <div className="about-card science-card" aria-hidden="true">
          <span>Why?</span>
          <span>How?</span>
          <span>What if?</span>
        </div>
        <div className="about-body">
          <p className="sec-kicker">Meet your hosts</p>
          <h2 className="sec-title" style={{ textAlign: "left", marginBottom: 18 }}>Curiosity, served bite-sized.</h2>
          <p><strong>Little Ears, Big Ideas</strong> turns the questions kids actually ask, like why the sky is blue or how money works, into short, joyful adventures. Each episode is built for little attention spans and big imaginations, so screen-free car rides and bedtimes become mini science expeditions.</p>
          <p>Hosted by <strong>Lily</strong> the question-chaser and <strong>Max</strong> the big-idea builder, each conversation keeps science playful, clear, and easy for curious kids to follow.</p>
          <div className="hosts">
            {Object.entries(HOSTS).map(([key, host]) => (
              <button
                key={key}
                type="button"
                className="host-chip"
                aria-expanded={activeHostKey === key}
                aria-controls="host-popover"
                onClick={() => setActiveHostKey(activeHostKey === key ? null : key)}
              >
                <span className="host-dot" aria-hidden="true">{host.initial}</span>
                <span>{host.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {activeHost && (
        <div className="host-modal-layer" id="host-popover" role="presentation" onClick={() => setActiveHostKey(null)}>
          <div className="host-modal" role="dialog" aria-modal="true" aria-label={`${activeHost.name} host details`} onClick={(event) => event.stopPropagation()}>
            <button className="host-modal-close" type="button" aria-label="Close host details" onClick={() => setActiveHostKey(null)}>x</button>
            <div className="host-modal-image-wrap">
              <img className="host-modal-image" src={activeHost.image} alt={activeHost.alt} />
            </div>
            <div className="host-modal-copy">
              <p className="sec-kicker">Meet {activeHost.name}</p>
              <h3>{activeHost.name}</h3>
              <p>{activeHost.blurb}</p>
              <div className="host-modal-tabs" aria-label="Switch hosts">
                {Object.entries(HOSTS).map(([key, host]) => (
                  <button
                    key={key}
                    type="button"
                    className="host-modal-tab"
                    aria-pressed={activeHostKey === key}
                    onClick={() => setActiveHostKey(key)}
                  >
                    <span className="host-dot" aria-hidden="true">{host.initial}</span>
                    <span>{host.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
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
          <p className="sec-kicker">Fresh from the lab</p>
          <h2 className="sec-title title-outline">Latest Episodes</h2>
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
          <span className="word w-little" style={{ fontSize: "0.7em" }}>Ready to wonder?</span>
        </h2>
        <div className="foot-links">
          {PLATFORMS.map((p) => {
            const Icon = PLATFORM_ICONS[p.key];
            return <a key={p.key} className="foot-mini plat" href={p.url} target="_blank" rel="noopener" aria-label={p.label}><Icon size={34} /></a>;
          })}
        </div>
        <p className="foot-note">(c) {new Date().getFullYear()} Little Ears, Big Ideas - A kids' science podcast made with curiosity</p>
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
          options={[{ value: "photo", label: "Science lab" }, { value: "dream", label: "Dreamy" }]}
          onChange={(v) => setTweak("backdrop", v)} />
        <TweakToggle label="Animation" value={t.motion} onChange={(v) => setTweak("motion", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
