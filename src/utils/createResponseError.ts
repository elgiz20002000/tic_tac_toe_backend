import type { IResponseError } from "../interfaces.ts";

export const createResponseError = (
  message: string,
  name: string,
  status: number,
): IResponseError => {
  const error = new Error(message) as IResponseError;
  error.name = name;
  error.status = status;
  error.message = message;
  return error;
};
