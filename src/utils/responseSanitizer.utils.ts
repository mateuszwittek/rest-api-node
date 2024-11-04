import { Request, Response, NextFunction } from 'express';

const sanitizeObject = <T extends object>(obj: T, fieldsToOmit: (keyof T)[]): Partial<T> => {
  const sanitized: Partial<T> = { ...obj };
  fieldsToOmit.forEach(field => {
    delete sanitized[field];
  });
  return sanitized;
};

export const responseSanitizer = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;

  res.json = function (body): Response {
    if (typeof body === 'object' && body !== null) {
      body = sanitizeObject(body, ['password', 'ssn', 'token']);
    }

    return originalJson.call(this, body);
  };

  next();
};
