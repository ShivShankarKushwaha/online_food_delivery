"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditOffer = exports.AddOffer = exports.GetOffers = exports.ProcessOrder = exports.GetOrderDetails = exports.GetCurrentOrders = exports.GetFoods = exports.AddFood = exports.UpdateVendorService = exports.UpdateVendorCoverImage = exports.UpdateVendorProfile = exports.getVendorProfile = exports.VendorLogin = void 0;
const AdminController_1 = require("./AdminController");
const helper_1 = require("../helper");
const model_1 = require("../model");
const VendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVendor = yield (0, AdminController_1.findVendor)(undefined, email);
    if (!existingVendor) {
        return res.json({ message: 'vendor not found' });
    }
    const isMatch = yield (0, helper_1.ValidatePassword)(password, existingVendor.password, existingVendor.salt);
    if (!isMatch) {
        return res.json({ message: 'login failed' });
    }
    const signature = yield (0, helper_1.GenerateSignature)({
        _id: existingVendor._id,
        email: existingVendor.email,
        name: existingVendor.name,
        foodType: existingVendor.foodType,
    });
    return res.json({ signature, existingVendor });
});
exports.VendorLogin = VendorLogin;
const getVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingUser = yield (0, AdminController_1.findVendor)(user._id);
        return res.json(existingUser);
    }
    return res.json({ message: 'user not found' });
});
exports.getVendorProfile = getVendorProfile;
const UpdateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, foodType, name, phone } = req.body;
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.findVendor)(user._id);
        if (existingVendor) {
            existingVendor.address = address;
            existingVendor.foodType = foodType;
            existingVendor.name = name;
            existingVendor.phone = phone;
            const result = yield existingVendor.save();
            return res.json(result);
        }
        return res.json({ message: 'vendor not found' });
    }
    return res.json({ message: 'user not found' });
});
exports.UpdateVendorProfile = UpdateVendorProfile;
const UpdateVendorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    console.log('user', user);
    if (user) {
        const vendor = yield (0, AdminController_1.findVendor)(user._id);
        if (vendor) {
            const files = req.files;
            console.log('files', files);
            const images = files.map((item) => item.filename);
            vendor.coverImages.push(...images);
            const result = yield vendor.save();
            return res.json(result);
        }
        return res.json({ message: 'vendor not found' });
    }
    return res.json({ message: 'user not found' });
});
exports.UpdateVendorCoverImage = UpdateVendorCoverImage;
const UpdateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.findVendor)(user._id);
        if (existingVendor) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
            const savedResult = yield existingVendor.save();
            return res.json(savedResult);
        }
    }
});
exports.UpdateVendorService = UpdateVendorService;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const files = req.files;
        console.log('files', files);
        const images = files.map((item) => item.filename);
        console.log('images', images);
        const { category, description, foodType, name, price, readyTime } = req.body;
        const vendor = yield (0, AdminController_1.findVendor)(user._id);
        if (vendor) {
            const createdFood = yield model_1.Food.create({
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
            const result = yield vendor.save();
            return res.json(result);
        }
        return res.json({ message: 'no vendor found' });
    }
    return res.json({ message: 'user not found' });
});
exports.AddFood = AddFood;
const GetFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield model_1.Food.find({ vendorId: user._id });
        if (foods) {
            return res.json(foods);
        }
        return res.json({ message: 'No data available' });
    }
    return res.status(400).json({ message: 'user not found' });
});
exports.GetFoods = GetFoods;
const GetCurrentOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const order = yield model_1.Order.find({ vendorId: user._id }).populate('items.food');
        if (order) {
            return res.status(200).json(order);
        }
    }
    return res.status(400).json({ message: 'Error on get order details' });
});
exports.GetCurrentOrders = GetCurrentOrders;
const GetOrderDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    if (orderId) {
        const order = yield model_1.Order.findById(orderId).populate('items.food');
        return res.status(200).json(order);
    }
    return res.status(400).json({ message: 'Order not found' });
});
exports.GetOrderDetails = GetOrderDetails;
const ProcessOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const { status, remarks, time } = req.body;
    if (orderId) {
        const order = yield model_1.Order.findById(orderId);
        if (order) {
            order.orderStatus = status;
            order.remarks = remarks;
            if (time) {
                order.readyTime = time;
            }
            const orderResult = yield order.save();
            return res.status(200).json(orderResult);
        }
    }
    return res.status(400).json({ message: 'Unable to process order' });
});
exports.ProcessOrder = ProcessOrder;
const GetOffers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        let currentOffers = Array();
        const offer = yield model_1.Offer.find().populate('vendors');
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
});
exports.GetOffers = GetOffers;
const AddOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { bank, bins, description, isActive, minValue, offerAmount, offerType, pincode, promoType, promocode, startValidity, title, endValidity } = req.body;
        const vendor = yield (0, AdminController_1.findVendor)(user._id);
        if (vendor) {
            const offer = yield model_1.Offer.create({
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
});
exports.AddOffer = AddOffer;
const EditOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const offerId = req.params.id;
    if (user) {
        const { bank, bins, description, isActive, minValue, offerAmount, offerType, pincode, promoType, promocode, startValidity, title, endValidity } = req.body;
        const currentOffer = yield model_1.Offer.findById(offerId);
        if (currentOffer) {
            const vendor = yield (0, AdminController_1.findVendor)(user._id);
            if (vendor) {
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
                const result = yield currentOffer.save();
                return res.status(200).json(result);
            }
        }
    }
    return res.status(400).json({ message: 'Unable to Edit offer!' });
});
exports.EditOffer = EditOffer;
//# sourceMappingURL=VendorController.js.map