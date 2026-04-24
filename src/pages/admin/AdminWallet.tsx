import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export default function AdminWallet() {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    document.title = "Wallet Logs · Admin";
    supabase.from("wallet_logs").select("*").order("created_at", { ascending: false }).limit(200)
      .then(({ data }) => setLogs(data ?? []));
  }, []);
  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-black uppercase mb-6">Wallet Logs</h1>
      <Card className="bg-gradient-card border-border">
        <Table>
          <TableHeader>
            <TableRow><TableHead>User ID</TableHead><TableHead>Delta</TableHead><TableHead>Reason</TableHead><TableHead>When</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="text-xs font-mono">{l.user_id.slice(0, 8)}…</TableCell>
                <TableCell className={`font-display font-bold ${l.delta < 0 ? "text-secondary" : "text-primary"}`}>
                  {l.delta > 0 ? "+" : ""}{l.delta}
                </TableCell>
                <TableCell className="text-xs">{l.reason}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{format(new Date(l.created_at), "PP HH:mm")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </AdminLayout>
  );
}
