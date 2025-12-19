export function getCurrentWeekNumber(year: number): number {
  const now = new Date();
  if (now.getFullYear() !== year) {
    return 1;
  }
  
  const startOfYear = new Date(year, 0, 1);
  const dayOfWeek = startOfYear.getDay();
  const daysToFirstSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const firstSunday = new Date(startOfYear);
  firstSunday.setDate(startOfYear.getDate() + daysToFirstSunday);
  
  if (now < firstSunday) {
    return 1;
  }
  
  const daysDiff = Math.floor((now.getTime() - firstSunday.getTime()) / (1000 * 60 * 60 * 24));
  return Math.floor(daysDiff / 7) + 1;
}

export function getWeeksInYear(year: number): number[] {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);
  const daysInYear = Math.ceil((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.ceil(daysInYear / 7);
  return Array.from({ length: totalWeeks }, (_, i) => i + 1);
}

export function createPeriodString(period: string): string {
  const now = new Date();
  const year = now.getFullYear();
  
  if (period === 'week') {
    return 'week';
  } else if (period === 'month') {
    const monthNumber = now.getMonth() + 1;
    return `${year}-${String(monthNumber).padStart(2, '0')}`;
  } else {
    return String(year);
  }
}

export const MONTH_NAMES = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

