import mongoose, { Document, Schema } from 'mongoose';

export interface IImage {
  fileName: string;
  originalName: string;
}

export interface IProduct extends Document {
  title: string;
  image: IImage;
  category: string;
  description?: string | null;
  price?: number | null;
}

const ImageSchema = new Schema<IImage>(
  {
    fileName: {
      type: String,
      required: [true, 'Поле "fileName" должно быть заполнено'],
      trim: true,
    },
    originalName: {
      type: String,
      required: [true, 'Поле "originalName" должно быть заполнено'],
      trim: true,
    },
  },
  { _id: false },
);

const ProductSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Поле "title" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "title" - 2'],
    maxlength: [30, 'Максимальная длина поля "title" - 30'],
    unique: true,
    trim: true,
  },
  image: {
    type: ImageSchema,
    required: [true, 'Поле "image" должно быть заполнено'],
  },
  category: {
    type: String,
    required: [true, 'Поле "category" должно быть заполнено'],
    trim: true,
  },
  description: { type: String, default: null, trim: true },
  price: {
    type: Number,
    default: null,
    min: [0, 'Поле "price" не может быть отрицательным'],
  },
});

export const Product = mongoose.model<IProduct>('product', ProductSchema);
