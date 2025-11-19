export const microsToDollars = (micros?: number | null) => {
  if (!micros) return 0;
  return micros / 1_000_000;
};

export const formatMicrosToCurrency = (micros?: number | null, fallback = '$0.00') => {
  if (!micros) return fallback;
  return `$${microsToDollars(micros).toFixed(2)}`;
};

export const formatPricePerThousand = (micros?: number | null) => {
  if (!micros) return 'Free';
  return `${formatMicrosToCurrency(micros)} / 1k`;
};
