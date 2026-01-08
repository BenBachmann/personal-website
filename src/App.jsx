import React, { useEffect, useMemo, useState } from "react";

/**
 * BEN'S PERSONAL WEBSITE — Single-file React app (Full Site)
 * ---------------------------------------------------------------
 * Clean path routing (/, /about, /writing, /novel, /favourites, /contact)
 * Mobile fix: responsive navbar with hamburger + slide-down menu
 *
 * IMPORTANT (deployment):
 * - Add vercel.json at project root:
 *   {
 *     "rewrites": [
 *       { "source": "/(.*)", "destination": "/index.html" }
 *     ]
 *   }
 * - Put robots.txt and sitemap.xml in /public (see earlier instructions).
 * - In index.html <head>, include: <base href="/" />
 */

// =========================
// THEME — EDIT HERE
// =========================
const THEME = {
  intensity: { tint: 0.18, card: 0.24, badge: 0.18 },
  colors: {
    background: "#ECF4F7",
    backgroundAlt: "#E2EFF1",
    text: "#0A1A28",
    textMuted: "#5A6A75",
    green: "#2F8E75",
    blue: "#2F76B4",
    grey: "#8DA3AE",
    accent1: "#8166B1",
    accent2: "#D3A43E",
    line: "#D8E0E3",
  },
  gradients: {
    cardFrom: "rgba(47, 142, 117, 0.30)",
    cardTo: "rgba(47, 118, 180, 0.14)",
    sectionA: "rgba(47,118,180,0.18)",
    sectionB: "rgba(129,102,177,0.14)",
    badgeA: "rgba(47,142,117,0.22)",
    badgeB: "rgba(47,118,180,0.18)",
  },
  radii: { card: "1.25rem", input: "0.875rem", button: "0.875rem" },
  shadows: { card: "0 14px 40px rgba(12, 22, 41, 0.12)", soft: "0 4px 14px rgba(12, 22, 41, 0.10)" },
  fontFamily: '"Plus Jakarta Sans", "Inter Tight", "IBM Plex Sans", system-ui, sans-serif',
  fontScale: {
    h1: "clamp(2rem, 3vw + 1rem, 3rem)",
    h2: "clamp(1.5rem, 2vw + 0.8rem, 2.25rem)",
    h3: "clamp(1.25rem, 1.2vw + 0.6rem, 1.5rem)",
    body: "1rem",
    small: "0.925rem",
  },
};

// =========================
// PAGES ENABLED — EDIT HERE
// =========================
const PAGES_ENABLED = {
  home: false,
  about: false,
  writing: false,
  novel: false,
  favourites: false,
  contact: false,
};

// =========================
// CONTENT — EDIT HERE
// =========================
const HOME_HERO = { name: "Ben Bachmann", tagline: "Writer, Thinker, Scientist, Musician" };

const ABOUT = {
  photoUrl: "/profile_picture.jpg",
  bio: `My name is Ben Bachmann. My goal is to bring into public life a point of view that is both modern and rooted in classical thought. My background includes degrees in both the natural sciences and humanities, experience at tech startups, as well as extensive training as a classical musician. I am currently completing a novel, and I regularly post articles on a wide range of topics on Substack.`,
  highlights: [
    { title: "Current Work", items: ["Biweekly essays on Substack"] },
    { title: "Interests", items: ["TBA"] },
  ],
};

const WRITING_CARDS = [
  { title: "The Assault on Creativity", excerpt: "How our age mistakes imitation for imagination", href: "https://open.substack.com/pub/benbachmann/p/the-assault-on-creativity?r=2kziwg&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true", tags: ["creativity", "art", "technology"] }
];

// const NOVEL = { title: "A Novel: Upcoming", description: "Need to add description", intent: "add inspiration" };

