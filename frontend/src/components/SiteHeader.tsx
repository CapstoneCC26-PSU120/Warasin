import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <Activity className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight font-inter">
            Calm<span className="text-accent-bright">Check</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="rounded-lg px-3 py-2 text-lg font-medium text-muted-foreground transition-smooth hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Home
          </Link>
          <Link
            to="/measurement"
            className="rounded-lg px-3 py-2 text-lg font-medium text-muted-foreground transition-smooth hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Measure
          </Link>
          <Link
            to="/history"
            className="rounded-lg px-3 py-2 text-lg font-medium text-muted-foreground transition-smooth hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            History
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild variant="default" size="sm">
            <Link to="/measurement">Start now</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
