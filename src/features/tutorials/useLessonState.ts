import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  completeLessonStep,
  getLessonDetail,
  saveQuizAttempt,
  type LessonDetail,
} from "../../db/repositories/tutorialRepository";
import { scoreQuizAttempt } from "../../domain/education/progress";
import { getQuizQuestions } from "./LessonStepBits";

export function useLessonState() {
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
          const firstIncompleteIndex = nextDetail.steps.findIndex(
            (step) => !completed.has(step.id),
          );
          setCurrentIndex(
            firstIncompleteIndex >= 0
              ? firstIncompleteIndex
              : Math.max(0, nextDetail.steps.length - 1),
          );
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

  function selectAnswer(questionId: string, answer: string) {
    setSelectedAnswers((current) => ({ ...current, [questionId]: answer }));
  }

  function goToStep(index: number) {
    setCurrentIndex(index);
  }

  function goPrev() {
    setCurrentIndex((value) => Math.max(0, value - 1));
  }

  return {
    detail,
    loading,
    step,
    currentIndex,
    completedStepIds,
    percent,
    canSaveCurrentStep,
    saveMessage,
    selectedAnswers,
    selectAnswer,
    markStepComplete,
    goToStep,
    goPrev,
  };
}
