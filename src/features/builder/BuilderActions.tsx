import { NotebookPen, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../ui/Button";
import { StatusMessage } from "../../ui/StatusMessage";
import type { SaveState } from "./useBuilderState";

type Props = {
  validationErrors: string[];
  saveState: SaveState;
  savedTradeId: string | null;
  canSave: boolean;
  onSaveDraft: () => void;
  onSaveOpen: () => void;
};

export function BuilderActions({
  validationErrors,
  saveState,
  savedTradeId,
  canSave,
  onSaveDraft,
  onSaveOpen,
}: Props) {
  return (
    <>
      {validationErrors.length ? (
        <StatusMessage title="Fix required fields before saving" tone="warning">
          <ul className="list-disc pl-5">
            {validationErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </StatusMessage>
      ) : null}

      {saveState === "saved" ? (
        <StatusMessage title="Simulated trade saved" tone="success">
          The trade is stored locally in IndexedDB.{" "}
          {savedTradeId ? (
            <Link className="font-bold text-primary-ink underline" to={`/journal/${savedTradeId}`}>
              Open journal.
            </Link>
          ) : null}
        </StatusMessage>
      ) : null}

      {saveState === "error" ? (
        <StatusMessage title="Save failed" tone="warning">
          The draft stayed on screen. Check local storage permissions and try again.
        </StatusMessage>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          disabled={!canSave || saveState === "saving"}
          icon={<Save className="size-4" />}
          onClick={onSaveDraft}
        >
          Save draft
        </Button>
        <Button
          disabled={!canSave || saveState === "saving"}
          icon={<NotebookPen className="size-4" />}
          onClick={onSaveOpen}
          variant="primary"
        >
          Save open simulation
        </Button>
      </div>
    </>
  );
}
