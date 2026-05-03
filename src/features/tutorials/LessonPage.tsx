import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getBestQuizScore } from "../../domain/education/progress";
import { Badge } from "../../ui/Badge";
import { Button, LinkButton } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { ProgressBar } from "../../ui/ProgressBar";
import { StatusMessage } from "../../ui/StatusMessage";
import { LessonStepContent } from "./LessonStepContent";
import { useLessonState } from "./useLessonState";

export function LessonPage() {
  const lesson = useLessonState();

  if (lesson.loading) {
    return <Card className="min-h-96 animate-pulse" />;
  }

  if (!lesson.detail || !lesson.step) {
    return (
      <StatusMessage title="Lesson not found" tone="warning">
        This lesson is not available in the local tutorial seed data.
      </StatusMessage>
    );
  }

  const { detail, step, currentIndex, completedStepIds } = lesson;
  const isLastStep = currentIndex === detail.steps.length - 1;
  const showNextLessonButton =
    completedStepIds.has(step.id) && isLastStep && Boolean(detail.nextLesson);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <Link
            className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-ink"
            to="/learn"
          >
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
          <ProgressBar label="Lesson progress" value={lesson.percent} />
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
                onClick={() => lesson.goToStep(index)}
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
            onSelectAnswer={lesson.selectAnswer}
            selectedAnswers={lesson.selectedAnswers}
            step={step}
          />

          {lesson.saveMessage ? (
            <p className="mt-5 text-sm font-bold text-primary-ink">{lesson.saveMessage}</p>
          ) : null}

          <div className="mt-8 flex flex-col justify-between gap-3 sm:flex-row">
            <Button
              disabled={currentIndex === 0}
              icon={<ArrowLeft className="size-4" />}
              onClick={lesson.goPrev}
            >
              Previous
            </Button>
            <div className="flex flex-col gap-3 sm:flex-row">
              {detail.previousLesson ? (
                <LinkButton to={`/learn/${detail.previousLesson.id}`}>Previous lesson</LinkButton>
              ) : null}
              {showNextLessonButton ? (
                <LinkButton
                  icon={<ArrowRight className="size-4" />}
                  to={`/learn/${detail.nextLesson!.id}`}
                  variant="primary"
                >
                  Next lesson
                </LinkButton>
              ) : (
                <Button
                  disabled={!lesson.canSaveCurrentStep}
                  icon={<CheckCircle2 className="size-4" />}
                  onClick={() => void lesson.markStepComplete()}
                  variant="primary"
                >
                  {isLastStep ? "Complete lesson" : "Save and continue"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
