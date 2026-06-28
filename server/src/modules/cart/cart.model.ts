import { Schema, model, Document, Types } from 'mongoose';

export interface ICartItem {
  _id?: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  userId?: Types.ObjectId;
  guestId?: string;
  items: ICartItem[];
  promoCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      sparse: true,
    },
    guestId: {
      type: String,
      unique: true,
      sparse: true,
    },
    items: [cartItemSchema],
    promoCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Cart = model<ICart>('Cart', cartSchema);
