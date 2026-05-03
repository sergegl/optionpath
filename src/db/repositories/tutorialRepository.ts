import type { Lesson, LessonStep, QuizAttempt, Tutorial, UserProgress } from "../types";
import { db } from "../dexie";
import type { QuizResult } from "../../domain/education/progress";

export type TutorialPath = {
  tutorial: Tutorial;
  lessons: Array<Lesson & { progress?: UserProgress }>;
};

export type LessonDetail = {
  lesson: Lesson;
  steps: LessonStep[];
  progress?: UserProgress;
  quizAttempts: QuizAttempt[];
  nextLesson?: Lesson;
  previousLesson?: Lesson;
};

export async function getTutorialPaths(): Promise<TutorialPath[]> {
  const [tutorials, lessons, progress] = await Promise.all([
    db.tutorials.orderBy("order").toArray(),
    db.lessons.orderBy("order").toArray(),
    db.userProgress.toArray(),
  ]);
  const progressByLesson = new Map(progress.map((item) => [item.lessonId, item]));

  return tutorials.map((tutorial) => ({
    tutorial,
    lessons: lessons
      .filter((lesson) => lesson.tutorialId === tutorial.id)
      .map((lesson) => ({ ...lesson, progress: progressByLesson.get(lesson.id) })),
  }));
}

export async function getLessonDetail(lessonId: string): Promise<LessonDetail | null> {
  const lesson = await db.lessons.get(lessonId);

  if (!lesson) {
    return null;
  }

  const [steps, progress, quizAttempts, tutorialLessons] = await Promise.all([
    db.lessonSteps.where("lessonId").equals(lessonId).sortBy("order"),
    db.userProgress.where("lessonId").equals(lessonId).first(),
    db.quizAttempts.where("lessonId").equals(lessonId).toArray(),
    db.lessons.where("tutorialId").equals(lesson.tutorialId).sortBy("order"),
  ]);
  const index = tutorialLessons.findIndex((item) => item.id === lessonId);

  return {
    lesson,
    steps,
    progress,
    quizAttempts,
    previousLesson: index > 0 ? tutorialLessons[index - 1] : undefined,
    nextLesson: index >= 0 && index < tutorialLessons.length - 1 ? tutorialLessons[index + 1] : undefined,
  };
}

export async function completeLessonStep(
  lessonId: string,
  stepId: string,
  allStepIds: string[],
  score?: number,
) {
  const now = new Date().toISOString();
  const existing = await db.userProgress.where("lessonId").equals(lessonId).first();
  const completedStepIds = Array.from(new Set([...(existing?.completedStepIds ?? []), stepId]));
  const status = allStepIds.every((id) => completedStepIds.includes(id)) ? "completed" : "in_progress";

  const progress: UserProgress = {
    id: existing?.id ?? `progress-${lessonId}`,
    lessonId,
    completedStepIds,
    status,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    score: score ?? existing?.score,
  };

  await db.userProgress.put(progress);

  return progress;
}

export async function saveQuizAttempt(lessonId: string, score: number, questionResults: QuizResult[]) {
  const now = new Date().toISOString();

  const attempt: QuizAttempt = {
    id: `quiz-${lessonId}-${crypto.randomUUID()}`,
    lessonId,
    score,
    questionResults,
    createdAt: now,
    updatedAt: now,
  };

  await db.quizAttempts.add(attempt);

  return attempt;
}
