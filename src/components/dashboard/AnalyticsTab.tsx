import { BarChart3 } from "lucide-react";

export default function AnalyticsTab() {
  return (
    <div className="glass rounded-3xl p-8 text-center max-w-xl mx-auto my-12">
      <BarChart3 className="size-12 mx-auto text-accent mb-4 animate-float-slow" />
      <h2 className="text-xl font-600 font-display">BI Analytics</h2>
      <p className="text-sm text-muted-foreground mt-2">
        Analyze revenue curves, custom charts, and transaction velocities.
      </p>
      <div className="mt-6 h-1 w-20 bg-accent mx-auto rounded-full" />
    </div>
  );
}
