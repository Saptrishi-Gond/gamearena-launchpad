import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, Star, Zap, Crown, Shield, Quote, CheckCircle2, Gift, Users, Lock, Sparkles } from "lucide-react";
import ffImg from "@/assets/game-freefire.jpg";
import bgmiImg from "@/assets/game-bgmi.jpg";
import fcImg from "@/assets/game-fc.jpg";

const portals = [
  { slug: "freefire", title: "Free Fire", img: ffImg, tag: "Battle Royale", live: true, players: "12.4K" },
  { slug: "bgmi", title: "BGMI", img: bgmiImg, tag: "Tactical FPS", live: true, players: "8.7K" },
  { slug: "fc", title: "FC Mobile", img: fcImg, tag: "Coming Soon", live: false, players: "—" },
];

const live = [
  { title: "Quick Cup · Free Fire", code: "11 AM · ₹29 ENTRY", prize: "TOP 3 WIN", time: "FILLING" },
  { title: "Solo Showdown · FF", code: "2 PM · ₹49 ENTRY", prize: "TOP 5 WIN", time: "OPEN" },
  { title: "Duo Drop · BGMI", code: "5 PM · ₹59 ENTRY", prize: "TOP 5 WIN", time: "HOT" },
  { title: "Prime Squad · BGMI", code: "9 PM · ₹99 ENTRY", prize: "MVP BONUS", time: "TONIGHT" },
];

const steps = [
  { i: Shield, t: "Create Account", d: "Sign up in seconds, claim 100 starter coins" },
  { i: Zap, t: "Book Tournament", d: "Pick game, time, stakes — confirm with coins" },
  { i: Crown, t: "Drop & Dominate", d: "Outplay, win prizes, climb global ranks" },
];

const podium = [
  { rank: 2, name: "VORTEX_V01", score: "15,640", color: "from-primary/30", h: "h-28", glow: "ring-2 ring-primary/40" },
  { rank: 1, name: "NEON_WAVE", score: "16,820", color: "from-neon-yellow/40", h: "h-40", glow: "ring-2 ring-neon-yellow/60" },
  { rank: 3, name: "ROGUE_X", score: "14,295", color: "from-secondary/30", h: "h-20", glow: "ring-2 ring-secondary/40" },
];

const tests = [
  { n: "Aryan K.", r: "Free Fire · Diamond IV", q: "Won ₹5K in my first week. Cleanest payouts I've seen." },
  { n: "Priya S.", r: "BGMI · Crown II", q: "Room IDs always on time. No drama, just competition." },
  { n: "Rohan M.", r: "FC Mobile · Pro", q: "UI feels like a AAA game. Better than anything else." },
];