const FAVOURITES = [
  { title: "Movies", items: ["Lawrence of Arabia","Barry Lyndon","Brief Encounter","Vertigo","The Bridge on the River Kwai","Tokyo Story"] },
  { title: "Authors", items: ["Leo Tolstoy","Fyodor Dostoevsky","Charles Dickens","Homer","Sophocles"] },
  { title: "Orchestral Pieces", items: ["Beethoven- Symphony No. 3 \"Eroica\"","Beethoven- Egmont Overture","Beethoven- Piano Concerto No.5 \"Emperor\"", "Mozart- Symphony No.40", "Brahms- Piano Concerto No.1"] },
  { title: "Piano Pieces", items: ["Beethoven- Sonata No.23 \"Appassionata\"","Schubert- Wanderer Fantasie","Schubert- Sonata No.21","Schumann- Fantasie in C","Ravel- Gaspard de la Nuit"] },
  { title: "Movies Since 2000", items: ["There Will Be Blood","Ex Machina","Mulholland Drive","Inglourious Basterds","Melancholia","The Tree of Life","Arrival"] },
  { title: "Contemporary Authors", items: ["Sally Rooney","Haruki Murakami","Jonathan Franzen","Christian Kracht"] },
  { title: "American National Parks", items: ["Arches","Bryce Canyon","Grand Canyon","North Cascades","Theodore Roosevelt"] },
  { title: "European Cities", items: ["Vienna","London","Florence","Prague","Sevilla"] },
  { title: "Philosophers", items: ["Friedrich Nietzsche","Aristotle","Plato", "Baruch Spinoza"] },
  { title: "Historical Leaders", items: ["Albrecht von Wallenstein", "Admiral Horatio Nelson", "Holy Roman Emperor Frederick II", "Klemens von Metternich", "Pericles", "Justinian"] },
  // { title: "Non-fiction Books", items: [] }
];

// --- FAVOURITES LINK HELPERS ---
const WIKI_PAGE = (title) =>
  `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, "_"))}`;
const WIKI_SEARCH = (query) =>
  `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`;
const IMDB_SEARCH = (title) =>
  `https://www.imdb.com/find/?s=tt&q=${encodeURIComponent(title)}`;
const YT_SCORE = (piece) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(piece + " score")}`;

// Optional alternative: National Park Foundation search (nice visuals)
// const NPF_SEARCH = (park) =>
//   `https://www.nationalparks.org/search?search=${encodeURIComponent(park + " National Park")}`;

function linkFor(category, item) {
  const c = category.toLowerCase();

  // Movies (classic + since 2000) -> IMDb
  if (c === "movies" || c === "movies since 2000") return IMDB_SEARCH(item);

  // Authors / Contemporary Authors / Philosophers / Historical Leaders -> Wikipedia page
  if (
    c === "authors" ||
    c === "contemporary authors" ||
    c === "philosophers" ||
    c === "historical leaders"
  ) {
    return WIKI_PAGE(item);
  }

  // Music -> YouTube search with "score"
  if (c === "orchestral pieces" || c === "piano pieces") return YT_SCORE(item);

  // American National Parks -> Wikipedia (append " National Park" to avoid wrong pages)
  if (c === "american national parks") {
    const query = `${item} National Park`;
    // Prefer the direct page URL; if it 404s for some edge case, the user still lands on a sensible search.
    return WIKI_PAGE(query);
    // If you later prefer National Park Foundation visuals, switch to:
    // return NPF_SEARCH(item);
  }

  // European Cities -> Wikipedia page
  if (c === "european cities") return WIKI_PAGE(item);

  // Fallback
  return WIKI_SEARCH(item);
}

