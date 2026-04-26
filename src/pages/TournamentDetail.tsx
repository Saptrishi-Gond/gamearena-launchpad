import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JoinTournamentButton } from "@/components/JoinTournamentButton";
import { motion } from "framer-motion";
import { Calendar, Trophy, Users, Coins, MapPin, Clock, Zap } from "lucide-react";
import ffImg from "@/assets/game-freefire.jpg";

const PARTICIPANTS = [
  { name: "NEON_WAVE", tag: "T1", score: 142 },
  { name: "VORTEX_V01", tag: "T2", score: 138 },
  { name: "ROGUE_X", tag: "T3", score: 121 },
  { name: "BLAZE_KING", tag: "T4", score: 115 },
  { name: "SHADOW_OPS", tag: "T5", score: 102 },
  { name: "ZERO_KICK", tag: "T6", score: 98 },
];

const BRACKET = [
  { round: "R1", matches: ["NEON vs ROGUE", "VORTEX vs BLAZE", "SHADOW vs ZERO", "IRON vs PHANTOM"] },
  { round: "QF", matches: ["NEON vs VORTEX", "SHADOW vs IRON"] },
  { round: "SF", matches: ["WINNER 1 vs WINNER 2"] },
  { round: "FINAL", matches: ["CHAMPIONS"] },
];

export default function TournamentDetail() {
  const { id } = useParams();

  useEffect(() => { document.title = "Titan Clash Series: Season 5 — BattleArena"; }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Banner */}
      <section className="relative">
        <div className="relative h-72 md:h-96 overflow-hidden">
          <img src={ffImg} alt="banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        </div>
        <div className="container -mt-32 relative pb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-[10px] uppercase tracking-wider font-bold">● Live</span>
            <span className="px-2 py-1 rounded-md surface-2 border border-border text-[10px] uppercase tracking-wider text-muted-foreground">Season 05</span>
            <span className="px-2 py-1 rounded-md surface-2 border border-border text-[10px] uppercase tracking-wider text-muted-foreground">Battle Royale</span>
          </div>
          <h1 className="font-display italic text-5xl md:text-7xl uppercase leading-none max-w-3xl">
            Titan Clash Series:<br />Season 5
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl">128 squads. Single elimination. Last team standing claims the throne.</p>
        </div>
      </section>

      <section className="container pb-20 grid lg:grid-cols-[1fr_320px] gap-6">
        {/* MAIN */}
        <div className="space-y-6">
          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { i: Trophy, l: "Prize Pool", v: "₹50,000", c: "text-primary" },
              { i: Users, l: "Slots", v: "120/128" },
              { i: Calendar, l: "Date", v: "Today, 8:30 PM" },
              { i: MapPin, l: "Region", v: "Asia-South" },
            ].map((s) => (
              <div key={s.l} className="surface-1 border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  <s.i className="h-3 w-3" /> {s.l}
                </div>
                <div className={`font-display text-xl ${s.c ?? ""}`}>{s.v}</div>
              </div>
            ))}
          </div>

          {/* Bracket */}
          <div className="surface-1 border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-2xl uppercase flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" /> Tournament Bracket
              </h2>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Updated · 2m ago</span>
            </div>
            <div className="grid grid-cols-4 gap-3 overflow-x-auto">
              {BRACKET.map((col, ci) => (
                <div key={col.round} className="space-y-2 min-w-[140px]">
                  <div className="text-[10px] uppercase tracking-widest text-primary text-center mb-2">{col.round}</div>
                  {col.matches.map((m, mi) => (
                    <motion.div
                      key={mi}
                      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: ci * 0.1 + mi * 0.05 }}
                      className="surface-2 border border-border rounded-md p-3 text-xs hover:border-primary/40 transition-colors"
                    >
                      <div className="text-muted-foreground text-[10px] uppercase mb-1">Match {mi + 1}</div>
                      <div className="font-semibold">{m}</div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Participants */}
          <div className="surface-1 border border-border rounded-xl p-5">
            <h2 className="font-display text-2xl uppercase mb-5">Participants</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PARTICIPANTS.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 surface-2 border border-border rounded-lg p-3 hover:border-primary/40"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-primary grid place-items-center font-display text-primary-foreground">{p.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm uppercase truncate">{p.name}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.tag}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg text-primary">{p.score}</div>
                    <div className="text-[9px] uppercase text-muted-foreground">pts</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDE */}
        <aside className="space-y-4">
          <div className="surface-1 border border-border rounded-xl p-5 sticky top-20">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Entry Fee</div>
            <div className="font-display text-3xl mb-4">FREE</div>
            <JoinTournamentButton
              tournamentId={id ?? "demo"}
              game="freefire"
              entryFee={0}
              title="Titan Clash Series: Season 5"
              className="w-full pill-btn justify-center mb-3"
            >
              Register Now
            </JoinTournamentButton>
            <button className="w-full pill-ghost justify-center">Add to Watchlist</button>

            <div className="mt-6 pt-6 border-t border-border space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Starts in</span>
                <span className="font-display text-primary">02:14:38</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-2"><Coins className="h-3.5 w-3.5" /> Format</span>
                <span>Squad · TPP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Map Pool</span>
                <span>Bermuda · Kalahari</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Server</span>
                <span>Asia-South</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Prize Distribution</div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span>🥇 1st</span><span className="text-primary">₹25,000</span></div>
                <div className="flex justify-between"><span>🥈 2nd</span><span className="text-primary">₹15,000</span></div>
                <div className="flex justify-between"><span>🥉 3rd</span><span className="text-primary">₹10,000</span></div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <Footer />
    </div>
  );
}
