import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar, Trophy, Users, Coins, Lock } from "lucide-react";
import { format } from "date-fns";

interface Tournament {
  id: string;
  game: string;
  title: string;
  description: string | null;
  match_at: string;
  total_slots: number;
  slots_left: number;
  entry_fee: number;
  prize_pool: number;
  status: string;
}

export const TournamentCard = ({ t, onBooked }: { t: Tournament; onBooked?: () => void }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [inGameId, setInGameId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alreadyBooked, setAlreadyBooked] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("bookings").select("id").eq("tournament_id", t.id).eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setAlreadyBooked(!!data));
  }, [user, t.id]);

  const handleJoin = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!inGameId.trim()) { toast.error("Enter your in-game ID"); return; }
    setSubmitting(true);
    const { error } = await supabase.rpc("book_tournament", {
      _tournament_id: t.id,
      _in_game_id: inGameId.trim(),
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Booked! See you in the arena.");
    setOpen(false);
    setAlreadyBooked(true);
    onBooked?.();
  };

  const full = t.slots_left <= 0;

  return (
    <>
      <div className="group relative bg-gradient-card border border-border clip-angled p-5 hover:border-primary/60 transition-all">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs font-display uppercase tracking-widest text-primary mb-1">
              {t.game === "freefire" ? "Free Fire" : t.game === "bgmi" ? "BGMI" : "FC Mobile"}
            </div>
            <h3 className="font-display text-lg font-bold leading-tight">{t.title}</h3>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-neon-yellow font-display font-bold">
              <Trophy className="h-4 w-4" /> {t.prize_pool}
            </div>
            <div className="text-xs text-muted-foreground">prize pool</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 my-4 text-sm">
          <div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs uppercase font-display">
              <Calendar className="h-3 w-3" /> Match
            </div>
            <div className="font-semibold">{format(new Date(t.match_at), "dd MMM, HH:mm")}</div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs uppercase font-display">
              <Users className="h-3 w-3" /> Slots
            </div>
            <div className="font-semibold">{t.slots_left}/{t.total_slots}</div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs uppercase font-display">
              <Coins className="h-3 w-3" /> Entry
            </div>
            <div className="font-semibold">{t.entry_fee === 0 ? "FREE" : `${t.entry_fee} 🪙`}</div>
          </div>
        </div>

        {alreadyBooked ? (
          <Button variant="outline" className="w-full" disabled>
            <Lock className="h-4 w-4 mr-2" /> Joined
          </Button>
        ) : (
          <Button
            variant={full ? "outline" : "hero"}
            className="w-full"
            disabled={full}
            onClick={() => user ? setOpen(true) : navigate("/auth")}
          >
            {full ? "FULL" : "Join Battle"}
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display uppercase">Confirm Entry</DialogTitle>
            <DialogDescription>
              {t.title} • Entry fee: {t.entry_fee === 0 ? "FREE" : `${t.entry_fee} coins`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="igid">Your in-game ID</Label>
            <Input
              id="igid"
              value={inGameId}
              onChange={(e) => setInGameId(e.target.value)}
              placeholder="e.g. 1234567890"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="hero" onClick={handleJoin} disabled={submitting}>
              {submitting ? "Joining..." : "Confirm & Join"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
