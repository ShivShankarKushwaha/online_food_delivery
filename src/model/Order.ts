import { Document } from 'mongodb';
import mongoose, { Schema } from 'mongoose';

export interface OrderDoc extends Document {
  OrderId: string;  // 32483248
  vendorId: string; // 878239283
  items: [any]; // {food,unit}
  totalAmount: number;  // 200
  paidAmount:number;
  OrderDate: Date;  // 2022-01-01
  paidThrough: string;  // COD | Card | Net Banking | wallet
  paymentResponse: string;  // success | failed | pending
  orderStatus: string;  // Waiting | Accepted | Rejected | failed
  remarks: string;  // 
  deliveryId:string;
  appliedOffers:boolean;
  offerId:string;
  readyTime:number
}

const OrderSchema = new Schema(
  {
    OrderId:{type:String,required:true},
    vendorId:{type:String,required:true},
    items:[{
        food:{type:Schema.Types.ObjectId,required:true},
        unit:{type:Number,required:true}
    }],
    totalAmount:{type:Number,required:true},
    paidAmount:{type:Number,require:true},
    orderDate:{type:Date},
    paidThrough:{type:String},
    paymentResponse:{type:String},
    orderStatus:{type:String},
    remarks:{type:String},
    deliveryId:{type:String},
    appliedOffers:{type:Boolean},
    offerId:{type:String},
    readyTime:{type:Number}
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  },
);

const Order = mongoose.model<OrderDoc>('Order', OrderSchema);
export { Order };
