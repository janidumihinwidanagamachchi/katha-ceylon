import axios from "axios";
import { REGIONS, REGION_BY_ID } from "@/content/regions";
import { DISHES, DISH_BY_SLUG } from "@/content/dishes";

// The catalogue lives in src/content so the site is fully self-contained.
// If a slug or region is ever missing locally we fall back to the remote API.

const API = `${import.meta.env.VITE_FALLBACK_API_URL ?? ""}/api`;
const http = axios.create({ timeout: 15000 });

export const withRegionName = (dish) => ({
  ...dish,
  regionName: REGION_BY_ID[dish.region]?.name ?? dish.regionName ?? null,
  // Lot numbers run in catalogue order — the ledger's row index.
  lot: String(DISHES.indexOf(dish) + 1).padStart(2, "0"),
});

const localDishes = () => DISHES.map(withRegionName);

const filterDishes = ({ region, category, q, featured } = {}) =>
  localDishes().filter((d) => {
    if (region && d.region !== region) return false;
    if (category && d.category !== category) return false;
    if (typeof featured === "boolean" && d.featured !== featured) return false;
    if (q) {
      const needle = q.toLowerCase();
      const haystack = [d.name, d.keyIngredient, ...(d.ingredients ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });

export const getRegions = async () => {
  try {
    return REGIONS;
  } catch {
    const { data } = await http.get(`${API}/regions`);
    return data.regions;
  }
};

export const getRegionDetail = async (id) => {
  const local = REGION_BY_ID[id];
  if (local) {
    return {
      region: local,
      dishes: filterDishes({ region: id }),
      signatureIngredients: local.signatureIngredients,
    };
  }
  return http.get(`${API}/regions/${id}`).then((r) => r.data);
};

export const getDishes = async (params = {}) => {
  if (!DISHES.length) {
    const { data } = await http.get(`${API}/dishes`, { params });
    return data.dishes;
  }
  return filterDishes(params);
};

export const getDish = async (slug) => {
  const dish = DISH_BY_SLUG[slug];
  if (dish) {
    const region = REGION_BY_ID[dish.region];
    const suggestions = filterDishes({ region: dish.region }).filter((d) => d.slug !== slug).slice(0, 3);
    return { dish: withRegionName(dish), region, suggestions };
  }
  return http.get(`${API}/dishes/${slug}`).then((r) => r.data);
};

export async function streamChat(sessionId, message, onDelta) {
  const res = await fetch(`${API}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message }),
  });
  if (!res.ok || !res.body) throw new Error("Chat request failed");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let sid = sessionId;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop();
    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") return sid;
      try {
        const parsed = JSON.parse(payload);
        sid = parsed.session_id || sid;
        if (parsed.delta) onDelta(parsed.delta);
      } catch {}
    }
  }
  return sid;
}

export const dishUrl = (slug) => `${siteUrl()}/dish/${slug}`;

/**
 * The public origin of the site, without a trailing slash.
 *
 * This feeds the QR codes on the table cards, so it has to be the real
 * addressable URL. window.location.origin on its own is wrong on a project
 * Pages site: it would encode "https://user.github.io", which lands on the
 * user's profile page rather than the café. The deployment base is part of the
 * address, so it is appended when no explicit URL is configured.
 */
export function siteUrl() {
  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/+$/, "");
  const configured = import.meta.env.VITE_SITE_URL;
  const url = configured || `${window.location.origin}${base}`;
  return url.replace(/\/+$/, "");
}

/** Splits a story into paragraphs on blank lines. */
export const paragraphs = (text) =>
  String(text ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);