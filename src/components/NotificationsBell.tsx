import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

export const NotificationsBell = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const unread = items.filter((i) => !i.read).length;

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
    setItems(data ?? []);
  };

  useEffect(() => {
    if (!user) return;
    load();
    const ch = supabase.channel("notif-" + user.id).on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => load()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user?.id]);

  const markRead = async () => {
    if (!user || unread === 0) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    load();
  };

  if (!user) return null;

  return (
    <Popover onOpenChange={(o) => o && markRead()}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-display font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-glow">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="px-3 py-2 border-b border-border font-display uppercase text-sm">Notifications</div>
        <div className="max-h-80 overflow-y-auto">
          {items.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">All quiet on the front.</p>
          ) : items.map((n) => (
            <div key={n.id} className="px-3 py-2 border-b border-border last:border-0 hover:bg-muted/30">
              <div className="text-sm font-semibold">{n.title}</div>
              {n.body && <div className="text-xs text-muted-foreground">{n.body}</div>}
              <div className="text-[10px] text-muted-foreground mt-1 font-display uppercase">{format(new Date(n.created_at), "PP HH:mm")}</div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
