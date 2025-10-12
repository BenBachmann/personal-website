import React, { useEffect, useMemo, useState } from "react";

/**
 * BEN'S PERSONAL WEBSITE — Single‑file React app (Full Site)
 * ---------------------------------------------------------------
 * Pages: Home, About, Writing, A Novel: Upcoming, Contact
 * Modern alpine palette with richer, controllable gradients and tall, clean typography.
 * Everything is theme‑driven via CSS variables for easy tuning.
 */

// =========================
// THEME — EDIT HERE
// =========================
const THEME = {
  // Intensify or soften the site quickly by changing these alphas (0 → 1)
  intensity: {
    tint: 0.18, // section background washes
    card: 0.24, // card gradient strength
    badge: 0.18, // tag/badge wash
  },
  colors: {
    // Base surfaces
    background: "#ECF4F7",
    backgroundAlt: "#E2EFF1",

    // Text
    text: "#0A1A28",
    textMuted: "#5A6A75",

    // Alpine hues
    green: "#2F8E75",
    blue: "#2F76B4",
    grey: "#8DA3AE",

    // Wildflower accents
    accent1: "#8166B1", // alpine violet
    accent2: "#D3A43E", // arnica gold

    // Lines
    line: "#D8E0E3",
  },
  // Card gradient stops (edit to change color character). Use rgba with any alpha.
  gradients: {
    cardFrom: "rgba(47, 142, 117, 0.30)", // greenish
    cardTo: "rgba(47, 118, 180, 0.14)",   // blueish
    sectionA: "rgba(47,118,180,0.18)",    // blue tint
    sectionB: "rgba(129,102,177,0.14)",   // violet tint
    badgeA: "rgba(47,142,117,0.22)",
    badgeB: "rgba(47,118,180,0.18)",
  },
  radii: { card: "1.25rem", input: "0.875rem", button: "0.875rem" },
  shadows: {
    card: "0 14px 40px rgba(12, 22, 41, 0.12)",
    soft: "0 4px 14px rgba(12, 22, 41, 0.10)",
  },
  fontFamily:
    '"Plus Jakarta Sans", "Inter Tight", "IBM Plex Sans", system-ui, sans-serif',
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
  home: true,
  about: true,
  writing: true,
  novel: true, // set to false to hide "A Novel: Upcoming"
  favourites: true, // NEW PAGE
  contact: true,
};

// =========================
// CONTENT — EDIT HERE
// =========================
const HOME_HERO = {
  name: "Ben Bachmann",
  tagline: "Writer, Thinker, Scientist, Musician",
};

const ABOUT = {
  photoUrl:
    "profile_picture.jpg",
  bio: `My name is Ben Bachmann. My goal is to bring into public life a point of view that is both modern and rooted in classical thought. My background includes degrees in both the natural sciences and humanities, experience at tech startups, as well as extensive training as a classical musician. I am currently completing a novel, and I regularly post articles on a wide range of topics on Substack.`,
  highlights: [
    {
      title: "Current Work",
      items: [
        "Weekly essays on Substack",
        "A novel in progress: structure, voice, and moral stakes",
        "Research on European intellectual history and infrastructure",
      ],
    },
    {
      title: "Interests",
      items: [
        "Aesthetics across arts",
        "Science & engineering culture",
        "Travel, landscape, and modernity",
      ],
    },
  ],
};

const WRITING_CARDS = [
  {
    title: "The Dawn of the Post‑Literate Society",
    excerpt:
      "On screens, sound, and the shifting weight of text — and how thinking must adapt without collapsing.",
    href: "#",
    tags: ["essay", "culture"],
  },
  {
    title: "Beauty with Teeth: Toward a Modern Classicism",
    excerpt:
      "An argument for severity and warmth together: the line that holds while letting life in.",
    href: "#",
    tags: ["aesthetics"],
  },
  {
    title: "Infrastructure as Fate",
    excerpt:
      "Why pipes, grids, and protocols silently govern the horizons of a civilization.",
    href: "#",
    tags: ["systems", "history"],
  },
  {
    title: "Against Decorative Thought",
    excerpt: "How to keep prose sharp without losing humanity.",
    href: "#",
    tags: ["craft"],
  },
];

const NOVEL = {
  title: "A Novel: Upcoming",
  description:
    "An exploration of loyalty, betrayal, and the modern appetite for transcendence. Set between Boston, Munich, and the American West, the story follows a mind stretched between clarity and desire.",
  intent:
    "To write with classical backbone and contemporary eyes — a narrative that moves, thinks, and burns without ornamentation. The project is in active development; updates will appear here as the structure locks.",
};

