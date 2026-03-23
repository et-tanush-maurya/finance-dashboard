// Utility functions for formatting

export const formatCurrency = (value, currency = 'AED') => {
  if (value === null || value === undefined) return '-';
  
  const formatted = new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
  
  // Format large numbers for better display
  if (value >= 1000000) {
    return `AED ${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `AED ${(value / 1000).toFixed(1)}K`;
  }
  
  return formatted;
};

export const formatNumber = (value) => {
  if (value === null || value === undefined) return '-';
  
  return new Intl.NumberFormat('en-AE').format(value);
};

export const formatCompactNumber = (value) => {
  if (value === null || value === undefined) return '-';
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '-';
  return `${Number(value).toFixed(decimals)}%`;
};

export const formatDate = (dateString, format = 'medium') => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  
  const formats = {
    short: { month: 'short', day: 'numeric' },
    medium: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' }
  };
  
  return date.toLocaleDateString('en-AE', formats[format] || formats.medium);
};

export const formatSplitRatio = (splitRatio) => {
  if (!splitRatio) return '-';
  return `${splitRatio.uae}-${splitRatio.partner}`;
};

export const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous * 100).toFixed(1);
};

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const cell = row[header];
        if (typeof cell === 'string' && cell.includes(',')) {
          return `"${cell}"`;
        }
        return cell;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
};