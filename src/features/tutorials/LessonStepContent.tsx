import { BookOpen, CheckCircle2 } from "lucide-react";
import { getTrainingVisualAsset } from "../../data/trainingVisuals";
import type { LessonStep } from "../../db/types";
import { Badge } from "../../ui/Badge";
import { LinkButton } from "../../ui/Button";
import { LearningVisualBlock } from "./LearningVisualBlock";
import { ConceptCallout, FormulaCard, type StepPayload } from "./LessonStepBits";

type Props = {
  step: LessonStep;
  selectedAnswers: Record<string, string>;
  onSelectAnswer: (questionId: string, answer: string) => void;
  bestQuizScore?: number;
};

export function LessonStepContent({
  step,
  selectedAnswers,
  onSelectAnswer,
  bestQuizScore,
}: Props) {
  const payload = step.payload as StepPayload | undefined;
  const questions = payload?.questions ?? [];
  const visualAsset = getTrainingVisualAsset(payload?.visual?.assetId);

  return (
    <article>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Badge
          tone={
            step.type === "quiz" ? "warning" : step.type === "summary" ? "primary" : "neutral"
          }
        >
          {step.type}
        </Badge>
      </div>

      <div className={visualAsset ? "grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]" : undefined}>
        <div>
          <h2 className="text-3xl font-black tracking-normal">{step.title}</h2>
          {payload?.plainLanguage?.oneLine ? (
            <p className="mt-4 rounded-lg border border-primary/20 bg-primary/10 p-4 text-xl font-black leading-7 text-primary-ink">
              {payload.plainLanguage.oneLine}
            </p>
          ) : null}
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">{step.body}</p>

          {payload?.plainLanguage?.analogy ? (
            <ConceptCallout label="Mental model" body={payload.plainLanguage.analogy} />
          ) : null}

          {payload?.plainLanguage?.formulaText ? (
            <FormulaCard
              label={payload.plainLanguage.formulaLabel ?? "Formula"}
              value={payload.plainLanguage.formulaText}
            />
          ) : null}

          {payload?.plainLanguage?.keyRisk ? (
            <ConceptCallout label="Risk note" body={payload.plainLanguage.keyRisk} tone="warning" />
          ) : null}

          {payload?.visual?.callouts?.length ? (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {payload.visual.callouts.map((callout) => (
                <ConceptCallout body={callout.body} key={callout.label} label={callout.label} />
              ))}
            </div>
          ) : null}

          {payload?.bullets?.length ? (
            <ul className="mt-6 grid gap-3">
              {payload.bullets.map((item) => (
                <li
                  className="flex gap-3 rounded-lg border border-line bg-white/72 p-4 text-sm leading-6 text-muted"
                  key={item}
                >
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {payload?.strategyId ? (
            <div className="mt-7">
              <LinkButton
                icon={<BookOpen className="size-4" />}
                to={`/builder?strategy=${payload.strategyId}`}
                variant="primary"
              >
                {payload.actionLabel ?? "Open in builder"}
              </LinkButton>
            </div>
          ) : null}
        </div>

        {visualAsset ? (
          <LearningVisualBlock
            alt={payload?.visual?.alt}
            asset={visualAsset}
            caption={payload?.visual?.caption}
            title={payload?.visual?.title}
          />
        ) : null}
      </div>

      {questions.length ? (
        <div className="mt-7 grid gap-4">
          {bestQuizScore !== undefined ? (
            <p className="text-sm font-bold text-muted">Best saved score: {bestQuizScore}%</p>
          ) : null}
          {questions.map((question) => (
            <fieldset className="rounded-lg border border-line bg-white/72 p-4" key={question.id}>
              <legend className="text-base font-black">{question.prompt}</legend>
              <div className="mt-4 grid gap-2">
                {question.choices.map((choice) => {
                  const checked = selectedAnswers[question.id] === choice;
                  return (
                    <label
                      className={`flex gap-3 rounded-lg border p-3 text-sm font-bold transition ${
                        checked ? "border-primary bg-primary/10" : "border-line bg-white"
                      }`}
                      key={choice}
                    >
                      <input
                        checked={checked}
                        name={question.id}
                        onChange={() => onSelectAnswer(question.id, choice)}
                        type="radio"
                        value={choice}
                      />
                      <span>{choice}</span>
                    </label>
                  );
                })}
              </div>
              {selectedAnswers[question.id] ? (
                <p className="mt-3 text-sm font-semibold text-muted">
                  {selectedAnswers[question.id] === question.answer
                    ? "Correct. Save the step to record this attempt."
                    : `Review: the answer is ${question.answer}. Save the step to record this attempt.`}
                </p>
              ) : null}
            </fieldset>
          ))}
        </div>
      ) : null}
    </article>
  );
}