export default function Index() {
  useEffect(() => {
    document.title = "BattleArena — Conquer The World";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Premium mobile esports arena. Free Fire, BGMI, FC tournaments. Real prizes, daily.");
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <div className="container py-24 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-primary mb-5 px-3 py-1 rounded-full border border-primary/30 bg-primary/10"
          >
            <Sparkles className="h-3 w-3" /> Launch Season · Day 1
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="font-display italic text-6xl md:text-8xl uppercase leading-[0.95] tracking-tight max-w-4xl mx-auto"
          >
            Conquer The World<br />With Your Hand
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto"
          >
            Join daily Free Fire and BGMI tournaments. Win real rewards. Build your rank.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/auth?mode=signup" className="pill-btn">
              <Gift className="h-4 w-4" /> Claim Welcome Reward
            </Link>
            <Link to="/games/freefire" className="pill-ghost">Join Now</Link>
            <Link to="/leaderboard" className="pill-ghost">View Live Matches</Link>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
          >
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> 85% Prize Payout</span>
            <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-primary" /> Secure Payments</span>
            <span className="flex items-center gap-1.5"><Trophy className="h-3.5 w-3.5 text-primary" /> Instant Winner Payout</span>
          </motion.div>

          <div className="mt-12 grid grid-cols-4 gap-6 max-w-2xl mx-auto">
            {[
              { v: "Live", l: "Joined Now", pulse: true },
              { v: "₹29+", l: "Entry From" },
              { v: "Daily", l: "Tournaments" },
              { v: "85%", l: "Goes To Players" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-2xl md:text-3xl text-primary flex items-center justify-center gap-1.5">
                  {s.pulse && <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />}
                  {s.v}
                </div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTALS */}
      <section className="container pb-16">
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-primary mb-2">── Launch Lineup ──</div>
            <h2 className="font-display italic text-3xl md:text-4xl uppercase">Pick Your Arena</h2>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">More games soon</span>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {portals.map((p, i) => {
            const Wrapper: any = p.live ? Link : "div";
            const wrapperProps = p.live ? { to: `/games/${p.slug}` } : {};
            return (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Wrapper
                  {...wrapperProps}
                  className={`group relative block aspect-[4/5] rounded-xl overflow-hidden border transition-all ${
                    p.live ? "border-border hover:border-primary/50 cursor-pointer" : "border-border opacity-60 cursor-not-allowed"
                  }`}
                >
                  <img src={p.img} alt={p.title} className={`w-full h-full object-cover transition-transform duration-700 ${p.live ? "group-hover:scale-110" : "grayscale"}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  {p.live ? (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-secondary/90 text-secondary-foreground text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> Live
                    </div>
                  ) : (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full surface-2/80 backdrop-blur text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 border border-border">
                      <Lock className="h-3 w-3" /> Soon
                    </div>
                  )}
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full surface-2/80 backdrop-blur text-[10px] uppercase tracking-wider text-primary border border-primary/30 flex items-center gap-1">
                    <Users className="h-3 w-3" /> {p.players}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">{p.tag}</div>
                    <h3 className="font-display italic text-3xl uppercase">{p.title}</h3>
                    {p.live ? (
                      <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-foreground/80 group-hover:text-primary transition-colors">
                        Enter Arena <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    ) : (
                      <div className="mt-3 text-xs text-muted-foreground uppercase tracking-wider">Coming in future season</div>
                    )}
                  </div>
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* DAILY SCHEDULE STRIP */}
      <section className="container pb-20">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <h2 className="font-display text-2xl uppercase tracking-wide">Today's Schedule</h2>
          </div>
          <Link to="/games/freefire" className="text-xs uppercase tracking-wider text-primary hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {live.map((l, i) => (
            <motion.div
              key={l.code}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="surface-1 border border-border rounded-lg p-4 hover:border-primary/40 hover:-translate-y-1 transition-all"
            >
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{l.code}</div>
              <h3 className="font-display italic text-lg uppercase">{l.title}</h3>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-primary font-semibold">{l.prize}</span>
                <span className="text-muted-foreground">{l.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PATH TO GLORY */}
      <section className="container py-16">
        <h2 className="text-center font-display italic text-4xl md:text-5xl uppercase mb-12">The Path To Glory</h2>
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center surface-1 border border-border rounded-xl p-7"
            >
              <div className="mx-auto h-14 w-14 rounded-full bg-primary/15 border border-primary/30 grid place-items-center mb-4">
                <s.i className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl uppercase">{s.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GLOBAL CHAMPIONS */}
      <section className="container py-16">
        <h2 className="text-center font-display italic text-4xl md:text-5xl uppercase mb-12">Global Champions</h2>
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-3 md:gap-6 items-end">
          {podium.map((p) => (
            <motion.div
              key={p.rank}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center"
            >
              <div className={`mx-auto mb-3 h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-br ${p.color} to-transparent grid place-items-center ${p.glow}`}>
                {p.rank === 1 ? <Crown className="h-8 w-8 text-neon-yellow" /> : <Trophy className="h-7 w-7 text-primary" />}
              </div>
              <div className="font-display text-lg uppercase">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.score} XP</div>
              <div className={`mt-3 ${p.h} bg-gradient-to-t ${p.color} to-transparent border-t border-border rounded-t-md grid place-items-start justify-center pt-2`}>
                <span className="font-display text-3xl md:text-5xl text-primary">#{p.rank}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/leaderboard" className="pill-ghost inline-flex">View Full Hall of Fame <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container py-16">
        <div className="grid md:grid-cols-3 gap-5">
          {tests.map((t, i) => (
            <motion.div
              key={t.n}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="surface-1 border border-border rounded-xl p-6"
            >
              <div className="flex gap-0.5 mb-3">
                {[1,2,3,4,5].map(s => <Star key={s} className="h-3.5 w-3.5 text-primary fill-primary" />)}
              </div>
              <Quote className="h-5 w-5 text-primary/40 mb-2" />
              <p className="text-sm text-foreground/90 mb-5 leading-relaxed">"{t.q}"</p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-primary grid place-items-center font-display text-primary-foreground">{t.n[0]}</div>
                <div>
                  <div className="font-display text-sm uppercase">{t.n}</div>
                  <div className="text-xs text-muted-foreground">{t.r}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