const FAVOURITES = [
  { title: "Movies", items: [
      "Lawrence of Arabia",
      "Barry Lyndon",
      "Brief Encounter",
      "Vertigo",
      "The Bridge on the River Kwai",
      "Tokyo Story"
    ] },
  { title: "Authors", items: [
      "Leo Tolstoy",
      "Fyodor Dostoevsky",
      "Charles Dickens",
      "Ernest Hemingway",
      "Homer",
      "Sophocles"
    ] },
  { title: "Orchestral Pieces", items: [
      "Beethoven- Symphony No. 3 \"Eroica\"",
      "Beethoven- Egmont Overture",
      "Beethoven- Piano Concerto No.5 \"Emperor\"",
    ] },
  { title: "Piano Pieces", items: [
      "Beethoven- Sonata No.23 \"Appassionata\"",
      "Schubert- Wanderer Fantasie",
      "Schubert- Sonata No.21",
      "Schumann- Fantasie in C",
      "Ravel- Gaspard de la Nuit"
    ] },  
  { title: "Films Since 2000", items: [
      "There Will Be Blood",
      "Ex Machina",
      "Mulholland Drive",
      "Inglourious Basterds",
      "Melancholia",
      "The Tree of Life",
      "Arrival"
    ] },
    { title: "Contemporary Authors", items: [
      "Sally Rooney",
      "Haruki Murakami",
      "Jonathan Franzen",
      "Christian Kracht"
    ] },
    { title: "American National Parks", items: [
      "Arches",
      "Bryce Canyon",
      "Grand Canyon",
      "North Cascades",
      "Theodore Roosevelt"
    ] },
    { title: "European Cities", items: [
      "Vienna",
      "London",
      "Florence",
      "Prague",
      "Granada"
    ] },
    { title: "Philosophers", itmes: [
      "Friedrich Nietzsche",
      "Aristotle",
      "Plato"
    ]}
];

const CONTACT = {
  blurb:
    "For speaking, editorial collaborations, or thoughtful correspondence, use the form below. I read everything.",
  socials: [
    { label: "X", href: "https://x.com/", aria: "X (Twitter)" },
    { label: "Substack", href: "https://substack.com", aria: "Substack" },
    { label: "YouTube", href: "https://youtube.com", aria: "YouTube" },
    { label: "LinkedIn", href: "https://linkedin.com", aria: "LinkedIn" },
  ],
};

// =========================
// CSS VARS
// =========================
function useCSSVars() {
  useEffect(() => {
    const r = document.documentElement;
    const set = (k, v) => r.style.setProperty(k, v);

    // colors
    Object.entries(THEME.colors).forEach(([k, v]) => set(`--${k}`, v));

    // intensity
    Object.entries(THEME.intensity).forEach(([k, v]) => set(`--int-${k}`, String(v)));

    // gradients
    Object.entries(THEME.gradients).forEach(([k, v]) => set(`--grad-${k}`, v));

    // radii & shadows
    set("--radius-card", THEME.radii.card);
    set("--radius-input", THEME.radii.input);
    set("--radius-button", THEME.radii.button);
    set("--shadow-card", THEME.shadows.card);
    set("--shadow-soft", THEME.shadows.soft);

    // type
    set("--font", THEME.fontFamily);
    set("--fs-h1", THEME.fontScale.h1);
    set("--fs-h2", THEME.fontScale.h2);
    set("--fs-h3", THEME.fontScale.h3);
    set("--fs-body", THEME.fontScale.body);
    set("--fs-small", THEME.fontScale.small);
  }, []);
}

// =========================
// ROUTER (hash)
// =========================
const ROUTES = [
  { id: "home", label: "Home", path: "#/home" },
  { id: "about", label: "About", path: "#/about" },
  { id: "writing", label: "Writing", path: "#/writing" },
  { id: "novel", label: "A Novel: Upcoming", path: "#/novel" },
  { id: "favourites", label: "Favourites", path: "#/favourites" }, // inserted before Contact
  { id: "contact", label: "Contact", path: "#/contact" },
];

