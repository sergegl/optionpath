import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  ChartNoAxesCombined,
  CheckCircle2,
  Clock3,
  LibraryBig,
  NotebookPen,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getDashboardData,
  getLevelLabel,
  type DashboardData,
  updateDashboardVisit,
} from "../../db/repositories/dashboardRepository";
import { Badge } from "../../ui/Badge";
import { LinkButton } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { MetricTile } from "../../ui/MetricTile";
import { ProgressBar } from "../../ui/ProgressBar";
import { StatusMessage } from "../../ui/StatusMessage";
import { EditorialImage } from "../visuals/EditorialImage";
import { LearningPathInfographic } from "../visuals/InfographicPanels";

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        await updateDashboardVisit();
        const dashboardData = await getDashboardData();
        if (isMounted) {
          setData(dashboardData);
          setError(false);
        }
      } catch (dashboardError) {
        console.error("Dashboard load failed", dashboardError);
        if (isMounted) {
          setError(true);
        }
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <StatusMessage title="Dashboard could not load" tone="warning">
        The local database initialized, but dashboard data could not be read. Reload the app or
        review browser storage permissions.
      </StatusMessage>
    );
  }

  if (!data) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <DashboardHero data={data} />
      <DashboardMetrics data={data} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <LearningPaths data={data} />
        <DashboardSideRail data={data} />
      </div>
    </div>
  );
}

