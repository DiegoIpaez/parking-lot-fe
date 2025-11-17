export const formatAmount = (amount?: number | null): string => {
  if (!amount || isNaN(amount)) return '-';

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
