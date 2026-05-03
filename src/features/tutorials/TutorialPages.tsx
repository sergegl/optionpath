import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  completeLessonStep,
  getLessonDetail,
  getTutorialPaths,
  saveQuizAttempt,
  type LessonDetail,
  type TutorialPath,
} from "../../db/repositories/tutorialRepository";
import {
  calculateTutorialCompletion,
  getBestQuizScore,
  scoreQuizAttempt,
  type QuizQuestion,
} from "../../domain/education/progress";
import {
  getTrainingVisualAsset,
  type LessonVisualPayload,
} from "../../data/trainingVisuals";
import type { LessonStep } from "../../db/types";
import { Badge } from "../../ui/Badge";
import { Button, LinkButton } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { ProgressBar } from "../../ui/ProgressBar";
import { StatusMessage } from "../../ui/StatusMessage";
import { LearningVisualBlock } from "./LearningVisualBlock";
import { EditorialImage } from "../visuals/EditorialImage";

export function LearnPage() {
  const [paths, setPaths] = useState<TutorialPath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getTutorialPaths()
      .then((nextPaths) => {
        if (mounted) {
          setPaths(nextPaths);
          setLoading(false);
        }
      })
      .catch((error: unknown) => {
        console.error("Learn page failed", error);
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <Card className="min-h-80 animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <header className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-end">
        <div>
          <Badge tone="primary">Tutorial engine</Badge>
          <h1 className="mt-3 text-5xl font-black leading-none tracking-normal">Learn</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
            Beginner lessons now render from local IndexedDB and persist step completion after
            refresh.
          </p>
        </div>
        <div className="grid gap-3">
          <LinkButton icon={<Play className="size-4" />} to="/learn/lesson-option-contracts" variant="primary">
            Start foundations
          </LinkButton>
          <EditorialImage
            alt="Tactile training roadmap from beginner concepts through advanced option lessons."
            imageClassName="aspect-[16/9]"
            src="/visuals/learn-roadmap.jpg"
          />
        </div>
      </header>

      <div className="grid gap-5">
        {paths.map((path) => {
          const percent = calculateTutorialCompletion(path.lessons);

          return (
            <Card key={path.tutorial.id}>
              <div className="grid gap-5 xl:grid-cols-[18rem_minmax(0,1fr)]">
                <div>
                  <Badge tone={path.tutorial.level === "beginner" ? "primary" : "neutral"}>
                    {path.tutorial.level}
                  </Badge>
                  <h2 className="mt-3 text-2xl font-black">{path.tutorial.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{path.tutorial.summary}</p>
                  <div className="mt-5">
                    <ProgressBar label={`${path.tutorial.title} progress`} value={percent} />
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {path.lessons.map((lesson) => (
                    <Link
                      className="rounded-lg border border-line bg-white/72 p-4 transition hover:border-primary/40 hover:shadow-lift"
                      key={lesson.id}
                      to={`/learn/${lesson.id}`}
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <Badge tone={lesson.progress?.status === "completed" ? "primary" : "neutral"}>
                          {lesson.progress?.status?.replace("_", " ") ?? "not started"}
                        </Badge>
                        <span className="flex items-center gap-1 font-mono text-xs font-bold text-muted">
                          <Clock3 aria-hidden="true" className="size-3.5" />
                          {lesson.estimatedMinutes}m
                        </span>
                      </div>
                      <h3 className="text-lg font-black">{lesson.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{lesson.summary}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function LessonPage() {
  const { lessonId } = useParams();
  const [detail, setDetail] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;

    if (!lessonId) {
      setLoading(false);
      return;
    }

    getLessonDetail(lessonId)
      .then((nextDetail) => {
        if (!mounted) return;

        setDetail(nextDetail);
        setLoading(false);

        if (nextDetail) {
          const completed = new Set(nextDetail.progress?.completedStepIds ?? []);
          const firstIncompleteIndex = nextDetail.steps.findIndex((step) => !completed.has(step.id));
          setCurrentIndex(firstIncompleteIndex >= 0 ? firstIncompleteIndex : Math.max(0, nextDetail.steps.length - 1));
        }
      })
      .catch((error: unknown) => {
        console.error("Lesson load failed", error);
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [lessonId]);

  const completedStepIds = useMemo(
    () => new Set(detail?.progress?.completedStepIds ?? []),
    [detail?.progress?.completedStepIds],
  );
  const step = detail?.steps[currentIndex];
  const percent = detail?.steps.length
    ? (completedStepIds.size / detail.steps.length) * 100
    : 0;
  const currentQuizQuestions = step ? getQuizQuestions(step) : [];
  const canSaveCurrentStep =
    !step ||
    step.type !== "quiz" ||
    currentQuizQuestions.every((question) => Boolean(selectedAnswers[question.id]));

  async function markStepComplete() {
    if (!detail || !step) return;
    let score: number | undefined;
    let nextQuizAttempts = detail.quizAttempts;

    if (step.type === "quiz") {
      const result = scoreQuizAttempt(getQuizQuestions(step), selectedAnswers);
      score = result.score;
      const attempt = await saveQuizAttempt(detail.lesson.id, result.score, result.results);
      nextQuizAttempts = [...detail.quizAttempts, attempt];
    }

    const progress = await completeLessonStep(
      detail.lesson.id,
      step.id,
      detail.steps.map((item) => item.id),
      score,
    );

    setDetail({ ...detail, progress, quizAttempts: nextQuizAttempts });
    setSaveMessage(progress.status === "completed" ? "Lesson complete." : "Progress saved.");

    if (currentIndex < detail.steps.length - 1) {
      setCurrentIndex((value) => value + 1);
    }
  }

  if (loading) {
    return <Card className="min-h-96 animate-pulse" />;
  }

  if (!detail || !step) {
    return (
      <StatusMessage title="Lesson not found" tone="warning">
        This lesson is not available in the local tutorial seed data.
      </StatusMessage>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <Link className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-ink" to="/learn">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to lessons
          </Link>
          <div className="mt-5">
            <Badge tone="primary">{detail.lesson.level}</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-black leading-[0.98] tracking-normal sm:text-5xl">
            {detail.lesson.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">{detail.lesson.summary}</p>
        </div>
        <div className="w-full max-w-sm rounded-lg border border-line bg-white/72 p-4">
          <ProgressBar label="Lesson progress" value={percent} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[16rem_minmax(0,1fr)]">
        <Card tone="muted">
          <p className="mb-4 font-mono text-[0.68rem] font-bold uppercase text-muted">Steps</p>
          <div className="space-y-2">
            {detail.steps.map((lessonStep, index) => (
              <button
                className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left text-sm font-bold transition ${
                  index === currentIndex
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white/72 text-muted hover:text-ink"
                }`}
                key={lessonStep.id}
                onClick={() => setCurrentIndex(index)}
                type="button"
              >
                {completedStepIds.has(lessonStep.id) ? (
                  <CheckCircle2 aria-hidden="true" className="size-4 shrink-0" />
                ) : (
                  <span className="number flex size-4 shrink-0 items-center justify-center font-mono text-xs">
                    {index + 1}
                  </span>
                )}
                <span>{lessonStep.title}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="min-h-[30rem]">
          <LessonStepContent
            bestQuizScore={getBestQuizScore(detail.quizAttempts)}
            onSelectAnswer={(questionId, answer) =>
              setSelectedAnswers((current) => ({ ...current, [questionId]: answer }))
            }
            selectedAnswers={selectedAnswers}
            step={step}
          />

          {saveMessage ? <p className="mt-5 text-sm font-bold text-primary-ink">{saveMessage}</p> : null}

          <div className="mt-8 flex flex-col justify-between gap-3 sm:flex-row">
            <Button
              disabled={currentIndex === 0}
              icon={<ArrowLeft className="size-4" />}
              onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
            >
              Previous
            </Button>
            <div className="flex flex-col gap-3 sm:flex-row">
              {detail.previousLesson ? (
                <LinkButton to={`/learn/${detail.previousLesson.id}`}>Previous lesson</LinkButton>
              ) : null}
              {completedStepIds.has(step.id) && currentIndex === detail.steps.length - 1 && detail.nextLesson ? (
                <LinkButton icon={<ArrowRight className="size-4" />} to={`/learn/${detail.nextLesson.id}`} variant="primary">
                  Next lesson
                </LinkButton>
              ) : (
                <Button
                  disabled={!canSaveCurrentStep}
                  icon={<CheckCircle2 className="size-4" />}
                  onClick={markStepComplete}
                  variant="primary"
                >
                  {currentIndex === detail.steps.length - 1 ? "Complete lesson" : "Save and continue"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function LessonStepContent({
  step,
  selectedAnswers,
  onSelectAnswer,
  bestQuizScore,
}: {
  step: LessonStep;
  selectedAnswers: Record<string, string>;
  onSelectAnswer: (questionId: string, answer: string) => void;
  bestQuizScore?: number;
}) {
  const payload = step.payload as StepPayload | undefined;
  const questions = payload?.questions ?? [];
  const visualAsset = getTrainingVisualAsset(payload?.visual?.assetId);

  return (
    <article>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Badge tone={step.type === "quiz" ? "warning" : step.type === "summary" ? "primary" : "neutral"}>
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
            <FormulaCard label={payload.plainLanguage.formulaLabel ?? "Formula"} value={payload.plainLanguage.formulaText} />
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
                <li className="flex gap-3 rounded-lg border border-line bg-white/72 p-4 text-sm leading-6 text-muted" key={item}>
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

type StepPayload = LessonVisualPayload & {
  actionLabel?: string;
  bullets?: string[];
  example?: string;
  questions?: QuizQuestion[];
  strategyId?: string;
};

function ConceptCallout({
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

function FormulaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-5 rounded-lg border border-support/20 bg-support/10 p-4">
      <p className="font-mono text-[0.68rem] font-bold uppercase text-support">{label}</p>
      <p className="number mt-2 text-xl font-black leading-tight text-ink">{value}</p>
    </div>
  );
}

function getQuizQuestions(step: LessonStep): QuizQuestion[] {
  const payload = step.payload as StepPayload | undefined;
  return payload?.questions ?? [];
}
