export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background py-8">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-foreground">CalmCheck</span> — Mindful tools for a{" "}
          <span className="text-accent-bright font-medium">brighter</span> day.
        </p>
      </div>
    </footer>
  );
}
