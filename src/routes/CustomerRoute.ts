import express from 'express'
import { AddtoCart, CreateOrder, CreatePayment, CustomerLogin, CustomerSignUp, CustomerVerify, DeleteCart, EditCustomerProfile, GetCart, GetCustomerProfile, GetOrderById, GetOrders, RequestOtp, VeriFyOffer } from '../controllers';
import { Authenticate } from '../middlewares';

const router = express.Router();

/****************** SignUp/ create account*********************/
router.post('/signup',CustomerSignUp)

/****************** Login*********************/
router.post('/login',CustomerLogin)

/****************** Authentication *******************************/
router.use(Authenticate)

/****************** Verify Customer Account *********************/
router.patch('/verify',CustomerVerify)

/****************** Otp/ Requesting Otp*********************/
router.get('/otp',RequestOtp)

/****************** Profile*********************/
router.get('/profile',GetCustomerProfile)

/****************** Update Profile*********************/
router.patch('/profile',EditCustomerProfile)

// Cart
router.post("/cart",AddtoCart)
router.get("/cart",GetCart)
router.delete("/cart",DeleteCart)

// Apply offers
router.get('/offer/verify/:id', VeriFyOffer)


// Payment
router.post("/create-payment",CreatePayment)

// Order
router.post("/create-order",CreateOrder)
router.get("/orders",GetOrders)
router.get("/order/:id",GetOrderById)

// Review



export {router as CustomerRoute}