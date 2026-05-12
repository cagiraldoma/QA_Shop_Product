export const formatCurrency = (amount: number, currency = 'USD'): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

export const formatDate = (dateString: string): string =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(
    new Date(dateString),
  );
