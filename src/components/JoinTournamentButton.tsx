import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { z } from "zod";

type Game = "freefire" | "bgmi" | "fc";

interface Props {
  tournamentId: string;
  game?: Game;
  entryFee?: number;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

const idSchema = z.string().trim().min(4, "ID too short").max(32, "ID too long").regex(/^[A-Za-z0-9_.-]+$/, "Letters, numbers, _ . - only");
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (v: string) => UUID_RE.test(v);

export function JoinTournamentButton({ tournamentId, game, entryFee = 0, title, className, children }: Props) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [igid, setIgid] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);
  const [coins, setCoins] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const profilePromise = Promise.resolve(
        supabase.from("profiles").select("game_id_freefire, game_id_bgmi, game_id_fc, wallet_coins").eq("id", user.id).maybeSingle()
      );
      const bookingPromise = isUuid(tournamentId)
        ? Promise.resolve(supabase.from("bookings").select("id").eq("tournament_id", tournamentId).eq("user_id", user.id).maybeSingle())
        : Promise.resolve({ data: null });

      const [profileRes, bookingRes] = await Promise.all([profilePromise, bookingPromise]);
      if (isUuid(tournamentId)) setJoined(!!(bookingRes as any)?.data);

      const p = profileRes.data as any;
      if (p) {
        setCoins(p.wallet_coins ?? 0);
        const stored =
          game === "bgmi" ? p.game_id_bgmi :
          game === "fc" ? p.game_id_fc :
          p.game_id_freefire;
        if (stored) {
          setSavedId(stored);
          setIgid(stored);
        }
      }
    })();
  }, [user, tournamentId, game]);

  const openFlow = () => {
    if (loading) return;
    if (!user) {
      toast.error("Sign in to join");
      navigate("/auth");
      return;
    }
    if (joined) return;
    setOpen(true);
  };

  // Resolve to a real tournament UUID. If demo id (e.g. "1"), pick the next open tournament for this game.
  const resolveTournamentId = async (): Promise<string | null> => {
    if (isUuid(tournamentId)) return tournamentId;
    const q = supabase
      .from("tournaments")
      .select("id, game, slots_left, match_at, status")
      .gt("slots_left", 0)
      .in("status", ["upcoming", "live"])
      .order("match_at", { ascending: true })
      .limit(1);
    if (game) q.eq("game", game);
    const { data, error } = await q;
    if (error || !data?.length) return null;
    return data[0].id as string;
  };

  const confirm = async () => {
    const parsed = idSchema.safeParse(igid);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (entryFee > 0 && coins < entryFee) {
      toast.error("Not enough coins. Top up your wallet.");
      return;
    }

    setSubmitting(true);
    const realId = await resolveTournamentId();
    if (!realId) {
      setSubmitting(false);
      toast.error("No open tournaments right now. Check back soon!");
      return;
    }

    const { error } = await supabase.rpc("book_tournament", {
      _tournament_id: realId,
      _in_game_id: parsed.data,
    });

    if (!error && game && parsed.data !== savedId) {
      const patch =
        game === "bgmi" ? { game_id_bgmi: parsed.data } :
        game === "fc" ? { game_id_fc: parsed.data } :
        { game_id_freefire: parsed.data };
      await supabase.from("profiles").update(patch).eq("id", user!.id);
    }

    setSubmitting(false);
    if (error) {
      toast.error(error.message || "Could not join");
      return;
    }
    toast.success("You're in! See you in the arena.");
    setJoined(true);
    setOpen(false);
  };

  if (joined) {
    return (
      <button
        disabled
        className={className ?? "w-full py-2.5 rounded-full text-sm font-semibold surface-2 border border-primary/30 text-primary inline-flex items-center justify-center gap-2"}
      >
        <CheckCircle2 className="h-4 w-4" /> Joined
      </button>
    );
  }

  return (
    <>
      <button
        onClick={openFlow}
        disabled={loading}
        className={className ?? "w-full py-2.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:brightness-110 hover:shadow-glow transition-all disabled:opacity-60"}
      >
        {children ?? "Join Now"}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display italic uppercase text-2xl">Confirm Entry</DialogTitle>
            <DialogDescription>
              {title ? `${title} • ` : ""}{entryFee === 0 ? "FREE entry" : `${entryFee} coins`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="surface-2 border border-border rounded-lg p-3 text-xs flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="text-muted-foreground">
                Your slot is locked instantly. Room ID & password unlock 15 min before match. Refunds auto-process if the match is cancelled.
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="igid" className="text-xs uppercase tracking-wider">In-game ID</Label>
              <Input
                id="igid"
                value={igid}
                onChange={(e) => setIgid(e.target.value)}
                placeholder="e.g. 1234567890"
                autoFocus
              />
              {savedId && igid === savedId && (
                <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1"><Lock className="h-3 w-3" /> Using your saved ID</p>
              )}
            </div>

            {entryFee > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Wallet balance</span>
                <span className={`font-display ${coins < entryFee ? "text-destructive" : "text-primary"}`}>{coins} 🪙</span>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={confirm} disabled={submitting} className="bg-primary text-primary-foreground hover:brightness-110">
              {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Joining…</> : entryFee === 0 ? "Lock My Slot" : `Pay ${entryFee} & Join`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
