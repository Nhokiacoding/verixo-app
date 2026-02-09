export const formatCurrency = (amount, currency = 'NGN') => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }

  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
};

export const formatNumber = (number) => {
  if (typeof number !== 'number') {
    number = parseFloat(number) || 0;
  }
  
  return new Intl.NumberFormat('en-NG').format(number);
};
