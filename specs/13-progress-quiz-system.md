# 13 - Progress + Quiz System

## Purpose

Track lesson progress, quiz attempts, completion state, and path-level learning progress locally.

## User Stories

- As a learner, I want completed steps and lessons to stay complete.
- As a user, I want to retake quizzes and see whether I improved.
- As a returning user, I want the app to recommend my next lesson.
- As a learner, I want progress indicators that guide me without shaming me.

## UX Flow

Progress:

1. User completes a lesson step.
2. Step ID is added to completed steps.
3. Lesson becomes completed when required steps are complete.
4. Dashboard and Learn path update.

Quiz:

1. User answers quiz questions.
2. App shows immediate explanations.
3. Attempt saves at completion.
4. User can retry.

## Data Model

```ts
type QuizQuestion = {
  id: string;
  prompt: string;
  choices: QuizChoice[];
  correctChoiceIds: string[];
  explanation: string;
};

type QuizChoice = {
  id: string;
  label: string;
};

type QuizAttempt = {
  id: string;
  lessonId: string;
  questionResults: {
    questionId: string;
    selectedChoiceIds: string[];
    correct: boolean;
  }[];
  score: number;
  createdAt: string;
};
```

Stores:

- `userProgress`
- `quizAttempts`

## State Rules

- Completing a step is idempotent.
- Completing all required steps marks lesson complete.
- Quiz attempts are append-only in MVP.
- Latest score can be displayed, but previous attempts remain.
- Progress can be reset from settings/import-export feature.

## Domain Logic

Progress helpers:

- calculateLessonCompletion
- calculateTutorialCompletion
- getNextLesson
- scoreQuizAttempt
- getBestQuizScore
- getLatestQuizScore

## Error and Empty States

- No progress record: create lazily on first step completion.
- Quiz save failure: show retry save action.
- Missing question: skip broken question and log diagnostic.
- Reset progress requires confirmation.

## Accessibility Requirements

- Quiz controls use radio or checkbox groups.
- Correct/incorrect result is text-based, not color-only.
- Progress bars include numeric text.
- Completion announcements should be polite live-region messages.

## Tests

- Step completion is idempotent.
- Lesson completes when required steps complete.
- Tutorial completion percent is correct.
- Quiz scoring handles single and multiple correct answers.
- Attempts persist and latest/best score derive correctly.
- Next lesson logic works for new and returning users.

## Definition of Done

- Progress persists after refresh.
- Dashboard and Tutorial Engine use the same progress data.
- Quiz attempts persist.
- Progress indicators are clear and accessible.

