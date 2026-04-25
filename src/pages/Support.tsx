import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Support() {
  const { user, loading } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [active, setActive] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [reply, setReply] = useState("");

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("support_tickets").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setTickets(data ?? []);
  };

  const loadReplies = async (id: string) => {
    const { data } = await supabase.from("ticket_replies").select("*").eq("ticket_id", id).order("created_at");
    setReplies(data ?? []);
  };

  useEffect(() => { document.title = "Support — BattleArena"; load(); }, [user]);
  useEffect(() => { if (active) loadReplies(active.id); }, [active]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const create = async () => {
    if (!subject || !message) { toast.error("Fill both fields"); return; }
    const { error } = await supabase.from("support_tickets").insert({ user_id: user.id, subject, message });
    if (error) toast.error(error.message);
    else { toast.success("Ticket sent"); setOpen(false); setSubject(""); setMessage(""); load(); }
  };

  const sendReply = async () => {
    if (!reply || !active) return;
    const { error } = await supabase.from("ticket_replies").insert({ ticket_id: active.id, user_id: user.id, message: reply, is_admin: false });
    if (error) toast.error(error.message); else { setReply(""); loadReplies(active.id); }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-10">
        <BackButton to="/dashboard" label="Dashboard" className="mb-4 -ml-3" />
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-black uppercase">Support</h1>
            <p className="text-muted-foreground">Need help? Open a ticket.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="hero"><Plus className="h-4 w-4" /> New Ticket</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display uppercase">New Support Ticket</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
                <div><Label>Message</Label><Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="hero" onClick={create}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {tickets.length === 0 ? (
          <p className="text-muted-foreground">No tickets yet.</p>
        ) : (
          <div className="space-y-2">
            {tickets.map((t) => (
              <Card key={t.id} className="p-4 bg-gradient-card border-border cursor-pointer hover:border-primary/60" onClick={() => setActive(t)}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold">{t.subject}</div>
                    <div className="text-xs text-muted-foreground">{format(new Date(t.created_at), "PP HH:mm")}</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-muted uppercase font-display">{t.status}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle className="font-display uppercase">{active?.subject}</DialogTitle></DialogHeader>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <div className="p-3 bg-background/50 border border-border">
                <div className="text-xs uppercase font-display text-muted-foreground mb-1">You</div>
                <p className="text-sm">{active?.message}</p>
              </div>
              {replies.map((r) => (
                <div key={r.id} className={`p-3 border ${r.is_admin ? "bg-primary/10 border-primary/40" : "bg-background/50 border-border"}`}>
                  <div className="text-xs uppercase font-display text-muted-foreground mb-1 flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> {r.is_admin ? "Support team" : "You"} · {format(new Date(r.created_at), "HH:mm")}
                  </div>
                  <p className="text-sm">{r.message}</p>
                </div>
              ))}
            </div>
            {active?.status !== "closed" && (
              <div className="flex gap-2 mt-3">
                <Input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type a reply…" onKeyDown={(e) => e.key === "Enter" && sendReply()} />
                <Button variant="hero" onClick={sendReply}>Send</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
}
