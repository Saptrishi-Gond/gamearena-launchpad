import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import ffImg from "@/assets/game-freefire.jpg";
import bgmiImg from "@/assets/game-bgmi.jpg";
import fcImg from "@/assets/game-fc.jpg";

const CATS = ["All", "Battle Royale", "FPS", "Sports", "MOBA", "Racing", "Fighting"];

const TILES = [
  { slug: "freefire", title: "Free Fire", cat: "Battle Royale", img: ffImg, players: "12.4K" },
  { slug: "bgmi", title: "BGMI", cat: "Battle Royale", img: bgmiImg, players: "8.7K" },
  { slug: "fc", title: "FC Mobile", cat: "Sports", img: fcImg, players: "3.1K" },
  { slug: "valorant", title: "Valorant", cat: "FPS", img: ffImg, players: "5.8K" },
  { slug: "rocket", title: "Rocket League", cat: "Sports", img: bgmiImg, players: "2.3K" },
  { slug: "dota", title: "Dota 2", cat: "MOBA", img: fcImg, players: "4.5K" },
  { slug: "csgo", title: "CS:GO 2", cat: "FPS", img: ffImg, players: "9.1K" },
  { slug: "sf", title: "Street Fighter", cat: "Fighting", img: bgmiImg, players: "1.8K" },
];

export default function Games() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");

  useEffect(() => { document.title = "Games Directory — BattleArena"; }, []);

  const filtered = TILES.filter(t =>
    (cat === "All" || t.cat === cat) &&
    t.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="container py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="text-[11px] uppercase tracking-[0.4em] text-primary mb-3">── Esports Library ──</div>
            <h1 className="font-display italic text-6xl md:text-8xl uppercase leading-none">Directory</h1>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Titles</div>
              <div className="font-display text-2xl">{TILES.length}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Live</div>
              <div className="font-display text-2xl text-primary">1.2K</div>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 surface-1 border border-border rounded-full p-1.5 overflow-x-auto">
            {CATS.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                  cat === c
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search games…"
              className="w-full h-11 pl-11 pr-4 rounded-full surface-1 border border-border focus:border-primary/60 outline-none text-sm"
            />
          </div>
          <button className="h-11 w-11 grid place-items-center rounded-full surface-1 border border-border text-muted-foreground hover:text-primary">
            <Filter className="h-4 w-4" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((t, i) => (
            <motion.div
              key={t.slug}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/games/${t.slug}`}
                className="group block aspect-square relative rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all"
              >
                <img src={t.img} alt={t.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute top-3 right-3 px-2 py-1 rounded-full surface-2/80 backdrop-blur text-[10px] uppercase tracking-wider text-primary border border-primary/30">
                  {t.players} live
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">{t.cat}</div>
                  <h3 className="font-display italic text-xl uppercase">{t.title}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
