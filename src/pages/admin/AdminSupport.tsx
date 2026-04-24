import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminSupport() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [reply, setReply] = useState("");

  const load = async () => {
    const { data } = await supabase.from("support_tickets").select("*, profile:profiles(username)").order("created_at", { ascending: false });
    setTickets(data ?? []);
  };
  const loadReplies = async (id: string) => {
    const { data } = await supabase.from("ticket_replies").select("*").eq("ticket_id", id).order("created_at");
    setReplies(data ?? []);
  };
  useEffect(() => { document.title = "Support · Admin"; load(); }, []);
  useEffect(() => { if (active) loadReplies(active.id); }, [active]);

  const setStatus = async (id: string, status: string) => {
    await supabase.from("support_tickets").update({ status: status as any }).eq("id", id);
    load();
    if (active?.id === id) setActive({ ...active, status });
  };

  const send = async () => {
    if (!reply || !active || !user) return;
    const { error } = await supabase.from("ticket_replies").insert({
      ticket_id: active.id, user_id: user.id, message: reply, is_admin: true,
    });
    if (error) toast.error(error.message); else { setReply(""); loadReplies(active.id); }
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-black uppercase mb-6">Support Tickets</h1>
      <div className="space-y-2">
        {tickets.map((t) => (
          <Card key={t.id} className="p-4 bg-gradient-card border-border flex items-center justify-between">
            <div className="flex-1 cursor-pointer" onClick={() => setActive(t)}>
              <div className="font-display font-bold">{t.subject}</div>
              <div className="text-xs text-muted-foreground">{t.profile?.username ?? "—"} · {format(new Date(t.created_at), "PP HH:mm")}</div>
            </div>
            <Select value={t.status} onValueChange={(v) => setStatus(t.id, v)}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </Card>
        ))}
        {tickets.length === 0 && <p className="text-muted-foreground">No tickets.</p>}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle className="font-display uppercase">{active?.subject}</DialogTitle></DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <div className="p-3 bg-background/50 border border-border">
              <div className="text-xs uppercase font-display text-muted-foreground mb-1">{active?.profile?.username ?? "Player"}</div>
              <p className="text-sm">{active?.message}</p>
            </div>
            {replies.map((r) => (
              <div key={r.id} className={`p-3 border ${r.is_admin ? "bg-primary/10 border-primary/40" : "bg-background/50 border-border"}`}>
                <div className="text-xs uppercase font-display text-muted-foreground mb-1">{r.is_admin ? "Admin" : "Player"} · {format(new Date(r.created_at), "HH:mm")}</div>
                <p className="text-sm">{r.message}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <Input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply as admin…" onKeyDown={(e) => e.key === "Enter" && send()} />
            <Button variant="hero" onClick={send}>Send</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
