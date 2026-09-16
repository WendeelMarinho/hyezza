const HOURS_PER_DAY = 24
const MINUTES_PER_HOUR = 60

const numberFormat = new Intl.NumberFormat('pt-BR')

export function measuresFor(days: number) {
  const hours = days * HOURS_PER_DAY
  return { days, hours, minutes: hours * MINUTES_PER_HOUR }
}

export function formatNumber(value: number): string {
  return numberFormat.format(value)
}

export function futureYears(start: number, count: number): number[] {
  return Array.from({ length: Math.max(0, count) }, (_, i) => start + i)
}
