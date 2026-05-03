import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./shell/AppShell";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { PlaceholderPage } from "./shell/PlaceholderPage";
import { GlossaryPage } from "../features/glossary/GlossaryPage";
import { JournalDetailPage, JournalPage } from "../features/journal/JournalPages";
import { MarketSimulatorPage } from "../features/market/MarketSimulatorPage";
import { SettingsPage } from "../features/settings/SettingsPage";
import { StrategyBuilderPage } from "../features/builder/StrategyBuilderPage";
import { StrategyDetailPage } from "../features/library/StrategyDetailPage";
import { StrategyLibraryPage } from "../features/library/StrategyLibraryPage";
import { LearnPage, LessonPage } from "../features/tutorials/TutorialPages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "learn",
        element: <LearnPage />,
      },
      {
        path: "learn/:lessonId",
        element: <LessonPage />,
      },
      {
        path: "builder",
        element: <StrategyBuilderPage />,
      },
      {
        path: "market",
        element: <MarketSimulatorPage />,
      },
      {
        path: "library",
        element: <StrategyLibraryPage />,
      },
      {
        path: "library/:strategyId",
        element: <StrategyDetailPage />,
      },
      {
        path: "journal",
        element: <JournalPage />,
      },
      {
        path: "journal/:tradeId",
        element: <JournalDetailPage />,
      },
      {
        path: "glossary",
        element: <GlossaryPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "*",
        element: (
          <PlaceholderPage
            eyebrow="404"
            title="Route not found"
            description="This route does not exist yet. Use the primary navigation to return to the app."
          />
        ),
      },
    ],
  },
]);
