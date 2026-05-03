import { Request, Response, NextFunction } from 'express';
import { CelebrateError } from 'celebrate';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Определяем статус код
  const statusCode = err.statusCode || 500;

  // Формируем сообщение
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;

  // Специальная обработка для 409 (дубликат title)
  if (err.code === 11000) {
    return res.status(409).json({
      message: 'Товар с таким заголовком уже существует',
    });
  }

  // Для ошибок валидации celebrate
  if (
    err instanceof CelebrateError
    || err.name === 'CelebrateError'
    || err.name === 'ValidationError'
  ) {
    const details = err.validation?.body || err.details?.[0] || err.details;
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Validation failed',
      statusCode: 400,
      validation: {
        body: {
          source: 'body',
          keys: details?.keys || [details?.path],
          message: details?.message || message,
        },
      },
    });
  }

  // Стандартный ответ
  return res.status(statusCode).json({ message });
};

export default { errorHandler };
