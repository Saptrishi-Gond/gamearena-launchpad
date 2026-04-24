import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trophy, Users } from "lucide-react";
import { format } from "date-fns";

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    game: "freefire", title: "", description: "", match_at: "",
    total_slots: 48, entry_fee: 0, prize_pool: 500, room_id: "", room_password: "",
  });

  const load = async () => {
    const [{ data: t }, { data: b }] = await Promise.all([
      supabase.from("tournaments").select("*").order("match_at", { ascending: false }),
      supabase.from("bookings").select("*, tournament:tournaments(title, game), profile:profiles(username)").order("created_at", { ascending: false }).limit(50),
    ]);
    setTournaments(t ?? []);
    setBookings(b ?? []);
  };

  useEffect(() => { document.title = "Admin — BattleArena"; if (isAdmin) load(); }, [isAdmin]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-20 text-center">
        <h1 className="font-display text-3xl uppercase">Access denied</h1>
        <p className="text-muted-foreground mt-2">You need admin role to view this page.</p>
      </div>
    </div>
  );

  const create = async () => {
    if (!form.title || !form.match_at) { toast.error("Title & match time required"); return; }
    const { error } = await supabase.from("tournaments").insert({
      game: form.game as any,
      title: form.title,
      description: form.description || null,
      match_at: new Date(form.match_at).toISOString(),
      total_slots: Number(form.total_slots),
      slots_left: Number(form.total_slots),
      entry_fee: Number(form.entry_fee),
      prize_pool: Number(form.prize_pool),
      room_id: form.room_id || null,
      room_password: form.room_password || null,
      created_by: user.id,
    });
    if (error) toast.error(error.message);
    else { toast.success("Tournament created"); setOpen(false); load(); }
  };

  const cancel = async (id: string) => {
    await supabase.from("tournaments").update({ status: "cancelled" }).eq("id", id);
    load();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-black uppercase">Admin Panel</h1>
            <p className="text-muted-foreground">Manage tournaments & players</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="hero"><Plus className="h-4 w-4" /> New Tournament</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle className="font-display uppercase">Create Tournament</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
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
                    <Label>Match At</Label>
                    <Input type="datetime-local" value={form.match_at} onChange={(e) => setForm({ ...form, match_at: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Saturday Showdown #5" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Slots</Label><Input type="number" value={form.total_slots} onChange={(e) => setForm({ ...form, total_slots: Number(e.target.value) })} /></div>
                  <div><Label>Entry (coins)</Label><Input type="number" value={form.entry_fee} onChange={(e) => setForm({ ...form, entry_fee: Number(e.target.value) })} /></div>
                  <div><Label>Prize</Label><Input type="number" value={form.prize_pool} onChange={(e) => setForm({ ...form, prize_pool: Number(e.target.value) })} /></div>
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

        <Tabs defaultValue="tournaments">
          <TabsList>
            <TabsTrigger value="tournaments"><Trophy className="h-4 w-4 mr-2" /> Tournaments</TabsTrigger>
            <TabsTrigger value="bookings"><Users className="h-4 w-4 mr-2" /> Recent Bookings</TabsTrigger>
          </TabsList>
          <TabsContent value="tournaments" className="space-y-2 mt-4">
            {tournaments.map((t) => (
              <Card key={t.id} className="p-4 bg-gradient-card border-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-display uppercase text-primary">{t.game}</div>
                  <div className="font-display font-bold">{t.title}</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(t.match_at), "PP HH:mm")} · {t.slots_left}/{t.total_slots} slots · {t.entry_fee} entry · {t.prize_pool} prize</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-muted uppercase font-display">{t.status}</span>
                  {t.status !== "cancelled" && (
                    <Button variant="outline" size="sm" onClick={() => cancel(t.id)}>Cancel</Button>
                  )}
                </div>
              </Card>
            ))}
            {tournaments.length === 0 && <p className="text-muted-foreground">No tournaments yet.</p>}
          </TabsContent>
          <TabsContent value="bookings" className="space-y-2 mt-4">
            {bookings.map((b) => (
              <Card key={b.id} className="p-3 bg-gradient-card border-border flex items-center justify-between text-sm">
                <div>
                  <span className="font-bold">{b.profile?.username ?? "—"}</span>{" "}
                  joined <span className="text-primary">{b.tournament?.title}</span> ({b.tournament?.game})
                </div>
                <span className="text-xs px-2 py-1 bg-muted uppercase font-display">{b.status}</span>
              </Card>
            ))}
            {bookings.length === 0 && <p className="text-muted-foreground">No bookings yet.</p>}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
