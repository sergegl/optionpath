import { useEffect, useState } from "react";
import { Clock3, Play } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getTutorialPaths,
  type TutorialPath,
} from "../../db/repositories/tutorialRepository";
import { calculateTutorialCompletion } from "../../domain/education/progress";
import { Badge } from "../../ui/Badge";
import { LinkButton } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { ProgressBar } from "../../ui/ProgressBar";
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
          <LinkButton
            icon={<Play className="size-4" />}
            to="/learn/lesson-option-contracts"
            variant="primary"
          >
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
                        <Badge
                          tone={lesson.progress?.status === "completed" ? "primary" : "neutral"}
                        >
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
