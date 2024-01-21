import mongoose from 'mongoose';

interface VendorDoc extends mongoose.Document {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  serviceAvailable: Boolean;
  coverImages: [string];
  rating: number;
  foods: any;
  lat:number,
  lng:number
}

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String], required: true },
    pincode: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String },
    serviceAvailable: { type: Boolean },
    coverImages: { type: [String] },
    rating: { type: Number },
    foods: { type: [mongoose.Types.ObjectId], ref: 'food' },
    lat:String,
    lng:String
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.foods;
      },
    },
  },
);
const Vendor = mongoose.model<VendorDoc>('Vendor', vendorSchema);
export { Vendor };

