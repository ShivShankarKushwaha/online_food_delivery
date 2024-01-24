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
exports.GetTransactions = exports.GetTransactionById = exports.GetVendorById = exports.GetVendors = exports.createVendor = exports.findVendor = void 0;
const model_1 = require("../model");
const helper_1 = require("../helper");
const findVendor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield model_1.Vendor.findOne({ email });
    }
    return yield model_1.Vendor.findById(id);
});
exports.findVendor = findVendor;
const createVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, email, foodType, ownerName, password, phone, pincode } = req.body;
    const existVendor = yield (0, exports.findVendor)(undefined, email);
    if (existVendor) {
        return res.json({ message: 'vendor already exist' });
    }
    // generate a salt
    const salt = yield (0, helper_1.GenerateSalt)();
    // generate a password hash with salt
    const hashedPassword = yield (0, helper_1.hashPassword)(password, salt);
    // create a vendor
    const createVendor = yield model_1.Vendor.create({
        name, address, email, foodType, ownerName, password: hashedPassword, phone, pincode, rating: 0, salt: salt, serviceAvailable: false, coverImages: [], foods: [], lat: 0, lng: 0
    });
    return res.json(createVendor);
});
exports.createVendor = createVendor;
const GetVendors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield model_1.Vendor.find();
    if (vendors) {
        return res.json(vendors);
    }
    return res.json({ message: 'no vendor found' });
});
exports.GetVendors = GetVendors;
const GetVendorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorId = req.params.id;
    const vendor = yield (0, exports.findVendor)(vendorId);
    if (vendor) {
        return res.json(vendor);
    }
    return res.json({ message: 'Vendor data not available' });
});
exports.GetVendorById = GetVendorById;
const GetTransactionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const txnId = req.params.id;
    const transaction = yield model_1.Transaction.findById(txnId);
    if (transaction) {
        return res.json(transaction);
    }
    return res.json({ message: 'transaction data not available' });
});
exports.GetTransactionById = GetTransactionById;
const GetTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield model_1.Transaction.find();
    if (transaction) {
        return res.json(transaction);
    }
    return res.json({ message: 'transaction data not available' });
});
exports.GetTransactions = GetTransactions;
//# sourceMappingURL=AdminController.js.map