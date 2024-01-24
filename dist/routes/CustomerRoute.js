"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.CustomerRoute = router;
/****************** SignUp/ create account*********************/
router.post('/signup', controllers_1.CustomerSignUp);
/****************** Login*********************/
router.post('/login', controllers_1.CustomerLogin);
/****************** Authentication *******************************/
router.use(middlewares_1.Authenticate);
/****************** Verify Customer Account *********************/
router.patch('/verify', controllers_1.CustomerVerify);
/****************** Otp/ Requesting Otp*********************/
router.get('/otp', controllers_1.RequestOtp);
/****************** Profile*********************/
router.get('/profile', controllers_1.GetCustomerProfile);
/****************** Update Profile*********************/
router.patch('/profile', controllers_1.EditCustomerProfile);
// Cart
router.post("/cart", controllers_1.AddtoCart);
router.get("/cart", controllers_1.GetCart);
router.delete("/cart", controllers_1.DeleteCart);
// Apply offers
router.get('/offer/verify/:id', controllers_1.VeriFyOffer);
// Payment
router.post("/create-payment", controllers_1.CreatePayment);
// Order
router.post("/create-order", controllers_1.CreateOrder);
router.get("/orders", controllers_1.GetOrders);
router.get("/order/:id", controllers_1.GetOrderById);
//# sourceMappingURL=CustomerRoute.js.map