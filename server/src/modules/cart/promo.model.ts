import { Schema, model, Document } from 'mongoose';

export interface IPromoCode extends Document {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  expirationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const promoCodeSchema = new Schema<IPromoCode>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageLimit: {
      type: Number,
      min: 0,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    expirationDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const PromoCode = model<IPromoCode>('PromoCode', promoCodeSchema);