const CONTACT = {
  blurb: "For speaking, editorial collaborations, or thoughtful correspondence, use the form below. I read everything.",
  socials: [
    { label: "X", href: "https://x.com/benbachmann_", aria: "X (Twitter)" },
    { label: "Substack", href: "https://substack.com/@benbachmann", aria: "Substack" },
    { label: "YouTube", href: "https://youtube.com/@benbachmann1634", aria: "YouTube" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ben-bachmann-a2279a232/", aria: "LinkedIn" },
  ],
};

// =========================
// CSS VARS
// =========================
function useCSSVars() {
  useEffect(() => {
    const r = document.documentElement;
    const set = (k, v) => r.style.setProperty(k, v);
    Object.entries(THEME.colors).forEach(([k, v]) => set(`--${k}`, v));
    Object.entries(THEME.intensity).forEach(([k, v]) => set(`--int-${k}`, String(v)));
    Object.entries(THEME.gradients).forEach(([k, v]) => set(`--grad-${k}`, v));
    set("--radius-card", THEME.radii.card);
    set("--radius-input", THEME.radii.input);
    set("--radius-button", THEME.radii.button);
    set("--shadow-card", THEME.shadows.card);
    set("--shadow-soft", THEME.shadows.soft);
    set("--font", THEME.fontFamily);
    set("--fs-h1", THEME.fontScale.h1);
    set("--fs-h2", THEME.fontScale.h2);
    set("--fs-h3", THEME.fontScale.h3);
    set("--fs-body", THEME.fontScale.body);
    set("--fs-small", THEME.fontScale.small);
  }, []);
}

// =========================
// ROUTER (history + clean URLs)
// =========================
const ROUTES = [
  { id: "home",       label: "Home",                 path: "/" },
  { id: "about",      label: "About",                path: "/about" },
  { id: "writing",    label: "Writing",              path: "/writing" },
  // { id: "novel",      label: "A Novel: Upcoming",    path: "/novel" },
  { id: "favourites", label: "Favourites",           path: "/favourites" },
  { id: "contact",    label: "Contact",              path: "/contact" },
];

const idToPath = Object.fromEntries(ROUTES.map(r => [r.id, r.path]));
const pathToId = Object.fromEntries(ROUTES.map(r => [r.path, r.id]));

function normalizePath(p) {
  const url = new URL(p, window.location.origin);
  let pathname = url.pathname;
  if (pathname.length > 1 && pathname.endsWith("/")) pathname = pathname.slice(0, -1);
  return pathname || "/";
}

function currentIdFromPath(fallback = "home") {
  const pathname = normalizePath(window.location.href);
  const found = pathToId[pathname] || fallback;
  return PAGES_ENABLED[found] ? found : fallback;
}

function usePathRoute(defaultRoute = "home") {
  const [route, setRoute] = useState(() => currentIdFromPath(defaultRoute));
  useEffect(() => {
    const onPop = () => setRoute(currentIdFromPath(defaultRoute));
    window.addEventListener("popstate", onPop);
    const initial = currentIdFromPath(defaultRoute);
    if (initial !== route) {
      window.history.replaceState({}, "", idToPath[initial] || "/");
      setRoute(initial);
    }
    return () => window.removeEventListener("popstate", onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultRoute]);

  const navigateTo = (id, replace = false) => {
    const path = idToPath[id] || "/";
    const method = replace ? "replaceState" : "pushState";
    window.history[method]({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return { route, navigateTo };
}

// =========================
// UI PRIMITIVES
// =========================
function Card({ children, className = "", style }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: `linear-gradient(145deg, var(--grad-cardFrom), var(--grad-cardTo))`,
        boxShadow: "var(--shadow-card)",
        border: `1px solid var(--line)`,
        borderRadius: "var(--radius-card)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {children}
    </div>
  );
}

function Badge({ children }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs border"
      style={{
        borderColor: "var(--line)",
        background: `linear-gradient(135deg, var(--grad-badgeA), var(--grad-badgeB))`,
        color: "var(--text)",
      }}
    >
      {children}
    </span>
  );
}

function Icon({ name, className, style }) {
  // Simple inline icons for hamburger/close
  if (name === "menu") {
    return (
      <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 6h18M3 12h18M3 18h18" />
      </svg>
    );
  }
  if (name === "close") {
    return (
      <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 6l12 12M6 18L18 6" />
      </svg>
    );
  }
  return null;
}

function NewsletterForm() {
  const onSubmit = (e) => {
    e.preventDefault();
    alert("Thanks — this demo form doesn’t submit yet. Connect to Substack/Mailchimp/Buttondown or a serverless endpoint.");
  };
  return (
    <form onSubmit={onSubmit} className="flex w-full items-center gap-3">
      <input
        type="email"
        required
        placeholder="you@example.com"
        className="w-full px-4 py-3 border focus:outline-none"
        style={{
          borderColor: "var(--line)",
          background: "#fff",
          color: "var(--text)",
          borderRadius: "var(--radius-input)",
          fontFamily: "var(--font)",
        }}
      />
      <button
        type="submit"
        className="px-4 py-3 font-medium"
        style={{
          background: "linear-gradient(135deg, var(--green), var(--blue))",
          color: "white",
          borderRadius: "var(--radius-button)",
          boxShadow: "var(--shadow-soft)",
          fontFamily: "var(--font)",
        }}
      >
        Subscribe
      </button>
    </form>
  );
}

function LinkChip({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm border transition-colors"
      style={{
        borderColor: "var(--line)",
        background: "linear-gradient(135deg, var(--grad-badgeA), var(--grad-badgeB))",
        color: "var(--text)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <span>{children}</span>
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ opacity: 0.8 }}
        aria-hidden
      >
        <path d="M7 17L17 7M10 7h7v7" />
      </svg>
    </a>
  );
}


// =========================
// LAYOUT — Responsive Navbar
// =========================
function Navbar({ active, navigateTo }) {
  const items = ROUTES.filter((r) => PAGES_ENABLED[r.id]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Close menu on route change or on ESC
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    // prevent body scroll when menu open (mobile)
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  // Reusable nav link
  const NavLink = ({ item, isMobile }) => (
    <a
      href={idToPath[item.id]}
      onClick={(e) => {
        e.preventDefault();
        navigateTo(item.id);
        setOpen(false);
      }}
      className={
        isMobile
          ? `block w-full text-left px-4 py-3 rounded-xl border transition-colors ${
              active === item.id
                ? "bg-[var(--backgroundAlt)] text-[var(--text)]"
                : "text-[var(--text)] hover:bg-white/60"
            }`
          : `rounded-full px-3 py-2 text-sm transition-all ${
              active === item.id
                ? "bg-[var(--backgroundAlt)] text-[var(--text)]"
                : "hover:bg-[var(--backgroundAlt)] text-[var(--textMuted)]"
            }`
      }
      style={{
        fontFamily: "var(--font)",
        borderColor: "var(--line)",
        backdropFilter: isMobile ? "blur(2px)" : undefined
      }}
      
    >
      {item.label}
    </a>
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b" style={{ borderColor: "var(--line)" }}>
      <div className="mx-auto max-w-6xl px-4">
        {/* Row */}
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <a
            href={idToPath["home"]}
            onClick={(e) => { e.preventDefault(); navigateTo("home"); setOpen(false); }}
            className="flex items-center gap-2 font-semibold"
            style={{ color: "var(--text)", fontFamily: "var(--font)" }}
          >
            <img src="/logo.png" alt="Ben Bachmann logo" width={28} height={28} style={{ display: "block", borderRadius: "6px" }} />
            <span>Ben</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-2 sm:gap-4">
            {items.map((item) => (
              <NavLink key={item.id} item={item} />
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="sm:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl"
            style={{
              background: open
                ? "linear-gradient(135deg, var(--green), var(--blue))"
                : "linear-gradient(135deg, rgba(255,255,255,0.75), rgba(255,255,255,0.55))",
              color: open ? "#fff" : "var(--text)",
              boxShadow: "var(--shadow-soft)",
              border: "1px solid var(--line)",
              backdropFilter: "blur(6px)"
            }}
          >
            {open ? <Icon name="close" className="h-5 w-5" /> : <Icon name="menu" className="h-5 w-5" />}
          </button>

        </div>
      </div>

      {/* Mobile slide-down menu */}
      <div
        className="sm:hidden transition-[max-height] duration-300 ease-out overflow-hidden"
        style={{ maxHeight: open ? "360px" : "0px" }}
      >
        <div
          className="mx-auto max-w-6xl px-3"
          style={{ paddingTop: open ? "10px" : "0px", paddingBottom: open ? "12px" : "0px" }}
        >
          <div
            className="rounded-2xl border"
            style={{
              borderColor: "var(--line)",
              background: "linear-gradient(160deg, var(--grad-sectionA), rgba(255,255,255,0.88))",
              boxShadow: "var(--shadow-soft)",
              backdropFilter: "blur(10px)"
            }}
          >
            <div className="p-2">
              <div className="grid gap-1">
                {items.map((item) => (
                  <NavLink key={item.id} item={item} isMobile />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t" style={{ borderColor: "var(--line)", background: "var(--background)" }}>
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 sm:grid-cols-3 items-center">
        <div className="sm:col-span-2">
          <h3 className="font-semibold" style={{ fontFamily: "var(--font)", fontSize: "var(--fs-h3)", color: "var(--text)" }}>
            Join my mailing list for new writing and ideas
          </h3>
          <p className="mt-1 text-sm" style={{ color: "var(--textMuted)", fontFamily: "var(--font)" }}>
            No spam. Occasional essays and project updates.
          </p>
        </div>
        <NewsletterForm />
      </div>
      <div className="border-t py-6" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs" style={{ color: "var(--textMuted)", fontFamily: "var(--font)" }}>
            © {new Date().getFullYear()} Ben
          </span>
          <div className="flex gap-4 text-sm">
            {CONTACT.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: "var(--textMuted)", fontFamily: "var(--font)" }} aria-label={s.aria}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// =========================
// PAGES
// =========================
function HomePage({ navigateTo }) {
  return (
    <main>
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, var(--grad-sectionA), transparent), var(--background)` }}>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <Card className="p-10 sm:p-12" style={{ background: `linear-gradient(160deg, var(--grad-cardFrom), var(--grad-cardTo))` }}>
            <div className="max-w-3xl">
              <h1 className="font-semibold tracking-tight" style={{ fontSize: "var(--fs-h1)", color: "var(--text)", fontFamily: "var(--font)" }}>
                {HOME_HERO.name}
              </h1>
              <p className="mt-4 text-lg leading-relaxed" style={{ color: "var(--text)", opacity: 0.92, fontFamily: "var(--font)" }}>
                {HOME_HERO.tagline}
              </p>
              <div className="mt-8 flex gap-3">
                <a
                  href={idToPath["writing"]}
                  onClick={(e) => { e.preventDefault(); navigateTo("writing"); }}
                  className="px-5 py-3 font-medium"
                  style={{
                    background: "linear-gradient(135deg, var(--green), var(--blue))",
                    color: "white",
                    borderRadius: "var(--radius-button)",
                    fontFamily: "var(--font)",
                  }}
                >
                  Read my writing
                </a>
                <a
                  href={idToPath["about"]}
                  onClick={(e) => { e.preventDefault(); navigateTo("about"); }}
                  className="px-5 py-3 font-medium"
                  style={{
                    background: "linear-gradient(135deg, var(--green), var(--blue))",
                    color: "white",
                    borderRadius: "var(--radius-button)",
                    fontFamily: "var(--font)",
                  }}
                >
                  About Me
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {WRITING_CARDS.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-semibold" style={{ fontSize: "var(--fs-h2)", color: "var(--text)", fontFamily: "var(--font)" }}>
              Featured Writing
            </h2>
            <a
              href={idToPath["writing"]}
              onClick={(e) => { e.preventDefault(); navigateTo("writing"); }}
              className="text-sm hover:underline"
              style={{ color: "var(--textMuted)", fontFamily: "var(--font)" }}
            >
              View all
            </a>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WRITING_CARDS.slice(0, 3).map((post) => (
              <WritingCard key={post.title} post={post} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <section>
        <Card className="p-4 sm:p-6" style={{ background: `linear-gradient(150deg, var(--grad-cardFrom), #ffffff)` }}>
          <div className="grid gap-6 md:grid-cols-5 items-center">
            <div className="md:col-span-2 overflow-hidden rounded-2xl">
              <img src={ABOUT.photoUrl} alt="Portrait" className="w-full h-full object-cover" />
            </div>
            <div className="md:col-span-3">
              <h1 className="font-semibold mb-4" style={{ fontSize: "var(--fs-h1)", color: "var(--text)", fontFamily: "var(--font)" }}>
                About
              </h1>
              <p className="leading-relaxed text-[1.05rem] whitespace-pre-line" style={{ color: "var(--text)", fontFamily: "var(--font)" }}>
                {ABOUT.bio}
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-12 grid gap-6 sm:grid-cols-2">
        {ABOUT.highlights.map((group) => (
          <Card key={group.title} className="p-6" style={{ background: `linear-gradient(165deg, #ffffff, var(--grad-cardTo))` }}>
            <h3 className="font-medium" style={{ fontSize: "var(--fs-h3)", color: "var(--text)", fontFamily: "var(--font)" }}>
              {group.title}
            </h3>
            <ul className="mt-4 space-y-2 list-disc pl-5">
              {group.items.map((it) => (
                <li key={it} className="text-[var(--textMuted)]" style={{ fontFamily: "var(--font)" }}>
                  {it}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </section>
    </main>
  );
}

function WritingCard({ post }) {
  return (
    <Card className="p-6 flex flex-col" style={{ background: `linear-gradient(155deg, #fff, var(--grad-cardTo))` }}>
      <div className="flex gap-2 mb-3">
        {post.tags?.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>
      <h3 className="font-semibold" style={{ fontSize: "1.125rem", color: "var(--text)", fontFamily: "var(--font)" }}>
        {post.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--textMuted)", fontFamily: "var(--font)" }}>
        {post.excerpt}
      </p>
      <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--line)" }}>
        <a href={post.href} className="text-sm font-medium hover:underline" style={{ color: "var(--blue)", fontFamily: "var(--font)" }}>
          Read more →
        </a>
      </div>
    </Card>
  );
}

function WritingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="flex items-end justify-between mb-6">
        <h1 className="font-semibold" style={{ fontSize: "var(--fs-h1)", color: "var(--text)", fontFamily: "var(--font)" }}>
          Writing
        </h1>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {WRITING_CARDS.map((post) => (
          <WritingCard key={post.title} post={post} />
        ))}
      </div>
    </main>
  );
}

function FavouritesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="flex items-end justify-between mb-6">
        <h1 className="font-semibold" style={{ fontSize: "var(--fs-h1)", color: "var(--text)", fontFamily: "var(--font)" }}>
          Favourites
        </h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FAVOURITES.map((cat) => (
          <Card
            key={cat.title}
            className="p-6"
            style={{ background: `linear-gradient(155deg, #fff, var(--grad-cardTo))` }}
          >
            <h3
              className="font-semibold mb-4"
              style={{ fontSize: "var(--fs-h3)", color: "var(--text)", fontFamily: "var(--font)" }}
            >
              {cat.title}
            </h3>

            {/* Replaces bullet list with link chips */}
            <div className="flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <LinkChip key={item} href={linkFor(cat.title, item)}>
                  {item}
                </LinkChip>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}


function NovelPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <h1 className="font-semibold mb-6" style={{ fontSize: "var(--fs-h1)", color: "var(--text)", fontFamily: "var(--font)" }}>
        {NOVEL.title}
      </h1>

      <section className="grid gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-3" style={{ background: `linear-gradient(165deg, var(--grad-cardFrom), #ffffff)` }}>
          <h2 className="font-medium mb-2" style={{ fontSize: "var(--fs-h3)", color: "var(--text)", fontFamily: "var(--font)" }}>
            Project Overview
          </h2>
          <p className="leading-relaxed" style={{ color: "var(--text)", fontFamily: "var(--font)" }}>
            {NOVEL.description}
          </p>
        </Card>
        <Card className="p-6 lg:col-span-2" style={{ background: `linear-gradient(165deg, #ffffff, var(--grad-cardTo))` }}>
          <h2 className="font-medium mb-2" style={{ fontSize: "var(--fs-h3)", color: "var(--text)", fontFamily: "var(--font)" }}>
            Intent & Inspiration
          </h2>
          <p className="leading-relaxed" style={{ color: "var(--text)", fontFamily: "var(--font)" }}>
            {NOVEL.intent}
          </p>
        </Card>
      </section>

      <section className="mt-8">
        <Card className="p-6">
          <p className="text-sm" style={{ color: "var(--textMuted)", fontFamily: "var(--font)" }}>
            This page will evolve as the manuscript does. Nothing overdone: clarity first.
          </p>
        </Card>
      </section>
    </main>
  );
}

function ContactPage() {
  const onSubmit = (e) => {
    e.preventDefault();
    alert("Thanks — this demo contact form doesn't submit yet. Wire it to your backend or a form service.");
  };
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="font-semibold" style={{ fontSize: "var(--fs-h1)", color: "var(--text)", fontFamily: "var(--font)" }}>
          Contact
        </h1>
        <p className="mt-3 text-[var(--textMuted)]" style={{ fontFamily: "var(--font)" }}>
          {CONTACT.blurb}
        </p>
      </div>

      <Card className="p-6 mt-8 max-w-2xl" style={{ background: `linear-gradient(165deg, #ffffff, var(--grad-cardTo))` }}>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm" style={{ color: "var(--text)", fontFamily: "var(--font)" }}>Name</label>
            <input
              type="text"
              required
              className="px-4 py-3 border focus:outline-none"
              style={{ borderColor: "var(--line)", background: "#fff", color: "var(--text)", borderRadius: "var(--radius-input)", fontFamily: "var(--font)" }}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm" style={{ color: "var(--text)", fontFamily: "var(--font)" }}>Email</label>
            <input
              type="email"
              required
              className="px-4 py-3 border focus:outline-none"
              style={{ borderColor: "var(--line)", background: "#fff", color: "var(--text)", borderRadius: "var(--radius-input)", fontFamily: "var(--font)" }}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm" style={{ color: "var(--text)", fontFamily: "var(--font)" }}>Message</label>
            <textarea
              required
              rows={6}
              className="px-4 py-3 border focus:outline-none resize-y"
              style={{ borderColor: "var(--line)", background: "#fff", color: "var(--text)", borderRadius: "var(--radius-input)", fontFamily: "var(--font)" }}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-5 py-3 font-medium"
              style={{
                background: "linear-gradient(135deg, var(--green), var(--blue))",
                color: "white",
                borderRadius: "var(--radius-button)",
                fontFamily: "var(--font)",
              }}
            >
              Send
            </button>
            <p className="text-xs" style={{ color: "var(--textMuted)", fontFamily: "var(--font)" }}>
              Prefer email? — add a mailto link here.
            </p>
          </div>
        </form>
      </Card>

      <div className="mt-6 flex gap-4 text-sm">
        {CONTACT.socials.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: "var(--textMuted)", fontFamily: "var(--font)" }} aria-label={s.aria}>
            {s.label}
          </a>
        ))}
      </div>
    </main>
  );
}

// =========================
/* ROOT APP */
// =========================
export default function App() {
  useCSSVars();
  const { route, navigateTo } = usePathRoute("home");

  const Page = useMemo(() => {
    if (route === "home" && PAGES_ENABLED.home) return <HomePage navigateTo={navigateTo} />;
    if (route === "about" && PAGES_ENABLED.about) return <AboutPage />;
    if (route === "writing" && PAGES_ENABLED.writing) return <WritingPage />;
    if (route === "novel" && PAGES_ENABLED.novel) return <NovelPage />;
    if (route === "favourites" && PAGES_ENABLED.favourites) return <FavouritesPage />;
    if (route === "contact" && PAGES_ENABLED.contact) return <ContactPage />;
    return <HomePage navigateTo={navigateTo} />;
  }, [route, navigateTo]);

  return (
    <div
      className="min-h-screen"
      style={{
        background: `radial-gradient(1200px 600px at 80% -10%, var(--grad-sectionA), transparent 60%),
                     radial-gradient(900px 500px at -10% 0%, var(--grad-sectionB), transparent 60%),
                     var(--background)`,
        color: "var(--text)",
        fontFamily: "var(--font)",
        overflowX: "hidden",
      }}
    >
      <Navbar active={route} navigateTo={navigateTo} />
      {Page}
      <Footer />
    </div>
  );
}

// =========================
// NOTES
// =========================
// - Desktop keeps your original inline nav.
// - Mobile uses a hamburger button to reveal a vertical list; it won’t overflow.
// - ESC closes the mobile menu; body scroll is disabled while open for a tidy UX.
// - If you ever add more nav items, the mobile menu auto-stacks without layout issues.
