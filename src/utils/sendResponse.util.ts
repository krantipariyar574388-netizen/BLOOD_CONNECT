import { Response } from 'express';

interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
}

export const sendResponse = <T>(res: Response, data: IResponse<T>): void => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message || 'Success',
    data: data.data,
  });
};