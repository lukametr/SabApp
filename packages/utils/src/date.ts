import { format, parseISO } from 'date-fns';
import { ka } from 'date-fns/locale';

export const formatDate = (date: string | Date, formatStr = 'dd MMMM yyyy'): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, formatStr, { locale: ka });
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd MMMM yyyy HH:mm');
};

export const formatTime = (date: string | Date): string => {
  return formatDate(date, 'HH:mm');
}; 