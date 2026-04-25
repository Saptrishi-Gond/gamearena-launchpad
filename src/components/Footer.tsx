import { Link } from "react-router-dom";
import {
  Flame, Trophy, Gamepad2, Crown, Gift, Users, LifeBuoy,
  FileText, ShieldCheck, Mail, Github, Twitter, Youtube, Instagram, MessageCircle,
} from "lucide-react";

const cols = [
  {
    title: "Arena",
    icon: Gamepad2,
    links: [
      { to: "/games/freefire", label: "Free Fire", icon: Flame },
      { to: "/games/bgmi", label: "BGMI", icon: Crown },
      { to: "/games/fc", label: "FC Mobile", icon: Trophy },
    ],
  },
  {
    title: "Compete",
    icon: Trophy,
    links: [
      { to: "/dashboard", label: "Dashboard", icon: Gamepad2 },
      { to: "/rewards", label: "Rewards", icon: Gift },
      { to: "/dashboard", label: "Leaderboard", icon: Crown },
    ],
  },
  {
    title: "Community",
    icon: Users,
    links: [
      { to: "/support", label: "Support", icon: LifeBuoy },
      { to: "#", label: "Terms", icon: FileText },
      { to: "#", label: "Privacy", icon: ShieldCheck },
    ],
  },
];

const socials = [
  { href: "#", label: "Discord", icon: MessageCircle, color: "hover:text-accent" },
  { href: "#", label: "Instagram", icon: Instagram, color: "hover:text-secondary" },
  { href: "#", label: "YouTube", icon: Youtube, color: "hover:text-primary" },
  { href: "#", label: "Twitter", icon: Twitter, color: "hover:text-accent" },
  { href: "#", label: "GitHub", icon: Github, color: "hover:text-foreground" },
  { href: "mailto:hello@battlearena.gg", label: "Email", icon: Mail, color: "hover:text-neon-yellow" },
];

export const Footer = () => {
  return (
    <footer className="relative mt-24 border-t border-border overflow-hidden">
      {/* glow accent */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/10 blur-3xl pointer-events-none" />

      <div className="container py-16 relative">
        {/* CTA strip */}
        <div className="mb-12 p-6 md:p-8 bg-gradient-card border border-border clip-angled flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="font-display text-xs uppercase tracking-[0.3em] text-primary mb-1">Ready Player One?</div>
            <h3 className="font-display text-2xl md:text-3xl font-black uppercase">
              Drop in. <span className="text-glow text-primary">Dominate.</span>
            </h3>
          </div>
          <Link
            to="/auth?mode=signup"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary font-display font-bold uppercase tracking-wider text-primary-foreground clip-angled shadow-glow"
          >
            <Flame className="h-5 w-5 group-hover:animate-flicker" />
            Join the Arena
          </Link>
        </div>

        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="relative">
                <Flame className="h-7 w-7 text-primary" />
                <div className="absolute inset-0 blur-lg bg-primary/40 group-hover:bg-primary/70 transition-all" />
              </div>
              <span className="font-display font-black text-xl tracking-wider">
                BATTLE<span className="text-primary">ARENA</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              India's premium mobile esports arena. Daily tournaments. Real prizes. Pure glory.
            </p>
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className={`h-10 w-10 inline-flex items-center justify-center bg-muted/40 border border-border clip-angled text-muted-foreground transition-all hover:border-primary/60 hover:-translate-y-0.5 ${s.color}`}
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map((c) => (
            <div key={c.title}>
              <div className="flex items-center gap-2 mb-4">
                <c.icon className="h-4 w-4 text-primary" />
                <h4 className="font-display text-sm font-bold uppercase tracking-[0.2em]">{c.title}</h4>
              </div>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <l.icon className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all" />
                      <span className="story-link">{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">
            © {new Date().getFullYear()} BattleArena · All Rights Reserved
          </p>
          <div className="flex items-center gap-2 text-xs font-display uppercase tracking-wider text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Servers Online · 12,438 Warriors Online
          </div>
        </div>
      </div>
    </footer>
  );
};
