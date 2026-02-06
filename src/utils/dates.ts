export const getWeekNumber = (date: Date): { week: number; year: number } => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { week, year: d.getUTCFullYear() };
};

export const getWeekDates = (week: number, year: number): { start: Date; end: Date } => {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const start = new Date(simple);
  start.setDate(simple.getDate() - dow + 1);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};
