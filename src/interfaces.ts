export interface IResponseError extends Error {
  status: number;
  message: string;
  name: string;
  errors?: string[];
}

export interface EResponseSuccess<T> extends Error {
  status: number;
  data: T;
}
