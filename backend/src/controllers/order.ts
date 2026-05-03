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

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      const foundIds = products.map((p) => p._id.toString());
      const missingId = items.find((id: string) => !foundIds.includes(id));
      return next(new BadRequestError(`Товар с id ${missingId} не найден`));
    }

    const notForSale = products.find((p) => p.price === null);
    if (notForSale) {
      return next(new BadRequestError(`Товар с id ${notForSale._id} не продается`));
    }

    const calculatedTotal = products.reduce(
      (sum, p) => sum + (p.price || 0),
      0,
    );

    if (calculatedTotal !== total) {
      return next(new BadRequestError('Неверная сумма заказа'));
    }

    return res.json({ id: uuidv4(), total });
  } catch (err: unknown) {
    return next(err as Error);
  }
};

export default { createOrder };
