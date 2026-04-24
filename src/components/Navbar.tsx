import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Flame, Shield, User as UserIcon, LogOut, Gift, MessageSquare } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { NotificationsBell } from "@/components/NotificationsBell";

export const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Flame className="h-7 w-7 text-primary animate-flicker" />
            <div className="absolute inset-0 blur-lg bg-primary/40 group-hover:bg-primary/70 transition-all" />
          </div>
          <span className="font-display font-black text-xl tracking-wider">
            BATTLE<span className="text-primary text-glow">ARENA</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-display text-sm font-semibold uppercase tracking-wider">
          <Link to="/games/freefire" className="hover:text-primary transition-colors">Free Fire</Link>
          <Link to="/games/bgmi" className="hover:text-primary transition-colors">BGMI</Link>
          <Link to="/games/fc" className="hover:text-primary transition-colors">FC</Link>
          {user && <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <NotificationsBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="font-display uppercase">
                    <UserIcon className="h-4 w-4 mr-2" /> {user.email?.split("@")[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
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
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="font-display uppercase">
                Login
              </Button>
              <Button variant="hero" size="sm" onClick={() => navigate("/auth?mode=signup")}>
                Join Arena
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
