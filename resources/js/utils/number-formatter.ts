// const currencyFormatter = new Intl.NumberFormat('en-US', {
//   style: 'currency',
//   currency: 'BDT',
//   currencyDisplay: 'narrowSymbol',
//   minimumFractionDigits: 0,
//   maximumFractionDigits: 2,
// });

// export function formatCurrency(value: number | bigint) {
//   return currencyFormatter.format(value);
// }

// const numberFormatter = new Intl.NumberFormat('en-US', {
//   style: 'decimal',
//   minimumFractionDigits: 0,
//   maximumFractionDigits: 2,
// });
// export function formatNumber(value: number | bigint) {
//   return numberFormatter.format(value);
// }

class NumberFormatter {
  private static formatters: Map<string, Intl.NumberFormat> = new Map();
  private static defaultLocale: Intl.LocalesArgument = 'en-US'; // Default locale

  static setDefaultLocale(locale: Intl.LocalesArgument): void {
    this.defaultLocale = locale;
  }

  static format(
    value: number | bigint,
    options: Intl.NumberFormatOptions = {},
    locale?: string,
  ): string {
    const finalLocale = locale || this.defaultLocale;
    const key =
      finalLocale +
      Object.entries(options)
        .map(([k, v]) => `${k}:${v}`)
        .join('|');

    if (!this.formatters.has(key)) {
      this.formatters.set(key, new Intl.NumberFormat(finalLocale, options));
    }
    return this.formatters.get(key)!.format(value);
  }
}

// Factory for reusability

export function createNumberFormatter(
  options: Intl.NumberFormatOptions = {},
  locale?: string,
): (value: number | bigint) => string {
  return (value: number | bigint) =>
    NumberFormatter.format(value, options, locale);
}

// Quick formatting without a factory
export function formatNumberQuick(
  value: number | bigint,
  options: Intl.NumberFormatOptions = {},
  locale?: string,
): string {
  return NumberFormatter.format(value, options, locale);
}

// Predefined formatters
export const compactFormatter = createNumberFormatter({
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
});

export const decimalFormatter = createNumberFormatter({
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const percentageFormatter = createNumberFormatter({
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const currencyFormatter = createNumberFormatter({
  style: 'currency',
  currency: 'BDT',
  currencyDisplay: 'narrowSymbol',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** BDT display for prices (same formatter as {@link currencyFormatter}). */
export let formatPrice = currencyFormatter;

export function configureAppCurrency(currency: string): void {
  formatPrice = createNumberFormatter({
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

// // Example usage
// console.log(compactFormatter(1633.3) + '%'); // "1.6k%"
// console.log(decimalFormatter(1234.567)); // "1,234.57"
// console.log(percentageFormatter(0.1234)); // "12.3%"

// // Using quick format
// console.log(
//   formatNumberQuick(9876543, { notation: 'compact', compactDisplay: 'short' }),
// ); // "9.9M"

// // Change default locale
// NumberFormatter.setDefaultLocale('fr-FR');
// console.log(decimalFormatter(1234.567)); // "1 234,57" (French formatting)
