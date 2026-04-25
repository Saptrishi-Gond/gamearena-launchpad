import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GameCard } from "@/components/GameCard";
import { TournamentCard } from "@/components/TournamentCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  Flame, Trophy, Zap, Shield, UserPlus, Calendar, Crown,
  Gift, Coins, Sparkles, Star, Quote, ArrowRight, PlayCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-arena.jpg";
import ffImg from "@/assets/game-freefire.jpg";
import bgmiImg from "@/assets/game-bgmi.jpg";
import fcImg from "@/assets/game-fc.jpg";

const podium = [
  { rank: 2, name: "ShadowOps", xp: 14820, tag: "BGMI", color: "text-muted-foreground", bg: "from-muted/40", h: "h-32" },
  { rank: 1, name: "BlazeKing", xp: 19340, tag: "Free Fire", color: "text-neon-yellow", bg: "from-neon-yellow/30", h: "h-44" },
  { rank: 3, name: "ZeroKick", xp: 12110, tag: "FC Mobile", color: "text-accent", bg: "from-accent/30", h: "h-24" },
];

const steps = [
  { i: UserPlus, t: "Create Account", d: "Sign up in 30 seconds. Claim 100 starter coins instantly.", n: "01" },
  { i: Calendar, t: "Book a Slot", d: "Pick your game, your time, your stakes. Confirm with coins.", n: "02" },
  { i: Crown, t: "Compete & Win", d: "Drop in. Outplay. Climb the leaderboard. Cash out.", n: "03" },
];

const rewards = [
  { i: Coins, t: "Daily Coins", d: "Login streak boosts your daily haul", color: "text-neon-yellow" },
  { i: Sparkles, t: "Spin Wheel", d: "Free spin every 24h — XP, coins, skins", color: "text-accent" },
  { i: Star, t: "XP Ranks", d: "Bronze to Mythic. Unlock exclusive perks", color: "text-primary" },
  { i: Gift, t: "Loot Drops", d: "Tournament rewards delivered to your vault", color: "text-secondary" },
];

const testimonials = [
  { n: "Aryan K.", r: "Free Fire · Diamond IV", q: "Won ₹5K my first week. Smoothest payout I've seen on any tournament app." },
  { n: "Priya S.", r: "BGMI · Crown II", q: "Room IDs always on time. No scams, no drama. Just pure competition." },
  { n: "Rohan M.", r: "FC Mobile · Pro", q: "The UI feels like a AAA game. Better than the apps I used before." },
];

