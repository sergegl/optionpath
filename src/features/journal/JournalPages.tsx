import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, FileText, Search, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteTrade,
  getJournalTrades,
  getTradeDetail,
  updateTradeStatus,
  upsertJournalEntry,
  type TradeDetail,
  type TradeSummary,
} from "../../db/repositories/tradeRepository";
import type { JournalEntry, TradeStatus } from "../../db/types";
import { calculateStrategyMetrics, formatCurrency, formatPrice } from "../../domain/options/calculations";
import { Badge } from "../../ui/Badge";
import { Button, LinkButton } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { StatusMessage } from "../../ui/StatusMessage";
import { PayoffChart } from "../payoff/PayoffChart";
import { EditorialImage } from "../visuals/EditorialImage";

const statuses: Array<TradeStatus | "all"> = ["all", "draft", "open", "closed", "expired"];

const noteTypes: Array<{ type: JournalEntry["type"]; label: string; placeholder: string }> = [
  { type: "thesis", label: "Entry thesis", placeholder: "Why did this simulated trade fit the setup?" },
  { type: "risk_plan", label: "Risk plan", placeholder: "What is the max loss, breakeven, and assignment concern?" },
  { type: "exit_plan", label: "Exit plan", placeholder: "When would you close, adjust, or review the trade?" },
  { type: "adjustment", label: "Adjustment plan", placeholder: "What changes would you consider if price moves?" },
  { type: "result", label: "Result", placeholder: "What happened in the simulation?" },
  { type: "reflection", label: "Lessons learned", placeholder: "What would you improve next time?" },
];

