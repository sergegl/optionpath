import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { glossaryTerms, type GlossaryCategory, type GlossaryTerm } from "../../data/glossary";
import { getGlossaryVisualAsset } from "../../data/trainingVisuals";
import { Badge } from "../../ui/Badge";
import { Card } from "../../ui/Card";
import { LearningVisualBlock } from "../tutorials/LearningVisualBlock";
import { EditorialImage } from "../visuals/EditorialImage";

const categories: Array<GlossaryCategory | "all"> = [
  "all",
  "contract",
  "pricing",
  "risk",
  "strategy",
  "greeks",
  "market",
];

export function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GlossaryCategory | "all">("all");
  const [selectedId, setSelectedId] = useState(glossaryTerms[0]?.id ?? "");

  const filteredTerms = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return glossaryTerms.filter((term) => {
      const matchesQuery =
        !normalized ||
        [term.term, term.shortDefinition, term.fullDefinition, term.category]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      const matchesCategory = category === "all" || term.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, query]);

  const selectedTerm =
    glossaryTerms.find((term) => term.id === selectedId) ?? filteredTerms[0] ?? glossaryTerms[0];

  return (
    <div className="space-y-6">
      <header className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-end">
        <div>
          <Badge tone="support">Glossary</Badge>
          <h1 className="mt-3 text-5xl font-black leading-none tracking-normal">Options terms</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-muted">
            Plain-English references for the terms used in lessons, strategy cards, and risk
            summaries.
          </p>
        </div>
        <EditorialImage
          alt="Connected concept cards representing option terms and definitions."
          imageClassName="aspect-[16/10]"
          src="/visuals/glossary-concepts.jpg"
        />
      </header>

      <Card>
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <label>
            <span className="mb-2 flex items-center gap-2 text-sm font-bold">
              <Search aria-hidden="true" className="size-4" />
              Search terms
            </span>
            <input
              className="input-control"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="assignment, delta, breakeven"
              value={query}
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold">Category</span>
            <select
              className="input-control capitalize"
              onChange={(event) => setCategory(event.target.value as GlossaryCategory | "all")}
              value={category}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <Card tone="muted">
          <p className="mb-4 font-mono text-[0.68rem] font-bold uppercase text-muted">
            {filteredTerms.length} terms
          </p>
          {filteredTerms.length ? (
            <div className="max-h-[38rem] space-y-2 overflow-auto pr-1">
              {filteredTerms.map((term) => (
                <button
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    selectedTerm?.id === term.id
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-white/72 hover:border-primary/40"
                  }`}
                  key={term.id}
                  onClick={() => setSelectedId(term.id)}
                  type="button"
                >
                  <span className="font-bold">{term.term}</span>
                  <span className="mt-1 block text-xs capitalize opacity-70">{term.category}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-muted">No terms match those filters.</p>
          )}
        </Card>

        {selectedTerm ? <GlossaryDetail term={selectedTerm} /> : null}
      </div>
    </div>
  );
}

function GlossaryDetail({ term }: { term: GlossaryTerm }) {
  const relatedTerms = term.relatedTermIds
    .map((id) => glossaryTerms.find((item) => item.id === id))
    .filter((item): item is GlossaryTerm => Boolean(item));
  const visualAsset = getGlossaryVisualAsset(term.id);

  return (
    <Card>
      <div className={visualAsset ? "grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]" : undefined}>
        <div>
          <Badge tone="primary">{term.category}</Badge>
          <h2 className="mt-4 text-4xl font-black tracking-normal">{term.term}</h2>
          <p className="mt-4 text-lg leading-8 text-muted">{term.fullDefinition}</p>
        </div>

        {visualAsset ? <LearningVisualBlock asset={visualAsset} compact /> : null}
      </div>

      {term.example ? (
        <div className="mt-6 rounded-lg border border-line bg-panel-muted p-4">
          <p className="font-mono text-[0.68rem] font-bold uppercase text-muted">Example</p>
          <p className="mt-2 text-base font-semibold leading-7">{term.example}</p>
        </div>
      ) : null}

      {term.relatedLessonIds.length ? (
        <div className="mt-6">
          <h3 className="text-lg font-black">Related lessons</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {term.relatedLessonIds.map((lessonId) => (
              <Link
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-bold transition hover:border-primary/40"
                key={lessonId}
                to={`/learn/${lessonId}`}
              >
                <BookOpen aria-hidden="true" className="size-4" />
                Open lesson
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {relatedTerms.length ? (
        <div className="mt-6">
          <h3 className="text-lg font-black">Related terms</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedTerms.map((item) => (
              <Badge key={item.id} tone="neutral">
                {item.term}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </Card>
  );
}
