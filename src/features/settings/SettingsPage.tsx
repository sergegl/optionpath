import { useEffect, useState } from "react";
import { Download, RotateCcw, ShieldCheck, Upload } from "lucide-react";
import {
  buildAppExport,
  importAppExport,
  resetUserData,
  validateAppExport,
  type AppExport,
} from "../../db/repositories/settingsRepository";
import { getRiskAcknowledgements, getRiskCopy } from "../../db/repositories/riskRepository";
import type { RiskAcknowledgement } from "../../db/types";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { StatusMessage } from "../../ui/StatusMessage";
import { LocalBackupInfographic } from "../visuals/InfographicPanels";

export function SettingsPage() {
  const [acknowledgements, setAcknowledgements] = useState<RiskAcknowledgement[]>([]);
  const [importPreview, setImportPreview] = useState<AppExport | null>(null);
  const [message, setMessage] = useState<{ tone: "success" | "warning" | "info"; title: string; body: string } | null>(
    null,
  );

  useEffect(() => {
    getRiskAcknowledgements().then(setAcknowledgements);
  }, []);

  async function exportData() {
    const appExport = await buildAppExport();
    const blob = new Blob([JSON.stringify(appExport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `optionpath-export-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage({
      tone: "success",
      title: "Export created",
      body: "Your local OptionPath data was exported as a JSON backup.",
    });
  }

  async function readImport(file: File | undefined) {
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;

      if (!validateAppExport(parsed)) {
        setImportPreview(null);
        setMessage({
          tone: "warning",
          title: "Invalid import file",
          body: "The file does not match the OptionPath export format.",
        });
        return;
      }

      setImportPreview(parsed);
      setMessage({
        tone: "info",
        title: "Import preview ready",
        body: "Review the record counts below, then choose merge or replace.",
      });
    } catch {
      setImportPreview(null);
      setMessage({
        tone: "warning",
        title: "Could not read file",
        body: "The selected file is not valid JSON.",
      });
    }
  }

  async function importData(mode: "merge" | "replace") {
    if (!importPreview) return;
    await importAppExport(importPreview, mode);
    setImportPreview(null);
    setMessage({
      tone: "success",
      title: "Import complete",
      body: `Local data was ${mode === "merge" ? "merged" : "replaced"} and seed content was repaired.`,
    });
  }

  async function resetData() {
    if (!confirm("Reset local progress, trades, journal entries, quiz attempts, and risk acknowledgements?")) {
      return;
    }

    await resetUserData();
    setAcknowledgements([]);
    setMessage({
      tone: "success",
      title: "Local data reset",
      body: "User-created local data was cleared and seed content was restored.",
    });
  }

  return (
    <div className="space-y-6">
      <header className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-end">
        <div>
          <Badge tone="support">Local data</Badge>
          <h1 className="mt-3 text-5xl font-black leading-none tracking-normal">Settings</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted">
            Manage local-first data stored in this browser. Exports do not include credentials or
            brokerage tokens because the MVP never stores them.
          </p>
        </div>
        <LocalBackupInfographic compact />
      </header>

      {message ? (
        <StatusMessage title={message.title} tone={message.tone}>
          {message.body}
        </StatusMessage>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="mb-5 flex items-center gap-2">
            <Download aria-hidden="true" className="size-5 text-primary" />
            <h2 className="text-2xl font-black">Export backup</h2>
          </div>
          <p className="text-sm leading-6 text-muted">
            Export progress, simulated trades, legs, journal entries, quiz attempts, watchlist
            symbols, risk acknowledgements, and app settings.
          </p>
          <div className="mt-5">
            <Button icon={<Download className="size-4" />} onClick={exportData} variant="primary">
              Export local data
            </Button>
          </div>
        </Card>

        <Card>
          <div className="mb-5 flex items-center gap-2">
            <Upload aria-hidden="true" className="size-5 text-support" />
            <h2 className="text-2xl font-black">Import backup</h2>
          </div>
          <label>
            <span className="mb-2 block text-sm font-bold">OptionPath JSON file</span>
            <input
              accept="application/json,.json"
              className="input-control py-2"
              onChange={(event) => readImport(event.target.files?.[0])}
              type="file"
            />
          </label>
          {importPreview ? (
            <div className="mt-5 rounded-lg border border-line bg-panel-muted p-4">
              <p className="font-mono text-[0.68rem] font-bold uppercase text-muted">Import preview</p>
              <div className="mt-3 grid gap-2 text-sm font-semibold sm:grid-cols-2">
                <span>{importPreview.data.userProgress.length} progress records</span>
                <span>{importPreview.data.simulatedTrades.length} trades</span>
                <span>{importPreview.data.journalEntries.length} journal entries</span>
                <span>{importPreview.data.quizAttempts.length} quiz attempts</span>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button onClick={() => importData("merge")}>Merge</Button>
                <Button onClick={() => importData("replace")} variant="danger">
                  Replace local data
                </Button>
              </div>
            </div>
          ) : null}
        </Card>
      </div>

      <Card tone="muted">
        <div className="mb-5 flex items-center gap-2">
          <ShieldCheck aria-hidden="true" className="size-5 text-primary" />
          <h2 className="text-2xl font-black">Risk acknowledgements</h2>
        </div>
        {acknowledgements.length ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {acknowledgements.map((record) => {
              const copy = getRiskCopy(record.context);
              return (
                <div className="rounded-lg border border-line bg-white/72 p-4" key={record.id}>
                  <Badge tone="warning">{record.context.replaceAll("_", " ")}</Badge>
                  <p className="mt-3 font-bold">{copy.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{copy.body}</p>
                  <p className="number mt-3 font-mono text-xs font-bold uppercase text-muted">
                    Accepted {new Date(record.createdAt).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm leading-6 text-muted">No risk acknowledgements recorded yet.</p>
        )}
      </Card>

      <Card>
        <div className="mb-5 flex items-center gap-2">
          <RotateCcw aria-hidden="true" className="size-5 text-danger" />
          <h2 className="text-2xl font-black">Reset local data</h2>
        </div>
        <p className="max-w-3xl text-sm leading-6 text-muted">
          Clears user progress, simulated trades, journal entries, quiz attempts, watchlists, and
          risk acknowledgements, then restores seed lessons and strategy templates.
        </p>
        <div className="mt-5">
          <Button icon={<RotateCcw className="size-4" />} onClick={resetData} variant="danger">
            Reset local data
          </Button>
        </div>
      </Card>
    </div>
  );
}
