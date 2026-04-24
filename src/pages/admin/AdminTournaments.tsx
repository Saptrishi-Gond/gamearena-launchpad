import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trophy, X } from "lucide-react";
import { format } from "date-fns";
import { MarkWinnersDialog } from "@/components/admin/MarkWinnersDialog";

const PRESETS: Record<string, number[]> = {
  "Top 1 (Winner takes all)": [100],
  "Top 3 (50/30/20)": [50, 30, 20],
  "Top 5 (40/25/15/12/8)": [40, 25, 15, 12, 8],
  "Custom": [],
};

export default function AdminTournaments() {
  const { user } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [winnersFor, setWinnersFor] = useState<any>(null);

  const [form, setForm] = useState({
    game: "freefire", title: "", description: "", match_at: "",
    mode: "squad", region: "IN", banner_url: "",
    total_slots: 48, entry_fee: 0, prize_pool: 500,
    room_id: "", room_password: "",
  });
  const [preset, setPreset] = useState<string>("Top 3 (50/30/20)");
  const [customSplit, setCustomSplit] = useState<string>("50,30,20");

  const load = async () => {
    const { data } = await supabase.from("tournaments").select("*").order("match_at", { ascending: false });
    setList(data ?? []);
  };
  useEffect(() => { document.title = "Tournaments · Admin"; load(); }, []);

  const splitArray = (): number[] => {
    if (preset === "Custom") {
      return customSplit.split(",").map((s) => Number(s.trim())).filter((n) => !isNaN(n) && n > 0);
    }
    return PRESETS[preset];
  };

  const create = async () => {
    if (!form.title || !form.match_at) { toast.error("Title & match time required"); return; }
    const split = splitArray();
    const sum = split.reduce((a, b) => a + b, 0);
    if (split.length === 0 || sum > 100) { toast.error("Invalid prize split (must sum to ≤ 100%)"); return; }
    const { error } = await supabase.from("tournaments").insert({
      game: form.game as any,
      title: form.title,
      description: form.description || null,
      match_at: new Date(form.match_at).toISOString(),
      mode: form.mode as any,
      region: form.region,
      banner_url: form.banner_url || null,
      total_slots: Number(form.total_slots),
      slots_left: Number(form.total_slots),
      entry_fee: Number(form.entry_fee),
      prize_pool: Number(form.prize_pool),
      room_id: form.room_id || null,
      room_password: form.room_password || null,
      winner_count: split.length,
      prize_split: split,
      created_by: user!.id,
    });
    if (error) toast.error(error.message);
    else { toast.success("Tournament created"); setOpen(false); load(); }
  };

  const cancel = async (id: string) => {
    await supabase.from("tournaments").update({ status: "cancelled" }).eq("id", id);
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-black uppercase">Tournaments</h1>
          <p className="text-muted-foreground">Create matches, set prizes, mark winners</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button variant="hero"><Plus className="h-4 w-4" /> New Tournament</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display uppercase">Create Tournament</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Game</Label>
                  <Select value={form.game} onValueChange={(v) => setForm({ ...form, game: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freefire">Free Fire</SelectItem>
                      <SelectItem value="bgmi">BGMI</SelectItem>
                      <SelectItem value="fc">FC Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Mode</Label>
                  <Select value={form.mode} onValueChange={(v) => setForm({ ...form, mode: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo</SelectItem>
                      <SelectItem value="duo">Duo</SelectItem>
                      <SelectItem value="squad">Squad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Region</Label>
                  <Input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Saturday Showdown #5" />
              </div>
              <div>
                <Label>Match At</Label>
                <Input type="datetime-local" value={form.match_at} onChange={(e) => setForm({ ...form, match_at: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <Label>Banner URL (optional)</Label>
                <Input value={form.banner_url} onChange={(e) => setForm({ ...form, banner_url: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Slots</Label><Input type="number" value={form.total_slots} onChange={(e) => setForm({ ...form, total_slots: Number(e.target.value) })} /></div>
                <div><Label>Entry (coins)</Label><Input type="number" value={form.entry_fee} onChange={(e) => setForm({ ...form, entry_fee: Number(e.target.value) })} /></div>
                <div><Label>Prize Pool</Label><Input type="number" value={form.prize_pool} onChange={(e) => setForm({ ...form, prize_pool: Number(e.target.value) })} /></div>
              </div>

              <div className="border-t border-border pt-3">
                <Label className="font-display uppercase text-xs">Winner Configuration</Label>
                <Select value={preset} onValueChange={setPreset}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(PRESETS).map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                  </SelectContent>
                </Select>
                {preset === "Custom" && (
                  <div className="mt-2">
                    <Label className="text-xs">Comma-separated % split (e.g. 40,25,15,12,8)</Label>
                    <Input value={customSplit} onChange={(e) => setCustomSplit(e.target.value)} />
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Will produce {splitArray().length} winner(s) — totals {splitArray().reduce((a, b) => a + b, 0)}%
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div><Label>Room ID</Label><Input value={form.room_id} onChange={(e) => setForm({ ...form, room_id: e.target.value })} /></div>
                <div><Label>Room Password</Label><Input value={form.room_password} onChange={(e) => setForm({ ...form, room_password: e.target.value })} /></div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="hero" onClick={create}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {list.map((t) => (
          <Card key={t.id} className="p-4 bg-gradient-card border-border flex items-center justify-between">
            <div>
              <div className="text-xs font-display uppercase text-primary">{t.game} · {t.mode}</div>
              <div className="font-display font-bold">{t.title}</div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(t.match_at), "PP HH:mm")} · {t.slots_left}/{t.total_slots} slots · {t.entry_fee} entry · {t.prize_pool} prize · {t.winner_count} winner(s)
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 bg-muted uppercase font-display">{t.status}</span>
              {t.status !== "cancelled" && t.status !== "completed" && (
                <>
                  <Button variant="hero" size="sm" onClick={() => setWinnersFor(t)}><Trophy className="h-3 w-3" /> Mark Winners</Button>
                  <Button variant="outline" size="sm" onClick={() => cancel(t.id)}><X className="h-3 w-3" /></Button>
                </>
              )}
            </div>
          </Card>
        ))}
        {list.length === 0 && <p className="text-muted-foreground">No tournaments yet.</p>}
      </div>

      <MarkWinnersDialog tournament={winnersFor} open={!!winnersFor} onOpenChange={(o) => !o && setWinnersFor(null)} onDone={load} />
    </AdminLayout>
  );
}
