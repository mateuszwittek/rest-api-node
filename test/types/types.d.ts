export type RequestData = Record<string, unknown>;

export interface RequestFunctions {
  get: (path: string) => request.Test;
  post: (path: string, data?: RequestData) => request.Test;
  put: (path: string, data?: RequestData) => request.Test;
  delete: (path: string) => request.Test;
  options: (path: string) => request.Test;
}
