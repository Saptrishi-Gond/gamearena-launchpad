import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    document.title = "Users · Admin";
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(200)
      .then(({ data }) => setUsers(data ?? []));
  }, []);
  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-black uppercase mb-6">Players</h1>
      <Card className="bg-gradient-card border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead><TableHead>Rank</TableHead><TableHead>Coins</TableHead><TableHead>XP</TableHead><TableHead>Country</TableHead><TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-bold">{u.username ?? "—"}</TableCell>
                <TableCell>{u.rank ?? "Rookie"}</TableCell>
                <TableCell className="text-neon-yellow font-display">{u.wallet_coins}</TableCell>
                <TableCell className="text-primary font-display">{u.xp}</TableCell>
                <TableCell className="text-xs">{u.country ?? "—"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{format(new Date(u.created_at), "PP")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </AdminLayout>
  );
}
