import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

export const BackButton = ({ to, label = "Back", className = "" }: BackButtonProps) => {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className={`group font-display uppercase tracking-wider text-muted-foreground hover:text-primary ${className}`}
    >
      <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
      {label}
    </Button>
  );
};
