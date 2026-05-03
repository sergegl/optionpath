import type { Lesson, QuizAttempt, UserProgress } from "../../db/types";

export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  answer: string;
  explanation?: string;
};

export type QuizResult = {
  questionId: string;
  selectedChoiceIds: string[];
  correct: boolean;
};

export function calculateLessonCompletion(progress: UserProgress | undefined, stepIds: string[]) {
  if (!stepIds.length) return 0;
  const completed = new Set(progress?.completedStepIds ?? []);
  return (stepIds.filter((id) => completed.has(id)).length / stepIds.length) * 100;
}

export function calculateTutorialCompletion(
  lessons: Array<Lesson & { progress?: UserProgress }>,
) {
  if (!lessons.length) return 0;
  const completed = lessons.filter((lesson) => lesson.progress?.status === "completed").length;
  return (completed / lessons.length) * 100;
}

export function getNextLesson(lessons: Array<Lesson & { progress?: UserProgress }>) {
  return (
    lessons.find((lesson) => lesson.progress?.status === "in_progress") ??
    lessons.find((lesson) => lesson.progress?.status !== "completed") ??
    lessons[0] ??
    null
  );
}

export function scoreQuizAttempt(questions: QuizQuestion[], selectedAnswers: Record<string, string>) {
  const results: QuizResult[] = questions.map((question) => ({
    questionId: question.id,
    selectedChoiceIds: selectedAnswers[question.id] ? [selectedAnswers[question.id]] : [],
    correct: selectedAnswers[question.id] === question.answer,
  }));
  const correct = results.filter((result) => result.correct).length;

  return {
    score: questions.length ? Math.round((correct / questions.length) * 100) : 0,
    results,
  };
}

export function getLatestQuizScore(attempts: QuizAttempt[]) {
  return [...attempts].sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0]?.score;
}

export function getBestQuizScore(attempts: QuizAttempt[]) {
  return attempts.length ? Math.max(...attempts.map((attempt) => attempt.score)) : undefined;
}

