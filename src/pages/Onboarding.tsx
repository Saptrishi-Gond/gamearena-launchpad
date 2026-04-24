import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Flame, ArrowRight, ArrowLeft, Check } from "lucide-react";

type GameKey = "freefire" | "bgmi" | "fc";
const GAMES: { key: GameKey; label: string }[] = [
  { key: "freefire", label: "Free Fire" },
  { key: "bgmi", label: "BGMI" },
  { key: "fc", label: "FC Mobile" },
];

export default function Onboarding() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("India");
  const [city, setCity] = useState("");
  const [picked, setPicked] = useState<Record<GameKey, boolean>>({ freefire: false, bgmi: false, fc: false });
  const [uids, setUids] = useState<Record<GameKey, string>>({ freefire: "", bgmi: "", fc: "" });

  useEffect(() => {
    document.title = "Set up your warrior — BattleArena";
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data?.onboarded) navigate("/dashboard", { replace: true });
      if (data?.username) setUsername(data.username);
    });
  }, [user, navigate]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const finish = async () => {
    setSaving(true);
    const updates = {
      username: username || user.email?.split("@")[0],
      full_name: fullName || null,
      phone: phone || null,
      country, city: city || null,
      onboarded: true,
    };
    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
    if (error) { toast.error(error.message); setSaving(false); return; }

    const rows = (Object.keys(picked) as GameKey[])
      .filter((g) => picked[g] && uids[g])
      .map((g) => ({ user_id: user.id, game: g, game_uid: uids[g] }));
    if (rows.length) {
      const { error: gpErr } = await supabase.from("game_profiles").upsert(rows, { onConflict: "user_id,game" });
      if (gpErr) toast.error(gpErr.message);
    }
    toast.success("Welcome to the arena!");
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl p-8 bg-gradient-card border-border clip-angled">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Flame className="h-7 w-7 text-primary animate-flicker" />
          <span className="font-display font-black text-xl tracking-wider">
            BATTLE<span className="text-primary text-glow">ARENA</span>
          </span>
        </div>
        <Progress value={step * 25} className="my-4" />
        <p className="text-xs text-center font-display uppercase text-muted-foreground mb-6">Step {step} of 4</p>

        {step === 1 && (
          <div className="space-y-4">
            <h1 className="font-display text-2xl font-bold uppercase">Pick your handle</h1>
            <p className="text-muted-foreground text-sm">This is how other warriors will see you.</p>
            <div>
              <Label>Username</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ProGamer42" />
            </div>
            <div>
              <Label>Full name (optional)</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h1 className="font-display text-2xl font-bold uppercase">Choose your games</h1>
            <p className="text-muted-foreground text-sm">Pick one or more. You can edit anytime.</p>
            {GAMES.map((g) => (
              <label key={g.key} className="flex items-center gap-3 p-3 border border-border bg-background/40 cursor-pointer hover:border-primary/60">
                <Checkbox checked={picked[g.key]} onCheckedChange={(v) => setPicked({ ...picked, [g.key]: !!v })} />
                <span className="font-display uppercase">{g.label}</span>
              </label>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h1 className="font-display text-2xl font-bold uppercase">Game IDs</h1>
            <p className="text-muted-foreground text-sm">Add your in-game ID for the games you picked.</p>
            {GAMES.filter((g) => picked[g.key]).map((g) => (
              <div key={g.key}>
                <Label>{g.label} UID</Label>
                <Input value={uids[g.key]} onChange={(e) => setUids({ ...uids, [g.key]: e.target.value })} placeholder="123456789" />
              </div>
            ))}
            {!Object.values(picked).some(Boolean) && (
              <p className="text-sm text-muted-foreground">No games picked. Skip this step.</p>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h1 className="font-display text-2xl font-bold uppercase">Almost there</h1>
            <p className="text-muted-foreground text-sm">Where are you battling from?</p>
            <div>
              <Label>Phone (optional)</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 …" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Country</Label><Input value={country} onChange={(e) => setCountry(e.target.value)} /></div>
              <div><Label>City</Label><Input value={city} onChange={(e) => setCity(e.target.value)} /></div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={back} disabled={step === 1}><ArrowLeft className="h-4 w-4" /> Back</Button>
          {step < 4 ? (
            <Button variant="hero" onClick={next}>Next <ArrowRight className="h-4 w-4" /></Button>
          ) : (
            <Button variant="hero" onClick={finish} disabled={saving}><Check className="h-4 w-4" /> Enter Arena</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
