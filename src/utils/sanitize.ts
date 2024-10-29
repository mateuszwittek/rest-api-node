const htmlEntities: { [key: string]: string } = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#39;',
};

const sanitizeString = (str: string): string => str.replace(/[&<>"']/g, s => htmlEntities[s]);

export const sanitize = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitize) as unknown as T;
  if ('toObject' in obj && typeof obj.toObject === 'function') return sanitize(obj.toObject());

  const result = {} as Record<string, unknown>;
  for (const [key, value] of Object.entries(obj)) {
    result[key] = typeof value === 'string' ? sanitizeString(value) : sanitize(value);
  }

  return result as T;
};

export default sanitize;
