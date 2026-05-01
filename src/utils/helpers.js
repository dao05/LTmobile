/**
 * Date Utilities
 * Helper functions for date formatting and manipulation
 */

export const formatDate = (date, locale = 'vi-VN') => {
  if (!date) return '';
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString(locale);
};

export const parseAppDate = (value) => {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    const viMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (viMatch) {
      const [, day, month, year] = viMatch;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }

    const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

export const formatAppDate = (value) => {
  const date = parseAppDate(value);
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
};

export const toISODate = (value) => {
  const date = parseAppDate(value);
  if (!date) return '';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

export const formatDateTime = (date, locale = 'vi-VN') => {
  if (!date) return '';
  const dateObj = new Date(date);
  return dateObj.toLocaleString(locale);
};

export const formatMonth = (date) => {
  if (!date) return '';
  const dateObj = parseAppDate(date);
  if (!dateObj) return '';
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${month}/${year}`;
};

export const parseInvoiceMonth = (value) => {
  if (!value) return null;
  const match = String(value).trim().match(/^(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, month, year] = match;
  return new Date(Number(year), Number(month) - 1, 1);
};

export const formatInvoiceMonth = (value) => formatMonth(value);

export const getMonthKey = (value) => {
  const monthDate = parseInvoiceMonth(value) || parseAppDate(value);
  if (!monthDate) return '';
  return `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
};

export const addMonths = (value, count) => {
  const date = parseAppDate(value);
  if (!date) return null;
  return new Date(date.getFullYear(), date.getMonth() + count, date.getDate());
};

export const getMonthlyInvoiceDates = (startDateValue, todayValue = new Date()) => {
  const startDate = parseAppDate(startDateValue);
  const today = parseAppDate(todayValue);
  if (!startDate || !today) return [];
  if (startDate > today) return [];

  const dates = [];
  let cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth(), 1);

  while (cursor <= end) {
    dates.push(new Date(cursor));
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }

  return dates;
};

export const getMonthlyDueDate = (startDateValue, monthDateValue) => {
  const startDate = parseAppDate(startDateValue);
  const monthDate = parseAppDate(monthDateValue);
  if (!startDate || !monthDate) return '';

  const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const dueDay = Math.min(startDate.getDate(), lastDay);
  return toISODate(new Date(monthDate.getFullYear(), monthDate.getMonth(), dueDay));
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getDaysUntil = (endDate) => {
  const today = new Date();
  const end = new Date(endDate);
  const diff = end - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const isOverdue = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  return due < today;
};

/**
 * Number Utilities
 * Helper functions for number formatting
 */

export const formatCurrency = (amount, locale = 'vi-VN') => {
  if (!amount) return '0đ';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (number, locale = 'vi-VN') => {
  if (!number) return '0';
  return new Intl.NumberFormat(locale).format(number);
};

/**
 * String Utilities
 * Helper functions for string operations
 */

export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const truncateString = (string, length) => {
  if (!string || string.length <= length) return string;
  return string.substring(0, length) + '...';
};

export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

/**
 * Validation Utilities
 * Helper functions for input validation
 */

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return phoneRegex.test(phone);
};

export const isValidIDCard = (idCard) => {
  // Vietnamese ID card should be 9 or 12 digits
  return /^\d{9}(\d{3})?$/.test(idCard);
};

export const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return strongRegex.test(password);
};

/**
 * Array Utilities
 */

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, ascending = true) => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return ascending ? -1 : 1;
    if (a[key] > b[key]) return ascending ? 1 : -1;
    return 0;
  });
};

export const filterByStatus = (array, status) => {
  return array.filter(item => item.status === status);
};

/**
 * Common Utilities
 */

export const generateID = () => {
  return Date.now().toString();
};

export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
