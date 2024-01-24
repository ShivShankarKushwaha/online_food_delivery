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
exports.VeriFyOffer = exports.GetOrderById = exports.GetOrders = exports.CreateOrder = exports.CreatePayment = exports.DeleteCart = exports.GetCart = exports.AddtoCart = exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOtp = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = void 0;
const class_transformer_1 = require("class-transformer");
const dto_1 = require("../dto");
const class_validator_1 = require("class-validator");
const helper_1 = require("../helper");
const model_1 = require("../model");
const model_2 = require("../model");
const CustomerSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInput = (0, class_transformer_1.plainToClass)(dto_1.CreateCustomerInput, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInput, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, password, phone } = customerInput;
    const salt = yield (0, helper_1.GenerateSalt)();
    const userPassword = yield (0, helper_1.hashPassword)(password, salt);
    const { otp, expiry } = (0, helper_1.GenearteOtp)();
    console.log('sent otp', otp);
    const ExistCustomer = yield model_1.Customer.findOne({ email: email });
    if (ExistCustomer) {
        return res.status(300).json({ message: 'User already exist' });
    }
    const result = yield model_1.Customer.create({
        email,
        password: userPassword,
        salt,
        otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        address: '',
        phone,
        verified: false,
        lat: 0,
        lng: 0,
        orders: [],
    });
    if (result) {
        // send the otp to customer
        const responce = yield (0, helper_1.onRequestOtp)(otp, phone);
        console.log(responce);
        // generate the signature
        const signature = yield (0, helper_1.GenerateSignature)({
            _id: result._id,
            email,
            verified: result.verified
        });
        // send the result ot client
        return res.status(200).json({ signature: signature, verified: result.verified, email: result.email });
    }
    return res.status(400).json({ message: 'User not signed Up' });
});
exports.CustomerSignUp = CustomerSignUp;
const CustomerLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(dto_1.UserLoginInputs, req.body);
    const LoginErrors = yield (0, class_validator_1.validate)(loginInputs, { validationError: { target: true } });
    if (LoginErrors.length > 0) {
        return res.status(400).json(LoginErrors);
    }
    const { email, password } = loginInputs;
    const customer = yield model_1.Customer.findOne({ email: email });
    if (customer) {
        const validation = yield (0, helper_1.ValidatePassword)(password, customer.password, customer.salt);
        if (validation) {
            const signature = yield (0, helper_1.GenerateSignature)({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified
            });
            // send the result to client
            return res.status(200).json({ signature: signature, verified: customer.verified, email: customer.email });
        }
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    return res.status(404).json({ message: 'Customer not found' });
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield model_1.Customer.findOne({ _id: customer._id });
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updateCustomerResponce = yield profile.save();
                const signature = yield (0, helper_1.GenerateSignature)({
                    _id: updateCustomerResponce._id,
                    email: updateCustomerResponce.email,
                    verified: updateCustomerResponce.verified
                });
                return res.status(200).json({ signature: signature, verified: updateCustomerResponce.verified, email: updateCustomerResponce.email });
            }
            return res.status(400).json({ message: 'invalid otp' });
        }
        return res.status(400).json({ message: 'user not found' });
    }
    return res.status(400).json({ message: 'Customer not found' });
});
exports.CustomerVerify = CustomerVerify;
const RequestOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield model_1.Customer.findOne({ _id: customer._id });
        if (profile) {
            const { otp, expiry } = (0, helper_1.GenearteOtp)();
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            yield (0, helper_1.onRequestOtp)(otp, profile.phone);
            return res.status(200).json({ message: 'otp sent to your registered phone number' });
        }
    }
    return res.status(400).json({ message: 'Error on request otp' });
});
exports.RequestOtp = RequestOtp;
const GetCustomerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield model_1.Customer.findOne({ _id: customer._id });
        if (profile) {
            return res.status(200).json(profile);
        }
    }
    return res.status(400).json({ message: 'Error on get profile' });
});
exports.GetCustomerProfile = GetCustomerProfile;
const EditCustomerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const profileInputs = (0, class_transformer_1.plainToClass)(dto_1.EditCustomerProfileInputs, req.body);
    const profileErrors = yield (0, class_validator_1.validate)(profileInputs, { validationError: { target: true } });
    if (profileErrors.length > 0) {
        return res.status(400).json(profileErrors);
    }
    const { firstName, lastName, address } = profileInputs;
    if (customer) {
        const profile = yield model_1.Customer.findOne({ _id: customer._id });
        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = yield profile.save();
            return res.status(200).json(result);
        }
    }
    return res.status(400).json({ message: 'Error on edit profile' });
});
exports.EditCustomerProfile = EditCustomerProfile;
/******************************* Cart Section ************************************/
const AddtoCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield (yield model_1.Customer.findOne({ _id: customer._id })).populate('cart.food');
        let cartItems = Array();
        if (profile) {
            const { _id, unit } = req.body;
            const food = yield model_1.Food.findById(_id);
            console.log('food', food);
            if (food) {
                cartItems = profile.cart;
                if (cartItems.length > 0) {
                    let existedFood = cartItems.filter((item) => item.food._id.toString() == _id);
                    if (existedFood.length > 0) {
                        const index = cartItems.indexOf(existedFood[0]);
                        if (unit > 0) {
                            cartItems[index] = { food, unit };
                        }
                        else {
                            cartItems.splice(index, 1);
                        }
                    }
                    else {
                        cartItems.push({ food, unit });
                    }
                }
                else {
                    cartItems.push({ food, unit });
                }
                if (cartItems) {
                    profile.cart = cartItems;
                    const result = yield profile.save();
                    return res.status(200).json(result.cart);
                }
            }
        }
    }
    return res.status(400).json({ message: 'Error on add to cart' });
});
exports.AddtoCart = AddtoCart;
const GetCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield (yield model_1.Customer.findOne({ _id: customer._id })).populate('cart.food');
        if (profile) {
            return res.status(200).json(profile.cart);
        }
    }
    return res.status(400).json({ message: 'Cart is empty' });
});
exports.GetCart = GetCart;
const DeleteCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield (yield model_1.Customer.findOne({ _id: customer._id })).populate('cart.food');
        if (profile) {
            profile.cart = [];
            const cartResult = yield profile.save();
            return res.status(200).json(cartResult);
        }
    }
    return res.status(400).json({ message: 'Cart is already empty' });
});
exports.DeleteCart = DeleteCart;
/*************************** create payment******************************/
const CreatePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const { amount, paymentMode, offerId } = req.body;
    let payableAmount = Number(amount);
    if (offerId) {
        const appliedOffer = yield model_1.Offer.findById(offerId);
        if (appliedOffer && appliedOffer.isActive) {
            payableAmount = payableAmount - appliedOffer.offerAmount;
        }
    }
    // perform Payment gateway charge api call
    // right after payment gateway success / failure response
    // create record on transaction
    const transaction = yield model_1.Transaction.create({
        customer: customer._id,
        vendorId: '',
        orderId: '',
        orderValue: payableAmount,
        offerUsed: offerId || 'NA',
        status: 'OPEN',
        paymentMode,
        paymentResponse: 'Payment is Cash on Delivery',
    });
    // return transaction ID
    return res.status(200).json(transaction);
});
exports.CreatePayment = CreatePayment;
/*************************** Delivery Notification ******************************/
const assignOrderForDelivery = (orderId, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    // find the vendor
    // find the available delivery person
    // check the nearest delivery person and assign the order
    // update deliveryId
});
/******************************** Order Section ***********************************/
const ValidateTransaction = (txnId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentTransaction = yield model_1.Transaction.findById(txnId);
    if (currentTransaction) {
        if (currentTransaction.status.toLowerCase() !== 'failed') {
            return { status: true, currentTransaction };
        }
        return { status: false, currentTransaction };
    }
});
const CreateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // grab current customer login
    const customer = req.user;
    const { amount, items, txnId } = req.body;
    if (customer) {
        //  validate transaction
        const { status, currentTransaction } = yield ValidateTransaction(txnId);
        if (!status) {
            return res.status(400).json({ message: 'Error with create order' });
        }
        // create an order id
        const orderId = `${Math.floor(Math.random() * 8999) + 1000}`;
        const profile = yield model_1.Customer.findOne({ _id: customer._id });
        // grab order items from request
        let cartItems = Array();
        let netAmount = 0;
        let vendorId;
        // calculate order amount
        const foods = yield model_1.Food.find().where('_id').in(items.map((item) => item._id)).exec();
        foods.map((food) => {
            items.map(({ _id, unit }) => {
                if (food.id == _id) {
                    vendorId = food.vendorId;
                    netAmount += food.price * unit;
                    cartItems.push({ food, unit });
                }
            });
        });
        // create item with order description
        if (cartItems) {
            // create order
            const currentOrder = yield model_2.Order.create({
                OrderId: orderId,
                vendorId: vendorId,
                items: cartItems,
                totalAmount: netAmount,
                paidAmount: amount,
                OrderDate: new Date(),
                paidThrough: 'COD',
                paymentResponse: '',
                orderStatus: 'Waiting',
                remarks: '',
                deliveryId: '',
                appliedOffers: false,
                offerId: null,
                readyTime: 45
            });
            // Finally update orders to user account
            if (currentOrder) {
                profile.cart = [];
                profile.orders.push(currentOrder.id);
                currentTransaction.vendorId = vendorId;
                currentTransaction.orderId = orderId;
                currentTransaction.status = 'CONFIRMED';
                yield currentTransaction.save();
                // assign order for delivery
                assignOrderForDelivery(currentOrder._id.toString(), vendorId);
                const profileResponse = yield profile.save();
                return res.status(200).json(currentOrder);
            }
        }
    }
    return res.status(400).json({ message: 'Error with order creation' });
});
exports.CreateOrder = CreateOrder;
const GetOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const profile = yield (yield model_1.Customer.findById(user._id)).populate('orders');
        if (profile) {
            return res.status(200).json(profile.orders);
        }
    }
    return res.status(400).json({ message: 'Error on get orders' });
});
exports.GetOrders = GetOrders;
const GetOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    if (orderId) {
        const order = yield model_2.Order.findById(orderId).populate('items.food');
        return res.status(200).json(order);
    }
});
exports.GetOrderById = GetOrderById;
const VeriFyOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const offerId = req.params.id;
    const customer = req.user;
    if (customer) {
        const appliedOffer = yield model_1.Offer.findById(offerId);
        if (appliedOffer) {
            if (appliedOffer.isActive) {
                if (appliedOffer.promoType === 'USER') {
                }
                else {
                    return res.status(200).json({ message: 'Offer is valid', offer: appliedOffer });
                }
            }
            return res.status(300).json({ message: 'Offer expired' });
        }
    }
    return res.status(400).json({ message: 'Offer is not valid' });
});
exports.VeriFyOffer = VeriFyOffer;
//# sourceMappingURL=CustomerController.js.map