import { useEffect, useMemo, useState } from "react";
import DishCard from "@/components/DishCard";
import { getRegions, withRegionName } from "@/lib/api";
import { CATEGORIES, DISHES } from "@/content/dishes";

const ALL = "all";

/** Reads the local catalogue directly so filtering never waits on a promise. */
const getDishesSync = ({ region, category, q }) =>
  DISHES.filter((d) => {
    if (region && d.region !== region) return false;
    if (category && d.category !== category) return false;
    if (q) {
      const needle = q.toLowerCase();
      const hay = [d.name, d.keyIngredient, ...(d.ingredients ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
    // withRegionName assigns the canonical lot (catalogue order), so a lot
    // number is stable no matter which region or category is being viewed.
  }).map(withRegionName);

/**
 * The filter controls.
 *
 * The old bar stacked a labelled chapter row and a labelled course row plus a
 * search field. Sticky, that was 237px pinned under a 64px header on a 390px
 * phone — over a quarter of the screen permanently unavailable, and two of the
 * three groups were usually irrelevant to what you were looking at.
 *
 * So on a phone the bar is one 44px row: search, plus a toggle that reports how
 * many filters are active. The groups only appear when asked for, and then as
 * wrapping tabs with a 44px hit area instead of a horizontal swipe. From lg up
 * there is room for the real three-column ledger, always open.
 */
const FilterGroup = ({ label, items, value, onSelect, testidPrefix }) => (
  <div>
    <p className="field mb-2" id={`${testidPrefix}-label`}>
      {label}
    </p>
    <div
      className="flex flex-wrap gap-x-5 gap-y-1"
      role="group"
      aria-labelledby={`${testidPrefix}-label`}
    >
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          className={`tab min-h-11 lg:min-h-0 ${value === it.id ? "tab-on" : ""}`}
          onClick={() => onSelect(it.id)}
          aria-pressed={value === it.id}
          data-testid={`${testidPrefix}-${it.id}`}
        >
          {it.label}
        </button>
      ))}
    </div>
  </div>
);

const Menu = () => {
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState(ALL);
  const [category, setCategory] = useState(ALL);
  const [q, setQ] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getRegions().then(setRegions).catch(() => {});
  }, []);

  const dishes = useMemo(() => {
    let list = [];
    try {
      // synchronous read of the local catalogue keeps filtering instant
      list = getDishesSync({ region: region === ALL ? undefined : region, category: category === ALL ? undefined : category, q });
    } catch {
      list = [];
    }
    return list;
  }, [region, category, q]);

  const regionItems = useMemo(
    () => [{ id: ALL, label: "All" }, ...regions.map((r) => ({ id: r.id, label: r.name }))],
    [regions],
  );
  const categoryItems = useMemo(
    () => [{ id: ALL, label: "All" }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.label }))],
    [],
  );

  const activeCount =
    (region !== ALL ? 1 : 0) + (category !== ALL ? 1 : 0) + (q.trim() !== "" ? 1 : 0);
  const clear = () => {
    setRegion(ALL);
    setCategory(ALL);
    setQ("");
  };

  return (
    <div data-testid="menu-page">
      <header className="border-b border-rule">
        <div className="gutter mx-auto max-w-[86rem]">
          <div className="flex items-baseline justify-between gap-6 border-b border-rule py-3">
            <span className="field">The ledger</span>
            <span
              className="field tnum"
              role="status"
              aria-live="polite"
              data-testid="menu-count"
            >
              {dishes.length} lots
            </span>
          </div>

          <div className="grid grid-cols-1 gap-x-10 gap-y-8 py-12 lg:grid-cols-12">
            <h1 className="display text-[2.75rem] leading-[1] sm:text-5xl lg:col-span-7">
              Twenty-eight lots, four chapters.
            </h1>
            <p className="copy max-w-[42ch] self-end text-[0.9375rem] text-ink-soft lg:col-span-5">
              Filter by chapter or by course, or search for an ingredient. Every lot
              opens onto the region it came from.
            </p>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------- filter, as a form */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="sticky-filter sticky z-30 border-b border-rule bg-paper/94 backdrop-blur-md"
        aria-label="Filter the ledger"
      >
        <div className="gutter mx-auto max-w-[86rem]">
          {/* phone: one row — search and a toggle — then the panel on demand */}
          <div className="py-3 lg:hidden">
            <div className="flex items-center gap-2">
              <label htmlFor="menu-search" className="sr-only">
                Search lots by ingredient
              </label>
              <input
                id="menu-search"
                type="search"
                name="q"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="tea, coconut, cinnamon…"
                data-testid="menu-search"
                className="min-h-11 min-w-0 flex-1 border-b border-rule bg-transparent pb-1.5 text-[0.9375rem] text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                aria-expanded={showFilters}
                aria-controls="menu-filter-panel"
                data-testid="menu-filter-toggle"
                className={`flex min-h-11 shrink-0 items-center gap-2 border px-3.5 text-sm transition-colors duration-200 active:bg-stock ${
                  showFilters || activeCount
                    ? "border-ink text-ink"
                    : "border-rule text-ink-soft"
                }`}
              >
                Filter
                {activeCount > 0 && (
                  <span className="field tnum border border-ink px-1.5 leading-tight">
                    {activeCount}
                  </span>
                )}
              </button>
            </div>

            <div
              id="menu-filter-panel"
              hidden={!showFilters}
              className="space-y-4 pt-4"
              data-testid="menu-filter-panel"
            >
                <FilterGroup
                  label="Chapter"
                  items={regionItems}
                  value={region}
                  onSelect={setRegion}
                  testidPrefix="filter-region-m"
                />
                <FilterGroup
                  label="Course"
                  items={categoryItems}
                  value={category}
                  onSelect={setCategory}
                  testidPrefix="filter-category-m"
                />
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={clear}
                    className="field min-h-11 text-ink-soft hover:text-ink"
                    data-testid="menu-clear-filters"
                  >
                    Clear all filters
                  </button>
                )}
            </div>
          </div>

          {/* desktop: the real ledger, three columns, always open */}
          <div className="hidden gap-x-10 gap-y-5 py-5 lg:grid lg:grid-cols-12">
            <div className="lg:col-span-2">
              <FilterGroup
                label="Chapter"
                items={regionItems}
                value={region}
                onSelect={setRegion}
                testidPrefix="filter-region"
              />
            </div>
            <div className="lg:col-span-2">
              <FilterGroup
                label="Course"
                items={categoryItems}
                value={category}
                onSelect={setCategory}
                testidPrefix="filter-category"
              />
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <label htmlFor="menu-search-lg" className="field mb-2 block">
                Search
              </label>
              <input
                id="menu-search-lg"
                type="search"
                name="q"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="tea, coconut, cinnamon…"
                data-testid="menu-search-lg"
                className="min-h-9 w-full border-b border-rule bg-transparent pb-1.5 text-sm text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none"
              />
            </div>
          </div>
        </div>
      </form>

      {/* --------------------------------------------------------------- the lots */}
      <section className="py-14 sm:py-20">
        <div className="gutter mx-auto max-w-[86rem]">
          {dishes.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {dishes.map((d, i) => (
                <DishCard key={d.slug} dish={d} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center" data-testid="menu-empty">
              <p className="field mb-4">No matching lots</p>
              <p className="quotation mx-auto max-w-[24ch]">
                Nothing in the ledger matches that yet.
              </p>
              <button type="button" onClick={clear} className="btn-quiet mt-8">
                Clear the filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Menu;
