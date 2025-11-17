import { differenceInMinutes, isValid } from 'date-fns';

type FormatDurationArgs = {
  checkInTime: string | Date | null | undefined;
  checkOutTime: string | Date | null | undefined;
};

export const formatDuration = ({
  checkInTime,
  checkOutTime,
}: FormatDurationArgs): string => {
  if (!checkInTime || !checkOutTime) return '-';

  const start = new Date(checkInTime);
  const end = new Date(checkOutTime);

  if (!isValid(start) || !isValid(end)) return '-';

  const diffMinutes = Math.abs(differenceInMinutes(end, start));

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours}h ${minutes}m`;
};

export const formatDate = (date: string | null | undefined) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
