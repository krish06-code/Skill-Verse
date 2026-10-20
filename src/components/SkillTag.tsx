import { X } from "lucide-react";

interface SkillTagProps {
  label: string;
  variant?: "default" | "outline";
  onRemove?: () => void;
}

export function SkillTag({ label, variant = "default", onRemove }: SkillTagProps) {
  const base = "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium";
  const styles =
    variant === "outline"
      ? "border-border bg-background text-foreground"
      : "border-border bg-muted text-foreground";

  return (
    <span className={`${base} ${styles}`}>
      {label}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>
      ) : null}
    </span>
  );
}
