export interface ErrorResponse {
  message: string;
  code?: string;
  timeStamp?: string;
  causes?: string[];
  path?: string;
}
