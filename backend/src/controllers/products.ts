import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';
import { ConflictError } from '../errors/conflict-error';

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await Product.find().lean();

    // Убираем служебное поле __v, если оно есть
    const items = products.map(({ __v, ...rest }) => rest);

    res.json({ items, total: items.length });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await Product.create(req.body);
    const { __v, ...cleanProduct } = product.toObject();

    res.json(cleanProduct);
  } catch (err: any) {
    // MongoDB возвращает код 11000 при нарушении unique индекса
    if (err.code === 11000) {
      return next(new ConflictError('Товар с таким заголовком уже существует'));
    }
    next(err);
  }
};
