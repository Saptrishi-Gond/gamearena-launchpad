import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Trophy, Calendar, Lock, Unlock, Gift, MessageSquare } from "lucide-react";
import { format, differenceInMinutes } from "date-fns";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  const load = async () => {
    if (!user) return;
    const [{ data: p }, { data: b }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase.from("bookings").select("*, tournament:tournaments(*)").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);
    setProfile(p);
    setBookings(b ?? []);
  };

  useEffect(() => { document.title = "Dashboard — BattleArena"; load(); }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const checkIn = async (bookingId: string) => {
    const { error } = await supabase.from("bookings")
      .update({ status: "checked_in", checked_in_at: new Date().toISOString() })
      .eq("id", bookingId);
    if (error) toast.error(error.message); else { toast.success("Checked in!"); load(); }
  };

  const upcoming = bookings.filter(b => b.tournament && new Date(b.tournament.match_at) > new Date());
  const past = bookings.filter(b => b.tournament && new Date(b.tournament.match_at) <= new Date());

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-10">
        <BackButton to="/" label="Home" className="mb-4 -ml-3" />
        <h1 className="font-display text-4xl md:text-5xl font-black uppercase mb-2">
          Welcome, <span className="text-primary text-glow">{profile?.username ?? "Warrior"}</span>
        </h1>
        <p className="text-muted-foreground mb-8">Your command center</p>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <Card className="p-5 bg-gradient-card border-border clip-angled">
            <div className="flex items-center gap-3">
              <Coins className="h-8 w-8 text-neon-yellow" />
              <div>
                <div className="text-xs uppercase font-display text-muted-foreground">Wallet</div>
                <div className="font-display text-2xl font-black">{profile?.wallet_coins ?? 0} <span className="text-sm text-muted-foreground">coins</span></div>
              </div>
            </div>
          </Card>
          <Card className="p-5 bg-gradient-card border-border clip-angled">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              <div>
                <div className="text-xs uppercase font-display text-muted-foreground">XP</div>
                <div className="font-display text-2xl font-black">{profile?.xp ?? 0}</div>
              </div>
            </div>
          </Card>
          <Card className="p-5 bg-gradient-card border-border clip-angled">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-accent" />
              <div>
                <div className="text-xs uppercase font-display text-muted-foreground">Matches</div>
                <div className="font-display text-2xl font-black">{bookings.length}</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          <Link to="/rewards"><Button variant="neon" size="sm"><Gift className="h-4 w-4" /> My Rewards</Button></Link>
          <Link to="/support"><Button variant="outline" size="sm"><MessageSquare className="h-4 w-4" /> Support</Button></Link>
          <Link to="/games/freefire"><Button variant="hero" size="sm">Find a match</Button></Link>
        </div>

        <h2 className="font-display text-2xl font-bold uppercase mb-4">Upcoming Matches</h2>
        {upcoming.length === 0 ? (
          <p className="text-muted-foreground mb-10">No upcoming battles. Go enter one!</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {upcoming.map((b) => {
              const minsLeft = differenceInMinutes(new Date(b.tournament.match_at), new Date());
              const canCheckIn = minsLeft <= 15 && b.status === "confirmed";
              const showRoom = b.status === "checked_in" && minsLeft <= 15;
              return (
                <Card key={b.id} className="p-5 bg-gradient-card border-border clip-angled">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs uppercase font-display text-primary">{b.tournament.game}</div>
                      <h3 className="font-display font-bold text-lg">{b.tournament.title}</h3>
                      <p className="text-sm text-muted-foreground">{format(new Date(b.tournament.match_at), "PP · HH:mm")}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-primary/20 text-primary uppercase font-display">{b.status}</span>
                  </div>
                  {showRoom ? (
                    <div className="bg-background/60 border border-primary/40 p-3 mt-2">
                      <div className="flex items-center gap-2 text-primary text-xs uppercase font-display mb-1"><Unlock className="h-3 w-3" /> Room unlocked</div>
                      <div className="font-mono text-sm">ID: {b.tournament.room_id ?? "—"}</div>
                      <div className="font-mono text-sm">PWD: {b.tournament.room_password ?? "—"}</div>
                    </div>
                  ) : canCheckIn ? (
                    <Button variant="hero" className="w-full" onClick={() => checkIn(b.id)}>
                      <Unlock className="h-4 w-4" /> Check In
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      <Lock className="h-4 w-4" /> Check-in opens 15 min before
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        <h2 className="font-display text-2xl font-bold uppercase mb-4">Match History</h2>
        {past.length === 0 ? (
          <p className="text-muted-foreground">No past matches yet.</p>
        ) : (
          <div className="space-y-2">
            {past.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-4 bg-card border border-border">
                <div>
                  <div className="font-display font-bold">{b.tournament.title}</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(b.tournament.match_at), "PP")}</div>
                </div>
                <span className="text-xs uppercase font-display text-muted-foreground">{b.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
