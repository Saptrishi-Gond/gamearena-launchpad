import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Search, User as UserIcon, LogOut, Gift, MessageSquare, Shield,
  Home, Trophy, Crown, Users, Swords
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { NotificationsBell } from "@/components/NotificationsBell";

const NAV = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/games/freefire", label: "Free Fire", icon: Swords },
  { to: "/games/bgmi", label: "BGMI", icon: Trophy },
  { to: "/leaderboard", label: "Rankings", icon: Crown },
  { to: "/support", label: "Community", icon: Users },
];

export const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/75 border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-md bg-gradient-primary grid place-items-center font-display text-primary-foreground text-lg">
            B
          </div>
          <span className="font-display text-xl tracking-wide uppercase">
            Battle<span className="text-primary">Arena</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.12em]">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`
              }
            >
              <n.icon className="h-3.5 w-3.5" />
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button className="h-9 w-9 grid place-items-center rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
            <Search className="h-4 w-4" />
          </button>
          {user ? (
            <>
              <NotificationsBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="pill-ghost">
                    <UserIcon className="h-4 w-4" /> {user.email?.split("@")[0]}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/rewards")}>
                    <Gift className="h-4 w-4 mr-2" /> Rewards
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/support")}>
                    <MessageSquare className="h-4 w-4 mr-2" /> Support
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Shield className="h-4 w-4 mr-2" /> Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/auth")} className="pill-ghost hidden sm:inline-flex">Login</button>
              <button onClick={() => navigate("/auth?mode=signup")} className="pill-btn">Play Now</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
