export const REGIONS = [
  {
    id: "nuwara-eliya",
    name: "Nuwara Eliya",
    epithet: "The Tea Highlands",
    chapter: "Chapter I",
    storyTitle: "The Story of Nuwara Eliya",
    storiesTitle: "Stories from Old Nuwara Eliya",
    tagline:
      "From mist-covered mountains to world-famous Ceylon tea, Nuwara Eliya carries the story of Sri Lanka's highlands.",
    history:
      "Before it became known as the tea country, Nuwara Eliya was a remote highland landscape. In the early 1800s, its cool climate attracted attention as a place of retreat. By 1828, Sir Edward Barnes had established it as a hill-country rest area, and later agricultural pioneers began developing farms in the region. Then came the great change: after coffee plantations were devastated by coffee rust in the 1870s, tea spread rapidly through the highlands. By the end of the century, Nuwara Eliya had become one of Ceylon's principal tea-growing districts.\n\nAnd that is the Nuwara Eliya we tell through Kathā Ceylon — a story of mountains, farms, tea and the people who turned the highlands into one of Sri Lanka's most recognisable landscapes. Every dish carries a little piece of that story.",
    signatureIngredients: [
      "Ceylon tea",
      "Highland strawberries",
      "Hill-country potatoes",
      "Leeks & herbs",
    ],
    image: "/images/regions/nuwara-eliya.jpg",
    // silent 9:16 loop; poster is a ~25KB still so the plate paints instantly
    video: { src: "/video/regions/nuwara-eliya.mp4", poster: "/video/regions/nuwara-eliya-poster.jpg" },
    map: { x: 50, y: 60 },
  },
  {
    id: "kurunegala",
    name: "Kurunegala",
    epithet: "The Ancient Kingdom",
    chapter: "Chapter II",
    storyTitle: "Beneath the Elephant Rock",
    storiesTitle: "Stories from Kurunegala",
    tagline:
      "Long before modern cafés, Kurunegala was a royal centre where stories of kings, culture and tradition unfolded beneath its ancient rocky landscape.",
    history:
      "Kurunegala was once a royal capital, surrounded by great rocks and coconut country. At its heart stood Athugala — the elephant-shaped rock that became one of the city's defining landmarks.\n\nBut beyond the royal stories was another story — the story of ordinary kitchens. Coconut, jackfruit, spices, nuts and tropical fruits were transformed into food, placed on tables and shared between families and friends.\n\nKathā Ceylon brings that spirit forward — taking the flavours of old Sri Lanka and giving them a new chapter.",
    pullQuote:
      "Every rock has a story. Every ingredient has a memory. And every dish has a Kathā.",
    signatureIngredients: [
      "Kithul treacle",
      "Coconut",
      "Cashew",
      "Jackfruit",
    ],
    image: "/images/regions/kurunegala.jpg",
    video: { src: "/video/regions/kurunegala.mp4", poster: "/video/regions/kurunegala-poster.jpg" },
    map: { x: 45, y: 55 },
  },
  {
    id: "galle",
    name: "Galle",
    epithet: "The Southern Coast",
    chapter: "Chapter III",
    storyTitle: "Where the Island Meets the Sea",
    storiesTitle: "Galle — Stories from the Old Southern Coast",
    tagline:
      "Where the ocean met the old trading world, Galle became a meeting place of cultures, flavours and traditions.",
    history:
      "Galle's story is shaped by its fort, harbour, ocean and centuries of cultural exchange. These dishes don't claim to be ancient Galle recipes; instead, they take those real elements of Galle's history and turn them into new food stories for Kathā Ceylon.",
    signatureIngredients: [
      "True Ceylon cinnamon",
      "Day-boat seafood",
      "Coconut water",
      "Passionfruit",
    ],
    image: "/images/regions/galle.jpg",
    video: { src: "/video/regions/galle.mp4", poster: "/video/regions/galle-poster.jpg" },
    map: { x: 38, y: 78 },
  },
  {
    id: "colombo",
    name: "Colombo",
    epithet: "The Modern City",
    chapter: "Chapter IV",
    storyTitle: "Where Stories Meet",
    storiesTitle: "Colombo — Old City Stories",
    tagline:
      "Colombo is where Sri Lanka's many influences meet — a city shaped by trade, cultures, communities and constant change.",
    history:
      "Before Colombo became the city of towers and busy roads, it was a city of harbours, markets, spice traders, narrow streets and many cultures.\n\nShips arrived with stories from distant lands. Local ingredients travelled through busy markets. Different traditions met in Colombo's kitchens and slowly became part of the city's identity.\n\nAt Kathā Ceylon, we take those memories and give them new forms — keeping the roots while creating new stories.",
    pullQuote: "Same Roots. New Stories.",
    signatureIngredients: [
      "Ceylon coffee",
      "Devilled spices",
      "Rice flour (hoppers)",
      "Ceylon cinnamon",
    ],
    image: "/images/regions/colombo.jpg",
    video: { src: "/video/regions/colombo.mp4", poster: "/video/regions/colombo-poster.jpg" },
    map: { x: 30, y: 62 },
  },
];

export const REGION_BY_ID = Object.fromEntries(REGIONS.map((r) => [r.id, r]));

/**
 * Each chapter carries its own ink. The colour only ever appears as a hairline,
 * a dot, or a small label — never as a fill — so four identities coexist
 * without the page turning into a colour chart.
 *
 * `text` is the label colour, so it is the AA-safe step of the region hue: the
 * raw mark colour is fine for a hairline at 3:1 but not for an 11px label at
 * 4.5:1. `line` stays the raw hue because a rule only needs 3:1.
 */
export const REGION_INK = {
  "nuwara-eliya": {
    text: "text-tea",
    line: "bg-tea",
    border: "border-tea",
    raw: "#1F4739",
  },
  kurunegala: {
    // brass mark colour #A8763C is only 3.76:1 on paper, so the label uses the
    // darker brass-ink step and the rule keeps the real brass
    text: "brass-text",
    line: "bg-brass",
    border: "border-brass",
    raw: "#A8763C",
  },
  galle: {
    text: "text-indigo",
    line: "bg-indigo",
    border: "border-indigo",
    raw: "#2B5560",
  },
  colombo: {
    // the night rub is 4.22:1 on the stock surface, a hair under the floor, so
    // the label takes the rub-ink step and the rule keeps the region hue
    text: "text-rub-ink",
    line: "bg-rub",
    border: "border-rub",
    raw: "#7A2B21",
  },
};

export const regionInk = (id) => REGION_INK[id] ?? REGION_INK["nuwara-eliya"];