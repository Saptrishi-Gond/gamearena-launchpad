import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  BarChart3, Trophy, Search, SlidersHorizontal, Calendar, Users, X,
  TrendingUp, Radio, Flame,
} from "lucide-react";
import { Link } from "react-router-dom";
import ffImg from "@/assets/game-freefire.jpg";
import bgmiImg from "@/assets/game-bgmi.jpg";
import fcImg from "@/assets/game-fc.jpg";

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
  feeFree?: boolean;
  date: string;
  slots: string;
  progress: number;
  cta: string;
  ctaTone: "primary" | "muted";
};

const CARDS: Card[] = [
  {
    id: "1",
    badge: { label: "● LIVE", tone: "live" },
    title: "TITAN CLASH SERIES",
    image: ffImg,
    prize: "₹50,000",
    fee: "FREE",
    feeFree: true,
    date: "Today, 08:30 PM",
    slots: "120/128 Slots",
    progress: 94,
    cta: "JOIN NOW",
    ctaTone: "primary",
  },
  {
    id: "2",
    badge: { label: "REGISTRATION OPEN", tone: "open" },
    title: "NEON STRIKE MASTERS",
    image: bgmiImg,
    prize: "₹1,20,000",
    fee: "₹100",
    date: "22 Oct, 10:00 PM",
    slots: "45/100 Squads",
    progress: 45,
    cta: "REGISTER NOW",
    ctaTone: "muted",
  },
  {
    id: "3",
    badge: { label: "PRO CIRCUIT", tone: "pro" },
    title: "VORTEX ELITE OPEN",
    image: fcImg,
    prize: "₹75,000",
    fee: "₹50",
    date: "Tomorrow, 09:00 PM",
    slots: "12/32 Teams",
    progress: 38,
    cta: "JOIN NOW",
    ctaTone: "primary",
  },
];

const badgeStyles: Record<Card["badge"]["tone"], string> = {
  live: "bg-secondary text-secondary-foreground",
  open: "bg-accent/90 text-accent-foreground",
  pro: "bg-neon-yellow text-background",
};

export default function Index() {
  const [tab, setTab] = useState<Tab>("active");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(FILTERS);

  useEffect(() => {
    document.title = "BattleArena — Free Fire Tournaments";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Free Fire battle royale tournaments. Cash prizes. Daily matches. Register now.");
  }, []);

  const visible = useMemo(
    () => CARDS.filter((c) => c.title.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Teal radial glow background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,hsl(180_60%_25%/0.55),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,hsl(200_70%_30%/0.4),transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
        </div>

        <div className="container relative py-20 md:py-28">
          <div className="flex gap-6">
            {/* Side icon rail */}
            <div className="hidden md:flex flex-col gap-3 pt-12">
              {[BarChart3, Trophy, Search].map((Icon, i) => (
                <button
                  key={i}
                  className="h-10 w-10 rounded-md bg-muted/40 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/60 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="h-px w-10 bg-accent/70" />
                <span className="font-display text-[11px] uppercase tracking-[0.35em] text-accent">
                  Battle Royale Premiere
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-display italic font-black text-6xl md:text-8xl lg:text-9xl uppercase leading-[0.9] tracking-tight"
                style={{ textShadow: "0 4px 40px hsl(180 100% 50% / 0.15)" }}
              >
                Free Fire
              </motion.h1>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-10 flex flex-wrap gap-x-12 gap-y-6"
              >
                <Stat
                  label="Active Warriors"
                  value="2,890"
                  badge={
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-display uppercase tracking-wider text-secondary">
                      <Radio className="h-3 w-3" /> Live
                    </span>
                  }
                />
                <Stat label="Total Prize Pool" value="₹25,00,000+" valueClass="text-accent" />
                <Stat
                  label="Global Rank"
                  value="#12"
                  badge={
                    <span className="inline-flex items-center gap-1 text-accent">
                      <TrendingUp className="h-4 w-4" />
                    </span>
                  }
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* TABS + SEARCH */}
      <section className="container -mt-4 md:-mt-2 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 bg-card/40 border border-border p-1.5 rounded-md w-fit">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 md:px-5 py-2 font-display text-xs md:text-sm uppercase tracking-wider rounded-sm transition-all ${
                  tab === t.id
                    ? "bg-accent/15 text-accent border border-accent/40 shadow-[0_0_20px_hsl(180_100%_50%/0.2)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Tournament Name..."
                className="pl-9 bg-card/40 border-border h-10 rounded-md font-body"
              />
            </div>
            <button className="h-10 w-10 inline-flex items-center justify-center bg-card/40 border border-border rounded-md text-muted-foreground hover:text-accent hover:border-accent/50 transition-all">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.k}
              onClick={() => setFilters(filters.filter((x) => x.k !== f.k))}
              className="group inline-flex items-center gap-2 px-3 py-1.5 bg-muted/30 border border-border rounded-full text-xs font-display uppercase tracking-wider hover:border-accent/40 transition-colors"
            >
              <span className="text-muted-foreground">{f.k}:</span>
              <span className="text-foreground">{f.v}</span>
              <X className="h-3 w-3 text-muted-foreground group-hover:text-accent" />
            </button>
          ))}
          {filters.length > 0 && (
            <button
              onClick={() => setFilters([])}
              className="text-xs font-display uppercase tracking-wider text-accent hover:underline ml-1"
            >
              Clear All
            </button>
          )}
        </div>
      </section>

      {/* CARDS */}
      <section className="container pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((c, i) => (
            <TournamentCardV2 key={c.id} card={c} index={i} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Stat({
  label,
  value,
  valueClass = "",
  badge,
}: {
  label: string;
  value: string;
  valueClass?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div>
      <div className="font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1.5">
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`font-display text-3xl md:text-4xl font-black ${valueClass}`}>
          {value}
        </span>
        {badge}
      </div>
    </div>
  );
}

function TournamentCardV2({ card, index }: { card: Card; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative bg-card/60 border border-border rounded-lg overflow-hidden hover:border-accent/40 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image header */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-display font-bold uppercase tracking-wider ${badgeStyles[card.badge.tone]}`}
          >
            {card.badge.label}
          </span>
        </div>

        {/* Title overlay */}
        <h3 className="absolute bottom-3 left-4 right-4 font-display italic font-black text-xl md:text-2xl uppercase tracking-tight">
          {card.title}
        </h3>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] font-display uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Prize Pool
            </div>
            <div className="font-display text-lg font-black text-accent">{card.prize}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-display uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Entry Fee
            </div>
            <div
              className={`font-display text-lg font-black ${
                card.feeFree ? "text-foreground" : "text-foreground"
              }`}
            >
              {card.fee}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> {card.date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> {card.slots}
          </span>
        </div>

        {/* Progress */}
        <div className="h-1 bg-muted/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-primary"
            style={{ width: `${card.progress}%` }}
          />
        </div>

        <button
          className={`w-full py-2.5 rounded-md font-display text-sm font-bold uppercase tracking-wider transition-all ${
            card.ctaTone === "primary"
              ? "bg-accent/20 text-accent border border-accent/40 hover:bg-accent hover:text-accent-foreground"
              : "bg-muted/40 text-foreground border border-border hover:bg-muted/60"
          }`}
        >
          {card.cta}
        </button>
      </div>
    </motion.div>
  );
}
