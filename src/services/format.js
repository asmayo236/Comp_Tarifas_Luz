// Consistent color palette for tariffs across chart and comparison bars
export const TARIFA_COLORS = ['#2563eb', '#f59e0b', '#10b981', '#8b5cf6'];

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
