import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card className="surface-card overflow-hidden border-border/70 bg-card">
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
        {icon ? <div className="rounded-xl bg-primary/10 p-3 text-primary">{icon}</div> : null}
      </CardContent>
    </Card>
  );
}
