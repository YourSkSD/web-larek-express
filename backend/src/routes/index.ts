import { Router } from 'express';
import productRouter from './product';
import orderRouter from './order';

const router = Router();

router.use('/product', productRouter);
router.use('/order', orderRouter);

// Обработка несуществующих маршрутов (404)
router.use((req, res, next) => {
  const error = new Error('Маршрут не найден') as any;
  error.statusCode = 404;
  next(error);
});

export default router;
