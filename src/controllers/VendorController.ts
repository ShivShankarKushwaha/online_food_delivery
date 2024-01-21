import { NextFunction, Request, Response } from 'express';
import { EditVendorInput, VendorLoginInputs, CreateFoodInput, CreateOfferInputs } from '../dto';
import { findVendor } from './AdminController';
import { GenerateSignature, ValidatePassword } from '../helper';
import { Food, Offer, Order } from '../model';

export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = <VendorLoginInputs>req.body;
  const existingVendor = await findVendor(undefined, email);
  if (!existingVendor) {
    return res.json({ message: 'vendor not found' });
  }
  const isMatch = await ValidatePassword(password, existingVendor.password, existingVendor.salt);
  if (!isMatch) {
    return res.json({ message: 'login failed' });
  }
  const signature = await GenerateSignature({
    _id: existingVendor._id,
    email: existingVendor.email,
    name: existingVendor.name,
    foodType: existingVendor.foodType,
  });
  return res.json({ signature, existingVendor });
};

export const getVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user) {
    const existingUser = await findVendor(user._id);
    return res.json(existingUser);
  }
  return res.json({ message: 'user not found' });
};

export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { address, foodType, name, phone } = <EditVendorInput>req.body;
  const user = req.user;
  if (user) {
    const existingVendor = await findVendor(user._id);
    if (existingVendor) {
      existingVendor.address = address;
      existingVendor.foodType = foodType;
      existingVendor.name = name;
      existingVendor.phone = phone;
      const result = await existingVendor.save();
      return res.json(result);
    }
    return res.json({ message: 'vendor not found' });
  }
  return res.json({ message: 'user not found' });
};

export const UpdateVendorCoverImage = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  console.log('user', user);

  if (user) {
    const vendor = await findVendor(user._id);
    if (vendor) {
      const files = req.files as [Express.Multer.File];
      console.log('files', files);

      const images = files.map((item: Express.Multer.File) => item.filename);
      vendor.coverImages.push(...images);
      const result = await vendor.save();
      return res.json(result);
    }
    return res.json({ message: 'vendor not found' });
  }
  return res.json({ message: 'user not found' });
};

export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user) {
    const existingVendor = await findVendor(user._id);
    if (existingVendor) {
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
      const savedResult = await existingVendor.save();
      return res.json(savedResult);
    }
  }
};

export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user) {
    const files = req.files as [Express.Multer.File];
    console.log('files', files);

    const images = files.map((item: Express.Multer.File) => item.filename);
    console.log('images', images);

    const { category, description, foodType, name, price, readyTime } = <CreateFoodInput>req.body;
    const vendor = await findVendor(user._id);
    if (vendor) {
      const createdFood = await Food.create({
        vendorId: vendor._id,
        category,
        description,
        foodType,
        name,
        price,
        images: images,
        readyTime: readyTime,
        rating: 0,
      });
      vendor.foods.push(createdFood);
      const result = await vendor.save();

      return res.json(result);
    }
    return res.json({ message: 'no vendor found' });
  }
  return res.json({ message: 'user not found' });
};

export const GetFoods = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user) {
    const foods = await Food.find({ vendorId: user._id });
    if (foods) {
      return res.json(foods);
    }
    return res.json({ message: 'No data available' });
  }
  return res.status(400).json({ message: 'user not found' });
};

export const GetCurrentOrders = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user) {
    const order = await Order.find({ vendorId: user._id }).populate('items.food');
    if (order) {
      return res.status(200).json(order);
    }
  }
  return res.status(400).json({ message: 'Error on get order details' });
};

export const GetOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.id;
  if (orderId) {
    const order = await Order.findById(orderId).populate('items.food');
    return res.status(200).json(order);
  }
  return res.status(400).json({ message: 'Order not found' });
};

export const ProcessOrder = async (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.id;
  const { status, remarks, time } = req.body;
  if (orderId) {
    const order = await Order.findById(orderId);
    if (order) {
      order.orderStatus = status;
      order.remarks = remarks;
      if (time) {
        order.readyTime = time;
      }
      const orderResult = await order.save();
      return res.status(200).json(orderResult);
    }
  }
  return res.status(400).json({ message: 'Unable to process order' });
};

export const GetOffers = async (req: Request, res: Response) => {
  const user = req.user;
  if (user) {
    let currentOffers = Array();
    const offer = await Offer.find().populate('vendors');
    if (offer) {
      offer.map((item) => {
        if (item.vendors) {
          item.vendors.map((vendor) => {
            if (vendor._id.toString() === user._id.toString()) {
              currentOffers.push(offer);
            }
          });
        }
        if (item.offerType === 'GENERIC') {
          currentOffers.push(item);
        }
      });
    }
    return res.status(200).json(currentOffers);
  }
  return res.status(400).json({ message: 'Offer not found' });
};
export const AddOffer = async (req: Request, res: Response) => {
  const user = req.user;
  if (user) {
    const { bank, bins, description, isActive, minValue, offerAmount, offerType, pincode, promoType, promocode, startValidity, title, endValidity } = <CreateOfferInputs>req.body;
    const vendor = await findVendor(user._id);

    if (vendor) {
      const offer = await Offer.create({
        bank,
        bins,
        description,
        isActive,
        minValue,
        offerAmount,
        offerType,
        pincode,
        promoType,
        promocode,
        startValidity,
        title,
        endValidity,
        vendors: [vendor],
      });
      return res.status(200).json(offer);
    }
  }
  return res.status(400).json({ message: 'Unable to add offer!' });
};
export const EditOffer = async (req: Request, res: Response) => {
  const user = req.user;
  const offerId = req.params.id;
  if (user) {
    const { bank, bins, description, isActive, minValue, offerAmount, offerType, pincode, promoType, promocode, startValidity, title, endValidity } = <CreateOfferInputs>req.body;
    const currentOffer = await Offer.findById(offerId);
    if (currentOffer) {
      const vendor = await findVendor(user._id);
      if (vendor) 
      {
        currentOffer.bank = bank;
        currentOffer.bins = bins;
        currentOffer.description = description;
        currentOffer.isActive = isActive;
        currentOffer.minValue = minValue;
        currentOffer.offerAmount = offerAmount;
        currentOffer.offerType = offerType;
        currentOffer.pincode = pincode;
        currentOffer.promoType = promoType;
        currentOffer.promocode = promocode;
        currentOffer.startValidity = startValidity;
        currentOffer.title = title;
        currentOffer.endValidity = endValidity;
        const result = await currentOffer.save();
        return res.status(200).json(result);
      }
    }
  }
  return res.status(400).json({ message: 'Unable to Edit offer!' });
};
