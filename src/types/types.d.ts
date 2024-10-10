import { Response, Request, NextFunction } from 'express';
import { ConnectOptions, Document, Model } from 'mongoose';

export interface IConfig {
  port: number;
  env: string;
  rootPath: string;
}

export interface IDatabaseConfig {
  uri: string;
  options?: ConnectOptions;
}

export interface IDatabaseFunction {
  (config?: IDatabaseConfig): Promise<void>;
}

export interface ISignalHandler {
  (signal?: NodeJS.Signals): Promise<void>;
}

export type TMessageType = Readonly<Record<string, string>>;
export type TMessages = Readonly<Record<string, TMessageType>>;

export interface ISuccessResponse {
  status: string;
  statusCode: number;
  message: string;
  data: object;
}

export interface ISuccessHandler {
  (res: Response, message: string, data: object, statusCode?: number): void;
}

export interface IAppError extends Error {
  name: string;
  status: string;
  statusCode: number;
}

export interface ICreateError {
  (customMessage?: string, statusCode?: number): IAppError;
}

export type TErrors = Readonly<Record<string, (customMessage?: string) => Error>>;

export interface IErrorHandler {
  (error: Error, req: Request, res: Response, next?: NextFunction): void;
}

export interface IErrorResponse {
  status: string;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  method: string;
}

export interface IPerson {
  name: string;
  username: string;
  email: string;
}

export interface IInvalidDataCase {
  description: string;
  data: Partial<IPerson>;
}

export interface IPersonDocument extends IPerson, Document {}
export interface IPersonModel extends Model<IPersonDocument> {}

export interface IControllerFunction {
  (req: Request, res: Response, next: NextFunction): void;
}

export interface IGetPeopleData {
  (): Promise<IPerson[]>;
}

export interface IGetPersonData {
  (param: string): Promise<IPerson>;
}

export interface IAddPersonData {
  (person: IPerson): Promise<IPersonDocument>;
}