export default function Index() {
  const [tournaments, setTournaments] = useState<any[]>([]);

  useEffect(() => {
    document.title = "BattleArena — Mobile Esports Tournaments";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Join Free Fire, BGMI & FC Mobile tournaments. Win cash prizes and climb the leaderboard.");

    supabase.from("tournaments").select("*").eq("status", "upcoming").order("match_at").limit(3)
      .then(({ data }) => setTournaments(data ?? []));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="BattleArena cyberpunk esports stadium" className="w-full h-full object-cover opacity-50" width={1920} height={1024} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
          <div className="scanline absolute inset-0 opacity-50" />
        </div>

        <div className="relative container py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary/40 bg-primary/10 mb-6 clip-angled">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="font-display text-xs uppercase tracking-[0.3em] text-primary">Live Now · Season 01</span>
            </div>
            <h1 className="font-display text-5xl md:text-8xl font-black leading-[0.95] mb-6 uppercase">
              Conquer The World<br />
              <span className="text-glow bg-gradient-fire bg-clip-text text-transparent">With Your Hand</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
              Choose your arena. Book tournaments. Win rewards. Rise to glory.
              India's premium mobile esports platform — built for warriors.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" size="xl" asChild>
                <Link to="/games/freefire">
                  <Flame className="h-5 w-5" /> Explore Games
                </Link>
              </Button>
              <Button variant="neon" size="xl" asChild>
                <Link to="/auth?mode=signup">Join Free</Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/dashboard">
                  <PlayCircle className="h-5 w-5" /> Watch Live
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 max-w-2xl">
              {[
                { v: "50K+", l: "Players" },
                { v: "₹5L+", l: "Rewards" },
                { v: "2K+", l: "Weekly Matches" },
                { v: "99%", l: "Trusted" },
              ].map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="font-display text-3xl md:text-4xl font-black text-primary text-glow">{s.v}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-display mt-1">{s.l}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* GAMES */}
      <section className="container py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="font-display text-xs uppercase tracking-[0.3em] text-primary mb-2">Choose Your Battlefield</div>
            <h2 className="font-display text-4xl md:text-5xl font-black uppercase">Pick Your Game</h2>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <GameCard slug="freefire" title="Free Fire" tagline="10-min squad chaos. Booyah or bust." image={ffImg} accent="orange" />
          <GameCard slug="bgmi" title="BGMI" tagline="Tactical battle royale. Last squad wins." image={bgmiImg} accent="red" />
          <GameCard slug="fc" title="FC Mobile" tagline="1v1 football. Skill. Reflex. Glory." image={fcImg} accent="cyan" />
        </div>
      </section>

      {/* UPCOMING */}
      {tournaments.length > 0 && (
        <section className="container py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="font-display text-xs uppercase tracking-[0.3em] text-primary mb-2">Live Slots Open</div>
              <h2 className="font-display text-4xl md:text-5xl font-black uppercase">Upcoming Battles</h2>
            </div>
            <Link to="/games/freefire" className="hidden md:inline-flex items-center gap-2 font-display text-sm uppercase tracking-wider text-primary hover:translate-x-1 transition-transform">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tournaments.map((t) => <TournamentCard key={t.id} t={t} />)}
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <div className="font-display text-xs uppercase tracking-[0.3em] text-primary mb-2">In 3 Steps</div>
          <h2 className="font-display text-4xl md:text-5xl font-black uppercase">How It Works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 relative">
          {steps.map((s, i) => (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative p-6 bg-gradient-card border border-border clip-angled overflow-hidden group"
            >
              <div className="absolute top-3 right-4 font-display text-6xl font-black text-primary/10 group-hover:text-primary/30 transition-colors">
                {s.n}
              </div>
              <div className="h-12 w-12 inline-flex items-center justify-center bg-primary/15 border border-primary/40 clip-angled mb-4">
                <s.i className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold uppercase mb-2">{s.t}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LEADERBOARD PODIUM */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <div className="font-display text-xs uppercase tracking-[0.3em] text-primary mb-2">Hall of Legends</div>
          <h2 className="font-display text-4xl md:text-5xl font-black uppercase">Top Warriors</h2>
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-3xl mx-auto items-end">
          {podium.map((p) => (
            <motion.div
              key={p.rank}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: p.rank * 0.1 }}
              className="text-center"
            >
              <div className={`mx-auto mb-3 h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-br ${p.bg} to-transparent border-2 border-border flex items-center justify-center`}>
                {p.rank === 1 ? (
                  <Crown className={`h-8 w-8 ${p.color}`} />
                ) : (
                  <Trophy className={`h-7 w-7 ${p.color}`} />
                )}
              </div>
              <div className="font-display font-bold text-sm md:text-base">{p.name}</div>
              <div className="text-xs text-muted-foreground uppercase font-display tracking-wider">{p.tag}</div>
              <div className={`font-display text-sm font-bold mt-1 ${p.color}`}>{p.xp.toLocaleString()} XP</div>
              <div className={`mt-3 ${p.h} bg-gradient-to-t ${p.bg} to-transparent border-t-2 ${p.rank === 1 ? "border-neon-yellow" : "border-border"} clip-angled flex items-start justify-center pt-2`}>
                <span className={`font-display text-3xl md:text-5xl font-black ${p.color}`}>#{p.rank}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* REWARDS PREVIEW */}
      <section className="container py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="font-display text-xs uppercase tracking-[0.3em] text-primary mb-2">Loot & Glory</div>
            <h2 className="font-display text-4xl md:text-5xl font-black uppercase">Rewards Vault</h2>
          </div>
          <Link to="/rewards" className="hidden md:inline-flex items-center gap-2 font-display text-sm uppercase tracking-wider text-primary hover:translate-x-1 transition-transform">
            Open Vault <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewards.map((r) => (
            <div key={r.t} className="p-5 bg-gradient-card border border-border clip-angled hover:border-primary/50 transition-all group">
              <r.i className={`h-8 w-8 ${r.color} mb-3 group-hover:scale-110 transition-transform`} />
              <h3 className="font-display text-base font-bold uppercase mb-1">{r.t}</h3>
              <p className="text-xs text-muted-foreground">{r.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <div className="font-display text-xs uppercase tracking-[0.3em] text-primary mb-2">Voices From The Arena</div>
          <h2 className="font-display text-4xl md:text-5xl font-black uppercase">Player Stories</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-6 bg-gradient-card border border-border clip-angled"
            >
              <Quote className="h-8 w-8 text-primary/40 mb-3" />
              <p className="text-sm text-foreground/90 mb-5 leading-relaxed">"{t.q}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center font-display font-black text-primary-foreground">
                  {t.n[0]}
                </div>
                <div>
                  <div className="font-display font-bold text-sm">{t.n}</div>
                  <div className="text-xs text-muted-foreground">{t.r}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { i: Trophy, t: "Real Prizes", d: "Win cash, coins & exclusive in-game rewards every match." },
            { i: Zap, t: "Instant Rooms", d: "Room ID & password unlock 15 min before kickoff." },
            { i: Shield, t: "Anti-Cheat", d: "Verified players. Banned hackers. Fair play guaranteed." },
          ].map((f) => (
            <div key={f.t} className="p-6 bg-gradient-card border border-border clip-angled">
              <f.i className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-display text-xl font-bold uppercase mb-2">{f.t}</h3>
              <p className="text-muted-foreground text-sm">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
