import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Coins, Trophy } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Rewards() {
  const { user, loading } = useAuth();
  const [rewards, setRewards] = useState<any[]>([]);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("rewards").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setRewards(data ?? []);
  };

  useEffect(() => { document.title = "Rewards — BattleArena"; load(); }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const claim = async (id: string) => {
    const { error } = await supabase.from("rewards").update({ claimed: true }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Reward claimed!"); load(); }
  };

  const unclaimed = rewards.filter((r) => !r.claimed);
  const claimed = rewards.filter((r) => r.claimed);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-10">
        <BackButton to="/dashboard" label="Dashboard" className="mb-4 -ml-3" />
        <h1 className="font-display text-4xl font-black uppercase mb-2">Rewards</h1>
        <p className="text-muted-foreground mb-8">Loot earned from your battles</p>

        <h2 className="font-display text-xl uppercase mb-3 flex items-center gap-2"><Gift className="h-5 w-5 text-primary" /> Unclaimed</h2>
        {unclaimed.length === 0 ? (
          <p className="text-muted-foreground mb-8">No unclaimed rewards.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {unclaimed.map((r) => (
              <Card key={r.id} className="p-5 bg-gradient-card border-border clip-angled flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase font-display text-primary">{r.type.replace("_", " ")}</div>
                  <div className="font-display font-bold">{r.title}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><Coins className="h-3 w-3" /> {r.amount} coins</div>
                </div>
                <Button variant="hero" size="sm" onClick={() => claim(r.id)}>Claim</Button>
              </Card>
            ))}
          </div>
        )}

        <h2 className="font-display text-xl uppercase mb-3 flex items-center gap-2"><Trophy className="h-5 w-5 text-accent" /> History</h2>
        {claimed.length === 0 ? (
          <p className="text-muted-foreground">No reward history yet.</p>
        ) : (
          <div className="space-y-2">
            {claimed.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-card border border-border text-sm">
                <div>
                  <div className="font-display font-bold">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(r.created_at), "PP")} · {r.type}</div>
                </div>
                <span className="font-display text-primary">+{r.amount}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
