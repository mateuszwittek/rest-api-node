export type RequestData = Record<string, unknown>;

export interface RequestFunctions {
  get: (path: string) => request.Test;
  post: (path: string, data?: RequestData) => request.Test;
  put: (path: string, data?: RequestData) => request.Test;
  delete: (path: string) => request.Test;
  options: (path: string) => request.Test;
}

export type DomainValidationModule = jest.MockedObject<
  typeof import('../../../src/utils/domainValidation.utils')
>;
export type DisposableEmailValidationModule = jest.MockedObject<
  typeof import('../../../src/utils/disposableEmailValidation.utils')
>;

export type EmailValidationModule = jest.MockedObject<
  typeof import('../../../src/utils/emailValidation.utils')
>;

export type CheckDnsModule = jest.MockedObject<typeof import('../../../src/utils/checkDns.utils')>;
