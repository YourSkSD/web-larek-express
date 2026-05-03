import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';
import { ConflictError } from '../errors/conflict-error';

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await Product.find().lean();

    // Убираем служебное поле __v, если оно есть
    const items = products.map(({ __v, ...rest }) => rest);

    return res.status(200).json({ items, total: items.length });
  } catch (err) {
    return next(err);
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

    return res.status(201).json(cleanProduct);
  } catch (err: any) {
    // MongoDB возвращает код 11000 при нарушении unique индекса
    if (err.code === 11000) {
      return next(new ConflictError('Товар с таким заголовком уже существует'));
    }
    return next(err);
  }
};

export default { getProducts, createProduct };
