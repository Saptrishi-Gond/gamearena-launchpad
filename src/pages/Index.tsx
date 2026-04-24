import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { GameCard } from "@/components/GameCard";
import { TournamentCard } from "@/components/TournamentCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Flame, Trophy, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-arena.jpg";
import ffImg from "@/assets/game-freefire.jpg";
import bgmiImg from "@/assets/game-bgmi.jpg";
import fcImg from "@/assets/game-fc.jpg";

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
              <span className="font-display text-xs uppercase tracking-[0.3em] text-primary">Live Now</span>
            </div>
            <h1 className="font-display text-5xl md:text-8xl font-black leading-[0.95] mb-6 uppercase">
              Enter the<br />
              <span className="text-glow bg-gradient-fire bg-clip-text text-transparent">Battle Arena</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
              Daily Free Fire, BGMI & FC Mobile tournaments. Real cash prizes.
              Real glory. Drop in, dominate, and claim your throne.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/games/freefire">
                  <Flame className="h-5 w-5" /> Join Tournament
                </Link>
              </Button>
              <Button variant="neon" size="xl" asChild>
                <Link to="/auth?mode=signup">Create Account</Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12 max-w-xl">
              {[
                { v: "12K+", l: "Warriors" },
                { v: "₹2L+", l: "Prize Pool" },
                { v: "300+", l: "Matches/wk" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl font-black text-primary text-glow">{s.v}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-display mt-1">{s.l}</div>
                </div>
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
          <div className="font-display text-xs uppercase tracking-[0.3em] text-primary mb-2">Live Slots Open</div>
          <h2 className="font-display text-4xl md:text-5xl font-black uppercase mb-10">Upcoming Battles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tournaments.map((t) => <TournamentCard key={t.id} t={t} />)}
          </div>
        </section>
      )}

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

      {/* FOOTER */}
      <footer className="border-t border-border mt-20">
        <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            <span className="font-display font-black tracking-wider">BATTLE<span className="text-primary">ARENA</span></span>
          </div>
          <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">
            © {new Date().getFullYear()} BattleArena · Mobile Esports
          </p>
        </div>
      </footer>
    </div>
  );
}
