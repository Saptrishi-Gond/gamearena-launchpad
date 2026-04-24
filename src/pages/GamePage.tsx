import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { TournamentCard } from "@/components/TournamentCard";
import { supabase } from "@/integrations/supabase/client";
import ffImg from "@/assets/game-freefire.jpg";
import bgmiImg from "@/assets/game-bgmi.jpg";
import fcImg from "@/assets/game-fc.jpg";

const META: Record<string, { name: string; tagline: string; image: string; accent: string }> = {
  freefire: { name: "Free Fire", tagline: "10-minute squad warfare. Booyah or bust.", image: ffImg, accent: "from-neon-orange/60" },
  bgmi: { name: "BGMI", tagline: "Tactical battle royale. Last squad standing.", image: bgmiImg, accent: "from-neon-red/60" },
  fc: { name: "FC Mobile", tagline: "1v1 football. Pure skill, pure glory.", image: fcImg, accent: "from-neon-cyan/60" },
};

export default function GamePage() {
  const { slug } = useParams<{ slug: string }>();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const meta = slug ? META[slug] : undefined;

  useEffect(() => {
    if (!slug || !meta) return;
    document.title = `${meta.name} Tournaments — BattleArena`;
    setLoading(true);
    supabase.from("tournaments").select("*").eq("game", slug).order("match_at")
      .then(({ data }) => { setTournaments(data ?? []); setLoading(false); });
  }, [slug, meta]);

  if (!meta) return <Navigate to="/" replace />;

  const upcoming = tournaments.filter(t => t.status === "upcoming");
  const live = tournaments.filter(t => t.status === "live");

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img src={meta.image} alt={`${meta.name} tournaments`} className="w-full h-full object-cover opacity-40" />
          <div className={`absolute inset-0 bg-gradient-to-t ${meta.accent} via-background/80 to-background`} />
        </div>
        <div className="relative container py-20">
          <div className="font-display text-xs uppercase tracking-[0.3em] text-primary mb-3">Battlefield</div>
          <h1 className="font-display text-5xl md:text-7xl font-black uppercase text-glow">{meta.name}</h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-xl">{meta.tagline}</p>
        </div>
      </section>

      <section className="container py-12">
        {loading ? (
          <p className="text-muted-foreground">Loading battles...</p>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl uppercase text-muted-foreground">No tournaments scheduled yet</p>
            <p className="text-sm text-muted-foreground mt-2">Check back soon, warrior.</p>
          </div>
        ) : (
          <>
            {live.length > 0 && (
              <>
                <h2 className="font-display text-2xl font-bold uppercase mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" /> Live
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                  {live.map(t => <TournamentCard key={t.id} t={t} />)}
                </div>
              </>
            )}
            <h2 className="font-display text-2xl font-bold uppercase mb-4">Upcoming</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcoming.map(t => <TournamentCard key={t.id} t={t} />)}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
