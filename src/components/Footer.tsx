import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="mt-24 border-t border-border bg-card/30">
      <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-primary grid place-items-center font-display text-primary-foreground text-sm">B</div>
          <span className="font-display text-lg uppercase tracking-wide">
            Battle<span className="text-primary">Arena</span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} BattleArena · Engineered for Competition · All Rights Reserved</p>
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          <Link to="#" className="hover:text-primary">Privacy Policy</Link>
          <Link to="#" className="hover:text-primary">Tournament Rules</Link>
          <Link to="/support" className="hover:text-primary">Support</Link>
          <Link to="#" className="hover:text-primary">API Docs</Link>
        </div>
      </div>
    </footer>
  );
};
