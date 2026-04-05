/**
 * Format a number using Spanish notation (dots for thousands, commas for decimals).
 */
export function fmtEur(value, decimals = 2) {
  return value.toLocaleString('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtNum(value, decimals = 0) {
  return value.toLocaleString('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
