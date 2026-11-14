import { Sprout, sproutStage } from "@/design/illustrations";
import { results } from "../_strings/results";

// The bill health score as a sprout: taller means there is less to ask about.
export function HealthNote({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-3 rounded-soft bg-sage-soft p-4">
      <Sprout stage={sproutStage(score, 100)} className="h-14 w-14 shrink-0" />
      <p><span className="font-bold">{results.healthLabel}: </span>{results.healthNote(score)}</p>
    </div>
  );
}
