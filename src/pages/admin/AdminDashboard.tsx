import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Users, Trophy, Activity, Coins, Ticket, MessageSquare } from "lucide-react";

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({ users: 0, tournaments: 0, live: 0, revenue: 0, upcoming: 0, openTickets: 0 });

  useEffect(() => {
    document.title = "Admin · BattleArena";
    if (!isAdmin) return;
    (async () => {
      const [u, t, live, up, wl, tk] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("tournaments").select("id", { count: "exact", head: true }),
        supabase.from("tournaments").select("id", { count: "exact", head: true }).eq("status", "live"),
        supabase.from("tournaments").select("id", { count: "exact", head: true }).eq("status", "upcoming"),
        supabase.from("wallet_logs").select("delta").lt("delta", 0),
        supabase.from("support_tickets").select("id", { count: "exact", head: true }).eq("status", "open"),
      ]);
      const revenue = (wl.data ?? []).reduce((s, r: any) => s + Math.abs(r.delta ?? 0), 0);
      setStats({
        users: u.count ?? 0,
        tournaments: t.count ?? 0,
        live: live.count ?? 0,
        upcoming: up.count ?? 0,
        revenue,
        openTickets: tk.count ?? 0,
      });
    })();
  }, [isAdmin]);

  const cards = [
    { label: "Total Players", value: stats.users, icon: Users, color: "text-primary" },
    { label: "Tournaments", value: stats.tournaments, icon: Trophy, color: "text-accent" },
    { label: "Live Matches", value: stats.live, icon: Activity, color: "text-secondary" },
    { label: "Upcoming", value: stats.upcoming, icon: Ticket, color: "text-neon-yellow" },
    { label: "Coins Spent (entries)", value: stats.revenue, icon: Coins, color: "text-neon-yellow" },
    { label: "Open Tickets", value: stats.openTickets, icon: MessageSquare, color: "text-secondary" },
  ];

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-black uppercase mb-1">Command Center</h1>
      <p className="text-muted-foreground mb-6">Real-time arena overview</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5 bg-gradient-card border-border clip-angled">
            <div className="flex items-center gap-3">
              <c.icon className={`h-8 w-8 ${c.color}`} />
              <div>
                <div className="text-xs uppercase font-display text-muted-foreground">{c.label}</div>
                <div className="font-display text-3xl font-black">{c.value}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
