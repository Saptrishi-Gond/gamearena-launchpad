import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Trophy } from "lucide-react";

interface Props {
  tournament: any;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onDone: () => void;
}

interface WinnerRow { user_id: string; rank: number; prize_amount: number; }

export const MarkWinnersDialog = ({ tournament, open, onOpenChange, onDone }: Props) => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [winners, setWinners] = useState<WinnerRow[]>([]);
  const [saving, setSaving] = useState(false);
  const split = (tournament?.prize_split as number[]) ?? [100];
  const pool = tournament?.prize_pool ?? 0;

  useEffect(() => {
    if (!open || !tournament) return;
    supabase.from("bookings").select("user_id, profile:profiles(username)").eq("tournament_id", tournament.id)
      .then(({ data }) => setParticipants(data ?? []));
    // pre-fill rows from prize_split
    const rows: WinnerRow[] = split.map((pct, i) => ({
      user_id: "",
      rank: i + 1,
      prize_amount: Math.round((pct / 100) * pool),
    }));
    setWinners(rows);
  }, [open, tournament?.id]);

  if (!tournament) return null;

  const update = (i: number, key: keyof WinnerRow, val: any) => {
    setWinners((w) => w.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));
  };

  const addRow = () => setWinners((w) => [...w, { user_id: "", rank: w.length + 1, prize_amount: 0 }]);
  const removeRow = (i: number) => setWinners((w) => w.filter((_, idx) => idx !== i));

  const submit = async () => {
    const filled = winners.filter((w) => w.user_id);
    if (filled.length === 0) { toast.error("Pick at least one winner"); return; }
    setSaving(true);
    const { error } = await supabase.rpc("mark_tournament_winners", {
      _tournament_id: tournament.id,
      _winners: filled as any,
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`${filled.length} winner(s) marked & coins credited`);
    onOpenChange(false);
    onDone();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display uppercase flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" /> Mark Winners — {tournament.title}
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">Prize pool: {pool} coins · Split: [{split.join("/")}]</p>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {winners.map((w, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-2">
                <Label className="text-xs">Rank</Label>
                <Input type="number" min={1} value={w.rank} onChange={(e) => update(i, "rank", Number(e.target.value))} />
              </div>
              <div className="col-span-6">
                <Label className="text-xs">Player</Label>
                <Select value={w.user_id} onValueChange={(v) => update(i, "user_id", v)}>
                  <SelectTrigger><SelectValue placeholder="Pick a player" /></SelectTrigger>
                  <SelectContent>
                    {participants.map((p) => (
                      <SelectItem key={p.user_id} value={p.user_id}>{p.profile?.username ?? p.user_id.slice(0, 8)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Label className="text-xs">Prize (coins)</Label>
                <Input type="number" value={w.prize_amount} onChange={(e) => update(i, "prize_amount", Number(e.target.value))} />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeRow(i)} className="col-span-1"><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addRow}>+ Add winner</Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="hero" onClick={submit} disabled={saving}>Confirm & Credit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
