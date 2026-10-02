import {
  Cherry,
  Coffee,
  Cookie,
  CookingPot,
  Croissant,
  Fish,
  Grape,
  IceCreamBowl,
  Leaf,
  Martini,
  Milk,
  Nut,
  Salad,
  Shell,
  Soup,
  Sun,
} from "lucide-react";

/**
 * The dish notes were written with emoji as shorthand. These map onto Lucide
 * icons so the menu reads as icons rather than emoji.
 */
export const DISH_ICONS = {
  "🍵": Coffee,
  "🥧": Croissant,
  "🥔": CookingPot,
  "🍄": Soup,
  "🍓": Cherry,
  "🥛": Milk,
  "🥥": Leaf,
  "🥜": Nut,
  "🍍": Grape,
  "☕": Coffee,
  "🍝": Soup,
  "🍫": Cookie,
  "🍨": IceCreamBowl,
  "🌴": Sun,
  "🍗": Salad,
  "🍳": Shell,
  "🍃": Leaf,
  "🥗": Salad,
};

export function iconFor(icon) {
  return DISH_ICONS[icon] ?? Leaf;
}

export const REGION_ICONS = {
  "nuwara-eliya": Leaf,
  kurunegala: Coffee,
  galle: Fish,
  colombo: Martini,
};