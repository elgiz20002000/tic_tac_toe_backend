export enum EStatusMessages {
  NotFound = "Resource not found",
  Unauthorized = "Unauthorized access",
  Forbidden = "Forbidden access",
  InternalServerError = "Internal server error",
  BadRequest = "Bad request",
  Ok = "Request was successful",
  Created = "Resource created successfully",
  NoContent = "No content to return",
  UserNotFound = "User not found",
}
export enum EResponseError {
  ValidationError = "Validation error",
  DatabaseError = "Database error",
  AuthenticationError = "Authentication error",
  AuthorizationError = "Authorization error",
  NotFoundError = "Not found error",
  ConflictError = "Conflict error",
  ForbiddenError = "Forbidden error",
  InternalServerError = "Internal server error",
  BadRequestError = "Bad request error",
}
