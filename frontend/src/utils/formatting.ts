/**
 * Formatting utilities for gulfvista frontend
 */

/**
 * Format price with thousands separator and optional currency
 */
export const formatPrice = (price: number, decimals: number = 0): string => {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format property price for display
 */
export const formatPropertyPrice = (price: number, currency: string = 'AED'): string => {
  const formatted = formatPrice(price, 0);
  return `${currency} ${formatted}`;
};

/**
 * Format area in square feet
 */
export const formatArea = (area: number | null | undefined, unit: string = 'sqft'): string => {
  if (!area) return 'N/A';
  return `${area.toLocaleString()} ${unit}`;
};

/**
 * Format date to readable format
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';

  return 'just now';
};

/**
 * Truncate text to specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Convert bytes to readable file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  return phone;
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert enum value to display string
 */
export const formatEnumValue = (value: string): string => {
  return value
    .split('_')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Format property type for display
 */
export const formatPropertyType = (type: string): string => {
  const typeMap: Record<string, string> = {
    apartment: 'Apartment',
    villa: 'Villa',
    townhouse: 'Townhouse',
    land: 'Land Plot',
    commercial: 'Commercial',
    office: 'Office Space',
  };
  return typeMap[type] || formatEnumValue(type);
};

/**
 * Format furnishing status
 */
export const formatFurnishing = (status: string | null | undefined): string => {
  if (!status) return 'Unfurnished';
  const furnishingMap: Record<string, string> = {
    furnished: 'Furnished',
    'semi-furnished': 'Semi-Furnished',
    unfurnished: 'Unfurnished',
  };
  return furnishingMap[status] || formatEnumValue(status);
};

/**
 * Format bedrooms/bathrooms count
 */
export const formatBedrooms = (count: number | null | undefined): string => {
  if (!count) return 'Studio';
  return count === 1 ? '1 Bedroom' : `${count} Bedrooms`;
};

export const formatBathrooms = (count: number | null | undefined): string => {
  if (!count) return 'N/A';
  return count === 1 ? '1 Bathroom' : `${count} Bathrooms`;
};
