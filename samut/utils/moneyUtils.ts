/**
 * Money utility functions for handling currency conversions between database and display formats
 *
 * The database stores money values as integers (e.g., 1000)
 * Stripe processes payments with decimal precision (e.g., 10.00)
 *
 * These utilities ensure consistent conversion between formats
 */

/**
 * Convert a database integer value to a display decimal value
 * Example: 1000 -> 10.00
 */
export function dbToDisplayPrice(dbPrice: number | string | undefined | null): number {
  if (dbPrice === undefined || dbPrice === null) return 0

  // Convert string to number if needed
  const numericValue = typeof dbPrice === "string" ? Number.parseFloat(dbPrice) : dbPrice

  // Convert from smallest currency unit (e.g., cents) to standard unit (e.g., dollars)
  // Divide by 100 to convert from cents to dollars/baht
  return numericValue / 100
}

/**
 * Convert a display decimal value to a database integer value
 * Example: 10.00 -> 1000
 */
export function displayToDbPrice(displayPrice: number | string | undefined | null): number {
  if (displayPrice === undefined || displayPrice === null) return 0

  // Convert string to number if needed
  const numericValue = typeof displayPrice === "string" ? Number.parseFloat(displayPrice) : displayPrice

  // Convert from standard unit (e.g., dollars) to smallest currency unit (e.g., cents)
  // Multiply by 100 to convert from dollars/baht to cents/satang
  // Round to avoid floating point issues
  return Math.round(numericValue * 100)
}

/**
 * Format a price for display with proper currency symbol and decimal places
 * @param price - The price in display format (e.g., 10.00)
 * @param currency - The currency code (default: 'THB')
 * @param locale - The locale for formatting (default: 'th-TH')
 */
export function formatDisplayPrice(
  price: number | string | undefined | null,
  currency = "THB",
  locale = "th-TH",
): string {
  if (price === undefined || price === null)
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(0)

  // Convert string to number if needed
  const numericValue = typeof price === "string" ? Number.parseFloat(price) : price

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(numericValue)
}

/**
 * Format a database price directly to display string with currency
 * @param dbPrice - The price in database format (e.g., 1000)
 * @param currency - The currency code (default: 'THB')
 * @param locale - The locale for formatting (default: 'th-TH')
 */
export function formatDbPrice(dbPrice: number | string | undefined | null, currency = "THB", locale = "th-TH"): string {
  // First convert from DB format to display format
  const displayPrice = dbToDisplayPrice(dbPrice)

  // Then format with currency
  return formatDisplayPrice(displayPrice, currency, locale)
}
