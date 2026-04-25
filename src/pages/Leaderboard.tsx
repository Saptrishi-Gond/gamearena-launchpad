import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Crown, Trophy, Search, TrendingUp, TrendingDown, Minus } from "lucide-react";

const TABS = ["All Time", "Season 5", "Weekly", "Daily"];
const GAMES = ["All Games", "Free Fire", "BGMI", "FC Mobile"];

const PODIUM = [
  { rank: 2, name: "VORTEX_V01", score: "15,640", win: "76.2%", h: "h-32" },
  { rank: 1, name: "NEON_WAVE", score: "16,820", win: "84.5%", h: "h-44" },
  { rank: 3, name: "ROGUE_X", score: "14,295", win: "71.8%", h: "h-24" },
];

const ROWS = [
  { rank: 4, name: "BLAZE_KING", change: "up", score: "13,840", win: "68.4%", matches: 142, earnings: "₹42K" },
  { rank: 5, name: "SHADOW_OPS", change: "same", score: "13,210", win: "66.1%", matches: 128, earnings: "₹38K" },
  { rank: 6, name: "ZERO_KICK", change: "down", score: "12,980", win: "63.7%", matches: 119, earnings: "₹31K" },
  { rank: 7, name: "IRON_FIST", change: "up", score: "12,450", win: "61.2%", matches: 134, earnings: "₹28K" },
  { rank: 8, name: "PHANTOM_GG", change: "up", score: "11,920", win: "59.8%", matches: 110, earnings: "₹24K" },
  { rank: 9, name: "TITAN_LORD", change: "down", score: "11,540", win: "57.3%", matches: 122, earnings: "₹22K" },
  { rank: 10, name: "RAPTOR_X", change: "same", score: "11,180", win: "55.7%", matches: 105, earnings: "₹19K" },
];

export default function Leaderboard() {
  const [tab, setTab] = useState(TABS[0]);
  const [game, setGame] = useState(GAMES[0]);

  useEffect(() => { document.title = "Global Hall of Fame — BattleArena"; }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="container py-12">
        <div className="text-center mb-10">
          <div className="text-[11px] uppercase tracking-[0.4em] text-primary mb-3">── Worldwide Rankings ──</div>
          <h1 className="font-display italic text-6xl md:text-8xl uppercase leading-none">Global Hall of Fame</h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Witness the legends. Top of the leaderboard.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">
          <div className="flex items-center gap-2 surface-1 border border-border rounded-full p-1.5 w-fit">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all ${
                  tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >{t}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select value={game} onChange={(e) => setGame(e.target.value)} className="h-10 px-4 rounded-full surface-1 border border-border text-sm focus:border-primary/60 outline-none">
              {GAMES.map(g => <option key={g}>{g}</option>)}
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input placeholder="Search player…" className="h-10 pl-9 pr-4 rounded-full surface-1 border border-border text-sm focus:border-primary/60 outline-none" />
            </div>
          </div>
        </div>

        {/* Podium */}
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto items-end mb-12">
          {PODIUM.map((p) => (
            <motion.div
              key={p.rank}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: p.rank * 0.1 }}
              className="text-center"
            >
              <div className={`mx-auto mb-3 h-20 w-20 md:h-24 md:w-24 rounded-full grid place-items-center ${
                p.rank === 1 ? "bg-gradient-to-br from-neon-yellow/40 to-transparent ring-2 ring-neon-yellow/60" :
                p.rank === 2 ? "bg-gradient-to-br from-primary/30 to-transparent ring-2 ring-primary/40" :
                "bg-gradient-to-br from-secondary/30 to-transparent ring-2 ring-secondary/40"
              }`}>
                {p.rank === 1 ? <Crown className="h-10 w-10 text-neon-yellow" /> : <Trophy className="h-8 w-8 text-primary" />}
              </div>
              <div className="font-display text-xl uppercase">{p.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{p.win} winrate</div>
              <div className="font-display text-2xl text-primary mt-1">{p.score}</div>
              <div className={`mt-3 ${p.h} rounded-t-lg ${
                p.rank === 1 ? "bg-gradient-to-t from-neon-yellow/30" :
                p.rank === 2 ? "bg-gradient-to-t from-primary/25" :
                "bg-gradient-to-t from-secondary/25"
              } to-transparent border-t-2 ${
                p.rank === 1 ? "border-neon-yellow/60" : p.rank === 2 ? "border-primary/60" : "border-secondary/60"
              } grid place-items-start justify-center pt-2`}>
                <span className="font-display text-4xl md:text-6xl text-primary">#{p.rank}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <div className="surface-1 border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-[60px_1fr_80px_100px_100px_100px] md:grid-cols-[80px_1fr_100px_120px_120px_120px] gap-3 px-5 py-3 border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground">
            <div>Rank</div>
            <div>Player</div>
            <div className="text-right">Trend</div>
            <div className="text-right">Win Rate</div>
            <div className="text-right hidden md:block">Matches</div>
            <div className="text-right">Earnings</div>
          </div>
          {ROWS.map((r, i) => (
            <motion.div
              key={r.rank}
              initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-[60px_1fr_80px_100px_100px_100px] md:grid-cols-[80px_1fr_100px_120px_120px_120px] gap-3 px-5 py-3.5 items-center border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors text-sm"
            >
              <div className="font-display text-lg text-muted-foreground">#{r.rank}</div>
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-full bg-gradient-primary grid place-items-center text-xs font-display text-primary-foreground shrink-0">{r.name[0]}</div>
                <span className="font-display uppercase truncate">{r.name}</span>
              </div>
              <div className="text-right">
                {r.change === "up" && <TrendingUp className="h-4 w-4 text-neon-green inline" />}
                {r.change === "down" && <TrendingDown className="h-4 w-4 text-secondary inline" />}
                {r.change === "same" && <Minus className="h-4 w-4 text-muted-foreground inline" />}
              </div>
              <div className="text-right text-neon-green font-mono">{r.win}</div>
              <div className="text-right text-muted-foreground hidden md:block">{r.matches}</div>
              <div className="text-right font-display text-primary">{r.earnings}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
