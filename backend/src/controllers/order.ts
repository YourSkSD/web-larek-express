import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../models/Product';
import { BadRequestError } from '../errors/bad-request-error';

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { items, total } = req.body;

    // Ищем товары по переданным ID
    const products = await Product.find({ _id: { $in: items } });

    // 1. Проверяем, что все переданные ID существуют в БД
    if (products.length !== items.length) {
      const foundIds = products.map((p) => p._id.toString());
      const missingId = items.find((id: string) => !foundIds.includes(id));
      throw new BadRequestError(`Товар с id ${missingId} не найден`);
    }

    // 2. Проверяем, что все товары продаются (price !== null)
    const notForSale = products.find((p) => p.price === null);
    if (notForSale) {
      throw new BadRequestError(`Товар с id ${notForSale._id} не продается`);
    }

    // 3. Считаем реальную сумму и сверяем с переданной
    const calculatedTotal = products.reduce(
      (sum, p) => sum + (p.price || 0),
      0,
    );
    if (calculatedTotal !== total) {
      throw new BadRequestError('Неверная сумма заказа');
    }

    // 4. Возвращаем ответ (заказ НЕ сохраняется в БД)
    res.json({ id: uuidv4(), total });
  } catch (err) {
    next(err);
  }
};

export default { createOrder };
