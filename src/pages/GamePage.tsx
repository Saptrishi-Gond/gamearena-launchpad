import { useEffect, useMemo, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import {
  BarChart3, Trophy, Search, SlidersHorizontal, Calendar, Users, X,
  TrendingUp, Radio,
} from "lucide-react";
import ffImg from "@/assets/game-freefire.jpg";
import bgmiImg from "@/assets/game-bgmi.jpg";
import fcImg from "@/assets/game-fc.jpg";
import titanImg from "@/assets/cover-titan.jpg";
import vortexImg from "@/assets/cover-vortex.jpg";

const META: Record<string, { name: string; tagline: string; warriors: string; pool: string; rank: string }> = {
  freefire: { name: "Free Fire", tagline: "Battle Royale Premiere", warriors: "2,890", pool: "₹25,00,000+", rank: "#12" },
  bgmi: { name: "BGMI", tagline: "Tactical Royale Premiere", warriors: "4,120", pool: "₹40,00,000+", rank: "#08" },
  fc: { name: "FC Mobile", tagline: "1v1 Football Premiere", warriors: "1,540", pool: "₹15,00,000+", rank: "#21" },
};

type Tab = "active" | "upcoming" | "completed" | "mine";
const TABS: { id: Tab; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "mine", label: "My Registrations" },
];

const FILTERS = [
  { k: "FORMAT", v: "SQUAD" },
  { k: "ENTRY", v: "₹0 - ₹500" },
  { k: "REGION", v: "ASIA-SOUTH" },
];

type Card = {
  id: string;
  badge: { label: string; tone: "live" | "open" | "pro" };
  title: string;
  image: string;
  prize: string;
  fee: string;
  date: string;
  slots: string;
  progress: number;
  cta: string;
  ctaTone: "primary" | "muted";
};

const CARDS: Card[] = [
  { id: "1", badge: { label: "● LIVE", tone: "live" }, title: "Titan Clash Series", image: titanImg, prize: "₹50,000", fee: "FREE", date: "Today, 08:30 PM", slots: "120/128 Slots", progress: 94, cta: "Join Now", ctaTone: "primary" },
  { id: "2", badge: { label: "Registration Open", tone: "open" }, title: "Neon Strike Masters", image: bgmiImg, prize: "₹1,20,000", fee: "₹100", date: "22 Oct, 10:00 PM", slots: "45/100 Squads", progress: 45, cta: "Register Now", ctaTone: "muted" },
  { id: "3", badge: { label: "Pro Circuit", tone: "pro" }, title: "Vortex Elite Open", image: vortexImg, prize: "₹75,000", fee: "₹50", date: "Tomorrow, 09:00 PM", slots: "12/32 Teams", progress: 38, cta: "Join Now", ctaTone: "primary" },
];

const badgeStyles: Record<Card["badge"]["tone"], string> = {
  live: "bg-secondary text-secondary-foreground",
  open: "bg-primary/90 text-primary-foreground",
  pro: "bg-neon-yellow text-background",
};

export default function GamePage() {
  const { slug } = useParams<{ slug: string }>();
  const meta = slug ? META[slug] : undefined;
  const [tab, setTab] = useState<Tab>("active");
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState(FILTERS);

  useEffect(() => {
    if (!meta) return;
    document.title = `${meta.name} Tournaments — BattleArena`;
  }, [meta]);

  const visible = useMemo(() => CARDS.filter(c => c.title.toLowerCase().includes(q.toLowerCase())), [q]);

  if (!meta) return <Navigate to="/games" replace />;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <div className="container relative py-20 md:py-28">
          <div className="flex gap-6">
            <div className="hidden md:flex flex-col gap-3 pt-12">
              {[BarChart3, Trophy, Search].map((Icon, i) => (
                <button key={i} className="h-10 w-10 rounded-md surface-1 border border-border grid place-items-center text-muted-foreground hover:text-primary hover:border-primary/60 transition-all">
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-10 bg-primary/70" />
                <span className="text-[11px] uppercase tracking-[0.4em] text-primary">{meta.tagline}</span>
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="font-display italic text-7xl md:text-9xl uppercase leading-[0.9] tracking-tight"
                style={{ textShadow: "0 4px 40px hsl(215 90% 78% / 0.2)" }}
              >
                {meta.name}
              </motion.h1>

              <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
                <Stat label="Active Warriors" value={meta.warriors} badge={
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-secondary"><Radio className="h-3 w-3" /> Live</span>
                } />
                <Stat label="Total Prize Pool" value={meta.pool} valueClass="text-primary" />
                <Stat label="Global Rank" value={meta.rank} badge={<TrendingUp className="h-4 w-4 text-primary" />} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TABS + SEARCH */}
      <section className="container pb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1 surface-1 border border-border rounded-full p-1.5 w-fit">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 md:px-5 py-2 text-xs uppercase tracking-wider rounded-full transition-all ${
                  tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >{t.label}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Search Tournament Name…"
                className="h-10 pl-9 pr-4 w-72 rounded-full surface-1 border border-border focus:border-primary/60 outline-none text-sm"
              />
            </div>
            <button className="h-10 w-10 grid place-items-center rounded-full surface-1 border border-border text-muted-foreground hover:text-primary hover:border-primary/40">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {filters.map(f => (
            <button key={f.k} onClick={() => setFilters(filters.filter(x => x.k !== f.k))}
              className="group inline-flex items-center gap-2 px-3 py-1.5 surface-1 border border-border rounded-full text-xs uppercase tracking-wider hover:border-primary/40">
              <span className="text-muted-foreground">{f.k}:</span>
              <span>{f.v}</span>
              <X className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
            </button>
          ))}
          {filters.length > 0 && (
            <button onClick={() => setFilters([])} className="text-xs uppercase tracking-wider text-primary hover:underline ml-1">Clear All</button>
          )}
        </div>
      </section>

      {/* CARDS */}
      <section className="container pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group surface-1 border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:-translate-y-1 transition-all"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${badgeStyles[c.badge.tone]}`}>
                    {c.badge.label}
                  </span>
                </div>
                <h3 className="absolute bottom-3 left-4 right-4 font-display italic text-xl md:text-2xl uppercase">{c.title}</h3>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Prize Pool</div>
                    <div className="font-display text-xl text-primary">{c.prize}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Entry Fee</div>
                    <div className="font-display text-xl">{c.fee}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                  <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {c.date}</span>
                  <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {c.slots}</span>
                </div>
                <div className="h-1 bg-muted/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{ width: `${c.progress}%` }} />
                </div>
                <Link to={`/tournament/${c.id}`}
                  className={`block text-center w-full py-2.5 rounded-full text-sm font-semibold transition-all ${
                    c.ctaTone === "primary"
                      ? "bg-primary text-primary-foreground hover:brightness-110 hover:shadow-glow"
                      : "surface-2 text-foreground border border-border hover:border-primary/40"
                  }`}
                >{c.cta}</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Stat({ label, value, valueClass = "", badge }: { label: string; value: string; valueClass?: string; badge?: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1.5">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className={`font-display text-3xl md:text-4xl ${valueClass}`}>{value}</span>
        {badge}
      </div>
    </div>
  );
}
