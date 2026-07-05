import { Schema, model, Document } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  subscribedAt: Date;
}

const newsletterSchema = new Schema<INewsletter>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

export const Newsletter = model<INewsletter>('Newsletter', newsletterSchema);
