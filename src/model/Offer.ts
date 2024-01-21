import { Document } from 'mongodb';
import mongoose, { Schema } from 'mongoose';

export interface OfferDoc extends Document {
    offerType:string;
    vendors:[any];
    title:string;
    description:string;
    minValue:number;
    offerAmount:number;
    startValidity:Date;
    endValidity:Date;
    promocode:string;
    promoType:string;
    bank:[any];
    bins:[any];
    pincode:string;
    isActive:boolean;
}

const OfferSchema = new Schema(
  {
    offerType: {
      type: String,
      required: true,
    },
    vendors: {
      type: [mongoose.Types.ObjectId],
      ref: 'Vendor',
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    minValue: {
      type: Number,
    },
    offerAmount: {
      type: Number,
      required: true,
    },
    startValidity: Date,
    endValidity: Date,
    promocode: { type: String, required: true },
    promoType: { type: String, required: true },
    bank: [String],
    bins: [String],
    pincode: { type: String, required: true },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  },
);

const Offer = mongoose.model<OfferDoc>('Offer', OfferSchema);
export { Offer };
