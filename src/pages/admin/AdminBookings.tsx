import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export default function AdminBookings() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    document.title = "Bookings · Admin";
    supabase.from("bookings")
      .select("*, tournament:tournaments(title, game), profile:profiles(username)")
      .order("created_at", { ascending: false }).limit(100)
      .then(({ data }) => setItems(data ?? []));
  }, []);
  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-black uppercase mb-6">Bookings</h1>
      <Card className="bg-gradient-card border-border">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Player</TableHead><TableHead>Tournament</TableHead><TableHead>Game</TableHead><TableHead>Status</TableHead><TableHead>When</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {items.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-bold">{b.profile?.username ?? "—"}</TableCell>
                <TableCell>{b.tournament?.title}</TableCell>
                <TableCell className="uppercase text-xs font-display text-primary">{b.tournament?.game}</TableCell>
                <TableCell><span className="text-xs px-2 py-1 bg-muted uppercase font-display">{b.status}</span></TableCell>
                <TableCell className="text-xs text-muted-foreground">{format(new Date(b.created_at), "PP HH:mm")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </AdminLayout>
  );
}
