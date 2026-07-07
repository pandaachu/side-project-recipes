// Scale a quantity string by a ratio for serving-size conversion.
// Only leading numbers (integer / decimal / simple fraction) are scaled;
// non-numeric quantities like「適量」「少許」are returned unchanged.
export function scaleQuantity(quantity: string, ratio: number): string {
  const trimmed = quantity.trim();
  if (!trimmed || ratio === 1) return quantity;

  // Match leading number: "300", "1.5", "1/2"
  const match = trimmed.match(/^(\d+(?:\.\d+)?(?:\s*\/\s*\d+(?:\.\d+)?)?)(.*)$/);
  if (!match) return quantity;

  const [, numberPart, rest] = match;
  let value: number;
  if (numberPart.includes('/')) {
    const [numerator, denominator] = numberPart.split('/').map((s) => parseFloat(s.trim()));
    if (!denominator) return quantity;
    value = numerator / denominator;
  } else {
    value = parseFloat(numberPart);
  }
  if (Number.isNaN(value)) return quantity;

  const scaled = value * ratio;
  // Round to at most 1 decimal, drop trailing .0
  const formatted = Number.isInteger(scaled) ? String(scaled) : String(Math.round(scaled * 10) / 10);
  return `${formatted}${rest}`;
}
