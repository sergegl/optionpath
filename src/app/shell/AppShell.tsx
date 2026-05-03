import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  BookOpen,
  ChartCandlestick,
  ChartNoAxesCombined,
  CircleDollarSign,
  Gauge,
  LibraryBig,
  Menu,
  NotebookPen,
  Search,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { initializeDatabase } from "../../db/seed";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { clsx } from "../../ui/clsx";
import { StatusMessage } from "../../ui/StatusMessage";

const primaryNavItems = [
  { label: "Dashboard", path: "/", icon: Gauge },
  { label: "Learn", path: "/learn", icon: BookOpen },
  { label: "Builder", path: "/builder", icon: ChartNoAxesCombined },
  { label: "Market", path: "/market", icon: ChartCandlestick },
  { label: "Library", path: "/library", icon: LibraryBig },
  { label: "Journal", path: "/journal", icon: NotebookPen },
  { label: "Glossary", path: "/glossary", icon: Search },
];

const mobileNavItems = primaryNavItems.filter((item) =>
  ["/", "/learn", "/builder", "/market", "/journal"].includes(item.path),
);

export function AppShell() {
  const [initState, setInitState] = useState<"loading" | "ready" | "error">("loading");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    initializeDatabase()
      .then(() => {
        if (isMounted) {
          setInitState("ready");
        }
      })
      .catch((error: unknown) => {
        console.error("Database initialization failed", error);
        if (isMounted) {
          setInitState("error");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const nav = useMemo(
    () => (
      <nav aria-label="Primary navigation" className="space-y-1">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              className={({ isActive }) =>
                clsx(
                  "group flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold transition duration-200",
                  isActive
                    ? "bg-ink text-white shadow-[0_14px_32px_rgba(18,21,18,0.18)]"
                    : "text-muted hover:bg-ink/5 hover:text-ink",
                )
              }
              end={item.path === "/"}
              key={item.path}
              onClick={() => setMenuOpen(false)}
              to={item.path}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    ),
    [],
  );

  return (
    <div className="app-grid min-h-screen pb-20 text-ink md:pb-0">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-ink/10 bg-canvas/88 px-4 py-5 backdrop-blur-xl lg:block">
        <ShellBrand />
        <div className="mt-8">{nav}</div>
        <div className="absolute bottom-5 left-4 right-4 space-y-3">
          <NavLink
            className={({ isActive }) =>
              clsx(
                "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold transition duration-200",
                isActive ? "bg-panel text-ink shadow-panel" : "text-muted hover:bg-ink/5 hover:text-ink",
              )
            }
            to="/settings"
          >
            <Settings aria-hidden="true" className="size-4" />
            <span>Settings</span>
          </NavLink>
          <LocalStatus />
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-ink/10 bg-canvas/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <ShellBrand compact />
          <Button
            aria-expanded={menuOpen}
            aria-label="Open navigation"
            icon={<Menu className="size-4" />}
            onClick={() => setMenuOpen((value) => !value)}
            size="sm"
            variant="secondary"
          >
            Menu
          </Button>
        </div>
        {menuOpen ? <div className="mt-4">{nav}</div> : null}
      </header>

      <div className="lg:pl-72">
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8" id="main-content">
          {initState === "loading" ? (
            <AppLoading />
          ) : initState === "error" ? (
            <DatabaseError />
          ) : (
            <Outlet />
          )}
        </main>
      </div>

      <nav
        aria-label="Mobile primary navigation"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 gap-1 border-t border-ink/10 bg-canvas/94 px-2 py-2 backdrop-blur-xl lg:hidden"
      >
        {mobileNavItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              aria-label={item.label}
              className={({ isActive }) =>
                clsx(
                  "flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[0.68rem] font-bold transition",
                  isActive ? "bg-ink text-white" : "text-muted hover:bg-ink/5 hover:text-ink",
                )
              }
              end={item.path === "/"}
              key={item.path}
              to={item.path}
            >
              <Icon aria-hidden="true" className="size-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

function ShellBrand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-ink text-white shadow-lift">
        <CircleDollarSign aria-hidden="true" className="size-6" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-lg font-black leading-5">OptionPath</p>
          {!compact ? <Badge tone="primary">Simulated</Badge> : null}
        </div>
        <p className="mt-1 font-mono text-[0.68rem] font-bold uppercase text-muted">
          Local-first education
        </p>
      </div>
    </div>
  );
}

function LocalStatus() {
  return (
    <div className="surface-muted rounded-lg p-3">
      <div className="mb-2 flex items-center gap-2">
        <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
        <p className="font-mono text-[0.68rem] font-bold uppercase text-muted">Local storage</p>
      </div>
      <p className="text-sm leading-5 text-ink">
        Progress and simulated trades stay in this browser.
      </p>
    </div>
  );
}

function AppLoading() {
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <div className="surface w-full max-w-md rounded-lg p-6 text-center">
        <div className="mx-auto mb-4 size-10 animate-pulse rounded-lg bg-primary/20" />
        <h1 className="text-2xl font-black">Preparing OptionPath</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Initializing local lessons, strategies, and dashboard data.
        </p>
      </div>
    </div>
  );
}

function DatabaseError() {
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <div className="w-full max-w-xl">
        <StatusMessage title="Local database is unavailable" tone="warning">
          OptionPath needs browser storage to save tutorials, progress, and simulated trades.
          Check private browsing settings or storage permissions, then reload the app.
        </StatusMessage>
      </div>
    </div>
  );
}
