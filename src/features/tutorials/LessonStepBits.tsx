import type { LessonStep } from "../../db/types";
import type { LessonVisualPayload } from "../../data/trainingVisuals";
import type { QuizQuestion } from "../../domain/education/progress";

export type StepPayload = LessonVisualPayload & {
  actionLabel?: string;
  bullets?: string[];
  example?: string;
  questions?: QuizQuestion[];
  strategyId?: string;
};

export function getQuizQuestions(step: LessonStep): QuizQuestion[] {
  const payload = step.payload as StepPayload | undefined;
  return payload?.questions ?? [];
}

export function ConceptCallout({
  body,
  label,
  tone = "neutral",
}: {
  body: string;
  label: string;
  tone?: "neutral" | "warning";
}) {
  return (
    <div
      className={`mt-5 rounded-lg border p-4 ${
        tone === "warning"
          ? "border-warning/30 bg-warning/10 text-[#744700]"
          : "border-line bg-panel-muted text-ink"
      }`}
    >
      <p className="font-mono text-[0.68rem] font-bold uppercase opacity-70">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6">{body}</p>
    </div>
  );
}

export function FormulaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-5 rounded-lg border border-support/20 bg-support/10 p-4">
      <p className="font-mono text-[0.68rem] font-bold uppercase text-support">{label}</p>
      <p className="number mt-2 text-xl font-black leading-tight text-ink">{value}</p>
    </div>
  );
}
