import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminNotify() {
  const [audience, setAudience] = useState("all");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!title) { toast.error("Title required"); return; }
    setSending(true);
    let userIds: string[] = [];
    if (audience === "all") {
      const { data } = await supabase.from("profiles").select("id");
      userIds = (data ?? []).map((p) => p.id);
    } else {
      const { data } = await supabase.from("user_roles").select("user_id").eq("role", audience as any);
      userIds = (data ?? []).map((r) => r.user_id);
    }
    if (userIds.length === 0) { toast.error("No recipients"); setSending(false); return; }
    const rows = userIds.map((uid) => ({ user_id: uid, title, body: body || null }));
    const { error } = await supabase.from("notifications").insert(rows);
    setSending(false);
    if (error) toast.error(error.message);
    else { toast.success(`Sent to ${rows.length} player(s)`); setTitle(""); setBody(""); }
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-black uppercase mb-6">Broadcast</h1>
      <Card className="p-6 bg-gradient-card border-border max-w-2xl space-y-4">
        <div>
          <Label>Audience</Label>
          <Select value={audience} onValueChange={setAudience}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All players</SelectItem>
              <SelectItem value="admin">Admins only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label>Message</Label><Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} /></div>
        <Button variant="hero" onClick={send} disabled={sending}>Send Broadcast</Button>
      </Card>
    </AdminLayout>
  );
}
