const ONES = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];

const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function chunkToWords(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) {
    const ten = Math.floor(n / 10);
    const one = n % 10;
    return one ? `${TENS[ten]}-${ONES[one]}` : TENS[ten];
  }
  const hundred = Math.floor(n / 100);
  const rest = n % 100;
  return rest ? `${ONES[hundred]} hundred ${chunkToWords(rest)}` : `${ONES[hundred]} hundred`;
}

/** Convert a non-negative integer (and optional cents) to English words. */
export function numberToWords(amount: number, currency = "USD"): string {
  if (!Number.isFinite(amount)) return "";
  const negative = amount < 0;
  const abs = Math.abs(amount);
  const whole = Math.floor(abs);
  const cents = Math.round((abs - whole) * 100);

  if (whole === 0 && cents === 0) {
    return `Zero ${currency} only`;
  }

  const parts: string[] = [];
  let n = whole;

  const billions = Math.floor(n / 1_000_000_000);
  n %= 1_000_000_000;
  const millions = Math.floor(n / 1_000_000);
  n %= 1_000_000;
  const thousands = Math.floor(n / 1_000);
  n %= 1_000;

  if (billions) parts.push(`${chunkToWords(billions)} billion`);
  if (millions) parts.push(`${chunkToWords(millions)} million`);
  if (thousands) parts.push(`${chunkToWords(thousands)} thousand`);
  if (n) parts.push(chunkToWords(n));

  let text = parts.join(" ");
  if (cents > 0) {
    text += ` and ${chunkToWords(cents)} cents`;
  }

  text = `${text} ${currency}`.replace(/\s+/g, " ").trim();
  if (negative) text = `Minus ${text}`;
  // Capitalize first letter
  return `${text.charAt(0).toUpperCase()}${text.slice(1)} only`;
}
