import { celebrate, Joi, Segments } from 'celebrate';

export const validateProductBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required().min(2).max(30)
      .trim()
      .messages({
        'string.min': 'Минимальная длина поля "title" - 2',
        'string.max': 'Максимальная длина поля "title" - 30',
        'string.empty': '"title" is required',
        'any.required': '"title" is required',
      }),

    image: Joi.object()
      .keys({
        fileName: Joi.string().required().trim().messages({
          'string.empty': '"fileName" is required',
          'any.required': '"fileName" is required',
        }),
        originalName: Joi.string().required().trim().messages({
          'string.empty': '"originalName" is required',
          'any.required': '"originalName" is required',
        }),
      })
      .required()
      .messages({
        'object.base': '"image" должно быть объектом',
        'any.required': '"image" is required',
      }),

    category: Joi.string().required().trim().messages({
      'string.empty': '"category" is required',
      'any.required': '"category" is required',
    }),

    description: Joi.string().allow(null, '').trim().messages({
      'string.base': 'Поле "description" должно быть строкой',
    }),

    price: Joi.number().allow(null).min(0).messages({
      'number.base': 'Поле "price" должно быть числом',
      'number.min': 'Поле "price" не может быть отрицательным',
    }),
  }),
});

export const validateOrderBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    payment: Joi.string().valid('card', 'online').required().messages({
      'any.only': 'Поле "payment" должно быть card или online',
      'any.required': '"payment" is required',
    }),

    email: Joi.string().email().required().messages({
      'string.email': 'Поле "email" должно быть валидным email',
      'string.empty': '"email" is required',
      'any.required': '"email" is required',
    }),

    phone: Joi.string().required().messages({
      'string.empty': '"phone" is required',
      'any.required': '"phone" is required',
    }),

    address: Joi.string().required().trim().messages({
      'string.empty': '"address" is required',
      'any.required': '"address" is required',
    }),

    total: Joi.number().required().strict().messages({
      'number.base': 'Поле "total" должно быть числом',
      'number.required ': ' "total " is required',
      'any.required': '"total" is required',
    }),

    items: Joi.array()
      .items(Joi.string().hex().length(24)) // MongoDB ObjectId = 24 hex символа
      .min(1)
      .required()
      .messages({
        'array.min': 'Заказ должен содержать хотя бы один товар',
        'any.required': '"items" is required',
      }),
  }),
});

export const validateProductId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).required()
      .messages({
        'string.hex': 'Передан не валидный ID товара',
        'string.length': 'Передан не валидный ID товара',
        'any.required': 'Передан не валидный ID товара',
      }),
  }),
});
