/**
 * Format price in MRU (Mauritanian Ouguiya)
 * @param price - Price as number
 * @param options - Formatting options
 * @returns Formatted price string with MRU
 */
export function formatPrice(
  price: number | string | undefined | null,
  options?: {
    showDecimals?: boolean;
    showCurrency?: boolean;
  }
): string {
  // Default options
  const showDecimals = options?.showDecimals ?? true;
  const showCurrency = options?.showCurrency ?? true;

  // Handle null/undefined
  if (price === null || price === undefined) {
    return showCurrency ? "0 MRU" : "0";
  }

  // Convert to number
  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  // Handle invalid numbers
  if (isNaN(numPrice)) {
    return showCurrency ? "0 MRU" : "0";
  }

  // Format the number
  const formatted = showDecimals
    ? numPrice.toFixed(2)
    : Math.round(numPrice).toString();

  // Add thousand separators
  const parts = formatted.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // Return formatted price with or without currency
  if (showCurrency) {
    return `${parts.join(".")} MRU`;
  }

  return parts.join(".");
}

/**
 * Format price for display (with MRU currency)
 */
export function formatPriceMRU(price: number | string | undefined | null): string {
  return formatPrice(price, { showDecimals: true, showCurrency: true });
}

/**
 * Format price without decimals (for whole numbers)
 */
export function formatPriceWhole(price: number | string | undefined | null): string {
  return formatPrice(price, { showDecimals: false, showCurrency: true });
}

/**
 * Format price without currency symbol (just the number)
 */
export function formatPriceNumber(price: number | string | undefined | null): string {
  return formatPrice(price, { showDecimals: true, showCurrency: false });
}
