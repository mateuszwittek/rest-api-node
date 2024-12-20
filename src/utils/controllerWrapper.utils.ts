import { Request, Response, NextFunction } from 'express';
import { successHandler } from '../middleware/successHandler.middleware.js';

export const controllerWrapper =
  (
    operation: (req: Request) => Promise<object>,
    successMessage: string,
    statusCode: number = 200
  ): IControllerFunction =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await operation(req);
      successHandler(res, successMessage, data, statusCode);
    } catch (error) {
      next(error);
    }
  };
