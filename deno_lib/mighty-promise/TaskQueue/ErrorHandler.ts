export type ErrorHandler = (error?: any) => void;
export const DefaultErrorHandler = (error: Error) => {
  throw error;
};
