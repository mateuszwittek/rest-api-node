const htmlEntities: { [key: string]: string } = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#39;',
};

const sanitizeString = (str: string): string => str.replace(/[&<>"']/g, s => htmlEntities[s]);

export const sanitize = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (obj.toObject) return sanitize(obj.toObject());

  const result = {} as Record<string, any>;
  for (const [key, value] of Object.entries(obj) as [string, any][]) {
    result[key] = typeof value === 'string' ? sanitizeString(value) : sanitize(value);
  }

  return result;
};

export default sanitize;
