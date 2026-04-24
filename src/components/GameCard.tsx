import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface GameCardProps {
  slug: string;
  title: string;
  tagline: string;
  image: string;
  accent: "orange" | "red" | "cyan";
}

const accentMap = {
  orange: "from-neon-orange/80 to-transparent",
  red: "from-neon-red/80 to-transparent",
  cyan: "from-neon-cyan/80 to-transparent",
};

export const GameCard = ({ slug, title, tagline, image, accent }: GameCardProps) => {
  return (
    <Link to={`/games/${slug}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="group relative overflow-hidden clip-angled bg-gradient-card border border-border h-[420px] cursor-pointer"
      >
        <img
          src={image}
          alt={`${title} tournaments on BattleArena`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${accentMap[accent]} mix-blend-overlay opacity-60`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="scanline absolute inset-0 opacity-30" />

        <div className="relative h-full flex flex-col justify-end p-6">
          <div className="text-xs font-display uppercase tracking-[0.3em] text-primary mb-2">
            Live Tournaments
          </div>
          <h3 className="font-display text-3xl font-black text-glow mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm mb-4">{tagline}</p>
          <div className="flex items-center gap-2 text-primary font-display font-bold uppercase text-sm tracking-wider group-hover:translate-x-2 transition-transform">
            Enter Arena <span>→</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