function DashboardHero({ data }: { data: DashboardData }) {
  const completedPercent =
    data.totalLessonCount === 0
      ? 0
      : (data.completedLessonCount / data.totalLessonCount) * 100;

  return (
    <section className="w-full">
      <Card className="overflow-hidden p-0">
        <div className="grid min-h-[22rem] gap-0 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.38fr)]">
          <div className="min-w-0 p-6 sm:p-8 xl:p-10">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Badge tone="primary">Simulated learning</Badge>
              <Badge tone="neutral">IndexedDB local-first</Badge>
            </div>
            <h1 className="max-w-5xl break-words text-5xl font-black leading-[0.95] tracking-normal text-ink sm:text-6xl xl:text-7xl">
              Learn the trade before you model the risk.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Build options fluency through guided lessons, simulated strategies, payoff context,
              and local journaling. No brokerage connection, no live orders.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <LinkButton
                icon={<BookOpen className="size-4" />}
                size="lg"
                to={data.nextLesson ? `/learn/${data.nextLesson.id}` : "/learn"}
                variant="primary"
              >
                {data.nextLesson ? "Resume lesson" : "Start beginner path"}
              </LinkButton>
              <LinkButton icon={<ChartNoAxesCombined className="size-4" />} size="lg" to="/builder">
                Open builder
              </LinkButton>
            </div>
          </div>

          <div className="min-w-0 border-t border-ink/10 bg-ink p-5 text-white xl:border-l xl:border-t-0 xl:p-6">
            <div className="flex h-full flex-col justify-between gap-6">
              <EditorialImage
                alt="Abstract educational finance workspace with layered strategy cards and payoff sketches."
                imageClassName="aspect-[16/9]"
                src="/visuals/dashboard-hero.jpg"
              />

              <div>
                <p className="font-mono text-[0.68rem] font-bold uppercase text-white/55">
                  Next focus
                </p>
                <h2 className="mt-3 text-2xl font-black leading-tight">
                  {data.nextLesson?.title ?? "Beginner review complete"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/68">
                  {data.nextLesson?.summary ??
                    "You completed the available lesson seed data. More modules can now build on this shell."}
                </p>
              </div>

              <div className="space-y-4">
                <ProgressBar
                  label="Total lesson completion"
                  tone="inverse"
                  value={completedPercent}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-white/10 bg-white/8 p-3">
                    <p className="font-mono text-[0.65rem] font-bold uppercase text-white/50">
                      Complete
                    </p>
                    <p className="number mt-2 text-2xl font-black">
                      {data.completedLessonCount}/{data.totalLessonCount}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/8 p-3">
                    <p className="font-mono text-[0.65rem] font-bold uppercase text-white/50">
                      Open sims
                    </p>
                    <p className="number mt-2 text-2xl font-black">{data.openTradeCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

function DashboardMetrics({ data }: { data: DashboardData }) {
  return (
    <section aria-label="Dashboard metrics" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricTile
        detail="Seeded locally for the first learning path."
        icon={<CheckCircle2 className="size-4" />}
        label="Lessons done"
        value={`${data.completedLessonCount}/${data.totalLessonCount}`}
      />
      <MetricTile
        detail="Builder-saved drafts and open simulations."
        icon={<NotebookPen className="size-4" />}
        label="Simulated trades"
        tone="primary"
        value={String(data.totalTrades)}
      />
      <MetricTile
        detail="Ready for local strategy watch and examples."
        icon={<TrendingUp className="size-4" />}
        label="Watchlist"
        value={String(data.watchlist.length)}
      />
      <MetricTile
        detail={data.lastSavedAt ? formatShortDate(data.lastSavedAt) : "Initialized on this device"}
        icon={<CalendarClock className="size-4" />}
        label="Local save"
        value="On"
      />
    </section>
  );
}

function LearningPaths({ data }: { data: DashboardData }) {
  return (
    <Card>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge tone="support">Learning paths</Badge>
          <h2 className="mt-3 text-3xl font-black tracking-normal text-ink">Step-by-step map</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Beginner lessons are seeded now. Intermediate and advanced tracks are visible so the
            app structure is ready for the next feature set.
          </p>
        </div>
        <LinkButton icon={<LibraryBig className="size-4" />} to="/library" variant="secondary">
          View library
        </LinkButton>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {data.paths.map((path) => (
          <article className="rounded-lg border border-line bg-white/70 p-4" key={path.tutorial.id}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <Badge tone={path.tutorial.level === "beginner" ? "primary" : "neutral"}>
                {getLevelLabel(path.tutorial.level)}
              </Badge>
              <span className="number font-mono text-xs font-bold text-muted">
                {path.completedLessons}/{path.totalLessons}
              </span>
            </div>
            <h3 className="text-xl font-black leading-tight text-ink">{path.tutorial.title}</h3>
            <p className="mt-2 min-h-16 text-sm leading-6 text-muted">{path.tutorial.summary}</p>
            <div className="mt-5">
              <ProgressBar label={`${path.tutorial.title} progress`} value={path.percent} />
            </div>
          </article>
        ))}
      </div>
      <LearningPathInfographic className="mt-4" compact />
    </Card>
  );
}

function DashboardSideRail({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-6">
      <Card tone="muted">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <Badge tone="warning">Risk literacy</Badge>
            <h2 className="mt-3 text-2xl font-black">Practice in simulation</h2>
          </div>
          <Sparkles aria-hidden="true" className="size-5 text-warning" />
        </div>
        <p className="text-sm leading-6 text-muted">
          OptionPath labels every modeled trade as simulated and keeps risk context close to the
          action. Live brokerage execution is outside this MVP.
        </p>
        <EditorialImage
          alt="Notebook workspace for reviewing simulated option trades and risk notes."
          className="mt-5"
          imageClassName="aspect-[16/10]"
          src="/visuals/journal-review.jpg"
        />
      </Card>

      <RecentTrades data={data} />
      <Watchlist data={data} />
    </div>
  );
}

function RecentTrades({ data }: { data: DashboardData }) {
  if (data.recentTrades.length === 0) {
    return (
      <Card>
        <Badge tone="neutral">Recent trades</Badge>
        <h2 className="mt-3 text-2xl font-black">No simulations yet</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          The builder will save simulated trades here once the next feature group is implemented.
        </p>
        <div className="mt-5">
          <LinkButton icon={<ArrowRight className="size-4" />} to="/builder" variant="primary">
            Open builder
          </LinkButton>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Badge tone="neutral">Recent trades</Badge>
      <div className="mt-4 space-y-3">
        {data.recentTrades.map((trade) => (
          <Link
            className="block rounded-lg border border-line bg-white/72 p-4 transition hover:border-primary/40 hover:shadow-lift"
            key={trade.id}
            to={`/journal/${trade.id}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-ink">{trade.symbol}</p>
                <p className="mt-1 text-sm text-muted">{trade.strategy?.name ?? "Strategy"}</p>
              </div>
              <Badge tone={trade.status === "open" ? "primary" : "neutral"}>{trade.status}</Badge>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function Watchlist({ data }: { data: DashboardData }) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <Badge tone="neutral">Sample symbols</Badge>
          <h2 className="mt-3 text-2xl font-black">Watchlist</h2>
        </div>
        <Clock3 aria-hidden="true" className="size-5 text-muted" />
      </div>
      <div className="space-y-2">
        {data.watchlist.map((item) => (
          <div
            className="flex items-center justify-between gap-4 rounded-lg border border-line bg-white/72 px-3 py-3"
            key={item.id}
          >
            <div>
              <p className="font-mono text-sm font-black">{item.symbol}</p>
              <p className="text-xs leading-5 text-muted">{item.label}</p>
            </div>
            <Badge tone="support">Sample</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
      <Card className="min-h-[22rem] animate-pulse" />
      <Card className="min-h-[22rem] animate-pulse" />
    </div>
  );
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