export function JournalPage() {
  const [trades, setTrades] = useState<TradeSummary[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TradeStatus | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getJournalTrades().then((nextTrades) => {
      if (mounted) {
        setTrades(nextTrades);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredTrades = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return trades.filter((trade) => {
      const matchesStatus = status === "all" || trade.status === status;
      const matchesQuery =
        !normalized ||
        [trade.symbol, trade.strategy?.name, trade.status].join(" ").toLowerCase().includes(normalized);
      return matchesStatus && matchesQuery;
    });
  }, [query, status, trades]);

  if (loading) return <Card className="min-h-96 animate-pulse" />;

  return (
    <div className="space-y-6">
      <header className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <div>
          <Badge tone="primary">Trade journal</Badge>
          <h1 className="mt-3 text-5xl font-black leading-none tracking-normal">Simulated trade journal</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted">
            Review locally saved simulated trades, document decisions, and close the loop with
            reflections.
          </p>
        </div>
        <div className="grid gap-3">
          <LinkButton to="/builder" variant="primary">
            Build simulated trade
          </LinkButton>
          <EditorialImage
            alt="Notebook and checklist workspace for reviewing simulated option trade decisions."
            imageClassName="aspect-[16/10]"
            src="/visuals/journal-review.jpg"
          />
        </div>
      </header>

      <Card>
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_12rem]">
          <label>
            <span className="mb-2 flex items-center gap-2 text-sm font-bold">
              <Search aria-hidden="true" className="size-4" />
              Search journal
            </span>
            <input
              className="input-control"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="AAPL, long call, open"
              value={query}
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold">Status</span>
            <select
              className="input-control capitalize"
              onChange={(event) => setStatus(event.target.value as TradeStatus | "all")}
              value={status}
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      {filteredTrades.length ? (
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredTrades.map((trade) => (
            <Link
              className="rounded-lg border border-line bg-white/82 p-5 shadow-panel transition hover:border-primary/40 hover:shadow-lift"
              key={trade.id}
              to={`/journal/${trade.id}`}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-black">{trade.symbol}</p>
                  <h2 className="mt-2 text-2xl font-black">{trade.strategy?.name ?? "Strategy"}</h2>
                </div>
                <Badge tone={trade.status === "open" ? "primary" : "neutral"}>{trade.status}</Badge>
              </div>
              <p className="text-sm leading-6 text-muted">
                {trade.journalEntryCount
                  ? `${trade.journalEntryCount} journal notes saved`
                  : "No journal notes yet"}
              </p>
              <p className="number mt-4 font-mono text-xs font-bold uppercase text-muted">
                Updated {formatDate(trade.updatedAt ?? trade.createdAt)}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <h2 className="text-2xl font-black">No journal entries yet</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Save a simulated trade from the builder to start journaling.
          </p>
          <div className="mt-5">
            <LinkButton to="/builder" variant="primary">
              Open builder
            </LinkButton>
          </div>
        </Card>
      )}
    </div>
  );
}

export function JournalDetailPage() {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<TradeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    let mounted = true;

    if (!tradeId) {
      setLoading(false);
      return;
    }

    getTradeDetail(tradeId).then((nextDetail) => {
      if (!mounted) return;

      setDetail(nextDetail);
      setNotes(
        Object.fromEntries(
          noteTypes.map((note) => [
            note.type,
            nextDetail?.journalEntries.find((entry) => entry.type === note.type)?.body ?? "",
          ]),
        ),
      );
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [tradeId]);

  if (loading) return <Card className="min-h-96 animate-pulse" />;

  if (!detail) {
    return (
      <StatusMessage title="Trade not found" tone="warning">
        This simulated trade is not available in local storage.
      </StatusMessage>
    );
  }

  const metrics = calculateStrategyMetrics(detail.strategy, detail.legs, detail.trade.underlyingPrice);
  const currentTradeId = detail.trade.id;

  async function saveNote(type: JournalEntry["type"]) {
    if (!tradeId) return;
    try {
      const entry = await upsertJournalEntry({ tradeId, type, body: notes[type] ?? "" });
      setDetail((current) =>
        current
          ? {
              ...current,
              journalEntries: [
                ...current.journalEntries.filter((item) => item.type !== entry.type),
                entry,
              ],
            }
          : current,
      );
      setSaveState("saved");
    } catch (error) {
      console.error("Journal save failed", error);
      setSaveState("error");
    }
  }

  async function changeStatus(status: TradeStatus) {
    const updated = await updateTradeStatus(currentTradeId, status);
    if (updated) {
      setDetail((current) => (current ? { ...current, trade: updated } : current));
    }
  }

  async function removeTrade() {
    if (!confirm("Delete this simulated trade and its journal notes?")) return;
    await deleteTrade(currentTradeId);
    navigate("/journal");
  }

  return (
    <div className="space-y-6">
      <Link className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-ink" to="/journal">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to journal
      </Link>

      <Card>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge tone="primary">{detail.trade.status}</Badge>
              <Badge tone="support">Simulated</Badge>
            </div>
            <p className="font-mono text-sm font-black text-muted">{detail.trade.symbol}</p>
            <h1 className="mt-2 text-5xl font-black leading-none tracking-normal">
              {detail.strategy?.name ?? "Simulated trade"}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
              {detail.strategy?.summary ?? "Local simulated trade saved from the builder."}
            </p>
          </div>
          <div className="space-y-3">
            <label>
              <span className="mb-2 block text-sm font-bold">Trade status</span>
              <select
                className="input-control capitalize"
                onChange={(event) => changeStatus(event.target.value as TradeStatus)}
                value={detail.trade.status}
              >
                {statuses.filter((item) => item !== "all").map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <Button icon={<Trash2 className="size-4" />} onClick={removeTrade} variant="danger">
              Delete trade
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <Card>
          <Badge tone="primary">Payoff review</Badge>
          <div className="mt-4">
            <PayoffChart
              breakevens={metrics.breakevens}
              currentUnderlyingPrice={detail.trade.underlyingPrice}
              maxLoss={metrics.maxLoss}
              maxProfit={metrics.maxProfit}
              points={metrics.points}
              title={`${detail.strategy?.name ?? "Trade"} payoff`}
            />
          </div>
        </Card>
        <Card tone="muted">
          <h2 className="text-xl font-black">Trade metrics</h2>
          <dl className="mt-5 space-y-4">
            <Metric label="Underlying" value={formatPrice(detail.trade.underlyingPrice)} />
            <Metric label="Max profit" value={metrics.summary.maxProfit} />
            <Metric label="Max loss" value={metrics.summary.maxLoss} />
            <Metric label="Breakeven" value={metrics.summary.breakevens} />
            <Metric label="Net premium" value={formatCurrency(metrics.netCredit)} />
          </dl>
        </Card>
      </div>

      <Card>
        <div className="mb-5 flex items-center gap-2">
          <FileText aria-hidden="true" className="size-5 text-primary" />
          <h2 className="text-2xl font-black">Journal notes</h2>
        </div>
        {saveState === "saved" ? (
          <p className="mb-4 text-sm font-bold text-primary-ink">Note saved locally.</p>
        ) : null}
        {saveState === "error" ? (
          <p className="mb-4 text-sm font-bold text-danger">Save failed. Your text is still on screen.</p>
        ) : null}
        <div className="grid gap-4 lg:grid-cols-2">
          {noteTypes.map((note) => (
            <div className="rounded-lg border border-line bg-white/72 p-4" key={note.type}>
              <label>
                <span className="mb-2 block text-sm font-bold">{note.label}</span>
                <textarea
                  className="input-control min-h-32 resize-y py-3"
                  onChange={(event) => setNotes({ ...notes, [note.type]: event.target.value })}
                  placeholder={note.placeholder}
                  value={notes[note.type] ?? ""}
                />
              </label>
              <div className="mt-3">
                <Button onClick={() => saveNote(note.type)} size="sm">
                  Save note
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[0.68rem] font-bold uppercase text-muted">{label}</dt>
      <dd className="number mt-1 text-lg font-black">{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
