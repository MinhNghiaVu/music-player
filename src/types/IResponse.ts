// All mighty response type - usable everywhere

export interface IResponse<T> {
  success: boolean,
  message: string;
  data?: T; // Optional data field for successful responses
}