function useHashRoute(defaultRoute = "home") {
  const [route, setRoute] = useState(() => currentFromHash(defaultRoute));
  useEffect(() => {
    const onHash = () => setRoute(currentFromHash(defaultRoute));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [defaultRoute]);
  return route;
}

function currentFromHash(fallback) {
  const id = window.location.hash.replace("#/", "") || fallback;
  return PAGES_ENABLED[id] ? id : fallback;
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
        border: `1px solid var(--line)` ,
        borderRadius: "var(--radius-card)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
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

// =========================
// LAYOUT
// =========================
function Navbar({ active }) {
  const items = ROUTES.filter((r) => PAGES_ENABLED[r.id]);
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b" style={{ borderColor: "var(--line)" }}>
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <a href="#/home" className="flex items-center gap-2 font-semibold" style={{ color: "var(--text)", fontFamily: "var(--font)" }}>
          {/* Circular alpine logo */}
          <span aria-hidden className="inline-flex h-7 w-7 rounded-full shadow-sm" style={{
            background: "conic-gradient(from 200deg, var(--green), var(--blue), var(--accent1))",
          }} />
          <span>Ben</span>
        </a>
        <nav className="flex items-center gap-2 sm:gap-4">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.path}
              className={`rounded-full px-3 py-2 text-sm transition-all ${
                active === item.id
                  ? "bg-[var(--backgroundAlt)] text-[var(--text)]"
                  : "hover:bg-[var(--backgroundAlt)] text-[var(--textMuted)]"
              }`}
              style={{ fontFamily: "var(--font)" }}
            >
              {item.label}
            </a>
          ))}
        </nav>
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
function HomePage() {
  return (
    <main>
      {/* Alpine wash */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, var(--grad-sectionA), transparent), var(--background)` }}>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          {/* Big hero card */}
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
                  href="#/writing"
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
                  href="#/writing"
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

      {/* Featured writing */}
      {WRITING_CARDS.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-semibold" style={{ fontSize: "var(--fs-h2)", color: "var(--text)", fontFamily: "var(--font)" }}>
              Featured Writing
            </h2>
            <a href="#/writing" className="text-sm hover:underline" style={{ color: "var(--textMuted)", fontFamily: "var(--font)" }}>
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
      {/* Combined photo + bio in one card */}
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

      {/* Highlights remain as separate cards */}
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
        <div className="text-sm" style={{ color: "var(--textMuted)", fontFamily: "var(--font)" }}>
          Minimal, card‑first layout
        </div>
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
        <div className="text-sm" style={{ color: "var(--textMuted)", fontFamily: "var(--font)" }}>
          A living index of things I return to
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FAVORITES.map((cat) => (
          <Card key={cat.title} className="p-6" style={{ background: `linear-gradient(155deg, #fff, var(--grad-cardTo))` }}>
            <h3 className="font-semibold mb-3" style={{ fontSize: "var(--fs-h3)", color: "var(--text)", fontFamily: "var(--font)" }}>
              {cat.title}
            </h3>
            <ul className="space-y-2 list-disc pl-5">
              {cat.items.map((item) => (
                <li key={item} className="text-sm leading-relaxed" style={{ color: "var(--textMuted)", fontFamily: "var(--font)" }}>
                  {item}
                </li>
              ))}
            </ul>
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
// ROOT APP
// =========================
export default function App() {
  useCSSVars();
  const route = useHashRoute("home");

  const Page = useMemo(() => {
    if (route === "home" && PAGES_ENABLED.home) return <HomePage />;
    if (route === "about" && PAGES_ENABLED.about) return <AboutPage />;
    if (route === "writing" && PAGES_ENABLED.writing) return <WritingPage />;
    if (route === "novel" && PAGES_ENABLED.novel) return <NovelPage />;
    if (route === "favourites" && PAGES_ENABLED.favourites) return <FavouritesPage />;
    if (route === "contact" && PAGES_ENABLED.contact) return <ContactPage />;
    return <HomePage />;
  }, [route]);

  return (
    <div
      className="min-h-screen"
      style={{
        background: `radial-gradient(1200px 600px at 80% -10%, var(--grad-sectionA), transparent 60%),
                     radial-gradient(900px 500px at -10% 0%, var(--grad-sectionB), transparent 60%),
                     var(--background)`,
        color: "var(--text)",
        fontFamily: "var(--font)",
        overflowX: "hidden",     // <- add this
      }}
    >
      <Navbar active={route} />
      {Page}
      <Footer />
    </div>
  );
}

// =========================
// NOTES
// =========================
// 1) Boldness dial: edit THEME.gradients.cardFrom/cardTo and their alpha; or adjust THEME.intensity.card/badge/tint then mirror in rgba values.
// 2) To make cards flatter, set gradients to low alpha or pure #fff; to go bolder, raise the rgba alphas.
// 3) To remove the Novel page, set PAGES_ENABLED.novel = false.
// 4) Wire forms to your ESP (Substack/Mailchimp/Buttondown) or serverless API.
// 5) Swap fonts by changing THEME.fontFamily; add a <link> to the font in your index.html if needed.
