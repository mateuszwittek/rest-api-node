import { Response, Request, NextFunction } from 'express';
import { ConnectOptions, Document } from 'mongoose';

declare global {
  interface IConfig {
    port: number;
    env: string;
    rootPath: string;
  }

  interface IDatabaseConfig {
    uri: string;
    options?: ConnectOptions;
  }

  interface IDatabaseFunction {
    (config?: IDatabaseConfig): Promise<void>;
  }

  interface ISignalHandler {
    (signal?: NodeJS.Signals): Promise<void>;
  }

  type TMessageType = Readonly<Record<string, string>>;
  type TMessages = Readonly<Record<string, TMessageType>>;

  interface ISuccessResponse {
    status: string;
    statusCode: number;
    message: string;
    data: object;
  }

  interface ISuccessHandler {
    (res: Response, message: string, data: object, statusCode?: number): void;
  }

  interface IAppError extends Error {
    name: string;
    status: string;
    statusCode: number;
    isOperational: boolean; // Add this property
    cause?: Error;
    code?: string;
  }

  interface ICreateError {
    (customMessage?: string, statusCode?: number): IAppError;
  }

  interface IErrorResponse {
    status: string;
    statusCode: number;
    message: string;
    stack?: string;
    name?: string;
    cause?: unknown;
  }

  type IErrorHandler = (
    error: Error & { isOperational?: boolean; statusCode?: number },
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;

  type TErrors = Readonly<Record<string, (customMessage?: string) => Error>>;

  interface IPerson {
    name: string;
    username: string;
    email: string;
  }

  interface IInvalidRequestCase {
    description: string;
    data: Partial<IPerson>;
  }

  interface IPersonDocument extends IPerson, Document {}

  interface IControllerFunction {
    (req: Request, res: Response, next: NextFunction): void;
  }

  interface IGetPeopleData {
    (): Promise<IPerson[]>;
  }

  interface IGetPersonData {
    (param: string): Promise<IPerson>;
  }

  interface IAddPersonData {
    (person: IPerson): Promise<IPersonDocument>;
  }

  interface IUpdatePersonData {
    (param: string, updateData: Partial<IPerson>): Promise<IPerson>;
  }

  interface IDeletePersonData {
    (param: string): Promise<IPerson>;
  }
}

export {};
